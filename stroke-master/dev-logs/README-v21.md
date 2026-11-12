# V21 operational snapshot

Current choices: V14 default, V17, V20 experimental, V21 experimental: tonal correction. Quiet body defaults/reset .25. Planner21 records preserve document4, material2, oil-library-3.0 and loading1/srgb. V21 changes only predicted lateral correction eligibility; V20 remains exactly retained, and both share fitting/rendering. Keep V21 for manual comparison; revise before adoption because portrait visual improvement is inconsistent across seeds.

Current commands from stroke-master/:

```
node build.cjs
node v21-test.cjs
node v21-experiment.cjs
node v21-browser-smoke.cjs
node v21-gallery-check.cjs
node v21-gallery-check.cjs package
```

The experiment consumes the saved Chrome working portrait PNG; node v21-reference.cjs recreates it from the supplied JPEG. Browser commands need local Chrome process/socket permission. Python supports test-only archive loading and ZIP verification. The V21 wrappers reuse older tests with new evidence paths; prior wrappers assume previous selector counts and are historical. No historical evidence is overwritten by current commands.

Open [report](V21-EXPERIMENT.md), [gallery](../artifacts/v21/comparison.html), [ZIP](../artifacts/v21/v21-comparison.zip), [KIV](KIV-v21.md). archives/v21-control.zip contains the verified incoming engine and V20 fitter. v21-control.cjs loads it outside the app. Diagnostic tools are archived in archives/v21-diagnostic-tools.zip; restore v21-diagnostic.cjs and v21-review.cjs into stroke-master/ for opt-in reproduction. The diagnostic has fixed caps and cannot affect production decisions. No abandoned screening variant or persistent trace machinery is active.
