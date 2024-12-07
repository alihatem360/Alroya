import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BaseService } from '../../services/Base/base.service';
import { APIConstant } from '../../constant/APIConstant';
import { IPostResponse } from '../../models/interfaces/Response';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LookupViewModel } from '../../models/classes/LookupViewModel';
import { SharedModule } from '../../shared.module';
import { ClientViewModel } from '../../models/interfaces/Client';
import { ClientService } from '../../services/Client/client.service';
import { environment } from '../../../../environments/environment';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';

@Component({
  selector: 'app-create-profile',
  templateUrl: './CreateProfile.component.html',
  styleUrls: ['./CreateProfile.component.scss'],
  standalone: true,
  imports: [
    SharedModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
NgxIntlTelInputModule,

  ],
})
export class CreateProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading: boolean = false;
  message?: string | null = null;
  languages: LookupViewModel[] | null = null;
  nationalities: LookupViewModel[] | null = null;
  relationships: LookupViewModel[] | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  newImage: File | null = null;
  imageUrl = environment.imageUrl;
  id: number | null | undefined;
  client: ClientViewModel | null = null;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @Output() profileUpdated = new EventEmitter<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public baseService: BaseService,
    private fb: FormBuilder,
    private clientService: ClientService,
    private dialogRef: MatDialogRef<CreateProfileComponent>
  ) {
    if (this.data && this.data.id) {
      this.id = this.data.id;
    }
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      idNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      isMale: [true],
      nationalityId: [null, Validators.required],
      languageId: [null, Validators.required],
      relationshipId: [null, Validators.required],
      birthDate: ['', Validators.required],
      phone : ['', [Validators.required]]
    });

    this.loadLookups();
    if (this.id) {
      this.loadProfileData();
    }
  }

  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

  private loadProfileData(): void {
    this.baseService.getById<ClientViewModel>(`Clients/${this.id}`).subscribe({
      next: (data) => {
        if (data) {
          this.profileForm.patchValue({
            id: data.id,
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            idNumber: data.idNumber,
            isMale: data.isMale,
            nationalityId: data.nationality.id,
            languageId: data.language.id,
            relationshipId: data.relationship.id,
            birthDate: data.birthDate,
            phone :data.phone,
          });
          this.client = data;
          if (data.image) {
            this.imagePreview = this.imageUrl + '/' + data.image;
          }
        }
      },
      error: (error) => {
        console.error('Error fetching profile data:', error);
        this.message = 'Failed to load profile data';
      },
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.newImage = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteSelectedFile() {
    this.imagePreview = null;
    this.newImage = null;
  }

  private loadLookups(): void {
    this.baseService
      .getLookup<LookupViewModel>('Lookups?tableName=Languages')
      .subscribe({
        next: (result) => {
          this.languages = result;
          if (this.languages && this.languages.length > 0) {
            this.profileForm.get('languageId')?.setValue(this.languages[0].id);
          }
        },
        error: () => {
          this.message = 'Failed to load languages';
        },
      });

    this.baseService
      .getLookup<LookupViewModel>('Lookups?tableName=Nationalities')
      .subscribe({
        next: (result) => {
          this.nationalities = result;
          if (this.nationalities && this.nationalities.length > 0) {
            this.profileForm
              .get('nationalityId')
              ?.setValue(this.nationalities[0].id);
          }
        },
        error: () => {
          this.message = 'Failed to load nationalities';
        },
      });

    this.baseService
      .getLookup<LookupViewModel>('Lookups?tableName=Relationships')
      .subscribe({
        next: (result) => {
          this.relationships = result;
          if (this.relationships && this.relationships.length > 0) {
            this.profileForm
              .get('relationshipId')
              ?.setValue(this.relationships[0].id);
          }
        },
        error: () => {
          this.message = 'Failed to load Relationships';
        },
      });
  }

  private uploadImage(id?: number): void {
    this.id = id;
    if (this.newImage && this.id !== undefined) {
      this.baseService
        .uploadFile(this.id!, this.newImage, 'Clients')
        .subscribe({
          next: (res) => {
            this.deleteSelectedFile();
            this.clientService.refreshClient();
            this.loading = false;
            this.profileUpdated.emit();
            this.dialogRef.close();
          },
          error: (error: IPostResponse) => {
            this.message = error.message;
            this.loading = false;
          },
        });
    } else {
      this.clientService.refreshClient();
      this.loading = false;
      this.profileUpdated.emit();
      this.dialogRef.close();
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }
    this.loading = true;
    const phoneNumberObject = this.profileForm.get('phone')?.value;
      const number = phoneNumberObject?.e164Number;
      this.profileForm.get('phone')?.setValue(number);
    if (this.id) {
      this.baseService
        .update(
          `${APIConstant.Clients}/UpdateProfile/${this.id}`,
          this.profileForm.value
        )
        .subscribe({
          next: (response: IPostResponse) => {
            if (this.newImage) {
              this.uploadImage(this.id!);
              this.dialogRef.close(true);
            } else {
              this.loading = false;
              this.profileUpdated.emit();
              this.dialogRef.close(true);
            }
          },
          error: (error: IPostResponse) => {
            this.message = error.message;
            this.loading = false;
          },
        });
    } else {
      this.baseService
        .create(`${APIConstant.Clients}/AddProfile`, this.profileForm.value)
        .subscribe({
          next: (response: IPostResponse) => {
            this.uploadImage(response.id);
            this.dialogRef.close(true);
          },
          error: (error: IPostResponse) => {
            this.message = error.message;
            this.loading = false;
          },
          complete:()=> {
          },
        });
    }
  }
}
