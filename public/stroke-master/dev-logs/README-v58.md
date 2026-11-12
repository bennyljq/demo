# V58 — Coordinate structural marks and tonal shading

V58 gives modest, visible improvements on Tay and rooster, and smaller improvements on Mat. It does not resolve Mat's fragmented facial shading or Rainier's patchwork passages. Keep this bounded planner as an unpromoted research result; it is not a replacement for V50's finished-quality benchmark. V44 remains Stable/default, V50 Baseline and the existing V54 Challenger selector remain unchanged. No promotion or commit.

## Causal base and specific gap

The control is frozen V53 material and proposals, original pairwise blending, ordinary pixelwise scoring and V54 **gate-only** defaults. No final tolerance, filtered objective, extra placement fits or V57 transport is enabled. Historical V53's original stricter defaults remain intact. V50 uses its own historical material, proposal construction and gates; this experiment cannot assign its advantage to one of those differences.

Six fixed portrait states and four compact nonportrait synthetic states were inspected with identical before-canvases, RNG and fitting. The isolated tone/structure ablations precede the combined trajectory test. On Mat before operation 300, the original common-anchor deposit gains 27.63; a nearby signed tonal passage gains 34.69 with a shorter, wider horizontal deposit, and a one-sided boundary proposal gains 34.39. On Tay before 1400, the original short lift gains 0.18; a reference-supported light-ridge lift gains 0.64. On Mat before 1400, a short local lift gains 0.53 while a nearby coherent deposit gains 0.93. This is a placement/geometry gap, not evidence that every existing contact is unsuitable.

Tay before 300 still selects the exact original broad blend (48.70 gain); Tay before 1000 selects the original shade deposit (4.56); Mat before 1000 retains its blend (7.27). Useful original opportunities remain available. These are one-step counterfactuals, not proof of a long repair cycle.

After freezing, two production nonportrait states were checked without tuning: rooster before 1400 selects a structural correction (0.72 ? 2.15 gain); Rainier before 1400 retains the original proposal (0.28). These are included in the native gallery and ablation sheet. The soft-ramp/edge and intersecting-passage cases improve through tone guidance (0.75 → 1.27 and 1.32 → 1.62 realised gain). The narrow light gap improves through a lift on the deficient bright side (1.44 → 9.32), and the curved dark line through a longer coherent deposit (11.26 → 16.21). The selected gap/curve operations classify a reliable one-sided boundary; central ridge/line classification remains a separate profile test. Tone alone loses the best original curved-line candidate (11.26 → 10.04). Therefore slot reallocation can sacrifice a useful opportunity; complementary slots and preserved broad proposals matter. See the labelled [ablation sheet](../artifacts/v58/planning-ablation.jpg) and native fixed-state gallery, including the proposed quantities and gains, for the exact effects.

## One bounded intervention

One 5×5 neighbourhood around the ordinary error anchor supplies two tasks. Tone ranks five-sample coherent signed residual passages. It chooses an eight-direction residual-supported travel axis, narrows contact across incompatible residual/value samples, and traces at most 12 steps on each side. Width, endpoint pressure and quiet/broken contact respond to that passage. Structure samples a five-point transverse profile of the **current stage target**, distinguishes a central dark line, light ridge and one-sided boundary, and requests deposit/lift on the deficient side. Direction/contrast/type/required-sign changes stop tracing. There is no original-reference fine-detail access in proposal construction, canvas-edge preservation rule, semantic face rule, segmentation, lookahead or second fit search.

Balanced search still fits/evaluates seven candidates: the original broad deposit, broad lift, erase and blend remain unchanged; two former release/angular slots address tone, and the line slot addresses structure. Fast/thorough retain their original 3/12 budgets. Guided contacts fall back to the original geometry when a usable segment cannot be traced. All operations are ordinary V53 version-10 finite-face contacts on material 12; planner identity alone is 58. One seed draw per candidate, ordinary least-squares quantity fit, scalar realised gain, cached errors and five promotion targets/gates stay unchanged. No role score, quota or outline-first order is used. The renderer is byte-for-byte preserved.

