import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsPowerComponent } from './physics-power.component';

describe('PhysicsPowerComponent', () => {
  let component: PhysicsPowerComponent;
  let fixture: ComponentFixture<PhysicsPowerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicsPowerComponent]
    });
    fixture = TestBed.createComponent(PhysicsPowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
