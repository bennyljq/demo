import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from '../theme.service';

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
    this.init_question()
  }
  onDotClick(index: number) {
    if (this.preventNext && index > this.selectedPageIndex) { return }
    this.selectedPageIndex = index; 
    this.setButtons()
  }

  answer_options = ['66000 J', '67000 J', '68000 J', '69000 J']
  correct_answer = 2
  picked_answer: number | undefined;
  question_answered = false

  energy_delivered = "$25J \\times 40 \\times 60 = 60000J$";
  total_capacity = "$60000J \\div 0.88 \\approx 68182J$";
  total_capacity_2 = "$68000J$";
  p_vi = "$P=VI$"
  mah_power_1 = "$5000mA = 5A$"
  mah_power_2 = "$5A \\times 3.8V = 19W$"
  mah_capacity = "$19W \\times 3600s = 68400J$"

  init_question() {
    if (this.question_answered) { return }
    if (this.selectedPageIndex == 1) {
      this.hideNext = true
      this.preventNext = true
    } else {
      this.preventNext = false
    }
  }
  on_answer(answer_index: number) {
    this.picked_answer = answer_index
    this.question_answered = true
    this.hideNext = false
    this.preventNext = false
  }
  
}
