import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gravity2Component } from './gravity2.component';

describe('Gravity2Component', () => {
  let component: Gravity2Component;
  let fixture: ComponentFixture<Gravity2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Gravity2Component]
    });
    fixture = TestBed.createComponent(Gravity2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
