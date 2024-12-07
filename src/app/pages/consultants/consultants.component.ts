import { Component } from '@angular/core';
import { Breadcrumb, BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { SharedModule } from '../../shared/shared.module';
import { BaseService } from '../../shared/services/Base/base.service';

@Component({
  selector: 'app-consultants',
  standalone: true,
  imports: [SharedModule, BreadcrumbComponent],
  templateUrl: './consultants.component.html',
  styleUrl: './consultants.component.scss'
})
export class ConsultantsComponent {
 
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Professionals Consultants', url: '/consultants', last: true },
  ];

  constructor(public baseService: BaseService) {}
}
