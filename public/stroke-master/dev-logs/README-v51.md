# V51 — Expressive charcoal contact and shading gestures

V51 is implemented as **planner51 / material11 / charcoal-stick-9**. V44 remains stable/default; normal selection is V44 Stable and V51 Challenger. V50 is frozen and available through the archive. No promotion or commit. Oil, studio layout, V49 targets/gates and historical material identities are preserved.

**The full acceptance question is not established.** Ordinary opening strokes have more convincing directional relationships and pressure release, and final drawings remain recognisable. However, combined V51 loses tonal accuracy on every complete case and needs more construction/correction before the sharper targets. Contact-only is the more promising change. Faster timings do not establish artistic improvement.

[Comparison gallery](../artifacts/v51/comparison.html) · [Contact/selection study](../artifacts/v51/contact.html) · [Recovery ZIP](../artifacts/v51/comparison-package.zip) · [Frozen V50](README-v50.md).

## Diagnosis from actual V50 Mat operations

The supplied 25/200 screenshots and all three shading examples were inspected directly. `v51-trace.cjs` reruns frozen V50 with seed 42, balanced search, and records each accepted operation, its anchor/coherence, all seven fitted candidates and their ordinary gains. Diagnostic extra evaluations do not change RNG or selection; their timings are not performance evidence.

| Accepted prefix | Swept deposits | Compact region deposits | Weak / −20° anchors | Sweeps with constant width |
|---|---:|---:|---:|---:|
| 25 | 25 | 0 | 25 | 22 |
| 200 | 129 | 71 | 187 | 102 |

All first 25 widths are 47.25 pixels and opacity is capped at .95. Their pressure knots are mostly .89–1, even when not literally constant. Twenty-one use short .045 terminations at both ends. By operation 200, broad widths fall onto the repeated 47.25, 34.02, 24.49, 17.64 and 12.70 shrink ladder. Saturated interiors, nearly constant profiles and equal stops make the visible tape pattern; .7 edge softness softens sides without changing that structure.

Alternatives do exist: every first-25 proposal contains a positive compact deposit and a positive long deposit. Nevertheless, median winning broad gain is about 2658; the largest positive compact gain in that prefix is about 624. There are 702 positive losing candidates through operation 200. Broad coverage wins ordinary tonal evaluation. This is primarily a proposal/contact limitation, rather than a diversity penalty or fitter erasing useful expressive geometry. The fitter changes quantity, not these swept profiles. No objective change was made.

## Compact contact and bounded proposals

V51 keeps V50's nearest swept cubic support and deposits once per pixel. Recorded width/pressure knots and unequal termination distances now accompany cross-stick load bias, breakup amount and channel drift. A small seeded table gives directional grooves and uneven entry/release rates. Grooves follow gesture coordinates; paper tooth remains anchored in paper coordinates. Low-pressure unloading reveals gaps, while dense quiet contact remains available. End variation changes release rate inside the path, avoiding the curled extensions seen in an earlier development trial. Lift remains proportional to pressure; blending keeps the inherited conservative material exchange.

Reliable structure retains target tangents. Ambiguous areas use a smooth seeded field across cells of 22% of the long edge, with bounded angular variation and continuity along travel. Adjacent anchors share the field; angles are not independently sampled at each anchor. Broad initial widths vary continuously from 9% to 11.8% of the long edge; transverse tone evidence reduces them continuously. Travel retains its independent bounded walk. Pressure may build or unload, contact width can ease, and quiet or abrupt-ended contacts remain possible. Sharp long deposits/erasures, compact correction and blending remain available at every stage.

The same 3/7/12 candidates are fitted and scored. Four redundant alternatives are replaced; no extra geometry grid, particles, novelty score, family quota or accepted-shape mix is added. The realised material footprint is used for fitting, scoring, application and replay. Early rejection outside the support avoids procedural/tooth work on zero-contact pixels; seeded tables are cached with a bounded 128-entry cache.

Five cached targets, pointwise error, incremental regional errors, gate frequency and runtime controls are unchanged. Blur sigmas are 3.5%, 1.75%, .875%, .4375% of the long edge, then zero. Global RMS limits are 3/3.5/4/4.5/5.5%; regional P95 of 64 spatial tiles is 5/6/7/8/10%. Three qualifying checks require 32 new accepted global operations each. Small features can still escape P95. Plateau is stalled; allowance exhaustion retains the current stage. Continue, local targeting, Undo and runtime edits preserve their existing semantics.

## Complete drawings and ablations

Mat and rooster were developed first. Implementation/defaults were frozen at **2026-10-11 14:32:05 UTC**, before Tay and Rainier regression. No regression tuning. Seed 42, balanced search, 1400 Paint + 1400 Continue; every complete run accepted 2800 operations from 2800 proposals / 19600 candidates. Each pass's allowance spans stages. Seven compact complete cases use 600 + 600.

Original-reference RMS in 0–255 tonal units:

| Case | Frozen V50 | Contact only | Proposal only | Combined V51 |
|---|---:|---:|---:|---:|
| Mat | 7.33 | 7.35 | 7.85 | 8.08 |
| Rooster | 13.90 | 13.58 | 15.64 | 15.71 |
| Tay, regression | 8.25 | 8.28 | 8.54 | 8.62 |
| Rainier, regression | 18.04 | 18.04 | 18.20 | 18.30 |