Analysis reads the current stage and canvas on demand; no dense image analysis cache needs incremental invalidation. Each proposal call samples 25 bounded anchors and at most 24 trace steps per guided slot. New work is included in complete generation time. The planning timer includes original gesture construction and quantity fitting, so it is not an isolated analysis-cost figure. Native contact caches have their existing 13-slot bound; the engine reserves the additional independent contact/tooth cache conservatively. Nothing is restored after refinement or overlaid on the display.

## Complete trajectories

Tay and Mat developed the treatment; the implementation/settings hash was frozen before rooster/Rainier, with Mat seed 73 included. No regression tuning followed. Verification later found disjoint guided support for a radius-4 local target; that case now falls back to the original proposal before fitting. The corrective hash is recorded separately in freeze.json. It adds no RNG draws and changes only local targeting, with whole-drawing proposals unchanged. All three painters run 300/1400/2800; Tay has a matched 5600 extension. Actual stage-boundary images and matched-time prefixes are supplied. All control and V50 accepted streams reproduce the earlier frozen evidence exactly.

Original-reference RMS and reference-supported edge RMS are diagnostics, not artistic scores. Grain energy does not measure whether the grain is purposeful.

| Case / seed | Painter | Operations | Original RMS | Reference edge RMS | Quiet grain RMS |
| --- | --- | --- | --- | --- | --- |
| tay / 42 | control | 5600 | 6.480 | 1.326 | 1.993 |
| tay / 42 | v58 | 5600 | 6.058 | 1.174 | 2.045 |
| tay / 42 | v50 | 5600 | 6.372 | 1.102 | 2.621 |
| mat / 42 | control | 2800 | 11.146 | 2.951 | 4.073 |
| mat / 42 | v58 | 2800 | 10.945 | 2.751 | 4.175 |
| mat / 42 | v50 | 2800 | 7.331 | 1.859 | 1.600 |
| mat / 73 | control | 2800 | 11.315 | 2.885 | 4.173 |
| mat / 73 | v58 | 2800 | 10.873 | 2.699 | 4.174 |
| mat / 73 | v50 | 2800 | 7.213 | 1.834 | 1.479 |
| rooster / 42 | control | 2800 | 16.385 | 4.343 | 2.703 |
| rooster / 42 | v58 | 2800 | 15.267 | 3.760 | 2.818 |
| rooster / 42 | v50 | 2800 | 13.900 | 3.573 | 1.624 |
| rainier / 42 | control | 2800 | 19.890 | 3.794 | 5.115 |
| rainier / 42 | v58 | 2800 | 19.528 | 3.593 | 5.453 |
| rainier / 42 | v50 | 2800 | 18.039 | 3.478 | 2.992 |

Tay's mouth/nose and hair-to-face transitions are more convincing than the control at 5600; the silhouette and light remain sound. Rooster has a cleaner neck/body/leg organisation with fewer stray grey contacts around the silhouette. Mat shows a modest edge improvement in both seeds, but the same fragmented cheek/forehead modelling remains. Rainier retains plausible large planes and the tree, yet angular marks and mottled sky/water still dominate; its numerical improvement is not a major artistic gain. V50 remains smoother and more deliberate in facial planes and grouped passages, despite V58's lower Tay original-pixel error. No automatic outlining appears in the full drawings. Stage 5 does not erase the small grain advantage seen at the final V58 states, but it also does not solve the organisation deficit.

At 300, broad contact construction is still far less efficient than V50. At 1400, earlier transitions sometimes expose fine-stage error sooner; compare each actual target and whole artwork rather than interpreting a stage count as quality. By 2800/5600 the improvement is useful but limited. The fixed-state examples show opportunities for better correction, and stage allocations show less early blending in some cases; neither establishes that an equivalent structure was smoothed and rebuilt wastefully. No operation-count saving claim is made from blend counts alone.

