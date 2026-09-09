import { ItemRarity } from './master-items';

export interface RecipeDefinition {
  id: string;
  name: string;
  rarity: ItemRarity;
  image: string;
  baseScore: number;
  essentialCookwareIds: string[];
  essentialIngredientIds: string[];
  culturalSpiceIds: string[];
  lore: string;
}

export const MASTER_RECIPES: RecipeDefinition[] = [
  {
    id: 'rcp-1',
    name: 'Yang Zhou Fried Rice',
    rarity: 'legendary',
    image: 'assets/shef/pictures/yang-zhou-fried-rice.jpg',
    baseScore: 110,
    essentialCookwareIds: ['cw-1'], // Wok
    essentialIngredientIds: ['ig-1', 'ig-6', 'ig-10', 'ig-11', 'ig-16'], // Rice, Egg, Char Siu, Shrimp, Scallions
    culturalSpiceIds: ['sp-1', 'sp-2', 'sp-4'], // Peanut Oil, Light Soy, White Pepper
    lore: 'A gold standard of wok mastery. Day-old rice separated perfectly by blazing heat.'
  },
  {
    id: 'rcp-2',
    name: 'Authentic Char Kway Teow',
    rarity: 'common',
    image: 'assets/shef/pictures/char-kway-teow.jpg',
    baseScore: 160,
    essentialCookwareIds: ['cw-1'], // Wok
    essentialIngredientIds: ['ig-2', 'ig-6', 'ig-9', 'ig-12', 'ig-18', 'ig-19', 'ig-20'], // Kway Teow, Egg, Lup Cheong, Cockles, Bean Sprouts, Chives, Pork Lard
    culturalSpiceIds: ['sp-2', 'sp-3', 'sp-8', 'sp-9'], // Light Soy, Dark Soy, Chili Paste, Belacan
    lore: 'A fiercely charred masterpiece. The pork lard and blood cockles are absolutely non-negotiable.'
  },
  {
    id: 'rcp-3',
    name: 'Har Gow (Shrimp Dumplings)',
    rarity: 'common',
    image: 'assets/shef/pictures/har-gow.jpg',
    baseScore: 130,
    essentialCookwareIds: ['cw-1', 'cw-2'], // Wok + Bamboo Steamer
    essentialIngredientIds: ['ig-5', 'ig-11', 'ig-20'], // Crystal Skin, Shrimp, Pork Lard (for interior juiciness)
    culturalSpiceIds: ['sp-4', 'sp-5'], // White Pepper, Sesame Oil
    lore: 'The true test of a Dim Sum master. Translucent skin wrapping sweet, snapping shrimp.'
  },
  {
    id: 'rcp-4',
    name: 'Singapore Chili Crab',
    rarity: 'legendary',
    image: 'assets/shef/pictures/chili-crab.jpg',
    baseScore: 180,
    essentialCookwareIds: ['cw-1'], // Wok
    essentialIngredientIds: ['ig-6', 'ig-14', 'ig-16', 'ig-17'], // Egg, Mud Crab, Scallions, Garlic
    culturalSpiceIds: ['sp-1', 'sp-8', 'sp-9'], // Peanut Oil, Chili Paste, Belacan
    lore: 'Sweet, savory, and aggressively spicy. The egg ribbons thicken the glorious sauce.'
  },
  {
    id: 'rcp-5',
    name: 'Dry Beef Hor Fun',
    rarity: 'rare',
    image: 'assets/shef/pictures/beef-hor-fun.jpg',
    baseScore: 150,
    essentialCookwareIds: ['cw-1'], // Wok
    essentialIngredientIds: ['ig-2', 'ig-13', 'ig-16', 'ig-18'], // Kway Teow, Wagyu Beef, Scallions, Bean Sprouts
    culturalSpiceIds: ['sp-1', 'sp-2', 'sp-3', 'sp-7'], // Peanut Oil, Light Soy, Dark Soy, Oyster Sauce
    lore: 'Wok hei infused into rich, melting fat and charred rice noodles.'
  },
  {
    id: 'rcp-6',
    name: 'Siu Mai (Pork & Shrimp Dumplings)',
    rarity: 'common',
    image: 'assets/shef/pictures/siu-mai.jpg',
    baseScore: 120,
    essentialCookwareIds: ['cw-1', 'cw-2'], // Wok + Steamer
    essentialIngredientIds: ['ig-4', 'ig-7', 'ig-11'], // Wonton Wrapper, Minced Pork, Shrimp
    culturalSpiceIds: ['sp-4', 'sp-5', 'sp-6'], // White Pepper, Sesame Oil, Shaoxing Wine
    lore: 'Dense, porky, and satisfyingly rich. A staple of morning pushcarts.'
  },
  {
    id: 'rcp-7',
    name: 'Wonton Noodle Soup',
    rarity: 'common',
    image: 'assets/shef/pictures/wonton-noodles.jpg',
    baseScore: 95,
    essentialCookwareIds: ['cw-1'], // Wok (used to boil)
    essentialIngredientIds: ['ig-3', 'ig-4', 'ig-7', 'ig-10', 'ig-16', 'ig-21'], // Egg Noodle, Wonton Wrapper, Minced Pork, Char Siu, Scallions, Kai Lan
    culturalSpiceIds: ['sp-2', 'sp-5', 'sp-4'], // Light Soy, Sesame Oil, White Pepper
    lore: 'Springy alkaline noodles, delicate pork clouds, sweet roasted meat, and crisp greens.'
  },
  {
    id: 'rcp-8',
    name: 'Fried Hokkien Mee',
    rarity: 'rare',
    image: 'assets/shef/pictures/hokkien-mee.jpg',
    baseScore: 115,
    essentialCookwareIds: ['cw-1'], // Wok
    essentialIngredientIds: ['ig-3', 'ig-6', 'ig-8', 'ig-11', 'ig-19', 'ig-20'], // Egg Noodle, Egg, Pork Belly, Shrimp, Chives, Pork Lard
    culturalSpiceIds: ['sp-1', 'sp-2', 'sp-9'], // Peanut Oil, Light Soy, Belacan (served alongside)
    lore: 'Noodles braised in a rich seafood stock, topped with crispy lard croutons.'
  },
  {
    id: 'rcp-9',
    name: 'Mapo Tofu',
    rarity: 'rare',
    image: 'assets/shef/pictures/mapo-tofu.webp',
    baseScore: 90,
    essentialCookwareIds: ['cw-1'], // Wok
    essentialIngredientIds: ['ig-7', 'ig-15', 'ig-16', 'ig-17'], // Minced Pork, Silken Tofu, Scallions, Garlic
    culturalSpiceIds: ['sp-1', 'sp-2', 'sp-8', 'sp-10'], // Peanut Oil, Light Soy, Chili Paste, MSG
    lore: 'Fiercely aromatic and aggressively spicy. A triumph of textural contrast.'
  },
  {
    id: 'rcp-10',
    name: 'Pan-Seared Wagyu',
    rarity: 'legendary',
    image: 'assets/shef/pictures/pan-seared-wagyu.webp',
    baseScore: 140,
    essentialCookwareIds: ['cw-3'], // Cast Iron Skillet
    essentialIngredientIds: ['ig-13', 'ig-17'], // Wagyu Beef, Garlic
    culturalSpiceIds: ['sp-1', 'sp-4', 'sp-10'], // Peanut Oil, White Pepper, MSG
    lore: 'Sometimes, perfection requires stepping out of the way and letting the ingredients speak.'
  }
];