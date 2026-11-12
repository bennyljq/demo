# V25 operational snapshot

Active: V12 legacy(planner11/material2), V17, V22 experimental **default**, V24 experimental and V25 Purist-v1 experimental(planner25/material2). Quiet body default/reset.25. Purist shares canonical rendering, lighting, target/session/replay/export infrastructure; its planner is independent. Import retains historical provenance independently of generation choices.

Retain synthetic construction as a useful prototype; revise before adoption. Beaver mass construction fails, rooster detail/background and holdout tonal refinement disappoint. The portrait has local continuity merits, at higher work than V22. No default change or general quality/speed claim.

[Gallery](../artifacts/v25/comparison.html) · [ZIP](../artifacts/v25/v25-comparison.zip) · [Report](V25-EXPERIMENT.md) · [Research specification](V25-PAINTING-PRINCIPLES.md) · [Deferred work](KIV-v25.md).

From `stroke-master/`:

```sh
node build.cjs
node v25-test.cjs
node v25-maintained.cjs
node v25-browser-smoke.cjs
node v25-preservation.cjs
node v25-gallery.cjs
node v25-gallery-browser.cjs
python v25-package.py
```

Study reproduction: `node v25-study.cjs`, then `node v25-study.cjs holdout` using the retained source PNG. Full records must match before evidence can be replaced. `v25-holdout.cjs` is the maintained Chrome decode helper for the selected asset; it records fixation before decoding. Do not recapture/reselect holdout as a tuning step. Run evidence writers only against V25 output. Measurements will vary across machines; decisions must repeat.

Purist's phase is reported in progress and snapshot metrics. Construction transition is a computational progress/stagnation check, not confirmation of visual completion. Larger corrections remain eligible in refinement/Continue. Targets retain V25; Auto/Fine currently use the same mixed-scale policy with shared feathering, cancel and Undo. Source-free imported records replay/export, but cannot Continue without optimizer state, as in existing planners.

Incoming source restores in memory through `require('./v25-control.cjs')()` after archive/entry/dependency hash verification. Source restoration requires a separate checkout and verified extraction of `engine.js` from `archives/v25-control.zip`; reuse unchanged dependencies listed in the manifest. Existing V24 restoration remains available. No automatic reset/commit.
