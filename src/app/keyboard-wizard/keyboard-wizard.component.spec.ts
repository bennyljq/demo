import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardWizardComponent } from './keyboard-wizard.component';

describe('KeyboardWizardComponent', () => {
  let component: KeyboardWizardComponent;
  let fixture: ComponentFixture<KeyboardWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyboardWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyboardWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
