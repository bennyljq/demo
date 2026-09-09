import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactContentsComponent } from './contact-contents.component';

describe('ContactContentsComponent', () => {
  let component: ContactContentsComponent;
  let fixture: ComponentFixture<ContactContentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactContentsComponent]
    });
    fixture = TestBed.createComponent(ContactContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
