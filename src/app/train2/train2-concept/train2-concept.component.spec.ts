import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Train2ConceptComponent } from './train2-concept.component';

describe('Train2ConceptComponent', () => {
  let component: Train2ConceptComponent;
  let fixture: ComponentFixture<Train2ConceptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Train2ConceptComponent]
    });
    fixture = TestBed.createComponent(Train2ConceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
