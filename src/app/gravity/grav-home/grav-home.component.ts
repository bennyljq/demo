import { Component, HostListener } from '@angular/core';
import { ThemeService } from 'src/app/physics/theme.service';
import * as eq from '../grav-equations'
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'app-grav-home',
  templateUrl: './grav-home.component.html',
  styleUrls: ['./grav-home.component.scss']
})
export class GravHomeComponent {

  constructor (
    public themeService: ThemeService
  ) {}

  theme: 0 | 1 = 1 // 0 = light, 1 = dark
  universeWidth_PX: any
  universeWidth_AU = 3
  timeStep = 3600*6
  ticks = 2640
  currentTick = 0
  posTable: any = {}
  bodyStyles: any = {}
  interacted = false // detects user interaction with slider
  bodies: eq.celestialBody[] = [
    {
      id: "sun-1",
      type: 'sun',
      position_x: 0.2*eq.au,
      position_y: 0,
      velocity_x: 0,
      velocity_y: 1.25*eq.v_earth,
      mass: eq.m_sun
    },
    {
      id: "sun-2",
      type: 'sun',
      position_x: -0.2*eq.au,
      position_y: 0,
      velocity_x: 0,
      velocity_y: -1.25*eq.v_earth,
      mass: eq.m_sun
    },
    {
      id: "earth-1",
      type: 'earth',
      position_x: eq.au,
      position_y: 0,
      velocity_x: 0,
      velocity_y: -Math.sqrt(2)*eq.v_earth,
      mass: eq.m_earth
    },
    {
      id: "earth-2",
      type: 'earth',
      position_x: -eq.au,
      position_y: eq.au,
      velocity_x: 0.7*eq.v_earth,
      velocity_y: 0.52*eq.v_earth,
      mass: eq.m_earth
    },
    {
      id: "earth-3",
      type: 'earth',
      position_x: -eq.au,
      position_y: 0,
      velocity_x: 0,
      velocity_y: 1.3*eq.v_earth,
      mass: eq.m_earth
    },
  ]

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.universeWidth_PX = document.getElementsByClassName("grav-content-container")[0].scrollWidth;
  }
  
  async ngOnInit(): Promise<void> {
    this.universeWidth_PX = document.getElementsByClassName("grav-content-container")[0].scrollWidth;
    await lastValueFrom(timer(50))
    this.getPosTable(this.ticks)
    this.playAnimation()
  }

  initBodyStyles() {
    for (let body of this.bodies) {
      this.bodyStyles[body.id] = {
        'transform': `translate(
          ${this.posTable[body.id][this.currentTick][0]}, 
          ${this.posTable[body.id][this.currentTick][1]}
        )`
      }
    }
  }

  getPosTable(ticks: number) {
    let count = 0
    for (let body of this.bodies) {
      this.posTable[body.id] = []
    }
    while (count < ticks) {
      this.bodies = eq.update(this.bodies, this.timeStep)
      for (let body of this.bodies) {
        let newPos = [
          `${Math.round(this.universeWidth_PX/2 + body.position_x*this.universeWidth_PX/this.universeWidth_AU/eq.au)}px`,
          `${Math.round(this.universeWidth_PX/2 + body.position_y*this.universeWidth_PX/this.universeWidth_AU/eq.au)}px`,
        ]
        this.posTable[body.id].push(newPos)
      }
      count += 1
    }
  }

  async playAnimation() {
    this.currentTick = 0
    this.interacted = true // to kill still-playing animations
    await lastValueFrom(timer(50))
    this.interacted = false
    while (this.currentTick < this.ticks-1) {
      this.currentTick += 1
      this.initBodyStyles()
      await lastValueFrom(timer(0))
      if (this.interacted) {
        break
      }
    }
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
