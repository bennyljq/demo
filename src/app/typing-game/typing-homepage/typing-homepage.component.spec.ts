import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingHomepageComponent } from './typing-homepage.component';

describe('TypingHomepageComponent', () => {
  let component: TypingHomepageComponent;
  let fixture: ComponentFixture<TypingHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypingHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypingHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
