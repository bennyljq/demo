import { Component, model, output, signal, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { shopSound, uiClickSound, waterDripSound } from '../shef.component';
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
  purchased?: boolean;
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
  
  bribeCost = signal<number>(1);
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
    
    // 3. Separate into Rarity Pools
    const commons = validPool.filter(i => i.rarity === 'common');
    const rares = validPool.filter(i => i.rarity === 'rare');
    const legendaries = validPool.filter(i => i.rarity === 'legendary');
    
    const selected: any[] = [];
    const shopSize = 8; 
    
    // 4. Draft exactly 8 items using the weighted probability matrix
    for (let i = 0; i < shopSize; i++) {
      const roll = Math.random();
      let chosenPool;
      
      // 60% Common, 30% Rare, 10% Legendary
      if (roll < 0.6) chosenPool = commons;
      else if (roll < 0.9) chosenPool = rares;
      else chosenPool = legendaries;
      
      // Fallback cascade if the rolled pool is already empty
      if (chosenPool.length === 0) {
        if (commons.length > 0) chosenPool = commons;
        else if (rares.length > 0) chosenPool = rares;
        else if (legendaries.length > 0) chosenPool = legendaries;
        else break; // No valid items left in the entire database
      }
      
      // Pick a random item from the chosen pool and remove it to prevent duplicates
      const index = Math.floor(Math.random() * chosenPool.length);
      selected.push(chosenPool[index]);
      chosenPool.splice(index, 1);
    }
    
    // 5. Map the global CookBookItem shape to the localized MarketItem interface
    return selected.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type as ItemType,
      rarity: item.rarity as Rarity,
      price: item.basePrice, 
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
  // Prevent double-purchasing
  if (this.runCurrency() >= item.price && !item.purchased) {
    this.runCurrency.update(c => c - item.price);
    
    // 1. Local Stacking: Only track what was procured in THIS visit
    if (item.uses !== '∞') {
      const draftMatch = this.draftedItems().find(i => i.id === item.id);
      
      if (draftMatch && draftMatch.uses !== '∞') {
        draftMatch.uses = (draftMatch.uses as number) + (item.uses as number);
        this.draftedItems.update(draft => [...draft]);
      } else {
        this.draftedItems.update(draft => [...draft, { ...item }]);
      }
    } else {
      this.draftedItems.update(draft => [...draft, { ...item }]);
    }
    
    // 2. FIX: Transition to Purchased state instead of removing the item
    this.shopItems.update(items => 
      items.map(i => i.id === item.id ? { ...i, purchased: true } : i)
    );
    
    this.playTactileKaching();
    this.onItemPurchased.emit(item);
  }
}
  
  bribeShopkeep() {
    if (this.runCurrency() >= this.bribeCost()) {
      this.runCurrency.update(c => c - this.bribeCost());
      this.bribeCost.update(cost => cost+1); 
      this.shopItems.set(this.generateShop()); 
    }
  }
  
  headToKitchen() {
    this.onLeaveMarket.emit(); 
  }
  
  playClick() { uiClickSound.play(); }
  playDrip() { waterDripSound.play(); }
  playShop() { shopSound.play(); }
}