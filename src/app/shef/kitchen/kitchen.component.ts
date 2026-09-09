import { Component, signal, output, computed, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent, MarketItem, ItemType, Rarity } from '../market/market.component';
import { uiClickSound, waterDripSound, shopSound, successSound, failSound } from '../shef.component';
import { MASTER_RECIPES, RecipeDefinition } from '../cook-book/master-recipes';
import { MASTER_ITEMS } from '../cook-book/master-items';
import { CookBookComponent } from '../cook-book/cook-book.component';

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
  const matchingEmojis = NOUN_EMOJI_MAP[noun] || ['🧑'];
  const avatar = matchingEmojis[Math.floor(Math.random() * matchingEmojis.length)];
  return { name: `The ${adj} ${noun}`, avatar: avatar };
}

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule, MarketComponent, CookBookComponent],
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss', '../shef.component.scss']
})
export class KitchenComponent implements OnInit {
  
  // Nav Inputs & Outputs
  shef = input.required<any>(); 
  onOpenAlmanac = output<void>();
  onRunEnd = output<void>();
  
  // Run Pantry State
  showGlobalPantry = signal<boolean>(false);
  runCurrency = signal<number>(150);
  currentPhase = signal<'customer_reveal' | 'market' | 'service' | 'cooking' | 'result' | 'day_transition'>('customer_reveal');
  currentDay = signal<number>(1);
  isRunSuccessful = signal<boolean>(false);
  lastPayment = signal<number>(0);
  dishResult = signal<{ 
    isGoop: boolean, 
    name: string, 
    score: number, 
    image?: string,
    breakdown: string[],
    perfectIngredients: boolean,
    perfectSpices: boolean,
    absolutePerfection: boolean,
    analysis: {
      cookware: { item: any, status: 'correct' | 'wrong' }[],
      ingredients: { item: any, status: 'correct' | 'wrong' | 'missing' }[],
      spices: { item: any, status: 'correct' | 'wrong' }[]
    }
  } | null>(null);
  
  generatedCustomer = generateCustomer()
  currentCustomer = signal<Customer>({
    id: 'c-01',
    name: this.generatedCustomer.name,
    tastyMeterTarget: 80,
    restrictions: [],
    preferences: ['Enjoys all kinds of food'],
    compCost: 0,
    dialogue: "I'm a test customer who eats everything! Nom nom nom!",
    avatar: this.generatedCustomer.avatar
  });
  
  toggleGlobalPantry() {
    this.showGlobalPantry.update(v => !v);
  }
  
  // Initialize empty, populated dynamically from the shef input
  pantry = signal<MarketItem[]>([]);
  selectedItems = signal<MarketItem[]>([]);
  
  // Categorized computed signals for the Service UI
  cookware = computed(() => this.pantry().filter(i => i.type === 'cookware'));
  ingredients = computed(() => this.pantry().filter(i => i.type === 'ingredient'));
  spices = computed(() => this.pantry().filter(i => i.type === 'spice'));
  
  canCook = computed(() => {
    const selected = this.selectedItems();
    const hasCookware = selected.some(item => item.type === 'cookware');
    const hasIngredient = selected.some(item => item.type === 'ingredient');
    return hasCookware && hasIngredient;
  });
  
  isCookBookOpen = signal<boolean>(false);
  onNextDay = output<number>();
  formattedShefName = computed(() => {
    const parts = this.shef().name.split(' ');
    if (parts.length > 1) {
      return `${parts[0].charAt(0)}. ${parts.slice(1).join(' ')}`;
    }
    return this.shef().name; // Fallback for single names
  });
  savedShop = signal<MarketItem[]>([]);
  
  loadFromSave = input<boolean>(false);
  savedBribeCost = signal<number>(1);
  
  private calculateUses(type: string, rarity: string): number | '∞' {
    if (type === 'spice' || type === 'cookware') return '∞';
    
    if (type === 'ingredient') {
      if (rarity === 'common') return 5;
      if (rarity === 'rare') return 3;
      if (rarity === 'legendary') return 1;
    }
    
    return '∞';
  }
  
  private saveGameState() {
    const state = {
      shefId: this.shef().id,
      currentDay: this.currentDay(),
      runCurrency: this.runCurrency(),
      pantry: this.pantry(),
      savedShop: this.savedShop(),
      bribeCost: this.savedBribeCost(),
      currentCustomer: this.currentCustomer(),
      currentPhase: this.currentPhase()
    };
    localStorage.setItem('shef_save_state', JSON.stringify(state));
  }
  
