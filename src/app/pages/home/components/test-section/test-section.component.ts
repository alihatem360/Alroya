import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { TestViewModel } from '../../../../shared/models/interfaces/Test';
import { BaseService } from '../../../../shared/services/Base/base.service';
import { IPaginationResult } from '../../../../shared/models/interfaces/PaginationResult';
import { APIConstant } from '../../../../shared/constant/APIConstant';
import { SharedModule } from '../../../../shared/shared.module';
import { Subscription } from 'rxjs';
import { TestCardComponent } from '../../../../shared/components/test-card/test-card.component';

@Component({
  selector: 'app-test-section',
  standalone: true,
  imports: [SharedModule, TestCardComponent],
  templateUrl: './test-section.component.html',
  styleUrls: ['./test-section.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TestSectionComponent implements OnInit, OnDestroy {
  @ViewChild('testSwiper') swiperContainer!: ElementRef;
  tests: TestViewModel[] = [];
  loading = true;
  errorMessage = '';
  private subscription: Subscription = new Subscription();

  constructor(
    public baseService: BaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTests();
  }

  private loadTests(): void {
    const sub = this.baseService
      .getAll<TestViewModel>(APIConstant.Tests, undefined, undefined, undefined, true, 'OrderIndex')
      .subscribe({
        next: (result: IPaginationResult<TestViewModel>) => {
          this.tests = result.data || [];
          this.loading = false;
          this.cdr.detectChanges();
          this.initializeSwiper();
        },
        error: (err) => {
          this.handleError(err);
        },
      });

    this.subscription.add(sub);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private handleError(error: any): void {
    this.errorMessage = `Failed to load tests. Error: ${
      error.message || 'Unknown error'
    }`;
    this.loading = false;
    this.cdr.detectChanges();
  }

  private initializeSwiper(): void {
    if (this.swiperContainer?.nativeElement) {
      const swiperElement = this.swiperContainer.nativeElement;
      Object.assign(swiperElement, {
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
          nextEl: '.test-button-next',
          prevEl: '.test-button-prev',
        },
      });
      swiperElement.initialize();
    }
  }
}
