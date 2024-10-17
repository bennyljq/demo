import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Ball } from './brownian-motion2.objects';
import { lastValueFrom, timer } from 'rxjs';

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
  delay = 40 // delay between ball push in ms
  radius = 150;
  minGridSize;
  gridWidth;
  gridHeight;
  numCols;
  numRows;
  gridArray;
  gridArrayEmpty;
  numBalls = 4;
  dropBallsLeft = true;
  debug = false;
  elasticity = 0.95; // percentage of energy transfer per collision
  viscosity = 0.95; // percentage deceleration per second of each particle
  g = 9.81; // ms**(-2)
  prevFrameTimestamp;
  cutoffSpeed = 0.02; // force stop movement if absolute speed is below this speed

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
    this.c.lineWidth = this.canvasWidth * this.canvasHeight * 0.000002
    this.radius = (this.canvasWidth + this.canvasHeight) * 0.01
    this.minGridSize = this.radius * 2
    this.numCols = Math.floor(this.canvasWidth/this.minGridSize)
    this.numRows = Math.floor(this.canvasHeight/this.minGridSize)
    this.gridWidth = this.canvasWidth/this.numCols
    this.gridHeight = this.canvasHeight/this.numRows
    this.gridArray = [];
    for (let j=0; j<=this.numRows; j++) {
      let row = []
      for (let i=0; i<=this.numCols; i++) {
        row.push([])
      }
      this.gridArray.push(row)
    }
    this.gridArrayEmpty = JSON.parse(JSON.stringify(this.gridArray))
    this.numBalls = this.canvasWidth * this.canvasHeight / this.minGridSize**2 / 3
    this.balls = []
  }

  pushBall() {
    let minSpeed = this.canvasWidth * this.canvasHeight / 320000 + 1
    let varSpeed = minSpeed
    let colours = ['MistyRose', 'MediumOrchid', 'MidnightBlue', 'Maroon', 'MediumSlateBlue']
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
    this.c.fillStyle = 'pink'
    this.c.strokeStyle = 'black'
    this.gridArray = JSON.parse(JSON.stringify(this.gridArrayEmpty))
    for (let j=0; j<this.numRows; j++) {
      for (let i=0; i<this.numCols; i++) {
        for (let k in this.balls) {
          if (this.balls[k].x >= i*this.gridWidth && this.balls[k].x < (i+1)*this.gridWidth && 
          this.balls[k].y >= j*this.gridHeight && this.balls[k].y < (j+1)*this.gridHeight) {
            this.gridArray[j][i].push(k)
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
    for (let j=0; j<this.numRows; j++) {
      for (let i=0; i<this.numCols; i++) {
        if (this.gridArray[j][i].length > 0) {
          let tempNearBalls = getAdjacentCells(this.gridArray, j, i).flat(Infinity)
          for (let ballIndex of this.gridArray[j][i]) {
            nearBalls[ballIndex] = tempNearBalls.filter(item => item !== ballIndex);
          }
          if (this.debug) {
            this.c.fillRect(i*this.gridWidth, j*this.gridHeight, this.gridWidth, this.gridHeight)
          }
        }
      }
    }

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
        this.elasticity, this.g, this.viscosity, sincePrevFrame, this.cutoffSpeed);
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
    this.onMouseClick()
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

function getAdjacentCells(matrix, row, col) {
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],   // Up, Down, Left, Right
    [-1, -1], [-1, 1], [1, -1], [1, 1],  // Diagonals
    [0, 0] // self
  ];
  
  const adjacentCells = [];

  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;

    if (newRow >= 0 && newRow < matrix.length && newCol >= 0 && newCol < matrix[0].length) {
      adjacentCells.push(matrix[newRow][newCol]);
    }
  }
  return adjacentCells;
}