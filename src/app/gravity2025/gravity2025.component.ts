import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as eq from './gravity2025-equations';
import * as dec from './gravity2025-decorations';
import { MatDialog } from '@angular/material/dialog';
import { Gravity2025DialogComponent } from '../gravity2025-dialog/gravity2025-dialog.component';
import { Gravity2025DialogEditComponent } from '../gravity2025-dialog-edit/gravity2025-dialog-edit.component';

@Component({
  selector: 'app-gravity2025',
  templateUrl: './gravity2025.component.html',
  styleUrls: ['./gravity2025.component.scss']
})
export class Gravity2025Component {
  constructor( private titleService: Title, private dialog: MatDialog ) {
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
  velocityArrowScale: number;
  accelerationArrowScale: number;
  arrowHeadLength: number;
  arrowHeadAngleDeg: number = 30;
  drawVelocityArrow: boolean = true;
  drawAccelerationArrow: boolean = true;

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
    this.velocityArrowScale = this.shortEdge * 0.1;
    this.accelerationArrowScale = this.shortEdge * 0.015;
    this.arrowHeadLength = Math.sqrt(this.shortEdge) * 0.8
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
    this.drawCelestialBodies();

    // --- Next Frame ---
    this.animationId = requestAnimationFrame(this.animate);
  };

