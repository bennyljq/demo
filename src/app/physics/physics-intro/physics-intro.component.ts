import { Component } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-physics-intro',
  templateUrl: './physics-intro.component.html',
  styleUrls: ['./physics-intro.component.scss']
})
export class PhysicsIntroComponent {

  constructor (
    public themeService: ThemeService
  ) {}

  numPages = 4;
  pagesArray = new Array(this.numPages)
  selectedPageIndex = 3

  prevPage() {
    this.selectedPageIndex = (this.selectedPageIndex + this.numPages - 1) % this.numPages
  }
  nextPage() {
    this.selectedPageIndex = (this.selectedPageIndex + 1) % this.numPages
  }
  
}
