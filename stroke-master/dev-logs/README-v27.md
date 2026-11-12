# V27 operational snapshot

Stable: V12 legacy/planner11/material2 and V17. Experimental: V22, unchanged default. Archive: other implemented planners; V24/V25/V26 are removed from normal runtime after verified preservation. Historical JSON import/replay retains provenance. Quiet body default/reset .25.

V27 is offline only. **Revise the geometry hypothesis:** all 13 eligible regions skipped the declared PCA corridor construction. No broad treatment gain or better damage control was demonstrated. Existing refinement loses benefit/footprint while reducing harm. Missing quotas and negative findings remain explicit.

[Report](V27-EXPERIMENT.md) · [KIV](KIV-v27.md) · [Gallery](../artifacts/v27/comparison.html) · [Design](../artifacts/v27/design.json) · [Restoration](../artifacts/v27/restoration.json).

From `stroke-master/`: `node v27-study.cjs run` repeats fixed comparisons; `node v27-gallery.cjs` rebuilds all examples. Focused checks: `node v27-test.cjs`, `node v27-browser.cjs`, `python v27-archive.py --verify`; build: `node build.cjs`. `select` creates design/anchors only for fresh evidence and refuses an existing design. No new painting benchmark.

`require('./v27-control.cjs')()` checks hashes and restores incoming generation in memory, resolving archived dependencies relative to their original modules. It is absent from standalone pages. Source restoration requires a separate scratch checkout containing every manifest entry and verified shared dependency, followed by the restored build. Do not restore into this checkout automatically. V26 outputs/runners absent at intake remain absent; historical logs describe their own former state.
