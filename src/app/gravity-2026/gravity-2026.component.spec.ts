import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gravity2026Component } from './gravity-2026.component';

describe('Gravity2026Component', () => {
  let component: Gravity2026Component;
  let fixture: ComponentFixture<Gravity2026Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gravity2026Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gravity2026Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
