import { Component, OnInit } from '@angular/core';
import { APIConstant } from '../../shared/constant/APIConstant';
import { SharedModule } from '../../shared/shared.module';
import { BaseService } from '../../shared/services/Base/base.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import {
  Breadcrumb,
  BreadcrumbComponent,
} from '../../shared/breadcrumb/breadcrumb.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    SharedModule,
    NgxIntlTelInputModule,
    BreadcrumbComponent,
    LoadingComponent,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss', 
})
export class ContactUsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Contact Us', url: '/contact-us', last: true },
  ];
  contactUsForm!: FormGroup;
  isLoading = false;
  loading = false;
  errorMessage: string = '';
  constructor(private service: BaseService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.createForm();
    this.isLoading = false;
  }
  createForm() {
    this.contactUsForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.contactUsForm.valid) {
      const phoneNumberObject = this.contactUsForm.get('phone')?.value;
      const number = phoneNumberObject?.number;
      this.contactUsForm.get('phone')?.setValue(number);
      this.service
        .create(APIConstant.contactUs, this.contactUsForm.value)
        .subscribe({
          next: (res) => {
            this.service.navigateToPage('/');
            this.loading = false;
          },
          error: (error) => {
            this.loading = false;
            this.handleError(error);
          },
          complete: () => {
            this.loading = false;
          },
        });
    } else {
      this.contactUsForm.markAllAsTouched();
      this.loading = false;
    }
  }
  resetForm() {
    this.contactUsForm.reset();
  }
  handleError(error: any) {
    this.errorMessage = error.error?.message || 'An unexpected error occurred';
    setTimeout(() => this.closeAlert(), 5000);
  }
  closeAlert() {
    this.errorMessage = '';
  }
}
