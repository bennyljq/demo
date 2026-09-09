import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KitchenComponent } from './kitchen/kitchen.component';
import { CookBookComponent } from './cook-book/cook-book.component';
import { baseTraits, CookBookItem, MASTER_ITEMS } from './cook-book/master-items';

export interface Shef {
  id: string;
  name: string;
  description: string;
  available: boolean;
  avatar: string;
  startingCookware: CookBookItem;
  startingIngredients: CookBookItem[];
  restaurantImages: string[];
}

export interface GameSaveState {
  shefId: string;
  currentDay: number;
  runCurrency: number;
  pantry: any[]; 
  savedShop: any[];
  bribeCost: number; // Prevent free reroll amnesia
  currentCustomer: any;
  currentPhase: 'customer_reveal' | 'market' | 'service' | 'cooking' | 'result' | 'day_transition';
}

const getItem = (id: string): CookBookItem => MASTER_ITEMS.find(i => i.id === id)!;

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

export const uiClickSound = new CarnalAudioPool('assets/shef/sounds/button-click.mp3');
export const waterDripSound = new CarnalAudioPool('assets/shef/sounds/drip.mp3');
export const shopSound = new CarnalAudioPool('assets/shef/sounds/shop.mp3');
export const successSound = new CarnalAudioPool('assets/shef/sounds/success.mp3');
export const failSound = new CarnalAudioPool('assets/shef/sounds/fail.mp3');

@Component({
  selector: 'app-shef-root',
  standalone: true,
  imports: [CommonModule, KitchenComponent, CookBookComponent],
  templateUrl: './shef.component.html',
  styleUrls: ['./shef.component.scss']
})
export class ShefComponent {
  // 1. Expand the signal to accept the 'transition' state
  currentScreen = signal<'landing' | 'selection' | 'transition' | 'kitchen'>('landing');
  currentDay = signal<number>(1);
  
  shefRoster = signal<Shef[]>([
    {
      id: 'mathew-wok',
      name: 'Mathew Wok',
      description: 'Hong Kong hawker extraordinaire.',
      available: true,
      avatar: 'assets/shef/pictures/mat.jpg',
      // Pulling directly from the OOP Database
      startingCookware: getItem('cw-1'), // Mathew's Wok
      startingIngredients: [
        getItem('ig-1'), // White Rice
        getItem('ig-6'), // Chicken Eggs
        // getItem('ig-10'), // Char Siu
        getItem('ig-11'), // shrimp
        getItem('ig-16'), // Scallions
        getItem('sp-1'),  // Peanut Oil
        getItem('sp-2'),  // Light Soy Sauce
        getItem('sp-4'),  // White pepper
      ],
      restaurantImages: [
        'assets/shef/pictures/dapaidang.jpg', 
      ]
    },
    {
      id: 'balaji-krishnan',
      name: 'Balaji Krishnan',
      description: 'Indian food master.',
      available: false,
      avatar: 'assets/shef/pictures/balaji.png',
      // Inline OOP objects for locked characters to satisfy the interface
      startingCookware: { id: 'cw-balaji', name: 'Cast Iron Kadhai', type: 'cookware', rarity: 'legendary', basePrice: 80, icon: '🥘', traits: baseTraits },
      startingIngredients: [
        { id: 'ig-balaji-1', name: 'Basmati Rice', type: 'ingredient', rarity: 'common', basePrice: 5, icon: '🍚', traits: baseTraits },
        { id: 'ig-balaji-2', name: 'Paneer', type: 'ingredient', rarity: 'rare', basePrice: 12, icon: '🧀', traits: baseTraits }
      ],
      restaurantImages: []
    },
    {
      id: 'roberto-carlost',
      name: 'Roberto Carlost',
      description: 'Mexican culinary expert.',
      available: false,
      avatar: 'assets/shef/pictures/roberto.png',
      startingCookware: { id: 'cw-roberto', name: 'Traditional Comal', type: 'cookware', rarity: 'legendary', basePrice: 80, icon: '🍳', traits: baseTraits },
      startingIngredients: [
        { id: 'ig-roberto-1', name: 'Masa Flour', type: 'ingredient', rarity: 'common', basePrice: 4, icon: '🌾', traits: baseTraits },
        { id: 'ig-roberto-2', name: 'Avocados', type: 'ingredient', rarity: 'rare', basePrice: 10, icon: '🥑', traits: baseTraits }
      ],
      restaurantImages: []
    }
  ]);
  
  // 2. Track the selected shef for the global nav and transition screen
  selectedShef = signal<Shef | null>(this.shefRoster()[0]);
  
  // 3. Global Pantry State
  showGlobalPantry = signal<boolean>(false);
  isCookBookOpen = signal<boolean>(false);
  
  hasSavedGame = signal<boolean>(false);
  isContinuingRun = signal<boolean>(false);

  private transitionTimeout: any = null;
  
  ngOnInit() {
    this.refreshSaveState();
  }
  
  refreshSaveState() {
    this.hasSavedGame.set(!!localStorage.getItem('shef_save_state'));
  }

  skipTransition() {
    // Eradicate the ghost timer if the player clicks early
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
    }
    this.currentScreen.set('kitchen');
  }

  triggerNextDayTransition(newDay: number) {
    this.currentDay.set(newDay);
    this.currentScreen.set('transition');
    
    if (this.transitionTimeout) clearTimeout(this.transitionTimeout);
    
    // Track the 3-second cinematic hold
    this.transitionTimeout = setTimeout(() => {
      this.currentScreen.set('kitchen');
    }, 3000);
  }

  continueRun() {
    const saveRaw = localStorage.getItem('shef_save_state');
    if (saveRaw) {
      const saveData: GameSaveState = JSON.parse(saveRaw);
      const savedShef = this.shefRoster().find(s => s.id === saveData.shefId);
      this.currentDay.set(saveData.currentDay)
      
      if (savedShef) {
        this.selectedShef.set(savedShef);
        this.isContinuingRun.set(true);
        
        this.currentScreen.set('transition');
        
        if (this.transitionTimeout) clearTimeout(this.transitionTimeout);
        
        this.transitionTimeout = setTimeout(() => {
          this.currentScreen.set('kitchen');
        }, 3000);
      }
    }
  }
  
  selectShef(shef: Shef) {
    if (shef.available) {
      this.selectedShef.set(shef);
      this.currentDay.set(1);
      this.isContinuingRun.set(false); // CRITICAL: Marks this as a fresh start
      
      this.currentScreen.set('transition');
      
      if (this.transitionTimeout) clearTimeout(this.transitionTimeout);
      
      this.transitionTimeout = setTimeout(() => {
        this.currentScreen.set('kitchen');
      }, 3000);
    }
  }
  
  startService() {
    this.currentScreen.set('selection');
  }
  
  clickHero() {
    if (this.hasSavedGame()) {
      this.continueRun()
    } else {
      this.startService()
    }
  }

  goBack() {
    this.refreshSaveState();
    this.currentScreen.set('landing');
  }
  
  endRun() {
    this.refreshSaveState();
    this.currentScreen.set('landing');
  }
  
  openAlmanac() { 
    console.log('Opening Almanac...');
  }
  
  playClick() { uiClickSound.play(); }
  playDrip() { waterDripSound.play(); }
  playShop() { shopSound.play(); }
  
  openCookBook() {
    this.isCookBookOpen.set(true);
  }
  
  closeCookBook() {
    this.isCookBookOpen.set(false);
  }
}