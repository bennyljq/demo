import { Component, ChangeDetectionStrategy, inject, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateManager, Projectile } from '../../core/state/game.state';

@Component({
  selector: 'kw-viewport',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="viewport-wrapper" [class.screen-shake]="state.screenShake()">
      <svg
        class="game-svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Merlin Protocol Cyber-Tactical Viewport"
      >
        <defs>
          <!-- Neon Glow Filter for Player (FeGaussianBlur + FeMerge) -->
          <filter id="kw-player-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- Aggressive Neon Glow Filter for Enemy -->
          <filter id="kw-enemy-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="24" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- Projectile Gold Neon Filter -->
          <filter id="kw-projectile-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- Spell Purple Neon Filter -->
          <filter id="kw-spell-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- Background Spatial Grid Pattern -->
          <pattern id="kw-grid-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="80" y2="0" stroke="var(--kw-grid-line, rgba(0, 255, 204, 0.05))" stroke-width="1" />
            <line x1="0" y1="0" x2="0" y2="80" stroke="var(--kw-grid-line, rgba(0, 255, 204, 0.05))" stroke-width="1" />
            <!-- Micro crosshair tick at grid intersections -->
            <line x1="38" y1="40" x2="42" y2="40" stroke="rgba(0, 255, 204, 0.12)" stroke-width="1" />
            <line x1="40" y1="38" x2="40" y2="42" stroke="rgba(0, 255, 204, 0.12)" stroke-width="1" />
          </pattern>
        </defs>

        <!-- Viewport Dark Void Background -->
        <rect width="1920" height="1080" fill="var(--kw-bg-void, #0A0A10)" />

        <!-- Spatial Grid Lines -->
        <rect width="1920" height="1080" fill="url(#kw-grid-pattern)" />

        <!-- Tactical Threshold Guidelines -->
        <!-- Lethal Danger Zone: Astral Multiplier Radius at X = 392 -->
        <line x1="392" y1="0" x2="392" y2="1080" stroke="rgba(176, 38, 255, 0.12)" stroke-dasharray="6,6" stroke-width="1" />
        <text x="398" y="40" fill="rgba(176, 38, 255, 0.4)" font-family="var(--kw-font-mono)" font-size="10" letter-spacing="1">
          ASTRAL BOUNDARY [X:392]
        </text>

        <!-- Void Visor Lethal Threshold at X = 600 -->
        <line x1="600" y1="0" x2="600" y2="1080" stroke="rgba(255, 215, 0, 0.12)" stroke-dasharray="4,8" stroke-width="1" />
        <text x="606" y="40" fill="rgba(255, 215, 0, 0.4)" font-family="var(--kw-font-mono)" font-size="10" letter-spacing="1">
          REVEAL HORIZON [X:600]
        </text>

        <!-- Spawner Boundary at X = 1440 -->
        <line x1="1440" y1="0" x2="1440" y2="1080" stroke="rgba(255, 0, 85, 0.15)" stroke-dasharray="8,8" stroke-width="1" />
        <text x="1446" y="40" fill="rgba(255, 0, 85, 0.4)" font-family="var(--kw-font-mono)" font-size="10" letter-spacing="1">
          THREAT VECTOR INGESTION [X:1440]
        </text>

        <!-- Player Anchor Radar Rings -->
        <circle cx="192" cy="540" r="80" stroke="rgba(0, 255, 204, 0.12)" stroke-width="1" fill="none" />
        <circle cx="192" cy="540" r="140" stroke="rgba(0, 255, 204, 0.06)" stroke-width="1" stroke-dasharray="4,6" fill="none" />

        <!-- ========================================== -->
        <!-- 1. THE PLAYER: "THE CRYPTOMANCER" (192, 540) -->
        <!-- SVG Icosahedron Wireframe Rotating 10s Loop -->
        <!-- ========================================== -->
        <g class="player-entity" transform="translate(192, 540)" filter="url(#kw-player-glow)">
          <!-- Core Emissive Halo -->
          <circle cx="0" cy="0" r="12" fill="var(--kw-player-core, #FFFFFF)" />
          <circle cx="0" cy="0" r="28" fill="none" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="1.5" opacity="0.6" />

          <!-- Rotating Wireframe Icosahedron Projection -->
          <g class="icosahedron-rotator">
            <!-- 2D Stereographic projection of an Icosahedron (12 vertices, 30 edges) -->
            <!-- Outer Ring Hexagon -->
            <polygon
              points="0,-48 41.5,-24 41.5,24 0,48 -41.5,24 -41.5,-24"
              fill="none"
              stroke="var(--kw-player-neon, #00FFCC)"
              stroke-width="1.8"
            />
            <!-- Inner Golden Star Ribs -->
            <polygon
              points="0,-26 24,-13 24,13 0,26 -24,13 -24,-13"
              fill="none"
              stroke="var(--kw-player-neon, #00FFCC)"
              stroke-width="1.2"
              opacity="0.8"
            />
            <!-- Cross Connecting Struts -->
            <line x1="0" y1="-48" x2="0" y2="-26" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="1" />
            <line x1="41.5" y1="-24" x2="24" y2="-13" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="1" />
            <line x1="41.5" y1="24" x2="24" y2="13" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="1" />
            <line x1="0" y1="48" x2="0" y2="26" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="1" />
            <line x1="-41.5" y1="24" x2="-24" y2="13" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="1" />
            <line x1="-41.5" y1="-24" x2="-24" y2="-13" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="1" />

            <!-- Triangulation Diagonals -->
            <line x1="0" y1="-48" x2="24" y2="-13" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="0.8" opacity="0.6" />
            <line x1="41.5" y1="-24" x2="24" y2="13" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="0.8" opacity="0.6" />
            <line x1="41.5" y1="24" x2="0" y2="26" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="0.8" opacity="0.6" />
            <line x1="0" y1="48" x2="-24" y2="13" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="0.8" opacity="0.6" />
            <line x1="-41.5" y1="24" x2="-24" y2="-13" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="0.8" opacity="0.6" />
            <line x1="-41.5" y1="-24" x2="0" y2="-26" stroke="var(--kw-player-neon, #00FFCC)" stroke-width="0.8" opacity="0.6" />
          </g>

          <text x="0" y="68" fill="var(--kw-player-neon, #00FFCC)" text-anchor="middle" font-family="var(--kw-font-mono)" font-size="9" letter-spacing="1">
            CRYPTOMANCER
          </text>
        </g>

        <!-- ================================================== -->
        <!-- 2. THE ENEMY: "INTRUSION COUNTERMEASURE" (1632, 540) -->
        <!-- SVG Dodecahedron Wireframe Pulsing Scale 1.0-1.1   -->
        <!-- ================================================== -->
        @if (!state.isBossEncounter() || state.bossInitiationIndex() >= state.bossInitiationWords().length) {
          <g class="enemy-entity" transform="translate(1632, 540)" filter="url(#kw-enemy-glow)">
            <!-- Aggressive Respiration Pulsing Group -->
            <g class="dodecahedron-pulsar" [class.invulnerable-mesh]="state.enemy().isInvulnerable">
              <!-- Dodecahedron Projection (20 vertices, 30 edges forming interlocking pentagons) -->
              <!-- Outer Decagram/Decagon -->
              <polygon
                points="0,-65 38,-53 62,-20 62,20 38,53 0,65 -38,53 -62,20 -62,-20 -38,-53"
                fill="none"
                stroke="var(--kw-enemy-neon, #FF0055)"
                stroke-width="2"
              />
              <!-- Mid Pentagonal Node -->
              <polygon
                points="0,-36 34,-11 21,30 -21,30 -34,-11"
                fill="none"
                stroke="var(--kw-enemy-neon, #FF0055)"
                stroke-width="1.5"
                opacity="0.8"
              />
              <!-- Inner Core Pentagram -->
              <polygon
                points="0,-18 17,-5 11,15 -11,15 -17,-5"
                fill="var(--kw-enemy-core, #FFB3C6)"
                stroke="var(--kw-enemy-neon, #FF0055)"
                stroke-width="1"
              />
              <!-- Geometric Ribs Connecting Nodes -->
              <line x1="0" y1="-65" x2="0" y2="-36" stroke="var(--kw-enemy-neon, #FF0055)" stroke-width="1.2" />
              <line x1="38" y1="-53" x2="34" y2="-11" stroke="var(--kw-enemy-neon, #FF0055)" stroke-width="1.2" />
              <line x1="62" y1="20" x2="21" y2="30" stroke="var(--kw-enemy-neon, #FF0055)" stroke-width="1.2" />
              <line x1="-62" y1="20" x2="-21" y2="30" stroke="var(--kw-enemy-neon, #FF0055)" stroke-width="1.2" />
              <line x1="-38" y1="-53" x2="-34" y2="-11" stroke="var(--kw-enemy-neon, #FF0055)" stroke-width="1.2" />
            </g>

            <!-- Target Reticle Overlay -->
            <circle cx="0" cy="0" r="85" fill="none" stroke="rgba(255, 0, 85, 0.3)" stroke-dasharray="6,10" stroke-width="1" />
            <text x="0" y="90" fill="var(--kw-enemy-core, #FFB3C6)" text-anchor="middle" font-family="var(--kw-font-mono)" font-size="10" letter-spacing="1">
              {{ state.enemy().name }}
            </text>
          </g>
        }

        <!-- ============================================== -->
        <!-- 3. BOSS SPECIAL ENTITIES                       -->
        <!-- A. Initiation 3-Word Typing Sequence (Center)  -->
        <!-- B. Aegis Shield Generators (Phase 2)           -->
        <!-- C. Core Meltdown Wall (Phase 3)                -->
        <!-- ============================================== -->

        <!-- A. Diegetic Boss Initiation Sequence (Centered at 960, 540) -->
        @if (state.isBossEncounter() && state.bossInitiationIndex() < state.bossInitiationWords().length) {
          <g class="boss-initiation-cluster" transform="translate(960, 540)">
            <rect x="-240" y="-80" width="480" height="160" rx="8" fill="rgba(10, 10, 16, 0.95)" stroke="#FF0055" stroke-width="2" filter="url(#kw-enemy-glow)" />
            <text x="0" y="-40" text-anchor="middle" fill="#FFB3C6" font-family="var(--kw-font-mono)" font-size="12" letter-spacing="2">
              DECRYPT FIREWALL MATRIX [STAGE {{ state.bossInitiationIndex() + 1 }} / {{ state.bossInitiationWords().length }}]
            </text>

            <!-- The active boss initiation word -->
            @let initWord = state.bossInitiationWords()[state.bossInitiationIndex()];
            <g transform="translate(0, 15)">
              <rect x="-180" y="-30" width="360" height="60" rx="15" fill="rgba(255, 215, 0, 0.15)" stroke="#FFD700" stroke-width="2" />
              <text text-anchor="middle" dominant-baseline="central" font-family="var(--kw-font-mono)" font-size="28" font-weight="800" letter-spacing="3">
                <tspan fill="var(--kw-alert-success, #00FFCC)">{{ getInitCompleted(initWord) }}</tspan>
                <tspan fill="var(--kw-ui-text, #E0E0FF)">{{ getInitRemaining(initWord) }}</tspan>
              </text>
            </g>
          </g>
        }

        <!-- B. Aegis Protocol Shield Arcs (Boss Phase 2) -->
        @if (state.enemy().isInvulnerable) {
          <!-- Forcefield lines radiating from Shield Generators to Boss -->
          <g class="aegis-shield-arcs" opacity="0.6">
            <line x1="1400" y1="300" x2="1632" y2="540" stroke="#B026FF" stroke-width="2" stroke-dasharray="8,4" />
            <line x1="1400" y1="540" x2="1632" y2="540" stroke="#B026FF" stroke-width="2" stroke-dasharray="8,4" />
            <line x1="1400" y1="780" x2="1632" y2="540" stroke="#B026FF" stroke-width="2" stroke-dasharray="8,4" />
          </g>
        }

        <!-- C. Boss Phase 3 Core Meltdown Wall -->
        @if (state.bossMeltdownWall(); as wall) {
          <g class="meltdown-wall" [attr.transform]="'translate(' + wall.x + ', 0)'">
            <!-- Semi-transparent lethal wall spanning the entire Y-axis -->
            <rect
              x="-40"
              y="0"
              width="80"
              height="1080"
              fill="rgba(255, 0, 85, 0.3)"
              stroke="var(--kw-enemy-neon, #FF0055)"
              stroke-width="3"
              filter="url(#kw-enemy-glow)"
            />

            <!-- Warning stripes inside wall -->
            <line x1="-30" y1="0" x2="-30" y2="1080" stroke="rgba(255, 255, 255, 0.3)" stroke-dasharray="12,12" stroke-width="2" />
            <line x1="30" y1="0" x2="30" y2="1080" stroke="rgba(255, 255, 255, 0.3)" stroke-dasharray="12,12" stroke-width="2" />

            <!-- Vertical Decryption Sequence Pill centered on the wall -->
            <g transform="translate(0, 540)">
              <rect x="-220" y="-45" width="440" height="90" rx="15" fill="rgba(10, 10, 16, 0.95)" stroke="#FF0055" stroke-width="2" />
              <text x="0" y="-20" text-anchor="middle" fill="#FF3333" font-family="var(--kw-font-mono)" font-size="11" letter-spacing="1">
                CORE MELTDOWN BREACH // DECRYPT CONTIGUOUS SEQUENCE
              </text>
              <text y="15" text-anchor="middle" dominant-baseline="central" font-family="var(--kw-font-mono)" font-size="28" font-weight="800" letter-spacing="4">
                <tspan fill="var(--kw-alert-success, #00FFCC)">{{ getWallCompleted(wall) }}</tspan>
                <tspan fill="var(--kw-ui-text, #E0E0FF)">{{ getWallRemaining(wall) }}</tspan>
              </text>
            </g>
          </g>
        }

        <!-- ============================================== -->
        <!-- 4. PROJECTILES: "MALWARE PACKETS"              -->
        <!-- Sleek pill-shaped rect rx=15 ry=15, centered text -->
        <!-- ============================================== -->
        @for (proj of state.activeProjectiles(); track proj.id) {
          <g
            class="projectile-packet"
            [attr.transform]="'translate(' + proj.x + ',' + proj.y + ')'"
            filter="url(#kw-projectile-glow)"
          >
            <!-- Pill Housing -->
            @let pillW = getPillWidth(proj.word);
            @let isLocked = isTargetLocked(proj.id);
            <rect
              [attr.x]="-pillW / 2"
              [attr.y]="-20"
              [attr.width]="pillW"
              [attr.height]="40"
              rx="15"
              ry="15"
              [attr.fill]="proj.isShieldGenerator ? 'rgba(176, 38, 255, 0.25)' : 'var(--kw-projectile-shell, rgba(255, 215, 0, 0.2))'"
              [attr.stroke]="proj.isShieldGenerator ? '#B026FF' : (isLocked ? 'var(--kw-alert-success, #00FFCC)' : 'var(--kw-projectile-neon, #FFD700)')"
              [attr.stroke-width]="isLocked ? 2.5 : 1.5"
            />

            <!-- Shield generator badge icon -->
            @if (proj.isShieldGenerator) {
              <circle [attr.cx]="-pillW / 2 + 16" cy="0" r="6" fill="#B026FF" />
            }

            <!-- Centered Text sliced into Completed Substring and Remaining Substring -->
            <text
              x="0"
              y="0"
              text-anchor="middle"
              dominant-baseline="central"
              font-family="var(--kw-font-mono)"
              font-size="16"
              font-weight="700"
              letter-spacing="2"
            >
              @if (shouldMaskWithVoidVisor(proj.x)) {
                <tspan fill="var(--kw-ui-dim, #666688)">???</tspan>
              } @else if (isLocked) {
                <tspan fill="var(--kw-alert-success, #00FFCC)">{{ getCompletedSubstring(proj) }}</tspan>
                <tspan fill="var(--kw-ui-text, #E0E0FF)">{{ getRemainingSubstring(proj) }}</tspan>
              } @else {
                <tspan fill="var(--kw-projectile-neon, #FFD700)">{{ proj.word[0] }}</tspan>
                <tspan fill="var(--kw-ui-text, #E0E0FF)">{{ proj.word.slice(1) }}</tspan>
              }
            </text>

            <!-- Projectile Modifiers Tag -->
            @if (proj.modifiers.length > 0) {
              <text
                x="0"
                y="-26"
                text-anchor="middle"
                fill="#FF0055"
                font-family="var(--kw-font-mono)"
                font-size="9"
                letter-spacing="1"
              >
                [{{ proj.modifiers.join(',') }}]
              </text>
            }
          </g>
        }

        <!-- ============================================== -->
        <!-- 5. KINETIC LASERS                              -->
        <!-- Dynamic SVG <line> fading opacity over 150ms  -->
        <!-- ============================================== -->
        @for (laser of state.lasers(); track laser.id) {
          <line
            [attr.x1]="laser.startX"
            [attr.y1]="laser.startY"
            [attr.x2]="laser.endX"
            [attr.y2]="laser.endY"
            stroke="var(--kw-alert-success, #00FFCC)"
            stroke-width="2.5"
            [attr.opacity]="laser.opacity"
            stroke-linecap="round"
          />
        }

        <!-- ============================================== -->
        <!-- 6. PARTICLE EXPLOSIONS                         -->
        <!-- Procedural vector particles                    -->
        <!-- ============================================== -->
        @for (pt of state.particles(); track pt.id) {
          <circle
            [attr.cx]="pt.x"
            [attr.cy]="pt.y"
            [attr.r]="pt.radius"
            [attr.fill]="pt.color"
            [attr.opacity]="pt.opacity"
          />
        }

        <!-- ============================================== -->
        <!-- 7. NARRATIVE DECRYPTION LOG (2% X, 80% Y)      -->
        <!-- Coordinates (38.4, 864)                        -->
        <!-- Encrypted glyphs resolving character-by-char   -->
        <!-- ============================================== -->
        <g class="lore-terminal-block" transform="translate(38.4, 864)">
          <rect x="-10" y="-20" width="620" height="90" rx="4" fill="rgba(10, 10, 16, 0.85)" stroke="rgba(51, 51, 68, 0.6)" stroke-width="1" />
          <text x="0" y="-6" fill="var(--kw-player-neon, #00FFCC)" font-family="var(--kw-font-mono)" font-size="9" letter-spacing="1">
            ENVIRONMENTAL LORE INTERCEPT // APM DECRYPTION LOG
          </text>
          <text x="0" y="16" font-family="var(--kw-font-mono)" font-size="11" letter-spacing="1">
            @for (item of state.loreLog().slice(0, 52); track $index) {
              <tspan [attr.fill]="item.decrypted ? 'var(--kw-ui-text, #E0E0FF)' : 'var(--kw-ui-dim, #444466)'">
                {{ item.char }}
              </tspan>
            }
          </text>
          <text x="0" y="34" font-family="var(--kw-font-mono)" font-size="11" letter-spacing="1">
            @for (item of state.loreLog().slice(52, 104); track $index) {
              <tspan [attr.fill]="item.decrypted ? 'var(--kw-ui-text, #E0E0FF)' : 'var(--kw-ui-dim, #444466)'">
                {{ item.char }}
              </tspan>
            }
          </text>
          <text x="0" y="52" font-family="var(--kw-font-mono)" font-size="11" letter-spacing="1">
            @for (item of state.loreLog().slice(104, 156); track $index) {
              <tspan [attr.fill]="item.decrypted ? 'var(--kw-ui-text, #E0E0FF)' : 'var(--kw-ui-dim, #444466)'">
                {{ item.char }}
              </tspan>
            }
          </text>
        </g>
      </svg>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: var(--kw-bg-void, #0A0A10);
    }

    .viewport-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .game-svg {
      width: 100%;
      height: 100%;
      max-width: 100vw;
      max-height: 100vh;
      aspect-ratio: 16 / 9;
      user-select: none;
    }

    /* Continuous 10-second linear rotation keyframe for Player Icosahedron */
    .icosahedron-rotator {
      transform-origin: 0 0;
      animation: rotate-icosahedron 10s linear infinite;
    }

    @keyframes rotate-icosahedron {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Respiration pulsing animation for Enemy Dodecahedron (1.0 to 1.1 every 2s ease-in-out) */
    .dodecahedron-pulsar {
      transform-origin: 0 0;
      animation: pulse-dodecahedron 2s ease-in-out infinite;
    }

    @keyframes pulse-dodecahedron {
      0% { transform: scale(1.0); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1.0); }
    }

    .invulnerable-mesh polygon, .invulnerable-mesh line {
      stroke: #B026FF !important;
    }

    /* Screen shake CSS class on root viewport element */
    .screen-shake {
      animation: viewport-violent-shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }

    @keyframes viewport-violent-shake {
      10%, 90% { transform: translate3d(-3px, 0, 0); }
      20%, 80% { transform: translate3d(5px, -2px, 0); }
      30%, 50%, 70% { transform: translate3d(-6px, 4px, 0); }
      40%, 60% { transform: translate3d(6px, -4px, 0); }
    }
  `]
})
export class ViewportComponent {
  public state = inject(GameStateManager);

  public getPillWidth(word: string): number {
    return Math.max(100, word.length * 16 + 32);
  }

  public isTargetLocked(projId: string): boolean {
    const target = this.state.lockedTarget();
    return target !== null && target.id === projId;
  }

  public shouldMaskWithVoidVisor(projX: number): boolean {
    const hasVoidVisor = this.state.artifacts().some(a => a.id === 'void-visor');
    return hasVoidVisor && projX >= 600;
  }

  public getCompletedSubstring(proj: Projectile): string {
    const target = this.state.lockedTarget();
    if (!target || target.id !== proj.id) return '';
    return proj.word.slice(0, target.typedIndex);
  }

  public getRemainingSubstring(proj: Projectile): string {
    const target = this.state.lockedTarget();
    if (!target || target.id !== proj.id) return proj.word;
    return proj.word.slice(target.typedIndex);
  }

  public getInitCompleted(word: string): string {
    const target = this.state.lockedTarget();
    if (!target || !target.id.startsWith('boss-initiation-')) return '';
    return word.slice(0, target.typedIndex);
  }

  public getInitRemaining(word: string): string {
    const target = this.state.lockedTarget();
    if (!target || !target.id.startsWith('boss-initiation-')) return word;
    return word.slice(target.typedIndex);
  }

  public getWallCompleted(wall: { fullWord: string }): string {
    const target = this.state.lockedTarget();
    if (!target || target.id !== 'meltdown-wall') return '';
    return wall.fullWord.slice(0, target.typedIndex);
  }

  public getWallRemaining(wall: { fullWord: string }): string {
    const target = this.state.lockedTarget();
    if (!target || target.id !== 'meltdown-wall') return wall.fullWord;
    return wall.fullWord.slice(target.typedIndex);
  }
}

