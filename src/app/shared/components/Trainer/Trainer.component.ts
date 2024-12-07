import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BaseService } from '../../services/Base/base.service';
import { APIConstant } from '../../constant/APIConstant';
import { IPaginationResult } from '../../models/interfaces/PaginationResult';
import { SharedModule } from '../../shared.module';
import { CoachViewModel } from '../../models/interfaces/Trainer';

@Component({
  selector: 'app-Coach',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './Trainer.component.html',
  styleUrl: './Trainer.component.scss',
})
export class TrainerComponent implements OnInit {
  @Input()
  Coach!: CoachViewModel;
  @ViewChild('CoachesList', { static: true }) CoachesList!: ElementRef;
  Coaches: CoachViewModel[] = [];
  constructor(private baseService: BaseService) {}
  ngOnInit(): void {
    this.loadCoaches();
  }
  loadCoaches(): void {
    this.baseService.getAll<CoachViewModel>(APIConstant.Coaches).subscribe({
      next: (result: IPaginationResult<CoachViewModel>) => {
        this.Coaches = result.data || [];
      },
      error: (error) => {
        console.error('Error loading Coaches:', error);
        // Handle error
      },
    });
  }
  scrollLeft() {
    this.CoachesList.nativeElement.scrollBy({
      left: -320,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    this.CoachesList.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
  }
}
