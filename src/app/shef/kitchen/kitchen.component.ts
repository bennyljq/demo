import { Component, signal, output, computed, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketComponent, MarketItem, ItemType, Rarity } from '../market/market.component';
import { uiClickSound, waterDripSound } from '../shef.component';
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
  runCurrency = signal<number>(500);
  currentPhase = signal<'customer_reveal' | 'market' | 'service' | 'cooking' | 'result'>('customer_reveal');
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
    restrictions: ['No Crustaceans'],
    preferences: ['Enjoys Pork', 'Enjoys Chicken'],
    compCost: 10,
    dialogue: "I'm in a rush! Make it hot, and absolutely no shrimp!",
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
  
  ngOnInit() {
    const shefData = this.shef();
    
    // Unpack the real database items from the selected chef's loadout
    const startingItems = [
      shefData.startingCookware,
      ...shefData.startingIngredients
    ].map(item => ({
      id: item.id,
      name: item.name,
      type: item.type as ItemType,
      rarity: item.rarity as Rarity,
      price: item.basePrice,
      uses: item.defaultUses,
      icon: item.icon,
      isSvg: item.isSvg
    }));
    
    this.pantry.set(startingItems);
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
    this.pantry.update(current => [...current, item]);
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
    let highestScore = -9999;
    
    // 2. The Recipe Matrix
    for (const recipe of MASTER_RECIPES) {
      // Cookware MUST be exact. No exceptions.
      const exactCookware = selectedCookware.length === recipe.essentialCookwareIds.length &&
      recipe.essentialCookwareIds.every(id => selectedCookware.includes(id));
      if (!exactCookware) continue;
      
      // Ingredients: ±1 Leeway Logic
      const missing = recipe.essentialIngredientIds.filter(id => !selectedIngredients.includes(id));
      const extra = selectedIngredients.filter(id => !recipe.essentialIngredientIds.includes(id));
      const totalDeviations = missing.length + extra.length;
      
      if (totalDeviations <= 1) {
        let score = recipe.baseScore;
        let notes: string[] = [];
        let finalName = recipe.name;
        
        // Ingredient Modifiers
        if (missing.length === 1) {
          const missingName = MASTER_ITEMS.find(i => i.id === missing[0])?.name;
          score -= 15;
          notes.push(`Missing ${missingName} (-15)`);
          finalName += ` (No ${missingName})`;
        } else if (extra.length === 1) {
          const extraName = MASTER_ITEMS.find(i => i.id === extra[0])?.name;
          score -= 15;
          notes.push(`Extra ${extraName} (-15)`);
          finalName += ` (with ${extraName})`;
        } else {
          notes.push(`Perfect Ingredients!`);
        }
        
        // Spice Modifiers (Lax but rewarding)
        let correctSpices = 0;
        let wrongSpices = 0;
        
        selectedSpices.forEach(spiceId => {
          if (recipe.culturalSpiceIds.includes(spiceId)) {
            correctSpices++;
            score += 15; // Reward per correct spice
          } else {
            wrongSpices++;
            score -= 10; // Penalty per wrong spice
          }
        });
        
        if (correctSpices === recipe.culturalSpiceIds.length && wrongSpices === 0 && recipe.culturalSpiceIds.length > 0) {
          score += 50; // The Perfect Spice Bonus
          notes.push(`Masterful Spicing! (+50)`);
        } else {
          if (correctSpices > 0) notes.push(`Good Spices (+${correctSpices * 15})`);
          if (wrongSpices > 0) notes.push(`Wrong Spices (-${wrongSpices * 10})`);
        }
        
        if (score > highestScore) {
          highestScore = score;
          bestMatch = { isGoop: false, name: finalName, score, breakdown: notes, image: recipe.image };
        }
      }
    }
    
    // 3. Fallback to Goop Economy
    if (!bestMatch) {
      bestMatch = {
        isGoop: true,
        name: 'Incomprehensible Goop',
        score: 1,
        breakdown: ['Cookware mismatch or too many deviations.', 'Utter culinary chaos.'],
      };
    }
    
    const analysis = { cookware: [] as any[], ingredients: [] as any[], spices: [] as any[] };
    let perfectIngredients = false;
    let perfectSpices = false;
    let absolutePerfection = false;
    
    // Helper to grab full item data
    const getItem = (id: string) => MASTER_ITEMS.find(i => i.id === id);
    
    if (bestMatch && !bestMatch.isGoop) {
      const recipe = MASTER_RECIPES.find(r => r.name === bestMatch.name.split(' (')[0]) || MASTER_RECIPES[0];
      
      // 1. Cookware (Only what was used, which must be correct to match)
      selectedCookware.forEach(id => analysis.cookware.push({ item: getItem(id), status: 'correct' }));
      
      // 2. Ingredients (What was used + What was missing)
      const missing = recipe.essentialIngredientIds.filter(id => !selectedIngredients.includes(id));
      const extra = selectedIngredients.filter(id => !recipe.essentialIngredientIds.includes(id));
      
      selectedIngredients.forEach(id => {
        const status = recipe.essentialIngredientIds.includes(id) ? 'correct' : 'wrong';
        analysis.ingredients.push({ item: getItem(id), status });
      });
      
      missing.forEach(id => {
        analysis.ingredients.push({ item: getItem(id), status: 'missing' });
      });
      
      if (missing.length === 0 && extra.length === 0) perfectIngredients = true;
      
      // 3. Spices (Only what was used)
      let correctSpicesCount = 0;
      let wrongSpicesCount = 0;
      
      selectedSpices.forEach(id => {
        if (recipe.culturalSpiceIds.includes(id)) {
          analysis.spices.push({ item: getItem(id), status: 'correct' });
          correctSpicesCount++;
        } else {
          analysis.spices.push({ item: getItem(id), status: 'wrong' });
          wrongSpicesCount++;
        }
      });
      
      if (recipe.culturalSpiceIds.length > 0 && correctSpicesCount === recipe.culturalSpiceIds.length && wrongSpicesCount === 0) {
        perfectSpices = true;
      }
      
      if (perfectIngredients && perfectSpices) absolutePerfection = true;
      
    } else {
      // GOOP: Everything used is fundamentally wrong
      selectedCookware.forEach(id => analysis.cookware.push({ item: getItem(id), status: 'wrong' }));
      selectedIngredients.forEach(id => analysis.ingredients.push({ item: getItem(id), status: 'wrong' }));
      selectedSpices.forEach(id => analysis.spices.push({ item: getItem(id), status: 'wrong' }));
    }
    
    bestMatch.analysis = analysis;
    bestMatch.perfectIngredients = perfectIngredients;
    bestMatch.perfectSpices = perfectSpices;
    bestMatch.absolutePerfection = absolutePerfection;
    
    this.dishResult.set(bestMatch);
    
    // 4. Yield to cinematic transition (2.5 seconds)
    setTimeout(() => {
      this.currentPhase.set('result');
    }, 2500);
  }
  
  playClick() { uiClickSound.play(); }
  playDrip() { waterDripSound.play(); }
  
  serveCustomer() {
    // We will build the payment and hype-tally logic here next!
    console.log("Serving dish... calculating payment.");
  }
}