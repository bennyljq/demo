import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from '../theme.service';
import { lastValueFrom, timer, timestamp } from 'rxjs';

@Component({
  selector: 'app-physics-power',
  templateUrl: './physics-power.component.html',
  styleUrls: ['./physics-power.component.scss', '../physics-intro/physics-intro.component.scss']
})
export class PhysicsPowerComponent {

  constructor (
    public themeService: ThemeService
  ) {}

  @Output() selectChapter = new EventEmitter;
  @Input() selectedPageIndex = 0
  numPages = 10;
  pagesArray = new Array(this.numPages)
  hideBack = true
  hideNext = false

  ngOnInit() {
    this.init_toaster()
    this.force_load_images()
  }
  ngOnChanges() {
    if (this.selectedPageIndex == -1) {
      this.selectedPageIndex = this.numPages - 1
    }
    this.setButtons()
  }
  prevPage() {
    if (this.selectedPageIndex == 0) {
      this.prevChapter()
    }
    this.selectedPageIndex = (this.selectedPageIndex + this.numPages - 1) % this.numPages
    this.setButtons()
  }
  nextPage() {
    if (this.selectedPageIndex == this.numPages - 1) {
      return
    }
    this.selectedPageIndex = (this.selectedPageIndex + 1) % this.numPages
    this.setButtons()
  }
  prevChapter() {
    this.selectChapter.emit('previous')
  }
  nextChapter() {
    this.selectChapter.emit('next')
  }
  setButtons() {
    switch(this.selectedPageIndex) {
      case 0:
        this.hideNext = false
        this.hideBack = true
        break
      case this.numPages-1:
        this.hideNext = true
        this.hideBack = false
        break
      default:
        this.hideNext = false
        this.hideBack = false
        break
    }
    this.toaster_state = false
    this.aircon_state = false
    this.computer_state = false
    this.toaster_duration = 0
    this.aircon_duration = 0
    this.computer_duration = 0
  }

  toaster_state = false
  aircon_state = false
  computer_state = false
  toaster_duration = 0
  aircon_duration = 0
  computer_duration = 0
  watt = "$1\\ W = 1\\ Js^{-1}$";
  w_to_kw = "$1000\\ W = 1\\ kW$";
  j_to_kj = "$1000\\ J = 1\\ kJ$";
  wh_to_j = "$1\\ Wh = 3600\\ J$";
  wh_to_kj = "$1\\ Wh = 3.6\\ kJ$";
  kwh_to_j = "$1\\ kWh = 3600000\\ J$";
  kwh_to_kj = "$1\\ kWh = 3600\\ kJ$";
  aircon_kwh = "$3kW \\times 8h = 24kWh$"
  aircon_j = "$3000W \\times 8 \\times 60 \\times 60s = 86400000J$"
  second_hour = "$(real) 1 second$"
  charging_array = Array(6).fill(0)

  async init_toaster() {
    let time_step = 50 //ms
    let time_step_s = time_step/1000
    while (true) {
      if (this.toaster_state) {
        this.toaster_duration += time_step_s
      }
      if (this.aircon_state) {
        this.aircon_duration += time_step_s
      }
      if (this.computer_state) {
        this.computer_duration += time_step_s
      }
      await lastValueFrom(timer(time_step))
    }
  }
  async force_load_images() {
    let darkTheme = this.themeService.isDarkTheme
    this.toaster_state = true
    this.aircon_state = true
    this.computer_state = true
    await lastValueFrom(timer(0))
    if (darkTheme) {
      this.themeService.lightTheme()
    } else {
      this.themeService.darkTheme()
    }
    await lastValueFrom(timer(0))
    if (darkTheme) {
      this.themeService.darkTheme()
    } else {
      this.themeService.lightTheme()
    }
    this.toaster_state = false
    this.aircon_state = false
    this.computer_state = false
  }

}
