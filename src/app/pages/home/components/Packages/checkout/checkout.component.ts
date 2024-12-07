import { Endpoints } from './../../../../../shared/models/classes/ProductType';
import { Direction } from '@angular/cdk/bidi';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, firstValueFrom } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import {
  BreadcrumbComponent,
  Breadcrumb,
} from '../../../../../shared/breadcrumb/breadcrumb.component';
import { AddAddressComponent } from '../../../../../shared/components/AddAddress/AddAddress.component';
import { ConfirmStatusComponent } from '../../../../../shared/components/confirm-status/confirm-status.component';
import { CreateProfileComponent } from '../../../../../shared/components/CreateProfile/CreateProfile.component';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { PaymentComponent } from '../../../../../shared/components/payment/payment.component';
import { APIConstant } from '../../../../../shared/constant/APIConstant';
import { LookupViewModel } from '../../../../../shared/models/classes/LookupViewModel';
import { AddressViewModel } from '../../../../../shared/models/interfaces/Address';
import { ClientViewModel } from '../../../../../shared/models/interfaces/Client';
import { CouponViewModel } from '../../../../../shared/models/interfaces/Coupon';
import { OrderPaymentDto } from '../../../../../shared/models/interfaces/Order';
import { BaseService } from '../../../../../shared/services/Base/base.service';
import { LanguageService } from '../../../../../shared/services/Language/LanguageService';
import { TimeConversionService } from '../../../../../shared/services/TimeConversion/time-conversion.service';
import { SharedModule } from '../../../../../shared/shared.module';
import {
  PackageDetails,
  PackageProfessional,
} from '../../../../../shared/models/interfaces/Package';
import {
  AvailableTimesViewModel,
  AvailableTimesWithTypeViewModel,
} from '../../../../../shared/models/interfaces/AvailableTimes';
import { ConsultantTypes } from '../../../../../shared/enums/ConsultantTypes ';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    SharedModule,
    MatFormFieldModule,
    MatSelectModule,
    LoadingComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  imageUrl = environment.imageUrl;
  id: number;
  coupon: CouponViewModel | null = null;
  couponCodeControl = new FormControl('');
  Package: PackageDetails | null = null;
  breadcrumbs: Breadcrumb[] = [];
  readonly dialog = inject(MatDialog);
  timeOptions: string[] = [];

  clientList: ClientViewModel[] = [];
  AvailableTimes: AvailableTimesWithTypeViewModel[] = [];

  addresses: AddressViewModel[] = [];
  paymentTypes: LookupViewModel[] = [];
  appointmentForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  vat: number = 0;
  couponApplied: boolean = false;
  couponError: boolean = false;
  today: Date;
  couponSubscription: Subscription = new Subscription();
  constructor(
    public baseService: BaseService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private languageService: LanguageService,
    private time: TimeConversionService
  ) {
    this.today = new Date();
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    this.languageService.currentLanguage$.subscribe(() => {
      this.timeOptions = this.getFormattedTimes();
    });

    try {
      this.setBreadcrumbs();
      await Promise.all([
        this.loadPackage(),
        this.loadAddresses(),
        this.loadProfiles(),
        this.loadPaymentTypes(),
      ]);
      this.initializeForm();
    } catch (error) {
      this.router.navigateByUrl('/');
    } finally {
      this.isLoading = false;
    }
    this.couponSubscription = this.couponCodeControl.valueChanges.subscribe(
      (value) => {
        if (!value) {
          this.resetCouponState();
        } else {
          this.couponApplied = false;
          this.couponError = false;
        }
      }
    );
    this.couponCodeControl.valueChanges.subscribe((value) => {
      this.appointmentForm.get('coupon')?.setValue(value, { emitEvent: false });
      if (!this.couponCodeControl.value) {
        this.coupon = null;
      }
    });
  }

  removeCoupon(): void {
    this.resetCouponState();
    this.couponCodeControl.reset();
  }
  private resetCouponState(): void {
    this.couponApplied = false;
    this.couponError = false;
  }

  private async loadPackage(): Promise<void> {
    try {
      this.Package = await firstValueFrom(
        this.baseService.getById<PackageDetails>(`Packages/${this.id}`)
      );
    } catch (error) {
      this.router.navigate(['/', this.baseService.currentLanguage, '/Home']);
    }
  }

  private async loadProfiles(): Promise<void> {
    try {
      this.clientList =
        (await firstValueFrom(
          this.baseService.getLookup<ClientViewModel>(
            `Clients/Profiles?getMainUser=true`
          )
        )) || [];
    } catch (error) {}
  }

  private async loadAddresses(): Promise<void> {
    try {
      this.addresses =
        (await firstValueFrom(
          this.baseService.getLookup<AddressViewModel>(
            `${APIConstant.Addresses}`
          )
        )) || [];
    } catch (error) {
      this.baseService.navigateToPage('/');
    }
  }

  private async loadPaymentTypes(): Promise<void> {
    try {
      this.paymentTypes =
        (await firstValueFrom(
          this.baseService.getLookup<LookupViewModel>(
            'Lookups?tableName=PaymentsTypes'
          )
        )) || [];
    } catch (error) {}
  }

  get calculatedVAT(): number {
    let VAT = 0.0;
    const selectedClientId = this.appointmentForm.get('clientId')?.value;
    const selectedClient = this.clientList.find(
      (client) => client.id == selectedClientId
    );

    if (selectedClient?.nationality?.id !== 192) {
      VAT = 0.15;
    } else {
      VAT = 0;
    }
    const fees = this.appointmentForm.get('Fees')?.value || 0;
    const discount = this.getDiscount() || 0;
    const newPrice = this.coupon?.newPrice || 0;
    if (discount > 0) {
      return newPrice * VAT;
    } else {
      return fees * VAT;
    }
  }

  get totalAmount(): number {
    const fees = this.appointmentForm.get('Fees')?.value || 0;
    const vat = this.calculatedVAT;
    const discount = this.getDiscount() || 0;

    if (discount > 0) {
      const newPrice = this.coupon?.newPrice ?? 0;
      return newPrice + vat;
    } else {
      return fees + vat;
    }
  }

  getDiscount(): number {
    return this.coupon?.discountAmount ?? 0;
  }
  applyCoupon(): void {
    const clientId = this.appointmentForm.get('clientId')?.value;
    if (this.couponCodeControl && this.id && clientId) {
      this.baseService
        .getModel<CouponViewModel>(
          `Coupons/Apply?code=${this.couponCodeControl.value}&itemId=${
            this.id
          }&clientId=${clientId}&itemType=${'Package'}`
        )
        .subscribe({
          next: (response: CouponViewModel) => {
            this.coupon = response;
            this.couponApplied = true;
            this.couponError = false;
          },
          error: (err) => {
            this.couponError = true;
            this.couponApplied = true;
          },
          complete: () => {},
        });
    }
  }
  private positiveIdValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      return value !== null && value > 0 ? null : { positiveId: true };
    };
  }

  private getFormattedTimes(): string[] {
    const times: string[] = [];
    const now = new Date();
    let selectedDate = this.appointmentForm.get('selectedDate')?.value;

    if (!selectedDate) {
      selectedDate = new Date();
    }

    const selected = new Date(selectedDate);
    const isToday = selected.toDateString() === now.toDateString();
    const startTime = new Date();

    if (isToday) {
      const currentHour = now.getHours();
      if (currentHour < 12) {
        startTime.setHours(12, 0, 0, 0);
      } else if (currentHour < 15) {
        startTime.setHours(15, 0, 0, 0);
      } else if (currentHour < 18) {
        startTime.setHours(18, 0, 0, 0);
      } else {
        return [];
      }
    } else {
      startTime.setHours(12, 0, 0, 0);
    }

    for (let i = startTime.getHours(); i < 21; i += 3) {
      const formattedTime = this.formatTime(i);
      times.push(formattedTime);
    }
    this.appointmentForm.get('selectedTime')?.setValue(times[0]);

    return times;
  }

  private formatTime(hour: number): string {
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = isPM ? 'PM' : 'AM';
    return `${formattedHour}:00 ${period}`;
  }

  public formatTimeRange(time: string): string {
    const startHour = this.parseTime(time);
    const endHour = new Date(startHour.getTime());
    endHour.setHours(endHour.getHours() + 3);
    const startHourFormatted = this.getFormattedHour(startHour);
    const endHourFormatted = this.getFormattedHour(endHour);

    if (this.baseService.currentLanguage === 'ar') {
      return `${startHourFormatted} - ${endHourFormatted}`;
    } else {
      return `${startHourFormatted} - ${endHourFormatted}`;
    }
  }

  private getFormattedHour(date: Date): string {
    const hour = date.getHours();
    const isPM = hour >= 12;
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = isPM
      ? this.baseService.currentLanguage === 'ar'
        ? 'م'
        : 'PM'
      : this.baseService.currentLanguage === 'ar'
      ? 'ص'
      : 'AM';

    return `${formattedHour}:00 ${period}`;
  }

  private parseTime(time: string): Date {
    const [hourString, period] = time.split(' ');
    let hour = parseInt(hourString.split(':')[0], 10);
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date;
  }

  onSubmit(): void {
    this.isSubmitting = true;
    console.log(this.appointmentForm);

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      const firstInvalidControl = document.querySelector('.ng-invalid');
      if (firstInvalidControl) {
        (firstInvalidControl as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      this.isSubmitting = false;
      return;
    }

    this.baseService
      .create(
        `${APIConstant.Orders}/CreatePackageOrder`,
        this.appointmentForm.value
      )
      .subscribe({
        next: (order: OrderPaymentDto) => {
          if (order.paymentTypeId == 1) {
            this.pay(order);
          } else {
            this.openSuccessDialog();
          }
        },
        error: (err) => {
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
  }

  addAddress(): void {
    const dialogRef = this.dialog.open(AddAddressComponent, {
      width: '1200px',
      height: '700px',
      direction: document.body.style.direction as Direction,
      backdropClass: 'custom-dialog-backdrop',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadAddresses();
    });
  }

  pay(order: OrderPaymentDto) {
    let callbackUrl;
    callbackUrl = `${environment.Website_URL}${this.baseService.currentLanguage}/userdashboard/orders`;
    const dialogRef = this.dialog.open(PaymentComponent, {
      width: '700px',
      data: {
        amount: order.remainingPaymentAmount,
        description: 'O' + order.id,
        callbackUrl: callbackUrl,
      },
      backdropClass: 'custom-dialog-backdrop',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  openSuccessDialog() {
    let actionButtonLink = '/userdashboard/orders';

    const dialogRef = this.dialog.open(ConfirmStatusComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        isSuccess: true,
        message: 'Your order has been added successfully',
        description:
          'You will be contacted by one of our representatives soon.',
        homeLink: '/',
        homeButtonText: 'Home',
        actionButtonlink: actionButtonLink,
        actionButtonText: 'View Order',
        CancelButtonText: 'Cancel',
        ConfirmButtonText: 'Confirm',
      },
      backdropClass: 'custom-dialog-backdrop',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  addProfile() {
    const dialogRef = this.dialog.open(CreateProfileComponent, {
      width: '700px',
      maxHeight: '480px',
      direction: document.body.style.direction as Direction,
      backdropClass: 'custom-dialog-backdrop',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadProfiles();
    });
  }

  private setBreadcrumbs(): void {
    this.breadcrumbs = [
      { label: 'Home', url: '/' },
      { label: 'Package', url: '/' },
      { label: 'Checkout', url: '', last: true },
    ];
  }

  updateConsultationDateTime(): void {
    const selectedDate = this.appointmentForm.get('selectedDate')?.value;
    const selectedTime = this.appointmentForm.get('selectedTime')?.value;
    if (selectedDate && selectedTime) {
      const consultationDateTime = new Date(selectedDate);
      const timeParts = selectedTime.split(':');
      let hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const isPM = selectedTime.toLowerCase().includes('pm');
      if (isPM && hours < 12) {
        hours += 12;
      } else if (!isPM && hours === 12) {
        hours = 0;
      }
      consultationDateTime.setHours(hours, minutes);
      const newDate = this.time.convertLocalDateTimeToUtc(consultationDateTime);
      this.appointmentForm.patchValue({ visitingDateTime: newDate });
    }
  }

  private initializeForm(): void {
    this.appointmentForm = this.fb.group({
      clientId: [
        this.clientList[0]?.id || null,
        [Validators.required, this.positiveIdValidator()],
      ],
      paymentTypeId: [
        this.paymentTypes[0]?.id || null,
        [Validators.required, this.positiveIdValidator()],
      ],
      selectedTime:
        this.Package != null
          ? [this.timeOptions[0] || null, Validators.required]
          : [null],
      selectedDate:
        this.Package != null
          ? [
              [
                new Date().getFullYear(),
                String(new Date().getMonth() + 1).padStart(2, '0'),
                String(new Date().getDate()).padStart(2, '0'),
              ].join('-') || null,
              Validators.required,
            ]
          : [null],
      coupon: [this.couponCodeControl.value],
      PackageId: [this.id, [Validators.required, this.positiveIdValidator()]],
      addressId: [
        this.addresses[0]?.id || null,
        [Validators.required, this.positiveIdValidator()],
      ],
      Fees: [this.Package != null ? this.Package?.price : null],
      contactNumber: [
        null,
        [Validators.required, Validators.pattern('^[0-9]{10,15}$')],
      ],
      visitingDateTime: [null],
      Note: [null],
      pacakgeConsultants: this.fb.array([]),
    });
    this.timeOptions = this.getFormattedTimes();
    this.initializeConsultants(this.Package?.packageProfessionals ?? []);
    this.updateConsultationDateTime();
    this.appointmentForm.get('selectedDate')?.valueChanges.subscribe((date) => {
      if (date) {
        const localDate = new Date(date);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        this.appointmentForm
          .get('selectedDate')
          ?.setValue(formattedDate, { emitEvent: false });
        this.timeOptions = this.getFormattedTimes();
        this.updateConsultationDateTime();
      }
    });

    this.appointmentForm.get('selectedTime')?.valueChanges.subscribe(() => {
      this.updateConsultationDateTime();
    });
  }

  private getDateByIdAndType(consultantId: number, consultantType: number) {
    for (let i = 0; i < this.pacakgeConsultants.length; i++) {
      const control = this.pacakgeConsultants.at(i);
      const type = control.get('consultantType')?.value;
      const id = control.get('consultantId')?.value;

      if (type === consultantType && id === consultantId) {
        control.get('date')?.valueChanges.subscribe((date) => {
          if (date) {
            const localDate = new Date(date);
            const year = localDate.getFullYear();
            const month = String(localDate.getMonth() + 1).padStart(2, '0');
            const day = String(localDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            control.get('date')?.setValue(formattedDate, { emitEvent: false });
            this.getAvailableTimes(id, type, formattedDate);
            control.get('time')?.setValue(null);
          }
        });
        control.get('time')?.valueChanges.subscribe((time) => {
          if (time) {
            const selectedDate = control.get('date')?.value;
            if (selectedDate && time) {
              const consultationDateTime = new Date(selectedDate);
              const timeParts = time.split(':');
              let hours = parseInt(timeParts[0], 10);
              const minutes = parseInt(timeParts[1], 10);
              const isPM = time.toLowerCase().includes('pm');
              if (isPM && hours < 12) {
                hours += 12;
              } else if (!isPM && hours === 12) {
                hours = 0;
              }
              consultationDateTime.setHours(hours, minutes);
              const newDate =
                this.time.convertLocalDateTimeToUtc(consultationDateTime);
              control.patchValue({ visitingDateTime: newDate });
            }
          }
        });
      }
    }
  }

  public getFilteredAvailableTimes(
    id: number,
    type: number,
    date: any
  ): string[] {
    const entry = this.AvailableTimes.find(
      (item) =>
        item.id === id && item.type === type && item.SelectedDate === date
    );
    return entry ? entry.availableTimes : [];
  }

  private getAvailableTimes(
    id: number,
    type: number,
    date: any
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingIndex = this.AvailableTimes.findIndex(
        (entry) =>
          entry.id === id && entry.type === type && entry.SelectedDate === date
      );

      if (existingIndex !== -1) {
        resolve();
        return;
      }
      const Endpoints =
        type === ConsultantTypes.Doctor
          ? 'Doctors'
          : type === ConsultantTypes.Coach
          ? 'Coaches'
          : type === ConsultantTypes.Nutritionist
          ? 'Nutritionist'
          : type === ConsultantTypes.PhysioTherapist
          ? 'PhysioTherapists'
          : type === ConsultantTypes.CosmeticSpecialist
          ? 'CosmeticSpecialist'
          : '';

      this.baseService
        .getById<AvailableTimesViewModel>(
          `${Endpoints}/available-times/${id}?specificDate=${encodeURIComponent(
            date
          )}`
        )
        .subscribe({
          next: (result) => {
            const newEntry = {
              id: result.id,
              availableTimes: result.availableTimes.map((time: string) =>
                this.time.convertUtcTimeToLocal(time)
              ),
              type: type,
              SelectedDate: date,
            };
            this.AvailableTimes.push(newEntry);
            resolve();
          },
          error: (error) => {
            console.error('Error loading available-times:', error);
            reject(error);
          },
        });
    });
  }

  get pacakgeConsultants(): FormArray {
    return this.appointmentForm.get('pacakgeConsultants') as FormArray;
  }

  private initializeConsultants(professionals: PackageProfessional[]): void {
    professionals.forEach((professional) => {
      const consultantType = this.getConsultantType(professional);
      const consultantId = this.getConsultantId(professional);

      if (consultantType && consultantId) {
        const consultantForm = this.fb.group({
          consultantType: [consultantType, Validators.required],
          consultantId: [consultantId, Validators.required],
          visitingDateTime: [null, Validators.required],
          time: [null as string | null, Validators.required],
          date: [
            [
              new Date().getFullYear(),
              String(new Date().getMonth() + 1).padStart(2, '0'),
              String(new Date().getDate()).padStart(2, '0'),
            ].join('-') || null,
            Validators.required,
            ,
            Validators.required,
          ],
        });

        this.pacakgeConsultants.push(consultantForm);
        this.getAvailableTimes(
          this.getConsultantId(professional) ?? 0,
          this.getConsultantType(professional) ?? 0,
          consultantForm.get('date')?.value
        ).then(() => {
          const availableTimes = this.getFilteredAvailableTimes(
            this.getConsultantId(professional) ?? 0,
            this.getConsultantType(professional) ?? 0,
            consultantForm.get('date')?.value
          );

          if (availableTimes.length > 0) {
            const firstAvailableTime = availableTimes[0];
            consultantForm.get('time')?.setValue(firstAvailableTime);
          }
        });

        this.getDateByIdAndType(
          this.getConsultantId(professional) ?? 0,
          this.getConsultantType(professional) ?? 0
        );
      }
    });
  }

  private getConsultantType(professional: PackageProfessional): number | null {
    if (professional.doctorId) return ConsultantTypes.Doctor;
    if (professional.coachId) return ConsultantTypes.Coach;
    if (professional.cosmeticSpecialistId)
      return ConsultantTypes.CosmeticSpecialist;
    if (professional.nutritionistId) return ConsultantTypes.Nutritionist;
    if (professional.physioTherapistId) return ConsultantTypes.PhysioTherapist;
    return null;
  }

  private getConsultantId(professional: PackageProfessional): number | null {
    return (
      professional.doctorId ??
      professional.coachId ??
      professional.cosmeticSpecialistId ??
      professional.nutritionistId ??
      professional.physioTherapistId ??
      null
    );
  }
  getProfessionalName(
    consultantId: number,
    consultantType: number
  ): { nameEn: string; nameAr: string } {
    const professional = this.Package?.packageProfessionals.find((prof) => {
      if (
        consultantType === ConsultantTypes.Doctor &&
        prof.doctorId === consultantId
      )
        return true;
      if (
        consultantType === ConsultantTypes.Coach &&
        prof.coachId === consultantId
      )
        return true;
      if (
        consultantType === ConsultantTypes.CosmeticSpecialist &&
        prof.cosmeticSpecialistId === consultantId
      )
        return true;
      if (
        consultantType === ConsultantTypes.Nutritionist &&
        prof.nutritionistId === consultantId
      )
        return true;
      if (
        consultantType === ConsultantTypes.PhysioTherapist &&
        prof.physioTherapistId === consultantId
      )
        return true;
      return false;
    });
    if (professional) {
      switch (consultantType) {
        case ConsultantTypes.Doctor:
          return {
            nameEn: professional.doctor?.nameEn || 'Doctor Name',
            nameAr: professional.doctor?.nameAr || 'اسم الطبيب',
          };
        case ConsultantTypes.Coach:
          return {
            nameEn: professional.coach?.nameEn || 'Coach Name',
            nameAr: professional.coach?.nameAr || 'اسم المدرب',
          };
        case ConsultantTypes.CosmeticSpecialist:
          return {
            nameEn:
              professional.cosmeticSpecialist?.nameEn ||
              'Cosmetic Specialist Name',
            nameAr:
              professional.cosmeticSpecialist?.nameAr ||
              'اسم الاختصاصي التجميلي',
          };
        case ConsultantTypes.Nutritionist:
          return {
            nameEn: professional.nutritionist?.nameEn || 'Nutritionist Name',
            nameAr: professional.nutritionist?.nameAr || 'اسم أخصائي التغذية',
          };
        case ConsultantTypes.PhysioTherapist:
          return {
            nameEn:
              professional.physioTherapist?.nameEn || 'Physiotherapist Name',
            nameAr:
              professional.physioTherapist?.nameAr ||
              'اسم أخصائي العلاج الطبيعي',
          };
        default:
          return { nameEn: 'Unknown Professional', nameAr: 'محترف غير معروف' };
      }
    }
    return { nameEn: 'Professional Not Found', nameAr: 'المحترف غير موجود' };
  }
}
