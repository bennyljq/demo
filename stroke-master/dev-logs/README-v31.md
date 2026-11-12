# V31 operational snapshot

Stable V12 legacy/V17. Experimental V22(default), V30 and **V31 Crossover — Construction attention**. Historical archives/replay intact; quiet body default/reset .25. Sessions keep their planner through Continue, targeting, Pause/Resume and Undo. Source-free replay restores strokes/provenance, not optimiser state.

V31 moves the existing single V30 donor to a mismatch-weighted Shapes-scale location, selected independently of baseline RNG/anchors. No second candidate, geometry/fitting/loading/scoring change or stage policy. Recommendation: revise before adoption; earlier Beaver coverage improves, while Rooster/portrait gains are mixed and work increases.

From `stroke-master/`:

```sh
node build.cjs
node v31-test.cjs
node v31-preservation.cjs
node v31-study.cjs
node v31-summary.cjs
node v31-gallery.cjs --compact
node v31-browser.cjs
```

The existing declaration fixes seeds42/73, Balanced/.25,300 early,1400 initial,+7000 Continue and5600/+28000 proposal limits. For a genuinely fresh evidence directory, `node v31-study.cjs declare` must run before painting; it refuses existing results. Do not adjust budgets to rescue a result. The study runs fresh V30/V31 timings, verifies preserved seed42 V30 records and twelve final replays. Summary/gallery reuse historical context through canonical replay; no historical collection reruns. Chrome checks/recompression need local browser/process/socket access. Control restoration uses the recorded Git commit, not copied application files.

[Report](V31-EXPERIMENT.md) · [Gallery](../artifacts/v31/comparison.html) · [KIV](KIV-v31.md) · [Current handoff](../HANDOFF.md) · [V30](V30-EXPERIMENT.md).
