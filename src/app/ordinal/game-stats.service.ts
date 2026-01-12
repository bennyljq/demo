import { Injectable, signal } from '@angular/core';
import { GameStats } from './ordinal.types';

@Injectable({
  providedIn: 'root'
})
export class GameStatsService {
  private readonly STORAGE_KEY = 'ordinal_game_stats';
  
  // Expose stats as a Signal so the UI updates automatically
  stats = signal<GameStats>(this.loadStats());

  private loadStats(): GameStats {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data 
      ? JSON.parse(data) 
      : { currentStreak: 0, maxStreak: 0, lastPlayedDate: null };
  }

  private saveStats(newStats: GameStats) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newStats));
    this.stats.set(newStats); // Update the signal
  }

  recordWin() {
    const current = this.stats();
    const newStreak = current.currentStreak + 1;
    
    this.saveStats({
      currentStreak: newStreak,
      maxStreak: Math.max(newStreak, current.maxStreak), // Update max if we beat it
      lastPlayedDate: new Date().toISOString()
    });
  }

  recordLoss() {
    const current = this.stats();
    this.saveStats({
      ...current,
      currentStreak: 0, // Reset streak on loss
      lastPlayedDate: new Date().toISOString()
    });
  }
}