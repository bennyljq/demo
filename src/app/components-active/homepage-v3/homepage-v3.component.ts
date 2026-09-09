import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface PolymathFacet {
  title: string;
  discipline: 'science' | 'engineering' | 'arts';
  annotation: string;
  glyph: string;
}

export interface NavPortal {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  route: string;
  meta: string;
}

@Component({
  selector: 'app-homepage-v3',
  templateUrl: './homepage-v3.component.html',
  styleUrls: ['./homepage-v3.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomepageV3Component {
  readonly name = 'Benny Lim';
  readonly location = 'Singapore · 01°17′N 103°51′E';
  readonly year = new Date().getFullYear();

  // Curated Polymath Facets
  readonly facets: PolymathFacet[] = [
    {
      title: 'Physicist',
      discipline: 'science',
      annotation: 'Celestial dynamics, n-body gravitational systems & statistical thermodynamics.',
      glyph: 'ψ'
    },
    {
      title: 'Mathematician',
      discipline: 'science',
      annotation: 'Number theory, prime gaps, discrete geometry & analytical rigor.',
      glyph: 'π'
    },
    {
      title: 'Software Engineer',
      discipline: 'engineering',
      annotation: 'High-performance interactive engines, deterministic systems & web architectures.',
      glyph: 'λ'
    },
    {
      title: 'Web Developer',
      discipline: 'engineering',
      annotation: 'Artisanal digital craft, tactile micro-interactions & responsive typography.',
      glyph: '⌥'
    },
    {
      title: 'Data Scientist',
      discipline: 'engineering',
      annotation: 'Stochastic simulations, Brownian motion analysis & data-driven insights.',
      glyph: 'σ'
    },
    {
      title: 'Pianist',
      discipline: 'arts',
      annotation: 'Chopin nocturnes, polyphonic Bach counterpoint & acoustic resonance.',
      glyph: '𝄞'
    },
    {
      title: 'Baker',
      discipline: 'arts',
      annotation: 'Wild fermentation, dough hydration kinetics & wood-fired crust craft.',
      glyph: '♨'
    },
    {
      title: 'Godfather',
      discipline: 'arts',
      annotation: 'Lifelong mentorship, moral compass & playful stewardship.',
      glyph: '✦'
    },
    {
      title: 'Gamer',
      discipline: 'arts',
      annotation: 'Systemic game mechanics, spatial puzzles & ludic design.',
      glyph: '⚂'
    }
  ];

  // Navigation Portals
  readonly portals: NavPortal[] = [
    {
      id: 'portal-about',
      index: '01',
      title: 'About',
      subtitle: 'The Lore, Lineage & Journey',
      route: 'about',
      meta: 'Memoir & Background'
    },
    {
      id: 'portal-projects',
      index: '02',
      title: 'Projects',
      subtitle: 'Simulations, Engines & Craft',
      route: 'projects',
      meta: 'Selected Explorations'
    },
    {
      id: 'portal-contact',
      index: '03',
      title: 'Contact',
      subtitle: 'Correspondence & Inquiries',
      route: 'contact',
      meta: 'Direct Dispatch'
    }
  ];

  activeFacet: PolymathFacet = this.facets[0];
  isExiting: boolean = false;
  navigatingTo: string | null = null;

  constructor(
    private router: Router,
    private titleService: Title,
    private cdr: ChangeDetectorRef
  ) {
    this.titleService.setTitle("Benny Lim — Physicist, Engineer & Craftsman");
  }

  selectFacet(facet: PolymathFacet): void {
    this.activeFacet = facet;
    this.cdr.markForCheck();
  }

  goToRoute(route: string): void {
    if (this.isExiting) return;

    this.isExiting = true;
    this.navigatingTo = route;
    this.cdr.markForCheck();

    // Kinematic transition duration: 240ms (complies with 150ms–300ms guideline)
    setTimeout(() => {
      this.router.navigate([`/${route}`]);
    }, 240);
  }

  openResume(): void {
    window.open("assets/Benny's Resume - February 2026.pdf", '_blank', 'noopener,noreferrer');
  }
}

