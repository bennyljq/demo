
---

# 👨‍🍳 SHEF: Game Design Document (MVP)

## 1. Project Overview & Elevator Pitch

**The Pitch:** *Shef* is a mobile-first, web-native culinary roguelike deck-builder. It marries the tight, mathematical "numbers-go-up" satisfaction of *Balatro* with the creative, combinatorial alchemy of cooking.
**The Hook:** You are a Culinary Alchemist operating a ghost kitchen in a liminal space, serving the "Great Critics" (primal entities of taste). In this game, cards are not static—ingredients age, dishes evolve into higher tiers, and pans retain the lingering aroma of your previous actions.

## 2. Core Game Loop: Prep, Sear, Decay

The game abandons traditional Poker hands in favor of a **Discovery-Driven Evolution** system.

### A. The Pantry (Deck Management & Input Randomness)

* **The Deck:** Players build a deck exclusively out of *Ingredients* (e.g., Wagyu Beef, Jasmine Rice, Saffron).
* **The Decay Mechanic (Time as a Resource):** Ingredients are "alive." They possess a "Freshness" counter. As rounds progress, ingredients decay. A rotting tomato loses its "Sweetness" but gains "Acidity," transforming its strategic value. Players can purchase "Stasis" items (like a Fridge) to freeze the decay of high-tier ingredients.
* **The Spice Rack (Modifiers):** Players use "Infusions" and "Marinades" to alter ingredients in their hand, increasing their value over time.

### B. The Service (Active Gameplay & Deterministic Output)

* **The Equipment (Multiplier):** Before playing a hand, the player selects an equipment slot (e.g., Wok, Skillet, Clay Tandoor). This dictates the base multiplier and the cooking technique.
* **The Hand (Combinatorial Evolution):** Players play up to 5 ingredients into the equipment. The game checks a vast **Recipe Database**.
* *Tier 0:* Raw ingredients score their base nutritional value.
* *Tier 1 (Single Process):* Playing an Egg into a Frying Pan yields a "Fried Egg."
* *Tier 2 (Complex combinations):* Playing Rice + MSG + Egg into a Wok yields "Egg Fried Rice," multiplying the score drastically.
* *Tier 3 (Grand Service):* Combining Tier 1 and Tier 2 outputs to create massive, screen-clearing combos (e.g., The Full English Breakfast).


* **The Lingering Aroma (Momentum Engine):** The pan does not reset cleanly after a hand. A fatty dish leaves the pan "Greasy," granting a specific multiplier or trait to the *next* hand played in that same pan. Players must sequence their dishes strategically.

### C. The Critics (Boss Blinds)

Instead of standard debuffs, Bosses are **Food Critics** with specific palates and "Satiety Meters." The Health Inspector might ban high-sodium items, while the Salt King demands a massive sodium output, forcing the player to pivot their build or neutralize flavors (e.g., using Acidity to balance Fat).

## 3. Entities & Game Economy

### A. Ingredients (The Cards)

Every ingredient is meticulously statted to mimic real-world nutritional data, which acts as the game's scoring foundation:

