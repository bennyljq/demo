# V49 — Five-stage charcoal drawing with quality-gated progression

V49 is an unpromoted challenger. V44 remains unchanged, stable and default.
V46–V48 development is paused; their models, reports, packages and historical
renderers remain available through the [archive](../archives/index.html).
No commit or automatic promotion was made.

[Focused progression study](../charcoal-studies.html) ·
[Prefixes, pass ends and matched-time comparison](../artifacts/v49/comparison.html) ·
[One comparison/recovery package](../artifacts/v49/comparison-package.zip).

## Construction and gates

Five tonal references are cached once. Gaussian sigma is relative to the long
image edge: **3.5%, 1.75%, 0.875%, 0.4375%, 0**. The first four scales halve;
Stage 5 is the original unblurred tonal reference. The tonal conversion remains
V44's sRGB luminance mapped to 28–246. At 640 pixels, sigma is 22.4, 11.2,
5.6, 2.8, 0 pixels. Separable kernels truncate at three sigma and clamp edges.

Preview inspection preceded calibration. The first targets retain head/silhouette,
large light/shadow areas and landscape value bands. Intermediate targets recover
eyes/nose, wing forms and the mountain; later targets recover small features and
texture. These are distinct targets, rather than five nearly identical pictures.
The mountain is weak in the broadest Rainier target: recovering it later is a
real demand on the drawing, not evidence it was present initially.

V49 uses V44's material operations and fitting: deposit, lift, blend and broad
correction remain available throughout. Planner49 records material6/stick4;
the recorded contacts still use charcoalVersion4. Stage-dependent analysis,
proposal guidance, attention, fitting and acceptance all use the current target.
Stage-dependent contact scales replace budget-percentage planning. The objective
is uniform pointwise squared tonal error, without V48's evolving multiscale
weights or neighbourhood fits. All accepted changes are recorded material work.
The canvas is retained, never globally blurred, reset or filled with target pixels.

Global error is **100 × sqrt(mean((canvas − target)²)) / 255**, in RMS percent.
Regional error is the nearest-rank upper percentile of tile RMS percentages
on a fixed **8×8 grid**. It measures actual canvas pixels against the current
target, without blurring the canvas to hide patchwork.

| Stage | Global RMS limit | Regional RMS limit |
|---|---:|---:|
| 1 | 3.0% | 5.0% |
| 2 | 3.5% | 6.0% |
| 3 | 4.0% | 7.0% |
| 4 | 4.5% | 8.0% |
| 5 | 5.5% | 10.0% |

Defaults use **P95** and **three consecutive qualifying checks**. Each check
requires **32 newly accepted global operations**. Both limits must hold at
each check. Repeated progress polling, rejected proposals and targeted work do
not count. A transition rebuilds target analysis/error caches and resets the
streak. There are no fixed per-stage operation allowances or forced promotions.

P95 catches four or more bad tiles among 64; three bad tiles can escape it.
A small feature can also be diluted inside a tile. These are tonal quality gates,
not semantic subject-completion or artistic-quality tests. They accept soft forms
that would still benefit from selective edges. Early intentionally blurred light
passages can need substantial lifting when the target sharpens.

## Calibration and evaluation protocol

Four compact complete drawings test broad tone, a narrow light gap, a portrait
and a landscape. They use 160×120 pixels, 600 Paint + 600 Continue, with a
bounded +1200 extension where final criteria are unmet. Broad tone meets the
final gate at operation 896; the gap at 1152; the portrait needs the extension
(1216). The landscape reaches Stage 5 but still fails its final global gate after
2400. Stage 1 of the gap softens the light passage; later stages recover it.

The strict initial gate profile was validated and retained on **Mat, rooster
and Rainier**, then frozen before **Tay, Orca and Wonder Lake** evaluation.
It was not relaxed to manufacture completion. Rainier fails Stage 5 after 5600
operations. Freeze metadata records defaults and source SHA256 values.
These regressions have been used previously; they are not new holdouts.

Full references are prepared from `assets/references` with EXIF orientation,
RGB conversion and Lanczos reduction to at most 640 pixels. Source sizes and
SHA256 values are recorded. Seed42, balanced search, seven candidates/proposal.
Every reference uses 1400 Paint + 1400 Continue. V49 and its unblurred control
receive one bounded +2800 extension only if final criteria are unmet. The extension
tests attainability; it is not compared as an equal-budget win over V44's 2800.

