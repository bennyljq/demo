# V14: geometry-led planner evaluation

The studio now offers exactly **V12 control** (default, planner 11/material 2/no collateral penalty) and **V14 experimental** (planner 14/material 2). This is the authorised manual comparison integration, not adoption of V14 as the preferred planner. V13 implementation and evidence are preserved. Open [the studio](index.html) or [the comparison gallery](artifacts/v14/comparison.html).

Recommendation: **revise one specific mechanism in a later iteration**: footprint fitting currently takes the smallest compatible width over the entire path. Investigate shortening an incompatible path before narrowing its whole contact, to preserve broad coherent construction. Do not adopt or prune either implementation before user visual review. V14 gives substantially cleaner rooster foot gaps with less candidate work, but weaker broad construction, a less resolved eye and a clear contrasting-background regression prevent an overall quality claim.

## Provenance and inspection

Incoming tracked work was clean. No reset, branch switch or commit was made. All changes and evidence stay inside `stroke-master/`. No project/ancestor instruction file was found in the accessible workspace. Current HANDOFF, README, archived README-v2/README-v3 and V12/V13 recovery reports were read. Separate original v1–v3 prompt files were not found; the archived READMEs provide the equivalent documented principles, without claiming recovery of the historical implementation.

The principal control is the exact incoming-v12 engine preserved at `artifacts/v13/engine-before.txt`, SHA-256 `0b6a37f5f865d41de489b18f93e8e918d903671495436c045ae718ad1cf68bc8`, verified against the existing V13 freeze. The canonical source is reconstructed from that source, with only explicit selector/session/experimental dispatch changes. It is not an approximation obtained by deleting parts of V13 scoring. The incoming V13 engine and HANDOFF are saved as inert evidence in `artifacts/v14/engine-v13.txt` and `handoff-before.txt`. Earlier files are hash-checked against [history-before.json](artifacts/v14/history-before.json).

Inspection found that ordinary proposals still trace orientation, stop at colour transitions and sample normal thickness. Normal samples use three positions per side at one central point, on blurred references; width changes during that scan. `constrainStroke` checks 13 centreline positions and shortens twice, but immediately bypasses edge repairs. Broad repairs use a coarse coherent residual flood (at most 48×48 cells), followed by an axis-aligned contact with no comparable footprint geometry fit. Resized variants and extra repair variants inherit those limitations. Current ordinary tracing does not explicitly test priority transitions; masks mostly guide attention/order. These findings motivated construction checks rather than another acceptance penalty.

## Experimental boundary

One implementation lives in [experimental/v14-planner.js](experimental/v14-planner.js). A lazy, explicit branch in `candidatesFor` invokes it only for a V14 session. It receives shared numerical helpers directly; there is no registration/plugin framework or second app. V12 construction/search remains byte-equivalent to the frozen engine. Both choices share analysis, palette, enabled brush library, foundation, scheduling, structural objective, absolute acceptance threshold, budgets, material 2, canonical rasteriser, document validation, timeline and export. The worker protocol is unchanged.

V14 constructs three informed single-contact candidates, varying compatible brush and geometry. Search depth remains recorded and available for V12; V14 deliberately keeps its shortlist at three for every depth. It does not call the control broad-repair search or its additional repair variants, including during targeted refinement. Existing residual attention and local allocation remain shared.

Orientation confidence selects tangent tracing or the shared weak-orientation fallback. Eight fixed normal samples per side estimate thickness without moving the sample grid mid-scan. Three bounded fitting rounds inspect nine path positions and four shoulder positions, conservatively accounting for brush spread and pressure. Colour/soft-priority transitions shorten or narrow the recorded contact. Early construction uses shared coarse reference scales; detail uses native reference pixels. Canonical brush pressure/release/texture and target feathering still govern actual deposition. There is no reference segmentation cutout or new material rule. No anatomy, background-colour assumptions or size-population quota are introduced. Sampling remains an approximation and can miss transitions between samples.

The first short run fitted construction against native feather-colour differences and left much of the rooster unpainted. One concrete correction aligned early geometry sampling with the existing construction reference scales. The poor initial pigment images/statistics remain labelled `first-fit-*` evidence; no alternate implementation or tuning loop is retained.

## Session and replay behaviour

Paint captures the selector into a non-writable session field. Continue, Resume, local passes and Undo retain it; snapshots derive both plannerVersion and settings.planner from that field. The selector is disabled while generating/pausing, and enabled when paused or complete with an explanation that it applies to the next Paint. Changing it does not clear reference pixels, priority marks, seed, settings, stroke record or displayed painting. The painting header identifies the active planner independently of the selector and remains visible across tabs and on narrow screens.

Imported documents use their recorded strokes/material. Selector changes never activate a planner for replay. Planner-13, planner-11 and legacy/unrecorded metadata remain historical inputs; only new generation dispatch is restricted to V12/V14. Global cancellation retains the last saved snapshot; local cancellation retains accepted work and Undo, as before.

## Matched experiment and visual findings

Rooster: identical decoded 632×461 pixels from the existing V8 evidence, seed 42, Fine, Balanced, quiet body .65, curated brushes and Neutral. The existing V9 allocation schedule is unchanged: 1400/5600 initially, then additions 700/2800, 700/2800, 7000/28000, 7000/28000. Every boundary stops normally at its operation cap. Images capture 1800, 5000, 10000, 15138 and final 16800 accepted operations. Full control strokes exactly match the frozen V13 experiment's V12 control record.

