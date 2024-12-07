import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenProgramCardComponent } from './kitchen-program-card.component';

describe('KitchenProgramCardComponent', () => {
  let component: KitchenProgramCardComponent;
  let fixture: ComponentFixture<KitchenProgramCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitchenProgramCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KitchenProgramCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
