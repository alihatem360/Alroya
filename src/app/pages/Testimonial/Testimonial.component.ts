import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../shared/services/Base/base.service';
import { Testimonial } from '../../shared/models/interfaces/Testimonial';

@Component({
  selector: 'app-Testimonial',
  templateUrl: './Testimonial.component.html',
  styleUrls: ['./Testimonial.component.css'],
})
export class TestimonialComponent implements OnInit {
  constructor(private baseService: BaseService) {}
  isLoading = true;
  Testimonials: Testimonial[] = [];
  ngOnInit() {
    this.fetchTestimonials();
  }

  private fetchTestimonials(): void {
    this.baseService.getAll<Testimonial>('Services').subscribe({
      next: (response) => {
        this.Testimonials = response.data ?? [];
      },
      error: (error) => {
        console.error('Error fetching Testimonials:', error);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
