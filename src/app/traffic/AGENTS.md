# Traffic prototype

Scope: `src/app/traffic/`. Working title: Greenwave. Explicit user direction overrides the proposed design in these documents.

- Angular owns the route, controls, menus and HUD. Plain TypeScript owns simulation, rules and seeded randomness. Canvas 2D owns the traffic map.
- Keep the first implementation small: one route component, a concrete runtime, simulation functions and a renderer. Split further only when responsibilities justify it.
- Use component/route-scoped ownership for mutable game state, not application-wide singleton state.
- Keep per-vehicle and per-frame state outside Angular signals. Publish a compact HUD snapshot on meaningful changes or a bounded cadence.
- Reuse the installed Angular version's supported patterns. Do not migrate the host application's change detection or dependencies as part of this game.
- Simulation runs in fixed ticks; wall time and rendering never determine outcomes. All gameplay randomness is seeded and distinct from cosmetic randomness.
- Dispose animation frames, observers, listeners, audio and debug globals on route exit. Pause on hidden tabs; do not simulate a catch-up windfall.
- Use `--traffic-*` tokens on the game host. Avoid global selectors, `::ng-deep` and generic admin-dashboard styling.
- Keep browser debug controls development-only. Automated scenarios must exercise real game rules.
- Implement one requested milestone at a time. Do not scaffold later systems, ECS, event buses, plugin registries or generic upgrade engines.

Read only the document needed for the current task, relative to this folder:

| Task | Read |
| --- | --- |
| Mechanics, economy, upgrades | `docs/GAME-DESIGN.md` |
| Runtime, simulation, integration | `docs/ARCHITECTURE.md` |
| Layout, styling, feedback | `docs/VISUAL-DIRECTION.md` |
| Debugging, deterministic scenes, validation | `docs/VALIDATION.md` |
| Implementing the next stage | Relevant milestone in `docs/BUILD-PLAN.md` |

Update only documentation whose contract changed. Keep these instructions short.
