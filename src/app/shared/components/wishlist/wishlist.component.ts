import { Component, Input } from '@angular/core';
import { TestViewModel } from '../../models/interfaces/Test';
import { SharedModule } from '../../shared.module';
import { TestCardComponent } from '../test-card/test-card.component';
import { KitchensProgramsViewModel } from '../../models/interfaces/Kitchens';
import { KitchenProgramCardComponent } from '../kitchen-program-card/kitchen-program-card.component';
import { ClinicsProgramsViewModel } from '../../models/interfaces/Clinics';
import { ClinicProgramCardComponent } from '../clinic-program-card/clinic-program-card.component';
import { PlansViewModel } from '../../models/interfaces/Plans';
import { GymPlanCardComponent } from '../gym-plan-card/gym-plan-card.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [LoadingComponent,SharedModule, TestCardComponent,KitchenProgramCardComponent,ClinicProgramCardComponent,GymPlanCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent {
  constructor() {}
  @Input()tests: TestViewModel[] | undefined;
  @Input()kitchenPrograms: KitchensProgramsViewModel[] | undefined;
  @Input() clinicPrograms: ClinicsProgramsViewModel[] | undefined;
  @Input() planPrograms: PlansViewModel[] | undefined;


}
