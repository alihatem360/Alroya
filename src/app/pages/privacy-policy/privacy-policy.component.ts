import { Component } from '@angular/core';
import { Breadcrumb, BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { SharedModule } from '../../shared/shared.module';
import { BaseService } from '../../shared/services/Base/base.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [SharedModule,BreadcrumbComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Privacy Policy', url: '/privacy-policy', last:true},
  ];
  constructor(public baseService: BaseService) {}
}
