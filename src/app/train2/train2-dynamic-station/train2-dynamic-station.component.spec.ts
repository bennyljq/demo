import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Train2DynamicStationComponent } from './train2-dynamic-station.component';

describe('Train2DynamicStationComponent', () => {
  let component: Train2DynamicStationComponent;
  let fixture: ComponentFixture<Train2DynamicStationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Train2DynamicStationComponent]
    });
    fixture = TestBed.createComponent(Train2DynamicStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
