import { FAQ } from './../../shared/models/interfaces/FAQ';
import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../shared/services/Base/base.service';

@Component({
  selector: 'app-FAQs',
  templateUrl: './FAQs.component.html',
  styleUrls: ['./FAQs.component.css'],
})
export class FAQsComponent implements OnInit {
  isLoading = true;
  FAQs: FAQ[] = [];

  constructor(private baseService: BaseService) {}

  ngOnInit() {
    this.fetchCompetitiveAdvantages();
  }

  private fetchCompetitiveAdvantages(): void {
    this.baseService.getAll<FAQ>('FAQS').subscribe({
      next: (response) => {
        this.FAQs = response.data ?? [];
      },
      error: (error) => {
        console.error('Error fetching faqs:', error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
