import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { BaseService } from '../../../../shared/services/Base/base.service';

@Component({
  selector: 'app-service-section',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './service-section.component.html',
  styleUrl: './service-section.component.scss',
})
export class ServiceSectionComponent {
  constructor(public baseService: BaseService) {}
}
