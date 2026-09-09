import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SwitchComponent {
  
  constructor (
    public themeService: ThemeService
  ) {}
  
  ngOnInit() {
    this.active = this.themeService.isDarkTheme;
  }
  
  @Input() active = false;
  @Output() switchEmitter = new EventEmitter;
  firstClick = false
  
  toggle() {
    this.firstClick = true;
    this.themeService.toggleTheme(); // Update the service
    this.active = this.themeService.isDarkTheme; // Update local state
    this.switchEmitter.emit(this.active);
  }
  
}
