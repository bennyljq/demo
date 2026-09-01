import { Component, signal, output, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent, MarketItem } from '../market/market.component';
import { uiClickSound, waterDripSound } from '../shef.component';

export interface Customer {
  id: string;
  name: string;
  tastyMeterTarget: number;
  restrictions: string[];
  preferences: string[];
  compCost: number;
  dialogue: string;
  avatar: string;
}

const ADJECTIVES = ['Hungry', 'Sleepy', 'Grumpy', 'Anxious', 'Wealthy', 'Impatient', 'Exhausted', 'Picky', 'Ecstatic', 'Sneaky', 'Casual', 'Pompous', 'Jovial', 'Melancholic', 'Skeptical', 'Frenzied', 'Desperate', 'Hangry', 'Cheerful', 'Mystical'];

const NOUNS = ['Commuter', 'Critic', 'Tourist', 'Student', 'Banker', 'Aristocrat', 'Nomad', 'Artisan', 'Glutton', 'Inspector', 'Hermit', 'Diplomat', 'Slacker', 'Sailor', 'Architect', 'Accountant', 'Visionary', 'Chef', 'Scholar', 'Vagabond'];

// Map each noun to thematic humanoid emojis from the pool
const NOUN_EMOJI_MAP: Record<string, string[]> = {
  'Commuter': ['👨‍💼', '👩‍💼', '🧑', '👱', '🧔'],
  'Critic': ['🕵️', '🕵️‍♂️', '🕵️‍♀️', '🧓', '👵'],
  'Tourist': ['🧑', '👶', '👱', '🧓'],
  'Student': ['👩‍🎓', '👨‍🎓', '👦', '👧', '🧑'],
  'Banker': ['👨‍💼', '👩‍💼', '🤵'],
  'Aristocrat': ['🤴', '👸', '🫅', '🤵'],
  'Nomad': ['👳', '👳‍♂️', '👳‍♀️', '🧔', '🧑'],
  'Artisan': ['👩‍🎨', '👨‍🎨', '👩‍🔧', '👨‍🔧', '🧑'],
  'Glutton': ['👶', '🧑', '🧓', '👵'],
  'Inspector': ['🕵️', '🕵️‍♂️', '🕵️‍♀️', '👮', '👮‍♂️', '👮‍♀️'],
  'Hermit': ['🧓', '👴', '👵', '🧙', '🧙‍♂️', '🧙‍♀️'],
  'Diplomat': ['🤵', '🤵‍♀️', '👩‍💼', '👨‍💼', '🫅'],
  'Slacker': ['🧑', '👦', '👧', '👱'],
  'Sailor': ['👨‍✈️', '👩‍✈️', '🧑', '🧔'],
  'Architect': ['👷', '👷‍♂️', '👷‍♀️', '👩‍💻', '👨‍💻'],
  'Accountant': ['👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '🧑'],
  'Visionary': ['🧙', '🧙‍♂️', '🧙‍♀️', '🦸', '🦸‍♂️', '🦸‍♀️'],
  'Chef': ['👩‍🍳', '👨‍🍳', '🧑'],
  'Scholar': ['👩‍🎓', '👨‍🎓', '👩‍🏫', '👨‍🏫', '🧓'],
  'Vagabond': ['🧔', '🧑', '🧙', '🧓']
};

export function generateCustomer() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  
  // Select an emoji strictly associated with the chosen noun category
  const matchingEmojis = NOUN_EMOJI_MAP[noun] || ['🧑'];
  const avatar = matchingEmojis[Math.floor(Math.random() * matchingEmojis.length)];

  return {
    name: `The ${adj} ${noun}`,
    avatar: avatar
  };
}

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule, MarketComponent],
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss', '../shef.component.scss']
})
export class KitchenComponent {
  
  // Nav Inputs & Outputs
  shef = input.required<any>(); // Receives the selected shef from parent
  onOpenAlmanac = output<void>();
  onRunEnd = output<void>();
  
  // Run Pantry State
  showGlobalPantry = signal<boolean>(false);
  
  runCurrency = signal<number>(50);
  currentPhase = signal<'customer_reveal' | 'market' | 'service'>('customer_reveal');
  
  // Wrap the SVG in the sanitizer to prevent it from rendering as blank white
  generatedCustomer = generateCustomer()
  currentCustomer = signal<Customer>({
    id: 'c-01',
    name: this.generatedCustomer.name,
    tastyMeterTarget: 80,
    restrictions: ['No Crustaceans'],
    preferences: ['Enjoys Pork', 'Enjoys Chicken'],
    compCost: 10,
    dialogue: "I'm in a rush! Make it hot, and absolutely no shrimp!",
    avatar: this.generatedCustomer.avatar
  });
  
  toggleGlobalPantry() {
    this.showGlobalPantry.update(v => !v);
  }
  
  pantry = signal<MarketItem[]>([
    { id: 'start-1', name: 'Mathew\'s Wok', type: 'cookware', rarity: 'legendary', price: 0, uses: '∞', icon: '🍳' },
    { id: 'start-2', name: 'Rice', type: 'ingredient', rarity: 'common', price: 0, uses: '∞', icon: '🍚' },
    { id: 'start-3', name: 'Egg', type: 'ingredient', rarity: 'common', price: 0, uses: '∞', icon: '🥚' },
    { id: 'start-4', name: 'Pork', type: 'ingredient', rarity: 'common', price: 0, uses: '∞', icon: '🥩' },
    { id: 'start-5', name: 'Scallions', type: 'ingredient', rarity: 'common', price: 0, uses: '∞', icon: '🧅' },
    { id: 'start-6', name: 'Oil', type: 'spice', rarity: 'common', price: 0, uses: '∞', icon: '🧴' }
  ]);
  
  selectedItems = signal<MarketItem[]>([]);
  
  // Categorized computed signals for the Service UI
  cookware = computed(() => this.pantry().filter(i => i.type === 'cookware'));
  ingredients = computed(() => this.pantry().filter(i => i.type === 'ingredient'));
  spices = computed(() => this.pantry().filter(i => i.type === 'spice'));
  
  // Mechanical Safeguard: Must have at least one vessel and one ingredient
  canCook = computed(() => {
    const selected = this.selectedItems();
    const hasCookware = selected.some(item => item.type === 'cookware');
    const hasIngredient = selected.some(item => item.type === 'ingredient');
    return hasCookware && hasIngredient;
  });
  
  goToMarket() { 
    this.currentPhase.set('market'); 
  }
  
  compCustomer() {
    if (this.runCurrency() >= this.currentCustomer().compCost) {
      this.runCurrency.update(curr => curr - this.currentCustomer().compCost);
      // Future logic: Reroll customer and regenerate SVG face
    }
  }
  
  goToService() {
    this.currentPhase.set('service');
    
    // Yield to the event loop so Angular can mount the Service UI, 
    // then smoothly reset the physical viewport's scroll position.
    setTimeout(() => {
      document.querySelector('.shef-viewport')?.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 0);
  }
  
  handleItemPurchased(item: MarketItem) {
    this.pantry.update(current => [...current, item]);
  }
  
  toggleItem(item: MarketItem) {
    this.selectedItems.update(selected => {
      if (selected.includes(item)) return selected.filter(i => i.id !== item.id);
      return [...selected, item];
    });
  }
  
  cookDish() {
    console.log("Cooking dish with:", this.selectedItems());
    // Future: Execute validation matrix here
  }
  
  // --- CARNAL AUDIO TRIGGERS ---
  playClick() { uiClickSound.play(); }
  playDrip() { waterDripSound.play(); }
}