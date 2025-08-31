import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gravity2025DialogGalleryComponent } from './gravity2025-dialog-gallery.component';

describe('Gravity2025DialogGalleryComponent', () => {
  let component: Gravity2025DialogGalleryComponent;
  let fixture: ComponentFixture<Gravity2025DialogGalleryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Gravity2025DialogGalleryComponent]
    });
    fixture = TestBed.createComponent(Gravity2025DialogGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
