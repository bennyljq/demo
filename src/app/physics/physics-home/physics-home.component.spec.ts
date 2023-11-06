import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsHomeComponent } from './physics-home.component';

describe('PhysicsHomeComponent', () => {
  let component: PhysicsHomeComponent;
  let fixture: ComponentFixture<PhysicsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicsHomeComponent]
    });
    fixture = TestBed.createComponent(PhysicsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
