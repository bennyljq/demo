import { Component, model, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { uiClickSound, waterDripSound } from '../shef.component';

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
export class MarketComponent {
  private sanitizer = inject(DomSanitizer);
  
  private kachingPool: HTMLAudioElement[] = [];
  private poolSize = 5;
  private audioDelaySkip = 0.5;
  
  runCurrency = model.required<number>();
  onLeaveMarket = output();
  
  bribeCost = signal<number>(10);
  draftedItems = signal<MarketItem[]>([]);
  shopItems = signal<MarketItem[]>(this.generateShop());
  onItemPurchased = output<MarketItem>();
  
  constructor() {
    for (let i = 0; i < this.poolSize; i++) {
      this.kachingPool.push(new Audio('assets/shef/kaching.mp3'));
    }
  }
  
  getBundleContentsText(bundleItems: MarketItem[]): string {
    return bundleItems.map(item => item.name).join(', ');
  }
  
  generateShop(): MarketItem[] {
    return [
      { id: 'm-1', name: 'Premium Rice', type: 'ingredient', rarity: 'common', price: 5, uses: '∞', icon: '🍚' },
      { id: 'm-2', name: 'Shaoxing Wine', type: 'spice', rarity: 'rare', price: 15, uses: '∞', icon: '🍶' },
      { id: 'm-3', name: 'Wagyu Beef', type: 'ingredient', rarity: 'legendary', price: 40, uses: 1, icon: '🥩' },
      { id: 'm-4', name: 'Scallions', type: 'ingredient', rarity: 'common', price: 3, uses: '∞', icon: '🧅' },
      { id: 'm-5', name: 'Organic Eggs', type: 'ingredient', rarity: 'rare', price: 12, uses: 5, icon: '🥚' },
      { 
        id: 'm-6', 
        name: 'Dumpling Kit', 
        type: 'bundle', 
        rarity: 'rare', 
        price: 20, 
        uses: 5, 
        isSvg: true,
        icon: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13a9.5 9.5 0 0 0 19 0c0-1.5-3-3-9.5-3S2.5 11.5 2.5 13z"/><path d="M12 10v12"/><path d="M8 10.5l3 11.5"/><path d="M16 10.5l-3 11.5"/><path d="M5 11.5l5 10.5"/><path d="M19 11.5l-5 10.5"/></svg>`),
        bundleItems: [
          { id: 'b-1', name: 'Flour', type: 'ingredient', rarity: 'common', price: 0, uses: '∞', icon: '🌾' },
          { id: 'b-2', name: 'Ground Pork', type: 'ingredient', rarity: 'common', price: 0, uses: '∞', icon: '🥩' },
          { id: 'b-3', name: 'Scallions', type: 'ingredient', rarity: 'common', price: 0, uses: '∞', icon: '🧅' }
        ]
      }
    ];
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