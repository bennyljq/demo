import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from '../theme.service';
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'app-physics-battery',
  templateUrl: './physics-battery.component.html',
  styleUrls: ['./physics-battery.component.scss', '../physics-intro/physics-intro.component.scss']
})
export class PhysicsBatteryComponent {

  constructor (
    public themeService: ThemeService
  ) {}

  @Output() selectChapter = new EventEmitter;
  @Input() selectedPageIndex = 0
  numPages = 7;
  pagesArray = new Array(this.numPages)
  hideBack = true
  hideNext = false
  preventNext = false

  ngOnInit() {
    this.init_battery_percent()
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
    if (this.preventNext) { return }
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
  }

  answer_options = ['66000 J', '67000 J', '68000 J', '69000 J']
  correct_answer = 2
  picked_answer: number | undefined;
  question_answered = false
  charging_array = Array(5).fill(0)
  battery_percent = 12
  charge_timer = 0

  energy_delivered = "$25J \\times 40 \\times 60 = 60000J$";
  total_capacity = "$60000J \\div 0.88 \\approx 68182J$";
  total_capacity_2 = "$68000J$";
  p_vi = "$P=VI$"
  mah_power_1 = "$5000mA = 5A$"
  mah_power_2 = "$5A \\times 3.8V = 19W$"
  mah_capacity = "$19W \\times 3600s = 68400J$"

  async init_battery_percent() {
    while (true) {
      if (this.battery_percent == 100 || this.battery_percent == 12) {
        await lastValueFrom(timer(2000))
      } else {
        await lastValueFrom(timer(40))
      }
      this.battery_percent = (this.battery_percent - 11) % 89 + 12
      this.charge_timer = Math.floor((this.battery_percent - 12) / 88 * 40)
    }
  }
  on_answer(answer_index: number) {
    this.picked_answer = answer_index
    this.question_answered = true
  }
  
}
