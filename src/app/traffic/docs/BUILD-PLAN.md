# Incremental build plan

Implement only the milestone requested. These are target outcomes, not completed work. Keep each milestone independently playable. After each, record a short status below with checks and unresolved issues; avoid a growing diary.

## 1 — Prove the intersection

Inspect the existing router, package scripts, Angular version and nearby component conventions. Add one lazy `traffic` route, local game shell and Canvas 2D board. Implement the tick loop, straight-through cars, seeded arrivals, safe two-phase switching, pause/restart, score, credits and one paid headway upgrade. Use the scoped tokens immediately.

Acceptance: earn credits by clearing cars, buy an upgrade and visibly improve discharge. Phase changes respect clearance. Home → game → home → game works with one loop and no global style leak. Test safety and reward/purchase invariants; build once at completion. No roguelike draft, persistence or multi-junction map yet.

## 2 — Make it inspectable and loseable

Add wait/backlog accounting, heat and defeat, plus the development bridge and `calm`, `rush-hour`, `near-gridlock`, `results` scenarios. Add deterministic replay checks and measured timing counters.

Acceptance: explain why a run failed; reproduce its state from seed and commands; capture actual desktop/narrow screenshots; debug registration disappears on exit and is absent in production.

## 3 — Complete a short roguelike run

Add six waves, intermission preview, three-card drafts, explicit modifier effects, victory and seeded retry. Add the `upgrade-choice` scenario. Tune the first three waves before extending content.

Acceptance: finish a full run, lose one, retry the same seed, and compare at least two meaningfully different upgrade strategies. Spending, draft eligibility, wave transitions and replay pass focused checks.

## 4 — Polish the playable loop

Refine signal feel, car platoons, congestion legibility, sound/mute, transitions and results. Add the minimum help text needed for a new player. Check reduced motion, keyboard, pointer, touch targets and cleanup. Optimize only measured bottlenecks.

Acceptance: new player understands controls and one loss unaided; visual scenes have been inspected; normal play meets the measured desktop performance target or the limitation is documented.

## 5 — Expand only after playtesting

Choose one extension based on evidence: second connected junction, constrained lane projects, alternate starting kits or demand events. Add persistence only if replay/unlocks need it. Avoid implementing all extensions at once.

## Current status

- Completed: milestone 1. The lazy route has a seeded, fixed-tick four-way intersection, safe two-phase switching, pause/restart, exit rewards and a paid headway upgrade.
- Checks: traffic-only Karma safety/economy tests pass (3); production build passes and emits a separate traffic chunk. Desktop and narrow Chrome screenshots were inspected.
- Remaining: Chrome's command-line narrow screenshot crops its minimum layout viewport, so an emulated 390px interaction check remains. Later milestones add pressure, failure and waves.
