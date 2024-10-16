import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Ball } from './brownian-motion.objects';

@Component({
  selector: 'app-brownian-motion',
  templateUrl: './brownian-motion.component.html',
  styleUrls: ['./brownian-motion.component.scss']
})

export class BrownianMotionComponent {
  constructor( private titleService: Title ) {
    this.titleService.setTitle("Brownian Motion");
  }
  private c!: CanvasRenderingContext2D;
  public animationId: number | null = null;
  canvasWidth: number;
  canvasHeight: number;
  balls: Ball[] = [];
  mouseInCanvas = false;
  mouseX = 0
  mouseY = 0

  ngAfterViewInit() {
    this.initCanvas()
    this.initBalls()
    this.animate();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.initCanvas()
    this.initBalls()
  }

  initCanvas() {
    const canvas = document.getElementById('g2-canvas') as HTMLCanvasElement
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
    this.c = canvas.getContext('2d')!;
    this.canvasWidth = this.c.canvas.width;
    this.canvasHeight = this.c.canvas.height;
  }

  initBalls() {
    this.balls = []
    let minSpeed = 0.00
    let varSpeed = (this.canvasWidth + this.canvasHeight)/2500
    let density = 2 // balls per 1000 pixels
    let area = this.canvasWidth * this.canvasHeight
    let minBalls = 1000
    let numBalls = Math.max(minBalls, density * area / 1000) 
    let colours = ['MistyRose', 'MediumOrchid', 'MidnightBlue', 'Maroon', 'MediumSlateBlue']
    console.log("Density:", density)
    console.log("Area:", area)
    console.log("Number of Balls:", numBalls)
    for (let i=0; i<numBalls; i++) {
      let radius = Math.random() * 5 + 5
      let x = Math.random() * (this.canvasWidth - 20) + 10
      let y = Math.random() * (this.canvasHeight - 20) + 10
      let dx = (Math.random() * varSpeed + minSpeed) * [-1, 1][Math.floor(Math.random()*2)]
      let dy = (Math.random() * varSpeed + minSpeed) * [-1, 1][Math.floor(Math.random()*2)]
      let col = colours[Math.floor(Math.random()*colours.length)]
      this.balls.push(new Ball(x, y, dx, dy, radius, col));
    }
  }

  private animate = () => {
    this.c.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.balls.forEach(ball => {
      ball.update(this.canvasWidth, this.canvasHeight, this.c, this.mouseInCanvas, this.mouseX, this.mouseY);
    });
    this.animationId = requestAnimationFrame(this.animate);
  }

  onMouseMove(event: MouseEvent) {
    this.mouseInCanvas = true
    this.mouseX = event.x
    this.mouseY = event.y
  }

  onMouseEnter(event: MouseEvent) {
    this.mouseInCanvas = true
    this.mouseX = event.x
    this.mouseY = event.y
  }

  onMouseLeave(event: MouseEvent) {
    this.mouseInCanvas = false
  }
  
  onTouchStart(event: TouchEvent) {
    event.preventDefault();
    this.mouseInCanvas = true
    const touch = event.touches[0];
    this.mouseX = touch.clientX
    this.mouseY = touch.clientY
  }
  
  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    this.mouseInCanvas = true
    const touch = event.touches[0];
    this.mouseX = touch.clientX
    this.mouseY = touch.clientY
  }

  onTouchEnd(event: TouchEvent) {
    event.preventDefault();
    this.mouseInCanvas = false
  }

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
