import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravityGameComponent } from './gravity-game.component';

describe('GravityGameComponent', () => {
  let component: GravityGameComponent;
  let fixture: ComponentFixture<GravityGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GravityGameComponent]
    });
    fixture = TestBed.createComponent(GravityGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
