import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild, Inject } from '@angular/core';

@Component({
    selector: 'app-gravity2025-dialog-velocity',
    templateUrl: './gravity2025-dialog-velocity.component.html',
    styleUrls: ['./gravity2025-dialog-velocity.component.scss'],
    standalone: false
})
export class Gravity2025DialogVelocityComponent {
  dataChanges$ = new Subject<any>();

  constructor(
    public dialogRef: MatDialogRef<Gravity2025DialogVelocityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel() {
    this.dialogRef.close(null);
  }

  @ViewChild('pad', { static: true }) padRef!: ElementRef<HTMLCanvasElement>;
  @Output() velocity = new EventEmitter<{ vx: number; vy: number; mag: number }>();

  private ctx!: CanvasRenderingContext2D;
  private dragging = false;
  private dpr = Math.max(1, window.devicePixelRatio || 1);
  private w = 0; private h = 0;
  private cx = 0; private cy = 0;
  private tipX = 0; private tipY = 0;
  nx: number = 0;
  ny: number = 0;
  scale: number = 3;


  ngAfterViewInit() {
    const canvas = this.padRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    // HiDPI setup
    this.w = canvas.clientWidth;
    this.h = canvas.clientHeight;
    canvas.width  = Math.round(this.w * this.dpr);
    canvas.height = Math.round(this.h * this.dpr);
    this.ctx = canvas.getContext('2d')!;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); // scale drawing space

    // Geometry
    this.cx = this.w / 2; this.cy = this.h / 2;

    // Prevent page scrolling while dragging on touch
    canvas.style.touchAction = 'none';

    const maxR = 0.45 * Math.min(this.w, this.h);
    if (this.data.userVX) {
      this.tipX = this.cx + (this.data.userVX / this.scale) * maxR;
    }
    if (this.data.userVY) {
      this.tipY = this.cy + (this.data.userVY / this.scale) * maxR;
    }

    this.draw(); // initial grid/center
  }

  closeDialog() {
    this.dialogRef.close(); // pass the last vector back
  }

  reset() {
    this.nx = this.ny = this.tipX = this.tipY = 0
    this.sendUpdate()
    this.draw()
  }

  sendUpdate() {
    this.dataChanges$.next({
      vector: {
        v_x: this.nx,
        v_y: this.ny
      }
    });
  }

  onDown(ev: PointerEvent) {
    const canvas = this.padRef.nativeElement;
    canvas.setPointerCapture?.(ev.pointerId);
    this.dragging = true;
    this.updateTipFromEvent(ev, true);
  }

  onMove(ev: PointerEvent) {
    if (!this.dragging) return;
    this.updateTipFromEvent(ev);
  }

  onUp() {
    this.dragging = false;
    // Optionally keep the arrow or clear it:
    // this.tipX = this.cx; this.tipY = this.cy; this.draw();
  }

  private updateTipFromEvent(ev: PointerEvent, emit = false) {

    const rect = this.padRef.nativeElement.getBoundingClientRect();
    let x = ev.offsetX;
    let y = ev.offsetY;

    // Vector from center
    let dx = x - this.cx;
    let dy = y - this.cy;

    // Clamp length (optional): e.g., radius = 45% of min(w,h)
    const maxR = 0.45 * Math.min(this.w, this.h);
    const mag = Math.hypot(dx, dy);
    if (mag > maxR) {
      const k = maxR / mag;
      dx *= k; dy *= k;
      x = this.cx + dx; y = this.cy + dy;
    }

    this.tipX = x; this.tipY = y;
    this.draw();

    // Emit a velocity vector; scale however you need
    // const vx = dx;     // or dx / maxR for unit range [-1,1]
    // const vy = dy;     // note: +y is down; invert if you want up-positive
    // const m  = Math.hypot(vx, vy);
    // this.velocity.emit({ vx, vy, mag: m });

    // Normalized velocity in [-scale, +scale], zero at centre:
    this.nx = (dx / maxR) * this.scale;
    this.ny = (dy / maxR) * this.scale;   // use dy, not x!

    // Optional: clamp (in case you didn't clamp position before)
    this.nx = Math.max(-this.scale, Math.min(this.scale, this.nx));
    this.ny = Math.max(-this.scale, Math.min(this.scale, this.ny));

    this.sendUpdate();
  }

  private draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // Background + guide circle
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#e0e0e0';
    ctx.strokeStyle = 'grey';
    ctx.beginPath(); ctx.arc(this.cx, this.cy, 0.45 * Math.min(this.w, this.h), 0, Math.PI * 2); ctx.stroke();

    // Crosshair
    ctx.beginPath(); ctx.moveTo(this.cx - 8, this.cy); ctx.lineTo(this.cx + 8, this.cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(this.cx, this.cy - 8); ctx.lineTo(this.cx, this.cy + 8); ctx.stroke();

    // Arrow if dragging (or keep it always)
    const showArrow = this.dragging || (this.tipX !== 0 || this.tipY !== 0);
    if (showArrow) this.drawArrow(this.cx, this.cy, this.tipX, this.tipY);
    ctx.restore();

    // this.markPoint(this.tipX, this.tipY)
  }

  private drawArrow(x0: number, y0: number, x1: number, y1: number) {
    const ctx = this.ctx;
    const dx = x1 - x0, dy = y1 - y0;
    const ang = Math.atan2(dy, dx);

    // ---- Config (constant, not tied to arrow length) ----
    const headLen = Math.max(10, Math.hypot(dx, dy) * 0.1); // px: arrowhead length (tip → base center)
    const angleDeg = 60;             // total tip angle
    const halfAngle = (angleDeg * Math.PI) / 180 / 2; // 15°

    // ---- Geometry for the head ----
    // Base center of the triangle (shaft ends here)
    const bx = x1 - headLen * Math.cos(ang);
    const by = y1 - headLen * Math.sin(ang);

    // Half-width of the base from right triangle: tan(halfAngle) * headLen
    const halfWidth = Math.tan(halfAngle) * headLen;

    // Perpendicular unit vector to the shaft
    const nx = -Math.sin(ang);
    const ny =  Math.cos(ang);

    // Base corners
    const p1x = bx + nx * halfWidth;
    const p1y = by + ny * halfWidth;
    const p2x = bx - nx * halfWidth;
    const p2y = by - ny * halfWidth;

    // ---- Draw shaft (to the base of the head) ----
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // ---- Draw filled triangle head ----
    ctx.beginPath();
    ctx.moveTo(x1, y1);     // tip
    ctx.lineTo(p1x, p1y);   // base corner 1
    ctx.lineTo(p2x, p2y);   // base corner 2
    ctx.closePath();
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  private markPoint(x, y) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2); // circle radius = 5px
    ctx.fillStyle = "red"; // point colour
    ctx.fill();
    ctx.closePath();
  }

}