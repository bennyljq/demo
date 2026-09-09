import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainHomeComponent } from './train-home.component';

describe('TrainHomeComponent', () => {
  let component: TrainHomeComponent;
  let fixture: ComponentFixture<TrainHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainHomeComponent]
    });
    fixture = TestBed.createComponent(TrainHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
