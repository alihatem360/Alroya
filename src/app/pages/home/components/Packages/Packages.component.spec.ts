/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PackagesComponent } from './Packages.component';

describe('PackagesComponent', () => {
  let component: PackagesComponent;
  let fixture: ComponentFixture<PackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
