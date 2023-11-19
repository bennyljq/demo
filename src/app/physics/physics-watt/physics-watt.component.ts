import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-physics-watt',
  templateUrl: './physics-watt.component.html',
  styleUrls: ['./physics-watt.component.scss', '../physics-intro/physics-intro.component.scss']
})
export class PhysicsWattComponent {

  constructor (
    public themeService: ThemeService
  ) {}

  @Output() selectChapter = new EventEmitter;
  @Input() selectedPageIndex = 0
  numPages = 5;
  pagesArray = new Array(this.numPages)
  hideBack = true
  hideNext = false

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
  }

  // variables & equations
  current_watt = 1
  anim_duration = 1
  anim_delay = 0

  content = "$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$";
  einstein = "$E = mc^2$";
  watt = "$1\\ W = 1\\ Js^{-1}$";
  joule_eq = "$= 1\\ J$";

  // charging animation
  set_watt(action: 'minus' | 'add') {
    if (action == 'minus' && this.current_watt > 1) {
      this.current_watt -= 1
    } else if (action == 'add' && this.current_watt < 10) {
      this.current_watt += 1
    }

    if (this.current_watt <= 5) {
      this.anim_duration = 1
      this.anim_delay = 1/this.current_watt
    } else if (this.current_watt <= 10) {
      this.anim_duration = 5/this.current_watt
      this.anim_delay = this.anim_duration/5
    }
  }

}
