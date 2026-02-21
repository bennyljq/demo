import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private sliceAudio = new Audio('assets/potong/shing.m4a');
  private perfektAudio = new Audio('assets/potong/perfekt.m4a');
  
  private activeSounds: HTMLAudioElement[] = [];
  private currentPerfektSound: HTMLAudioElement | null = null;
  private isUnlocked = false;

  unlock() {
    if (!this.isUnlocked) {
      this.sliceAudio.play().then(() => this.sliceAudio.pause()).catch(() => {});
      this.perfektAudio.play().then(() => this.perfektAudio.pause()).catch(() => {});
      this.isUnlocked = true;
    }
  }

  playSlice() {
    const soundClone = this.sliceAudio.cloneNode() as HTMLAudioElement;
    soundClone.volume = 0.666;
    
    this.activeSounds.push(soundClone);
    soundClone.onended = () => {
      this.activeSounds = this.activeSounds.filter(s => s !== soundClone);
    };
    
    soundClone.play().catch(err => console.warn("Browser blocked audio.", err));
  }

  playPerfect() {
    this.stopPerfect(); // Kill any existing perfect track
    
    const soundClone = this.perfektAudio.cloneNode() as HTMLAudioElement;
    soundClone.volume = 1.0;
    this.currentPerfektSound = soundClone;
    
    soundClone.play().catch(err => console.warn("Browser blocked audio.", err));
    
    // Fade out logic with a safety catch so it doesn't error out below 0 volume
    setTimeout(() => {
      const fadeInterval = setInterval(() => {
        if (soundClone.volume > 0.1) {
          soundClone.volume -= 0.1;
        } else {
          soundClone.volume = 0;
          soundClone.pause();
          clearInterval(fadeInterval);
        }
      }, 50);
    }, 4000);
  }

  stopPerfect() {
    if (this.currentPerfektSound) {
      this.currentPerfektSound.pause();
      this.currentPerfektSound.currentTime = 0;
      this.currentPerfektSound = null;
    }
  }

  stopAll() {
    this.activeSounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    this.activeSounds = [];
    this.stopPerfect();
  }
}