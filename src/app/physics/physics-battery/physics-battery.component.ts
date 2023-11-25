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
  numPages = 9;
  pagesArray = new Array(this.numPages)
  hideBack = true
  hideNext = false

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
    if (this.selectedPageIndex == this.numPages - 1) {
      this.nextChapter()
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
  charging_array = Array(6).fill(0)
  battery_percent = 12
  charge_timer = 0

  energy_delivered = "$25J \\times 40 \\times 60 = 60000J$";
  total_capacity = "$60000J \\div 0.88 \\approx 68182J$";
  total_capacity_2 = "$68000J$";
  p_vi = "$P=VI$"
  mah_power_1 = "$5000mA = 5A$"
  mah_power_2 = "$5A \\times 3.8V = 19W$"
  mah_capacity = "$19W \\times 3600s = 68400J$"
  ah_to_c = "$1Ah = 3600C$"
  mah_to_c = "$1mAh = 3600C \\div 1000 = 3.6C$"
  mah_to_c_2 = "$5000mAh = 5Ah$"
  mah_to_c_3 = "$5Ah = 5 \\times 3600C = 18000C$"
  c_times_v = "$18000C \\times 3.8V = 68400J$"

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
