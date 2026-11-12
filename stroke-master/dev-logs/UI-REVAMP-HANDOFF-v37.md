# UI revamp handoff after V37

Planner work is paused with V33 champion/default. V12 legacy, V17 and V31 remain available; no V36/V37 options. This is a brief handoff, not an implemented redesign or a new usability study.

The current studio has side-by-side reference/painting canvases, painting100%/fullscreen inspection, a dock with Paint / Surface & light / Replay / Export / Advanced tabs, and a persistent Paint/Pause/Continue/Cancel status bar. Target circles/Undo, priority marks and next-paint brush/body settings already exist. Source-free imported paintings support replay/export, while live generated paintings retain optimiser state for Continue and targeted refinement. Existing tests cover those distinctions.

Priorities grounded in these current controls:

- Make active painting identity/state and next-paint settings easier to distinguish. Selector changes currently affect the next Paint while Continue/targeting retain the live session. Preserve that behavior and improve its visibility.
- Put the common import → paint → inspect → refine → export path ahead of dense evaluation settings. Budgets, search depth, quality, seed, quiet body and brush enablement are presently spread across Paint/Advanced controls; keep advanced access without requiring a redesign of planning policy.
- Make pigment versus surface/light inspection clearer. Human judgments separate natural pigment marks from lighting relief, while the current lighting controls live in their own tab. A future UI should help compare those appearances without changing deposits.
- Explain why actions are unavailable for imported replay documents, busy sessions or target selections. Preserve lifecycle gating, cancellation and stale-worker protections rather than moving buttons without their state rules.
- Keep planning resolution, stroke-rendered export, smooth bitmap enlargement and displayed-frame export understandable. Existing labels describe the differences; review discoverability and ensure both PNG actions continue sharing dimensions/light settings.
- Review dock scrolling and canvas space at small window sizes, keyboard tab/timeline use, focus and fullscreen controls. The current fixed viewport layout prioritizes preview space but can make the many controls harder to scan.

Begin the later UI task with a short walkthrough of new/live/paused/completed/imported states and one small-window review. Treat these as review priorities, not confirmed bugs. Preserve current rendering, default settings, planner/session identity, targeting/Undo, import/replay, native/2x export and worker lifecycle tests. UI changes require their own scoped request and review; none were made in V37.
