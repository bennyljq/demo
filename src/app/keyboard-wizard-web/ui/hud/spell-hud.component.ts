import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateManager, SpellInstance } from '../../core/state/game.state';

@Component({
  selector: 'kw-spell-hud',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="spell-hud" aria-label="Cryptomancer Spell Arsenal">
      <header class="hud-header">
        <span class="hud-title">SPELL MATRIX</span>
        <span class="hud-subtitle">TYPE INITIAL LETTER TO CAST</span>
      </header>

      <div class="spell-grid">
        @for (spell of computedSpells(); track spell.id) {
          <article
            class="spell-card"
            [class.affordable]="spell.isAffordable"
            [class.locked]="isLocked(spell)"
          >
            <div class="spell-word">
              <span class="first-letter">{{ spell.word[0] }}</span>
              <span class="rest-letters">{{ spell.word.slice(1) }}</span>
            </div>

            <div class="spell-stats">
              <span class="stat-mana">⚡ {{ spell.manaCost }} MP</span>
              <span class="stat-dmg">⚔ {{ spell.baseDamage }} DMG</span>
            </div>

            <div class="glow-border"></div>
          </article>
        } @empty {
          <div class="empty-spells">
            <span>NO SPELLS LOADED</span>
            <small>USE [CRAFT] BETWEEN NODES</small>
          </div>
        }
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      left: 10%;
      top: 20%;
      transform: translateY(-50%);
      z-index: 15;
      pointer-events: none;
    }

    .spell-hud {
      font-family: var(--kw-font-mono, 'Fira Code', 'Courier New', monospace);
      background: rgba(10, 10, 16, 0.85);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(51, 51, 68, 0.7);
      border-radius: 4px;
      padding: 12px 16px;
      min-width: 220px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
      pointer-events: auto;
    }

    .hud-header {
      margin-bottom: 10px;
      border-bottom: 1px solid rgba(51, 51, 68, 0.5);
      padding-bottom: 6px;
    }

    .hud-title {
      display: block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: var(--kw-spell-active, #B026FF);
      text-shadow: 0 0 8px rgba(176, 38, 255, 0.5);
    }

    .hud-subtitle {
      display: block;
      font-size: 9px;
      color: var(--kw-ui-dim, #666688);
      letter-spacing: 0.05em;
    }

    .spell-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .spell-card {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: rgba(20, 20, 30, 0.7);
      border: 1px solid var(--kw-ui-dim, #333344);
      border-radius: 3px;
      opacity: 0.5;
      transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .spell-card.affordable {
      opacity: 1;
      border-color: rgba(176, 38, 255, 0.6);
      background: rgba(30, 15, 45, 0.8);
      box-shadow: 0 0 12px rgba(176, 38, 255, 0.3);
    }

    .spell-card.locked {
      border-color: #FFFFFF;
      box-shadow: 0 0 16px rgba(255, 255, 255, 0.6);
      transform: scale(1.03);
    }

    .spell-word {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: var(--kw-ui-dim, #666688);
    }

    .affordable .spell-word {
      color: #FFFFFF;
    }

    .first-letter {
      color: var(--kw-spell-active, #B026FF);
      text-shadow: 0 0 6px rgba(176, 38, 255, 0.8);
    }

    .affordable .first-letter {
      color: #E29BFF;
    }

    .spell-stats {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      font-size: 9px;
      color: #8888AA;
    }

    .stat-mana {
      color: #A080FF;
    }

    .stat-dmg {
      color: #FFD700;
    }

    .empty-spells {
      text-align: center;
      padding: 12px;
      font-size: 10px;
      color: var(--kw-ui-dim, #555577);
    }

    .empty-spells small {
      display: block;
      margin-top: 4px;
      color: #777799;
    }
  `]
})
export class SpellHudComponent {
  public state = inject(GameStateManager);

  public computedSpells = () => {
    const currentMana = this.state.player().currentMana;
    return this.state.activeSpells().map(spell => ({
      ...spell,
      isAffordable: currentMana >= spell.manaCost,
    }));
  };

  public isLocked(spell: SpellInstance): boolean {
    const target = this.state.lockedTarget();
    return target !== null && target.id === spell.id;
  }
}

