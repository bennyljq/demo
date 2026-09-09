import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  inject,
  signal,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateManager, MapNode, SpellInstance } from './core/state/game.state';
import { GameLoopService } from './core/engine/game-loop.service';
import { InputService } from './core/engine/input.service';
import { SpawnerService } from './core/engine/spawner.service';
import { AudioService } from './core/audio/audio.service';
import { PrngService } from './core/state/prng.service';
import { BOSS_INITIATION_SEQUENCE, BOSS_CORE_MELTDOWN_WORDS } from './core/dictionary/dictionary';

// UI Components
import { ViewportComponent } from './ui/viewport/viewport.component';
import { StatusStackComponent } from './ui/hud/status-stack.component';
import { TypingBufferComponent } from './ui/hud/typing-buffer.component';
import { SpellHudComponent } from './ui/hud/spell-hud.component';
import { CraftingDialogComponent } from './ui/crafting/crafting-dialog.component';
import { NodeMapComponent } from './ui/map/node-map.component';

@Component({
  selector: 'app-keyboard-wizard-web, keyboard-wizard-root',
  standalone: true,
  imports: [
    CommonModule,
    ViewportComponent,
    StatusStackComponent,
    TypingBufferComponent,
    SpellHudComponent,
    CraftingDialogComponent,
    NodeMapComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="terminal-root" [class.glitch-bg]="state.screenShake()">
      <!-- Primary 16:9 Procedural SVG Viewport -->
      <kw-viewport class="game-canvas"></kw-viewport>

      <!-- Head-Up Display Layers -->
      <kw-status-stack></kw-status-stack>
      <kw-spell-hud></kw-spell-hud>
      <kw-typing-buffer></kw-typing-buffer>

      <!-- Floating Tactical Control Bar -->
      <nav class="tactical-control-bar" aria-label="Tactical Controls">
        <button class="btn-ctrl" (click)="toggleCrafting()" title="Open Spell Forge">
          <span class="icon">⚗</span> SPELL FORGE
        </button>

        <button class="btn-ctrl" (click)="toggleMap()" title="View Sector Map">
          <span class="icon">🗺</span> SECTOR MAP
        </button>

        <button class="btn-ctrl" (click)="toggleAudio()" title="Toggle Sound">
          <span class="icon">{{ audio.muted() ? '🔇' : '🔊' }}</span>
        </button>

        <button class="btn-ctrl" (click)="showHelp.set(true)" title="Merlin Protocol Codex">
          <span class="icon">?</span>
        </button>
      </nav>

      <!-- Node Map Overlay -->
      @if (state.runPhase() === 'MAP') {
        <kw-node-map
          (startCombat)="onCombatEngaged($event)"
          (openCrafting)="showCrafting.set(true)"
        ></kw-node-map>
      }

      <!-- Spell Crafting Modal -->
      @if (showCrafting()) {
        <kw-crafting-dialog (close)="showCrafting.set(false)"></kw-crafting-dialog>
      }

      <!-- GAME OVER TERMINAL OVERLAY -->
      @if (state.runPhase() === 'GAME_OVER') {
        <div class="end-screen-backdrop" role="dialog" aria-modal="true" aria-labelledby="gameover-title">
          <section class="end-screen-card danger-card">
            <div class="danger-glitch">FATAL INTRUSION DETECTED</div>
            <h1 id="gameover-title">CRYPTOMANCER TERMINATED</h1>
            <p class="summary-text">
              The countermeasure breached memory address 0x000000. Your neural encryption collapsed.
            </p>

            <div class="run-stats-grid">
              <div class="stat-cell">
                <span class="cell-label">SECTOR REACHED</span>
                <span class="cell-val">SEC {{ state.currentNodeIndex() + 1 }} / 15</span>
              </div>
              <div class="stat-cell">
                <span class="cell-label">TYPING SPEED</span>
                <span class="cell-val">{{ state.wpm() }} WPM</span>
              </div>
              <div class="stat-cell">
                <span class="cell-label">TOTAL KEYSTROKES</span>
                <span class="cell-val">{{ state.validKeystrokes() }}</span>
              </div>
              <div class="stat-cell">
                <span class="cell-label">SCRABBLE XP ACCRUED</span>
                <span class="cell-val text-gold">{{ state.scrabbleXp() }} XP</span>
              </div>
            </div>

            <button class="btn-restart" (click)="restartRun()">RE-INITIALIZE PROTOCOL</button>
          </section>
        </div>
      }

      <!-- VICTORY TERMINAL OVERLAY -->
      @if (state.runPhase() === 'VICTORY') {
        <div class="end-screen-backdrop" role="dialog" aria-modal="true" aria-labelledby="victory-title">
          <section class="end-screen-card victory-card">
            <div class="victory-glitch">ROOT ACCESS GRANTED</div>
            <h1 id="victory-title">FIREWALL DISSOLVED // PROTOCOL COMPLETE</h1>
            <p class="summary-text">
              "The Architect" has been decrypted. All security sectors across the cyber-fantasy mainframe belong to you.
            </p>

            <div class="run-stats-grid">
              <div class="stat-cell">
                <span class="cell-label">FINAL TIME</span>
                <span class="cell-val">{{ getFormattedRunTime() }}</span>
              </div>
              <div class="stat-cell">
                <span class="cell-label">AVERAGE WPM</span>
                <span class="cell-val">{{ state.wpm() }} WPM</span>
              </div>
              <div class="stat-cell">
                <span class="cell-label">TOTAL SCRABBLE XP</span>
                <span class="cell-val text-gold">{{ state.scrabbleXp() }} XP</span>
              </div>
              <div class="stat-cell">
                <span class="cell-label">PRNG SEED</span>
                <span class="cell-val text-cyan">{{ prng.seed() }}</span>
              </div>
            </div>

            <button class="btn-restart btn-victory" (click)="restartRun()">COMMENCE NEW EXPEDITION</button>
          </section>
        </div>
      }

      <!-- MERLIN CODEX / INSTRUCTIONS MODAL -->
      @if (showHelp()) {
        <div class="codex-backdrop" role="dialog" aria-modal="true" aria-labelledby="codex-title">
          <article class="codex-modal">
            <header class="codex-header">
              <h2 id="codex-title">THE MERLIN PROTOCOL // OPERATIONAL CODEX</h2>
              <button class="close-btn" (click)="showHelp.set(false)" aria-label="Close Codex">✕</button>
            </header>

            <div class="codex-body">
              <section>
                <h3>1. ZERO-TOGGLE COMBAT & DYNAMIC LOCK-ON</h3>
                <p>
                  No clicking. No hotkeys. Simply type the initial letter of any incoming threat vector or affordable spell.
                  The Trie engine locks onto the target and fires staccato kinetic lasers for every valid keystroke.
                </p>
              </section>

              <section>
                <h3>2. THE MISTYPE TRAP</h3>
                <p>
                  Random key-mashing is severely penalized. Typing the wrong character traps your terminal.
                  To escape, type the correct character to continue the sequence, or press <strong>[ESC]</strong> to abort the buffer.
                  Kinetic Plating charges absorb mistypes without penalty.
                </p>
              </section>

              <section>
                <h3>3. SPELL CRAFTING & SCRABBLE MATRIX</h3>
                <p>
                  Construct 3-5 letter words in the Spell Forge. Damage is computed as <code>(Scrabble Points × Word Length)</code>.
                  Prefix Rule: Spells cannot share leading substrings or initial letters with other active spells.
                </p>
              </section>

              <section>
                <h3>4. NARRATIVE APM DECRYPTION</h3>
                <p>
                  Environmental lore in the bottom-left view begins as encrypted glyphs.
                  Every accurate keystroke resolves a glyph into true intelligence.
                </p>
              </section>
            </div>

            <footer class="codex-footer">
              <button class="btn-close-codex" (click)="showHelp.set(false)">CONFIRMED // RESUME</button>
            </footer>
          </article>
        </div>
      }
    </main>
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      overflow: hidden;

      /* Definitive Merlin Protocol CSS Custom Tokens */
      --kw-bg-void: #0A0A10;
      --kw-grid-line: rgba(0, 255, 204, 0.05);
      --kw-player-neon: #00FFCC;
      --kw-player-core: #FFFFFF;
      --kw-enemy-neon: #FF0055;
      --kw-enemy-core: #FFB3C6;
      --kw-projectile-shell: rgba(255, 215, 0, 0.2);
      --kw-projectile-neon: #FFD700;
      --kw-spell-active: #B026FF;
      --kw-ui-text: #E0E0FF;
      --kw-ui-dim: #333344;
      --kw-alert-error: #FF3333;
      --kw-alert-success: #00FFCC;
      --kw-font-mono: 'Fira Code', 'Courier New', monospace;

      background-color: var(--kw-bg-void);
      color: var(--kw-ui-text);
      font-family: var(--kw-font-mono);
      font-variant-ligatures: normal;
      font-feature-settings: "liga" 1, "calt" 1;
    }

    .terminal-root {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--kw-bg-void);
      overflow: hidden;
    }

    .game-canvas {
      width: 100%;
      height: 100%;
    }

    .tactical-control-bar {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      gap: 8px;
      z-index: 30;
    }

    .btn-ctrl {
      background: rgba(15, 15, 25, 0.85);
      border: 1px solid rgba(80, 80, 110, 0.6);
      color: #CCCCEE;
      font-family: var(--kw-font-mono);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      padding: 6px 12px;
      border-radius: 3px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 150ms ease;
    }

    .btn-ctrl:hover {
      background: rgba(30, 30, 50, 0.95);
      border-color: var(--kw-player-neon);
      color: #FFFFFF;
      box-shadow: 0 0 10px rgba(0, 255, 204, 0.3);
    }

    /* END SCREEN OVERLAYS */
    .end-screen-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 5, 10, 0.92);
      backdrop-filter: blur(14px);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .end-screen-card {
      background: rgba(14, 14, 22, 0.98);
      border-radius: 6px;
      padding: 32px;
      max-width: 580px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .danger-card {
      border: 1px solid var(--kw-alert-error);
      box-shadow: 0 0 35px rgba(255, 51, 51, 0.35);
    }

    .victory-card {
      border: 1px solid var(--kw-alert-success);
      box-shadow: 0 0 35px rgba(0, 255, 204, 0.35);
    }

    .danger-glitch {
      font-size: 11px;
      color: var(--kw-alert-error);
      letter-spacing: 0.2em;
      font-weight: 700;
    }

    .victory-glitch {
      font-size: 11px;
      color: var(--kw-alert-success);
      letter-spacing: 0.2em;
      font-weight: 700;
    }

    .end-screen-card h1 {
      margin: 0;
      font-size: 24px;
      color: #FFFFFF;
      letter-spacing: 0.1em;
    }

    .summary-text {
      font-size: 12px;
      color: #9999BB;
      line-height: 1.6;
      margin: 0;
    }

    .run-stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      width: 100%;
      margin: 12px 0;
    }

    .stat-cell {
      background: rgba(22, 22, 34, 0.8);
      border: 1px solid rgba(60, 60, 85, 0.6);
      border-radius: 4px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .cell-label {
      font-size: 9px;
      color: #777799;
    }

    .cell-val {
      font-size: 14px;
      font-weight: 700;
    }

    .btn-restart {
      background: var(--kw-alert-error);
      color: #FFFFFF;
      font-family: inherit;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.12em;
      padding: 12px 28px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 0 16px rgba(255, 51, 51, 0.4);
      transition: all 150ms ease;
    }

    .btn-restart:hover {
      box-shadow: 0 0 24px rgba(255, 51, 51, 0.8);
      transform: scale(1.02);
    }

    .btn-victory {
      background: var(--kw-alert-success);
      color: #0A0A10;
      box-shadow: 0 0 16px rgba(0, 255, 204, 0.4);
    }

    .btn-victory:hover {
      box-shadow: 0 0 24px rgba(0, 255, 204, 0.8);
    }

    /* CODEX MODAL */
    .codex-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 5, 10, 0.9);
      backdrop-filter: blur(12px);
      z-index: 150;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .codex-modal {
      background: rgba(14, 14, 22, 0.98);
      border: 1px solid rgba(80, 80, 120, 0.7);
      border-radius: 6px;
      max-width: 640px;
      width: 100%;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .codex-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(80, 80, 110, 0.5);
      padding-bottom: 12px;
    }

    .codex-header h2 {
      margin: 0;
      font-size: 15px;
      color: var(--kw-player-neon);
      letter-spacing: 0.1em;
    }

    .codex-body {
      display: flex;
      flex-direction: column;
      gap: 14px;
      font-size: 12px;
      color: #A0A0C0;
      line-height: 1.6;
    }

    .codex-body h3 {
      margin: 0 0 4px 0;
      font-size: 12px;
      color: #FFFFFF;
      letter-spacing: 0.08em;
    }

    .codex-body p {
      margin: 0;
    }

    .codex-footer {
      border-top: 1px solid rgba(80, 80, 110, 0.5);
      padding-top: 12px;
      display: flex;
      justify-content: flex-end;
    }

    .btn-close-codex {
      background: var(--kw-player-neon);
      color: #0A0A10;
      font-family: inherit;
      font-weight: 800;
      font-size: 11px;
      padding: 8px 16px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  public state = inject(GameStateManager);
  public gameLoop = inject(GameLoopService);
  public input = inject(InputService);
  public spawner = inject(SpawnerService);
  public audio = inject(AudioService);
  public prng = inject(PrngService);

  public showCrafting = signal<boolean>(false);
  public showHelp = signal<boolean>(false);

  private stateCheckTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Reactive monitor for Enemy HP, Boss Phases, and Player death
    effect(() => {
      const playerHp = this.state.player().currentHp;
      if (playerHp <= 0 && this.state.runPhase() === 'COMBAT') {
        this.state.runPhase.set('GAME_OVER');
        this.gameLoop.stop();
        this.audio.playFileSound('fail');
      }
    });

    effect(() => {
      const enemy = this.state.enemy();
      const isBoss = this.state.isBossEncounter();

      if (isBoss) {
        // Boss 3-Phase Logic
        const hpPercent = (enemy.currentHp / enemy.maxHp) * 100;

        if (hpPercent <= 70 && hpPercent > 30 && enemy.phase === 1) {
          // Trigger Phase 2: Aegis Protocol
          this.state.updateEnemy(e => ({ ...e, phase: 2, isInvulnerable: true }));
          this.spawner.spawnAegisShieldGenerators();
          this.audio.playMeltdownAlarm();
        } else if (hpPercent <= 30 && enemy.phase === 2) {
          // Trigger Phase 3: Core Meltdown
          this.state.updateEnemy(e => ({ ...e, phase: 3, isInvulnerable: false }));
          // Clear active projectiles for the final wall
          this.state.setProjectiles([]);
          const meltdownWord = this.prng.choice(BOSS_CORE_MELTDOWN_WORDS);
          this.state.bossMeltdownWall.set({
            x: 1700,
            fullWord: meltdownWord,
            typedIndex: 0,
            speed: 24, // Slow steady crawl toward X = 200
          });
          this.audio.playMeltdownAlarm();
        } else if (enemy.currentHp <= 0) {
          // Boss Defeated!
          this.state.runPhase.set('VICTORY');
          this.gameLoop.stop();
          this.audio.playFileSound('success');
        }
      } else {
        // Standard Enemy Defeated
        if (enemy.currentHp <= 0 && this.state.runPhase() === 'COMBAT') {
          this.onEnemyDefeated();
        }
      }
    });
  }

  public ngOnInit(): void {
    this.input.initGlobalListener();
    this.initStartingInventory();
    this.startFirstNode();
  }

  public ngOnDestroy(): void {
    this.gameLoop.stop();
    this.input.destroyGlobalListener();
    if (this.stateCheckTimer) {
      clearInterval(this.stateCheckTimer);
    }
  }

  private initStartingInventory(): void {
    // Initial Spells: "BOLT" and "NOVA"
    const spell1: SpellInstance = {
      id: 'spell-bolt',
      word: 'BOLT',
      baseDamage: 24, // B(3) + O(1) + L(1) + T(1) = 6 * 4 = 24
      manaCost: 40,
      isAffordable: true,
    };
    const spell2: SpellInstance = {
      id: 'spell-nova',
      word: 'NOVA',
      baseDamage: 28, // N(1) + O(1) + V(4) + A(1) = 7 * 4 = 28
      manaCost: 40,
      isAffordable: true,
    };
    this.state.setSpells([spell1, spell2]);
  }

  private startFirstNode(): void {
    this.configureCombatForNode(0);
    this.state.runPhase.set('COMBAT');
    this.gameLoop.start();
  }

  public onCombatEngaged(node: MapNode): void {
    this.configureCombatForNode(node.index);
    this.state.runPhase.set('COMBAT');
    this.gameLoop.start();
  }

  private configureCombatForNode(nodeIdx: number): void {
    this.state.currentNodeIndex.set(nodeIdx);
    this.state.setProjectiles([]);
    this.state.setLockedTarget(null);
    this.spawner.reset();

    if (nodeIdx === 14) {
      // Node 15: Final Boss "The Architect" (2500 HP)
      this.state.isBossEncounter.set(true);
      this.state.bossInitiationWords.set([...BOSS_INITIATION_SEQUENCE]);
      this.state.bossInitiationIndex.set(0);
      this.state.bossMeltdownWall.set(null);

      this.state.updateEnemy(() => ({
        id: 'the-architect',
        name: 'THE ARCHITECT',
        maxHp: 2500,
        currentHp: 2500,
        phase: 1,
        isInvulnerable: false,
      }));

      this.gameLoop.currentSpawnInterval = 1.5;
      this.gameLoop.currentBaseSpeed = 50;
      this.audio.playMeltdownAlarm();
    } else {
      this.state.isBossEncounter.set(false);
      const enemyHps = [100, 150, 200, 0, 500, 300, 400, 0, 1000, 1200, 1500, 1800, 0, 0, 2500];
      const hp = enemyHps[nodeIdx] || 150;

      this.state.updateEnemy(() => ({
        id: `countermeasure-${nodeIdx + 1}`,
        name: `COUNTERMEASURE SEC-${nodeIdx + 1}`,
        maxHp: hp,
        currentHp: hp,
        phase: 1,
        isInvulnerable: false,
      }));

      // Node pacing
      if (nodeIdx === 2) {
        this.gameLoop.currentSpawnInterval = 1.5; // 2 projectiles / 3s
      } else {
        this.gameLoop.currentSpawnInterval = 3.0;
      }
      this.gameLoop.currentBaseSpeed = 40;
    }
  }

  private onEnemyDefeated(): void {
    this.audio.playFileSound('success');
    this.gameLoop.stop();

    // Reward Gold and XP
    const goldReward = 20 + this.state.currentNodeIndex() * 5;
    this.state.updatePlayer(p => ({ ...p, gold: p.gold + goldReward }));
    this.state.addScrabbleXp(15);

    // Advance to Map
    const nextIdx = this.state.currentNodeIndex() + 1;
    this.state.currentNodeIndex.set(nextIdx);
    this.state.runPhase.set('MAP');
  }

  public restartRun(): void {
    const newSeed = PrngService.generateRandomSeed();
    this.prng.reseed(newSeed);

    this.state.updatePlayer(() => ({
      maxHp: 100,
      currentHp: 100,
      maxMana: 100,
      currentMana: 50,
      gold: 50,
      kineticPlatingCharges: this.state.kineticPlatingMax(),
    }));

    this.state.artifacts.set([]);
    this.state.shieldStacks.set(0);
    this.state.globalModifiers.set({ damageMultiplier: 1.0, projectileSpeedFactor: 1.0 });
    this.state.currentNodeIndex.set(0);
    this.state.runStartTime.set(Date.now());
    this.state.totalKeystrokes.set(0);
    this.state.validKeystrokes.set(0);

    this.initStartingInventory();
    this.startFirstNode();
  }

  public toggleCrafting(): void {
    this.showCrafting.update(v => !v);
  }

  public toggleMap(): void {
    if (this.state.runPhase() === 'MAP') {
      this.state.runPhase.set('COMBAT');
      this.gameLoop.start();
    } else if (this.state.runPhase() === 'COMBAT') {
      this.state.runPhase.set('MAP');
      this.gameLoop.stop();
    }
  }

  public toggleAudio(): void {
    this.audio.toggleMute();
  }

  public getFormattedRunTime(): string {
    const totalSec = Math.floor((Date.now() - this.state.runStartTime()) / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  }
}

// Re-export as KeyboardWizardWebComponent for easy consumption
export { AppComponent as KeyboardWizardWebComponent };

