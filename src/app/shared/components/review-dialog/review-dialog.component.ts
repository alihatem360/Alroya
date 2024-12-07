import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared.module';
import { BaseService } from '../../services/Base/base.service';
import { CreateReviewDto } from '../../models/interfaces/Review';
import { APIConstant } from '../../constant/APIConstant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientService } from '../../services/Client/client.service';
import { ClientViewModel } from '../../models/interfaces/Client';

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatIconModule, SharedModule],
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss']
})
export class ReviewDialogComponent {
  showDialog = false;
  stars: number[] = [1, 2, 3, 4, 5];
  rating = 0;
  reviewComment = '';
  client: ClientViewModel | null = null;
  isSubmitting = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private clientService: ClientService,
    private dialogRef: MatDialogRef<ReviewDialogComponent>, 
    private baseService: BaseService,
    private snackBar: MatSnackBar
  ) {
    this.clientService.client$.subscribe((client) => {
      this.client = client;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  setRating(star: number) {
    this.rating = star;
  }

  submitReview() {
    if (this.rating === 0) {
      alert('Please select a rating');
      return;
    }

    let reviewDto: CreateReviewDto;

    if (this.data.source === 'order') {
      reviewDto = {
        ClientId: this.client!.id,
        OrderId: this.data.orderId,
        CreatedAt: new Date().toISOString().split('T')[0],
        Rate: this.rating,
        Description: this.reviewComment,
        OrderItemId: this.data.id, 
      };
    } 
    else if (this.data.source === 'plan') {
      reviewDto = {
        ClientId: this.client!.id,
        OrderId: this.data.orderId,
        CreatedAt: new Date().toISOString().split('T')[0],
        Rate: this.rating,  
        Description: this.reviewComment,
        OrderItemId: this.data.id,
        KitchenId: this.data.kitchenId,
        GymId: this.data.planId,
        ClinicId: this.data.clinicId,
      };
    } 
    else if (this.data.source === 'appointment') {
      reviewDto = {
        ClientId: this.client!.id,
        ConsultationId: this.data.consultantId,
        CreatedAt: new Date().toISOString().split('T')[0],
        Rate: this.rating,
        Description: this.reviewComment,
      };

      if (this.data.CoachId) {
        reviewDto.CoachId = this.data.CoachId;
      } else if (this.data.DoctorId) {
        reviewDto.DoctorId = this.data.DoctorId;
      } else if (this.data.CosmeticSpecialistId) {
        reviewDto.CosmeticSpecialistId = this.data.CosmeticSpecialistId;
      } else if (this.data.NutritionistId) {
        reviewDto.NutritionistId = this.data.NutritionistId;
      } else if (this.data.PhysioTherapistId) {
        reviewDto.PhysioTherapistId = this.data.PhysioTherapistId;
      }
    } else {
      console.error('Unknown source:', this.data.source);
      return;
    }

    this.baseService.create(`${APIConstant.Reviews}`, reviewDto)
      .subscribe({
        next: (response) => {
          this.snackBar.open('Review submitted successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.isSubmitting=true,
          this.closeDialog();
        },
        error: (err) => {
          this.isSubmitting=false
        },
      });
  }
}