The unblurred control uses the same new planner machinery, but all five targets
are the original. Its strict first gate can keep it in Stage 1; that label does
not mean its original-reference drawing lacks detail. This control separates
staging from pointwise fitting/attention changes, including their interaction
with stage-dependent contact scales.

The study shows fixed 25/50/100/200 prefixes, every actually reached gate with
the target it passed, Paint/Continue/extension ends and matched V44 wall-time
prefixes. A boundary image has just passed the preceding target; its read-only
current stage is the next stage. Unreached gates are explicitly labelled.
Tables retain accepted operations, proposals, candidates, stop reasons, current
stage, criteria status and per-stage wall intervals. Fixed original-target RMSE
is separate from each stage's gate score.

## Results

At the equal 2800-operation allowance, original-target RMSE (tonal units out of
255, lower is better) is:

| Drawing | V44 | V49 unblurred control | V49 staged | Final gate at 2800 |
|---|---:|---:|---:|---|
| Mat | 8.28 | 6.16 | 6.56 | met |
| Rooster | 12.72 | 12.63 | 15.22 | unmet, Stage 5 |
| Rainier | 18.52 | 19.52 | 17.78 | unmet, Stage 5 |
| Tay | 10.19 | 7.63 | 7.68 | met |
| Orca | 11.36 | 11.60 | 10.57 | met |
| Wonder Lake | 9.70 | 8.34 | 7.99 | met |

All six staged drawings reach Stage 5 within Paint. Mat meets its final criteria
at operation 1184; Tay at 1216, Orca at 928 and Wonder Lake at 1056. These four
retain further refinement through Continue. Rooster meets the criteria only in
the bounded extension, at 3520; it ends at 5600 accepted operations/5601 proposals
with RMSE 11.28. Rainier ends at 5600/5600, RMSE 15.15, global 5.941% against 5.5%,
regional 7.930% against 10%: **allowance exhausted, final criteria unmet**.
The other 2800-operation reference passes use 2800 proposals each (19600
candidates). These are measured operation counts, not stage allocations.

Mat and Tay develop smoother connected facial values and clearer features than
V44. The unblurred control achieves similar portrait improvements, and slightly
better Mat error: those gains cannot be credited wholly to staging. Orca keeps
its recognisable silhouette/light markings; Wonder Lake improves broad value
bands and shoreline structure. The staged compact gap restores its narrow light
region after early blur: light damage falls from 100% at the Stage 1 boundary to 5%
at 1200 (damage means original tonal target>220, drawing more than12 units darker).

Rooster is a clear equal-budget regression: softer feather definition, less
distinct body planes and silhouette halos remain. Its light damage is16.2%
at 2800 versus V44's 4.3%, and remains11.4% even at 5600. Rainier's aggregate
error improves, but the mountain/highlight detail is weak: light damage is79.6%
versus V44's 62.1% at 2800, and still67.4% at 5600. Mat improves light damage
18.5%→13.5%, Orca33.2%→30.5%, Wonder Lake64.4%→55.6%; the last uses just90
bright pixels. Tay has only one such pixel, so its light metric is uninformative.
The gallery includes denominators in the underlying measurement records.

Texture remains repetitive and sometimes airbrush-like rather than convincing
charcoal. Selective edges are uneven. The retained V44 fuzzy rectangles are a
deliberately deferred material limitation; the present concern is additional
silhouette/light repair caused by staging. At2800, staged lifts account for 41%
of Mat,45% of rooster and51% of Rainier operations; at 5600 Rainier is55% lifts.
Lifts are useful material corrections, not automatically wasted work, but these
counts and the persistent light damage expose a substantial correction burden.
Almost every proposal is accepted: positive pointwise gain is not proof of useful
artistic progress.

The experiment demonstrates attainable broad-to-fine development and some better
complete drawings. It **does not establish a generally better complete charcoal
process at a defensible cost** across these cases: rooster regresses and Rainier
still misses its gate while losing important lights. Keep V49 unpromoted; do not
interpret five labels or lower average error as artistic success.

## Runtime, lifecycle and costs

The focused side-panel addition appears only for live V49 sessions, including
while painting. It shows the read-only current stage, current/required global
and regional RMS, and qualifying-check streak. A compact selector edits the five
stage-specific limits; percentile and consecutive checks apply across stages.
Reset restores the calibrated values from editable `studio-defaults.js`.
Valid edits apply at a proposal boundary without changing existing pixels or RNG;
they reset the streak and are recorded with their effective operation boundary.
Paused edits also refresh export metadata. No stage skipping, demotion or new
confirmation dialog was added.

