# V18 operational snapshot

The bounded third-candidate compact-dab trial is **rejected**. Normal studio choices remain V14 (default) and V17, material 2; quiet-body default/reset remains .25. No released V18 planner or selector option exists. Rejected offline records identify planner 18/material 2 and replay independently of selection.

Read [experiment](V18-EXPERIMENT.md), [deferred work](KIV-v18.md), [interactive comparison](../artifacts/v18/comparison.html), or extract the [portable comparison ZIP](../artifacts/v18/v18-comparison.zip) and open comparison.html. Current README/HANDOFF describe the retained V17 studio.

From stroke-master/:

```sh
node v18-check.cjs
node v18-browser-smoke.cjs
node v18-gallery.cjs
node v18-gallery-check.cjs
```

The engine checks use archived control sources through Python; Chrome checks use installed Chrome. They write V18 evidence without overwriting previous-version results. v18-gallery-check accepts an independently extracted comparison directory as its optional argument.

Reproduction: verify artifacts/v18/freeze.json source/reference/record hashes and archives/v18-control.zip. Restore v18-trace.cjs, v18-experiment.cjs, v18-export-diagnostic.cjs and v18-buffer-diagnostic.cjs from archives/v18-diagnostics.zip to their recorded stroke-master-relative paths. Then run `node v18-trace.cjs`, `node v18-experiment.cjs short`, `node v18-buffer-diagnostic.cjs`, `node v18-export-diagnostic.cjs`. Frozen constructor bytes load in memory via v18-control.cjs. The rejected trial's sole curve→dab substitution is in the archived runner. No conditional long run was performed or recommended. Gallery composites and exact intermediate restoration paths/hashes are also preserved in that archive.

Current source/build caveat: incoming index.html contains a generated-only 28px .view-title declaration missing from styles.css. Build output was checked, then that exact existing declaration preserved; sources/runtime remain unchanged. Do not discard it during a future rebuild. Source synchronization is outside this rejected planner experiment.

Evidence checks: five numerical groups, nineteen studio browser groups, offline gallery/import-provenance checks and independent portable extraction pass. Recommendation remains subject to user visual review; broader adoption is not authorized here.
