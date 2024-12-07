import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { TestViewModel } from '../../models/interfaces/Test';
import { BaseService } from '../../services/Base/base.service';
import { APIConstant } from '../../constant/APIConstant';
import { IPaginationResult } from '../../models/interfaces/PaginationResult';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit {
  @ViewChild('testsList', { static: true }) testsList!: ElementRef;
  tests: TestViewModel[] = [];
  constructor(private baseService: BaseService) {}

  ngOnInit(): void {
    // this.loadTests();
  }

  loadTests(): void {
    this.baseService.getAll<TestViewModel>(APIConstant.Tests, undefined, undefined, undefined, true, 'OrderIndex').subscribe({
      next: (result: IPaginationResult<TestViewModel>) => {
        this.tests = result.data || [];
      },
      error: (error) => {
        console.error('Error loading Tests:', error);
      },
    });
  }
  scrollLeft() {
    this.testsList.nativeElement.scrollBy({ left: -310, behavior: 'smooth' });
  }

  scrollRight() {
    this.testsList.nativeElement.scrollBy({ left: 310, behavior: 'smooth' });
  }
}
