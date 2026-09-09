import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HomepageV3Component } from './homepage-v3.component';

describe('HomepageV3Component', () => {
  let component: HomepageV3Component;
  let fixture: ComponentFixture<HomepageV3Component>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [HomepageV3Component],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageV3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the artisanal homepage component', () => {
    expect(component).toBeTruthy();
  });

  it('should have Benny Lim and polymath facets defined', () => {
    expect(component.name).toContain('Benny');
    expect(component.facets.length).toBeGreaterThan(0);
    expect(component.portals.length).toBe(3);
  });

  it('should update active facet when selectFacet is called', () => {
    const targetFacet = component.facets[1];
    component.selectFacet(targetFacet);
    expect(component.activeFacet).toBe(targetFacet);
  });

  it('should set isExiting to true and navigate on goToRoute', (done) => {
    component.goToRoute('projects');
    expect(component.isExiting).toBeTrue();
    expect(component.navigatingTo).toBe('projects');

    setTimeout(() => {
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/projects']);
      done();
    }, 260);
  });
});

