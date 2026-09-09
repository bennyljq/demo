import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimTestComponent } from './anim-test.component';

describe('AnimTestComponent', () => {
  let component: AnimTestComponent;
  let fixture: ComponentFixture<AnimTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnimTestComponent]
    });
    fixture = TestBed.createComponent(AnimTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
