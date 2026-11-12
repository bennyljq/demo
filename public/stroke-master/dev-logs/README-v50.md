# V50 ? Purposeful swept shading and defining strokes

V50 is the unpromoted challenger; V44 remains stable/default. Frozen V49 is the causal comparison and recovery control. V46?V48 development remains paused. There is no commit or automatic promotion.

[Complete progression/comparison](../artifacts/v50/comparison.html) ? [Fixed-state contact study](../artifacts/v50/contact.html) ? [Comparison/recovery ZIP](../artifacts/v50/comparison-package.zip) ? [Historical restoration](../archives/index.html).

The result is mixed. Long accents alone improve equal-operation tonal error on all six references. Combined V50 improves rooster and Orca, reduces measured light damage on several cases, and substantially reduces wall time. Broad sweeps lose some equal-operation value accuracy on Mat, Tay and Wonder Lake. Rainier remains unfinished after the bounded extension. A larger reachable repertoire has been demonstrated; a generally better complete drawing has not.

## Concrete restrictions removed

V41 starts broad travel at 2.3? contact width (tip/edge at 3.1?). Its scale base depends on a four-phase mapping. V42 walks connected accents at 1.5? width, clipped to 2?6 pixels, for only 16 steps each direction, with a separate 8.5%-of-image travel cap. Thinning can reduce travel. V44's residual PCA adaptation can straighten broad contacts and caps their length at 6? width. V49 maps stage to these phases, so finer targets also change which geometries are offered.

V50 replaces the two broad and two connected alternatives in Balanced search, retaining two compact corrections and blending. Broad/long gestures bypass the V44 PCA straightening and length/width cap. A step is max(1.5 pixels, long edge/80), independent of width. Each direction walks at most 32 steps, limited to 32% of the edge for broad shading and 42% for defining gestures. Direction, curvature, target-tone compatibility, residual sign and canvas bounds can stop travel sooner. A bounded cubic is fitted to the walk; excessive departure shortens its support rather than triggering a ribbon search.

Broad width starts at 10.5% of the long edge and shrinks through up to five transverse evidence checks. Defining width is clamp(0.4% of the long edge, 1.2, 4 pixels). Neither is selected by stage number. Local evidence supports modest three-knot width and pressure evolution. Entry/exit taper responds independently to blocked or compatible continuation. Broad edge softness is 0.7; defining softness is 0.16. These are internal proposal defaults, not new user controls. Width, pressure, sharpness, length and terminations are recorded independently. Pressure changes quantity and pickup, including lifts, without narrowing swept support. Compact contacts retain the inherited repertoire and phase scales. Broad repair and defining proposals remain reachable through every stage, Continue and feathered targeting; rejected alternatives receive no diversity reward.

## Realized contact and cost bounds

New operations use charcoalVersion8, planner50/material10/charcoal-stick-8. Compact corrections/blending can retain charcoalVersion4 inside that new material identity. All prior identities and implementations are retained exactly, including frozen V49 material6/stick4.

A sweep is one cubic, one contact width, three width multipliers, three pressure multipliers, edge softness and two termination fractions. Rasterization resolves nearest swept support once per pixel, using unsigned transverse distance through bends. Contact accumulates once, not once for each path segment. Overlapping separate operations retain ordinary charcoal accumulation. There is no random outline noise, replacement of all rectangles by ovals, forced outline, silhouette mask, white pigment, particle simulation or V45 ribbon search. Fits, scoring, application and replay dispatch the same realized contact.

Fast/Balanced/Thorough retain 3/7/12 alternatives. Fast sign-selects broad/defining/blend contacts, with short passage fallbacks; Balanced supplies the explicit compact alternatives. No accepted-family quota is enforced. In Balanced, replacement avoids fitting discarded originals. Broad/long alternatives each use one ordinary strength fit; only the retained compact alternatives need V44 residual adaptation. Raster work depends on travelled footprint and curvature, so individual long contacts can cost more than short ones even though total measured work falls. Curve subdivision remains bounded to 96 segments; existing patch/memory guards remain effective.

## Frozen stage machinery and lifecycle

The five cached tonal targets are unchanged: Gaussian sigma 3.5%, 1.75%, 0.875%, 0.4375% of the long edge, then the original target. The actual material canvas survives transitions. Current-target pointwise fitting, attention, acceptance and regional errors are unchanged.

