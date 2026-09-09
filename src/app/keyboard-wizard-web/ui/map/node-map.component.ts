import { Component, ChangeDetectionStrategy, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateManager, MapNode, ProjectileModifier } from '../../core/state/game.state';
import { AudioService } from '../../core/audio/audio.service';
import { PrngService } from '../../core/state/prng.service';
import { ARTIFACT_REGISTRY, CatalogArtifact } from '../../core/artifacts/artifact-registry';
import { SCRABBLE_LETTER_VALUES } from '../../core/dictionary/dictionary';

@Component({
  selector: 'kw-node-map',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="map-overlay" role="dialog" aria-modal="true" aria-label="Merlin Protocol Node Navigator">
      <div class="map-container">
        <header class="map-header">
          <div class="title-cluster">
            <span class="protocol-tag">MERLIN PROTOCOL // RUN DIRECTORY</span>
            <h2>NEURAL FIREWALL TRAVERSAL (NODE {{ state.currentNodeIndex() + 1 }} / 15)</h2>
          </div>
          <div class="header-actions">
            <button class="btn-meta" (click)="showMetaHub.set(true)">
              META-HUB ({{ state.scrabbleXp() }} XP)
            </button>
            <button class="btn-craft-shortcut" (click)="openCrafting.emit()">
              SPELL FORGE
            </button>
          </div>
        </header>

        <!-- Node Map Linear Visualizer with Branching Choice Markers -->
        <nav class="node-track" aria-label="Firewall Sectors">
          @for (node of nodes; track node.index) {
            <div
              class="node-step"
              [class.completed]="node.index < state.currentNodeIndex()"
              [class.active]="node.index === state.currentNodeIndex()"
              [class.locked]="node.index > state.currentNodeIndex()"
            >
              <div class="node-icon-box">
                @switch (node.type) {
                  @case ('NORMAL_COMBAT') { <span>⚔</span> }
                  @case ('HARD_COMBAT') { <span class="text-danger">⚔⚔</span> }
                  @case ('ELITE') { <span class="text-warning">☠</span> }
                  @case ('EVENT_SHOP') { <span class="text-gold">¤</span> }
                  @case ('FINAL_SHOP') { <span class="text-gold">¤¤</span> }
                  @case ('EVENT_LORE') { <span class="text-purple">📜</span> }
                  @case ('REST') { <span class="text-cyan">✚</span> }
                  @case ('FINAL_BOSS') { <span class="text-danger-boss">👑</span> }
                }
              </div>

              <div class="node-index-badge">SEC {{ node.index + 1 }}</div>
              <div class="node-name-label">{{ node.title }}</div>

              @if (node.index < 14) {
                <div class="connector-line"></div>
              }
            </div>
          }
        </nav>

        <!-- Active Node Details Card -->
        <main class="active-node-panel">
          @if (currentNode(); as activeNode) {
            <article class="node-briefing">
              <div class="briefing-header">
                <span class="sector-type">{{ activeNode.type }}</span>
                <h3>{{ activeNode.title }}</h3>
                <p class="sector-desc">{{ activeNode.description }}</p>
              </div>

              <div class="briefing-stats">
                @if (activeNode.enemyHp > 0) {
                  <div class="stat-box">
                    <span class="label">TARGET ENTITY:</span>
                    <span class="value">{{ activeNode.enemyName }}</span>
                  </div>
                  <div class="stat-box">
                    <span class="label">ESTIMATED HP:</span>
                    <span class="value text-danger">{{ activeNode.enemyHp }} HP</span>
                  </div>
                  @if (activeNode.modifiers.length > 0) {
                    <div class="stat-box">
                      <span class="label">MODIFIERS:</span>
                      <span class="value text-warning">{{ activeNode.modifiers.join(', ') }}</span>
                    </div>
                  }
                }
              </div>

              <!-- Action button for active sector -->
              <div class="briefing-actions">
                @switch (activeNode.type) {
                  @case ('EVENT_SHOP') {
                    <button class="btn-engage btn-shop" (click)="showShop.set(true)">
                      ENTER INTRUSION BLACK MARKET
                    </button>
                  }
                  @case ('FINAL_SHOP') {
                    <button class="btn-engage btn-shop" (click)="showShop.set(true)">
                      LIQUIDATE CREDITS (FINAL REQUISITION)
                    </button>
                  }
                  @case ('EVENT_LORE') {
                    <button class="btn-engage btn-lore" (click)="showLoreEvent.set(true)">
                      COMMENCE NARRATIVE DECRYPTION
                    </button>
                  }
                  @case ('REST') {
                    <button class="btn-engage btn-rest" (click)="showRestModal.set(true)">
                      ACCESS REST PROTOCOL
                    </button>
                  }
                  @default {
                    <button class="btn-engage" (click)="commenceCombat(activeNode)">
                      BREACH SECTOR // ENGAGE ENEMY
                    </button>
                  }
                }
              </div>
            </article>
          }
        </main>
      </div>

      <!-- SHOP MODAL -->
      @if (showShop()) {
        <div class="sub-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="shop-title">
          <section class="sub-modal shop-modal">
            <header class="sub-header">
              <h3 id="shop-title">INTRUSION BLACK MARKET // LIQUIDATION PROTOCOL</h3>
              <div class="gold-counter">AVAILABLE CREDITS: <strong>{{ state.player().gold }}G</strong></div>
            </header>

            <div class="shop-grid">
              <div class="shop-section">
                <h4>SYNERGISTIC ARTIFACT REQUISITION</h4>
                <div class="artifact-cards">
                  @for (art of availableShopArtifacts(); track art.id) {
                    <div class="shop-item-card" [class.owned]="hasArtifact(art.id)">
                      <div class="item-title">
                        <span class="item-name">{{ art.name }}</span>
                        <span class="item-rarity" [ngClass]="'rarity-' + art.rarity.toLowerCase()">{{ art.rarity }}</span>
                      </div>
                      <p class="item-desc">{{ art.description }}</p>
                      <button
                        class="btn-buy"
                        [disabled]="hasArtifact(art.id) || state.player().gold < art.cost"
                        (click)="buyArtifact(art)"
                      >
                        {{ hasArtifact(art.id) ? 'OWNED' : 'BUY FOR ' + art.cost + 'G' }}
                      </button>
                    </div>
                  }
                </div>
              </div>

              <div class="shop-section">
                <h4>LETTER SCRABBLE UPGRADES (+2 PTS EACH, COST: 25G)</h4>
                <div class="letter-upgrade-grid">
                  @for (letter of shopUpgradeLetters; track letter) {
                    <button
                      class="btn-upgrade-letter"
                      [disabled]="state.player().gold < 25"
                      (click)="upgradeLetter(letter)"
                    >
                      <span class="letter-char">{{ letter }}</span>
                      <span class="letter-val">+2 PTS (25G)</span>
                    </button>
                  }
                </div>
              </div>
            </div>

            <footer class="sub-footer">
              <button class="btn-close-sub" (click)="showShop.set(false)">RETURN TO MAP</button>
              <button class="btn-proceed" (click)="advanceNode()">CONTINUE TO NEXT SECTOR →</button>
            </footer>
          </section>
        </div>
      }

      <!-- REST SITE MODAL -->
      @if (showRestModal()) {
        <div class="sub-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="rest-title">
          <section class="sub-modal rest-modal">
            <header class="sub-header">
              <h3 id="rest-title">SECURITY HAVEN // REBOOT MATRIX</h3>
              <p>Choose one restorative sub-routine before entering the final firewall.</p>
            </header>

            <div class="binary-choice-grid">
              <button class="choice-card" (click)="restOptionHeal()">
                <span class="choice-icon">💖</span>
                <h4>FULL INTEGRITY RESTORATION</h4>
                <p>Repair all cellular damage. Sets Player HP to 100%.</p>
                <span class="btn-select">INITIALIZE REPAIR</span>
              </button>

              <button class="choice-card" (click)="restOptionPlating()">
                <span class="choice-icon">🛡</span>
                <h4>REINFORCE KINETIC PLATING</h4>
                <p>Install +1 Maximum Kinetic Plating charge to absorb mistypes.</p>
                <span class="btn-select">REINFORCE PLATING</span>
              </button>
            </div>
          </section>
        </div>
      }

      <!-- LORE EVENT MODAL -->
      @if (showLoreEvent()) {
        <div class="sub-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="lore-title">
          <section class="sub-modal lore-modal">
            <header class="sub-header">
              <h3 id="lore-title">ARCHITECT NEURAL DECRYPTION PROTOCOL</h3>
              <p>An encrypted cryptographic cache has been intercepted. Decrypting...</p>
            </header>

            <div class="lore-box">
              <code>
                [TRANSMISSION INTERCEPTED - ORIGIN: THE ARCHITECT]
                "The Cryptomancer thinks their fingers can outpace our machine logic.
                 Take this relic, interloper. Let us see if your mind can withstand the Aegis."
              </code>
            </div>

            <div class="legendary-reward-display">
              <span class="reward-title">CLAIM FREE LEGENDARY ARTIFACT:</span>
              <div class="reward-choices">
                @for (art of legendaryRewards; track art.id) {
                  <button
                    class="btn-legendary"
                    [disabled]="hasArtifact(art.id)"
                    (click)="claimLegendaryReward(art)"
                  >
                    <strong>{{ art.name }}</strong>
                    <small>{{ art.description }}</small>
                  </button>
                }
              </div>
            </div>
          </section>
        </div>
      }

      <!-- META-HUB MODAL -->
      @if (showMetaHub()) {
        <div class="sub-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="meta-title">
          <section class="sub-modal hub-modal">
            <header class="sub-header">
              <h3 id="meta-title">MERLIN META-PROGRESSION HUB</h3>
              <p>Spend earned Scrabble XP on persistent survivability augmentations.</p>
            </header>

            <div class="hub-content">
              <div class="xp-display">
                AVAILABLE SCRABBLE XP: <strong>{{ state.scrabbleXp() }} XP</strong>
              </div>

              <div class="upgrade-card">
                <h4>KINETIC PLATING FORGIVENESS CHARGES</h4>
                <p>
                  Forgives mistypes during high-speed typing runs without triggering the Mistype Trap.
                  Currently: {{ state.player().kineticPlatingCharges }} / {{ state.kineticPlatingMax() }}
                </p>
                <button
                  class="btn-buy"
                  [disabled]="state.kineticPlatingMax() >= 3 || state.scrabbleXp() < 100"
                  (click)="upgradeKineticPlating()"
                >
                  {{ state.kineticPlatingMax() >= 3 ? 'MAX LEVEL (3 CHARGES)' : 'UPGRADE MAX CHARGE (100 XP)' }}
                </button>
              </div>
            </div>

            <footer class="sub-footer">
              <button class="btn-close-sub" (click)="showMetaHub.set(false)">CLOSE HUB</button>
            </footer>
          </section>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }

    .map-overlay {
      position: fixed;
      inset: 0;
      background: rgba(10, 10, 16, 0.95);
      backdrop-filter: blur(14px);
      z-index: 50;
      display: flex;
      flex-direction: column;
      padding: 24px;
      font-family: var(--kw-font-mono, 'Fira Code', 'Courier New', monospace);
      overflow-y: auto;
    }

    .map-container {
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .map-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(0, 255, 204, 0.25);
      padding-bottom: 16px;
    }

    .protocol-tag {
      font-size: 11px;
      color: var(--kw-player-neon, #00FFCC);
      letter-spacing: 0.15em;
    }

    .map-header h2 {
      margin: 4px 0 0 0;
      font-size: 20px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.08em;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-meta, .btn-craft-shortcut {
      background: rgba(20, 20, 35, 0.8);
      border: 1px solid var(--kw-spell-active, #B026FF);
      color: #FFFFFF;
      padding: 8px 16px;
      font-family: inherit;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      border-radius: 3px;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(176, 38, 255, 0.3);
      transition: all 150ms ease;
    }

    .btn-meta:hover, .btn-craft-shortcut:hover {
      background: var(--kw-spell-active, #B026FF);
      box-shadow: 0 0 18px rgba(176, 38, 255, 0.6);
    }

    .node-track {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 8px;
      background: rgba(14, 14, 22, 0.8);
      border: 1px solid rgba(50, 50, 75, 0.5);
      border-radius: 6px;
      overflow-x: auto;
    }

    .node-step {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 72px;
      gap: 4px;
    }

    .node-icon-box {
      width: 40px;
      height: 40px;
      background: rgba(25, 25, 38, 0.9);
      border: 1px solid rgba(80, 80, 110, 0.5);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 200ms ease;
    }

    .completed .node-icon-box {
      border-color: var(--kw-player-neon, #00FFCC);
      background: rgba(0, 255, 204, 0.1);
      box-shadow: 0 0 8px rgba(0, 255, 204, 0.3);
    }

    .active .node-icon-box {
      border-color: #FFD700;
      background: rgba(255, 215, 0, 0.2);
      box-shadow: 0 0 16px rgba(255, 215, 0, 0.6);
      transform: scale(1.1);
    }

    .locked {
      opacity: 0.4;
    }

    .node-index-badge {
      font-size: 9px;
      color: #8888AA;
      letter-spacing: 0.05em;
    }

    .node-name-label {
      font-size: 9px;
      text-align: center;
      color: #CCCCCC;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 70px;
    }

    .connector-line {
      position: absolute;
      top: 20px;
      right: -10px;
      width: 12px;
      height: 2px;
      background: rgba(60, 60, 90, 0.6);
      z-index: 1;
    }

    .text-danger { color: #FF0055; }
    .text-warning { color: #FFAA00; }
    .text-gold { color: #FFD700; }
    .text-purple { color: #B026FF; }
    .text-cyan { color: #00FFCC; }
    .text-danger-boss { color: #FF3333; font-size: 18px; }

    .active-node-panel {
      background: rgba(16, 16, 26, 0.9);
      border: 1px solid rgba(80, 80, 115, 0.6);
      border-radius: 6px;
      padding: 24px;
    }

    .node-briefing {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sector-type {
      font-size: 10px;
      color: var(--kw-player-neon, #00FFCC);
      letter-spacing: 0.12em;
    }

    .briefing-header h3 {
      margin: 4px 0 8px 0;
      font-size: 22px;
      color: #FFFFFF;
      letter-spacing: 0.08em;
    }

    .sector-desc {
      color: #A0A0C0;
      font-size: 13px;
      line-height: 1.6;
      margin: 0;
    }

    .briefing-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .stat-box {
      background: rgba(25, 25, 38, 0.8);
      border: 1px solid rgba(60, 60, 90, 0.5);
      border-radius: 3px;
      padding: 8px 14px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-box .label {
      font-size: 9px;
      color: #777799;
    }

    .stat-box .value {
      font-size: 14px;
      font-weight: 700;
    }

    .btn-engage {
      background: var(--kw-alert-success, #00FFCC);
      color: #0A0A10;
      font-family: inherit;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.12em;
      padding: 14px 28px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 0 16px rgba(0, 255, 204, 0.5);
      transition: all 180ms ease;
    }

    .btn-engage:hover {
      box-shadow: 0 0 28px rgba(0, 255, 204, 0.9);
      transform: translateY(-2px);
    }

    .btn-shop {
      background: #FFD700;
      box-shadow: 0 0 16px rgba(255, 215, 0, 0.5);
    }

    .btn-shop:hover {
      box-shadow: 0 0 28px rgba(255, 215, 0, 0.9);
    }

    .btn-lore {
      background: #B026FF;
      color: #FFFFFF;
      box-shadow: 0 0 16px rgba(176, 38, 255, 0.5);
    }

    .btn-rest {
      background: #00B894;
      color: #FFFFFF;
      box-shadow: 0 0 16px rgba(0, 184, 148, 0.5);
    }

    /* SUB MODALS */
    .sub-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 5, 10, 0.9);
      backdrop-filter: blur(12px);
      z-index: 120;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .sub-modal {
      background: rgba(14, 14, 22, 0.98);
      border: 1px solid rgba(80, 80, 120, 0.7);
      box-shadow: 0 0 35px rgba(0, 0, 0, 0.9);
      border-radius: 6px;
      max-width: 800px;
      width: 100%;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .sub-header {
      border-bottom: 1px solid rgba(60, 60, 90, 0.6);
      padding-bottom: 10px;
    }

    .sub-header h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      color: #FFFFFF;
      letter-spacing: 0.08em;
    }

    .sub-header p {
      margin: 0;
      font-size: 11px;
      color: #8888AA;
    }

    .gold-counter {
      font-size: 12px;
      color: #FFD700;
      margin-top: 4px;
    }

    .shop-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .shop-section h4 {
      margin: 0 0 10px 0;
      font-size: 12px;
      color: #B026FF;
      letter-spacing: 0.08em;
    }

    .artifact-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 10px;
    }

    .shop-item-card {
      background: rgba(22, 22, 34, 0.8);
      border: 1px solid rgba(60, 60, 90, 0.5);
      border-radius: 4px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
    }

    .item-title {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 700;
    }

    .item-name {
      color: #FFFFFF;
    }

    .item-rarity {
      font-size: 9px;
      padding: 1px 4px;
      border-radius: 2px;
    }

    .rarity-common { color: #AAAAAA; }
    .rarity-rare { color: #00FFCC; }
    .rarity-legendary { color: #FFD700; }
    .rarity-cursed { color: #FF0055; }

    .item-desc {
      font-size: 10px;
      color: #8888AA;
      margin: 0;
      line-height: 1.4;
    }

    .btn-buy {
      background: rgba(176, 38, 255, 0.2);
      border: 1px solid var(--kw-spell-active, #B026FF);
      color: #FFFFFF;
      font-family: inherit;
      font-size: 10px;
      padding: 6px;
      border-radius: 3px;
      cursor: pointer;
    }

    .btn-buy:hover:not(:disabled) {
      background: var(--kw-spell-active, #B026FF);
    }

    .btn-buy:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .letter-upgrade-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 6px;
    }

    .btn-upgrade-letter {
      background: rgba(25, 25, 40, 0.8);
      border: 1px solid rgba(70, 70, 100, 0.6);
      border-radius: 3px;
      padding: 6px;
      font-family: inherit;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }

    .letter-char {
      font-size: 14px;
      font-weight: 700;
      color: #FFD700;
    }

    .letter-val {
      font-size: 8px;
      color: #8888AA;
    }

    .sub-footer {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid rgba(60, 60, 90, 0.5);
      padding-top: 12px;
    }

    .btn-close-sub {
      background: rgba(40, 40, 60, 0.7);
      border: 1px solid rgba(70, 70, 100, 0.6);
      color: #CCCCEE;
      font-family: inherit;
      padding: 8px 16px;
      border-radius: 3px;
      cursor: pointer;
    }

    .btn-proceed {
      background: var(--kw-alert-success, #00FFCC);
      color: #0A0A10;
      font-family: inherit;
      font-weight: 800;
      padding: 8px 20px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }

    /* BINARY CHOICE MODAL */
    .binary-choice-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .choice-card {
      background: rgba(22, 22, 34, 0.8);
      border: 1px solid rgba(70, 70, 100, 0.6);
      border-radius: 4px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 10px;
      cursor: pointer;
      font-family: inherit;
      transition: all 150ms ease;
    }

    .choice-card:hover {
      border-color: var(--kw-player-neon, #00FFCC);
      box-shadow: 0 0 16px rgba(0, 255, 204, 0.3);
      transform: translateY(-2px);
    }

    .choice-icon {
      font-size: 32px;
    }

    .choice-card h4 {
      margin: 0;
      color: #FFFFFF;
      font-size: 14px;
    }

    .choice-card p {
      margin: 0;
      font-size: 11px;
      color: #8888AA;
    }

    .btn-select {
      margin-top: 8px;
      background: var(--kw-player-neon, #00FFCC);
      color: #0A0A10;
      font-weight: 800;
      font-size: 11px;
      padding: 6px 14px;
      border-radius: 3px;
    }

    .lore-box {
      background: rgba(10, 10, 16, 0.9);
      border: 1px dashed #B026FF;
      padding: 16px;
      border-radius: 4px;
    }

    .lore-box code {
      font-size: 11px;
      color: #E29BFF;
      white-space: pre-wrap;
    }

    .legendary-reward-display {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .reward-title {
      font-size: 11px;
      color: #FFD700;
      font-weight: 700;
    }

    .reward-choices {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .btn-legendary {
      background: rgba(255, 215, 0, 0.1);
      border: 1px solid #FFD700;
      border-radius: 4px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
    }

    .btn-legendary:hover:not(:disabled) {
      background: rgba(255, 215, 0, 0.25);
      box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);
    }

    .btn-legendary strong {
      color: #FFD700;
      font-size: 12px;
    }

    .btn-legendary small {
      color: #CCCCCC;
      font-size: 10px;
    }
  `]
})
export class NodeMapComponent {
  public state = inject(GameStateManager);
  public audio = inject(AudioService);
  public prng = inject(PrngService);

  public openCrafting = output<void>();
  public startCombat = output<MapNode>();

  public showShop = signal<boolean>(false);
  public showRestModal = signal<boolean>(false);
  public showLoreEvent = signal<boolean>(false);
  public showMetaHub = signal<boolean>(false);

  public shopUpgradeLetters = ['A', 'E', 'I', 'O', 'S', 'T'];

  public legendaryRewards = ARTIFACT_REGISTRY.filter(a => a.rarity === 'LEGENDARY');

  public nodes: MapNode[] = [
    {
      index: 0,
      type: 'NORMAL_COMBAT',
      title: 'Perimeter Probe',
      description: '100 HP Enemy. Spawn Rate: 1 Projectile / 3 sec. Velocity: 40px/s.',
      enemyHp: 100,
      enemyName: 'PROBE-ALPHA',
      modifiers: [],
      completed: false,
      active: true,
    },
    {
      index: 1,
      type: 'NORMAL_COMBAT',
      title: 'Malicious Subroutine',
      description: '150 HP Enemy. Introduces Evil modifier (Projectiles deal direct damage on mistype).',
      enemyHp: 150,
      enemyName: 'CORRUPTOR-V2',
      modifiers: ['EVIL'],
      completed: false,
      active: false,
    },
    {
      index: 2,
      type: 'NORMAL_COMBAT',
      title: 'Packet Inundation',
      description: '200 HP Enemy. Spawn Rate increases: 2 Projectiles / 3 sec.',
      enemyHp: 200,
      enemyName: 'SWARM-DAEMON',
      modifiers: [],
      completed: false,
      active: false,
    },
    {
      index: 3,
      type: 'EVENT_SHOP',
      title: 'Darkweb Gateway',
      description: 'Requisition powerful Synergistic Artifacts or upgrade Scrabble letter values.',
      enemyHp: 0,
      enemyName: '',
      modifiers: [],
      completed: false,
      active: false,
    },
    {
      index: 4,
      type: 'ELITE',
      title: 'Elite Guardian: Centurion',
      description: '500 HP Enemy. Ominous modifier: Velocity scales exponentially as projectiles approach anchor.',
      enemyHp: 500,
      enemyName: 'OMINOUS CENTURION',
      modifiers: ['OMINOUS'],
      completed: false,
      active: false,
    },
    {
      index: 5,
      type: 'NORMAL_COMBAT',
      title: 'Rapid-Fire Core',
      description: '300 HP Enemy. High density of short, 3-letter rapid keystroke vectors.',
      enemyHp: 300,
      enemyName: 'MICRO-KERNEL',
      modifiers: [],
      completed: false,
      active: false,
    },
    {
      index: 6,
      type: 'NORMAL_COMBAT',
      title: 'Hydra Swarm',
      description: '400 HP Enemy. Introduces Hydra modifier: Projectiles split into two children on mistype.',
      enemyHp: 400,
      enemyName: 'HYDRA VECTOR',
      modifiers: ['HYDRA'],
      completed: false,
      active: false,
    },
    {
      index: 7,
      type: 'EVENT_LORE',
      title: 'Cryptomancer Archive',
      description: 'Decryption simulation unlocks a free Legendary Synergistic Artifact.',
      enemyHp: 0,
      enemyName: '',
      modifiers: [],
      completed: false,
      active: false,
    },
    {
      index: 8,
      type: 'ELITE',
      title: 'Elite Carrier: Mothership',
      description: '1000 HP Enemy. Spawns Mothership words periodically ejecting child projectiles.',
      enemyHp: 1000,
      enemyName: 'CARRIER MOTHERSHIP',
      modifiers: ['MOTHERSHIP'],
      completed: false,
      active: false,
    },
    {
      index: 9,
      type: 'HARD_COMBAT',
      title: 'Firewall Bastion I',
      description: '1200 HP Enemy. Procedurally mixed projectile modifiers.',
      enemyHp: 1200,
      enemyName: 'FIREWALL BASTION',
      modifiers: ['EVIL', 'OMINOUS'],
      completed: false,
      active: false,
    },
    {
      index: 10,
      type: 'HARD_COMBAT',
      title: 'Firewall Bastion II',
      description: '1500 HP Enemy. High velocity and aggressive modifier combinations.',
      enemyHp: 1500,
      enemyName: 'ANOMALOUS SENTINEL',
      modifiers: ['HYDRA', 'EVIL'],
      completed: false,
      active: false,
    },
    {
      index: 11,
      type: 'HARD_COMBAT',
      title: 'Deep Memory Trench',
      description: '1800 HP Enemy. Maximum threat density prior to the Architect nexus.',
      enemyHp: 1800,
      enemyName: 'DREADNOUGHT DAEMON',
      modifiers: ['OMINOUS', 'HYDRA'],
      completed: false,
      active: false,
    },
    {
      index: 12,
      type: 'FINAL_SHOP',
      title: 'Final Requisition Depot',
      description: 'Mandatory liquidation of all remaining Gold credits before the final confrontation.',
      enemyHp: 0,
      enemyName: '',
      modifiers: [],
      completed: false,
      active: false,
    },
    {
      index: 13,
      type: 'REST',
      title: 'Neural Sanctuary',
      description: 'Binary Choice: Fully restore HP to 100% OR gain +1 maximum Kinetic Plating charge.',
      enemyHp: 0,
      enemyName: '',
      modifiers: [],
      completed: false,
      active: false,
    },
    {
      index: 14,
      type: 'FINAL_BOSS',
      title: 'The Architect',
      description: '2500 HP Final Boss. Three rigid phases: Initialization, Aegis Protocol, and Core Meltdown.',
      enemyHp: 2500,
      enemyName: 'THE ARCHITECT',
      modifiers: ['OMINOUS'],
      completed: false,
      active: false,
    },
  ];

  public currentNode(): MapNode | undefined {
    return this.nodes[this.state.currentNodeIndex()];
  }

  public availableShopArtifacts(): CatalogArtifact[] {
    return ARTIFACT_REGISTRY as CatalogArtifact[];
  }

  public hasArtifact(id: string): boolean {
    return this.state.artifacts().some(a => a.id === id);
  }

  public buyArtifact(art: CatalogArtifact): void {
    if (this.state.player().gold >= art.cost && !this.hasArtifact(art.id)) {
      this.state.updatePlayer(p => ({ ...p, gold: p.gold - art.cost }));
      this.state.addArtifact(art);
      this.audio.playFileSound('kaching');
    }
  }

  public upgradeLetter(char: string): void {
    if (this.state.player().gold >= 25) {
      this.state.updatePlayer(p => ({ ...p, gold: p.gold - 25 }));
      const current = this.state.letterOverrides()[char] ?? SCRABBLE_LETTER_VALUES[char] ?? 1;
      this.state.letterOverrides.update(map => ({ ...map, [char]: current + 2 }));
      this.audio.playFileSound('kaching');
    }
  }

  public restOptionHeal(): void {
    this.state.updatePlayer(p => ({ ...p, currentHp: p.maxHp }));
    this.audio.playFileSound('success');
    this.showRestModal.set(false);
    this.advanceNode();
  }

  public restOptionPlating(): void {
    this.state.kineticPlatingMax.update(m => m + 1);
    this.state.updatePlayer(p => ({
      ...p,
      kineticPlatingCharges: p.kineticPlatingCharges + 1,
    }));
    this.audio.playFileSound('success');
    this.showRestModal.set(false);
    this.advanceNode();
  }

  public claimLegendaryReward(art: CatalogArtifact): void {
    if (!this.hasArtifact(art.id)) {
      this.state.addArtifact(art);
      this.audio.playFileSound('success');
      this.showLoreEvent.set(false);
      this.advanceNode();
    }
  }

  public upgradeKineticPlating(): void {
    if (this.state.scrabbleXp() >= 100 && this.state.kineticPlatingMax() < 3) {
      this.state.scrabbleXp.update(xp => xp - 100);
      this.state.kineticPlatingMax.update(m => m + 1);
      this.state.updatePlayer(p => ({
        ...p,
        kineticPlatingCharges: p.kineticPlatingCharges + 1,
      }));
      this.audio.playFileSound('kaching');
    }
  }

  public commenceCombat(node: MapNode): void {
    this.startCombat.emit(node);
  }

  public advanceNode(): void {
    const nextIdx = this.state.currentNodeIndex() + 1;
    if (nextIdx < this.nodes.length) {
      this.state.currentNodeIndex.set(nextIdx);
    }
  }
}

