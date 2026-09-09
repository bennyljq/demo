import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gravity2025DialogComponent } from './gravity2025-dialog.component';

describe('Gravity2025DialogComponent', () => {
  let component: Gravity2025DialogComponent;
  let fixture: ComponentFixture<Gravity2025DialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Gravity2025DialogComponent]
    });
    fixture = TestBed.createComponent(Gravity2025DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
