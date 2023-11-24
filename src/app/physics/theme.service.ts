import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }
  isDarkTheme = false;

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
  lightTheme() {
    this.isDarkTheme = false;
  }
  darkTheme() {
    this.isDarkTheme = true;
  }
}
