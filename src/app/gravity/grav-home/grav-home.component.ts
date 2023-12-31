import { Component, HostListener } from '@angular/core';
import { ThemeService } from 'src/app/physics/theme.service';
import * as eq from '../grav-equations'
import { lastValueFrom, timer } from 'rxjs';
import { presets } from '../grav-presets';
import { GravDialogComponent } from '../grav-dialog/grav-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-grav-home',
  templateUrl: './grav-home.component.html',
  styleUrls: ['./grav-home.component.scss']
})
export class GravHomeComponent {

  constructor (
    public themeService: ThemeService,
    public dialog: MatDialog
  ) {}

  theme: 0 | 1 = 1 // 0 = light, 1 = dark
  universeWidth_PX: any
  universeWidth_AU = 3
  timeStep = 0
  ticks = 1
  currentTick = 0
  posTable: any = {}
  bodyStyles: any = {}
  interacted = false // detects user interaction with slider
  bodies: any = []
  menuItems: string[] = []
  selectedIndex: number = 2
  stats = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.universeWidth_PX = document.getElementsByClassName("grav-content-container")[0].scrollWidth;
  }
  
  async ngOnInit(): Promise<void> {
    this.universeWidth_PX = document.getElementsByClassName("grav-content-container")[0].scrollWidth;
    presets.forEach(x => {
      this.menuItems.push(x.name)
    })
    this.menuItemSelected(this.selectedIndex)
  }

  edit(): void {
    this.interacted = true
    let bodies_copy = JSON.parse(JSON.stringify(this.bodies))
    let bodies_copy_2 = JSON.parse(JSON.stringify(this.bodies))
    this.bodies = []
    const dialogRef = this.dialog.open(GravDialogComponent, {
      data: {
        bodies: bodies_copy
      },
      restoreFocus: false,
      maxWidth: "90vw"
    });
    dialogRef.afterClosed().subscribe((x: any) => {
      if (x?.action == 'confirm') {
        this.bodies = x.bodies
        this.getPosTable(this.ticks)
        this.restartAnimation()
      } else {
        this.bodies = bodies_copy_2
        this.restartAnimation()
      }
    });
  }

  menuItemSelected(index: number) {
    this.selectedIndex = index
    let selectedPreset = JSON.parse(JSON.stringify(presets[index]))
    this.bodies = selectedPreset.state
    this.ticks = selectedPreset.ticks
    this.timeStep = selectedPreset.timeStep
    this.getPosTable(this.ticks)
    this.restartAnimation()
  }

  initBodyStyles() {
    for (let body of this.bodies) {
      let x = this.posTable[body.id][this.currentTick][0]
      let y = this.posTable[body.id][this.currentTick][1]
      this.bodyStyles[body.id] = {
        'transform': `translate(${x}px, ${y}px)`
      }
      if (Math.min(x, y) < 0.05*this.universeWidth_PX) {
        this.bodyStyles[body.id]['opacity'] = Math.min(
          Math.min(x, y)/(0.05*this.universeWidth_PX), 
          (this.universeWidth_PX - Math.max(x, y))/(0.05*this.universeWidth_PX)).toString()
      } else if (Math.max(x, y) > 0.95*this.universeWidth_PX) {
        this.bodyStyles[body.id]['opacity'] = Math.min(
          Math.min(x, y)/(0.05*this.universeWidth_PX), 
          (this.universeWidth_PX - Math.max(x, y))/(0.05*this.universeWidth_PX)).toString()
      }
    }
  }

  getPosTable(ticks: number) {
    let initialState = JSON.parse(JSON.stringify(this.bodies))
    let count = 0
    for (let body of this.bodies) {
      this.posTable[body.id] = []
    }
    while (count <= ticks) {
      for (let body of this.bodies) {
        let newPos = [
          Math.round(this.universeWidth_PX/2 + body.position_x*this.universeWidth_PX/this.universeWidth_AU),
          Math.round(this.universeWidth_PX/2 + body.position_y*this.universeWidth_PX/this.universeWidth_AU),
          body.position_x,
          body.position_y,
          body.velocity_x,
          body.velocity_y
        ]
        this.posTable[body.id].push(newPos)
      }
      this.bodies = eq.update(this.bodies, this.timeStep)
      count += 1
    }
    this.bodies = initialState
  }

  async restartAnimation() {
    this.currentTick = 0
    this.interacted = true // to kill still-playing animations
    await lastValueFrom(timer(50))
    this.interacted = false
    while (this.currentTick < this.ticks) {
      if (this.currentTick == this.ticks-1) {
        this.interacted = true
      }
      this.currentTick += 1
      this.initBodyStyles()
      await lastValueFrom(timer(0))
      if (this.interacted) {
        break
      }
    }
  }

  async togglePlay() {
    if (this.interacted) {
      this.interacted = false
      while (this.currentTick < this.ticks) {
        if (this.currentTick == this.ticks-1) {
          this.interacted = true
        }
        this.currentTick += 1
        this.initBodyStyles()
        await lastValueFrom(timer(0))
        if (this.interacted) {
          break
        }
      }
    } else {
      this.interacted = true
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
