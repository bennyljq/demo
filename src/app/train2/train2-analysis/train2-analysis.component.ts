import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from 'src/app/physics/theme.service';

@Component({
    selector: 'app-train2-analysis',
    templateUrl: './train2-analysis.component.html',
    styleUrls: ['./train2-analysis.component.scss', '../train2-home/train2-home.component.scss'],
    standalone: false
})
export class Train2AnalysisComponent {

  constructor (
    public themeService: ThemeService
  ) {}
  
  @Output() setPage = new EventEmitter
  exit = false

  goToURL(url: string) : void {
    window.open(url, "_blank");
  }
  
}
