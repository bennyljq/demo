import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsWattComponent } from './physics-watt.component';

describe('PhysicsWattComponent', () => {
  let component: PhysicsWattComponent;
  let fixture: ComponentFixture<PhysicsWattComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicsWattComponent]
    });
    fixture = TestBed.createComponent(PhysicsWattComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
