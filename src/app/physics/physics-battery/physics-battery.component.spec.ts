import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsBatteryComponent } from './physics-battery.component';

describe('PhysicsBatteryComponent', () => {
  let component: PhysicsBatteryComponent;
  let fixture: ComponentFixture<PhysicsBatteryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicsBatteryComponent]
    });
    fixture = TestBed.createComponent(PhysicsBatteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
