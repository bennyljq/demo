export class Ball {
  constructor(public x: number, public y: number, 
    public dx: number, public dy: number,
    public radius: number, public color: string
  ) {}

  maxRadius = 10;
  minRadius = 5;
  growing = Math.random() < 0.5
  growthRate = 0.01

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }

  update(canvasWidth: number, canvasHeight: number, context: CanvasRenderingContext2D,
    mouseInCanvas: boolean, mouseX: number, mouseY: number, activeTouches: Array<any>) {
    if (this.x + this.maxRadius >= canvasWidth) {
      this.dx = -this.dx
      this.x = canvasWidth - this.maxRadius
    } 
    if (this.x - this.maxRadius <= 0) {
      this.dx = -this.dx
      this.x = this.maxRadius
    } 
    if (this.y + this.maxRadius >= canvasHeight) {
      this.dy = -this.dy
      this.y = canvasHeight - this.maxRadius
    }
    if (this.y - this.maxRadius <= 0) {
      this.dy = -this.dy
      this.y = this.maxRadius
    }

    if (mouseInCanvas) {
      if (activeTouches && activeTouches.length > 0) {
        for (let touch of activeTouches) {
          let distX = (touch.x-this.x)
          let distY = (touch.y-this.y)
          let dist = Math.sqrt(distX**2 + distY**2)
          let gravConstant = canvasWidth * canvasHeight * 0.05
          let repulsion = gravConstant / (dist**2)
          this.x = Math.abs(this.x + this.dx - repulsion*(distX/dist));
          this.y = Math.abs(this.y + this.dy - repulsion*(distY/dist));
        }
      } else {
        let distX = (mouseX-this.x)
        let distY = (mouseY-this.y)
        let dist = Math.sqrt(distX**2 + distY**2)
        let gravConstant = canvasWidth * canvasHeight * 0.05
        let repulsion = gravConstant / (dist**2)
        this.x = Math.abs(this.x + this.dx - repulsion*(distX/dist));
        this.y = Math.abs(this.y + this.dy - repulsion*(distY/dist));
      }
    } else {
      this.x = Math.abs(this.x + this.dx);
      this.y = Math.abs(this.y + this.dy);
    }

    if (this.radius >= this.maxRadius || this.radius <= this.minRadius) {
      this.growing = !this.growing
    }

    if (this.growing) {
      this.radius += this.growthRate
    } else {
      this.radius -= this.growthRate
    }

    this.draw(context)
  }
}