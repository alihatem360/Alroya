import { CompetitiveAdvantage } from '../../shared/models/interfaces/CompetitiveAdvantage';
import { BaseService } from './../../shared/services/Base/base.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-WhyChooseUs',
  templateUrl: './WhyChooseUs.component.html',
  styleUrls: ['./WhyChooseUs.component.css'],
})
export class WhyChooseUsComponent implements OnInit {
  isLoading = true;
  competitiveAdvantages: CompetitiveAdvantage[] = [];

  constructor(private baseService: BaseService) {}

  ngOnInit() {
    this.fetchCompetitiveAdvantages();
  }

  private fetchCompetitiveAdvantages(): void {
    this.baseService
      .getAll<CompetitiveAdvantage>('CompetitiveAdvantages')
      .subscribe({
        next: (response) => {
          this.competitiveAdvantages = response.data ?? [];
        },
        error: (error) => {
          console.error('Error fetching competitive advantages:', error);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
