import { Component, model, output, signal, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { uiClickSound, waterDripSound } from '../shef.component';
import { MASTER_ITEMS } from '../cook-book/master-items';

export type Rarity = 'common' | 'rare' | 'legendary';
export type ItemType = 'ingredient' | 'spice' | 'cookware' | 'bundle';

export interface MarketItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  price: number;
  uses: number | '∞';
  icon: string | SafeHtml;
  isSvg?: boolean;
  bundleItems?: MarketItem[];
}

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss', '../shef.component.scss']
})
export class MarketComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  
  private kachingPool: HTMLAudioElement[] = [];
  private poolSize = 5;
  private audioDelaySkip = 0.5;
  
  runCurrency = model.required<number>();
  onLeaveMarket = output();
  
  // Required to cross-reference against permanent stock
  pantryItems = input<MarketItem[]>([]);
  
  bribeCost = signal<number>(0);
  draftedItems = signal<MarketItem[]>([]);
  
  // Initialize empty, populated securely in ngOnInit
  shopItems = signal<MarketItem[]>([]);
  onItemPurchased = output<MarketItem>();
  
  constructor() {
    for (let i = 0; i < this.poolSize; i++) {
      this.kachingPool.push(new Audio('assets/shef/sounds/kaching.mp3'));
    }
  }

  ngOnInit() {
    this.shopItems.set(this.generateShop());
  }
  
  getBundleContentsText(bundleItems: MarketItem[]): string {
    return bundleItems.map(item => item.name).join(', ');
  }

  // Helper to combine permanent items with newly drafted ones
  allOwnedItems(): MarketItem[] {
    return [...this.pantryItems(), ...this.draftedItems()];
  }
  
  generateShop(): MarketItem[] {
    // 1. Identify all infinite-use items the player currently holds
    const ownedInfiniteIds = this.allOwnedItems()
      .filter(item => item.uses === '∞')
      .map(item => item.id);

    // 2. Filter the Single Source of Truth
    const validPool = MASTER_ITEMS.filter(item => {
      // Exclude the item if it is infinite-use AND already owned
      if (item.defaultUses === '∞' && ownedInfiniteIds.includes(item.id)) {
        return false;
      }
      return true;
    });

    // 3. Shuffle the valid pool and draft exactly 5 items
    const shuffled = validPool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);

    // 4. Map the global CookBookItem shape to the localized MarketItem interface
    return selected.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type as ItemType,
      rarity: item.rarity as Rarity,
      price: item.basePrice, // Translating basePrice to immediate market price
      uses: item.defaultUses,
      icon: item.icon,
      isSvg: item.isSvg
    }));
  }
  
  private playTactileKaching() {
    let audio = this.kachingPool.find(a => a.paused || a.ended);
    if (!audio) {
      audio = this.kachingPool.reduce((prev, curr) => (prev.currentTime > curr.currentTime) ? prev : curr);
    }
    audio.currentTime = this.audioDelaySkip;
    audio.play().catch(err => console.warn('Audio blocked by browser:', err));
  }
  
  buyItem(item: MarketItem) {
    if (this.runCurrency() >= item.price) {
      this.runCurrency.update(c => c - item.price);
      
      // Unpack bundle logic vs single item logic
      if (item.type === 'bundle' && item.bundleItems) {
        this.draftedItems.update(draft => [...draft, ...item.bundleItems!]);
      } else {
        this.draftedItems.update(draft => [...draft, item]);
      }
      
      this.shopItems.update(items => items.filter(i => i.id !== item.id));
      this.playTactileKaching();
      this.onItemPurchased.emit(item);
    }
  }
  
  bribeShopkeep() {
    if (this.runCurrency() >= this.bribeCost()) {
      this.runCurrency.update(c => c - this.bribeCost());
      this.bribeCost.update(cost => Math.floor(cost * 1.5)); 
      this.shopItems.set(this.generateShop()); 
      this.playTactileKaching();
    }
  }
  
  headToKitchen() {
    this.onLeaveMarket.emit(); 
  }
  
  playClick() { uiClickSound.play(); }
  playDrip() { waterDripSound.play(); }
}