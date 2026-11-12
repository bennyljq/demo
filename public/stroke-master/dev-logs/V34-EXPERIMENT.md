# V34 — Crossover: generalisation and consolidation

Release validation, 2026-10-08. **Freeze V33 as the preferred experimental development baseline; retain V31 as the cheaper alternative. Keep Stable V12/V17 unchanged.** No V34 painter exists. Generated graded paintings identify planner33. The user's explicit preference for the established initial portrait's lips, nostrils and facial definition supersedes the earlier absence of a preference. V33 is behaviourally identical to V32: its optimisation did not create these artistic properties.

## Frozen protocol and evidence

Incoming clean revision: `1ce73cfa0b31511e9b72d207f0f0b76eb5e2612b`, frozen in [incoming manifest](../artifacts/v34/incoming.json). [Declared design](../artifacts/v34/design.json) records preparation, hashes, fixed crops, settings and alternating pair order before painting comparisons. Both requested assets exist; no substitution. `assets/mat.jpg` (450×450) was Lanczos upsampled to 640×640; `assets/Taylor-Swift-in-the-woods-beautiful-blonde-singer_2560x1600.jpg` was downsampled to 640×400. These are outside the recent development set, not historically unseen assets. Upsampling Mat supplies no additional source detail.

Current optimised V31/V33, seeds42/73, Balanced detail/search, default ten brushes, quiet body .25 and identical Neutral material. Initial 1,400 accepted operations / 5,600 proposals; Continue +7,000 / +28,000. Foundation, attention, construction/loading, geometry, colour fitting, brushes, objective/acceptance, scheduling, budgets and presentation remain fixed. All eight runs reached all four observation points and stopped at the stroke budget; no rescue budgets or reference-specific tuning.

[Compact self-contained gallery](../artifacts/v34/comparison.html) shows whole paintings, predeclared face and boundary/thin-structure crops at 300/1,400/4,000/8,400, and approximately equal initial/final measured work, in pigment and common Neutral. Embedded native-dimension WebP previews compress presentation only; adjacent lossless PNGs and authentic full JSON preserve exact evidence. [Measurements](../artifacts/v34/measurements.json), [prefix/crossing comparisons](../artifacts/v34/pairs.json) and per-case prefix files retain actual observations. Canonical replay matches live RGB, coverage and height buffers at every captured checkpoint.

## Useful paintings, not just lower error

At 300 both painters establish large tonal masses; faces and thin structures remain incomplete. At 1,400 Mat is recognisable in both seeds. V33's cheek/jaw transitions are more connected and its nostril and lip shapes are somewhat cleaner; V31 retains more angular facial patches. Neither is free of broad forehead bands or dark eye simplification. At 4,000 the eyes, nose and mouth become much more convincing; 8,400 further develops facial transitions and the lei/striped shirt boundaries. Later work is useful, rather than exclusively fragmentation, but differences between painters become modest. Both retain facet shoulders and small edge fragments.

The forest portrait is coherent at 1,400: blonde curls, coat, red shirt and dark tree/foliage separate clearly. Facial benefit is mixed. Seed42 V33 compresses the eye area into darker bands and is not clearly preferable to V31 there; seed73 V33 gives a clearer small eye cue while the opposite eye and nose remain angular. This local early weakness is visible in pigment, so it cannot be blamed solely on relief. Both improve substantially by 4,000/8,400: gaze, lip line, nose modelling and curls become more legible. V33's final face is slightly more connected in places, without a decisive general advantage. No serious whole-painting collapse or consistent regression appears on either reference.

The second crops include difficult regions, not just faces. Mat's flowers and diagonal light stripes gain clearer separation from the black background, though petals remain chunky. The forest coat/tree boundary stays coherent while fern stems and leaflets develop; the finest foliage remains simplified or broken in both painters. Continuing develops useful structure but also accumulates small contact marks. At equal final time, both painters remain visually close; V33's lower operation count does not create an obvious collapse, and V31 is a strong practical choice.

Pigment already contains gradient steps, contact bands and angular stroke shoulders. Neutral adds thin relief ridges and crosshatching, especially on forehead, cheeks and coat; it exaggerates some discontinuities rather than causing all of them. No relief setting was adjusted to conceal them. These limitations remain visible even as fidelity improves. Structural error is fidelity evidence, not a verdict on likeness, brushwork or artistic preference.

## Single-run timing observations

Seconds of accumulated painting work, excluding setup and replay/export/checkpoint inspection. Each row is one observation, not a repeated speed benchmark. Both planners include the shared V33 implementation improvements.

| Case | Planner | Initial s | Continue s | Total s | Evaluated candidates |
|---|---|---:|---:|---:|---:|
| Mat42 | V31 | 5.838 | 15.191 | 21.029 | 37,037 |
| Mat42 | V33 | 6.268 | 17.935 | 24.203 | 39,830 |
| Mat73 | V31 | 5.897 | 15.009 | 20.905 | 36,957 |
| Mat73 | V33 | 6.304 | 18.306 | 24.609 | 40,244 |
| Forest42 | V31 | 5.940 | 13.049 | 18.989 | 35,289 |
| Forest42 | V33 | 6.180 | 14.858 | 21.038 | 36,130 |
| Forest73 | V31 | 6.047 | 13.003 | 19.050 | 35,141 |
| Forest73 | V33 | 6.342 | 14.512 | 20.853 | 36,339 |

