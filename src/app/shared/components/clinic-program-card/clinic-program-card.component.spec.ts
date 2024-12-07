import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicProgramCardComponent } from './clinic-program-card.component';

describe('ClinicProgramCardComponent', () => {
  let component: ClinicProgramCardComponent;
  let fixture: ComponentFixture<ClinicProgramCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicProgramCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClinicProgramCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
