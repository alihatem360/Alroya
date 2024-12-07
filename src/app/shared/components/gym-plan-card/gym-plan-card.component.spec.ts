import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymPlanCardComponent } from './gym-plan-card.component';

describe('GymPlanCardComponent', () => {
  let component: GymPlanCardComponent;
  let fixture: ComponentFixture<GymPlanCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GymPlanCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GymPlanCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
