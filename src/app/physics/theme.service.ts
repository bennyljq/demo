import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme-preference'; // Key used in localStorage

  // Initialize directly from localStorage
  isDarkTheme = localStorage.getItem(this.THEME_KEY) === 'true';

  constructor() { }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.saveTheme();
  }

  lightTheme() {
    this.isDarkTheme = false;
    this.saveTheme();
  }

  darkTheme() {
    this.isDarkTheme = true;
    this.saveTheme();
  }

  // Helper to save state
  private saveTheme() {
    localStorage.setItem(this.THEME_KEY, String(this.isDarkTheme));
  }
}