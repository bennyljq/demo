# 👨‍🍳 SHEF: Game Design Document (v0.1.0)

## 1. Project Overview & Architecture

*Shef* is a mobile-first, web-native culinary roguelike puzzle game. It marries the tight, mathematical "numbers-go-up" satisfaction of combinatorial puzzle-solving with the creative alchemy of cooking.

* **Platform & Tech Stack:** Pure Angular 22 (strictly serverless). The application will be designed mobile-first, utilizing CSS Grid/Flexbox for responsive browser-based playability.
* **State Management & Architecture:** Play state will be preserved via `localStorage` or cookies. The architecture will be spearheaded by Benny Lim, leveraging expertise in building high-fidelity, production-grade applications. Future scope includes wrapping the application in Electron for a Steam release, but the MVP remains strictly web-native.


* **The Hook:** Players act as chefs trying to elevate their dining establishment from a lowly street hawker to a prestigious 3-Star restaurant by satisfying customers' "Tasty-Meters" through calculated recipe combinations.

---

## 2. Entities & The Starting Chefs

Players begin a run by selecting a Chef archetype. Each Chef starts with signature cookware and a preset pantry of ingredients.

* **Mathew Wok:** Hong Kong *da pai dang* extraordinaire. Starts with a Wok and preset ingredients (e.g., Rice, Egg, Pork, Scallions).


* **Balaji Krishnan:** Indian food master.


* **Roberto Carlost:** Mexican culinary expert.



---

## 3. The Core Gameplay Loop

The game relies on an infinite-pantry system rather than deck-building or random card draws.

### Phase 1: The Market

* Using run-currency earned from customers, players purchase ingredients and spices.
* The market selection is highly cultural and randomized by rarity/price.
* **Infinite Use:** Once an ingredient, spice, or cookware is purchased and added to the pantry, it has unlimited uses for the remainder of the run.

### Phase 2: The Kitchen (Service)

Players review a customer's specific dietary restrictions and their target score (the "Tasty-Meter").

* **Selection:** The player selects any number of ingredients from their pantry, alongside a specific Cookware item (e.g., a Wok) and any optional spices.
* **Validation:** A hidden recipe matrix validates the combination.
* **Flexible Recipe Engine:** The game allows for a ±1 ingredient leeway.
* *Exact Match:* [Rice, Egg, Pork, Scallions, Shrimp, Carrots, Wok] = "Yang Zhou Fried Rice".
* *Missing Item:* [Rice, Egg, Pork, Scallions, Shrimp, Wok] = "Yang Zhou Fried Rice with no Carrots" (Minor Base Score deduction).
* *Extra Item:* [Rice, Egg, Pork, Scallions, Shrimp, Carrots, Potato, Wok] = "Yang Zhou Fried Rice with Potatoes" (Minor Base Score deduction).


* **Cookware Dependency:** A recipe will not register if the incorrect foundational cookware is used (e.g., making Yang Zhou Fried Rice in a stockpot).

---

## 4. Scoring System: Base x Multiplier

Scoring dictates whether a dish satisfies the customer's Tasty-Meter and determines the monetary payout.

| Scoring Element | Mechanic & Impact |
| --- | --- |
| **Base Score** | Derived directly from the recognized Recipe. "Yang Zhou Fried Rice" might base at 100. Chaotic, unrecognized combinations result in "Goop" (Base Score: 1). |
| **Multiplier (Spices)** | Correct cultural spice pairings (e.g., Shaoxing wine, Sesame oil) boost the multiplier. Incorrect pairings (e.g., adding heavy sugar to a savory dish) apply negative multipliers based on their severity. |
| **Multiplier (Mastery)** | Meta-game progression. Leveling up Cookware or Recipe mastery provides permanent flat boosts. |
| **Repetition Penalty** | Because the pantry is infinite, repeating any recipe during a run incurs an exponentially stacking negative multiplier to force variety. |

---

## 5. Acts & Run Progression

A complete run scales linearly across 5 restaurant tiers: **Small Hawker/Food Truck ➔ Bib Gourmand ➔ 1-Star ➔ 2-Star ➔ 3-Star (Win).**

### The Service Circuit

* Each tier consists of serving 3 normal customers followed by 1 Boss (Food Critic).
* Progressing to a new tier scales up the Tasty-Meter requirements, dish price multipliers, and the rarity of the market pool.

### Rewards

* **Post-Customer (Normal):** In addition to monetary payment based on the score, players are presented with a mandatory draft of 3 choices (e.g., a rare ingredient, a potent spice, or a single-use prep tool).
* **Post-Boss (Critic):** Defeating a Food Critic drops run-altering **Cookware**. These are rare, powerful items that fundamentally alter scoring or gameplay mechanics (e.g., a Cast Iron Skillet that retains a multiplier, or a Bamboo Steamer).

---

## 6. Metagame & The Codex

The Codex exists outside of individual runs and serves as the primary meta-progression and cultural pillar of the game.

* **Discovery Unlocks:** Discovered ingredients, spices, cookware, and recipes are permanently logged here.
* **Mastery System:** Cooking a specific recipe multiple times across runs increases its ingredient mastery, permanently boosting its Base Score for future runs.
* **Real-World Utility:** The Codex features functional, real-world recipe instructions and highlights the cultural lore of the dishes.