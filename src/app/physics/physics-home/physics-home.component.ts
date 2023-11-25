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
    "Watt is Love",
    "Battery, don't hurt me",
    "Unlimited Power!"
  ]
  selectedIndex = 3
  childPageIndex = 0

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // let x = document.getElementsByClassName("switch-touch-target")[0] as HTMLElement
    // x.click()
    // this.themeService.darkTheme()
    this.themeService.lightTheme()
  }

  onChapterSelect(event: any) {
    if (event == 'next') {
      this.childPageIndex = 0
      this.selectedIndex += 1
    } else if (event == 'previous') {
      this.childPageIndex = -1
      this.selectedIndex -= 1
    }
  }

}
