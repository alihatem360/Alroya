import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseService } from '../../services/Base/base.service';

@Component({
  selector: 'app-confirm-status',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './confirm-status.component.html',
  styleUrl: './confirm-status.component.scss',
})
export class ConfirmStatusComponent {
  isSuccess: boolean;
  message: string;
  description: string;
  homeLink: string | null;
  homeButtonText: string;
  actionButtonlink: string;
  actionButtonText: string;
  CancelButtonText: string;
  ConfirmButtonText: string;

  @Output() actionButtonClick = new EventEmitter<void>();

  constructor(
    public baseService: BaseService,
    public dialogRef: MatDialogRef<ConfirmStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isSuccess = data.isSuccess;
    this.message = data.message;
    this.description = data.description;
    this.homeLink = data.homeLink;
    this.homeButtonText = data.homeButtonText;
    this.actionButtonlink = data.actionButtonlink;
    this.actionButtonText = data.actionButtonText;
    this.CancelButtonText = data.CancelButtonText;
    this.ConfirmButtonText = data.ConfirmButtonText;
  }
  onActionButtonClick() {
    this.actionButtonClick.emit();
  }
  onCancelClick(): void {
    this.dialogRef.close();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
