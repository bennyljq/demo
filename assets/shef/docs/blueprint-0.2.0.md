# 👨‍🍳 SHEF: Game Design Document (v0.2.0)

## 1. Project Overview & Architecture

*Shef* is a mobile-first, web-native culinary roguelike puzzle game. It marries the tight, mathematical "numbers-go-up" satisfaction of combinatorial puzzle-solving with the creative alchemy of cooking.

* **Platform & Tech Stack:** Pure Angular 22 (strictly serverless). The application will be designed mobile-first, utilizing CSS Grid/Flexbox for responsive browser-based playability.


* **State Management & Architecture:** Play state will be preserved via localStorage or cookies. The architecture will be spearheaded by Benny Lim, leveraging expertise in building high-fidelity, production-grade applications. Future scope includes wrapping the application in Electron for a Steam release, but the MVP remains strictly web-native.


* **The Hook:** Players act as chefs trying to elevate their dining establishment from a lowly street hawker to a prestigious 3-Star restaurant by satisfying customers' "Tasty-Meters" through calculated recipe combinations.



---

## 2. Entities & The Starting Chefs

Players begin a run by selecting a Chef archetype. Each Chef starts with signature cookware and a preset pantry of ingredients.

* **Mathew Wok:** Hong Kong *da pai dang* extraordinaire. Starts with a Wok and preset ingredients (e.g., Rice, Egg, Pork, Scallions).


* **Balaji Krishnan:** Indian food master.


* **Roberto Carlost:** Mexican culinary expert.



---

## 3. The Core Gameplay Loop

The game relies on a dynamically constrained pantry system rather than deck-building or random card draws.

### Phase 1: Customer Reveal & Restrictions

* Before spending money at the market, the chef is presented with the next customer's dietary restrictions, preferences (e.g., Vegan, Halal, prefers beef, crustacean allergy), and their target score (the "Tasty-Meter").


* **The Reroll/Comp:** If a chef cannot accommodate a restrictive customer, they can pay a monetary compensation to turn them away and reroll the customer. The severity of restrictions naturally increases in later acts as the chef's pantry grows.

### Phase 2: The Market

* Using run-currency earned from customers, players purchase ingredients and spices. The market selection is highly cultural and randomized by rarity/price. Early on, markets are region-locked, with cross-cultural ingredients unlocking via meta-progression later.


* **Item Usage & Rarity Constraints:**
* **Common Ingredients:** Infinite uses.
* **Rare Ingredients:** 5 uses.
* **Legendary Ingredients:** 1 use.
* **Spices:** Infinite uses, regardless of their rarity.


* **Market Mechanics:** The chef can bribe the shopkeep to reroll the market to bring out rarer items (including Cookwares or Legendaries). To thin the market pool, the shopkeep occasionally sells discounted "Bundles" or "Kits" (e.g., a dumpling kit).

### Phase 3: The Kitchen (Service)

* **Selection:** In a single UI pass, the player selects any number of ingredients, any optional spices, and all intended Cookwares from their pantry.


* **Validation:** A hidden recipe matrix validates the combination.


* **Flexible Recipe Engine:** The game allows for a ±1 ingredient leeway.


* *Exact Match:* [Rice, Egg, Pork, Scallions, Shrimp, Carrots, Wok] = "Yang Zhou Fried Rice".


* *Missing Item:* [Rice, Egg, Pork, Scallions, Shrimp, Wok] = "Yang Zhou Fried Rice with no Carrots" (Minor Base Score deduction).


* *Extra Item:* [Rice, Egg, Pork, Scallions, Shrimp, Carrots, Potato, Wok] = "Yang Zhou Fried Rice with Potatoes" (Minor Base Score deduction).




* **Cookware Dependency & Leeway:** Recipes dictate *essential* and *non-essential* cookwares. For a steak, the cast-iron pan is essential, while an oven is non-essential. Missing a non-essential cookware results in a minor score deduction. Missing an essential cookware entirely fails the recipe.

---

## 4. Scoring System & Economics

Scoring dictates whether a dish satisfies the customer's Tasty-Meter and determines the monetary payout.

| Scoring Element | Mechanic & Impact |
| --- | --- |
| **Base Score** | Derived directly from the recognized Recipe. "Yang Zhou Fried Rice" might base at 100. Chaotic, unrecognized combinations result in "Goop" (Base Score: 1).
| **Multiplier (Spices)** | Correct cultural spice pairings (e.g., Shaoxing wine, Sesame oil) boost the multiplier. Incorrect pairings (e.g., adding heavy sugar to a savory dish) apply negative multipliers based on their severity.
| **Multiplier (Mastery)** | Meta-game progression. Leveling up Cookware or Recipe mastery provides permanent flat boosts.
| **Repetition Penalty** | Repeating any recipe during a run incurs an exponentially stacking negative multiplier to force variety.

### Failures & The Goop Economy

* **Resource Consumption:** Creating a "Goop" still consumes the use-counts of any Rare or Legendary ingredients used in the attempt.
* **Monetary Penalties:** If the final score misses the Tasty-Meter, the chef must comp the customer. This comp scales inversely with the score: a massive miss (like a Goop) requires a massive comp, while barely missing the target requires a smaller comp. There is no comping a critic (boss); run ends when Tasty-Meter fails on the critic. 
* **Loss of Income:** Failing the Tasty-Meter yields no customer payment, no tips, and no post-customer rewards.

---

## 5. Acts & Run Progression

A complete run scales linearly across 5 restaurant tiers: **Small Hawker/Food Truck ➔ Bib Gourmand ➔ 1-Star ➔ 2-Star ➔ 3-Star (Win)**.

### The Service Circuit

* Each tier consists of serving 3 normal customers followed by 1 Boss (Food Critic).


* Progressing to a new tier scales up the Tasty-Meter requirements, dish price multipliers, and the rarity of the market pool.



### Rewards

* **Post-Customer (Normal):** In addition to monetary payment based on the score, players are presented with a mandatory draft of 3 choices (e.g., an infinite common ingredient, a 5x Rare spice, or a 1x Legendary spice).
* **Post-Boss (Critic):** Boss rewards are divided into two distinct drafting phases:
1. **Phase 1 (Hardware):** Choose 1 of 3 Legendary Cookwares. These are rare, powerful items that fundamentally alter scoring or gameplay mechanics.


2. **Phase 2 (Pantry):** Choose 1 of 3 high-tier items (either an infinite-use Rare ingredient/spice OR a 3x use Legendary ingredient/spice).



---

## 6. Metagame & The Codex

The Codex exists outside of individual runs and serves as the primary meta-progression and cultural pillar of the game.

* **Discovery Unlocks:** Discovered ingredients, spices, cookware, and recipes are permanently logged here.


* **Mastery System:** Cooking a specific recipe multiple times across runs increases its ingredient mastery, permanently boosting its Base Score for future runs.


* **Starting Upgrades:** Meta-progression can eventually unlock the ability for a chef to begin a run with 2 cookwares.
* **Real-World Utility:** The Codex features functional, real-world recipe instructions and highlights the cultural lore of the dishes.



---

## 7. Future Expansions (Pipeline)

* **Cocktail Pairing (DLC Concept):** A parallel system introduced in later acts or as post-launch content, where chefs pair their dishes with crafted beverages, adding an additional layer of combinatorial scoring.
* **Goop Mastery:** With enough meta progression, the player may opt to increase the base score of Goop and even the effects of spice multipliers on Goop, making a pure Goop run possible. This is a troll build for sure.