At equal 8,400 operations V33 costs 15.1–17.7% more time on Mat and 9.5–10.8% on forest in these observations; final structural error is 13.2–13.4% lower on Mat and 5.9–7.3% lower on forest. These ranges compare seeds within each asset, not an aggregate benchmark.

| Case | V31 initial error | V33 initial error | V31 final error | V33 final error |
|---|---:|---:|---:|---:|
| Mat42 | .001096860 | .001014753 | .000152906 | .000132459 |
| Mat73 | .001192372 | .000974332 | .000152205 | .000132151 |
| Forest42 | .003763640 | .003526439 | .000965246 | .000907973 |
| Forest73 | .003710473 | .003490417 | .000978876 | .000906987 |

Approximate equal work uses the nearest accepted prefix at the smaller paired checkpoint time. V31 is at 1,400/8,400; V33 initial/final prefixes are Mat42 1,222/7,304, Mat73 1,230/7,147, Forest42 1,286/7,451, Forest73 1,272/7,563. Every mismatch is under 3 ms. V31 has lower final error in all four equal-time pairs; initial error favours V33 only on Mat73. Time matching is an observation from this run, not a deterministic scheduling rule.

The common level is the larger paired initial/final incremental structural error. The table records the **first measured accepted-prefix crossing**, without interpolation. Displayed levels/times are rounded; full precision and candidate counts remain in pairs.json. Tiny incremental/full-score differences are floating-point accumulation.

| Case/phase | Common level | V31 operations / s | V33 operations / s |
|---|---:|---:|---:|
| Mat42 initial | .001096860 | 1,400 / 5.838 | 1,296 / 6.013 |
| Mat42 final | .000152906 | 8,400 / 21.029 | 7,507 / 21.615 |
| Mat73 initial | .001192372 | 1,400 / 5.897 | 1,114 / 5.642 |
| Mat73 final | .000152205 | 8,400 / 20.905 | 7,525 / 22.032 |
| Forest42 initial | .003763640 | 1,400 / 5.940 | 1,288 / 5.945 |
| Forest42 final | .000965246 | 8,400 / 18.989 | 7,865 / 19.871 |
| Forest73 initial | .003710473 | 1,400 / 6.047 | 1,301 / 6.120 |
| Forest73 final | .000978876 | 8,400 / 19.050 | 7,730 / 19.406 |

V33 uses fewer operations to cross these levels, but V31 reaches all final levels sooner. Mat73 initial is the exception favouring V33; forest42 initial is effectively tied at this measurement scale. Prefer V31 when turnaround or matching a modest fidelity target matters more than the user's preferred graded portrait construction.

Established optimisation claims remain the [V33 warmed repeated results](../artifacts/v33/summary.json): median total reductions versus frozen V32 of 11.5% portrait and 16.2% Beaver. [Six-case exact equivalence](../artifacts/v33/equivalence.json), [V33 report](V33-EXPERIMENT.md) and [existing three-reference gallery](../artifacts/v32/comparison.html) are reused, not rerun or copied.

## Consolidation and bounded decision

One exported engine default now drives fallback selection; the UI selects V33 and an obsolete `/07` header label is removed. Explicit planner algorithms are unchanged. Recent V33 tools lose abandoned pre-promotion V32 branches, accept separate output directories and default to current-checks, preventing routine checks from overwriting historical evidence. The existing Git loader accepts a manifest and restores incoming V33 in memory; no second app or copied historical engine. Partial equivalence runs no longer claim the full six-case pass. Unique V34 study/gallery code only supplies the new evidence. Temporary preparation/inspection diagnostics are removed.

Focused exact V32/V33 regression, retained planners, loaded feather crossings, targeting/Undo and interleaved sessions pass. Chrome verifies default-generated planner33, Continue, targeting/Undo, Pause/Resume/cancel, stale-result isolation, JSON/timeline/native+2x canonical PNG and V22/V30/V32 replay. All48 gallery combinations decode without exceptions. Preservation verifies untouched incoming files and the entire engine source except its declared default constant/fallback/export. Artistic modules and worker remain byte-identical. See [verification protocol](README-v34.md).

Preferred behaviour generalises sufficiently to freeze this **experimental** generation across a monochrome portrait and a textured outdoor portrait, alongside the established three references. Two extra assets and one timing observation per case do not establish universal superiority or justify Stable promotion. Keep V31 available. Contact-band/gradient continuity and early small-eye readability are demonstrated limitations, but neither warrants tuning against this validation set now. Freeze this baseline and focus elsewhere; carry bounded follow-up questions in [KIV](KIV-v34.md), with automatic stopping, stroke ends, relief, wet mixing, palette and brush expansion deferred.
