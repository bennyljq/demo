import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Train2PrelimConceptComponent } from './train2-prelim-concept.component';

describe('Train2ConceptComponent', () => {
  let component: Train2PrelimConceptComponent;
  let fixture: ComponentFixture<Train2PrelimConceptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Train2PrelimConceptComponent]
    });
    fixture = TestBed.createComponent(Train2PrelimConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