Contact-only uses V50 geometry with the new renderer. Proposal-only uses new geometry/pressure profiles with the unchanged V50 renderer. Combined is the normal V51 session. Compact results likewise favour contact-only over combined on several accuracy/detail cases; the narrow-light region still needs substantial correction.

Direct image inspection finds less uniform parallel construction in Mat and more varied, related broad passages in rooster. New openings still contain straight bars and hard contacts; they are not fully convincing hand charcoal. At the final allowance, Mat retains eyes, nose and light, but its values are less accurate. Rooster retains feather/leg structure but is softer and less resolved than V50. Tay's features remain clear and facial bands are less uniformly parallel. Rainier remains weak around the mountain under either planner. Dense directional bars and inherited compact texture are remaining limitations. Parameter diversity was not used as evidence of quality.

Combined Mat first enters Stage 5 at 1344 versus V50's 1216; rooster enters at 1792 versus 1376. Rooster ends the initial pass at **Stage 3**, not a finished five-stage drawing. Combined Mat meets final criteria at 1440; Tay at 1408. Rooster ends Stage 5 unmet (global 6.16% versus 5.5%, regional 10.23% versus 10%). Rainier also remains unmet (global 7.18%, regional 9.80%). All four stop at the operation allowance; no threshold was loosened and no extra extension was used.

Light damage (target >220, drawing >12 darker) increases on Mat, 10.7%→14.4%, and rooster, 6.1%→9.1%; it decreases on Rainier, 71.2%→58.5%. Tay has only one qualifying light pixel, so its percentage is uninformative. More blending occurs on rooster and Tay. Useful broad progress survives ordinary evaluation, but the delayed stages and accuracy losses do not establish better operation economy. A trial reducing whole-stroke pressure with residual size worsened development values and was discarded; coherent within-stroke pressure profiles were retained.

The gallery shows actual first 25/100/200 marks (also 50), every reached transition beside its assessed target, both pass ends and capped prefixes at both V50 and V51 wall times. Unreached gates and unfinished Stage 5 criteria are labelled. The contact study includes 392 fixed-state fitted candidate decisions and eight authored witnesses for pressure, dense/broken contact, straight/curved travel, overlaps, lifting and blending. Planner-generated complete compact sequences are in the comparison, including a soft field beside a sharp boundary. Demonstration swatches are not the acceptance evidence.

## Compute cost

Three isolated repetitions per development case/variant, with alternating variant order. Median total seconds, including input decode, analysis, fitting, raster/application, gates, transitions and Continue:

| Case | V50 | Contact only | Proposal only | Combined | Combined change |
|---|---:|---:|---:|---:|---:|
| Mat | 8.153 | 7.653 | 7.907 | 7.967 | −2.3% |
| Rooster | 10.004 | 9.543 | 9.793 | 9.125 | −8.8% |

Mat V50 range is 7.160–8.395 s; combined is 7.854–8.112 s. Rooster V50 is 9.725–10.289 s; combined is 8.905–9.319 s. These are headless painting-work timings, excluding gallery capture, JSON serialization, display shading and exports. Mat's overlapping ranges limit confidence in a small speed difference. Each repeated stream matches its canonical operations exactly. The final implementation retains approximately V50's speed, but sharper-stage recovery takes more operations. Single captured regression runs put combined Tay at 17.41 s versus V50 15.31 s, and Rainier at 11.51 versus 11.02 s; these are not repeated regression benchmarks.

## Verification and recovery

Focused checks cover two seeds and all search depths, exact point/tile caches and whole-canvas versus patch gain, source-free replay/seek/native/2x export, historical oil and charcoal40–50 generation/RNG/Continue against frozen V50, accepted-work gate stability, runtime edits including terminal shading, Pause/Resume, Continue, actual target gestures and exact Undo. Browser checks exercise studio controls, comparison/contact canvases and the historical 33-study archive. V44/V49/V50 material modules and shared dependencies remain byte-identical; the worker is unchanged.

Run from `stroke-master`: `node v51-check.cjs`, `node v51-worker-check.cjs`, `node v51-browser.cjs`, `node v51-verify.cjs`. Studies use `node v51-study.cjs`, `--compact` and `--regression`; isolated timing uses `node v51-timing.cjs`. Rebuilding uses `node build.cjs`. Do not overwrite the freeze manifest to conceal a changed hypothesis.

One metadata row-label typo was corrected after freezing. The original runner is retained; verification proves the exact one-string reporting difference. Generator, fitter, objective, defaults and timing calls stayed frozen. `reporting-correction.json` records both hashes.

The **essential PM ZIP stays below 5 MB**. It includes eight exact native final streams (V50/combined V51 on all four references), their early/stage/pass/time views, 66 boundary/material records, report, timings, checks and recovery code. Only target preview images are reduced to 160 pixels; artwork operations and native replay pixels are unchanged. Bulk ablation/compact-case streams, supplied example photographs and original inputs are omitted. Full 44-drawing and 414-contact recovery evidence remains locally available in the complete study.

Extract and run `node restore.cjs` to verify/recreate the eight complete PNG/JSON records and 66 fixed/material records **without sources**. The extracted package is independently tested without reference inputs. Original optimiser-study reproduction still uses the workspace inputs and runners listed above. Ordinary artwork JSON restores artwork and inspection metadata, not a live optimiser. Frozen V50's existing ZIP remains intact in its archive location. Bulk generation and temporary extraction stay ignored and outside Git.
