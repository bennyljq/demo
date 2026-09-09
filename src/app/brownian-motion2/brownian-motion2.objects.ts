export class Ball {
  constructor(public x: number, public y: number, 
    public dx: number, public dy: number,
    public radius: number, public color: string, public borderColor: string
  ) {}

  draw(context: CanvasRenderingContext2D, lineWidth: number) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath()

    // Draw the inner stroked circle
    context.beginPath();
    context.arc(this.x, this.y, this.radius - lineWidth/2, 0, Math.PI * 2);
    context.strokeStyle = this.borderColor
    context.stroke();
    context.closePath();
  }

  update(canvasWidth: number, canvasHeight: number, context: CanvasRenderingContext2D,
    nearBalls: Array<number>, allBalls: Array<Ball>, mouseInCanvas: boolean, mouseX: number, mouseY: number,
    elasticity: number, g: number, viscosity: number, sincePrevFrame: number, cutoffSpeed: number, lineWidth: number) {

    // viscosity
    let pixelToMetreRatio = 100
    let viscosityDeceleration = 1 - ((1-viscosity)*sincePrevFrame/1000)
    this.dx *= viscosityDeceleration
    this.dy *= viscosityDeceleration
    
    // gravity
    this.dy += g*sincePrevFrame/1000/pixelToMetreRatio

    // wall collision
    if (this.x + this.radius >= canvasWidth) {
      this.dx = -this.dx * elasticity
      this.x = canvasWidth - this.radius
    } 
    if (this.x - this.radius <= 0) {
      this.dx = -this.dx * elasticity
      this.x = this.radius
    } 
    if (this.y + this.radius >= canvasHeight) {
      this.dy = -this.dy * elasticity
      this.y = canvasHeight - this.radius
    }
    if (this.y - this.radius <= 0) {
      this.dy = -this.dy * elasticity
      this.y = this.radius
    }

    // collision detection
    for (let ballIndex of nearBalls) {
      let nearBall = allBalls[ballIndex];
    
      // Distance between the current positions
      let distX = nearBall.x - this.x;
      let distY = nearBall.y - this.y;
      let dist = Math.sqrt(distX * distX + distY * distY);
    
      // Check for collision based on current and future distances
      if (dist <= this.radius + nearBall.radius) {
        // Calculate angle of collision
        let angle = Math.atan2(distY, distX);
    
        // Separate the balls so they no longer overlap
        let overlap = (this.radius + nearBall.radius) - dist;
        let moveX = (overlap / 2) * Math.cos(angle);
        let moveY = (overlap / 2) * Math.sin(angle);
    
        this.x -= moveX;
        this.y -= moveY;
        nearBall.x += moveX;
        nearBall.y += moveY;
    
        // Velocities along the collision axis
        let v1 = this.dx * Math.cos(angle) + this.dy * Math.sin(angle);
        let v2 = nearBall.dx * Math.cos(angle) + nearBall.dy * Math.sin(angle);
    
        // Velocities perpendicular to the collision axis
        let p1 = -this.dx * Math.sin(angle) + this.dy * Math.cos(angle);
        let p2 = -nearBall.dx * Math.sin(angle) + nearBall.dy * Math.cos(angle);
    
        // Swap the velocities along the collision axis
        let v1After = v2 * elasticity;
        let v2After = v1 * elasticity;

        // Overlap repulsion
        let overlapFactor = (1 + overlap/(this.radius+nearBall.radius)) ** 0.2
        if (overlap > this.radius*0.1) {
          v1After *= overlapFactor
          v2After *= overlapFactor
        }
    
        // Convert the velocities back to the original coordinate system
        this.dx = v1After * Math.cos(angle) - p1 * Math.sin(angle);
        this.dy = v1After * Math.sin(angle) + p1 * Math.cos(angle);
        nearBall.dx = v2After * Math.cos(angle) - p2 * Math.sin(angle);
        nearBall.dy = v2After * Math.sin(angle) + p2 * Math.cos(angle);
    
        // cutoff speed
        if (Math.sqrt(this.dx**2 + this.dy**2) <= cutoffSpeed) { // self
          this.dx = this.dy = 0
        }
        if (Math.sqrt(nearBall.dx**2 + nearBall.dy**2) <= cutoffSpeed) { // collided ball
          nearBall.dx = nearBall.dy = 0
        }

        // Update the positions based on new velocities
        this.x += this.dx;
        this.y += this.dy;
        nearBall.x += nearBall.dx;
        nearBall.y += nearBall.dy;
    
        // Draw the balls after updating
        this.draw(context, lineWidth);
        nearBall.draw(context, lineWidth);
        return;
      }
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw(context, lineWidth)
    
    // old collision logic
    // for (let ballIndex of nearBalls) {
    //   let nearBall = allBalls[ballIndex]
    //   let dist = Math.sqrt((this.x-nearBall.x)**2 + (this.y-nearBall.y)**2)
    //   if (dist <= this.radius + nearBall.radius) {
    //     let angle = Math.atan((nearBall.y-this.y)/(nearBall.x-this.x))
    //     let r1 = this.dy*Math.sin(angle) + this.dx*Math.cos(angle)
    //     let p1 = this.dy*Math.cos(angle) + this.dx*Math.sin(angle)
    //     let r2 = nearBall.dy*Math.sin(angle) + nearBall.dx*Math.cos(angle)
    //     let p2 = nearBall.dy*Math.cos(angle) + nearBall.dx*Math.sin(angle)
    //     this.dy = p1*Math.sin(angle+Math.PI/2) + r2*Math.sin(angle)
    //     this.dx = p1*Math.cos(angle+Math.PI/2) + r2*Math.cos(angle)
    //     nearBall.dy = p2*Math.sin(angle+Math.PI/2) + r1*Math.sin(angle)
    //     nearBall.dx = p2*Math.cos(angle+Math.PI/2) + r1*Math.cos(angle)

    //     this.x += this.dx;
    //     this.y += this.dy;
    //     nearBall.x += nearBall.dx;
    //     nearBall.y += nearBall.dy;

    //     this.draw(context)
    //     nearBall.draw(context)
    //     return
    //   }
    // }
  

    // if (mouseInCanvas) {
    //   let distX = (mouseX-this.x)
    //   let distY = (mouseY-this.y)
    //   let dist = Math.sqrt(distX**2 + distY**2)
    //   let gravConstant = canvasWidth * canvasHeight * 0.05
    //   let repulsion = gravConstant / (dist**2)
    //   this.x = Math.abs(this.x + this.dx - repulsion*(distX/dist));
    //   this.y = Math.abs(this.y + this.dy - repulsion*(distY/dist));
    // } else {
    //   this.x = Math.abs(this.x + this.dx);
    //   this.y = Math.abs(this.y + this.dy);
    // }
  }
}