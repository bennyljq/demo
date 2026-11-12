# V64 - contour-led task planner, first architectural experiment

V64 is implemented as **Contour-led experimental**, planner64/material15/stick13. V44 stays default; oil and existing planners are preserved. No promotion or commit. **The drawing-quality goal is not met.** The opening scaffold is selective and sometimes intelligible, but connected mass development is inefficient and final modelling is substantially worse than V50/V58.

[Offline native review](../artifacts/v64/comparison.html) | [Work and timing data](../artifacts/v64/summary.json) | [Freeze](../artifacts/v64/freeze.json) | [Current KIV](KIV-v64.md).

## Architecture actually changed

V64 bypasses the candidate-slot scheduler. It has no reference49/progression49 state, blur targets, promotion gates or timed stages. The original tonal reference remains the fitting/evidence target throughout. Existing initial reference analysis still computes local scales, but these are analysis data and never painting targets.

A deterministic analysis grid (maximum long edge 256) uses local smoothing, gradients, nonmaximum suppression and connected weak/strong hysteresis. Direction-compatible walks produce connected curves; Douglas-Peucker simplification removes small wiggles before at-most-eight-node charcoal paths are fitted. Ranking combines capped contrast, length, continuity and spatial distribution. Proximity suppression reduces paired contours; it does not guarantee their elimination. Curves record confidence, normal/polarity, transition-width estimate and dark-line/light-ridge/boundary classification. Connected quantised value regions record adjacency, residual direction and quiet/texture evidence. These are general image rules; no facial axes, anatomy, authored reference paths, generated progression images, external inference or source-pixel painting.

The first twelve selected curves receive light, tapered, capped deposits. Dark lines use centred contact; one-sided boundaries shift toward the darker side, and light ridges are reserved. Remaining selected curves interleave with mass work after enough scaffold has been considered. Long paths are independent of contact width. Failure to find reliable curves is explicit, without a fallback to an older painter.

A drawing task records a curve/region, intended result, dependency description, up to four proposed actions and completion evidence. Mass tasks coordinate three overlapping contacts with shared direction/loading. Quiet passages use steady loading; texture uses a region direction estimate. After residual tone falls, narrower modelling is available. Lifting, erasure-capable native material and blending remain supported; the current automatic task generator uses deposit/lift/blend and does not yet propose crisp erase tasks. Light reservation is stronger than active ridge lifting in the foundation.

Each task is trialled sequentially on a disposable **real material surface**. A quiet task starts with a preparatory blend before fitted deposits. That blend may worsen immediate pixel error. Acceptance uses the completed sequence: positive squared-tone gain, bounded light damage, bounded reference-edge derivative damage and bounded neighbourhood derivative error in quiet passages. The latter averages local differences to avoid treating every paper tooth as a discontinuity. Exact thresholds are visible in `trial()`; there is no weighted artistic score. Accepted constituent actions are emitted one at a time, so Pause, allowance exhaustion and End pass can leave a task partially executed; completion counts and pending actions expose that fact. Continue retains pending work. Targeting discards a pending global sequence and replans locally; Undo restores the previous plan and material exactly.

This genuinely changes the planning horizon. Accepted tasks containing a temporarily negative constituent occur on Mat 13 times, Ayam 4, Wonder Lake 2, forest 2 and Rainier 1. These counts demonstrate sequence acceptance, not artistic merit. Pixel fitting still chooses each deposit quantity; it is not a joint optimisation of all sequence parameters.

## Development and frozen tests

Mat, Ayam and Wonder Lake were the development references, seed42, original prepared sizes up to640. Runtime hashes were frozen before forest portrait and Rainier. These two references were untouched during V64 development, but appeared in historical project experiments: this is **not** a claim of dataset-wide unseen evaluation. No planner tuning followed held-out inspection. A later unchanged development rerun completed the two-renderer work counters and reproduced the same drawings.

The review shows 12/25/50/100/300/700/1400/final operations, original/selected curves, suppressed edges and connected masses. Every artwork view is replayed from one accepted stream. Equal-work panels use the smallest available common count; equal-time panels use actual per-operation timestamps including preparation and rejected work. Ayam reaches only2421 actions within its two bounded proposal allowances, so its common final work comparison uses2421 for all painters.

| Reference | V64 accepted | Complete seconds V64 / V50 / V58 | Original-tone RMS V64 / V50 / V58 |
|---|---:|---|---|
| mat | 2800 | 8.358 / 7.267 / 6.088 | 70.41 / 7.33 / 10.94 |
| rooster | 2421 | 24.021 / 9.440 / 5.440 | 56.55 / 13.90 / 15.27 |
| wonder-lake | 2800 | 17.696 / 14.183 / 11.224 | 41.14 / 8.44 / 8.79 |
| forest | 2800 | 13.017 / 11.255 / 8.345 | 63.18 / 14.52 / 16.37 |
| rainier | 2800 | 13.967 / 10.359 / 7.355 | 68.85 / 18.04 / 19.53 |

