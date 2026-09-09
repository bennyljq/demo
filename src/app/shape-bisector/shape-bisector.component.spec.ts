import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeBisectorComponent } from './shape-bisector.component';

describe('ShapeBisectorComponent', () => {
  let component: ShapeBisectorComponent;
  let fixture: ComponentFixture<ShapeBisectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeBisectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeBisectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
