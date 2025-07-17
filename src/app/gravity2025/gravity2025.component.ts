import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as eq from './gravity2025-equations';
import * as dec from './gravity2025-decorations';

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
  shortEdgeAU: number = 2.5; // how many Astronomical Units is the short edge
  longEdge: number;
  showFps: boolean = true;
  showAxes: boolean = false;
  showStars: boolean = true;
  rotateStars: boolean = true;
  prevFrameTimestamp: number;
  numStars: number;
  angle: number = 0;
  angleIncrement: number;
  backgroundStars: Array<eq.BackgroundStar> = [];
  extendedWidth: number;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenContext: CanvasRenderingContext2D;
  bgStarsColours = ['LemonChiffon', 'Pink', 'WhiteSmoke', 'MistyRose', 'PowderBlue'];
  celestialBodies: Array<eq.celestialBody> = []
  celestialBodyRadius: number;
  timestep: number = 0.01;
  trails: Array<any> = [];
  bodyColours = [
    { body: 'DodgerBlue', trail: 'PowderBlue' },
    { body: 'Firebrick', trail: 'Pink' },
    { body: 'DarkViolet', trail: 'Thistle' },
  ]
  bodyLocations: Array<any>;
  currentFrame: number = 0;
  isPlaying: boolean = false;
  frameRate: number = 120;
  public intervalId: ReturnType<typeof setInterval> | null = null;
  accumulatedTime: number = 0;
  maxFramesRendered: number = 20000;
  framesRendered: number;
  drawTrails: boolean = true;
  trailLength: number = 400;
  preset: number = 0;

  ngAfterViewInit() {
    this.initMaster()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.initMaster()
  }

  initMaster() {
    this.currentFrame = 0
    this.framesRendered = this.maxFramesRendered
    this.initCanvas()
    this.initBackgroundStars(this.numStars)
    this.initCelestialBodies()
    this.isPlaying = false
    this.togglePlay()
  }

  initCanvas() {
    const dpr = window.devicePixelRatio || 1;

    this.canvas = document.getElementById('gg-canvas') as HTMLCanvasElement;
    this.c = this.canvas.getContext('2d')!;

    // Logical dimensions (CSS pixels)
    const logicalWidth = window.innerWidth;
    const logicalHeight = window.innerHeight;

    // Set canvas style size (CSS size)
    this.canvas.style.width = `${logicalWidth}px`;
    this.canvas.style.height = `${logicalHeight}px`;

    // Set actual canvas resolution (device pixels)
    this.canvas.width = logicalWidth * dpr;
    this.canvas.height = logicalHeight * dpr;

    // Store logical sizes for your own calculations
    this.canvasWidth = logicalWidth;
    this.canvasHeight = logicalHeight;

    // Scale drawing to account for high DPI
    this.c.scale(dpr, dpr);

    // Now initialize based on logical dimensions
    this.canvasArea = this.canvasWidth * this.canvasHeight;
    this.shortEdge = Math.min(this.canvasWidth, this.canvasHeight);
    this.longEdge = Math.max(this.canvasWidth, this.canvasHeight);
    this.numStars = this.canvasArea * 0.0008;
    this.angleIncrement = Math.sqrt(this.canvasArea) * 0.00001 + 0.003;
    this.celestialBodyRadius = this.shortEdge * 0.03;
    this.c.lineJoin = "round";
    this.c.lineWidth = this.celestialBodyRadius * 0.1 + 1;
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

  private animate = (timestamp?: number) => {
    const now = timestamp ?? performance.now();
    
    // Frame delta
    if (!this.prevFrameTimestamp) this.prevFrameTimestamp = now;
    const delta = now - this.prevFrameTimestamp;
    this.prevFrameTimestamp = now;

    // Time-based frame update
    this.accumulatedTime += delta;
    const frameDuration = 1000 / this.frameRate;

    if (this.isPlaying) {
      while (this.accumulatedTime >= frameDuration) {
        this.currentFrame++;
        if (this.currentFrame >= this.framesRendered) {
          if (this.currentFrame == this.maxFramesRendered) {
            this.currentFrame = 0
          } else {
            this.currentFrame = this.framesRendered - 1
            this.isPlaying = false
          }
        }
        this.accumulatedTime -= frameDuration;
      }
    }

    // --- Clear Canvas ---
    this.c.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // --- Draw Rotating Background Stars ---
    if (this.showStars) {
      this.drawBackgroundStars(delta);
    }

    // --- Draw Axes ---
    if (this.showAxes) {
      dec.drawAxes(this.c, this.canvasWidth, this.canvasHeight, this.shortEdge, this.longEdge);
    }

    // --- Draw Trails ---
    if (this.drawTrails) {
      this.drawTrailHelper();
    } 

    // --- Draw Bodies ---
    this.drawBodies();

    // --- Next Frame ---
    this.animationId = requestAnimationFrame(this.animate);
  };

  private drawBodies() {
    this.c.save();
    this.c.shadowBlur = this.celestialBodyRadius * 2;

    let counter = 0;
    for (let body of this.bodyLocations[this.currentFrame]) {
      const x = body.x * (this.shortEdge / this.shortEdgeAU) + this.canvasWidth / 2;
      const y = body.y * (this.shortEdge / this.shortEdgeAU) + this.canvasHeight / 2;

      // Body fill
      this.c.beginPath();
      this.c.arc(x, y, this.celestialBodyRadius, 0, Math.PI * 2);
      this.c.shadowColor = this.c.fillStyle = this.bodyColours[counter].body;
      this.c.fill();
      this.c.closePath();

      // Body stroke
      this.c.beginPath();
      this.c.arc(x, y, this.celestialBodyRadius - this.c.lineWidth / 2, 0, Math.PI * 2);
      this.c.strokeStyle = body.trailColour;
      this.c.stroke();
      this.c.closePath();

      counter++;
    }

    this.c.restore();
  }

  drawBackgroundStars(delta) {
    this.c.save();
    this.c.translate(this.canvasWidth / 2, this.canvasHeight / 2);
    this.c.rotate(this.angle);
    this.c.translate(-this.canvasWidth / 2, -this.canvasHeight / 2);
    this.c.globalAlpha = 0.5;
    this.c.drawImage(
      this.offscreenCanvas,
      -(this.extendedWidth - this.canvasWidth) / 2,
      -(this.extendedWidth - this.canvasHeight) / 2
    );
    this.c.restore();

    if (this.rotateStars) {
      this.angle += (this.angleIncrement * delta) / 1000;
    }
  }

  initCelestialBodies() {
    this.celestialBodies = JSON.parse(JSON.stringify(eq.celestialBodyPresets[this.preset]))
    this.trails = []
    this.bodyLocations = []
    let temp = JSON.parse(JSON.stringify(eq.celestialBodyPresets[this.preset]))

    let countdown = this.trailLength + 100
    let countingDown = false
    for (let i = 0; i < this.framesRendered; i++) {
      let temp2 = []
      for (let j in temp) {
        temp2.push(
          { x: temp[j].position_x, y: temp[j].position_y }
        )
        if (Math.max(temp[j].position_x, temp[j].position_y) > 5) {
          countingDown = true
        }
      }
      if (countingDown) countdown -= 1;
      if (countdown == 0) {
        this.framesRendered = i
        break
      };
      this.bodyLocations.push(temp2)
      temp = eq.update(temp, this.timestep)
    }

    if (!this.animationId) {
      this.animate();
    }
  }

  drawTrailHelper() {
    if (this.currentFrame == 0) {
      return
    }
    const start = Math.max(0, this.currentFrame - this.trailLength);
    const trailPositions = this.bodyLocations.slice(start, this.currentFrame);
    const localTrailLength = trailPositions.length
    for (let body of this.celestialBodies) {
      const id = body.id;
      this.trails[id] = []
      for (let i = 0; i < localTrailLength; i++) {
        this.trails[id].push({
          x: trailPositions[i][id].x, y: trailPositions[i][id].y, opacity: i/localTrailLength
        })
      }
      this.c.strokeStyle = this.bodyColours[id].trail
      this.drawTrail(this.trails[id])
    }
  }
  
  private drawTrail(trailArray: Array<any>) {
    this.c.save()
    for (let i = 0; i < trailArray.length - 1; i++) {
      const { x: x1, y: y1, opacity: opacity1 } = trailArray[i];
      const { x: x2, y: y2, opacity: opacity2 } = trailArray[i + 1];
      const averageOpacity = (opacity1 + opacity2) / 2;
      this.c.globalAlpha = averageOpacity;
      this.c.beginPath();
      this.c.lineWidth = this.celestialBodyRadius * averageOpacity * 0.25;
      this.c.moveTo(x1 * (this.shortEdge/this.shortEdgeAU) + this.canvasWidth/2, y1 * (this.shortEdge/this.shortEdgeAU) + this.canvasHeight/2);
      this.c.lineTo(x2 * (this.shortEdge/this.shortEdgeAU) + this.canvasWidth/2, y2 * (this.shortEdge/this.shortEdgeAU) + this.canvasHeight/2);
      this.c.stroke();
      this.c.closePath();
    }
    this.c.restore()
  }

  toggleAnimation() {
    if (!this.animationId) {
      this.animate();
    } else {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  togglePlay() {
    if (!this.isPlaying && this.currentFrame == this.framesRendered-1) {
      this.currentFrame = 0
    }

    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.prevFrameTimestamp = 0;
      this.accumulatedTime = 0;
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      cancelAnimationFrame(this.animationId);
    }
  }
  
  toggleSpeed() {
    this.frameRate *= 2
    if (this.frameRate/60 > 32) this.frameRate = 60;
  }

  togglePreset() {
    this.preset = (this.preset + 1) % eq.celestialBodyPresets.length
    this.currentFrame = 0
    this.framesRendered = this.maxFramesRendered
    this.initCanvas()
    this.initCelestialBodies()
    this.isPlaying = false
    this.togglePlay()
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' && this.currentFrame > 0) {
      this.currentFrame -= 1;
    } else if (event.key === 'ArrowRight' && this.currentFrame < this.framesRendered-1) {
      this.currentFrame += 1;
    }
  }

}
