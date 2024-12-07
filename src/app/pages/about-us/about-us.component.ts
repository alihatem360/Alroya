import { Component } from '@angular/core';
import {
  Breadcrumb,
  BreadcrumbComponent,
} from '../../shared/breadcrumb/breadcrumb.component';
import { SharedModule } from '../../shared/shared.module';
import { BaseService } from '../../shared/services/Base/base.service';
import { CompanyInfo } from '../../shared/models/interfaces/CompanyInfo';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { LanguageService } from '../../shared/services/Language/LanguageService';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [SharedModule, BreadcrumbComponent, LoadingComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
})
export class AboutUsComponent {
  isLoading = true;
  companyInfo: CompanyInfo | null = null;
  currentLang: string = 'ar';
  constructor(
    public baseService: BaseService,
    private languageService: LanguageService
  ) {}
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '/about-us', last: true },
  ];
  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLang = lang || 'ar';
    });
    this.fetchCompanyInfo();
    this.isLoading = false;
  }

  fetchCompanyInfo(): void {
    this.baseService.getCompanyInfo().subscribe((info) => {
      this.companyInfo = info;
    });
  }
}
