import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { applyCommands, createRun, HEADWAY_COSTS, headwayTicks, Phase, Run, step, TICKS_PER_SECOND } from './simulation';
import { Palette, renderBoard } from './renderer';

interface Hud {
  phase: Phase;
  pending: Phase | null;
  clearing: boolean;
  completed: number;
  credits: number;
  level: number;
  headway: number;
  queues: number;
  backlog: number;
  seconds: number;
}

@Component({
  selector: 'app-traffic',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './traffic.component.html',
  styleUrl: './traffic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficComponent implements AfterViewInit, OnDestroy {
  @ViewChild('board', { static: true }) private board!: ElementRef<HTMLCanvasElement>;
  private run: Run = createRun();
  private ctx: CanvasRenderingContext2D | null = null;
  private palette!: Palette;
  private frameId = 0;
  private lastFrame = 0;
  private accumulator = 0;
  private lastHudTick = -1;
  private resizeObserver?: ResizeObserver;
  readonly paused = signal(false);
  readonly hud = signal<Hud>(this.snapshot());
  readonly costs = HEADWAY_COSTS;

  constructor(private readonly zone: NgZone, private readonly host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const canvas = this.board.nativeElement;
    this.ctx = canvas.getContext('2d');
    const styles = getComputedStyle(this.host.nativeElement);
    const token = (name: string) => styles.getPropertyValue(`--traffic-${name}`).trim();
    this.palette = {
      bg: token('bg'), surface: token('surface'), road: token('road'), marking: token('marking'),
      flow: token('flow'), wait: token('wait'), text: token('text'), danger: token('danger'),
    };
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.resize();
    this.zone.runOutsideAngular(() => this.frameId = requestAnimationFrame(this.frame));
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.frameId);
    this.resizeObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private readonly onVisibility = (): void => {
    if (document.hidden) {
      this.paused.set(true);
      this.accumulator = 0;
      this.lastFrame = 0;
    }
  };

  private readonly frame = (now: number): void => {
    if (!this.paused()) {
      if (this.lastFrame) this.accumulator += Math.min(now - this.lastFrame, 200);
      let count = 0;
      while (this.accumulator >= 1000 / TICKS_PER_SECOND && count < 5) {
        step(this.run);
        this.accumulator -= 1000 / TICKS_PER_SECOND;
        count++;
      }
      if (count === 5) this.accumulator = 0;
      if (count && (this.run.tick - this.lastHudTick >= 3 || this.run.clearing)) this.publish();
    }
    this.lastFrame = now;
    this.draw();
    this.frameId = requestAnimationFrame(this.frame);
  };

  private snapshot(): Hud {
    return {
      phase: this.run.phase, pending: this.run.pending, clearing: this.run.clearing,
      completed: this.run.completed, credits: this.run.credits, level: this.run.headwayLevel,
      headway: headwayTicks(this.run) / TICKS_PER_SECOND,
      queues: Object.values(this.run.queues).reduce((sum, lane) => sum + lane.length, 0),
      backlog: Object.values(this.run.backlog).reduce((sum, lane) => sum + lane.length, 0),
      seconds: Math.floor(this.run.tick / TICKS_PER_SECOND),
    };
  }

  private publish(): void {
    this.lastHudTick = this.run.tick;
    this.hud.set(this.snapshot());
  }

  private resize(): void {
    const canvas = this.board.nativeElement;
    const size = Math.max(1, Math.round(canvas.getBoundingClientRect().width * Math.min(devicePixelRatio || 1, 2)));
    canvas.width = size;
    canvas.height = size;
    this.ctx?.setTransform(size / 600, 0, 0, size / 600, 0, 0);
    this.draw();
  }

  private draw(): void {
    if (this.ctx && this.palette) renderBoard(this.ctx, this.run, this.palette);
  }

  request(phase: Phase): void {
    applyCommands(this.run, [{ type: 'switch', phase }]);
    this.publish();
    this.draw();
  }

  buy(): void {
    applyCommands(this.run, [{ type: 'buy-headway' }]);
    this.publish();
    this.draw();
  }

  togglePause(): void {
    this.paused.update(value => !value);
    this.accumulator = 0;
    this.lastFrame = 0;
  }

  restart(): void {
    this.run = createRun();
    this.paused.set(false);
    this.accumulator = 0;
    this.lastFrame = 0;
    this.publish();
    this.draw();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (event.key === '1' || event.key === '2') {
      event.preventDefault();
      this.request(event.key === '1' ? 'ns' : 'ew');
    } else if (event.code === 'Space') {
      event.preventDefault();
      this.togglePause();
    }
  }
}
