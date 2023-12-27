import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravDialogComponent } from './grav-dialog.component';

describe('GravDialogComponent', () => {
  let component: GravDialogComponent;
  let fixture: ComponentFixture<GravDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GravDialogComponent]
    });
    fixture = TestBed.createComponent(GravDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
