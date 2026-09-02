import { Component, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MASTER_ITEMS } from './master-items';
import { MASTER_RECIPES } from './master-recipes';
import { uiClickSound } from '../shef.component'; // Import the audio pool

@Component({
  selector: 'app-cook-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cook-book.component.html',
  styleUrls: ['./cook-book.component.scss', '../shef.component.scss']
})
export class CookBookComponent {
  onClose = output<void>();

  // State
  currentTab = signal<'ingredients' | 'spices' | 'cookware' | 'recipes'>('recipes');
  
  database = MASTER_ITEMS;
  recipes = MASTER_RECIPES;

  cookwareView = computed(() => this.database.filter(i => i.type === 'cookware'));
  ingredientsView = computed(() => this.database.filter(i => i.type === 'ingredient'));
  spicesView = computed(() => this.database.filter(i => i.type === 'spice'));

  enrichedRecipesView = computed(() => {
    return this.recipes.map(recipe => ({
      ...recipe,
      reqCookware: recipe.essentialCookwareIds.map(id => this.database.find(i => i.id === id)),
      reqIngredients: recipe.essentialIngredientIds.map(id => this.database.find(i => i.id === id)),
      reqSpices: recipe.culturalSpiceIds.map(id => this.database.find(i => i.id === id))
    }));
  });

  setTab(tab: 'ingredients' | 'spices' | 'cookware' | 'recipes') {
    this.currentTab.set(tab);
  }

  closeCookBook() {
    this.onClose.emit();
  }

  // Tactile audio feedback
  playClick() { uiClickSound.play(); }
}