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
  numPages = 2;
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
    this.selectedPageIndex = (this.selectedPageIndex + this.numPages - 1) % this.numPages
    this.setButtons()
  }
  nextPage() {
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
}
