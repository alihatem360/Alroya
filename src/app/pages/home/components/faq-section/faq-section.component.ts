import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { FrequentlyQuestionModel } from '../../../../shared/models/interfaces/FrequentlyQuestion';
import { BaseService } from '../../../../shared/services/Base/base.service';
import { APIConstant } from '../../../../shared/constant/APIConstant';
import { IPaginationResult } from '../../../../shared/models/interfaces/PaginationResult';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [MatExpansionModule, SharedModule],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.scss',
})
export class FaqSectionComponent implements OnInit {
  questions: FrequentlyQuestionModel[] = [];
  constructor(public baseService: BaseService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }
  loadQuestions(): void {
    this.baseService
      .getAll<FrequentlyQuestionModel>(APIConstant.FrequentlyQuestions)
      .subscribe({
        next: (result: IPaginationResult<FrequentlyQuestionModel>) => {
          this.questions = result.data || [];
        },
        error: (error) => {
          console.error('Error loading Tests:', error);
        },
      });
  }
}
