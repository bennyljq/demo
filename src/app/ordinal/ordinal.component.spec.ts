import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdinalComponent } from './ordinal.component';

describe('OrdinalComponent', () => {
  let component: OrdinalComponent;
  let fixture: ComponentFixture<OrdinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdinalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
