# Deterministic feedback and validation

Add the smallest useful harness after a working tick loop exists. Do not install a new test stack if the host already supplies one.

## Development bridge

Proposed API, to implement in milestone 2:

```ts
window.__TRAFFIC_DEBUG__ = {
  loadScenario(name, seed = 12345), // reset complete state; return paused and ready
  pause(),
  resume(),
  step(ticks = 1),                // paused only, integer fixed ticks
  command(command),              // queue through the real command path
  snapshot(),                    // detached serializable state, never live mutable references
  metrics(),                     // real measured runtime values
};
```

This is an API contract, not existing executable code. Use typed concrete commands and a bounded positive tick count. `step` should synchronously advance simulation and produce a render of the final state. Loading a scenario resets command queues, clocks, PRNG state, metrics and effects. Make readiness explicit for browser automation; avoid arbitrary sleeps.

Register only in development builds, using the installed toolchain's supported environment replacement / dev guard and a development-only import boundary. Remove the property on route destruction. Verify the production build exposes no bridge or scenario entry point; do not rely on a query parameter as the sole guard.

## Scenarios

| Name | Deterministic state | Inspect |
| --- | --- | --- |
| `calm` | Balanced modest demand | Baseline map and HUD |
| `rush-hour` | Heavy EW demand, moderate NS | Directional bottleneck is apparent |
| `near-gridlock` | Heat 90 with aged queues/backlog | Cause and recovery are visible |
| `upgrade-choice` | Paused intermission, three eligible cards | Keyboard selection, long descriptions |
| `results` | Finished run | Cause of loss or victory, replay seed |

Implement scenarios only as their mechanics exist. Fixtures may initialize valid state directly; subsequent changes run through production rules. Keep cosmetic time/seed fixed for screenshots.

## Meaningful rule checks

- Same seed, initial state and tick-stamped commands produce the same game snapshot after a fixed tick count.
- Conflicting traffic cannot enter an occupied junction. Repeated switching cannot skip clearance or minimum green.
- Created demand equals queued external + active vehicles + completed trips; no silent loss at capacity limits.
- A completed vehicle earns once. Unaffordable/capped purchases cannot change either credits or effects.
- Paused/intermission/results states generate no demand or income.
- Heat remains bounded; defeat wins precedence over simultaneous wave completion.
- A draft has distinct eligible cards; replaying it with the same RNG state produces the same offer.

## Browser checks

Use installed browser automation (Playwright if available) to navigate through the real lazy route, wait for debug readiness, load a scenario, step exact ticks and inspect state plus screenshot. Never substitute mock rules for the game under test.

For UI work, capture only affected scenes/viewports. For runtime changes, check leaving and re-entering the route twice, tab hiding and resume, resizing, and keyboard scope. Confirm the personal-site home still loads and the game does not leave listeners, audio or a loop behind.

## Performance

Measure before optimizing. Initial target: 60 FPS during ordinary play on the developer's desktop; this is a target, not a verified claim. Record browser, viewport, DPR, active vehicle count, seed and build mode. Measure simulation and render CPU time separately; a requestAnimationFrame interval is not CPU cost.

Provide FPS, p95 simulation/render duration over a bounded rolling sample, active/backlog counts and dropped catch-up time. Do not hard-fail shared CI on a single noisy FPS sample. Regressions should be reproducible under the same workload.

## Finish criteria

Run focused rule tests for rule changes. Run a production build for route/dependency/config changes and milestone completion. Check console errors in the browser. Summarize actual checks and any unavailable tooling; a successful build alone does not verify appearance or game balance.
