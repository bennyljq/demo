import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrownianMotionComponent } from './brownian-motion.component';

describe('BrownianMotionComponent', () => {
  let component: BrownianMotionComponent;
  let fixture: ComponentFixture<BrownianMotionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrownianMotionComponent]
    });
    fixture = TestBed.createComponent(BrownianMotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
