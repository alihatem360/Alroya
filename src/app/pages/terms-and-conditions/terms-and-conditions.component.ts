import { Component } from '@angular/core';
import { Breadcrumb, BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { SharedModule } from '../../shared/shared.module';
import { BaseService } from '../../shared/services/Base/base.service';

@Component({
  selector: 'app-terms-and-conditions',
  standalone: true,
  imports: [SharedModule,BreadcrumbComponent],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent {
  constructor(public baseService: BaseService) {}
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Terms & Conditions', url: '/terms-and-conditions',last :true},
  ];
}
