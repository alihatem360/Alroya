import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LanguageService } from '../../services/Language/LanguageService';
import { environment } from '../../../../environments/environment';

declare var Moyasar: any;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements AfterViewInit {
  amount: number;
  description: string;
  currentLang: string = 'ar';
  payment: any;
  callbackUrl: string;
  constructor(
    private http: HttpClient,
    private languageService: LanguageService,
    public dialogRef: MatDialogRef<PaymentComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { amount: number; description: string; callbackUrl: string }
  ) {
    this.amount = data.amount;
    this.description = data.description;
    this.callbackUrl = data.callbackUrl;
  }

  ngAfterViewInit(): void {
    this.initializeMoyasar();
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLang = lang || 'ar';
    });
  }

  initializeMoyasar() {
    if (typeof Moyasar !== 'undefined') {
      Moyasar.init({
        amount: this.amount * 100,
        currency: 'SAR',
        callback_url: this.callbackUrl,
        element: '.payment-form',
        description: this.description,
        publishable_api_key: environment.Moyasar,
        methods: ['creditcard'],
        metadata: {
          orderId: this.description,
        },
        on_completed: (payment: any) => {
          this.payment = payment;
          this.savePayment(this.payment);
        },
        on_error: (error: any) => {
          console.error('Payment initialization error:', error);
        },
      });
    }
  }

  savePayment(payment: any) {
    const url = environment.API_URL + 'Payments/SavePayment';
    this.http.post(url, payment).subscribe({
      next: (response) => {
        this.dialogRef.close(true);
      },
      error: (err) => {},
    });
  }
}
