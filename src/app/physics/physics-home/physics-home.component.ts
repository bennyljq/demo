import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-physics-home',
  templateUrl: './physics-home.component.html',
  styleUrls: ['./physics-home.component.scss']
})
export class PhysicsHomeComponent implements OnInit {

  constructor (
    public themeService: ThemeService
  ) {}

  chapters = [
    "Introduction",
    "Displacement"
  ]
  selectedChapter = this.chapters[0]

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // let x = document.getElementsByClassName("switch-touch-target")[0] as HTMLElement
    // x.click()
  }

}
