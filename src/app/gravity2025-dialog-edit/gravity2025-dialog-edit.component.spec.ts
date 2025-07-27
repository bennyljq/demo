import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gravity2025DialogEditComponent } from './gravity2025-dialog-edit.component';

describe('Gravity2025DialogEditComponent', () => {
  let component: Gravity2025DialogEditComponent;
  let fixture: ComponentFixture<Gravity2025DialogEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Gravity2025DialogEditComponent]
    });
    fixture = TestBed.createComponent(Gravity2025DialogEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
