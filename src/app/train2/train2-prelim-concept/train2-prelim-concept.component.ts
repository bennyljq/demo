import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from 'src/app/physics/theme.service';
import {Location} from '@angular/common';
import { lastValueFrom, timer } from 'rxjs';

@Component({
  selector: 'app-train2-prelim-concept',
  templateUrl: './train2-prelim-concept.component.html',
  styleUrls: ['./train2-prelim-concept.component.scss', '../train2-home/train2-home.component.scss']
})
export class Train2PrelimConceptComponent {

  constructor (
    public themeService: ThemeService,
    private _location: Location
  ) {}
  
  @Output() setPage = new EventEmitter
  exit = false
  showCarriages = false

  async ngOnInit() {
    this.showCarriages = false
    await lastValueFrom(timer(0))
    this.showCarriages = true
  }

  goToURL(url: string) : void {
    window.open(url, "_blank");
  }

  goBack() {
    this._location.back();
  }
}