Global RMS thresholds remain 3, 3.5, 4, 4.5, 5.5%; regional P95 of an 8?8 tile grid remains 5, 6, 7, 8, 10%. Three consecutive qualifying checks each require 32 newly accepted global operations. Tiny features diluted inside tiles, or failures occupying at most three tiles, can escape P95. UI polling, rejected proposals and local refinement do not promote stages. A plateau is stalled; allowance exhaustion pauses the current stage. Stage 5 criteria met remains editable.

The existing runtime gates, calibrated reset, Pause/Resume and Continue are preserved. Changes apply at proposal boundaries and reset the streak without changing pixels/RNG/stage. Targeted work uses the current target and feather; returning to global work resets evidence. Undo restores artwork, progression, effective settings and RNG. Ordinary artwork JSON records inspection metadata and source-free artwork, not optimizer restoration. Normal selection contains only V44 Stable and V50 Challenger; V49 is available through archive/recovery.

## Complete-drawing protocol and ablations

Development: Mat, rooster, Rainier. Geometry and defaults were frozen before Tay, Orca, Wonder Lake; no regression tuning. These are established regression references, not novel holdouts. Prepared V49 pixels are reused from the original references now under assets/references; their hashes are included. No gates, blur targets, attention or objective were loosened.

All four variants are frozen V49, broad sweep alone, long accent alone and combined V50. Reference runs use 1400 Paint + 1400 Continue, with one total allowance per pass across stages. Compact complete drawings use 600 + 600. Every run records 25/50/100/200 prefixes, all reached stage boundaries and assessed targets, pass ends, stage reached, accepted operations, proposals and wall time. Unreached gates are labelled explicitly.

Rooster/Rainier primary V49 and combined V50 receive a labelled +2800 extension solely to answer whether the unchanged final gate and light recovery are attainable. It is not an equal-2800 comparison. Mat, all regression cases and ablations receive no extension. Matched-time views use both V49 and combined V50 pass times; prefixes can include these clearly labelled extensions. When an available stream ends before a time budget, the view reports the cap instead of inventing work.

The prior unblurred control is not used as a clean blur-only experiment: being trapped at its strict first gate also changes inherited contact scales. Frozen V49 is the primary causal control.

Original-target RMS error in tonal units out of 255, at exactly 2800 accepted operations (2800 proposals and 19600 scored candidates in all primary reference passes):

| Drawing | Frozen V49 | Broad only | Long only | Combined | Combined final criteria |
| --- | --- | --- | --- | --- | --- |
| mat | 6.56 | 7.68 | 6.31 | 7.33 | met |
| rooster | 15.22 | 15.03 | 13.88 | 13.90 | unmet, Stage 5 |
| rainier | 17.78 | 18.39 | 17.64 | 18.04 | unmet, Stage 5 |
| tay | 7.68 | 8.44 | 7.51 | 8.25 | met |
| orca | 10.57 | 10.62 | 10.30 | 10.42 | met |
| wonder-lake | 7.99 | 8.55 | 7.91 | 8.44 | met |

All combined runs reach Stage 5 within the initial 1400. Final criteria: Mat at 1312, Tay 1280, Orca 992, Wonder Lake 1088. Rooster remains unmet at 2800 and passes at 2816 during the bounded extension; its 5600 result is RMSE 9.94 (V49 11.28 at the same 5600, first passing at 3520). Rainier remains unmet at 5600: combined global 6.053% against 5.5%, regional 7.988% against 10%, original RMSE 15.44; V49 RMSE 15.15/global 5.941%. These are allowance stops, not successful completion. Rooster V49 needs 5601 proposals for 5600 acceptances; all other extension runs need 5600.

Compact final errors, 1200 operations:

| Case | V49 | Broad | Long | Combined |
| --- | --- | --- | --- | --- |
| broad | 3.67 | 4.08 | 3.77 | 4.19 |
| overlap | 3.85 | 4.06 | 3.82 | 4.07 |
| curve | 6.00 | 4.86 | 5.78 | 4.24 |
| dark-line | 3.52 | 3.79 | 3.30 | 3.48 |
| lift-line | 7.14 | 7.05 | 7.12 | 6.59 |
| boundary | 5.24 | 4.95 | 4.80 | 4.98 |
| gap | 6.11 | 5.39 | 5.47 | 4.86 |