* **Base Stats:** Calories (Chips), Protein, Fat, Carbs, Sodium, Sugar.
* **Heat Level:** A 0-5 scale representing spice, visualized on the card by dancing 🌶 emojis.
* **Flavor Profile:** Tags (e.g., *#umami*, *#acidic*) that synergize with specific Critics or Jokers.
* **Rarity & Pricing:** From Common (Egg) to Legendary (Wagyu, Black Truffle).

### B. Kitchen Assistants & Condiments (The Jokers)

These represent the passive, rule-breaking power-ups:

* **Condiments:** e.g., *Sriracha* (Multiplies score if the dish has a Heat Level of 3+).
* **Kitchen Staff:** e.g., *The Sous Chef* (Adds a flat score bonus to all "Fried" items), or *The Dishwasher* (Grants economy/money for every empty slot left in the Pan).

### C. The Chef Profiles (Starting Archetypes)

Players select a Chef to begin their run, dictating their starting deck and passive abilities:

* **Matthew Wok:** Starts with Rice, MSG, and a Carbon Steel Wok. Passive bonus to Stir-fry dishes.
* **Sosig Ramsay:** Starts with high-protein items and a Heavy Skillet.
* **Balaji Krishnan:** Starts with legumes, heavy spices, and a Clay Tandoor. Spices trigger double heat effects.
* **Roberto Carlost:** Starts with a Flat Top Grill and Corn Tortillas. High heat builds a "Char" multiplier.

## 4. The Codex (Meta-Progression & Cultural Pillar)

The Codex is the soul of the game's long-term retention.

* **Discovery Unlocks:** Undiscovered recipes and legendary ingredients appear as locked cards with a crosshatch back and a padlock seal. Finding a new combo during a run triggers a high-fidelity "Discovery" animation and unlocks the item.
* **Real-world Utility:** Flipped cards feature a realistic "Nutrition Facts" label showing serving sizes (in grams), macros, and heat levels. Discovered recipes reveal real-world cooking instructions and cultural lore.

## 5. Technical Architecture & Visual Identity

### A. Tech Stack (The Angular 21 Mandate)

* **Framework:** Angular 21 (Strictly Zoneless).
* **State Management:** Fully reactive using Signals (`signal`, `computed`, `effect`). No `ChangeDetectorRef`.
* **Platform:** Device-agnostic Web App (PWA) configured for mobile "Add to Home Screen."

### B. Visuals & "The Juice"

* **Crisp Vector Scaling:** The UI utilizes `em` unit scaling for card sizes, ensuring vector-perfect crispness across all mobile DPIs without relying on blurry `transform: scale()` hacks.
* **CSS 3D Physics:** True 3D transforms (`rotateY`) for flipping cards to reveal the Nutrition Facts labels, complete with floating drop-shadows and idle breathing animations.
* **Sensory Feedback:** Tap-highlighting is disabled globally for a native app feel. Cooking triggers visceral feedback—glowing copper pans, sizzling audio, and vapor clouds that spell out massive multiplicative score numbers.

## 6. Lead Architect & Creator Context

To understand the engineering pedigree driving this architecture, refer to the document named Benny's Resume - February 2026.pdf. The creator and Lead Architect of *Shef*, Benny Lim, brings extensive experience in building high-fidelity, production-grade applications. The tech stack (TypeScript 5, Angular 21, SCSS) aligns perfectly with Benny's expertise. Previous roles include serving as a Member of Technical Staff at Salesforce and a Principal Developer for UI/UX at DBS Bank, demonstrating the capability to deliver premium, enterprise-grade user interfaces and seamless prototypes required for a responsive web-native game like *Shef*.

Archived instructions:
System Instructions: Shef MVP Architect (Angular 21)
1. Role & Persona
You are a Lead Software Engineer and Game Systems Designer specializing in high-performance web applications. Your goal is to help build Shef—a roguelike culinary deck-builder—as a sleek, responsive Angular 21 web app. You prioritize rapid prototyping, clean component architecture, and immediate browser-based playability.

2. Core Game Concept: "Shef"
The Pitch: A "Balatro-style" roguelike where food is the medium.
The Loop: * Cards: Raw ingredients (e.g., Avocado, Tortilla, Lime).
Hands: Players "play" a recipe (e.g., Guacamole).
The Goal: Hit "Flavor Targets" (points) to progress through increasingly difficult "Dining Services."
Power-ups: "Kitchen Gadgets" (Passive buffs) and "Seasonings" (Consumable modifiers).
3. Technical Mandate (Angular 21)
The project is strictly a Web MVP. Do not suggest Electron, Capacitor, or native mobile wrappers. Focus on:

State Management: Use Signals or RxJS for the complex reactive states of a card game (hand management, scoring triggers, and animations).
Responsive Design: Ensure the UI is "Mobile-First" using CSS Grid/Flexbox so the game is fully playable on a smartphone browser without an app store.
Performance: Optimize for low latency and smooth CSS transitions/animations to mimic a native game feel.
Persistence: Utilize localStorage or IndexedDB for saving runs and unlocking Codex entries.
4. The "Codex" & Cultural Pillar
Integrated Learning: The game must feature a "Codex" that tracks discovered recipes.
Real-World Utility: Each entry displays a functional, real-world recipe and its cultural lore/history.
Data Structure: Design the recipe data models in TypeScript to include flavorScore, culturalOrigin, realWorldInstructions, and lore.
5. Key LLM Tasks
Code Generation: Provide Angular components for the "Prep Table" (the play area) and the "Pantry" (the deck).
Scoring Engine: Develop the TypeScript logic to check if the current 5-card hand matches a known recipe in the JSON database.
Ideation: Design "Kitchen Gadgets" that synergize with specific cuisines (e.g., a "Wok" gadget that doubles scores for Stir-fry recipes).
Monetization Logic (Web): Explore web-native options like "Buy Me a Coffee" integration, a simple Stripe-gated "Pro" version, or unobtrusive ad-placements for the web build.
6. Communication Style
Developer-to-Developer: Use technical language suited for an Angular 21 expert.
Lean & Mean: Focus on getting a playable "Vertical Slice" (one full round) finished before expanding content.