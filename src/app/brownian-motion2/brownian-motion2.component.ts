import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Ball } from './brownian-motion2.objects';

@Component({
  selector: 'app-brownian-motion2',
  templateUrl: './brownian-motion2.component.html',
  styleUrls: ['./brownian-motion2.component.scss']
})

export class BrownianMotion2Component {
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
  lastPushedTimestamp = performance.now();
  sinceLastPushed = Infinity // ms since last ball was pushed
  delay = 50 // delay between ball push in ms
  radius = 150;
  minGridSize;
  gridWidth;
  gridHeight;
  numCols;
  numRows;
  gridTracker; // to track per-cell population
  numBalls = 4;
  dropBallsLeft = true;
  debug = false;
  elasticity = 0.95; // percentage of energy transfer per collision
  viscosity = 0.95; // percentage deceleration per second of each particle
  g = 9.81; // ms**(-2)
  prevFrameTimestamp;
  cutoffSpeed = 0.02; // force stop movement if absolute speed is below this speed
  lineWidth;

  ngAfterViewInit() {
    this.initCanvas()
    this.animate();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.initCanvas()
  }

  initCanvas() {
    const canvas = document.getElementById('bm-canvas') as HTMLCanvasElement
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 1;
    this.c = canvas.getContext('2d')!;
    this.canvasWidth = this.c.canvas.width;
    this.canvasHeight = this.c.canvas.height;
    this.radius = (this.canvasWidth + this.canvasHeight) * 0.012
    this.lineWidth = this.radius * 0.1 + 1
    this.c.lineWidth = this.lineWidth
    this.minGridSize = this.radius * 2
    this.numCols = Math.floor(this.canvasWidth/this.minGridSize)
    this.numRows = Math.floor(this.canvasHeight/this.minGridSize)
    this.gridWidth = this.canvasWidth/this.numCols
    this.gridHeight = this.canvasHeight/this.numRows
    this.gridTracker = {}
    this.numBalls = this.canvasWidth * this.canvasHeight / this.minGridSize**2 / 3
    this.balls = []
  }

  pushBall() {
    let minSpeed = this.radius * 0.2 + 2
    let varSpeed = minSpeed
    let colours = ['MediumVioletRed', 'MediumOrchid', 'MidnightBlue', 'Maroon', 'MediumSlateBlue']
    let dx = (Math.random() * varSpeed + minSpeed)
    let dy = (Math.random() * varSpeed + minSpeed)
    let randomColour = colours[Math.floor(Math.random()*colours.length)]
    if (this.dropBallsLeft) {
      this.balls.push(new Ball(this.radius, this.radius, dx, dy, this.radius, randomColour));
    } else {
      this.balls.push(new Ball(this.canvasWidth - this.radius, this.radius, dx, dy, this.radius, randomColour));
    }
  }

  private animate = () => {
    this.c.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    if (this.balls.length < this.numBalls) {
      this.sinceLastPushed = performance.now() - this.lastPushedTimestamp
      if (this.sinceLastPushed >= this.delay) {
        this.pushBall()
        this.dropBallsLeft = !this.dropBallsLeft
        this.lastPushedTimestamp = performance.now()
      }
    }

    // draw grid
    this.c.fillStyle = 'black'
    this.c.strokeStyle = 'WhiteSmoke'
    this.gridTracker = {}
    for (let j=0; j<this.numRows; j++) {
      for (let i=0; i<this.numCols; i++) {
        for (let k in this.balls) {
          if (this.balls[k].x >= i*this.gridWidth && this.balls[k].x < (i+1)*this.gridWidth && 
          this.balls[k].y >= j*this.gridHeight && this.balls[k].y < (j+1)*this.gridHeight) {
            if (`${i}|${j}` in this.gridTracker) {
              this.gridTracker[`${i}|${j}`].push(k)
            } else {
              this.gridTracker[`${i}|${j}`] = [k]
            }
          }
        }
        if (this.debug) {
          this.c.fillRect(i*this.gridWidth, j*this.gridHeight, this.gridWidth, this.gridHeight)
          this.c.strokeRect(i*this.gridWidth, j*this.gridHeight, this.gridWidth, this.gridHeight)
        }
      }
    }

    // finding near balls
    let nearBalls = {};
    this.c.fillStyle = 'SeaGreen';
    Object.keys(this.gridTracker).forEach(key => {
      const [i, j] = key.split('|').map(Number);
      let tempNearBalls = getNearBalls(this.gridTracker, i, j, this.numCols, this.numRows)
      for (let ballIndex of this.gridTracker[key]) {
        nearBalls[ballIndex] = tempNearBalls.filter(item => item !== ballIndex);
      }
      if (this.debug) {
        this.c.fillRect(i*this.gridWidth, j*this.gridHeight, this.gridWidth, this.gridHeight)
      }
    });

    // measuring time since last frame
    let sincePrevFrame; // ms
    if (this.prevFrameTimestamp) {
      sincePrevFrame = performance.now() - this.prevFrameTimestamp
    } else {
      sincePrevFrame = 0
    }
    this.prevFrameTimestamp = performance.now()

    for (let index in this.balls) {
      if (nearBalls[index])
      this.balls[index].update(this.canvasWidth, this.canvasHeight, this.c, 
        nearBalls[index], this.balls, this.mouseInCanvas, this.mouseX, this.mouseY, 
        this.elasticity, this.g, this.viscosity, sincePrevFrame, this.cutoffSpeed, this.lineWidth);
    };
    this.animationId = requestAnimationFrame(this.animate);
  }

  onMouseClick(event?: MouseEvent) {
    if (!this.animationId) {
      this.animate();
    } else {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
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
    this.pauseAnimation()
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
    this.playAnimation()
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

function getNearBalls(trackerObj, col, row, numCols, numRows) {
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],   // Up, Down, Left, Right
    [-1, -1], [-1, 1], [1, -1], [1, 1],  // Diagonals
    [0, 0] // self
  ];
  
  let output = [];

  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;

    if (`${newCol}|${newRow}` in trackerObj && 
    newRow >= 0 && newRow < numRows && 
    newCol >= 0 && newCol < numCols) {
      output = output.concat(trackerObj[`${newCol}|${newRow}`])
    }
  }
  return output;
}