import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import {
  Breadcrumb,
  BreadcrumbComponent,
} from '../../../../../shared/breadcrumb/breadcrumb.component';
import { BaseService } from '../../../../../shared/services/Base/base.service';
import { LanguageService } from '../../../../../shared/services/Language/LanguageService';
import { LoadingComponent } from '../../../../../shared/components/loading/loading.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { PackageDetails } from '../../../../../shared/models/interfaces/Package';

@Component({
  selector: 'app-package-details',
  standalone: true,
  imports: [SharedModule, BreadcrumbComponent, LoadingComponent],
  templateUrl: './package-details.component.html',
  styleUrl: './package-details.component.scss',
})
export class PackageDetailsComponent {
  breadcrumbs: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Packages', url: '/packages', last: true },
  ];
  imageUrl = environment.imageUrl;
  id: number;
  package: PackageDetails | null = null;
  isLoading = false;
  constructor(
    public baseService: BaseService,
    private route: ActivatedRoute,
    public languageService: LanguageService,
    private router: Router
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadpackage();
    this.languageService.currentLanguage$.subscribe(() => {
      this.setBreadcrumbs();
    });
  }

  private loadpackage(): void {
    this.isLoading = true;
    this.baseService.getById<PackageDetails>(`packages/${this.id}`).subscribe({
      next: (data) => {
        this.package = data;
        this.setBreadcrumbs();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/', this.baseService.currentLanguage, 'home']);
      },
    });
  }

  setBreadcrumbs(): void {
    if (this.package) {
      this.breadcrumbs = [
        { label: 'Home', url: '/Home' },
        { label: 'Packages', url: '/Home' },
        {
          label:
            this.baseService.currentLanguage === 'ar'
              ? this.package.nameAr
              : this.package.nameEn,
          url: ``,
          last: true,
        },
      ];
    }
  }
}
