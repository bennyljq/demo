import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gravity2025DialogVelocityComponent } from './gravity2025-dialog-velocity.component';

describe('Gravity2025DialogVelocityComponent', () => {
  let component: Gravity2025DialogVelocityComponent;
  let fixture: ComponentFixture<Gravity2025DialogVelocityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Gravity2025DialogVelocityComponent]
    });
    fixture = TestBed.createComponent(Gravity2025DialogVelocityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
