import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, timer } from 'rxjs';
import { ThemeService } from 'src/app/physics/theme.service';
import { TrainDialogComponent } from '../train-dialog/train-dialog.component';

@Component({
  selector: 'app-train-home',
  templateUrl: './train-home.component.html',
  styleUrls: ['./train-home.component.scss']
})
export class TrainHomeComponent {

  constructor (
    public themeService: ThemeService,
    public dialog: MatDialog
  ) {}

  theme: 0 | 1 = 0 // 0 = light, 1 = dark
  pi = 3.141592653589
  window_width: any;
  window_height: any;
  track_width: any;
  track_height: any;
  track_straight: any;
  track_curve: any;
  waypoints: any;
  car_styles: any = {};
  car_width: any;
  car_height: any;
  cars: any = [];
  ticks = 4040
  currentTick = 0
  displacement_table: any = []
  interacted = false;
  speed_multiplier = 1;
  max_speed = 16;
  // track length = 1834 waypoints

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.window_width = document.getElementsByClassName("train-content-container")[0].scrollWidth;
    this.window_height = document.getElementsByClassName("train-content-container")[0].scrollHeight;
    this.track_width = this.window_width * 0.5
    this.track_height = this.window_height * 0.9
    this.track_straight = this.track_height - this.track_width
    this.track_curve = this.track_width/2 * this.pi
    this.car_width = this.window_width * 0.0666
    this.car_height = this.window_height * 0.1
  }
  
  async ngOnInit() {
    this.onResize()
    this.init_waypoints()
    this.init_cars()
    this.init_displacement_table()
    this.restartAnimation()
  }

  init_waypoints() {
    this.waypoints = []
    let straight_waypoints = 500
    let curve_waypoints = straight_waypoints * this.track_curve / this.track_straight
    for (let i=0; i<straight_waypoints; i++) {
      this.waypoints.push([
        this.window_width*0.25 - this.car_width/2, 
        this.window_height*0.05 + this.track_width/2 + i*this.track_straight/(straight_waypoints-1) - this.car_height/2,
        0
      ])
    }
    for (let i=0; i<curve_waypoints; i++) {
      this.waypoints.push([
        this.window_width*0.5 - Math.cos(this.pi*i/curve_waypoints)*this.track_width/2 - this.car_width/2, 
        this.window_height*0.95 - this.track_width/2 + Math.sin(this.pi*i/curve_waypoints)*this.track_width/2 - this.car_height/2,
        -this.pi*i/curve_waypoints
      ])
    }
    for (let i=0; i<straight_waypoints; i++) {
      this.waypoints.push([
        this.window_width*0.75 - this.car_width/2, 
        this.window_height*0.95 - this.track_width/2 - i*this.track_straight/(straight_waypoints-1) - this.car_height/2,
        0
      ])
    }
    for (let i=0; i<curve_waypoints; i++) {
      this.waypoints.push([
        this.window_width*0.5 + Math.cos(this.pi*i/curve_waypoints)*this.track_width/2 - this.car_width/2, 
        this.window_height*0.05 + this.track_width/2 - Math.sin(this.pi*i/curve_waypoints)*this.track_width/2 - this.car_height/2,
        -this.pi*i/curve_waypoints
      ])
    }
  }

  init_cars() {
    this.cars = [
      {
        id: `car-0`,
        speed: this.speed_multiplier, // waypoint per tick
        displacement: 475,
        acceleration: 0
      },
      {
        id: `car-1`,
        speed: this.speed_multiplier,
        displacement: 380,
        acceleration: 0
      },
      {
        id: `car-2`,
        speed: this.speed_multiplier,
        displacement: 285,
        acceleration: 0
      },
      {
        id: `car-3`,
        speed: this.speed_multiplier,
        displacement: 190,
        acceleration: 0
      },
      {
        id: `car-4`,
        speed: this.speed_multiplier,
        displacement: 95,
        acceleration: -0.0025 * this.speed_multiplier**2
      },
      {
        id: `car-5`,
        speed: this.speed_multiplier,
        displacement: 0,
        acceleration: -0.0025 * this.speed_multiplier**2
      },
    ]
  }

  init_displacement_table() {
    let count = 0
    this.displacement_table = []
    let temp1: any = {}
    for (let car of this.cars) {
      temp1[car.id] = this.waypoints[Math.round(car.displacement)]
      car.displacement += car.speed
      car.speed += car.acceleration
    }
    this.displacement_table.push(temp1)
    while (count <= this.ticks) {
      let temp2: any = {}
      for (let car of this.cars) {
        if (car.displacement >= this.waypoints.length) {
          car.displacement -= this.waypoints.length
        }
        temp2[car.id] = this.waypoints[Math.round(car.displacement)]
        car.displacement += car.speed
        car.speed += car.acceleration
      }
      this.displacement_table.push(temp2)
      count += 1
      // 5, 6 stop //
      if (count == Math.round(400 / this.speed_multiplier)) {
        this.cars[4].speed = 0
        this.cars[4].acceleration = 0
        this.cars[5].speed = 0
        this.cars[5].acceleration = 0
      }
      // 4 stop //
      if (count == Math.round(722 / this.speed_multiplier)) {
        this.cars[3].acceleration = -0.002 * this.speed_multiplier**2
      }
      if (count == Math.ceil((722+500) / this.speed_multiplier)) {
        this.cars[3].speed = 0
        this.cars[3].acceleration = 0
      }
      // 5, 6 go //
      if (count == Math.round(1264 / this.speed_multiplier)) {
        this.cars[4].acceleration = 0.0025 * this.speed_multiplier**2
        this.cars[5].acceleration = 0.0025 * this.speed_multiplier**2
      }
      if (count == Math.round((1264+400) / this.speed_multiplier)) {
        this.cars[4].speed = this.speed_multiplier
        this.cars[4].acceleration = 0
        this.cars[5].speed = this.speed_multiplier
        this.cars[5].acceleration = 0
      }
      // 2, 3 stop //
      if (count == Math.round((1550) / this.speed_multiplier)) {
        this.cars[1].acceleration = -0.0025 * this.speed_multiplier**2
        this.cars[2].acceleration = -0.0025 * this.speed_multiplier**2
      }
      if (count == Math.round((1550+400) / this.speed_multiplier)) {
        this.cars[1].speed = 0
        this.cars[1].acceleration = 0
        this.cars[2].speed = 0
        this.cars[2].acceleration = 0
      }
      // 4 go //
      if (count == Math.round((1990) / this.speed_multiplier)) {
        this.cars[3].acceleration = 0.002 * this.speed_multiplier**2
      }
      if (count == Math.round((1990+500) / this.speed_multiplier)) {
        this.cars[3].acceleration = 0
        this.cars[3].speed = this.speed_multiplier
      }
      // 1 stop //
      if (count == Math.round((2270) / this.speed_multiplier)) {
        this.cars[0].acceleration = -0.002 * this.speed_multiplier**2
      }
      if (count == Math.round((2270+500) / this.speed_multiplier)) {
        this.cars[0].acceleration = 0
        this.cars[0].speed = 0
      }
      // 2, 3 go //
      if (count == Math.round((2820) / this.speed_multiplier)) {
        this.cars[1].acceleration = 0.0025 * this.speed_multiplier**2
        this.cars[2].acceleration = 0.0025 * this.speed_multiplier**2
      }
      if (count == Math.round((2820+400) / this.speed_multiplier)) {
        this.cars[1].speed = this.speed_multiplier
        this.cars[1].acceleration = 0
        this.cars[2].speed = this.speed_multiplier
        this.cars[2].acceleration = 0
      }
      // 5, 6 stop //
      if (count == Math.round((3095) / this.speed_multiplier)) {
        this.cars[4].acceleration = -0.0025 * this.speed_multiplier**2
        this.cars[5].acceleration = -0.0025 * this.speed_multiplier**2
      }
      if (count == Math.round((3095+400) / this.speed_multiplier)) {
        this.cars[4].speed = 0
        this.cars[4].acceleration = 0
        this.cars[5].speed = 0
        this.cars[5].acceleration = 0
      }
      // 1 go //
      if (count == Math.round((3540) / this.speed_multiplier)) {
        this.cars[0].acceleration = 0.002 * this.speed_multiplier**2
      }
      if (count == Math.round((3540+500) / this.speed_multiplier)) {
        this.cars[0].acceleration = 0
        this.cars[0].speed = this.speed_multiplier
      }
      // 4 stop //
      if (count == Math.round((3823) / this.speed_multiplier)) {
        this.cars[3].acceleration = -0.002 * this.speed_multiplier**2
      }
      if (count == Math.round((3823+500) / this.speed_multiplier)) {
        this.cars[3].speed = 0
        this.cars[3].acceleration = 0
      }
      // LOOP >> 4040 = 940 //
    }
  }

  async apply_car_styles() {
    for (let car of this.cars) {
      this.car_styles[car.id] = {
        'transform': 
          `translate(
            ${this.displacement_table[this.currentTick][car.id][0]}px, 
            ${this.displacement_table[this.currentTick][car.id][1]}px
          ) 
          rotate(${this.displacement_table[this.currentTick][car.id][2]}rad)`
      }
      car.rotation = this.displacement_table[this.currentTick][car.id][2]
    }
  }  
  
  async restartAnimation() {
    this.currentTick = 0
    this.interacted = true // to kill still-playing animations
    await lastValueFrom(timer(50))
    this.interacted = false
    while (this.currentTick < this.ticks) {
      this.currentTick += 1
      if (this.currentTick == Math.round(4040 / this.speed_multiplier)) {
        this.currentTick = Math.round(940 / this.speed_multiplier)
      }
      this.apply_car_styles()
      await lastValueFrom(timer(0))
      if (this.interacted) {
        break
      }
    }
  }

  toggle_speed() {
    this.speed_multiplier *= 2
    if (this.speed_multiplier > this.max_speed) {
      this.speed_multiplier = 1
    }
    this.init_cars()
    this.init_displacement_table()
    this.restartAnimation()
  }

  about_train(): void {
    this.dialog.open(TrainDialogComponent, {
      restoreFocus: false,
      autoFocus: false
    });
  }

  ngAfterViewInit() {
    if (this.theme == 1) {
      this.setDarkTheme()
    } else {
      this.setLightTheme()
    }
  }

  setDarkTheme() {
    let x = document.getElementsByClassName("switch-touch-target")[0] as HTMLElement
    x.click()
    this.themeService.darkTheme()
  }
  
  setLightTheme() {
    this.themeService.lightTheme()
  }
}
