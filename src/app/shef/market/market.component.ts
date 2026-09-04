import { Component, model, output, signal, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { shopSound, uiClickSound, waterDripSound } from '../shef.component';
import { MASTER_ITEMS } from '../cook-book/master-items';

export type Rarity = 'common' | 'rare' | 'legendary';
export type ItemType = 'ingredient' | 'spice' | 'cookware'; // Bundle completely removed

export interface MarketItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: Rarity;
  price: number;
  uses: number | '∞';
  icon: string | SafeHtml;
  isSvg?: boolean;
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
  
  pantryItems = input<MarketItem[]>([]);
  
  bribeCost = signal<number>(1);
  draftedItems = signal<MarketItem[]>([]);
  
  shopItems = signal<MarketItem[]>([]);
  onItemPurchased = output<MarketItem>();
  
  restoredShop = input<MarketItem[]>([]);
  onLeaveMarket = output<void>();
  
  initialBribe = input<number>(1);
  onMarketStateChange = output<{shop: MarketItem[], bribe: number}>();
  
  constructor() {
    for (let i = 0; i < this.poolSize; i++) {
      this.kachingPool.push(new Audio('assets/shef/sounds/kaching.mp3'));
    }
  }
  
  ngOnInit() {
    this.bribeCost.set(this.initialBribe());
    // 3. Check if we have a saved shop state; if not, generate a fresh one
    const saved = this.restoredShop();
    if (saved && saved.length > 0) {
      this.shopItems.set(saved);
    } else {
      this.shopItems.set(this.generateShop());
      this.onMarketStateChange.emit({ shop: this.shopItems(), bribe: this.bribeCost() });
    }
  }
  
  // --- NEW: Runtime Use-Count Calculator ---
  private calculateUses(type: string, rarity: string): number | '∞' {
    if (type === 'spice' || type === 'cookware') return '∞';
    
    if (type === 'ingredient') {
      if (rarity === 'common') return 5;
      if (rarity === 'rare') return 3;
      if (rarity === 'legendary') return 1;
    }
    
    return '∞';
  }
  
  allOwnedItems(): MarketItem[] {
    return [...this.pantryItems(), ...this.draftedItems()];
  }
  
  generateShop(): MarketItem[] {
    const ownedInfiniteIds = this.allOwnedItems()
    .filter(item => item.uses === '∞')
    .map(item => item.id);
    
    const validPool = MASTER_ITEMS.filter(item => {
      // Evaluate uses at runtime based on balancing rules
      const runtimeUses = this.calculateUses(item.type, item.rarity);
      if (runtimeUses === '∞' && ownedInfiniteIds.includes(item.id)) {
        return false;
      }
      return true;
    });
    
    const commons = validPool.filter(i => i.rarity === 'common');
    const rares = validPool.filter(i => i.rarity === 'rare');
    const legendaries = validPool.filter(i => i.rarity === 'legendary');
    
    const selected: any[] = [];
    const shopSize = 8; 
    
    for (let i = 0; i < shopSize; i++) {
      const roll = Math.random();
      let chosenPool;
      
      if (roll < 0.6) chosenPool = commons;
      else if (roll < 0.9) chosenPool = rares;
      else chosenPool = legendaries;
      
      if (chosenPool.length === 0) {
        if (commons.length > 0) chosenPool = commons;
        else if (rares.length > 0) chosenPool = rares;
        else if (legendaries.length > 0) chosenPool = legendaries;
        else break; 
      }
      
      const index = Math.floor(Math.random() * chosenPool.length);
      selected.push(chosenPool[index]);
      chosenPool.splice(index, 1);
    }
    
    return selected.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type as ItemType,
      rarity: item.rarity as Rarity,
      price: item.basePrice, 
      uses: this.calculateUses(item.type, item.rarity), // Inject runtime calculation
      icon: item.icon,
      isSvg: item.isSvg,
      purchased: false
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
    if (this.runCurrency() >= item.price && !item.purchased) {
      this.runCurrency.update(c => c - item.price);
      
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
      
      this.shopItems.update(items => 
        items.map(i => i.id === item.id ? { ...i, purchased: true } : i)
      );
      
      this.playTactileKaching();
      
      // EMIT ATOMIC CHANGES
      this.onItemPurchased.emit(item);
      this.onMarketStateChange.emit({ shop: this.shopItems(), bribe: this.bribeCost() });
    }
  }
  
  bribeShopkeep() {
    if (this.runCurrency() >= this.bribeCost()) {
      this.runCurrency.update(c => c - this.bribeCost());
      this.bribeCost.update(cost => cost + 1); 
      this.shopItems.set(this.generateShop()); 
      
      this.playTactileKaching();
      
      this.onMarketStateChange.emit({ shop: this.shopItems(), bribe: this.bribeCost() });
    }
  }
  
  headToKitchen() {
    this.onLeaveMarket.emit();
  }
  
  playClick() { uiClickSound.play(); }
  playDrip() { waterDripSound.play(); }
  playShop() { shopSound.play(); } // Preserved your custom audio hook
}