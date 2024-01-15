import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainConceptComponent } from './train-concept.component';

describe('TrainConceptComponent', () => {
  let component: TrainConceptComponent;
  let fixture: ComponentFixture<TrainConceptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainConceptComponent]
    });
    fixture = TestBed.createComponent(TrainConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