### Actual stage entries and blend use

| Case | Painter | Entries S2/S3/S4/S5 | Operations S1–S5 | Blends S1–S5 | Final qualification |
| --- | --- | --- | --- | --- | --- |
| tay / 42 | control | 672 / 800 / 960 / 1216 | 672 / 128 / 160 / 256 / 4384 | 357 / 83 / 72 / 122 / 1455 | 1600 |
| tay / 42 | v58 | 640 / 768 / 960 / 1184 | 640 / 128 / 192 / 224 / 4416 | 331 / 75 / 78 / 102 / 1358 | 1536 |
| tay / 42 | v50 | 864 / 992 / 1088 / 1184 | 864 / 128 / 96 / 96 / 4416 | 348 / 12 / 1 / 0 / 467 | 1280 |
| mat / 42 | control | 768 / 928 / 1216 / 1696 | 768 / 160 / 288 / 480 / 1104 | 311 / 67 / 110 / 177 / 392 | 2208 |
| mat / 42 | v58 | 768 / 928 / 1216 / 1664 | 768 / 160 / 288 / 448 / 1136 | 299 / 61 / 95 / 145 / 394 | 2144 |
| mat / 42 | v50 | 768 / 928 / 1120 / 1216 | 768 / 160 / 192 / 96 / 1584 | 249 / 4 / 2 / 0 / 34 | 1312 |
| mat / 73 | control | 736 / 896 / 1184 / 1632 | 736 / 160 / 288 / 448 / 1168 | 281 / 79 / 106 / 167 / 427 | 2208 |
| mat / 73 | v58 | 768 / 960 / 1216 / 1664 | 768 / 192 / 256 / 448 / 1136 | 284 / 89 / 72 / 157 / 396 | 2144 |
| mat / 73 | v50 | 768 / 928 / 1120 / 1248 | 768 / 160 / 192 / 128 / 1552 | 252 / 9 / 4 / 0 / 42 | 1344 |
| rooster / 42 | control | 384 / 512 / 832 / 1376 | 384 / 128 / 320 / 544 / 1424 | 153 / 37 / 67 / 163 / 230 | not met |
| rooster / 42 | v58 | 384 / 512 / 800 / 1248 | 384 / 128 / 288 / 448 / 1552 | 148 / 29 / 55 / 99 / 249 | not met |
| rooster / 42 | v50 | 640 / 928 / 1184 / 1376 | 640 / 288 / 256 / 192 / 1424 | 218 / 26 / 3 / 0 / 11 | not met |
| rainier / 42 | control | 512 / 608 / 768 / 1120 | 512 / 96 / 160 / 352 / 1680 | 265 / 56 / 61 / 138 / 207 | not met |
| rainier / 42 | v58 | 512 / 608 / 768 / 1088 | 512 / 96 / 160 / 320 / 1712 | 252 / 49 / 70 / 98 / 220 | not met |
| rainier / 42 | v50 | 608 / 736 / 896 / 1056 | 608 / 128 / 160 / 160 / 1744 | 236 / 7 / 3 / 0 / 2 | not met |

The accepted operation that causes advancement belongs to the departing stage. Stage use derives from recorded boundaries, never V50's clamped scheduling pass. Gates remain global 11/9/7.5/6/5.5%, regional 17/15/13/11/10%, three qualifying checks and accepted-operation evidence. V50 retains global 3/3.5/4/4.5/5.5%, regional 5/6/7/8/10%. Rooster and Rainier do not meet final gates for any painter; the budget finals are not labelled qualified.

### Compute and matched time

Three sequential counterbalanced trials per representative subject include source/session analysis, bounded task analysis, original quantity fits, candidate raster/score work, accepted rendering, stage rebinding and Continue. Evidence analysis, PNG/record writing and review replay are excluded. No extra filtering objective exists. Complete accepted-operation timing vectors are retained; matched views use the whole median-final trial vector per painter, then a common minimum allowance, not interpolated artwork.

