# Architecture and integration

## Boundaries

Keep the game under `src/app/traffic`. The host router is the necessary integration exception; add a lazy route following the site's existing conventions. Add a navigation entry only where the site already lists games. Preserve the site's base href, hash/path routing strategy and deployment behavior.

Suggested files, created as needed:

| File | Responsibility |
| --- | --- |
| `traffic.ts`, `traffic.html`, `traffic.scss` | Route component, controls, HUD and local styles; adapt naming to the repo |
| `simulation.ts` | Concrete state/command types, creation, tick update, purchases and phase transitions |
| `runtime.ts` | Clock, queued commands, pause, lifecycle and HUD publication |
| `renderer.ts` | Canvas drawing and visual interpolation |
| `balance.ts` | Current tunable values, added when constants warrant separation |
| `traffic-tokens.scss` | Host-scoped visual tokens |
| `dev/scenarios.ts`, `dev/debug.ts` | Development fixtures and debug bridge, added in milestone 2 |

Do not generate empty folders or one class per entity. A type describing real state is useful; a service interface with one interchangeable implementation is usually unnecessary here.

## Deterministic simulation

Use a concrete `createRun(seed)` and `step(state, commands)` API. A mutable state owned by one runtime is acceptable; immutable copies of every vehicle every tick are unnecessary. Rules must be independently runnable without Angular, DOM, storage or audio.

Use integer ticks at 30 Hz initially. Schedule commands at tick boundaries, keep stable IDs and processing order, and record seed plus ordered commands for replay. Reproducibility is for the same game/balance version; do not claim cross-version replay compatibility.

Store gameplay PRNG state inside the run. Never call `Math.random()`, `Date.now()` or browser APIs from simulation rules. Cosmetic randomness must not advance the gameplay stream. An eventual save must preserve RNG state, counters and pending schedules, not just the original seed.

Suggested update order: accept valid commands → advance phase/clearance → generate arrivals → advance cars and queue admission deterministically → complete trips/award credits → update delay/heat → resolve defeat → resolve wave boundary. Document any change that affects replay.

Use a no-overlap queue model with bounded discharge headway. Visual spacing must follow simulation occupancy. All-red is a minimum duration plus a clear-junction check, not permission to erase crossing cars. Capacity limits move demand into backlog, never into oblivion. Aggregate backlog if needed, preserving counts and arrival ages required by rules.

## Runtime and Angular

Use requestAnimationFrame to accumulate elapsed time and advance fixed steps. Interpolate rendering if useful. Limit steps per render (start at 5) to avoid a spiral; discard excessive wall-time debt rather than changing tick duration. Report overload in development metrics. Deterministic stepping bypasses wall time entirely.

Pause on tab hide and reset the wall-time baseline/accumulator on resume. Resume manually from an explicit pause affordance. There is no offline progression in this proposal. Avoid background timers keeping the game alive after navigation.

Use signals/computed for the small Angular view model: phase, score, credits, heat, wave, selected control, available upgrades. Publish changed HUD data at roughly 10 Hz and immediately for user actions/phase changes. Canvas reads current simulation state directly; never create a signal per vehicle coordinate.

Use supported standalone/component patterns in the installed Angular version. Prefer template control flow, typed input/output APIs where needed and OnPush for game components. If the site still uses Zone.js, schedule the continuous loop outside Angular and deliberately bridge HUD updates back; do not convert the entire site to zoneless.

Route/component lifecycle owns the runtime. Dispose RAF, subscriptions, ResizeObserver, visibility/key/pointer listeners, audio and debug registration on destroy. Leaving and returning must create exactly one loop. Browser initialization must occur only in the browser if the site prerenders or uses SSR.

## Styling, input and assets

Apply tokens on the game host, not `:root`. Keep styles encapsulated. Import the token partial once in the route stylesheet. Do not import the game into a global SCSS bundle.

Size the canvas from its actual container; scale backing pixels for devicePixelRatio, capped at 2 initially. Convert pointer positions using its bounding rectangle. A resize must not change game-world coordinates or outcomes.

Use native DOM controls for gameplay commands. Scope hotkeys to the focused game and ignore text inputs; do not hijack site-wide shortcuts. Provide focus styles and visible shortcut hints. Audio begins after user interaction and obeys mute.

The initial game needs no external art. Later assets should use the existing site's supported asset pipeline and a game-specific namespace; do not alter angular.json solely to force assets physically into this folder.

## Persistence and dependencies

Delay persistence until the core loop works. If added, use a versioned `traffic:` storage key, validate loaded data and recover gracefully from missing/corrupt storage. Never clear other site data.

Reuse installed testing/build tools. Add a dependency only for a concrete missing capability. Canvas 2D and ordinary TypeScript are sufficient for the first intersection; no ECS, generic scene engine, global event bus or cross-game abstraction is required.
