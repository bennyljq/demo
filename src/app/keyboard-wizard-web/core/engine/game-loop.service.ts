import { Injectable, NgZone } from '@angular/core';
import { GameStateManager, Projectile, Particle, ProjectileModifier } from '../state/game.state';
import { SpawnerService } from './spawner.service';
import { AudioService } from '../audio/audio.service';

@Injectable({
  providedIn: 'root',
})
export class GameLoopService {
  private isRunning = false;
  private animationFrameId: number | null = null;
  private lastTimestamp = 0;

  // Node pacing config defaults
  public currentSpawnInterval = 3.0;
  public currentBaseSpeed = 40;

  constructor(
    private state: GameStateManager,
    private spawner: SpawnerService,
    private audio: AudioService
  ) {}

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.loop(this.lastTimestamp);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (timestamp: number): void => {
    if (!this.isRunning) return;

    const deltaMs = Math.min(100, timestamp - this.lastTimestamp);
    const deltaSec = deltaMs / 1000;
    this.lastTimestamp = timestamp;

    this.tick(deltaSec);

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private tick(deltaSec: number): void {
    // 1. Spawner tick
    const nodeIdx = this.state.currentNodeIndex();
    const allowedModifiers = this.getModifiersForNode(nodeIdx);
    this.spawner.update(deltaSec, this.currentSpawnInterval, this.currentBaseSpeed, allowedModifiers);

    // 2. Physics & Projectile Translation toward Player Anchor (192, 540)
    const projectiles = this.state.activeProjectiles();
    const updatedProjectiles: Projectile[] = [];
    const speedFactor = this.state.globalModifiers().projectileSpeedFactor;

    for (const p of projectiles) {
      // Shield generators are static
      if (p.isShieldGenerator) {
        updatedProjectiles.push(p);
        continue;
      }

      const dx = SpawnerService.PLAYER_ANCHOR_X - p.x;
      const dy = SpawnerService.PLAYER_ANCHOR_Y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Collision check with player anchor
      if (dist <= 35 || p.x <= SpawnerService.PLAYER_ANCHOR_X) {
        // Projectile reached the Cryptomancer!
        this.onProjectileHitPlayer(p);
        continue;
      }

      // Modifier speed scaling
      let effectiveSpeed = p.speed * speedFactor;
      if (p.modifiers.includes('OMINOUS')) {
        // Velocity scales exponentially as X approaches 192
        const closeness = Math.max(0, (1440 - p.x) / 1248);
        effectiveSpeed *= 1 + closeness * closeness * 2.5;
      }

      const velX = (dx / dist) * effectiveSpeed;
      const velY = (dy / dist) * effectiveSpeed;

      const newX = p.x + velX * deltaSec;
      const newY = p.y + velY * deltaSec;

      updatedProjectiles.push({
        ...p,
        x: newX,
        y: newY,
      });
    }

    this.state.setProjectiles(updatedProjectiles);

    // 3. Final Boss Phase 3 Meltdown Wall
    const wall = this.state.bossMeltdownWall();
    if (wall) {
      const newX = wall.x - wall.speed * deltaSec;
      if (newX <= 200) {
        // Lethal breach! 9,999 unmitigable damage
        this.state.bossMeltdownWall.set({ ...wall, x: newX });
        this.state.damagePlayer(9999);
      } else {
        this.state.bossMeltdownWall.set({ ...wall, x: newX });
      }
    }

    // 4. Update Laser Beams (fade over 150ms)
    const now = Date.now();
    const activeLasers = this.state.lasers();
    if (activeLasers.length > 0) {
      const remainingLasers = activeLasers
        .map(l => {
          const age = now - l.createdAt;
          const opacity = Math.max(0, 1 - age / 150);
          return { ...l, opacity };
        })
        .filter(l => l.opacity > 0);
      this.state.lasers.set(remainingLasers);
    }

    // 5. Update Particles
    const activeParticles = this.state.particles();
    if (activeParticles.length > 0) {
      const updatedParticles: Particle[] = [];
      for (const pt of activeParticles) {
        const nextOpacity = pt.opacity - deltaSec * 2.2;
        if (nextOpacity > 0) {
          updatedParticles.push({
            ...pt,
            x: pt.x + pt.vx * deltaSec,
            y: pt.y + pt.vy * deltaSec,
            opacity: nextOpacity,
            radius: Math.max(0.5, pt.radius - deltaSec * 2),
          });
        }
      }
      this.state.particles.set(updatedParticles);
    }
  }

  private onProjectileHitPlayer(p: Projectile): void {
    // Check if player has locked onto this projectile
    const target = this.state.lockedTarget();
    if (target && target.id === p.id) {
      this.state.setLockedTarget(null);
    }

    this.audio.playFileSound('fail');
    this.state.damagePlayer(12);
  }

  private getModifiersForNode(nodeIdx: number): readonly ProjectileModifier[] {
    switch (nodeIdx) {
      case 1: // Node 2: Evil modifier
        return ['EVIL'];
      case 4: // Node 5: Ominous modifier
        return ['OMINOUS'];
      case 6: // Node 7: Hydra modifier
        return ['HYDRA'];
      case 8: // Node 9: Mothership modifier
        return ['MOTHERSHIP'];
      case 9:
      case 10:
      case 11:
        return ['EVIL', 'OMINOUS', 'HYDRA'];
      default:
        return [];
    }
  }
}

