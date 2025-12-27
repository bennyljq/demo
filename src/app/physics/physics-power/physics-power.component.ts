import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from '../theme.service';
import { lastValueFrom, timer, timestamp } from 'rxjs';

@Component({
    selector: 'app-physics-power',
    templateUrl: './physics-power.component.html',
    styleUrls: ['./physics-power.component.scss', '../physics-intro/physics-intro.component.scss'],
    standalone: false
})
export class PhysicsPowerComponent {

  constructor (
    public themeService: ThemeService
  ) {}

  @Output() selectChapter = new EventEmitter;
  @Input() selectedPageIndex = 0
  numPages = 11;
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
  kw_to_w = "$1\\ kW = 1000\\ W$";
  kj_to_j = "$1\\ kJ = 1000\\ J$";
  wh_to_j = "$1\\ Wh = 3600\\ J$";
  wh_to_kj = "$1\\ Wh = 3.6\\ kJ$";
  kwh_to_j = "$1\\ kWh = 3600000\\ J$";
  kwh_to_kj = "$1\\ kWh = 3600\\ kJ$";
  aircon_kwh = "$3kW \\times 8h = 24kWh$"
  aircon_j = "$3000W \\times 8 \\times 60 \\times 60s = 86400000J$"
  second_hour = "$(real) 1 second$"
  charging_array = Array(6).fill(0)

  // question 1
  answer_options_1 = ['11 kWh', '24 kWh', '11000 kWh', '24000 kWh']
  correct_answer_1 = 1
  picked_answer_1: number | undefined;
  question_answered_1 = false

  // question 2
  answer_options_2 = ['86400000 J', '8640000 J', '864000 J', '86400 J']
  correct_answer_2 = 0
  picked_answer_2: number | undefined;
  question_answered_2 = false

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
  on_answer_1(answer_index: number) {
    this.picked_answer_1 = answer_index
    this.question_answered_1 = true
  }
  on_answer_2(answer_index: number) {
    this.picked_answer_2 = answer_index
    this.question_answered_2 = true
  }

}
