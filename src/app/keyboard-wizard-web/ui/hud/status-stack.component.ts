import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateManager } from '../../core/state/game.state';
import { PrngService } from '../../core/state/prng.service';

@Component({
  selector: 'kw-status-stack',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="status-stack" aria-label="Tactical Status Monitor">
      <!-- Player Telemetry Section -->
      <section class="telemetry-card player-card" aria-label="Cryptomancer Telemetry">
        <header class="card-header">
          <span class="entity-badge player-badge">CRYPTOMANCER // ROOT</span>
          <span class="seed-badge" title="Mulberry32 PRNG Deterministic Seed">
            SEED: <strong class="seed-text">{{ prng.seed() }}</strong>
          </span>
        </header>

        <!-- HP Bar -->
        <div class="meter-group">
          <div class="meter-label">
            <span>INTEGRITY (HP)</span>
            <span class="meter-values">{{ state.player().currentHp }} / {{ state.player().maxHp }}</span>
          </div>
          <div class="meter-track" role="progressbar" [attr.aria-valuenow]="state.player().currentHp" [attr.aria-valuemin]="0" [attr.aria-valuemax]="state.player().maxHp">
            <div class="meter-fill hp-fill" [style.width.%]="(state.player().currentHp / state.player().maxHp) * 100"></div>
          </div>
        </div>

        <!-- Mana Bar -->
        <div class="meter-group">
          <div class="meter-label">
            <span>MANA OVERCLOCK</span>
            <span class="meter-values">{{ state.player().currentMana }} / {{ state.player().maxMana }}</span>
          </div>
          <div class="meter-track" role="progressbar" [attr.aria-valuenow]="state.player().currentMana" [attr.aria-valuemin]="0" [attr.aria-valuemax]="state.player().maxMana">
            <div class="meter-fill mana-fill" [style.width.%]="(state.player().currentMana / state.player().maxMana) * 100"></div>
          </div>
        </div>

        <!-- Resource Matrix (Kinetic Plating, Shields, XP, Multiplier) -->
        <div class="metric-row">
          <div class="metric-chip" [class.active-chip]="state.player().kineticPlatingCharges > 0">
            <span class="metric-icon">⬡</span>
            <span class="metric-name">KINETIC PLATING:</span>
            <span class="metric-val">{{ state.player().kineticPlatingCharges }} CHG</span>
          </div>

          <div class="metric-chip" [class.active-chip]="state.shieldStacks() > 0">
            <span class="metric-icon">🛡</span>
            <span class="metric-name">SHIELDS:</span>
            <span class="metric-val">{{ state.shieldStacks() }}</span>
          </div>

          <div class="metric-chip">
            <span class="metric-icon">⚡</span>
            <span class="metric-name">OVERCLOCK:</span>
            <span class="metric-val multiplier-val">{{ state.globalModifiers().damageMultiplier.toFixed(1) }}x</span>
          </div>

          <div class="metric-chip">
            <span class="metric-icon">◈</span>
            <span class="metric-name">SCRABBLE XP:</span>
            <span class="metric-val">{{ state.scrabbleXp() }}</span>
          </div>

          <div class="metric-chip">
            <span class="metric-icon">¤</span>
            <span class="metric-name">CREDITS:</span>
            <span class="metric-val gold-val">{{ state.player().gold }}G</span>
          </div>

          <div class="metric-chip">
            <span class="metric-icon">⌨</span>
            <span class="metric-name">APM/WPM:</span>
            <span class="metric-val">{{ state.wpm() }}</span>
          </div>
        </div>
      </section>

      <!-- Active Threats / Enemy Telemetry Section -->
      <section class="telemetry-card enemy-card" aria-label="Target Countermeasure Telemetry">
        <header class="card-header">
          <span class="entity-badge enemy-badge">{{ state.enemy().name }}</span>
          <span class="phase-badge" [class.invulnerable-badge]="state.enemy().isInvulnerable">
            {{ state.enemy().isInvulnerable ? 'AEGIS SHIELD ACTIVE' : 'PHASE ' + state.enemy().phase }}
          </span>
        </header>

        <div class="meter-group">
          <div class="meter-label">
            <span>TARGET ENTROPY</span>
            <span class="meter-values">{{ state.enemy().currentHp }} / {{ state.enemy().maxHp }}</span>
          </div>
          <div class="meter-track" role="progressbar" [attr.aria-valuenow]="state.enemy().currentHp" [attr.aria-valuemin]="0" [attr.aria-valuemax]="state.enemy().maxHp">
            <div
              class="meter-fill enemy-hp-fill"
              [class.invulnerable-fill]="state.enemy().isInvulnerable"
              [style.width.%]="(state.enemy().currentHp / state.enemy().maxHp) * 100"
            ></div>
          </div>
        </div>
      </section>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      top: 16px;
      left: 16px;
      right: 16px;
      z-index: 20;
      pointer-events: none;
    }

    .status-stack {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      font-family: var(--kw-font-mono, 'Fira Code', 'Courier New', monospace);
    }

    .telemetry-card {
      pointer-events: auto;
      background: rgba(10, 10, 16, 0.88);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(51, 51, 68, 0.8);
      border-radius: 4px;
      padding: 12px 16px;
      min-width: 320px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
      transition: border-color 200ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .player-card {
      border-left: 3px solid var(--kw-player-neon, #00FFCC);
    }

    .enemy-card {
      border-right: 3px solid var(--kw-enemy-neon, #FF0055);
      min-width: 300px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .entity-badge {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .player-badge {
      color: var(--kw-player-neon, #00FFCC);
      text-shadow: 0 0 8px rgba(0, 255, 204, 0.4);
    }

    .enemy-badge {
      color: var(--kw-enemy-neon, #FF0055);
      text-shadow: 0 0 8px rgba(255, 0, 85, 0.4);
    }

    .seed-badge {
      font-size: 10px;
      color: var(--kw-ui-dim, #666688);
      letter-spacing: 0.05em;
    }

    .seed-text {
      color: var(--kw-ui-text, #E0E0FF);
      font-weight: 600;
    }

    .phase-badge {
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 2px;
      background: rgba(255, 0, 85, 0.15);
      color: var(--kw-enemy-core, #FFB3C6);
      border: 1px solid rgba(255, 0, 85, 0.4);
      letter-spacing: 0.08em;
    }

    .invulnerable-badge {
      background: rgba(176, 38, 255, 0.2);
      color: #D68FFF;
      border-color: #B026FF;
      animation: pulse-glow 1.5s infinite alternate;
    }

    .meter-group {
      margin-bottom: 8px;
    }

    .meter-label {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #9999AA;
      margin-bottom: 3px;
      letter-spacing: 0.06em;
    }

    .meter-values {
      font-weight: 600;
      color: var(--kw-ui-text, #E0E0FF);
    }

    .meter-track {
      height: 8px;
      background: rgba(20, 20, 30, 0.9);
      border-radius: 2px;
      overflow: hidden;
      border: 1px solid rgba(51, 51, 68, 0.5);
    }

    .meter-fill {
      height: 100%;
      transition: width 200ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .hp-fill {
      background: linear-gradient(90deg, #00B894, #00FFCC);
      box-shadow: 0 0 8px rgba(0, 255, 204, 0.6);
    }

    .mana-fill {
      background: linear-gradient(90deg, #6C5CE7, #B026FF);
      box-shadow: 0 0 8px rgba(176, 38, 255, 0.6);
    }

    .enemy-hp-fill {
      background: linear-gradient(90deg, #D63031, #FF0055);
      box-shadow: 0 0 8px rgba(255, 0, 85, 0.6);
    }

    .invulnerable-fill {
      background: linear-gradient(90deg, #8E44AD, #B026FF) !important;
    }

    .metric-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .metric-chip {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(30, 30, 45, 0.6);
      border: 1px solid rgba(60, 60, 80, 0.4);
      padding: 3px 6px;
      border-radius: 2px;
      font-size: 10px;
      color: #A0A0C0;
    }

    .active-chip {
      border-color: var(--kw-player-neon, #00FFCC);
      color: var(--kw-player-neon, #00FFCC);
      background: rgba(0, 255, 204, 0.08);
    }

    .metric-icon {
      font-size: 11px;
    }

    .metric-val {
      font-weight: 700;
      color: var(--kw-ui-text, #E0E0FF);
    }

    .multiplier-val {
      color: #FFD700;
    }

    .gold-val {
      color: #FFD700;
    }

    @keyframes pulse-glow {
      from { opacity: 0.7; box-shadow: 0 0 4px #B026FF; }
      to { opacity: 1; box-shadow: 0 0 12px #B026FF; }
    }
  `]
})
export class StatusStackComponent {
  public state = inject(GameStateManager);
  public prng = inject(PrngService);
}

