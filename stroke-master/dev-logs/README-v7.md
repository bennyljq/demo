# Stroke Master 7

Open [index.html](index.html) for the studio or [brush-lab.html](brush-lab.html) for brush studies. Both generated pages work directly from disk without dependencies or network requests. Edit canonical sources inside `stroke-master/`, then run `node build.cjs`.

V7 removes scale-population quotas and gives directional/fine work its own source sampling and residual attention. Painting recovery is partial: matched rooster runs show more neck marks, but eye detail and fine feather continuity remain weak, with rougher background edges. See the [v7 report](V7-REPORT.md) and [matched gallery](artifacts/v7/comparison.html). Lower reconstruction error does not guarantee pleasing paint.

## Planning and search

The unchanged whole-canvas foundation uses 6?12 recorded broad operations within 10% of the smaller supported budget, with the existing reliable background-tone estimate/whole-image mean fallback. Later correction is unrestricted: foreground and background can overpaint each other. Priority marks remain soft guidance; no protected regions or source underlay are used.

After foundation, one global search task progresses through Block-in, Shapes, Directional detail and Fine detail. Progress is the larger consumed-operation/proposal fraction excluding foundation; phase boundaries are 18%, 50% and 78%. Continue starts in fine work without repeating foundation. These are opportunities for different tracing/sampling scales, not stroke-count quotas. Size follows the existing detail preset, local importance, colour boundaries and physical minimums.

Global tiles are sampled by a seeded residual-weighted draw with anti-repeat weighting. Early work uses the unchanged structural residual; directional/fine work uses point-colour residual weighted by source importance/coherence. This controls *where to try*, not acceptance. Candidates still require positive absolute gain against the same structural objective: 70% coarse blur, 20% fine blur, 10% point colour with existing importance/coverage weighting. Minimum total gain remains 0.000001. Scoring includes the whole footprint and blur context.

Fast/Balanced/Thorough explore variants of the same source-informed task plus a deliberate coherent broad repair. They no longer add unrelated large/medium/small rivals at every point. Broad repair retains bounded connected-residual analysis (at most 48?48 cells), region-averaged colour, failure caching and collateral scoring. Repair colours are clamped to valid RGB bounds to avoid floating-point overflow at white during JSON replay. No boundary veto from the experiments was retained.

| Search depth | Initial candidates | Additional repair variants | Maximum contacts per proposal |
| --- | ---: | ---: | ---: |
| Fast | 3 | 0 | 48 |
| Balanced | 7 | 2 | 144 |
| Thorough | 12 | 4 | 256 |

Greater depth spends more search work; it does not guarantee better art. Settings are fixed during a pass. Diagnostics record candidate/contact counts, work time, task stage and actual geometric scale classes. Brush identity and size are separate. Large means width ?0.035 E and swept area ?0.002 E?; Medium means width ?0.012 E and area ?0.0002 E?; otherwise Small. Long hairlines remain small. ?Requested? now counts the actual primary proposal class, not a lottery instruction.

## Targeted refinement

1. Pause a generated painting, or use a completed live painting.
2. Open **Targeted refinement** in Paint; choose Auto/Fine detail, search depth and additional operation/proposal budgets.
3. Click **Targeted refinement**, then drag from the circle centre to set its radius. The studio shows the latest live painting, even after inspecting a replay frame. Release starts local work.

The shared SVG shows a contrasting dark/white centre, selection boundary and feather boundary while dragging. It follows Fit, scrolled 100%, fullscreen and device pixel ratio. The SVG's `hidden` attribute is changed explicitly; assigning its JavaScript `hidden` property did not remove the attribute in the tested browsers. Overlays never enter exports.

Enable **Keep targeting enabled** to return to an empty circle-selection mode after each normal local completion. Global work remains paused; immediately draw another circle. The previous circle never reruns automatically. Gestures during local work are ignored. Latest-pass Undo remains available while armed and returns to empty selection with the prior pass preserved.

Escape clears the toggle and disarms. Switching it off during a pass lets that pass finish without re-arming. Explicit local Cancel retains accepted paint and Undo, then disarms. New reference, new Paint, document import and explicit global Resume/Continue also clear persistent targeting. With the option off, the original one-pass interaction remains. Export/replay are disabled while selecting; Escape returns to them.

Tiny circles below `max(3, 0.006 E)` pixels are rejected while selection stays active. Pointer cancellation disarms. Request tokens prevent stale latest-state replies from reviving selection. Targeting requires a matching live reference/optimiser; imported documents support source-free replay only.

