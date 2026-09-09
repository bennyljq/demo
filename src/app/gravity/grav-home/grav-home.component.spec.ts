import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravHomeComponent } from './grav-home.component';

describe('GravHomeComponent', () => {
  let component: GravHomeComponent;
  let fixture: ComponentFixture<GravHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GravHomeComponent]
    });
    fixture = TestBed.createComponent(GravHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
