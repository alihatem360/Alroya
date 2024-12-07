import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedMealsSectionComponent } from './recommended-meals-section.component';

describe('RecommendedMealsSectionComponent', () => {
  let component: RecommendedMealsSectionComponent;
  let fixture: ComponentFixture<RecommendedMealsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedMealsSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommendedMealsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
