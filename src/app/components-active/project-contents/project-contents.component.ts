import { Component, ElementRef, HostListener, OnInit, ViewChild, signal, computed, TemplateRef, ChangeDetectionStrategy } from '@angular/core';

interface Project {
  id: string;
  titleHtml: string;
  subtitle: string;
  imgSrc?: string;
  imgClass?: string;
  customLogoStyles?: Record<string, string>;
  linkText: string;
  linkIcon: string;
  actionType: 'route' | 'external' | 'download';
  actionTarget?: string;
  isHovered?: boolean;
}

@Component({
  selector: 'app-project-contents',
  templateUrl: './project-contents.component.html',
  styleUrls: ['./project-contents.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ProjectContentsComponent implements OnInit {
  @ViewChild('historyContainer') historyContainer!: ElementRef<HTMLElement>;

  // Modern Angular Reactivity
  innerWidth = signal(window.innerWidth);
  isLargeScreen = computed(() => this.innerWidth() >= 1200);
  showScrollButton = signal(false);

  // Configuration Array
  projects: Project[] = [
    {
      id: 'potong', titleHtml: 'potong.io', subtitle: '2026', imgSrc: 'assets/potong/potong.gif', imgClass: 'logo',
      linkText: 'Play POTONG', linkIcon: '→', actionType: 'external', actionTarget: 'https://potong.io'
    },
    {
      id: 'keyboard_wizard', titleHtml: 'Keyboard Wizard', subtitle: '2026', imgSrc: 'assets\\keyboard-wizard-demo\\keyboard-wizard.png', imgClass: 'logo',
      linkText: 'Play the demo', linkIcon: '→', actionType: 'route', actionTarget: '/keyboard-wizard'
    },
    {
      id: 'switchyon', titleHtml: 'switchyon.llc', subtitle: '2026', imgSrc: 'assets/switchyon.png', imgClass: 'logo', customLogoStyles: { 'padding': '24px', 'background': 'white'}, 
      linkText: 'Visit Switchyon', linkIcon: '→', actionType: 'external', actionTarget: 'https://switchyon.llc'
    },
    {
      id: '3body', titleHtml: 'Three Body Problem', subtitle: '2026', imgSrc: 'assets/3body.gif', imgClass: 'logo', customLogoStyles: { 'aspect-ratio': '1' },
      linkText: 'Play with Gravity', linkIcon: '→', actionType: 'route', actionTarget: '/3body'
    },
    {
      id: 'enterprise', titleHtml: 'Enterprise Component Library', subtitle: '2021 - 2024', imgSrc: 'assets/enterprise-lib.png', imgClass: 'logo',
      linkText: 'Browse Library', linkIcon: '→', actionType: 'route', actionTarget: '/enterprise'
    },
    {
      id: 'parabola', titleHtml: 'Prime Numbers Generated From <br> Highly Composite Numbers', subtitle: '2018', imgSrc: 'assets/parabola.png', imgClass: 'logo',
      linkText: 'Read Paper', linkIcon: '→', actionType: 'external', actionTarget: 'https://www.parabola.unsw.edu.au/sites/default/files/2024-03/vol54_no3_4.pdf'
    },
    {
      id: 'physics', titleHtml: 'Everyday Electricity', subtitle: '2023', imgSrc: 'assets/electric.png', imgClass: 'logo',
      linkText: 'Start Lesson', linkIcon: '→', actionType: 'route', actionTarget: '/physics'
    },
    {
      id: 'gravity', titleHtml: 'Gravity Simulator', subtitle: '2023', imgSrc: 'assets/grav-sim.gif', imgClass: 'logo', customLogoStyles: { 'aspect-ratio': '1' },
      linkText: 'Play with Gravity', linkIcon: '→', actionType: 'route', actionTarget: '/gravity-sim'
    },
    {
      id: 'brownian2', titleHtml: 'Brownian Motion v2', subtitle: '2024', imgSrc: 'assets/brownian-motion2.gif', imgClass: 'logo', customLogoStyles: { 'aspect-ratio': '1' },
      linkText: 'Play with Particles', linkIcon: '→', actionType: 'route', actionTarget: '/brownian-motion2'
    },
    {
      id: 'brownian1', titleHtml: 'Brownian Motion', subtitle: '2024', imgSrc: 'assets/brownian-motion.gif', imgClass: 'logo', customLogoStyles: { 'aspect-ratio': '1' },
      linkText: 'Play with Particles', linkIcon: '→', actionType: 'route', actionTarget: '/brownian-motion'
    },
    {
      id: 'twinprimes', titleHtml: 'On the Infinitude of Twin Primes', subtitle: '2023 - Present', imgSrc: 'assets/twin-primes-draft.png', imgClass: 'logo',
      linkText: 'Download Article', linkIcon: '↓', actionType: 'download'
    },
    {
      id: 'snowpiercer', titleHtml: 'Project Snowpiercer', subtitle: '2024 - Present', imgSrc: 'assets/snowflake-2.png', imgClass: 'snowflake',
      customLogoStyles: { 'background-color': 'lavender', 'width': 'clamp(300px, 80vw, 500px)', 'height': 'clamp(300px, 80vw, 500px)', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' },
      linkText: 'Choo Choo', linkIcon: '→', actionType: 'route', actionTarget: '/snowpiercer'
    },
    {
      id: 'train', titleHtml: 'Train Simulator', subtitle: '2023', imgSrc: 'assets/train-sim.png', imgClass: 'logo',
      linkText: 'Choo Choo', linkIcon: '→', actionType: 'route', actionTarget: '/train'
    }
  ];

  ngOnInit(): void {
    // Initialize hover states
    this.projects.forEach(p => p.isHovered = false);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.innerWidth.set(window.innerWidth);
  }

  handleAction(project: Project) {
    if (project.actionType === 'external' && project.actionTarget) {
      window.open(project.actionTarget, '_blank');
    } else if (project.actionType === 'download') {
      this.downloadArticle();
    }
  }

  downloadArticle() {
    const link = document.createElement("a");
    link.download = "On the Infinitude of Twin Primes - Benny Lim.pdf";
    link.href = "assets/Benny_Twin_Prime.pdf";
    link.click();
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.showScrollButton.set(target.scrollTop > 200);
  }

  scrollToTop() {
    if (this.historyContainer) {
      this.historyContainer.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  @ViewChild('desc_potong', { static: true }) desc_potong!: TemplateRef<any>;
  @ViewChild('desc_enterprise', { static: true }) desc_enterprise!: TemplateRef<any>;
  @ViewChild('desc_parabola', { static: true }) desc_parabola!: TemplateRef<any>;
  @ViewChild('desc_3body', { static: true }) desc_3body!: TemplateRef<any>;
  @ViewChild('desc_physics', { static: true }) desc_physics!: TemplateRef<any>;
  @ViewChild('desc_gravity', { static: true }) desc_gravity!: TemplateRef<any>;
  @ViewChild('desc_brownian2', { static: true }) desc_brownian2!: TemplateRef<any>;
  @ViewChild('desc_brownian1', { static: true }) desc_brownian1!: TemplateRef<any>;
  @ViewChild('desc_twinprimes', { static: true }) desc_twinprimes!: TemplateRef<any>;
  @ViewChild('desc_snowpiercer', { static: true }) desc_snowpiercer!: TemplateRef<any>;
  @ViewChild('desc_train', { static: true }) desc_train!: TemplateRef<any>;
  @ViewChild('desc_switchyon', { static: true }) desc_switchyon!: TemplateRef<any>;
  @ViewChild('desc_keyboard_wizard', { static: true }) desc_keyboard_wizard!: TemplateRef<any>;

  getTemplateForId(id: string): TemplateRef<any> {
    return (this as any)[`desc_${id}`];
  }
}