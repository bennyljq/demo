import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gravity2025Component } from './gravity2025.component';

describe('Gravity2025Component', () => {
  let component: Gravity2025Component;
  let fixture: ComponentFixture<Gravity2025Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Gravity2025Component]
    });
    fixture = TestBed.createComponent(Gravity2025Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
