import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'app-experimental',
  templateUrl: './experimental.component.html',
  styleUrls: ['./experimental.component.scss']
})
export class ExperimentalComponent {

  constructor(private router: Router){}
  
  ballElement: any;
  ballRadius = 3 // vh
  ball_y = 50 // vh
  ball_v = 0 // vh/s

  ballContainerMarginTop = "5vh"
  ballContainerMarginBottom = "20vh"
  ballContainerMarginSides = "5vh"

  acceleration = -500 // vh/s^2
  t = 0 // s

  resetClicked = false;

  ngAfterViewInit(): void {
    this.initBall()
    this.initBallContainer(
      this.ballContainerMarginTop,
      this.ballContainerMarginBottom,
      this.ballContainerMarginSides
      )
    this.bounce(10)
  }

  initBall() {
    this.ballElement = document.getElementById("exp-ball") as HTMLElement
    this.setBallRadius()
    this.setBallPos("50vw", `${this.ball_y}vh`)
  }

  initBallContainer(marginTop: string, marginBottom: string, marginSides: string) {
    let container = document.getElementById("exp-ball-container") as HTMLElement
    container.style.margin = `${marginSides}`
    container.style.width = `calc(100vw - 2*${marginSides})`
    container.style.height = `calc(100vh - ${marginTop} - ${marginBottom})`
  }

  setBallRadius() {
    this.ballElement.style.width = `${this.ballRadius*2}vh`
    this.ballElement.style.height = `${this.ballRadius*2}vh`
  }

  setBallPos(x: any, y: any) {
    this.ballElement.style.left = `calc(${x} - (${this.ballRadius}vh))`
    this.ballElement.style.top = `calc(100vh - ${y} - (${this.ballRadius}vh) - ${this.ballContainerMarginBottom})`
  }

  async bounce(duration: number) {
    this.ball_y = 50 // vh
    this.ball_v = 0 // vh/s
    this.t = 0 // s

    await lastValueFrom(timer(50))
    this.resetClicked = false

    let step = 0.01  // s
    let degen = 0.85  // energy returned on bounce
    let cutoff_v = this.acceleration * -0.005 // stop sim when v lower than this
    let cutoff_y = this.acceleration * -0.0005 // stop sim when y lower than this
    while (true) {
      await lastValueFrom(timer(step*1000))
      this.ball_v += this.acceleration*step
      this.ball_y += this.ball_v*step
      this.t += step
      if (this.ball_y <= this.ballRadius) {
        this.ball_v = -degen*this.ball_v - 1
        this.ball_y = 2 * this.ballRadius - this.ball_y
      }
      this.setBallPos("50vw", `${this.ball_y}vh`)
      if (this.t > duration) {
        console.log("time's up!")
        break
      }
      if (Math.abs(this.ball_v) < cutoff_v && Math.abs(this.ball_y - this.ballRadius) < cutoff_y) {
        console.log("ball inactive")
        break
      }
      if (this.resetClicked) {
        console.log("reset clicked")
        this.resetClicked = false
        break
      }
    }
  }
  
  async goHome() {
    this.router.navigate(['/main']);
  }

}
