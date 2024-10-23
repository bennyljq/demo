import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BackgroundStar, celestialBodyPreset1, celestialBodyPreset2, celestialBodyPreset3, celestialBodyPreset4, celestialBodyPreset5 } from './gravity-game.objects';
import * as eq from '../gravity/grav-equations'

@Component({
  selector: 'app-gravity-game',
  templateUrl: './gravity-game.component.html',
  styleUrls: ['./gravity-game.component.scss']
})
export class GravityGameComponent {
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
  backgroundStars: Array<BackgroundStar> = []
  numStars: number;
  bgStarsColours = ['LemonChiffon', 'Pink', 'WhiteSmoke', 'MistyRose', 'PowderBlue']
  angle: number = 0;
  angleIncrement: number;
  celestialBodies: Array<eq.celestialBody> = []
  celestialBodyRadius: number;
  prevFrameTimestamp;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenContext: CanvasRenderingContext2D;
  extendedWidth: number;
  debug = true;
  trails: Array<any> = [];
  private trailFadeSpeed = 0.005;
  presetActive: number = 1;
  timestep = 3600*24;
  fps;

  ngAfterViewInit() {
    this.initCanvas()
    this.initBackgroundStars(this.numStars)
    this.initCelestialBodies(this.presetActive)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.initCanvas()
    this.initBackgroundStars(this.numStars)
    this.initCelestialBodies(this.presetActive)
  }
  
  initCanvas() {
    this.canvas = document.getElementById('gg-canvas') as HTMLCanvasElement
    this.c = this.canvas.getContext('2d')!;
    this.canvas.width = this.canvasWidth = window.innerWidth;
    this.canvas.height = this.canvasHeight = window.innerHeight - 52;
    this.canvasArea = this.canvasWidth * this.canvasHeight;
    this.shortEdge = Math.min(this.canvasWidth, this.canvasHeight)
    this.numStars = this.canvasArea * 0.0008
    this.angleIncrement = Math.sqrt(this.canvasArea) * 0.0000001 + 0.0001
    this.celestialBodyRadius = this.shortEdge * 0.03
    this.c.lineJoin = "round";
    this.c.lineWidth = this.celestialBodyRadius * 0.1 + 1
  }

  initBackgroundStars(numStars: number) {
    this.backgroundStars = []
    this.extendedWidth = Math.sqrt(this.canvasWidth**2 + this.canvasHeight**2);
    for (let i=0; i<numStars; i++) {
      this.backgroundStars.push(new BackgroundStar(
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

  initCelestialBodies(presetNum: number) {
    switch(presetNum) {
      case 1:
        this.celestialBodies = JSON.parse(JSON.stringify(celestialBodyPreset1))
        break
      case 2:
        this.celestialBodies = JSON.parse(JSON.stringify(celestialBodyPreset2))
        break
      case 3:
        this.celestialBodies = JSON.parse(JSON.stringify(celestialBodyPreset3))
        break
      case 4:
        this.celestialBodies = JSON.parse(JSON.stringify(celestialBodyPreset4))
        break
      case 5:
        this.celestialBodies = JSON.parse(JSON.stringify(celestialBodyPreset5))
        break
    }
    this.presetActive = presetNum
    if (this.celestialBodies[0].shortEdgeAU) {
      this.shortEdgeAU = this.celestialBodies[0].shortEdgeAU
    } else {
      this.shortEdgeAU = 2.5
    }
    if (this.celestialBodies[0].timestep) {
      this.timestep = this.celestialBodies[0].timestep
    } else {
      this.timestep = 3600*24
    }
    this.trails = []
    if (!this.animationId) {
      this.animate();
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

  private animate = () => {
    this.c.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // draw rotating background stars
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
    this.angle += this.angleIncrement

    // draw celestialBodies trails
    for (let body of this.celestialBodies) {
      if (body.id in this.trails) {
        this.trails[body.id].push({ 
          x: body.position_x, 
          y: body.position_y, 
          opacity: 1 
        });
      } else {
        this.trails[body.id] = [{ 
          x: body.position_x, 
          y: body.position_y, 
          opacity: 1 
        }];
      }
      this.c.strokeStyle = body.trailColour
      this.drawTrail(this.trails[body.id])
      for (let i = 0; i < this.trails[body.id].length; i++) {
        this.trails[body.id][i].opacity -= this.trailFadeSpeed;
      }
      this.trails[body.id] = this.trails[body.id].filter(x => x.opacity > 0);
    }

    // draw bodies
    this.c.save()
    this.c.shadowBlur = this.celestialBodyRadius * 2;
    for (let body of this.celestialBodies) {
      this.c.beginPath();
      this.c.arc(
        body.position_x * (this.shortEdge/this.shortEdgeAU) + this.canvasWidth/2, 
        body.position_y * (this.shortEdge/this.shortEdgeAU) + this.canvasHeight/2, 
        this.celestialBodyRadius,
        0, Math.PI * 2
      );
      this.c.shadowColor = this.c.fillStyle = body.colour;
      this.c.fill();
      this.c.closePath();
      this.c.beginPath();
      this.c.arc(
        body.position_x * (this.shortEdge/this.shortEdgeAU) + this.canvasWidth/2, 
        body.position_y * (this.shortEdge/this.shortEdgeAU) + this.canvasHeight/2, 
        this.celestialBodyRadius - (this.c.lineWidth/2),
        0, Math.PI * 2
      );
      this.c.strokeStyle = body.trailColour
      this.c.stroke();
      this.c.closePath();
    }
    this.c.restore()
    this.celestialBodies = eq.update(this.celestialBodies, this.timestep)

    if (this.debug) {
      // measuring time since last frame
      let sincePrevFrame; // ms
      if (this.prevFrameTimestamp) {
        sincePrevFrame = performance.now() - this.prevFrameTimestamp
      } else {
        sincePrevFrame = 0
      }
      this.prevFrameTimestamp = performance.now()
      this.fps = Math.round(1/sincePrevFrame*1000)
    }

    this.animationId = requestAnimationFrame(this.animate);
  }

  onMouseClick(event?: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  }

  toggleAnimation() {
    if (!this.animationId) {
      this.animate();
    } else {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  spawnCelestialBody(x: number, y: number) {
    this.celestialBodies.push({
      id: this.celestialBodies.length,
      position_x: (x - this.canvasWidth/2) / (this.shortEdge/this.shortEdgeAU),
      position_y: (y - this.canvasHeight/2) / (this.shortEdge/this.shortEdgeAU),
      velocity_x: 0,
      velocity_y: 0,
      mass: eq.m_sun*2
    })
    this.trails[this.celestialBodies.length] = []
  }

}
