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
  numPages = 3;
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

  answer_options = ['66,000 J', '67,000 J', '68,000 J', '69,000 J']
  correct_answer = 2
  picked_answer: number | undefined;
  question_answered = false
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