Both local modes use fine-stage, source-informed proposals, capped initially by radius ?0.20 for Auto or ?0.09 for Fine detail, subject to physical/detail minimums and coverage repair. Both retain coherent broad repairs. Local sampling and coherent-region analysis stay within target support; context reads can extend beyond it. Global task cursor and budgets remain frozen. Accepted operations append to the real buffers, and explicit global resumption uses those changes.

### Feathering, replay and undo

The inner circle has full deposition influence. A smoothstep taper spans a feather width of 12% of radius, bounded between 1 canonical pixel and `max(2, 0.02 E)` pixels. Outside `radius + feather`, no pigment, coverage or height changes. The same alpha multiplier applies to structural scoring and all material deposition. Scoring includes the complete feathered footprint and necessary blur halos, not just the circle centre.

Each affected operation records a compact canonical object:

```json
"target": { "cx": 120, "cy": 80, "radius": 28, "feather": 3.36 }
```

For compound operations this target applies to every contact. Canonical coordinates are scaled during replay/export, including patch origins and unequal axis scales. Timeline, high-resolution PNG and offline rendering all use the canonical rasteriser. Feathering is recorded paint, not a final bitmap mask. Lighting remains separate: shadows from changed height can extend outside the selection. Lighting is deliberately not clipped at the circle edge, avoiding a shading seam.

**Undo last targeted pass** restores the preceding stroke prefix, affected structural/material buffers, halo errors, tiles and revisions, totals, statistics, schedules, RNG cursor and histories. Snapshot storage is 44 bytes per pixel of the affected rectangular support plus blur context, with small tile/metadata overhead; it does not copy the entire analysis/session. Its bytes are recorded and included in snapshot/export estimates. Large selections can be refused by the existing memory guard. Undo is available until the next painting mutation or replacement, and applies to the most recent local pass only.

Pause/Resume work within a long local pass. Cancel stops local work, retains accepted operations, leaves the global session intact and offers Undo. Replacement reference, Paint and document import discard stale workers/selection/undo state. Global Cancel retains its existing behavior of terminating the optimiser and keeping the last saved snapshot.

## Compatibility and limits

Documents retain version 4 and brush library `oil-library-3.0`; new records use `plannerVersion: 7`. V2/v3/v4 saved records remain authoritative replay inputs; historical planner metadata never activates another engine. Brushes, deposition, foundation colour selection, relief and lighting are unchanged. The existing five tabs, fullscreen, lab, timeline and current/full-frame exports remain.

Limits remain 1536 planning edge, 4096 export edge, 24,000 operations, 120,000 scheduled/consumed proposals, 96,000 accepted contacts, 30,720,000 candidate contacts, 96 curve segments, 1.5 million candidate-patch pixels and 768 MiB estimated working memory. Timeline checkpoints use 32 MiB/eight entries. Reference limits are 32 MB/40 million pixels; JSON is 48 MB. Memory estimates are workload guards, not RSS guarantees. Undo includes both residual tile arrays in its tile allowance.

## Build and verification

Production sources: [engine.js](engine.js), [worker.js](worker.js), [app.js](app.js), [lab.js](lab.js), [light-controls.js](light-controls.js), templates and [styles.css](styles.css). Both HTML pages embed the same engine; do not edit embedded copies.

```sh
node build.cjs
node v7-test.cjs
node test.cjs
node v4-test.cjs
node v5-test.cjs
node v7-browser-test.cjs
node v7-browser-test.cjs --firefox
node v7-ui-test.cjs
node v7-ui-test.cjs --firefox
node browser-test.cjs
node browser-test.cjs --firefox
node v7-studies.cjs
```

Current tests write under `artifacts/v7/`. The v6 engine/browser entry points forward to maintained checks; the obsolete v6 study generator points to preserved captures and the current command. Historical galleries remain under `artifacts/v3/`, `v4/`, `v5/` and `v6/`. Pre-edit README/HANDOFF and diagnostic source archives are under `artifacts/v7/`; they are not runtime planners. Older capture/benchmark scripts are outside the maintained v7 workflow.

Actual test results and remaining limits are in [HANDOFF.md](HANDOFF.md). Headless Firefox uses the expanded fullscreen fallback when native fullscreen is unavailable; interactive native Firefox fullscreen still needs a manual check. Artistic judgment remains necessary: compare neutral/pigment before changing relief, inspect face/neck/feet crops and try local Fine/Thorough, Undo, then global Resume.
