import { Component } from '@angular/core';
import { ServiceSectionComponent } from '../home/components/service-section/service-section.component';
import {
  Breadcrumb,
  BreadcrumbComponent,
} from '../../shared/breadcrumb/breadcrumb.component';
import { SharedModule } from '../../shared/shared.module';
import { BaseService } from '../../shared/services/Base/base.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [ServiceSectionComponent, SharedModule, BreadcrumbComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Health and Fitness Services', url: '/services', last: true },
  ];

  constructor(public baseService: BaseService) {}
}
