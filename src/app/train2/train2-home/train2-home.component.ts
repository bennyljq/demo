import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from 'src/app/physics/theme.service';
import {Location} from '@angular/common';

@Component({
    selector: 'app-train2-home',
    templateUrl: './train2-home.component.html',
    styleUrls: ['./train2-home.component.scss'],
    standalone: false
})
export class Train2HomeComponent {

  constructor (
    public themeService: ThemeService,
    private _location: Location
  ) {}

  @Output() setPage = new EventEmitter
  @Input() exit = false
  
  goBack() {
    this.changeFavicon("assets/smiley.png")
    this._location.back();
  }

  changeFavicon(faviconUrl: string): void {
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  
}