| Subject | Painter | 1400 s | 2800 s | 5600 s | Final range s |
| --- | --- | --- | --- | --- | --- |
| tay | control | 10.436 | 13.999 | 21.134 | 21.02–21.94 |
| tay | v58 | 10.444 | 13.622 | 20.244 | 18.53–26.05 |
| tay | v50 | 15.599 | 19.310 | 27.090 | 24.82–43.40 |
| mat | control | 4.837 | 6.481 | — | 6.44–6.74 |
| mat | v58 | 4.650 | 6.075 | — | 5.78–6.63 |
| mat | v50 | 5.849 | 7.362 | — | 7.29–7.43 |

Timings vary substantially, especially Tay's first V50/V58 trials. The final ranges and full paired trials constrain any speed claim: this is a bounded-cost treatment, not a demonstrated universal speedup. Shorter guided paths can offset analysis by reducing native raster work, but no isolated attribution follows from total wall time. Judge the matched-time sheets alongside the matched-operation finals.

## Preservation, checks and recovery

The core checks cover historical oil and charcoal identities through V57; seeded selection at all search depths; unchanged candidate budgets and preserved original slots; optimal quantity fits and realised full/patch gains for all operations; cached/uncached rendering; scoring/tile agreement after stage changes; Continue; target sealing and Undo; JSON and native/2× replay. Browser checks exercise the actual studio lifecycle and 2× PNG export of imported V58 artwork without exposing V58 in the normal selector. Offline gallery checks preserve the 23 V52/V53 material examples, all frozen material archives, 15 lossless accepted streams, native fixed-state sequences and a two-record decoded cache. The local package is hash audited, extracted, regenerated from original sources and reviewed offline.

Routine review is the [compact gallery](../artifacts/v58/comparison.html), [Tay progression](../artifacts/v58/tay-progression.jpg), [Mat progression](../artifacts/v58/mat-progression.jpg), [regression finals](../artifacts/v58/regression-finals.jpg), [stage boundaries](../artifacts/v58/stage-boundaries.jpg), [matched-time finals](../artifacts/v58/matched-time.jpg), [native excerpts](../artifacts/v58/native-finals.jpg) and [ablation](../artifacts/v58/planning-ablation.jpg). Charcoal Studies adds three cold-loaded fixed-state decisions and actual accepted V58 sequences (before, one correction, eight accepted operations). Frozen V52/V53 examples remain unchanged; V57's previous study shell is archived separately. Each painting has one lossless stream, without duplicate prefix streams/images. Bulk diagnostic PNGs, timing vectors and accepted JSON are outside Git in D:/leaf-trace/artifacts/v58-work.

One local recovery ZIP lives at D:/leaf-trace/stroke-master/artifacts/v58/recovery-package.zip; it is not the routine review attachment. The active gallery inventory is approximately 9.93 MB uncompressed; the local ZIP is approximately 10.90 MB. See gallery-bytes.json/package-bytes.json for exact inventory and sizes. Regeneration: node v58-reproduce.cjs; checks: node v58-check.cjs, node v58-browser.cjs, node v58-gallery-browser.cjs; timings: node v58-timings.cjs (also --mat). Building/recovery commands are supplied inside the package.

## Rejected expansion and KIV

No quotas, more candidate slots, semantic rules, dense structure pipeline or lookahead were added. The tone-only curved-line loss argues against replacing all original contacts with one role. Complete results do not warrant claiming a new perceptual optimiser or V50-quality breakthrough. V58 earns keeping a bounded experiment through useful Tay/rooster improvements, but broad adoption remains a human decision and the unresolved Mat/Rainier organisation is explicit. V55 scoring, V56 expanded fitting and V57 blend variants were not retried. See [KIV-v58](KIV-v58.md).
