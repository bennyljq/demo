import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as eq from './gravity2025-equations';

@Component({
  selector: 'app-gravity2025',
  templateUrl: './gravity2025.component.html',
  styleUrls: ['./gravity2025.component.scss']
})
export class Gravity2025Component {
  constructor( private titleService: Title ) {
    this.titleService.setTitle("3 Body Problem");
  }
  
  public canvas: HTMLCanvasElement;
  private c!: CanvasRenderingContext2D;
  public animationId: number | null = null;
  canvasWidth: number;
  canvasHeight: number;
  canvasArea: number;
  shortEdge: number;
  longEdge: number;
  fps: number;
  showFps: boolean = true;
  showAxes: boolean = true;
  showStars: boolean = true;
  rotateStars: boolean = false;
  prevFrameTimestamp: number;
  numStars: number;
  angle: number = 0;
  angleIncrement: number;
  backgroundStars: Array<eq.BackgroundStar> = [];
  extendedWidth: number;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenContext: CanvasRenderingContext2D;
  bgStarsColours = ['LemonChiffon', 'Pink', 'WhiteSmoke', 'MistyRose', 'PowderBlue'];

  ngAfterViewInit() {
    this.initCanvas()
    this.initBackgroundStars(this.numStars)
    this.animate()
  }

  @HostListener('window:resize', ['$event'])
    onResize(event?) {
      this.initCanvas()
      this.initBackgroundStars(this.numStars)
    }

  initCanvas() {
    this.canvas = document.getElementById('gg-canvas') as HTMLCanvasElement
    this.c = this.canvas.getContext('2d')!;
    this.canvas.width = this.canvasWidth = window.innerWidth;
    this.canvas.height = this.canvasHeight = window.innerHeight;
    this.canvasArea = this.canvasWidth * this.canvasHeight;
    this.shortEdge = Math.min(this.canvasWidth, this.canvasHeight)
    this.longEdge = Math.max(this.canvasWidth, this.canvasHeight)
    this.numStars = this.canvasArea * 0.0008
    this.angleIncrement = Math.sqrt(this.canvasArea) * 0.00001 + 0.01
  }

  initBackgroundStars(numStars: number) {
    this.backgroundStars = []
    this.extendedWidth = Math.sqrt(this.canvasWidth**2 + this.canvasHeight**2);
    for (let i=0; i<numStars; i++) {
      this.backgroundStars.push(new eq.BackgroundStar(
        Math.random() * this.extendedWidth,
        Math.random() * this.extendedWidth,
        Math.random() * 1.5 + 0.5,
        this.bgStarsColours[Math.floor(Math.random()*this.bgStarsColours.length)]
      ))
    }
    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCanvas.width = this.extendedWidth;
    this.offscreenCanvas.height = this.extendedWidth;
    this.offscreenContext = this.offscreenCanvas.getContext("2d")!;
    for (let star of this.backgroundStars) {
      star.draw(this.offscreenContext);
    }
  }

  private animate = () => {
    this.c.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    let sincePrevFrame; // ms
    if (this.prevFrameTimestamp) {
      sincePrevFrame = performance.now() - this.prevFrameTimestamp
    } else {
      sincePrevFrame = 0
    }
    this.prevFrameTimestamp = performance.now()
    this.fps = Math.round(1/sincePrevFrame*1000)

    // draw rotating background stars
    if (this.showStars) {
      this.c.save();
      this.c.translate(this.canvasWidth / 2, this.canvasHeight / 2);
      this.c.rotate(this.angle);
      this.c.translate(-this.canvasWidth / 2, -this.canvasHeight / 2);
      this.c.globalAlpha = 0.8;
      this.c.drawImage(this.offscreenCanvas, 
        -(this.extendedWidth - this.canvasWidth)/2, 
        -(this.extendedWidth - this.canvasHeight)/2
      );
      this.c.restore()
      if (this.rotateStars) {
        this.angle += this.angleIncrement / 1000 * sincePrevFrame
      }
    }

    // draw axes
    if (this.showAxes) {
      this.drawAxes()
    }

    this.animationId = requestAnimationFrame(this.animate);
  }

  drawAxes() {
    this.c.strokeStyle = "white";
    this.c.lineWidth = 1;
    this.c.beginPath()
    this.c.moveTo(this.canvasWidth/2, 0);
    this.c.lineTo(this.canvasWidth/2, this.canvasHeight);
    this.c.stroke();
    this.c.beginPath()
    this.c.moveTo(0, this.canvasHeight/2);
    this.c.lineTo(this.canvasWidth, this.canvasHeight/2);
    this.c.stroke();
    this.c.beginPath()
    this.c.moveTo(this.canvasWidth/2 - this.shortEdge/2 + this.shortEdge*0.05, this.canvasHeight/2 - this.longEdge*0.01);
    this.c.lineTo(this.canvasWidth/2 - this.shortEdge/2 + this.shortEdge*0.05, this.canvasHeight/2 + this.longEdge*0.01);
    this.c.stroke();
    this.c.beginPath()
    this.c.moveTo(this.canvasWidth/2 + this.shortEdge/2 - this.shortEdge*0.05, this.canvasHeight/2 - this.longEdge*0.01);
    this.c.lineTo(this.canvasWidth/2 + this.shortEdge/2 - this.shortEdge*0.05, this.canvasHeight/2 + this.longEdge*0.01);
    this.c.stroke();
    this.c.beginPath()
    this.c.moveTo(this.canvasWidth/2 - this.longEdge*0.01, this.canvasHeight/2 - this.shortEdge/2 + this.shortEdge*0.05);
    this.c.lineTo(this.canvasWidth/2 + this.longEdge*0.01, this.canvasHeight/2 - this.shortEdge/2 + this.shortEdge*0.05);
    this.c.stroke();
    this.c.beginPath()
    this.c.moveTo(this.canvasWidth/2 - this.longEdge*0.01, this.canvasHeight/2 + this.shortEdge/2 - this.shortEdge*0.05);
    this.c.lineTo(this.canvasWidth/2 + this.longEdge*0.01, this.canvasHeight/2 + this.shortEdge/2 - this.shortEdge*0.05);
    this.c.stroke();
  }
}
