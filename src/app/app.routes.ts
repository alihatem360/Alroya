import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { redirectGuard } from './shared/guards/redirect.guard';
import { NgModule } from '@angular/core';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { languageGuard } from './shared/guards/language.guard';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
 
  {
    path: ':lang/home',
    canActivate: [languageGuard],
    component: HomeComponent,
    data: {
      titleEn: 'Home - Alroya Alfaniya',
      titleAr: 'الصفحة الرئيسية - الرؤية الفنية',
    },
  },
 
  {
    path: ':lang/services',
    canActivate: [languageGuard],

    loadComponent: () =>
      import('./pages/Services/Services.component').then(
        (m) => m.ServicesComponent
      ),
    data: {
      titleEn: 'Services - Alroya Alfaniya',
      titleAr: 'الخدمات - الرؤية الفنية',
    },
  },
   {
    path: ':lang/services',
    canActivate: [languageGuard],

    loadComponent: () =>
      import('./pages/Services/Services.component').then(
        (m) => m.ServicesComponent
      ),
    data: {
      titleEn: 'Services - Alroya Alfaniya',
      titleAr: 'الخدمات - الرؤية الفنية',
    },
  },
  {
    path: ':lang/contact-us',
    loadComponent: () =>
      import('./pages/Contact-Us/Contact-Us.component').then(
        (m) => m.ContactUsComponent
      ),
    data: {
      titleEn: 'Contact Us - Alroya Alfaniya',
      titleAr: 'اتصل بنا - الرؤية الفنية',
    },
  },
  {
    path: ':lang/consultants',
    canActivate: [languageGuard],

    loadComponent: () =>
      import('./pages/consultants/consultants.component').then(
        (m) => m.ConsultantsComponent
      ),
    data: {
      titleEn: 'Professionals Consultants  - Alroya Alfaniya',
      titleAr: 'الاستشاريون المحترفون - الرؤية الفنية',
    },
  },
 
 
  {
    path: ':lang/terms-and-conditions',
    canActivate: [languageGuard],

    loadComponent: () =>
      import(
        './pages/terms-and-conditions/terms-and-conditions.component'
      ).then((m) => m.TermsAndConditionsComponent),
    data: {
      titleEn: 'Terms & Conditions - Alroya Alfaniya',
      titleAr: 'الشروط والأحكام - الرؤية الفنية',
    },
  },
  {
    path: ':lang/privacy-policy',
    canActivate: [languageGuard],

    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy.component').then(
        (m) => m.PrivacyPolicyComponent
      ),
    data: {
      titleEn: 'Privacy Policy - Alroya Alfaniya',
      titleAr: 'سياسة الخصوصية - الرؤية الفنية',
    },
  },
  {
    path: ':lang/about-us',
    canActivate: [languageGuard],

    loadComponent: () =>
      import('./pages/about-us/about-us.component').then(
        (m) => m.AboutUsComponent
      ),
    data: {
      titleEn: 'About Us - Alroya Alfaniya',
      titleAr: 'معلومات عنا - الرؤية الفنية',
    },
  },
 
  {
    path: '',
    canActivate: [redirectGuard, languageGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: {
      titleEn: 'Home - Alroya Alfaniya',
      titleAr: 'الصفحة الرئيسية - الرؤية الفنية',
    },
  },
  {
    path: '**',
    canActivate: [redirectGuard, languageGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: {
      titleEn: 'Home - Alroya Alfaniya',
      titleAr: 'الصفحة الرئيسية - الرؤية الفنية',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: QuicklinkStrategy,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
