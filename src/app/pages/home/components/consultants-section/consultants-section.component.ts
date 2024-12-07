import { SwiperOptions } from 'swiper/types';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BaseService } from '../../../../shared/services/Base/base.service';
import { IPaginationResult } from '../../../../shared/models/interfaces/PaginationResult';
import { SharedModule } from '../../../../shared/shared.module';
import { ConsultantDto } from '../../../../shared/models/interfaces/Doctor';
import { environment } from '../../../../../environments/environment';
import { ConsultantTypes } from '../../../../shared/enums/ConsultantTypes ';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-consultants-section',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './consultants-section.component.html',
  styleUrls: ['./consultants-section.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConsultantsSectionComponent implements OnInit {
  @ViewChild('consultantsSwiper') swiperContainer!: ElementRef;

  imageUrl = environment.imageUrl;
  allConsultants: ConsultantDto[] = [];
  Consultants: ConsultantDto[] = [];
  loading = true;
  error = false;
  selectedType: number = 0;
  ConsultantTypes = ConsultantTypes;
  consultantTypes = [
    { value: 0, name: 'All' },
    { value: ConsultantTypes.Doctor, name: 'Doctor' },
    { value: ConsultantTypes.Coach, name: 'Coach' },
    { value: ConsultantTypes.CosmeticSpecialist, name: 'Cosmetic Specialist' },
    { value: ConsultantTypes.Nutritionist, name: 'Nutritionist' },
    { value: ConsultantTypes.PhysioTherapist, name: 'Physiotherapist' },
  ];

  constructor(
    public baseService: BaseService,
    private cdr: ChangeDetectorRef
  ) {}
  private unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.loadConsultants();
  }

  loadConsultants(): void {
    const url = `Consultations/consultants`;
    this.baseService
      .getAll<ConsultantDto>(url)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (result: IPaginationResult<ConsultantDto>) => {
          this.allConsultants = result.data || [];
          this.applyFilter();
          this.loading = false;
          this.cdr.detectChanges();
          this.initializeSwiper();
        },
        error: () => {
          this.error = true;
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  applyFilter(): void {
    this.Consultants =
      this.selectedType == 0
        ? this.allConsultants
        : this.allConsultants.filter(
            (consultant) => consultant.type == this.selectedType
          );

    this.cdr.detectChanges();
    this.initializeSwiper();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initializeSwiper(): void {
    if (this.swiperContainer) {
      const swiperElement = this.swiperContainer.nativeElement;
      Object.assign(swiperElement, this.config);
      swiperElement.initialize();
    }
  }

  config: SwiperOptions = {
    spaceBetween: 20,
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 10 },
      480: { slidesPerView: 2, spaceBetween: 15 },
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 2.5, spaceBetween: 25 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
      1280: { slidesPerView: 4, spaceBetween: 40 },
    },
    observer: true,
    navigation: {
      nextEl: '.Consultant-button-next',
      prevEl: '.Consultant-button-prev',
    },
  };
}
