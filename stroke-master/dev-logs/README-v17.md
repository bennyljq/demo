# Stroke Master V17 operational snapshot

Open `../index.html` for the standalone studio, `../brush-lab.html` for brush studies. Normal choices are **V14 (default)** and **V17**, planner 14/17, material 2. Quiet-area body defaults/reset to **0.25**, preserving the user's change. V17 is optimized V16 behaviour, not a new artistic treatment. Historical reproduction explicitly uses its recorded .65 settings.

Paint captures immutable planner provenance. Continue, Resume, targeted refinement and Undo retain it. Changing next-run selection preserves current painting, reference, seed and settings; selection is disabled while painting. Imports replay recorded strokes/material independently of selection, including V16. Timeline, JSON and full/current-frame PNG remain canonical.

V17 uses alpha-only canonical support validation, omits unused colour/height work and terminates conclusive failures early. It preserves exact support rounding, caps, .08 threshold, compatibility, .72 narrowing, four checks and .65 floor. No persistent scratch/cache is added. Full historical median step work improves 21.0%, current-default short work 14.7%, with exact output. No rendering or peak-memory improvement is claimed. See [V17 report](V17-EXPERIMENT.md) and [compact comparison](../artifacts/v17/comparison.html).

From stroke-master/:

```sh
node build.cjs
node v17-test.cjs
node v17-regression.cjs
node v17-browser-smoke.cjs
node --expose-gc v17-benchmark.cjs full
node --expose-gc v17-benchmark.cjs default
node v17-summary.cjs
```

Tests write to artifacts/v17/ only. The regression adapter uses immutable archived V12 for retained V7 assertions; current V17 has separate focused checks. V14 browser lifecycle assertions, shared CDP/fixtures/PNG reader and historical v6 fixture remain active dependencies. Do not run historical runners against current dispatch.

The normal build embeds engine.js, V14, coherent-fit.js and V17. V12 search and V15/V16 runtime branches are retired. `v17-control.cjs` loads immutable incoming engine/source bytes from archives/v17-retirement.zip for historical comparison; Python is required for that loader. It supports the old V12/V14/V15/V16 generation API. Replay in the normal studio needs no archive or Python.

Retirement restoration: extract archives/v17-retirement.zip into stroke-master/ for original relative paths. Restore reused archives/v15-comparison.zip entries by mapping v15-comparison/<name> to artifacts/v15/<name>. Detailed hashes/paths are in artifacts/v17/retirement.json. Earlier historical evidence/tooling remains in archives/history-through-v15.zip. User assets, append-only dev-logs and V16 evidence remain. Restored historical runners describe old versions and may overwrite their outputs; avoid replacing current sources without a separate historical checkout. Temporary profile tools are archived in archives/v17-profiling-tools.zip, not production code.
