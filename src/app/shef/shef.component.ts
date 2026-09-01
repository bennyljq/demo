import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KitchenComponent } from './kitchen/kitchen.component';

interface Shef {
  id: string;
  name: string;
  description: string;
  available: boolean;
  avatar: string;
  startingCookware: string;
  startingIngredients: string[];
  restaurantImages: string[];
}

// --- CARNAL AUDIO POOLS ---
export class CarnalAudioPool {
  private pool: HTMLAudioElement[] = [];
  private idx = 0;
  
  constructor(src: string, size = 5) {
    this.pool = Array.from({ length: size }, () => new Audio(src));
  }
  
  play() {
    this.pool[this.idx].currentTime = 0;
    this.pool[this.idx].play().catch(e => console.warn('Audio blocked by browser:', e));
    this.idx = (this.idx + 1) % this.pool.length;
  }
}

export const uiClickSound = new CarnalAudioPool('assets/shef/button-click.mp3');
export const waterDripSound = new CarnalAudioPool('assets/shef/drip.mp3');

@Component({
  selector: 'app-shef-root',
  standalone: true,
  imports: [CommonModule, KitchenComponent],
  templateUrl: './shef.component.html',
  styleUrls: ['./shef.component.scss']
})
export class ShefComponent {
  // 1. Expand the signal to accept the 'transition' state
  currentScreen = signal<'landing' | 'selection' | 'transition' | 'kitchen'>('landing');
  
  shefRoster = signal<Shef[]>([
    {
      id: 'mathew-wok',
      name: 'Mathew Wok',
      description: 'Hong Kong hawker extraordinaire.',
      available: true,
      avatar: 'assets/shef/mat.jpg',
      startingCookware: 'Mathew\'s Wok',
      startingIngredients: ['Rice', 'Eggs', 'Pork', 'Scallions', 'Oil'],
      restaurantImages: [
        'assets/shef/dapaidang.jpg', 
      ]
    },
    {
      id: 'balaji-krishnan',
      name: 'Balaji Krishnan',
      description: 'Indian food master.',
      available: false,
      avatar: 'assets/shef/balaji.png',
      startingCookware: 'Cast Iron Kadhai',
      startingIngredients: ['Basmati Rice', 'Paneer', 'Ghee', 'Cumin', 'Onions'],
      restaurantImages: []
    },
    {
      id: 'roberto-carlost',
      name: 'Roberto Carlost',
      description: 'Mexican culinary expert.',
      available: false,
      avatar: 'assets/shef/roberto.png',
      startingCookware: 'Traditional Comal',
      startingIngredients: ['Masa Flour', 'Cilantro', 'Limes', 'Avocados', 'Pork Lard'],
      restaurantImages: []
    }
  ]);
  
  // 2. Track the selected shef for the global nav and transition screen
  selectedShef = signal<Shef | null>(this.shefRoster()[0]);
  
  // 3. Global Pantry State
  showGlobalPantry = signal<boolean>(false);
  
  private transitionTimeout: any = null;
  
  selectShef(shef: Shef) {
    if (shef.available) {
      this.selectedShef.set(shef);
      this.currentScreen.set('transition');
      
      if (this.transitionTimeout) {
        clearTimeout(this.transitionTimeout);
      }
      
      // Artisanal pause to allow the player to collect themselves
      this.transitionTimeout = setTimeout(() => {
        this.currentScreen.set('kitchen');
      }, 3000);
    }
  }
  
  skipTransition() {
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
    }
    this.currentScreen.set('kitchen');
  }
  
  startService() {
    this.currentScreen.set('selection');
  }
  
  goBack() {
    this.currentScreen.set('landing');
  }
  
  endRun() {
    this.currentScreen.set('landing');
  }
  
  openAlmanac() { 
    console.log('Opening Almanac...');
  }
  
  playClick() { uiClickSound.play(); }
  playDrip() { waterDripSound.play(); }
}