At 1800, V14's standing foot, lifted toes and silhouette gaps are already more cleanly fitted, but its tail has open ribbon gaps and the subject is less broadly filled than V12. At 5000 and 10000 the feet remain readable, while V12 has a clearer developing face and smoother feather construction. At final, V14 removes much of the pale debris around both feet and the back/neck border. Its eye is smaller and less resolved; the breast/tail remain more visibly assembled from narrow contacts. Both retain useful broad dark tail/body marks, but V14 uses fewer: final non-foundation scale counts are 46 large/130 medium/16612 small versus V12's 113/276/16399. Thus cleaner borders partly coincide with reduced broad work; this is a material artistic limitation, not a complete success.

Identical Neutral shows strong horizontal foundation bands in V14's relatively uncorrected background. Some large tail/contact relief remains. Pigment cleanup is separable from relief quality; lighting was not adjusted to conceal ghosts. Whole paintings and feet, eye, neck, tail, background and silhouette-gap crops are included with sources in the gallery.

The controlled 160×112 thin sinusoidal curve remains readable from the early 180-operation checkpoint through 360, with less neighbouring pigment than V12. It does not establish general thin-feature recovery. The existing contrasting blue/ochre silhouette fixture at 192×128 regresses at 360: V14 leaves broken background strokes and a mottled body, while V12's broad repairs establish coherent regions. Short-fixture final work: thin V12 420 proposals/2888 candidates/.90 s candidate work; V14 473/1395/.53 s. Contrast V12 388/2942/1.40 s; V14 370/1086/.51 s. All reach their 360-operation caps.

| Final rooster | V12 control | V14 experimental |
| --- | ---: | ---: |
| Accepted operations / contacts | 16800 / 16800 | 16800 / 16800 |
| Consumed proposals | 20545 | 19368 |
| Evaluated candidates / contacts | 145971 / 145971 | 58080 / 58080 |
| Rejected proposals | 3745 | 2568 |
| Measured candidate work | 45.37 s | 21.12 s |
| Wall time including analysis/checkpoint capture | 46.25 s | 21.86 s |
| Structural error | .0004605 | .0010945 |
| Sampled process peak RSS | 259.8 MiB | 334.9 MiB |
| RSS increase from side's start | 202.4 MiB | 57.0 MiB |
| Sampled array-buffer increase | 99.4 MiB | 56.4 MiB |
| Shared final memory guard estimate | 160.8 MiB | 160.8 MiB |

Timing is one local run per final side, not a benchmark confidence interval. `workTimeMs` measures step/candidate work. Wall includes checkpoint image capture but excludes final replay/export. RSS is sampled every 128 proposals in the same process; V14 starts after control and retained JS/allocator activity, so neither its higher absolute peak nor lower increment demonstrates a memory improvement. V14 adds no persistent image-sized planner arrays. [Full statistics](artifacts/v14/full-statistics.json) and [short statistics](artifacts/v14/short-statistics.json) record counters, checkpoints, stopping reasons and memory context.

Approximately matched candidate work compares V14 final (58080 candidates/16800 operations) with the nearest accepted control prefix (58084/7458). V14 is further resolved and cleaner at the feet there; this differs from equal accepted-operation comparisons and is not equal wall time. Preferred historical V2 is replayed at 1800 and 15138 solely as an artistic reference, using its recorded legacy material 1. Its original settings/runtime remain unknown.

## Validation and integration review

Completed commands: `node build.cjs`, `node v14-test.cjs`, `node v14-regression.cjs`, `node v14-browser-smoke.cjs`, and `node --expose-gc v14-experiment.cjs short` / `full`.

Five focused numerical groups pass: frozen source provenance and exact control decisions/material across three fixtures × three depths, Continue and targeted passes; deterministic V14 records and three-candidate accounting; valid records/exact replay/local-full scoring; unchanged historical evidence/build consistency; and an exact source comparison after removing only authorised integration points. Eleven maintained V7 regressions pass through a small adapter that updates the expected default planner metadata and directs all output to V14 rather than overwriting V13 evidence.

Fourteen focused real Chrome 154 groups pass for both selections: active identification, preservation on selector change, session-bound Continue, real pointer refinement, local pause/resume/cancel/Undo, changing the next planner while locally paused, new Paint binding, global cancellation, recorded JSON provenance, actual 2× PNG equality to canonical replay, source-free imports, backward/forward timeline and preserved planner-13 replay. Sandboxed Chrome timed out before testing; approved local execution passed. No Firefox/full unrelated UI matrix was run. Evidence: [tests.json](artifacts/v14/tests.json), [regression verification](artifacts/v14/v7-regression/verification.json), [browser-smoke.json](artifacts/v14/browser-smoke.json).

The superseded unchanged-production check is replaced by source review and exact frozen-control equivalence. Changes are limited to engine dispatch/session metadata plus restoring the frozen V12 scoring source; app binding/labels/selector state; studio template; build embedding; regenerated studio/lab engine copies; the experimental implementation; V14 tests/evidence and current documentation. Worker, brush renderer, material, common numerical helpers, lab UI/template, light controls, styles and earlier evidence remain unchanged. The lab was regenerated because it embeds the shared canonical engine; no planner selector was added there. No dependency, new material rule, second studio or V13 runtime option was introduced.
