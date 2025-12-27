import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, timer } from 'rxjs';
import { ThemeService } from 'src/app/physics/theme.service';
import { TrainDialogComponent } from '../train-dialog/train-dialog.component';

@Component({
    selector: 'app-train-home',
    templateUrl: './train-home.component.html',
    styleUrls: ['./train-home.component.scss'],
    standalone: false
})
export class TrainHomeComponent {

  constructor (
    public themeService: ThemeService,
    public dialog: MatDialog
  ) {}

  theme: 0 | 1 = 1 // 0 = light, 1 = dark

  chapters = [
    "Concept",
    "North-South Line"
  ]
  selectedIndex = 0


  ngAfterViewInit() {
    if (this.theme == 1) {
      this.setDarkTheme()
    } else {
      this.setLightTheme()
    }
  }

  setDarkTheme() {
    let x = document.getElementsByClassName("switch-touch-target")[0] as HTMLElement
    x.click()
    this.themeService.darkTheme()
  }
  
  setLightTheme() {
    this.themeService.lightTheme()
  }

  about_train(): void {
    this.dialog.open(TrainDialogComponent, {
      restoreFocus: false,
      autoFocus: false
    });
  }
}
