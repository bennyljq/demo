export type ItemRarity = 'common' | 'rare' | 'legendary';
export type ItemType = 'ingredient' | 'spice' | 'cookware';

export interface DietaryTraits {
  isVegetarian: boolean;
  isVegan: boolean;
  isHalal: boolean;
  isMeat: boolean;
  isPork: boolean;
  isBeef: boolean;
  isPoultry: boolean;
  isSeafood: boolean;
  isCrustacean: boolean;
  isGluten: boolean;
  isAllium: boolean;
  isDairy: boolean;
}

export interface CookBookItem {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  basePrice: number;
  defaultUses: number | '∞';
  icon: string;
  isSvg?: boolean;
  lore?: string;
  traits: DietaryTraits;
}

export const baseTraits: DietaryTraits = {
  isVegetarian: false, isVegan: false, isHalal: false, isMeat: false, 
  isPork: false, isBeef: false, isPoultry: false, isSeafood: false, 
  isCrustacean: false, isGluten: false, isAllium: false, isDairy: false
};

export const MASTER_ITEMS: CookBookItem[] = [
  // --- COOKWARE (All Legendary, Infinite Uses) ---
  { id: 'cw-1', name: 'Carbon Steel Wok', type: 'cookware', rarity: 'legendary', basePrice: 100, defaultUses: '∞', icon: '🍳', lore: 'Seasoned over a decade of fiery services in Hong Kong. The crucible of Wok Hei.', traits: { ...baseTraits } },
  { id: 'cw-2', name: 'Bamboo Steamer', type: 'cookware', rarity: 'legendary', basePrice: 60, defaultUses: '∞', icon: '🧺', lore: 'Imparts a subtle, earthy aroma to delicate skins.', traits: { ...baseTraits } },
  { id: 'cw-3', name: 'Cast Iron Skillet', type: 'cookware', rarity: 'legendary', basePrice: 75, defaultUses: '∞', icon: '🥘', lore: 'Retains heat flawlessly. Essential for the perfect, punishing sear.', traits: { ...baseTraits } },
  
  // --- INGREDIENTS (20 Total) ---
  { id: 'ig-1', name: 'White Rice', type: 'ingredient', rarity: 'common', basePrice: 5, defaultUses: '∞', icon: '🍚', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true } },
  { id: 'ig-2', name: 'Flat Rice Noodles (Kway Teow)', type: 'ingredient', rarity: 'common', basePrice: 6, defaultUses: '∞', icon: '🍜', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true } },
  { id: 'ig-3', name: 'Yellow Egg Noodles', type: 'ingredient', rarity: 'common', basePrice: 5, defaultUses: '∞', icon: '🍝', traits: { ...baseTraits, isVegetarian: true, isHalal: true, isGluten: true } },
  { id: 'ig-4', name: 'Wonton Wrappers', type: 'ingredient', rarity: 'common', basePrice: 4, defaultUses: '∞', icon: '🥠', traits: { ...baseTraits, isVegetarian: true, isHalal: true, isGluten: true } },
  { id: 'ig-5', name: 'Crystal Skin Paper', type: 'ingredient', rarity: 'rare', basePrice: 15, defaultUses: 5, icon: '🥟', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true } }, // Wheat starch/tapioca
  
  { id: 'ig-6', name: 'Chicken Eggs', type: 'ingredient', rarity: 'common', basePrice: 8, defaultUses: '∞', icon: '🥚', traits: { ...baseTraits, isVegetarian: true, isHalal: true } },
  { id: 'ig-7', name: 'Minced Pork', type: 'ingredient', rarity: 'common', basePrice: 9, defaultUses: '∞', icon: '🥓', traits: { ...baseTraits, isMeat: true, isPork: true } },
  { id: 'ig-8', name: 'Pork Belly', type: 'ingredient', rarity: 'common', basePrice: 12, defaultUses: '∞', icon: '🥩', traits: { ...baseTraits, isMeat: true, isPork: true } },
  { id: 'ig-9', name: 'Chinese Sausage (Lup Cheong)', type: 'ingredient', rarity: 'rare', basePrice: 16, defaultUses: 5, icon: '🌭', traits: { ...baseTraits, isMeat: true, isPork: true } },
  { id: 'ig-10', name: 'Char Siu', type: 'ingredient', rarity: 'rare', basePrice: 18, defaultUses: 5, icon: '🍖', traits: { ...baseTraits, isMeat: true, isPork: true } },
  
  { id: 'ig-11', name: 'Fresh Shrimp', type: 'ingredient', rarity: 'rare', basePrice: 18, defaultUses: 5, icon: '🦐', traits: { ...baseTraits, isMeat: true, isSeafood: true, isCrustacean: true, isHalal: true } },
  { id: 'ig-12', name: 'Blood Cockles (Hum)', type: 'ingredient', rarity: 'rare', basePrice: 15, defaultUses: 5, icon: '🦪', traits: { ...baseTraits, isMeat: true, isSeafood: true, isHalal: true } },
  { id: 'ig-13', name: 'Wagyu Beef', type: 'ingredient', rarity: 'legendary', basePrice: 40, defaultUses: 1, icon: '🥩', traits: { ...baseTraits, isMeat: true, isBeef: true, isHalal: true } },
  { id: 'ig-14', name: 'Fresh Mud Crab', type: 'ingredient', rarity: 'legendary', basePrice: 35, defaultUses: 1, icon: '🦀', traits: { ...baseTraits, isMeat: true, isSeafood: true, isCrustacean: true, isHalal: true } },
  { id: 'ig-15', name: 'Silken Tofu', type: 'ingredient', rarity: 'common', basePrice: 5, defaultUses: '∞', icon: '🧊', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true } },

  { id: 'ig-16', name: 'Scallions', type: 'ingredient', rarity: 'common', basePrice: 3, defaultUses: '∞', icon: '🧅', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true, isAllium: true } },
  { id: 'ig-17', name: 'Garlic', type: 'ingredient', rarity: 'common', basePrice: 3, defaultUses: '∞', icon: '🧄', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true, isAllium: true } },
  { id: 'ig-18', name: 'Bean Sprouts', type: 'ingredient', rarity: 'common', basePrice: 3, defaultUses: '∞', icon: '🌱', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true } },
  { id: 'ig-19', name: 'Chinese Chives (Ku Chai)', type: 'ingredient', rarity: 'common', basePrice: 4, defaultUses: '∞', icon: '🌿', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true, isAllium: true } },
  { id: 'ig-20', name: 'Pork Lard', type: 'ingredient', rarity: 'legendary', basePrice: 12, defaultUses: 1, icon: '🧈', traits: { ...baseTraits, isMeat: true, isPork: true } },
  { id: 'ig-21', name: 'Kai Lan (Chinese Broccoli)', type: 'ingredient', rarity: 'common', basePrice: 4, defaultUses: '∞', icon: '🥬', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true } },

  // --- SPICES (10 Total, All Infinite Uses) ---
  { id: 'sp-1', name: 'Peanut Oil', type: 'spice', rarity: 'common', basePrice: 4, defaultUses: '∞', icon: '🧴', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true } },
  { id: 'sp-2', name: 'Light Soy Sauce', type: 'spice', rarity: 'common', basePrice: 5, defaultUses: '∞', icon: '🥣', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true, isGluten: true } },
  { id: 'sp-3', name: 'Dark Soy Sauce', type: 'spice', rarity: 'common', basePrice: 6, defaultUses: '∞', icon: '🍯', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true, isGluten: true } },
  { id: 'sp-4', name: 'White Pepper', type: 'spice', rarity: 'common', basePrice: 5, defaultUses: '∞', icon: '🧂', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true } },
  { id: 'sp-5', name: 'Sesame Oil', type: 'spice', rarity: 'common', basePrice: 6, defaultUses: '∞', icon: '🛢️', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true } },
  { id: 'sp-6', name: 'Shaoxing Wine', type: 'spice', rarity: 'rare', basePrice: 15, defaultUses: '∞', icon: '🍶', traits: { ...baseTraits, isVegetarian: true, isVegan: true } }, // Halal is false
  { id: 'sp-7', name: 'Oyster Sauce', type: 'spice', rarity: 'rare', basePrice: 12, defaultUses: '∞', icon: '🦪', traits: { ...baseTraits, isMeat: true, isSeafood: true, isHalal: true } },
  { id: 'sp-8', name: 'Chili Paste (Sambal)', type: 'spice', rarity: 'rare', basePrice: 10, defaultUses: '∞', icon: '🌶️', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true } },
  { id: 'sp-9', name: 'Shrimp Paste (Belacan)', type: 'spice', rarity: 'rare', basePrice: 14, defaultUses: '∞', icon: '🦐', traits: { ...baseTraits, isMeat: true, isSeafood: true, isCrustacean: true, isHalal: true } },
  { id: 'sp-10', name: 'Pure MSG', type: 'spice', rarity: 'legendary', basePrice: 30, defaultUses: '∞', icon: '✨', traits: { ...baseTraits, isVegetarian: true, isVegan: true, isHalal: true } }
];