import { Component, HostListener } from '@angular/core';
import { lastValueFrom, timer } from 'rxjs';
import { ThemeService } from 'src/app/physics/theme.service';

@Component({
  selector: 'app-train2',
  templateUrl: './train2.component.html',
  styleUrls: ['./train2.component.scss']
})
export class Train2Component {

  constructor (
    public themeService: ThemeService
  ) {}
  
  theme: 0 | 1 = 1 // 0 = light, 1 = dark
  currentPage = 0
  pageWidth = 0
  pageHeight = 0
  skewAngle = 0
  numWood = 20
  showWood = true
  
  ngOnInit() {
    this.theme == 1 ? this.themeService.darkTheme() : this.themeService.lightTheme()
    this.onResize()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.pageWidth = window.innerWidth;
    this.pageHeight = window.innerHeight;
    this.calcSkew()
    this.calcWood()
  }

  calcSkew() {
    this.skewAngle = Math.atan( (this.pageHeight*0.2) / this.pageWidth * -1) * 180 / Math.PI
  }

  async calcWood() {
    this.numWood = Math.ceil(this.pageWidth / this.pageHeight * 20)
    this.showWood = false
    await lastValueFrom(timer(0))
    this.showWood = true
  }

}
