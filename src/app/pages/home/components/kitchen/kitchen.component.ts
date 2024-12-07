import { KitchensViewModel } from './../../../../shared/models/interfaces/Kitchens';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BaseService } from '../../../../shared/services/Base/base.service';
import { APIConstant } from '../../../../shared/constant/APIConstant';
import { IPaginationResult } from '../../../../shared/models/interfaces/PaginationResult';
import { SharedModule } from '../../../../shared/shared.module';
import { SwiperOptions } from 'swiper/types';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './kitchen.component.html',
  styleUrl: './kitchen.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class KitchenComponent implements OnInit {
  imageUrl = environment.imageUrl;
  kitchens: KitchensViewModel[] = [];
  @ViewChild('kitchensSwiper') swiperContainer!: ElementRef;
  loading = true;
  error = false;

  constructor(
    public baseService: BaseService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.loadKitchens();
  }

  loadKitchens(): void {
    this.baseService.getAll<KitchensViewModel>(APIConstant.Kitchens).subscribe({
      next: (result: IPaginationResult<KitchensViewModel>) => {
        this.kitchens = result.data || [];
        this.loading = false;
        this.cdr.detectChanges();
        this.initializeSwiper();
      },
      error: (error) => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
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
        slidesPerView: 2,
        spaceBetween: 10,
      },
      480: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 25,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
    },
    observer: true,
    navigation: {
      nextEl: '.kitchen-button-next',
      prevEl: '.kitchen-button-prev',
    },
  };
}
