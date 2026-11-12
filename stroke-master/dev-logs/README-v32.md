# V32 operational snapshot

Stable: V12 legacy and V17. Experimental: V30, **V31 (default)** and V32 Graded construction (opt-in). V22 standalone generation is archived; its shared candidates and loading remain canonical crossover dependencies. Quiet body default/reset remains .25. The planner captured at Paint survives Continue, targeting, Pause/Resume and Undo. Source-free import restores paint and provenance, not optimiser state.

V32 adds existing selective double loading to the single V31 construction donor. Its uniform parent remains in competition. At most one eligible donor, two existing fits and two additional canonical evaluations per opportunity. Only colour/loading metadata changes; donor geometry, alpha, height, seeded texture, attention, scoring and scheduling remain unchanged. Baseline loading has an independent opportunity; donor counters are separate. No new UI controls.

From `stroke-master/`:

```sh
node build.cjs
node v32-mechanism.cjs
node v32-test.cjs
node v32-preservation.cjs
node v32-study.cjs
node v32-summary.cjs
node v32-gallery.cjs --compact
node v32-browser.cjs
```

The recorded design fixes seeds42/73, Balanced detail/search, default brushes, body .25, established working pixels, early300, initial1400/5600 proposals and Continue+7000/+28000. Declare with `node v32-study.cjs declare` only before results exist. No allowances increase after inspection. Controls use the verified incoming engine and fresh timings; all six initial/final V31 stroke sequences must match saved V31 evidence. Painting timers include screening, fitting, scoring and support telemetry; analysis, replay, export and verification are excluded. Approximate equal-work views use the nearest accepted prefix at the smaller paired time. Single observations are not repeated speed estimates.

## Verified restoration

[incoming.json](../artifacts/v32/incoming.json) records Git revision `d669b577de508a1dfc6b510a9de4a4fb44a56fa5` and incoming file hashes. `v32-control.cjs` loads that revision and its relative engine dependencies **in memory**, without overwriting working files or keeping an engine copy. Keep that Git object available. Use:

```js
const control = require('./v32-control.cjs')();
const session = control.createSession(input, { ...settings, planner: 'v22' });
while (!session.done) control.step(session);
const historical = control.snapshot(session, false); // plannerVersion 22
```

Use `planner:'v31'` for the direct control. Current canonical replay handles both archived and new documents, including native/2x and timeline. Older restoration manifests/loaders remain untouched. Historical test tools may require their archived engine now that V22 generation is retired; do not rewrite historical logs or evidence to make them call a different planner.

[Report](V32-EXPERIMENT.md) · [Gallery](../artifacts/v32/comparison.html) · [KIV](KIV-v32.md) · [Current handoff](../HANDOFF.md).
