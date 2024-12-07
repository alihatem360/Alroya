import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseService } from '../../../../shared/services/Base/base.service';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-journey-section',
  standalone: true,
  imports: [RouterModule, SharedModule],
  templateUrl: './journey-section.component.html',
  styleUrls: ['./journey-section.component.scss'],
})
export class JourneySectionComponent {
  constructor(public BaseService: BaseService) {}
}
