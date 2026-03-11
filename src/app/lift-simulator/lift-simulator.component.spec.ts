import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiftSimulatorComponent } from './lift-simulator.component';

describe('LiftSimulatorComponent', () => {
  let component: LiftSimulatorComponent;
  let fixture: ComponentFixture<LiftSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiftSimulatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiftSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
