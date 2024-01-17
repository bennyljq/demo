import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Train2HomeComponent } from './train2-home.component';

describe('Train2HomeComponent', () => {
  let component: Train2HomeComponent;
  let fixture: ComponentFixture<Train2HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Train2HomeComponent]
    });
    fixture = TestBed.createComponent(Train2HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