Every compact run naturally reaches Stage 5 and meets its final gate. Combined curved-passage error is 8.99 at 600 versus V49 16.92; its final gate passes at 704 versus 928. Narrow-light recovery passes at 1024 versus 1152 and ends at RMS 4.86 versus 6.11. Smooth tone/overlap remain worse at equal 1200, despite the lower compute cost. This is a construction/detail recovery win on selected cases, not universal fragment reduction.


## Contact evidence and operation economy

The fixed-state study includes smooth tone, overlapping shading, a curved passage, dark/lifted thin lines, hard boundary beside soft tone, and narrow light recovery. Four planners see the same canvas and anchor at explicitly bound Stage 1/5 targets. All 392 candidates are inspectable with strength, gain, travel, width and accepted/positive-losing/nonpositive decisions. A manually bound diagnostic stage is not evidence of natural advancement. The complete sequences supply that evidence.

The single curved sweep/overlap checks establish one deposition per pixel and agreement between fitting mask and applied coverage. Curvature and termination swatches are replayed without sources. Pressure tests establish identical swept support with changed lifting quantity. This guards seams/double accumulation; it is not proof that every composition has convincing charcoal texture.

Stage 5 normal planning, combined runs at 2800. Long-sharp means travel >=15% of long edge, travel/width >=10, softness <=0.24. Broad corrections below count only swept contacts >=5% of the edge, excluding blending:

| Drawing | Proposed long-sharp | Accepted long-sharp | Accepted broad sweeps |
| --- | --- | --- | --- |
| mat | 175 | 21 | 135 |
| rooster | 127 | 36 | 29 |
| rainier | 8 | 2 | 40 |
| tay | 103 | 15 | 195 |
| orca | 43 | 13 | 75 |
| wonder-lake | 138 | 26 | 180 |

At fixed dark-line Stage 5, V49?s winning region deposit travels 7.1 px at width 5.7, pointwise gain 8.00; the combined sweep travels 97.8 px at width 3.3, gain 89.36. On the corresponding lifted line, winning travel is 31.4/83.8 px and gain 10.37/55.47. One useful coherent contact replaces a small patch in those states. Positive long alternatives can still lose to a better sweep; the contact table includes those decisions rather than only winners.

Across whole drawings, short-contact counts increase: Mat 1134?1352, rooster 1382?1514, Rainier 1660?1857 (out of 2800). Nearby opposite-kind proxies are 49?54, 56?55, 87?54. Lift counts are 1138?1122, 1263?1162, 1433?1342. This does not establish fewer unnecessary fragments or repairs overall. Faster broad construction and useful long gestures leave more allowance for compact cleanup; residual banding still requires repair.


Histograms separately record proposed/accepted width, travel and travel/width by stage, family and operation. Width/travel bins are in fractions of long edge (powers of two /256); ratio bins are powers of two. Counts, means and histograms live in diagnostics.json and recorded snapshot metrics. They are diagnostics, never search rewards.

Nearby opposite operations are a crude deposit/lift locality proxy: an opposite-kind contact among the prior five has a cubic midpoint within max(widths). It can count useful correction and miss curved overlap. It does not establish waste. Likewise, short travel <4% of the edge is not inherently unnecessary. The meaningful fragment reduction is shown on coherent passages through accepted long contacts and complete recovery, not by declaring every small mark wrong.

## Repeated wall time

Median complete 1400 +1400 wall seconds (three repeats), including all planning work:

| Drawing | V49 | Broad only | Long only | Combined | Combined vs V49 |
| --- | --- | --- | --- | --- | --- |
| mat | 9.97 | 6.79 | 10.08 | 6.70 | -32.8% |
| rooster | 12.72 | 8.27 | 12.70 | 8.35 | -34.4% |
| rainier | 17.39 | 9.66 | 17.58 | 9.45 | -45.6% |

Broad changes account for most of the saving. Long-only is approximately cost-neutral here. This is not an equal-quality speedup on Mat/Rainier: combined final error is worse. The stage analysis remains the same; fewer broad support adaptations and simpler continuous contact evaluation replace repeated residual/PCA fits. No extra alternatives or score searches are added.


