import {
  Component, AfterViewInit, OnDestroy,
  ElementRef, ViewChild, HostListener,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  Body, Flash, ScoreEntry,
  PALETTE, SUN_PALETTE, G,
  LB_KEY, LB_MAX,
} from './gravity-slop.objects';
import { newBody, step, bodyRadius, resetUID } from './physics.engine';
import { renderPlanetTexture, renderDebrisTexture, drawSun } from './planet-renderer';
import { SoundManager } from './sound.manager';

@Component({
  selector: 'app-gravity-slop',
  templateUrl: './gravity-slop.component.html',
  styleUrls: ['./gravity-slop.component.scss'],
  standalone: false,
})
export class GravitySlopComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvas') cvRef!: ElementRef<HTMLCanvasElement>;

  // ── Canvas / rendering ─────────────────────────────────────────────────────
  private cv!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private offCv!: HTMLCanvasElement;                  // pre-rendered starfield

  /** Texture cache: body.id → pre-rendered offscreen canvas. */
  private texCache = new Map<number, HTMLCanvasElement>();

  // ── Simulation state ────────────────────────────────────────────────────────
  private bodies: Body[]   = [];
  private flashes: Flash[] = [];

  private rafId: number | null = null;
  private lastTs    = 0;
  private frameTick = 0;
  private fpsArr: number[] = [];
  private nowTs = 0; // current timestamp passed into render

  private w = 0;
  private h = 0;
  private starAngle    = 0;
  private starAngleInc = 0;

  // ── Sound ───────────────────────────────────────────────────────────────────
  private sfx = new SoundManager();
  private sfxReady = false; // initialised on first user gesture
  muted = false;

  // ── HUD (bound to template) ─────────────────────────────────────────────────
  paused         = false;
  score          = 0;
  collisionCount = 0;
  bodyCount      = 0;
  fps            = 60;
  sessionStart   = 0;
  sessionSecs    = 0;
  comboN         = 0;
  showLb         = false;
  leaderboard: ScoreEntry[] = [];

  private lastHit   = 0;
  private COMBO_WIN = 2500;

  // ── Throw mechanic ──────────────────────────────────────────────────────────
  private dragging = false;
  private p0 = { x: 0, y: 0 };
  private p1 = { x: 0, y: 0 };
  private readonly THROW_K  = 2.4;
  private readonly MIN_DRAG = 12;

  // ───────────────────────────────────────────────────────────────────────────

  constructor(private title: Title) {
    title.setTitle('Gravity Slop');
  }

  ngAfterViewInit(): void {
    this.cv  = this.cvRef.nativeElement;
    this.initCanvas();
    this.buildStarfield();
    this.newGame();
    this.loadLb();
    this.rafId = requestAnimationFrame(ts => this.loop(ts));
  }

  @HostListener('window:resize')
  onResize(): void {
    this.initCanvas();
    this.buildStarfield();
  }

  // ── Canvas setup ──────────────────────────────────────────────────────────

  private initCanvas(): void {
    this.w = this.cv.width  = window.innerWidth;
    this.h = this.cv.height = window.innerHeight;
    this.ctx = this.cv.getContext('2d')!;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap  = 'round';
    this.starAngleInc = 0.00006 + Math.random() * 0.00003;
  }

  private buildStarfield(): void {
    const ext = Math.ceil(Math.hypot(this.w, this.h));
    this.offCv = document.createElement('canvas');
    this.offCv.width = this.offCv.height = ext;
    const oc = this.offCv.getContext('2d')!;
    oc.fillStyle = '#020409';
    oc.fillRect(0, 0, ext, ext);
    const n    = Math.round(this.w * this.h * 0.00058);
    const cols = ['#FFFFFF', '#FFF9C4', '#BBDEFB', '#FFDDE1', '#E8EAF6'];
    for (let i = 0; i < n; i++) {
      const r = Math.random() * 1.7 + 0.2;
      oc.globalAlpha = Math.random() * 0.55 + 0.22;
      oc.fillStyle   = cols[Math.floor(Math.random() * cols.length)];
      oc.beginPath();
      oc.arc(Math.random() * ext, Math.random() * ext, r, 0, Math.PI * 2);
      oc.fill();
    }
    oc.globalAlpha = 1;
  }

  // ── Texture cache ─────────────────────────────────────────────────────────

  /**
   * Return (or generate + cache) the pre-rendered texture for a body.
   * Planets and debris get a static offscreen canvas generated once.
   * Suns are drawn live every frame via drawSun() — no texture needed.
   */
  private getTexture(b: Body): HTMLCanvasElement | null {
    if (b.type === 'sun') return null; // drawn live
    if (this.texCache.has(b.id)) return this.texCache.get(b.id)!;

    const tex = b.type === 'debris'
      ? renderDebrisTexture(b.radius, b.colour, b.glowColour, b.id)
      : renderPlanetTexture(b.radius, b.colour, b.glowColour, b.id);

    this.texCache.set(b.id, tex);
    return tex;
  }

  /** Evict textures for bodies that no longer exist. */
  private pruneTexCache(livingIds: Set<number>): void {
    for (const id of this.texCache.keys()) {
      if (!livingIds.has(id)) this.texCache.delete(id);
    }
  }

  // ── Game lifecycle ────────────────────────────────────────────────────────

  newGame(): void {
    resetUID();
    this.bodies        = [];
    this.flashes       = [];
    this.texCache.clear();
    this.score         = 0;
    this.collisionCount = 0;
    this.comboN        = 0;
    this.lastHit       = 0;
    this.sessionStart  = Date.now();
    this.sessionSecs   = 0;
    this.dragging      = false;
    this.generateWorld();
  }

  private generateWorld(): void {
    const rng = (a: number, b: number) => a + Math.random() * (b - a);
    const cx  = this.w / 2;
    const cy  = this.h / 2;

    const dualSun = Math.random() < 0.38;

    if (dualSun) {
      const d  = rng(190, 310);
      const m1 = rng(7000, 12000);
      const m2 = rng(6000, 11000);
      const x1 = cx - d / 2;
      const y1 = cy + rng(-45, 45);
      const x2 = cx + d / 2;
      const y2 = cy + rng(-45, 45);
      const realD  = Math.hypot(x2 - x1, y2 - y1);
      const sepX   = (x2 - x1) / realD;
      const sepY   = (y2 - y1) / realD;
      const perpX  = -sepY;
      const perpY  =  sepX;
      const omega  = Math.sqrt(G * (m1 + m2) / (realD * realD * realD));
      const r1     = realD * m2 / (m1 + m2);
      const r2     = realD * m1 / (m1 + m2);
      const dir    = Math.random() < 0.5 ? 1 : -1;
      const p1pal  = SUN_PALETTE[0];
      const p2pal  = SUN_PALETTE[1 % SUN_PALETTE.length];

      this.bodies.push(newBody(x1, y1,
         dir * omega * r1 * perpX,
         dir * omega * r1 * perpY,
         m1, 'sun', p1pal.fill, p1pal.glow));

      this.bodies.push(newBody(x2, y2,
        -dir * omega * r2 * perpX,
        -dir * omega * r2 * perpY,
         m2, 'sun', p2pal.fill, p2pal.glow));
    } else {
      const mass = rng(9000, 18000);
      const pal  = SUN_PALETTE[Math.floor(Math.random() * SUN_PALETTE.length)];
      this.bodies.push(newBody(
        cx + rng(-55, 55), cy + rng(-55, 55),
        0, 0, mass, 'sun', pal.fill, pal.glow,
      ));
    }

    const primarySun = this.bodies[0];
    const numP       = 4 + Math.floor(Math.random() * 5);
    const angUsed: number[] = [];
    const minOrb  = primarySun.radius * 2.8 + 55;
    const maxOrb  = Math.min(this.w, this.h) * 0.40;

    for (let i = 0; i < numP; i++) {
      let ang: number;
      let tries = 0;
      do {
        ang = Math.random() * Math.PI * 2;
        tries++;
      } while (
        tries < 30 &&
        angUsed.some(a => Math.abs(((ang - a + Math.PI) % (Math.PI * 2)) - Math.PI) < 0.4)
      );
      angUsed.push(ang);

      const r     = rng(minOrb, maxOrb);
      const px    = primarySun.x + Math.cos(ang) * r;
      const py    = primarySun.y + Math.sin(ang) * r;
      const vOrb  = Math.sqrt(G * primarySun.mass / r);
      const perturb = rng(0.78, 1.22);
      const cw    = Math.random() < 0.78;
      const pvx   = (cw ? -1 : 1) * Math.sin(ang) * vOrb * perturb;
      const pvy   = (cw ?  1 : -1) * Math.cos(ang) * vOrb * perturb;

      const mass = rng(400, 3200);
      const pal  = PALETTE[i % PALETTE.length];
      this.bodies.push(newBody(px, py, pvx, pvy, mass, 'planet', pal.fill, pal.glow));
    }

    if (Math.random() < 0.45) {
      const ang  = Math.random() * Math.PI * 2;
      const r    = rng(80, Math.min(this.w, this.h) * 0.44);
      const pal  = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const mass = rng(900, 4200);
      this.bodies.push(newBody(
        cx + Math.cos(ang) * r, cy + Math.sin(ang) * r,
        rng(-35, 35), rng(-35, 35),
        mass, 'planet', pal.fill, pal.glow,
      ));
    }

    this.bodyCount = this.bodies.length;
  }

  // ── Animation loop ────────────────────────────────────────────────────────

  private loop = (ts: number): void => {
    this.nowTs = ts;
    const dt = this.lastTs === 0 ? 1 / 60 : Math.min((ts - this.lastTs) / 1000, 1 / 30);
    this.lastTs = ts;

    this.fpsArr.push(1 / Math.max(dt, 0.001));
    if (this.fpsArr.length > 30) this.fpsArr.shift();

    if (!this.paused) {
      const prevIds = new Set(this.bodies.map(b => b.id));
      this.bodies = step(this.bodies, dt, this.flashes, this.onHit.bind(this));
      this.score += dt * 0.3;
      this.sessionSecs = (Date.now() - this.sessionStart) / 1000;

      // Prune textures for bodies destroyed this frame.
      const newIds = new Set(this.bodies.map(b => b.id));
      if (prevIds.size !== newIds.size) this.pruneTexCache(newIds);
    }

    this.render();

    this.frameTick++;
    if (this.frameTick % 15 === 0) {
      this.fps       = Math.round(this.fpsArr.reduce((a, b) => a + b, 0) / this.fpsArr.length);
      this.bodyCount = this.bodies.length;
    }

    this.rafId = requestAnimationFrame(ts => this.loop(ts));
  };

  // ── Rendering ─────────────────────────────────────────────────────────────

  private render(): void {
    const c = this.ctx;
    c.clearRect(0, 0, this.w, this.h);

    // Starfield.
    c.save();
    c.translate(this.w / 2, this.h / 2);
    c.rotate(this.starAngle);
    const ext = this.offCv.width;
    c.drawImage(this.offCv, -ext / 2, -ext / 2);
    c.restore();
    this.starAngle += this.starAngleInc;

    this.drawTrails(c);
    this.drawFlashes(c);
    this.drawBodies(c);
    if (this.dragging) this.drawPreview(c);
  }

  private drawTrails(c: CanvasRenderingContext2D): void {
    for (const b of this.bodies) {
      const t = b.trail;
      if (t.length < 2) continue;
      const tail  = t[t.length - 1];
      const alpha = b.type === 'debris' ? 0.38 : 0.68;
      c.save();
      const grad = c.createLinearGradient(b.x, b.y, tail.x, tail.y);
      grad.addColorStop(0, this.rgba(b.colour, alpha));
      grad.addColorStop(1, this.rgba(b.colour, 0));
      c.strokeStyle = grad;
      c.lineWidth   = b.type === 'debris'
        ? Math.max(b.radius * 0.20 + 0.3, 0.5)
        : Math.max(b.radius * 0.28 + 0.6, 0.9);
      c.beginPath();
      c.moveTo(t[0].x, t[0].y);
      for (let k = 1; k < t.length; k++) c.lineTo(t[k].x, t[k].y);
      c.stroke();
      c.restore();
    }
  }

  /**
   * Draw bodies using the renderer hierarchy:
   *   Sun    → drawSun() — live animated multi-layer procedural
   *   Planet → pre-rendered Phong sphere (drawImage, clipped to circle)
   *   Debris → pre-rendered irregular polygon (drawImage, no clip needed)
   */
  private drawBodies(c: CanvasRenderingContext2D): void {
    for (const b of this.bodies) {
      const r = b.radius;

      if (b.type === 'sun') {
        // Sun: animated, drawn directly to main canvas.
        drawSun(c, b.x, b.y, r, b.colour, b.glowColour, this.nowTs, b.id);
        continue;
      }

      const tex = this.getTexture(b);
      if (!tex) continue;

      if (b.type === 'planet') {
        // Planet: clip to circle, blit Phong texture, add glow via shadow.
        c.save();
        c.shadowBlur  = r * 1.4;
        c.shadowColor = b.glowColour;
        c.beginPath();
        c.arc(b.x, b.y, r, 0, Math.PI * 2);
        c.clip();
        c.drawImage(tex, b.x - r, b.y - r, r * 2, r * 2);
        c.restore();

        // Atmosphere rim — additive halo just outside the sphere.
        c.save();
        const atmo = c.createRadialGradient(b.x, b.y, r * 0.85, b.x, b.y, r * 1.35);
        atmo.addColorStop(0, this.rgba(b.glowColour, 0.22));
        atmo.addColorStop(1, this.rgba(b.glowColour, 0));
        c.beginPath(); c.arc(b.x, b.y, r * 1.35, 0, Math.PI * 2);
        c.fillStyle = atmo; c.fill();
        c.restore();

      } else {
        // Debris: blit irregular polygon texture (already has alpha border).
        const pad  = 4;
        const size = tex.width;
        c.save();
        c.shadowBlur  = r * 0.9;
        c.shadowColor = b.glowColour;
        c.drawImage(tex, b.x - size / 2 + pad / 2, b.y - size / 2 + pad / 2, size - pad, size - pad);
        c.shadowBlur = 0;
        c.restore();
      }
    }
  }

  private drawFlashes(c: CanvasRenderingContext2D): void {
    this.flashes = this.flashes.filter(f => f.t < f.maxT);
    for (const f of this.flashes) {
      const progress = f.t / f.maxT;
      const r  = f.maxR * Math.sin(progress * Math.PI);
      if (r < 1) { f.t++; continue; }
      const al = 1 - progress;
      c.save();
      c.globalCompositeOperation = 'screen';
      const gr = c.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
      gr.addColorStop(0,   `rgba(255,255,255,${al.toFixed(2)})`);
      gr.addColorStop(0.4,  this.rgba(f.colour, al * 0.85));
      gr.addColorStop(1,   'rgba(0,0,0,0)');
      c.beginPath(); c.arc(f.x, f.y, r, 0, Math.PI * 2);
      c.fillStyle = gr; c.fill();
      c.restore();
      f.t++;
    }
  }

  private drawPreview(c: CanvasRenderingContext2D): void {
    const dx = this.p1.x - this.p0.x;
    const dy = this.p1.y - this.p0.y;
    const d  = Math.hypot(dx, dy);
    if (d < this.MIN_DRAG) return;

    const mass = Math.min(400 + d * 25, 5000);
    const r    = bodyRadius(mass, 'planet');

    // Ghost planet — simple sphere (preview texture not cached, keep cheap).
    c.save();
    c.globalAlpha = 0.38;
    c.shadowBlur  = r * 2;
    c.shadowColor = '#88CCFF';
    const gr = c.createRadialGradient(
      this.p0.x - r * 0.3, this.p0.y - r * 0.3, r * 0.04,
      this.p0.x, this.p0.y, r,
    );
    gr.addColorStop(0, '#FFFFFF');
    gr.addColorStop(0.28, '#88CCFF');
    gr.addColorStop(1, '#224488');
    c.beginPath(); c.arc(this.p0.x, this.p0.y, r, 0, Math.PI * 2);
    c.fillStyle = gr; c.fill();
    c.shadowBlur = 0;
    c.restore();

    // Simulated trajectory.
    const pDt = 1 / 28;
    let sx = this.p0.x, sy = this.p0.y;
    let svx = dx * this.THROW_K, svy = dy * this.THROW_K;

    c.save();
    c.setLineDash([5, 8]);
    c.strokeStyle = 'rgba(136,204,255,0.50)';
    c.lineWidth   = 1.5;
    c.beginPath(); c.moveTo(sx, sy);
    for (let s = 0; s < 90; s++) {
      let ax = 0, ay = 0;
      for (const b of this.bodies) {
        const bx = b.x - sx, by = b.y - sy;
        const d2 = bx * bx + by * by + 625;
        const df = Math.sqrt(d2);
        const f  = G * b.mass / d2;
        ax += f * bx / df; ay += f * by / df;
      }
      svx += ax * pDt; svy += ay * pDt;
      sx  += svx * pDt; sy  += svy * pDt;
      c.lineTo(sx, sy);
      if (sx < -250 || sx > this.w + 250 || sy < -250 || sy > this.h + 250) break;
      if (this.bodies.some(b => (b.x - sx) ** 2 + (b.y - sy) ** 2 < b.radius * b.radius)) break;
    }
    c.stroke();
    c.setLineDash([]);
    c.globalAlpha = 0.26;
    c.strokeStyle = '#FFFFFF'; c.lineWidth = 1;
    c.beginPath(); c.moveTo(this.p0.x, this.p0.y); c.lineTo(this.p1.x, this.p1.y);
    c.stroke();
    c.restore();
  }

  // ── Input — Mouse ─────────────────────────────────────────────────────────

  onMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return;
    this.initSfx();
    this.dragging = true;
    this.p0 = this.p1 = { x: e.clientX, y: e.clientY };
  }

  onMouseMove(e: MouseEvent): void {
    if (this.dragging) this.p1 = { x: e.clientX, y: e.clientY };
  }

  onMouseUp(e: MouseEvent): void {
    if (!this.dragging) return;
    this.dragging = false;
    this.launch(this.p0, this.p1);
  }

  onMouseLeave(): void { this.dragging = false; }

  // ── Input — Touch ─────────────────────────────────────────────────────────

  onTouchStart(e: TouchEvent): void {
    e.preventDefault();
    this.initSfx();
    const t = e.changedTouches[0];
    this.dragging = true;
    this.p0 = this.p1 = { x: t.clientX, y: t.clientY };
  }

  onTouchMove(e: TouchEvent): void {
    e.preventDefault();
    if (!this.dragging) return;
    this.p1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  onTouchEnd(e: TouchEvent): void {
    e.preventDefault();
    if (!this.dragging) return;
    this.dragging = false;
    this.launch(this.p0, this.p1);
  }

  private launch(s: { x: number; y: number }, e: { x: number; y: number }): void {
    const dx = e.x - s.x, dy = e.y - s.y;
    const d  = Math.hypot(dx, dy);
    if (d < this.MIN_DRAG) return;
    this.sfx.play('laser', 0.25);
    const mass = Math.min(400 + d * 25, 5000);
    const pal  = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    this.bodies = [
      ...this.bodies,
      newBody(s.x, s.y, dx * this.THROW_K, dy * this.THROW_K, mass, 'planet', pal.fill, pal.glow),
    ];
  }

  // ── Keyboard shortcuts ────────────────────────────────────────────────────

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (e.target !== document.body) return;
    if (e.key === ' ' || e.key === 'p') { e.preventDefault(); this.togglePause(); }
    if (e.key === 'r' || e.key === 'R') this.resetGame();
    if (e.key === 'l' || e.key === 'L') this.toggleLb();
    if (e.key === 'm' || e.key === 'M') this.toggleMute();
    if (e.key === 'Escape')             this.showLb = false;
  }

  // ── Sound ─────────────────────────────────────────────────────────────────

  /** Lazy-init SoundManager on first user gesture (browser autoplay policy). */
  private initSfx(): void {
    if (this.sfxReady) return;
    this.sfxReady = true;
    this.sfx.init();
  }

  toggleMute(): void {
    this.initSfx();
    this.muted = this.sfx.toggleMute();
  }

  // ── Scoring ───────────────────────────────────────────────────────────────

  private onHit(mass: number, _x: number, _y: number): void {
    const now = Date.now();
    const prevCombo = this.comboN;
    this.comboN = now - this.lastHit < this.COMBO_WIN
      ? Math.min(this.comboN + 1, 8)
      : 0;
    this.lastHit = now;

    const mult = 1 + this.comboN * 0.35;
    this.score += mass * 0.009 * mult;
    this.collisionCount++;

    // Sound — vary pitch for repeated hits; use heavier sound for large masses.
    if (mass > 8000) {
      this.sfx.play('explosion', 0.12);
    } else {
      this.sfx.play('crack', 0.35);
    }

    // Combo milestone sound.
    if (this.comboN >= 3 && prevCombo < 3) {
      this.sfx.play('combo', 0.1);
    }
  }

  // ── Leaderboard ───────────────────────────────────────────────────────────

  loadLb(): void {
    try { this.leaderboard = JSON.parse(localStorage.getItem(LB_KEY) ?? '[]'); }
    catch { this.leaderboard = []; }
  }

  private saveLb(): void {
    const entry: ScoreEntry = {
      score:      Math.floor(this.score),
      collisions: this.collisionCount,
      date:       new Date().toLocaleDateString(),
      duration:   Math.floor(this.sessionSecs),
    };
    this.leaderboard = [...this.leaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, LB_MAX);
    localStorage.setItem(LB_KEY, JSON.stringify(this.leaderboard));
    this.sfx.play('save', 0);
  }

  // ── Controls ─────────────────────────────────────────────────────────────

  togglePause(): void {
    this.initSfx();
    this.sfx.play('click', 0.1);
    this.paused = !this.paused;
  }

  resetGame(): void {
    this.initSfx();
    this.sfx.play('click', 0.1);
    if (this.score > 80) this.saveLb();
    this.newGame();
    this.paused = false;
  }

  toggleLb(): void {
    this.initSfx();
    this.sfx.play('shop', 0);
    this.showLb = !this.showLb;
    if (this.showLb) this.loadLb();
  }

  // ── Utilities ────────────────────────────────────────────────────────────

  private rgba(hex: string, a: number): string {
    if (!hex || hex[0] !== '#' || hex.length < 7)
      return `rgba(128,128,128,${a.toFixed(2)})`;
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r},${g},${b},${a.toFixed(2)})`;
  }

  fmtTime(secs: number): string {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  fmtScore(n: number): string {
    return Math.floor(n).toLocaleString();
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }
}
