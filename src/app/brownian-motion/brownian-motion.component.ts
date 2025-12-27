import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Ball } from './brownian-motion.objects';

@Component({
  selector: 'app-brownian-motion',
  templateUrl: './brownian-motion.component.html',
  styleUrls: ['./brownian-motion.component.scss']
})
export class BrownianMotionComponent {
  constructor(private titleService: Title) {
    this.titleService.setTitle("Brownian Motion");
  }

  private c!: CanvasRenderingContext2D;
  public animationId: number | null = null;
  canvasWidth: number;
  canvasHeight: number;
  balls: Ball[] = [];

  mouseInCanvas = false;
  mouseX = 0;
  mouseY = 0;

  /** 👇 NEW: store all active touches here */
  activeTouches: { id: number; x: number; y: number }[] = [];

  ngAfterViewInit() {
    this.initCanvas();
    this.initBalls();
    this.animate();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.initCanvas();
    this.initBalls();
  }

  initCanvas() {
    const canvas = document.getElementById('g2-canvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.c = canvas.getContext('2d')!;
    this.canvasWidth = this.c.canvas.width;
    this.canvasHeight = this.c.canvas.height;
  }

  initBalls() {
    this.balls = [];
    const minSpeed = 0.00;
    const varSpeed = (this.canvasWidth + this.canvasHeight) / 1600;
    const density = 2; // balls per 1000 pixels
    const area = this.canvasWidth * this.canvasHeight;
    const minBalls = 1000;
    const numBalls = Math.max(minBalls, density * area / 1000);
    const colours = ['MistyRose', 'MediumOrchid', 'MidnightBlue', 'Maroon', 'MediumSlateBlue'];

    for (let i = 0; i < numBalls; i++) {
      const radius = Math.random() * 5 + 5;
      const x = Math.random() * (this.canvasWidth - 20) + 10;
      const y = Math.random() * (this.canvasHeight - 20) + 10;
      const dx = (Math.random() * varSpeed + minSpeed) * [-1, 1][Math.floor(Math.random() * 2)];
      const dy = (Math.random() * varSpeed + minSpeed) * [-1, 1][Math.floor(Math.random() * 2)];
      const col = colours[Math.floor(Math.random() * colours.length)];
      this.balls.push(new Ball(x, y, dx, dy, radius, col));
    }
  }

  private animate = () => {
    this.c.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.balls.forEach(ball => {
      ball.update(this.canvasWidth, this.canvasHeight, this.c, this.mouseInCanvas, this.mouseX, this.mouseY, this.activeTouches);
    });
    this.animationId = requestAnimationFrame(this.animate);
  }

  // ===========================
  // 🖱️ MOUSE EVENTS (unchanged)
  // ===========================
  onMouseMove(event: MouseEvent) {
    this.mouseInCanvas = true;
    this.mouseX = event.x;
    this.mouseY = event.y;
  }

  onMouseEnter(event: MouseEvent) {
    this.mouseInCanvas = true;
    this.mouseX = event.x;
    this.mouseY = event.y;
  }

  onMouseLeave(event: MouseEvent) {
    this.mouseInCanvas = false;
  }

  // ===========================
  // 👆 TOUCH EVENTS (multi-touch)
  // ===========================
  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    this.mouseInCanvas = true;

    this.activeTouches = [];
    for (let i = 0; i < event.touches.length; i++) {
      const t = event.touches[i];
      this.activeTouches.push({ id: t.identifier, x: t.clientX, y: t.clientY });
    }
  }

  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    this.mouseInCanvas = true;

    this.activeTouches = [];
    for (let i = 0; i < event.touches.length; i++) {
      const t = event.touches[i];
      this.activeTouches.push({ id: t.identifier, x: t.clientX, y: t.clientY });
    }
  }

  onTouchEnd(event: TouchEvent) {
    event.preventDefault();

    this.activeTouches = [];
    for (let i = 0; i < event.touches.length; i++) {
      const t = event.touches[i];
      this.activeTouches.push({ id: t.identifier, x: t.clientX, y: t.clientY });
    }

    this.mouseInCanvas = this.activeTouches.length > 0;
  }

  // ===========================
  // ▶️ ANIMATION CONTROLS
  // ===========================
  playAnimation() {
    if (!this.animationId) {
      this.animate();
    }
  }

  pauseAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
