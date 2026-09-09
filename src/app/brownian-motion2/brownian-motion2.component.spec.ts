import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrownianMotion2Component } from './brownian-motion2.component';

describe('BrownianMotion2Component', () => {
  let component: BrownianMotion2Component;
  let fixture: ComponentFixture<BrownianMotion2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrownianMotion2Component]
    });
    fixture = TestBed.createComponent(BrownianMotion2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
