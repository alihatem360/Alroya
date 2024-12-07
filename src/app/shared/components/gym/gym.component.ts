import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GymViewModel } from '../../models/interfaces/Gym';
import { BaseService } from '../../services/Base/base.service';
import { APIConstant } from '../../constant/APIConstant';
import { IPaginationResult } from '../../models/interfaces/PaginationResult';
import { SharedModule } from '../../shared.module';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-gym',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './gym.component.html',
  styleUrl: './gym.component.scss',
})
export class GymComponent implements OnInit {
  @ViewChild('gymsList', { static: true }) gymsList!: ElementRef;
  imageUrl = environment.imageUrl;
  visibleGyms: GymViewModel[] = [];
  currentPage = 0;
  itemsPerPage = 4;
  gyms: GymViewModel[] = [];
  constructor(private baseService: BaseService) {}
  ngOnInit(): void {
    this.loadGyms();

    this.updateVisibleGyms();
  }
  updateVisibleGyms() {
    const startIndex = this.currentPage * this.itemsPerPage;
    this.visibleGyms = this.gyms.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }
  loadGyms(): void {
    this.baseService.getAll<GymViewModel>(APIConstant.Gyms).subscribe({
      next: (result: IPaginationResult<GymViewModel>) => {
        this.gyms = result.data || [];
      },
      error: (error) => {
        console.error('Error loading gyms:', error);
      },
    });
  }

  scrollLeft() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateVisibleGyms();
    }
  }

  scrollRight() {
    if ((this.currentPage + 1) * this.itemsPerPage < this.gyms.length) {
      this.currentPage++;
      this.updateVisibleGyms();
    }
  }
}
