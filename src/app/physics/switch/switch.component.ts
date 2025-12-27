import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    standalone: false
})
export class SwitchComponent {

  constructor (
    public themeService: ThemeService
  ) {}
  
  @Input() active = false;
  @Output() switchEmitter = new EventEmitter;
  firstClick = false

  toggle() {
    this.firstClick = true
    this.active = !this.active
    this.switchEmitter.emit(this.active)
  }

}
