import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'ordinal_theme';
  
  // Signal to hold the state
  theme = signal<'light' | 'dark'>('dark');

  constructor() {
    // 1. Load from storage on init
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as 'light' | 'dark';
    if (savedTheme) {
      this.theme.set(savedTheme);
    } else {
      // Optional: Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(prefersDark ? 'dark' : 'light');
    }

    // 2. Effect to update the DOM whenever the signal changes
    effect(() => {
      const currentTheme = this.theme();
      document.body.classList.remove('light-mode', 'dark-mode');
      document.body.classList.add(`${currentTheme}-mode`);
      localStorage.setItem(this.STORAGE_KEY, currentTheme);
    });
  }

  toggleTheme() {
    this.theme.update(current => (current === 'light' ? 'dark' : 'light'));
  }
}