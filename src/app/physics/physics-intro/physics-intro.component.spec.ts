import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicsIntroComponent } from './physics-intro.component';

describe('PhysicsIntroComponent', () => {
  let component: PhysicsIntroComponent;
  let fixture: ComponentFixture<PhysicsIntroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhysicsIntroComponent]
    });
    fixture = TestBed.createComponent(PhysicsIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
