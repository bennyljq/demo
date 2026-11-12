# V33 operational snapshot

Stable: V12 legacy and V17. Experimental: **V31 (default)** and **V33 optimised graded construction**. V22, V30, V32 and earlier retired generators are archived. V30's donor constructor and the shared crossover/loading dependencies remain in use. Quiet body default/reset is .25. A session retains its planner through Continue, targeting, Pause/Resume and Undo; imported replay does not recreate optimiser state.

V33 preserves V32 painting decisions. One proposal owns a map of immutable seeded brush properties and profile tables, shared with colour-only variants, loading screening/fitting and acceptance. Full and alpha-only tables are separate; pixel footprint is part of the key. The map never enters session state or a worker message and expires before the next proposal. Canvas patch copying omits an initial background fill because every element is overwritten. No cached canvas data, changes to fits, heuristic rejection or new artistic mechanism.

From `stroke-master/`:

```sh
node build.cjs
node v33-test.cjs --promoted
node v33-verify.cjs --promoted
node v33-benchmark.cjs --promoted
node v33-summary.cjs
node v33-crossover.cjs
node v33-browser.cjs
node v33-preservation.cjs
```

Full verification uses the established V24 working reference pixels, seeds 42/73, Balanced detail/search, default brushes, quiet body .25, initial 1,400 operations/5,600 proposals and Continue +7,000/+28,000. It compares every candidate's ordered stroke and canonical gain, per-proposal RNG/acceptance/objective, initial/final documents and Float32 buffers, native/2x Neutral pixels, source-free replay and timeline. Only planner version/id and fields ending `Ms` are normalised. In-memory verification hooks are excluded from session/document comparisons and never used for performance measurements.

Benchmarking warms each engine/reference with one full painting, then alternates the frozen V32 and optimised sides for three measured runs each. V31 uses the same optimised shared helpers and is also warmed/measured three times. Existing timers are enabled on all sides. Setup, reference decoding, checkpoints, verification and replay are outside the painting timer; no painting work moved to setup. Timing records include initial/Continue/total, analysis, loading categories, candidates and fidelity checkpoints. V31/V33 common-error comparisons use checkpoint bounds, not inferred artistic equivalence. Do not aggregate different references into one score.

The supplementary crossover run warms each source/planner again, then records one measured first accepted crossing of V31's initial/final structural error levels. These exact operation counts/time observations complement the repeated checkpoint medians; they are single observations and cannot establish a robust small speed advantage. The incremental/full objective threshold comparison uses tolerance1e-14, without changing acceptance or painting.

## Restoration

[Incoming manifest](../artifacts/v33/incoming.json) freezes revision `433af2bf6b387803c6f68b3261dbdd1a4c9cd68d` and SHA256 hashes of all incoming project files, including references, settings and existing V32 records. Keep this Git object. `v33-control.cjs` restores the engine and relative dependencies **in memory**, without overwriting the working tree or duplicating the application:

```js
const control = require('./v33-control.cjs')();
const session = control.createSession(input, { ...settings, planner: 'v32' });
while (!session.done) control.step(session);
const document = control.snapshot(session, false); // plannerVersion 32
```

Use `planner:'v30'` on this same control to regenerate archived V30. Current canonical replay accepts their historical documents, including native/2x and timeline, retaining provenance. For standalone V22 use the untouched `v32-control.cjs` restoration instructions in [README-v32](README-v32.md). Historical tests that request retired generation require their recorded engine; do not rewrite old logs or evidence to make them call a current planner. No automatic reset or commit.

Reuse the [V32 gallery](../artifacts/v32/comparison.html) and its exact PNGs after equivalence verification. No duplicate painting gallery is created. [Report](V33-EXPERIMENT.md) | [KIV](KIV-v33.md) | [Handoff](../HANDOFF.md).
