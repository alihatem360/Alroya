import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../../../../shared/shared.module';
import { APIConstant } from '../../../../shared/constant/APIConstant';
import { GymViewModel } from '../../../../shared/models/interfaces/Gym';
import { DoctorViewModel } from '../../../../shared/models/interfaces/Doctor';
import { BaseService } from '../../../../shared/services/Base/base.service';
import { IPaginationResult } from '../../../../shared/models/interfaces/PaginationResult';
import { SwiperOptions } from 'swiper/types';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-gyms-section',
  standalone: true,
  imports: [MatTabsModule, SharedModule],
  templateUrl: './gyms-section.component.html',
  styleUrl: './gyms-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GymsSectionComponent implements OnInit {
  imageUrl = environment.imageUrl;
  gyms: GymViewModel[] = [];
  coaches: DoctorViewModel[] = [];
  loading = true;
  isGymActive = true;
  error = false;
  @ViewChild('gymSwiper') gymSwiperContainer!: ElementRef;
  @ViewChild('coachSwiper') CoachSwiperContainer!: ElementRef;
  constructor(
    public baseService: BaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCoaches();
    this.loadGyms();
  }

  loadGyms(): void {
    this.baseService.getAll<GymViewModel>(APIConstant.Gyms).subscribe({
      next: (result: IPaginationResult<GymViewModel>) => {
        this.gyms = result.data || [];
        this.loading = false;
        this.initializeGymSwiper();
      },
      error: (error) => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  loadCoaches(): void {
    this.baseService.getAll<DoctorViewModel>(APIConstant.Coaches).subscribe({
      next: (result: IPaginationResult<DoctorViewModel>) => {
        this.coaches = result.data || [];
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  public initializeGymSwiper(): void {
    this.isGymActive = true;
    this.cdr.detectChanges();
    if (this.gymSwiperContainer) {
      const swiperElement = this.gymSwiperContainer.nativeElement;
      Object.assign(swiperElement, this.gymConfig);
      swiperElement.initialize();
    }
  }

  public initializeCoachSwiper(): void {
    this.isGymActive = false;
    this.cdr.detectChanges();
    if (this.CoachSwiperContainer) {
      const swiperElement = this.CoachSwiperContainer.nativeElement;
      Object.assign(swiperElement, this.CoachConfig);
      swiperElement.initialize();
    }
    this.isGymActive = false;
    this.cdr.detectChanges();
  }

  gymConfig: SwiperOptions = {
    slidesPerView: 2,
    grid: {
      fill: 'row',
      rows: 2,
    },
    spaceBetween: 30,
    breakpoints: {
      320: {
        spaceBetween: 10,
      },
      640: {
        spaceBetween: 20,
      },
      1024: {
        spaceBetween: 30,
      },
    },
    observer: true,
    navigation: {
      nextEl: '.gym-button-next',
      prevEl: '.gym-button-prev',
    },
  };

  CoachConfig: SwiperOptions = {
    slidesPerView: 2,
    grid: {
      fill: 'row',
      rows: 2,
    },
    spaceBetween: 30,
    breakpoints: {
      320: {
        spaceBetween: 10,
      },
      640: {
        spaceBetween: 20,
      },
      1024: {
        spaceBetween: 30,
      },
    },
    observer: true,
    navigation: {
      nextEl: '.coach-button-next',
      prevEl: '.coach-button-prev',
    },
  };
}
