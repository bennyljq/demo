import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typing-homepage',
  imports: [CommonModule],
  templateUrl: './typing-homepage.component.html',
  styleUrl: './typing-homepage.component.scss',
})
export class TypingHomepageComponent {

  // Stores recent keys (you can switch to string[] if you prefer)
  keys: string[] = [];

  // Optional: keep only the last N keys
  readonly maxKeys = 50;

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Ignore repeats if you hold a key down (optional)
    if (event.repeat) return;

    // Some helpful formatting
    const key = this.formatKey(event);

    this.keys.push(key);
    if (this.keys.length > this.maxKeys) {
      this.keys.shift();
    }

    // If you want to block browser defaults for certain keys, do it selectively:
    // if (event.key === ' ') event.preventDefault();
  }

  clear() {
    this.keys = [];
  }

  private formatKey(e: KeyboardEvent): string {
    // Show modifiers + key, e.g. "Ctrl+Shift+K"
    const mods = [
      e.ctrlKey ? 'Ctrl' : null,
      e.altKey ? 'Alt' : null,
      e.metaKey ? 'Meta' : null,
      e.shiftKey ? 'Shift' : null,
    ].filter(Boolean);

    const k = e.key === ' ' ? 'Space' : e.key;

    // Avoid "Shift+Shift" when the key itself is Shift
    const base =
      k === 'Shift' || k === 'Control' || k === 'Alt' || k === 'Meta'
        ? k
        : [...mods, k].join('+');

    return base;
  }
}
