import { Component, ChangeDetectionStrategy, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateManager, SpellInstance } from '../../core/state/game.state';
import { AudioService } from '../../core/audio/audio.service';
import {
  SCRABBLE_LETTER_VALUES,
  getScrabbleValue,
  CRAFTABLE_SPELL_WORDS,
  ALL_DICTIONARY_WORDS
} from '../../core/dictionary/dictionary';

@Component({
  selector: 'kw-crafting-dialog',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="crafting-overlay" role="dialog" aria-modal="true" aria-labelledby="crafting-title">
      <div class="crafting-modal">
        <header class="modal-header">
          <div class="header-title">
            <span class="icon">⚗</span>
            <h2 id="crafting-title">CRYPTOMANTIC SPELL CRAFTING</h2>
          </div>
          <button class="close-btn" (click)="close.emit()" aria-label="Close dialog">✕</button>
        </header>

        <p class="modal-intro">
          Assemble 3 to 5 letter cryptographic spells.
          Spell damage equals <strong>(Scrabble Points × Word Length)</strong>.
          Enforces the <em>Prefix Rule</em>: Spells cannot share leading substrings.
        </p>

        <!-- Current Buffer and Projected Stats -->
        <div class="buffer-display-card">
          <div class="current-buffer">
            @for (char of currentWord().split(''); track $index) {
              <span class="buffer-letter">{{ char }}</span>
            }
            @if (currentWord().length === 0) {
              <span class="buffer-placeholder">SELECT LETTERS BELOW</span>
            }
          </div>

          <div class="buffer-actions">
            <button class="btn-sm btn-clear" (click)="clearBuffer()" [disabled]="currentWord().length === 0">
              CLEAR
            </button>
            <button class="btn-sm btn-backspace" (click)="backspace()" [disabled]="currentWord().length === 0">
              ⌫
            </button>
          </div>

          <div class="stats-preview">
            <div class="stat-pill">
              <span class="pill-label">SCRABBLE VAL:</span>
              <span class="pill-value">{{ currentScrabbleValue() }}</span>
            </div>
            <div class="stat-pill">
              <span class="pill-label">MANA COST:</span>
              <span class="pill-value">{{ currentWord().length * 10 }} MP</span>
            </div>
            <div class="stat-pill">
              <span class="pill-label">BASE DAMAGE:</span>
              <span class="pill-value dmg-value">{{ currentScrabbleValue() * currentWord().length }} DMG</span>
            </div>
          </div>

          @if (validationError()) {
            <div class="validation-message error-msg">
              ⚠ {{ validationError() }}
            </div>
          } @else if (isValidWord()) {
            <div class="validation-message success-msg">
              ✓ VALID FORMULA: READY TO INSCRIBE
            </div>
          }
        </div>

        <!-- Periodic Table Letter Matrix -->
        <div class="periodic-matrix" aria-label="Alphabet Periodic Grid">
          @for (letter of alphabet; track letter) {
            <button
              class="element-tile"
              [class.active-tier-high]="isHighValue(letter)"
              (click)="addLetter(letter)"
              [disabled]="currentWord().length >= 5"
            >
              <span class="letter-symbol">{{ letter }}</span>
              <span class="letter-value">{{ getLetterValue(letter) }}</span>
            </button>
          }
        </div>

        <!-- Active Spells List & Craft Button -->
        <footer class="modal-footer">
          <div class="existing-spells">
            <span class="existing-label">ACTIVE INVENTORY:</span>
            <div class="spell-tags">
              @for (spell of state.activeSpells(); track spell.id) {
                <span class="spell-tag">
                  {{ spell.word }} ({{ spell.manaCost }}MP)
                  <button class="remove-spell-btn" (click)="removeSpell(spell.id)">×</button>
                </span>
              } @empty {
                <span class="no-spells">EMPTY</span>
              }
            </div>
          </div>

          <button
            class="btn-primary-craft"
            [disabled]="!isValidWord()"
            (click)="inscribeSpell()"
          >
            INSCRIBE SPELL
          </button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }

    .crafting-overlay {
      position: fixed;
      inset: 0;
      background: rgba(5, 5, 10, 0.85);
      backdrop-filter: blur(12px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      font-family: var(--kw-font-mono, 'Fira Code', 'Courier New', monospace);
    }

    .crafting-modal {
      background: rgba(14, 14, 22, 0.98);
      border: 1px solid var(--kw-spell-active, #B026FF);
      box-shadow: 0 0 30px rgba(176, 38, 255, 0.35), 0 16px 48px rgba(0, 0, 0, 0.9);
      border-radius: 6px;
      width: 100%;
      max-width: 640px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      animation: modal-appear 250ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(176, 38, 255, 0.3);
      padding-bottom: 12px;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-title .icon {
      font-size: 20px;
      color: var(--kw-spell-active, #B026FF);
    }

    .header-title h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: #FFFFFF;
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--kw-ui-dim, #777799);
      font-size: 18px;
      cursor: pointer;
      transition: color 150ms ease;
    }

    .close-btn:hover {
      color: #FFFFFF;
    }

    .modal-intro {
      font-size: 11px;
      color: #9999BB;
      line-height: 1.5;
      margin: 0;
    }

    .buffer-display-card {
      background: rgba(20, 20, 32, 0.8);
      border: 1px solid rgba(80, 80, 110, 0.5);
      border-radius: 4px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .current-buffer {
      min-height: 48px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .buffer-letter {
      background: rgba(176, 38, 255, 0.2);
      border: 1px solid var(--kw-spell-active, #B026FF);
      color: #FFFFFF;
      font-size: 24px;
      font-weight: 800;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      box-shadow: 0 0 10px rgba(176, 38, 255, 0.4);
    }

    .buffer-placeholder {
      font-size: 12px;
      color: var(--kw-ui-dim, #666688);
      letter-spacing: 0.1em;
    }

    .buffer-actions {
      display: flex;
      gap: 8px;
    }

    .btn-sm {
      background: rgba(40, 40, 60, 0.7);
      border: 1px solid rgba(70, 70, 100, 0.5);
      color: #CCCCEE;
      font-family: inherit;
      font-size: 10px;
      padding: 4px 10px;
      border-radius: 2px;
      cursor: pointer;
    }

    .btn-sm:hover:not(:disabled) {
      background: rgba(60, 60, 90, 0.9);
      color: #FFFFFF;
    }

    .btn-sm:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .stats-preview {
      display: flex;
      gap: 12px;
      width: 100%;
      justify-content: center;
    }

    .stat-pill {
      background: rgba(10, 10, 16, 0.8);
      border: 1px solid rgba(50, 50, 70, 0.6);
      padding: 4px 10px;
      border-radius: 3px;
      font-size: 10px;
      display: flex;
      gap: 6px;
    }

    .pill-label {
      color: #8888AA;
    }

    .pill-value {
      font-weight: 700;
      color: #FFFFFF;
    }

    .dmg-value {
      color: #FFD700;
    }

    .validation-message {
      font-size: 11px;
      letter-spacing: 0.06em;
      font-weight: 600;
    }

    .error-msg {
      color: var(--kw-alert-error, #FF3333);
    }

    .success-msg {
      color: var(--kw-alert-success, #00FFCC);
    }

    .periodic-matrix {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
    }

    .element-tile {
      background: rgba(22, 22, 34, 0.8);
      border: 1px solid rgba(60, 60, 85, 0.6);
      border-radius: 3px;
      padding: 6px 2px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-family: inherit;
      transition: all 120ms ease;
    }

    .element-tile:hover:not(:disabled) {
      background: rgba(176, 38, 255, 0.25);
      border-color: var(--kw-spell-active, #B026FF);
      transform: translateY(-2px);
    }

    .active-tier-high {
      border-color: rgba(255, 215, 0, 0.4);
    }

    .active-tier-high .letter-value {
      color: #FFD700;
    }

    .letter-symbol {
      font-size: 14px;
      font-weight: 700;
      color: #FFFFFF;
    }

    .letter-value {
      font-size: 9px;
      color: #8888AA;
    }

    .modal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(50, 50, 70, 0.5);
      padding-top: 12px;
      gap: 16px;
    }

    .existing-spells {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 10px;
    }

    .existing-label {
      color: #777799;
    }

    .spell-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .spell-tag {
      background: rgba(176, 38, 255, 0.15);
      border: 1px solid rgba(176, 38, 255, 0.4);
      color: #E29BFF;
      padding: 2px 6px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .remove-spell-btn {
      background: none;
      border: none;
      color: #FF5577;
      cursor: pointer;
      font-size: 11px;
      padding: 0;
    }

    .no-spells {
      color: var(--kw-ui-dim, #555577);
    }

    .btn-primary-craft {
      background: var(--kw-spell-active, #B026FF);
      border: none;
      color: #FFFFFF;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.1em;
      padding: 10px 20px;
      border-radius: 3px;
      cursor: pointer;
      box-shadow: 0 0 15px rgba(176, 38, 255, 0.5);
      transition: all 150ms ease;
    }

    .btn-primary-craft:hover:not(:disabled) {
      background: #C44FFF;
      box-shadow: 0 0 22px rgba(176, 38, 255, 0.8);
      transform: scale(1.02);
    }

    .btn-primary-craft:disabled {
      background: rgba(50, 50, 70, 0.6);
      color: #777799;
      box-shadow: none;
      cursor: not-allowed;
    }

    @keyframes modal-appear {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class CraftingDialogComponent {
  public state = inject(GameStateManager);
  public audio = inject(AudioService);
  public close = output<void>();

  public alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  public currentWord = signal<string>('');

  public getLetterValue(char: string): number {
    return this.state.letterOverrides()[char] ?? SCRABBLE_LETTER_VALUES[char] ?? 1;
  }

  public isHighValue(char: string): boolean {
    return this.getLetterValue(char) >= 5;
  }

  public currentScrabbleValue(): number {
    return getScrabbleValue(this.currentWord(), this.state.letterOverrides());
  }

  public addLetter(char: string): void {
    if (this.currentWord().length < 5) {
      this.currentWord.update(w => w + char);
      this.audio.playFileSound('button-click');
    }
  }

  public clearBuffer(): void {
    this.currentWord.set('');
    this.audio.playFileSound('button-click');
  }

  public backspace(): void {
    this.currentWord.update(w => w.slice(0, -1));
    this.audio.playFileSound('button-click');
  }

  public validationError(): string | null {
    const word = this.currentWord();
    if (word.length === 0) return null;
    if (word.length < 3) return 'WORD MUST BE AT LEAST 3 CHARACTERS';
    if (word.length > 5) return 'WORD EXCEEDS MAXIMUM 5 CHARACTERS';

    // Check English dictionary
    const inDict = CRAFTABLE_SPELL_WORDS.includes(word) || ALL_DICTIONARY_WORDS.includes(word);
    if (!inDict) return `"${word}" IS NOT IN THE RECOGNIZED DICTIONARY`;

    // Check Prefix Rule against active spells
    const activeSpells = this.state.activeSpells();
    for (const existing of activeSpells) {
      if (existing.word === word) {
        return `SPELL "${word}" IS ALREADY INVENTORY LOADED`;
      }
      if (existing.word.startsWith(word)) {
        return `PREFIX CONFLICT: "${word}" IS A LEADING SUBSTRING OF "${existing.word}"`;
      }
      if (word.startsWith(existing.word)) {
        return `PREFIX CONFLICT: EXISTING SPELL "${existing.word}" IS A PREFIX OF "${word}"`;
      }
      if (word[0] === existing.word[0]) {
        return `INITIAL LETTER CONFLICT: SPELL "${existing.word}" ALREADY CLAIMS LETTER "${word[0]}"`;
      }
    }

    return null;
  }

  public isValidWord(): boolean {
    const word = this.currentWord();
    return word.length >= 3 && word.length <= 5 && this.validationError() === null;
  }

  public inscribeSpell(): void {
    if (!this.isValidWord()) return;

    const word = this.currentWord();
    const scrabbleVal = this.currentScrabbleValue();
    const length = word.length;
    const manaCost = length * 10;
    const baseDamage = scrabbleVal * length;

    const newSpell: SpellInstance = {
      id: `spell-${Date.now()}-${word}`,
      word,
      baseDamage,
      manaCost,
      isAffordable: this.state.player().currentMana >= manaCost,
    };

    this.state.addSpell(newSpell);
    this.audio.playFileSound('success');
    this.currentWord.set('');
  }

  public removeSpell(spellId: string): void {
    this.state.setSpells(this.state.activeSpells().filter(s => s.id !== spellId));
    this.audio.playFileSound('button-click');
  }
}