Three isolated repeats of all four variants on all three development references alternate ordering. Every repeat includes reference decode, initial analysis/blur caches, candidate construction, fits, raster work, application, incremental errors, gate evaluation, stage rebuilds and Continue setup. PNG capture, review replay, offline diagnostics, exports and UI shading are excluded. Small bounded geometry histograms are collected for both controls. Painting benchmarks do not run concurrently with browser/painting checks. Repeat operation-stream hashes must match the complete runs exactly.

## Quality, character and remaining failures

Mat remains recognisable with coherent facial masses. Long-only is the quieter value result; broad/combined leave conspicuous diagonal contacts and some facial plane flattening. Rooster?s neck/feather passages are clearer with long gestures, and combined retains substantially more bright background around the silhouette. The tail/body still contain broad bands and several indistinct feather joins. Rainier?s peak and reflection retain damaged lights and weak fine definition; broad sky diagonals persist. Geometry helps light preservation somewhat but does not solve blur-induced spill. Tay?s face/hair are recognisable and long-only preserves values best; combined adds visible sweeping bands across face/background. Orca?s silhouette and white patches are retained with a small combined error improvement. Wonder Lake remains recognisable, with larger visible tonal passages but coarser shoreline/tree definition in broad/combined.

The new swathes reduce the stamp-like character of broad contacts, but do not remove patchwork everywhere. Directional repetition and smooth/airbrushed areas remain. Selective edges improve on coherent lines/feathers; this does not amount to convincing charcoal consistently.

Light damage at 2800:

| Drawing | V49 | Combined | Pixels tested |
| --- | --- | --- | --- |
| mat | 13.5% | 10.7% | 4606 |
| rooster | 16.2% | 6.1% | 189545 |
| rainier | 79.6% | 71.2% | 3842 |
| tay | 0.0% | 100.0% | 1 |
| orca | 30.5% | 27.1% | 1312 |
| wonder-lake | 55.6% | 30.0% | 90 |

Rooster halo-proxy damage improves 67.8%?30.0% of 26816 ring pixels; substantial halos remain. Rainier?s corresponding ring damage improves 82.5%?73.7% of 2905 pixels. At 5600, overall light damage is rooster 11.4%?2.6%, Rainier 67.4%?59.6%, while Rainier?s final gate is still unmet. Reduced damage is not full light recovery.


Light damage is the fraction of original tonal pixels >220 drawn more than 12 units too dark. The background halo proxy additionally limits those light pixels to an 8-pixel square of a target pixel <170. It is measured offline and never clips a stroke. It cannot establish an accurate silhouette. Tay has only one qualifying light pixel and Wonder Lake only 90, so those percentages need particular caution.

## Verification and recovery

Focused checks cover exact historical oil/charcoal40?49 generation, Continue/RNG and native/2? replay against saved frozen V49; both seeds at all search depths; unchanged candidate counts; exact pointwise/tile caches and full-canvas gains; gate/streak/settings/plateau/allowance semantics; targeting/Undo; Stage 5 continued editing; mixed identities; and pressure-independent support.

Real Chrome checks exercise running edits, invalid edits, Pause/reset/Resume, Continue, actual target gestures/Undo, End-boundary edits, panel scope, new-session readout and 2? exports. A controlled worker edit during terminal shading must appear in the final snapshot. Review and contact canvases are checked against independent source-free replay, including every selector, native/thumbnail and 480-pixel layout. Historical studies remain available.

All focused checks passed. Chrome verified 778 progression/time canvases and 567 fixed-contact views, with zero script exceptions; the 33-study historical archive retained exact sample replay. The independently extracted ZIP restored and SHA-verified 52 complete drawings plus 408 fixed-contact records (460 PNG/JSON pairs), without sources.

One ZIP contains standalone comparison.html, contact.html, studio.html, this report, effective frozen defaults/sources, measurements, repeated timings, diagnostics/checks and recovery code. Final complete streams are embedded once in the comparison; fixed candidates are embedded once in the contact study. Run node restore.cjs after extraction to restore native PNG/JSON and verify recorded RGBA SHA256 values without references, network or packages. Bulk captures/streams stay outside Git in ignored artifact roots. No commit or promotion.
