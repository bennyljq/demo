# Stroke Master: V15 planner comparison

Open [index.html](index.html) for the standalone studio or [brush-lab.html](brush-lab.html) for brush studies. Both work from disk without dependencies or runtime network requests. Edit sources inside stroke-master/ and regenerate both pages with `node build.cjs`.

The studio offers **V12 control** (default, planner 11/material 2/no V13 penalty), **V14 experimental** (geometry-led planner 14/material 2) and **V15 experimental** (construction-only treatment, planner 15/material 2). The selector is an evaluation tool; broader adoption and pruning await user review. See [V15-EXPERIMENT.md](V15-EXPERIMENT.md), the [offline gallery](artifacts/v15/comparison.html), and the [portable ZIP with both pigment and Neutral images](artifacts/v15/v15-comparison.zip). V12/V14 decisions and historical evidence remain reproducible; [V14](V14-EXPERIMENT.md) and [V13](V13-RECOVERY.md) reports describe their historical state.

Paint captures the planner for that session. Continue, Resume and targeted refinement keep it, even after changing the next-run choice while paused. Selection is locked during generation and otherwise applies to the next Paint. Changing it preserves reference pixels, priority marks, seed, settings and current painting. The painting header identifies its active planner across tabs.

## Shared planning and records

All three choices share canonical reference analysis, palette, brushes, foundation, material 2, structural objective, absolute acceptance threshold, scheduling and work limits. The exact hash-verified frozen V12 source supplies the control. Early work progresses through Block-in, Shapes, Directional and Fine at 18%, 50% and 78% of consumed operation/proposal allocation excluding foundation. Continue allocates fine work without repeating foundation.

V12 Fast/Balanced/Thorough evaluates 3/7/12 initial candidates plus at most 0/2/4 repair variants. V14 and V15 evaluate exactly three geometry-fitted single contacts at every depth. V15 keeps compatible width by trimming a contiguous path portion, using canonical brush shoulders before narrowing; it shares V14's constructor and compatibility checks. Search depth remains recorded but does not expand either experimental shortlist. No clipping mask, size quota or collateral penalty is used. Generation settings stay with the session; search depth applies to the next pass. Neither planner guarantees artistic quality.

New generation records use document v4, brush library oil-library-3.0, materialVersion 2, plannerVersion 11, 14 or 15 and settings.planner. Material 2 bounds negative height displacement by fresh paint height. Missing materialVersion or explicit version 1 preserves legacy deposition; unsupported material versions are rejected. Imported V2/V3/V4 records retain their authoritative strokes/material independently of the selector, including historical planner 13. Timeline and full/current-frame PNG exports share canonical replay and presentation lighting.

## Targeted refinement and lifecycle

Pause or complete a live painting, select Targeted refinement, and drag from the circle centre. Local Auto/Fine, depth and budgets apply to that pass. Recorded target metadata feathers pigment, coverage and height at the support edge. Local operations append to real buffers while global allocation is frozen. Pause/Resume works within the pass; local Cancel keeps accepted operations and offers Undo. Undo restores previous buffers, scheduling, residual caches and RNG. Lighting shadows may extend outside paint support.

Keep targeting enabled can re-arm after normal completion. Escape, Cancel, replacement reference, Paint/import and explicit global Resume/Continue disarm it. Global Cancel terminates the optimiser and retains its last saved snapshot. Imports support replay/export without a reference; live refinement requires the original reference/optimiser session. V13 is historical replay evidence, not a third choice.

## Sources and limits

`engine.js` owns canonical brushes/material, helpers, control planning, explicit session dispatch and records/replay. `experimental/v14-planner.js` owns the shared constructor and exact V14 fitting; `experimental/v15-planner.js` supplies V15 fitting. `worker.js` retains the shared protocol. `app.js`, the studio template and `build.cjs` provide comparison integration. Lab UI/template, lighting controls and styles are unchanged. Both standalone pages embed the shared engine; the lab has no selector.

Limits: 1536 planning edge, 4096 export edge, 24000 operations, 120000 allocated/consumed proposals, 96000 accepted contacts, 30720000 candidate contacts, 96 curve segments/contact, 1.5 million candidate-patch pixels and 768 MiB estimated memory. References: 32 MB/40 million decoded pixels; JSON: 48 MB. Timeline checkpoints: 32 MiB/eight entries. Undo and retained preview/checkpoint buffers count towards memory guards.

## Verification

```sh
node build.cjs
node v15-test.cjs
node v15-regression.cjs
node v15-browser-smoke.cjs
node --expose-gc v15-experiment.cjs short
node --expose-gc v15-experiment.cjs full v14
node --expose-gc v15-experiment.cjs full v15
node v15-experiment.cjs matched
node v15-diagnostic.cjs
node v15-gallery.cjs
node v15-gallery-check.cjs
```

Tests write under artifacts/v15/. The regression adapter reuses maintained V7 assertions with V12 metadata and redirects outputs away from history. Older runners describe historical versions and may overwrite their evidence; use the current commands above. See [HANDOFF.md](HANDOFF.md) for actual validation, performance measurements and artistic limits. Frozen V12/V14 equivalence, deterministic/replayable V15 records and the extracted gallery are checked. V15 improves early rooster masses and partially improves the contrast subject, but background construction, eye detail and relief bands remain unresolved; user visual review decides adoption.