V50/V58 reach 2800 in every listed run. RMS is in 0-255 tone units, diagnostic only. Each time is one sequential complete observation, not a repeated median or a general speed claim. Complete wall includes input decode, initial analysis, structure extraction, trials, fitting, rejected tasks, raster, score/cache updates and Continue. Module loading, PNG/JSON evidence writing, diagnostic analysis, export/review replay and process launch are excluded. Development reruns replaced their earlier timings; drawings did not change.

## Visible result and limitations

Mat's early scaffold gives a useful face/neck relationship and selective internal lines. It is incomplete, unevenly distributed and loses some opposing silhouette evidence. Ayam has a partial silhouette and a few characteristic divisions; texture competes with its useful structural lines. Wonder Lake gets large contour relationships before tone, but the landscape's softer divisions are weak. The held-out forest and Rainier runs retain this pattern and do not establish generalisation success.

All five finals are failures relative to the controls. Overlapping horizontal quiet contacts form bands and unfilled gaps. Connected quantisation fragments soft transitions into thin regions; region residual competition then behaves too locally despite the explicit task representation. Facial modelling stays pale and fragmented, backgrounds incomplete, and landscape quiet passages develop conspicuous seams. Finishing is mostly further mass correction, not convincing volume or selective detail. Raw edge classification occasionally treats texture as structure and cannot reliably distinguish all narrow ridges/lines. Stored mass adjacency does not yet impose useful inter-region value ordering or a proper dependency graph; the current dependencies are coarse scaffold-before-mass descriptions. This is a material architectural limitation, not a hidden fallback.

Focused sparse, soft-boundary, textured and quiet-gradient checks are visible in the review. The sparse curve partly survives; soft boundaries and meaningful texture are not erased wholesale. **Smooth areas do not remain adequately quiet:** strips, gaps and contact seams remain. These checks expose failure instead of asserting that the requested quietness goal passed.

## Compute and verification

| Reference | Tasks / nonempty trials / trial actions | Accepted / rejected / empty tasks | Full-canvas trial copies / evidence visits, M | Contact samples / mask pixel visits |
|---|---|---|---|---|
| mat | 2991 / 1812 / 4620 | 1220 / 592 / 1179 | 366.9 / 907.5 | 230563 / 19682243 |
| rooster | 8748 / 7408 / 16689 | 1236 / 6172 / 1340 | 2158.3 / 1575.1 | 856999 / 101462310 |
| wonder-lake | 1436 / 1371 / 4438 | 1012 / 359 / 65 | 374.7 / 2225.5 | 676315 / 108201327 |
| forest | 2827 / 2652 / 6732 | 1193 / 1459 / 175 | 678.9 / 1093.7 | 331817 / 44295426 |
| rainier | 3180 / 2950 / 6956 | 1273 / 1677 / 230 | 677.8 / 1078.3 | 471371 / 65725134 |

Empty tasks include unsupported region spans and light reservations. Accepted tasks may contain zero-dose constituents that receive no accepted-operation credit. Raw contact counters include fitting and the separate replay-compatible native13 raster kernel. Evidence visits and copied pixels are explicit bookkeeping, not all JavaScript instructions; complete wall captures analysis sorting, simplification, allocation and other overhead too. The full-canvas trial copy and full error rebuild after each accepted action are expensive. They are bounded and counted, not optimised away. The worker yields between bounded steps; each trial has at most four actions, with existing contact/sample/memory safety limits. Search-depth fields remain in the session format for compatibility; ineffective detail/search controls are hidden for V64, which uses the same bounded task trial at every depth.

`node v64-check.cjs` passes historical oil V12/17/31/33 and charcoal44/50/58/63 exact generation/Continue against HEAD, all depths/two seeds, no legacy stage state, bounded sequences, score agreement, source-free native/2x replay, sealed targets and exact Undo. `node v64-browser.cjs` passes actual worker Paint/Pause/Resume/Continue, planner identity, stage-control hiding, mouse targeting/Undo, JSON import and exact native/2x exported PNGs. `node v64-review-check.cjs` checks the offline review, all five references, both matching modes and2x replay. Lossless compact encoding roundtrips every complete document exactly. `node v64-recovery-check.cjs` additionally verifies all fifteen complete native paintings against their recorded generation pixels, exact compact document recovery, task accounting and frozen hashes. These are correctness checks; they do not establish artistic success.

Reproduce from `stroke-master`: `python v64-prepare.py`, `node v64-study.cjs`, `node v64-study.cjs --held-out`, then the same two commands with `--baselines`; `node v64-build-review.cjs`. The forest prepared original is created from `assets/references/tay-forest.jpg` using EXIF transpose and a640px Lanczos thumbnail; the supplied originals remain authoritative. Bulk trajectories, full task diagnostics, timing vectors and focused checks live in ignored `../artifacts/v64-work`; compact review assets are ignored in `artifacts/v64`. Review assets are about13MB plus shared engine files, with fifteen single lossless streams and no duplicated checkpoints. Accepted JSON restores artwork, not the live optimiser.

Retain V64 as an architectural failure study. A convincing foundation followed by convincing charcoal modelling remains unfinished research; V50 and V58 are the safe drawing alternatives.
