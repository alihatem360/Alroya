import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymsSectionComponent } from './gyms-section.component';

describe('GymsSectionComponent', () => {
  let component: GymsSectionComponent;
  let fixture: ComponentFixture<GymsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GymsSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GymsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
