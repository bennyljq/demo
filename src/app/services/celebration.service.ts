import { Injectable, signal } from '@angular/core';

export type CelebrationTier = 'great' | 'almost' | 'perfect' | 'standard';

@Injectable({ providedIn: 'root' })
export class CelebrationService {
  // Public Signals the UI will bind to
  isActive = signal(false);
  particles = signal<any[]>([]);
  text = signal<string>('');
  tier = signal<CelebrationTier | null>(null);

  private celebrationTimer: any = null;
  private streamInterval: any = null;

  private readonly TIER_DELAYS = { perfect: 5000, almost: 2500, great: 1500, standard: 1500 };
  
  private readonly TIER_CONFIGS = {
    standard: { text: 'try harder', particleCount: 15, spreadMultiplier: 0.6, duration: 1.5, colors: [], emoji: '🤡' },
    great: { text: 'not bad 🥱', particleCount: 50, spreadMultiplier: 0.7, duration: 1.5, colors: ['#22d3ee', '#a855f7', '#d8b4fe', '#ffffff'], emoji: null },
    almost: { text: 'ALMOST PERFECT 👍', particleCount: 250, spreadMultiplier: 0.9, duration: 1.5, colors: ['#22d3ee', '#a855f7', '#d8b4fe', '#ffffff', '#ec4899', '#f472b6'], emoji: null },
    perfect: { text: 'PERFECT POTONG!', particleCount: 500, spreadMultiplier: 1.2, duration: 1.2, colors: ['#22d3ee', '#a855f7', '#d8b4fe', '#ffffff', '#fbbf24', '#f59e0b', '#fb923c'], emoji: null }
  };

  trigger(tier: CelebrationTier) {
    this.clear(); 
    
    this.tier.set(tier);
    const config = this.TIER_CONFIGS[tier];
    this.text.set(config.text);
    
    const timeoutMs = this.TIER_DELAYS[tier]; 
    const maxDelay = Math.max(0, (timeoutMs / 1000) - config.duration);
    
    const initialBlast = this.createParticles(config.particleCount, config, maxDelay);
    this.particles.set(initialBlast);
    this.isActive.set(true);
    
    if (tier === 'perfect') {
      this.streamInterval = setInterval(() => {
        const streamBlast = this.createParticles(25, config, 0.3, true);
        this.particles.update(p => [...p, ...streamBlast]);
        setTimeout(() => {
          this.particles.update(p => p.filter(x => !streamBlast.includes(x)));
        }, 2000);
      }, 300);
    } else {
      this.celebrationTimer = setTimeout(() => {
        this.isActive.set(false);
      }, timeoutMs);
    }
  }

  clear() {
    if (this.celebrationTimer) clearTimeout(this.celebrationTimer);
    if (this.streamInterval) clearInterval(this.streamInterval);
    this.isActive.set(false);
    this.particles.set([]);
  }

  getDelay(tier: CelebrationTier): number {
    return this.TIER_DELAYS[tier];
  }

  private createParticles(count: number, config: any, maxDelay: number, isStream = false) {
    const spread = Math.max(window.innerWidth, window.innerHeight) * config.spreadMultiplier * (isStream ? 0.8 : 1); 
    
    return Array.from({ length: count }).map(() => ({ 
      id: Math.random().toString(36).substring(2, 11), 
      tx: (Math.random() - 0.5) * spread, 
      ty: (Math.random() - 0.5) * spread, 
      rot: Math.random() * 1080, 
      scale: Math.random() * 0.8 + 0.4, 
      color: config.colors?.length ? config.colors[Math.floor(Math.random() * config.colors.length)] : '', 
      delay: isStream ? Math.random() * maxDelay : Math.pow(Math.random(), 2) * maxDelay, 
      duration: config.duration, 
      emoji: config.emoji 
    }));
  }
}