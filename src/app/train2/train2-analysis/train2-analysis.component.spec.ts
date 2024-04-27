import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Train2AnalysisComponent } from './train2-analysis.component';

describe('Train2AnalysisComponent', () => {
  let component: Train2AnalysisComponent;
  let fixture: ComponentFixture<Train2AnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Train2AnalysisComponent]
    });
    fixture = TestBed.createComponent(Train2AnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