  private drawCelestialBodies() {
    this.c.save();
    this.c.shadowBlur = this.celestialBodyRadius * 2;

    let counter = 0;
    for (let body of this.bodyLocations[this.currentFrame]) {
      this.c.shadowColor = this.bodyColours[counter].body;
      const x = body.x * (this.shortEdge / this.shortEdgeAU) + this.canvasWidth / 2;
      const y = body.y * (this.shortEdge / this.shortEdgeAU) + this.canvasHeight / 2;

      if (this.drawVelocityArrow && (Math.abs(body.v_x) + Math.abs(body.v_y)) > 0.001) {
        this.c.strokeStyle = this.bodyColours[counter].trail;
        this.c.fillStyle = this.bodyColours[counter].trail;

        let arrowTipX = x + body.v_x*this.velocityArrowScale
        let arrowTipY = y + body.v_y*this.velocityArrowScale
        const angle = Math.atan2(arrowTipY - y, arrowTipX - x);
        arrowTipX += (this.celestialBodyRadius + this.arrowHeadLength) * Math.cos(angle) * 0.9
        arrowTipY += (this.celestialBodyRadius + this.arrowHeadLength) * Math.sin(angle) * 0.9
        const headAngle = (Math.PI * this.arrowHeadAngleDeg) / 180;

        const shaftX = arrowTipX - this.arrowHeadLength * Math.cos(angle) * 0.5;
        const shaftY = arrowTipY - this.arrowHeadLength * Math.sin(angle) * 0.5;

        const arrowLeftX = arrowTipX - this.arrowHeadLength * Math.cos(angle - headAngle);
        const arrowLeftY = arrowTipY - this.arrowHeadLength * Math.sin(angle - headAngle);

        const arrowRightX = arrowTipX - this.arrowHeadLength * Math.cos(angle + headAngle);
        const arrowRightY = arrowTipY - this.arrowHeadLength * Math.sin(angle + headAngle);

        // Draw arrow shaft
        this.c.beginPath();
        this.c.moveTo(x, y);
        this.c.lineTo(shaftX, shaftY);
        this.c.stroke();

        // Draw arrowhead
        this.c.beginPath();
        this.c.moveTo(arrowTipX, arrowTipY);
        this.c.lineTo(arrowLeftX, arrowLeftY);
        this.c.lineTo(arrowRightX, arrowRightY);
        this.c.closePath();
        this.c.fill();
      }

      if (this.drawAccelerationArrow && (Math.abs(body.a_x) + Math.abs(body.a_y)) > 0.001) {
        this.c.strokeStyle = this.bodyColours[counter].body;
        this.c.fillStyle = this.bodyColours[counter].body;

        let arrowTipX = x + body.a_x*this.accelerationArrowScale
        let arrowTipY = y + body.a_y*this.accelerationArrowScale
        const angle = Math.atan2(arrowTipY - y, arrowTipX - x);
        arrowTipX += (this.celestialBodyRadius + this.arrowHeadLength) * Math.cos(angle) * 0.9
        arrowTipY += (this.celestialBodyRadius + this.arrowHeadLength) * Math.sin(angle) * 0.9
        const headAngle = (Math.PI * this.arrowHeadAngleDeg) / 180;

        const shaftX = arrowTipX - this.arrowHeadLength * Math.cos(angle) * 0.5;
        const shaftY = arrowTipY - this.arrowHeadLength * Math.sin(angle) * 0.5;

        const arrowLeftX = arrowTipX - this.arrowHeadLength * Math.cos(angle - headAngle);
        const arrowLeftY = arrowTipY - this.arrowHeadLength * Math.sin(angle - headAngle);

        const arrowRightX = arrowTipX - this.arrowHeadLength * Math.cos(angle + headAngle);
        const arrowRightY = arrowTipY - this.arrowHeadLength * Math.sin(angle + headAngle);

        // Draw arrow shaft
        this.c.beginPath();
        this.c.moveTo(x, y);
        this.c.lineTo(shaftX, shaftY);
        this.c.stroke();

        // Draw arrowhead
        this.c.beginPath();
        this.c.moveTo(arrowTipX, arrowTipY);
        this.c.lineTo(arrowLeftX, arrowLeftY);
        this.c.lineTo(arrowRightX, arrowRightY);
        this.c.closePath();
        this.c.fill();
      }

      // Body fill
      this.c.beginPath();
      this.c.arc(x, y, this.celestialBodyRadius, 0, Math.PI * 2);
      this.c.shadowColor = this.c.fillStyle = this.bodyColours[counter].body;
      this.c.fill();
      this.c.closePath();

      // Body stroke
      this.c.beginPath();
      this.c.arc(x, y, this.celestialBodyRadius - this.c.lineWidth / 2, 0, Math.PI * 2);
      this.c.strokeStyle = this.bodyColours[counter].trail;
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

  initCelestialBodies(skipPreset?: boolean) {
    if (!skipPreset) {
      this.celestialBodies = JSON.parse(JSON.stringify(eq.celestialBodyPresets[this.preset]))
    }
    let bodies = this.celestialBodies
    this.trails = []
    this.bodyLocations = []
    let temp = JSON.parse(JSON.stringify(bodies))

    function calc_acceleration(body: eq.celestialBody): eq.celestialBody {
      let a_x = 0
      let a_y = 0
      let otherBodies = bodies.filter(x => x.id != body.id)
      function calc_body_acceleration(otherBody: eq.celestialBody) {
        const dist_x = otherBody.position_x - body.position_x
        const dist_y = otherBody.position_y - body.position_y
        const dist = Math.sqrt(dist_x**2 + dist_y**2)
        const a = (eq.G*otherBody.mass)/(dist**2)
        a_x += a * dist_x/dist
        a_y += a * dist_y/dist
      }
      otherBodies.forEach(calc_body_acceleration);
      body.acceleration_x = a_x
      body.acceleration_y = a_y
      return body
    }

    temp = temp.map(calc_acceleration)

    let countdown = this.trailLength + 150
    let countingDown = false
    for (let i = 0; i < this.framesRendered; i++) {
      let temp2 = []
      for (let j in temp) {
        temp2.push(
          { 
            x: temp[j].position_x, y: temp[j].position_y, 
            v_x: temp[j].velocity_x, v_y: temp[j].velocity_y,
            a_x: temp[j].acceleration_x, a_y: temp[j].acceleration_y,
          }
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
  
  upSpeed() {
    if (this.frameRate/120 >= 16) return;
    this.frameRate *= 2
  }
  
  downSpeed() {
    if (this.frameRate/120 <= 0.25) return;
    this.frameRate /= 2
  }

  initPreset() {
    // this.preset = (this.preset + 1) % eq.celestialBodyPresets.length
    this.currentFrame = 0
    this.framesRendered = this.maxFramesRendered
    this.initCanvas()
    this.initCelestialBodies()
    // this.isPlaying = false
    // this.togglePlay()
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.upSpeed()
      return
    } else if (event.key === 'ArrowDown') {
      this.downSpeed()
      return
    }
    if (event.key === 'ArrowLeft' && this.currentFrame > 0) {
      this.currentFrame -= 1;
    } else if (event.key === 'ArrowRight' && this.currentFrame < this.framesRendered-1) {
      this.currentFrame += 1;
    } else if (event.key === ' ') {
      this.togglePlay()
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(Gravity2025DialogComponent, {
      width: '300px',
      data: { 
        showAxes: this.showAxes,
        showStars: this.showStars,
        rotateStars: this.rotateStars,
        drawTrails: this.drawTrails,
        drawVelocityArrow: this.drawVelocityArrow,
        drawAccelerationArrow: this.drawAccelerationArrow,
        numPresets: eq.celestialBodyPresets.length,
        preset: this.preset
      },
      restoreFocus: false,
      backdropClass: 'transparent-backdrop',
      panelClass: 'no-backdrop',
    });
    
    const instance = dialogRef.componentInstance;

    // Subscribe to live updates
    instance.dataChanges$.subscribe(output => {
      this.showAxes = output.showAxes;
      this.showStars = output.showStars;
      this.rotateStars = output.rotateStars;
      this.drawTrails = output.drawTrails;
      this.drawVelocityArrow = output.drawVelocityArrow;
      this.drawAccelerationArrow = output.drawAccelerationArrow;

      if (output.preset !== undefined && this.preset !== output.preset) {
        this.preset = output.preset
        this.initPreset()
      }
    });
  }

  openEditDialog() {
    this.currentFrame = 0
    this.isPlaying = false
    const dialogRef = this.dialog.open(Gravity2025DialogEditComponent, {
      width: 'min(80%, 600px)',
      data: { 
        celestialBodies: this.celestialBodies
      },
      restoreFocus: false,
      backdropClass: 'transparent-backdrop',
      panelClass: 'no-backdrop',
    });
    
    const instance = dialogRef.componentInstance;

    // Subscribe to live updates
    instance.dataChanges$.subscribe(output => {
      this.preset = undefined
      this.celestialBodies = output.celestialBodies;
      this.framesRendered = this.maxFramesRendered
      this.initCelestialBodies(true);
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.framesRendered = this.maxFramesRendered
      // this.initCelestialBodies(true);
    })
  }

}