  ngOnInit() {
    if (this.loadFromSave()) {
      const saveRaw = localStorage.getItem('shef_save_state');
      if (saveRaw) {
        const state = JSON.parse(saveRaw);
        this.currentDay.set(state.currentDay);
        this.runCurrency.set(state.runCurrency);
        this.pantry.set(state.pantry);
        this.savedShop.set(state.savedShop || []);
        this.savedBribeCost.set(state.bribeCost || 1);
        this.currentCustomer.set(state.currentCustomer);
        // this.currentPhase.set(state.currentPhase);
        this.currentPhase.set("customer_reveal"); // default to customer on load
        return; // Abort standard setup
      }
    }
    const shefData = this.shef();
    
    const startingItems = [
      shefData.startingCookware,
      ...shefData.startingIngredients
    ].map(item => ({
      id: item.id,
      name: item.name,
      type: item.type as ItemType,
      rarity: item.rarity as Rarity,
      price: item.basePrice,
      uses: this.calculateUses(item.type, item.rarity),
      icon: item.icon,
      isSvg: item.isSvg
    }));
    
    this.pantry.set(startingItems);
    this.saveGameState();
  }
  
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
    setTimeout(() => {
      document.querySelector('.shef-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }
  
  handleItemPurchased(item: MarketItem) {
    this.pantry.update(current => {
      // Global Stacking logic for limited-use items
      if (item.uses !== '∞') {
        const existing = current.find(i => i.id === item.id);
        
        // If it already exists in the global pantry, map over the array and increment uses
        if (existing && existing.uses !== '∞') {
          return current.map(i => 
            i.id === item.id 
            ? { ...i, uses: (i.uses as number) + (item.uses as number) } 
            : i
          );
        }
      }
      
      // If it's infinite, or doesn't exist in the global pantry yet, append it safely
      return [...current, { ...item }];
    });

    this.saveGameState();
  }
  
  toggleItem(item: MarketItem) {
    this.selectedItems.update(selected => {
      if (selected.includes(item)) return selected.filter(i => i.id !== item.id);
      return [...selected, item];
    });
  }
  
  openCookBook() {
    this.isCookBookOpen.set(true);
    setTimeout(() => {
      document.querySelector('.shef-viewport')?.scrollTo({ top: 0 });
    }, 0);
  }
  
  closeCookBook() {
    this.isCookBookOpen.set(false);
  }
  
  cookDish() {
    this.currentPhase.set('cooking');
    
    // 1. Separate the physical matter
    const selected = this.selectedItems();
    const selectedCookware = selected.filter(i => i.type === 'cookware').map(i => i.id);
    const selectedIngredients = selected.filter(i => i.type === 'ingredient').map(i => i.id);
    const selectedSpices = selected.filter(i => i.type === 'spice').map(i => i.id);
    
    let bestMatch: any = null;
    const getItem = (id: string) => MASTER_ITEMS.find(i => i.id === id);
    
    // 2. The Recipe Matrix (Strict Edition)
    for (const recipe of MASTER_RECIPES) {
      // Cookware MUST be exact. No exceptions.
      const exactCookware = selectedCookware.length === recipe.essentialCookwareIds.length &&
      recipe.essentialCookwareIds.every(id => selectedCookware.includes(id));
      if (!exactCookware) continue;
      
      // Ingredients MUST be exact. No exceptions.
      const exactIngredients = selectedIngredients.length === recipe.essentialIngredientIds.length &&
      recipe.essentialIngredientIds.every(id => selectedIngredients.includes(id));
      if (!exactIngredients) continue;
      
      // --- WE HAVE A VALID DISH ---
      let score = recipe.baseScore;
      let notes: string[] = ['Flawless Base Execution!'];
      
      // Spice Modifiers (Lax but rewarding)
      let correctSpicesCount = 0;
      let wrongSpicesCount = 0;
      
      selectedSpices.forEach(spiceId => {
        if (recipe.culturalSpiceIds.includes(spiceId)) {
          correctSpicesCount++;
          score += 15; // Reward per correct spice
        } else {
          wrongSpicesCount++;
          score -= 10; // Penalty per wrong spice
        }
      });
      
      let isAbsolutePerfection = false;
      
      if (correctSpicesCount === recipe.culturalSpiceIds.length && wrongSpicesCount === 0 && recipe.culturalSpiceIds.length > 0) {
        score += 50; // The Perfect Spice Bonus
        notes.push(`Masterful Spicing! (+50)`);
        isAbsolutePerfection = true; // Cookware and Ingredients are already guaranteed perfect
      } else {
        if (correctSpicesCount > 0) notes.push(`Good Spices (+${correctSpicesCount * 15})`);
        if (wrongSpicesCount > 0) notes.push(`Wrong Spices (-${wrongSpicesCount * 10})`);
      }
      
      // Build Analysis Grid for Success
      const analysis = { cookware: [] as any[], ingredients: [] as any[], spices: [] as any[] };
      
      // Cookware & Ingredients are mathematically guaranteed to be correct here
      selectedCookware.forEach(id => analysis.cookware.push({ item: getItem(id), status: 'correct' }));
      selectedIngredients.forEach(id => analysis.ingredients.push({ item: getItem(id), status: 'correct' }));
      
      // Spices (Track what was used + what was missed)
      recipe.culturalSpiceIds.forEach(id => {
        if (selectedSpices.includes(id)) {
          analysis.spices.push({ item: getItem(id), status: 'correct' });
        } else {
          analysis.spices.push({ item: getItem(id), status: 'missing' });
        }
      });
      selectedSpices.forEach(id => {
        if (!recipe.culturalSpiceIds.includes(id)) {
          analysis.spices.push({ item: getItem(id), status: 'wrong' });
        }
      });
      
      bestMatch = { 
        isGoop: false, 
        name: recipe.name, 
        score, 
        breakdown: notes, 
        image: recipe.image,
        absolutePerfection: isAbsolutePerfection,
        analysis: analysis
      };
      
      break; // Break early, as exact matching guarantees only one possible recipe
    }
    
    // 3. Fallback to Goop Economy
    if (!bestMatch) {
      const analysis = { cookware: [] as any[], ingredients: [] as any[], spices: [] as any[] };
      
      // Everything used is lost in the void
      selectedCookware.forEach(id => analysis.cookware.push({ item: getItem(id), status: 'missing' }));
      selectedIngredients.forEach(id => analysis.ingredients.push({ item: getItem(id), status: 'missing' }));
      selectedSpices.forEach(id => analysis.spices.push({ item: getItem(id), status: 'missing' }));
      
      bestMatch = {
        isGoop: true,
        name: 'Incomprehensible Goop',
        score: 0,
        breakdown: ['Recipe mismatch.', 'Ingredients lost in the void.'],
        absolutePerfection: false,
        analysis: analysis
      };
    }
    
    // 3.5. PHYSICAL CONSUMPTION: Deduct limited-use items from the pantry
    this.pantry.update(currentPantry => {
      const updatedPantry = currentPantry.map(pantryItem => {
        // If the item was placed in the wok and is not infinite, deduct 1 use
        if (selected.find(s => s.id === pantryItem.id) && pantryItem.uses !== '∞') {
          return { ...pantryItem, uses: (pantryItem.uses as number) - 1 };
        }
        return pantryItem;
      });
      
      // Instantly remove any item that has been completely exhausted (0 uses)
      return updatedPantry.filter(pantryItem => pantryItem.uses === '∞' || (pantryItem.uses as number) > 0);
    });
    
    // Finalize the result
    this.dishResult.set(bestMatch);
    
    // 4. Yield to cinematic transition (2.5 seconds)
    setTimeout(() => {
      this.currentPhase.set('result');
      if (bestMatch.isGoop) {
        this.playFail()
      } else {
        this.playSuccess()
      }
    }, 2500);
  }
  
  playClick() { uiClickSound.play(); }
  playDrip() { waterDripSound.play(); }
  playShop() { shopSound.play(); }
  playSuccess() { successSound.play(); }
  playFail() { failSound.play(); }
  
  serveCustomer() {
    const result = this.dishResult();
    const customer = this.currentCustomer();
    if (!result) return;
    
    const passed = result.score >= customer.tastyMeterTarget;
    
    if (passed) {
      // Payment Logic: Raw score converts directly to cash, rewarding perfection
      const payment = result.score; 
      this.runCurrency.update(c => c + payment);
      this.lastPayment.set(payment);
      this.isRunSuccessful.set(true);
      this.saveGameState();
    } else {
      // Catastrophic failure
      this.isRunSuccessful.set(false);
      localStorage.removeItem('shef_save_state');
    }
    
    this.currentPhase.set('day_transition');
  }
  
  nextDay() {
    this.savedShop.set([]);
    this.currentDay.update(d => d + 1);
    
    // Emit to ShefComponent to trigger the cinematic overlay
    this.onNextDay.emit(this.currentDay());
    
    // Procedurally generate the next customer behind the scenes
    this.generatedCustomer = generateCustomer();
    this.currentCustomer.set({
      id: `c-0${this.currentDay()}`,
      name: this.generatedCustomer.name,
      // tastyMeterTarget: 60 + (this.currentDay() * 10),
      tastyMeterTarget: 100,
      restrictions: [],
      preferences: ['Eats everything!'],
      // compCost: 10 + (this.currentDay() * 2),
      compCost: 0,
      dialogue: "Another day, another meal! Don't keep me waiting.",
      avatar: this.generatedCustomer.avatar
    });
    
    // Wipe the physical prep station clean
    this.selectedItems.set([]);
    this.dishResult.set(null);
    this.currentPhase.set('customer_reveal');
    this.savedBribeCost.set(1);
    this.saveGameState();
  }

  syncMarketState(marketState: { shop: MarketItem[], bribe: number }) {
    this.savedShop.set(marketState.shop);
    this.savedBribeCost.set(marketState.bribe);
    this.saveGameState(); // Disk write
  }
}