The operation allowance is the total for a pass. Exhaustion pauses at the current
stage; plateau reports stalled, not completion. Continue retains pixels, RNG,
effective settings, stage and progression, adding allowance. Stage 5 criteria
met remains editable. Targeted work uses the current stage target and feathered
region, cannot promote the global stage, and resets global readiness on return.
Undo restores relevant progression, gate history, caches, artwork and RNG.

Five Float32 RGB targets cost 60 bytes/pixel, approximately 13.2 MiB at Rainier's
359×640 planning size. Original tonal data is retained separately. Pointwise
candidate scoring scans the affected patch; accepted changes update point and
tile errors incrementally. Gate evaluation sorts only 64 values every 32 accepted
operations. Full target analysis/error rebuilds occur at initialization and four
transitions, rather than every candidate. Grid size/check interval are internal
constants; meaningful gate settings remain user controls.

Three isolated repetitions per development reference/control (27 runs), reversing
variant order on alternate repetitions, include reference decoding/analysis, fits,
raster work, gate checks, transition rebuilds and Continue setup. Captures, gallery
replay and UI preview/export shading are excluded. Median Paint + Continue wall
time at equal 2800 operations:

| Drawing | V44 seconds | Unblurred control seconds | Staged V49 seconds | V49 vs V44 |
|---|---:|---:|---:|---:|
| mat | 10.39 | 10.64 | 10.41 | +0.2% |
| rooster | 15.63 | 22.51 | 12.93 | -17.3% |
| rainier | 20.48 | 31.20 | 19.85 | -3.1% |

Mat is effectively tied overall, but its initial staged Paint is about 13% slower.
Rooster saves wall time while delivering a worse equal-budget drawing. Rainier
has only a modest median saving; observed ranges nearly meet (V49 17.74-20.20s,
V44 20.24-21.47s). Gate evaluation takes about 2-3 ms per development pass pair;
the four stage rebuilds take roughly 0.23-0.30 s. Gaussian/cache setup increases
analysis cost, and broad early contact fits/raster work dominate runtime. These
results support affordable gates, not a universal speed or quality win.

Matched-time gallery prefixes use each study run's actual trace, including its
analysis. If its available recorded stream ends before V44's time, that cap is
labelled rather than inventing further work. The Tay V44 study was repeated in
isolation after the browser checks before those matched-time views were built.


## Verification and recovery

Focused checks verify deterministic default runs for two seeds/all search depths,
exact point/tile caches and patch gains, accepted-work stability, regional rejection
of a good-average canvas with four unfinished tiles, allowance/Continue, an actual
no-improvement plateau, runtime validation, source-free native/2× replay/seek,
target feathering/non-promotion and exact Undo. Historical oil and charcoal40–48
generation, Continue, RNG and native/2× replay match the saved pre-V49 engine;
V44's planner source is byte-for-byte unchanged.

Real Chrome checks exercise gate edits while running, invalid edits, calibrated
reset while paused, Pause/Resume, Continue, live-session scope after changing the
next-painting selector, actual targeting/Undo, 2× PNG export and imported-session
control hiding, plus an edit immediately followed by End pass. A controlled worker
check injects an edit during asynchronous terminal shading and verifies that the
final snapshot/progress retain the latest settings. These final runtime fixes do
not alter planner operations or frozen thresholds. Browser comparison checks
verify native canvas replay for fixed,
stage and matched-time views plus responsive/thumbnail layout. Archived V47/V48
drawing streams retain their original RGBA hashes. Generated bulk stays ignored.

The package contains one standalone comparison/study, the standalone studio,
30 canonical final streams,
frozen sources/defaults, measurements, checks and a dependency-free `restore.cjs`.
Extract it separately; open `comparison.html`, or run `node restore.cjs` to recreate
native PNGs/JSON and verify RGBA SHA256 values without references/network. The
canonical streams occur once inside the standalone study to avoid duplicate
operation arrays in the ZIP. Ordinary
artwork JSON preserves artwork replay and inspection metadata, including gate
history and stage boundaries. It **does not restore the live optimizer**.

Reproduction from the studio directory: `python v49-prepare.py`,
`node v49-study.cjs --compact`, `node v49-study.cjs --calibrate`, freeze defaults,
`node v49-study.cjs`, `node v49-study.cjs --regression`, `node v49-timing.cjs`,
`node v49-build-review.cjs`, `node v49-verify.cjs`, `python v49-package.py`.
The supplied freeze file is evidence from this run; reproducing the experiment
must not tune on regression outcomes. `node build.cjs` regenerates the studio.
