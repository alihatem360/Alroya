import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { SwiperOptions } from 'swiper/types';
import { environment } from '../../../../../environments/environment';
import { IPaginationResult } from '../../../../shared/models/interfaces/PaginationResult';
import { BaseService } from '../../../../shared/services/Base/base.service';
import { Package } from '../../../../shared/models/interfaces/Package';
import { SharedModule } from '../../../../shared/shared.module';

@Component({
  selector: 'app-Packages',
  standalone: true,
  templateUrl: './Packages.component.html',
  styleUrl: './Packages.component.scss',
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PackagesComponent implements OnInit {
  imageUrl = environment.imageUrl;
  packages: Package[] = [];
  @ViewChild('packagesSwiper') swiperContainer!: ElementRef;
  loading = true;
  error = false;

  constructor(
    public baseService: BaseService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.loadpackages();
  }

  loadpackages(): void {
    this.baseService.getAll<Package>('Packages').subscribe({
      next: (result: IPaginationResult<Package>) => {
        this.packages = result.data || [];
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
      nextEl: '.package-button-next',
      prevEl: '.package-button-prev',
    },
  };
  getDiscountPercentage(priceBefore: number, price: number): number {
    if (!priceBefore || priceBefore <= price) {
      return 0;
    }
    return Math.round(((priceBefore - price) / priceBefore) * 100);
  }
}
