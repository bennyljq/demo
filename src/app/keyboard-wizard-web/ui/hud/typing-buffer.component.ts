import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateManager } from '../../core/state/game.state';

@Component({
  selector: 'kw-typing-buffer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="typing-buffer-container" [class.mistype-flash]="state.targetMistypeFlash()">
      @if (state.lockedTarget(); as target) {
        <div class="lock-panel" [class.spell-lock]="target.type === 'SPELL'">
          <div class="lock-header">
            <span class="target-type-badge">
              {{ target.type === 'SPELL' ? '✦ SPELL MATRIX LOCKED' : '⚠ THREAT VECTOR LOCKED' }}
            </span>
            <span class="esc-hint">PRESS <strong>[ESC]</strong> TO DROP LOCK</span>
          </div>

          <div class="word-stream">
            <span class="typed-part">{{ target.fullWord.slice(0, target.typedIndex) }}</span>
            <span class="cursor-char" [class.cursor-flash]="state.targetMistypeFlash()">
              {{ target.fullWord[target.typedIndex] || '' }}
            </span>
            <span class="untyped-part">{{ target.fullWord.slice(target.typedIndex + 1) }}</span>
          </div>

          <div class="lock-footer">
            <span>INDEX: {{ target.typedIndex }} / {{ target.fullWord.length }}</span>
            @if (state.targetMistypeFlash()) {
              <span class="trap-alert">MISTYPE TRAP ACTIVATED!</span>
            }
          </div>
        </div>
      } @else {
        <div class="idle-panel">
          <span class="pulse-indicator">●</span>
          <span class="idle-text">TERMINAL READY // TYPE INITIAL CHARACTER TO ENGAGE</span>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 25;
      pointer-events: none;
    }

    .typing-buffer-container {
      font-family: var(--kw-font-mono, 'Fira Code', 'Courier New', monospace);
      pointer-events: auto;
      transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .mistype-flash {
      animation: buffer-shake 180ms ease-in-out;
    }

    .lock-panel {
      background: rgba(10, 10, 16, 0.92);
      backdrop-filter: blur(12px);
      border: 1px solid var(--kw-alert-success, #00FFCC);
      border-radius: 4px;
      padding: 12px 24px;
      min-width: 440px;
      text-align: center;
      box-shadow: 0 0 20px rgba(0, 255, 204, 0.25), 0 8px 32px rgba(0, 0, 0, 0.8);
      transition: border-color 200ms ease, box-shadow 200ms ease;
    }

    .spell-lock {
      border-color: var(--kw-spell-active, #B026FF);
      box-shadow: 0 0 20px rgba(176, 38, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.8);
    }

    .lock-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 10px;
      letter-spacing: 0.1em;
    }

    .target-type-badge {
      color: var(--kw-alert-success, #00FFCC);
      font-weight: 700;
    }

    .spell-lock .target-type-badge {
      color: #D68FFF;
    }

    .esc-hint {
      color: var(--kw-ui-dim, #777799);
      font-size: 9px;
    }

    .esc-hint strong {
      color: #FFAA00;
    }

    .word-stream {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 0.25em;
      margin: 8px 0;
      font-feature-settings: "liga" 1, "calt" 1;
    }

    .typed-part {
      color: var(--kw-alert-success, #00FFCC);
      text-shadow: 0 0 10px rgba(0, 255, 204, 0.8);
    }

    .cursor-char {
      position: relative;
      color: #FFFFFF;
      background: rgba(0, 255, 204, 0.3);
      border-bottom: 3px solid var(--kw-alert-success, #00FFCC);
      padding: 0 2px;
      animation: cursor-pulse 800ms infinite alternate;
    }

    .cursor-flash {
      background: rgba(255, 51, 51, 0.5) !important;
      border-color: var(--kw-alert-error, #FF3333) !important;
      color: #FF3333 !important;
    }

    .untyped-part {
      color: var(--kw-ui-text, #E0E0FF);
      opacity: 0.7;
    }

    .lock-footer {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #8888AA;
      margin-top: 4px;
    }

    .trap-alert {
      color: var(--kw-alert-error, #FF3333);
      font-weight: 700;
      letter-spacing: 0.1em;
      animation: blink-error 400ms infinite alternate;
    }

    .idle-panel {
      background: rgba(10, 10, 16, 0.8);
      border: 1px dashed rgba(60, 60, 80, 0.8);
      border-radius: 4px;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .pulse-indicator {
      color: var(--kw-player-neon, #00FFCC);
      font-size: 10px;
      animation: blink-idle 1.5s infinite;
    }

    .idle-text {
      font-size: 11px;
      color: #777799;
      letter-spacing: 0.12em;
    }

    @keyframes cursor-pulse {
      from { opacity: 0.8; }
      to { opacity: 1; text-shadow: 0 0 12px #00FFCC; }
    }

    @keyframes blink-idle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }

    @keyframes blink-error {
      from { opacity: 0.5; }
      to { opacity: 1; }
    }

    @keyframes buffer-shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `]
})
export class TypingBufferComponent {
  public state = inject(GameStateManager);
}

