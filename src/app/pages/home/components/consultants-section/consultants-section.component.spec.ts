import { ComponentFixture, TestBed } from '@angular/core/testing';

import {ConsultantsSectionComponent } from './consultants-section.component';

describe('ConsultantsCoachesSectionComponent', () => {
  let component: ConsultantsSectionComponent;
  let fixture: ComponentFixture<ConsultantsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantsSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultantsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
