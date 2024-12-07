import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { HomeRecommendationDetails } from '../../../../shared/models/interfaces/HomeRecommendation';
import { BaseService } from '../../../../shared/services/Base/base.service';
import { APIConstant } from '../../../../shared/constant/APIConstant';
import { SwiperOptions } from 'swiper/types';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-recommended-meals-section',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './recommended-meals-section.component.html',
  styleUrl: './recommended-meals-section.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecommendedMealsSectionComponent implements OnInit {
  workoutRecommendations: HomeRecommendationDetails[] = [];
  imageUrl = environment.imageUrl;
  @ViewChild('programsSwiper') swiperContainer!: ElementRef;
  constructor(
    public baseService: BaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getRecommendedWorkouts(2);
  }

  getRecommendedWorkouts(typeId: number): void {
    this.baseService
      .getAll<HomeRecommendationDetails>(
        `${APIConstant.HomeRecommendations}`,
        undefined,
        undefined,
        `TypeId=${typeId}`
      )
      .subscribe({
        next: (result) => {
          this.workoutRecommendations = result.data ?? [];
          this.cdr.detectChanges();
          this.initializeSwiper();
        },
        error: (error) => {
          console.error('Error fetching workout recommendations', error);
        },
      });
  }

  private initializeSwiper(): void {
    if (this.swiperContainer) {
      const swiperElement = this.swiperContainer.nativeElement;
      Object.assign(swiperElement, this.config);
      swiperElement.initialize();
    }
  }

  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 15,
      },
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 25,
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
      1280: {
        slidesPerView: 1,
        spaceBetween: 40,
      },
    },
    observer: true,
    navigation: {
      nextEl: '.Recommendation-button-next',
      prevEl: '.Recommendation-button-prev',
    },
  };

  get hasMultipleRecommendations(): boolean {
    return this.workoutRecommendations.length > 1;
  }
}
