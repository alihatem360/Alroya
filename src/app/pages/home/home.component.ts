import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { GymComponent } from '../../shared/components/gym/gym.component';
import { KitchenComponent } from './components/kitchen/kitchen.component';
import { TestComponent } from '../../shared/components/test/test.component';
import { MainSectionComponent } from './components/main-section/main-section.component';
import { ServiceSectionComponent } from './components/service-section/service-section.component';
import { AboutUsSectionComponent } from './components/about-us-section/about-us-section.component';
import { TestSectionComponent } from './components/test-section/test-section.component';
import { GymsSectionComponent } from './components/gyms-section/gyms-section.component';
import { RecommendedMealsSectionComponent } from './components/recommended-meals-section/recommended-meals-section.component';
import { JourneySectionComponent } from './components/journey-section/journey-section.component';
import { FaqSectionComponent } from './components/faq-section/faq-section.component';
import { ConsultantsSectionComponent } from './components/consultants-section/consultants-section.component';
import { ConsultantsComponent } from '../consultants/consultants.component';
import { PackagesComponent } from "./components/Packages/Packages.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedModule,
   
    MainSectionComponent,
    ServiceSectionComponent,
    AboutUsSectionComponent,
    TestSectionComponent,
    GymsSectionComponent,
    ConsultantsSectionComponent,
    RecommendedMealsSectionComponent,
    JourneySectionComponent,
    FaqSectionComponent,
    PackagesComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
