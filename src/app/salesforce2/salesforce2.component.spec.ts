import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Salesforce2Component } from './salesforce2.component';

describe('Salesforce2Component', () => {
  let component: Salesforce2Component;
  let fixture: ComponentFixture<Salesforce2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Salesforce2Component]
    });
    fixture = TestBed.createComponent(Salesforce2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
