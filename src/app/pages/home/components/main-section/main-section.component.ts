import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { BaseService } from '../../../../shared/services/Base/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-section',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './main-section.component.html',
  styleUrl: './main-section.component.scss',
})
export class MainSectionComponent {
  searchInput: string = '';
  constructor(public baseService: BaseService, private router: Router) {}
  search(): void {
    const searchString = this.searchInput;
    this.router.navigate([
      '/',
      this.baseService.currentLanguage,
      'search',
      searchString,
    ]);
  }
}
