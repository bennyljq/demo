# V56 - Improve charcoal placement and tonal usefulness

The bounded placement refinement improves some real contacts and gives modest complete-image fidelity gains, but **does not earn promotion**. Finished character changes little, and complete fitting cost increases materially. V44 remains Stable/default; V50 Baseline is now exposed alongside the existing V54 Challenger. Both historical implementations are preserved. Oil and the completed studio lifecycle are unchanged. No commit or automatic promotion.

Start review with the compact [Tay progression](../artifacts/v56/tay-progression.jpg), [Mat progression](../artifacts/v56/mat-progression.jpg), [second-seed/regression finals](../artifacts/v56/regression-finals.jpg), and [actual stage boundaries](../artifacts/v56/stage-boundaries.jpg). These four labelled sheets total about 1.11 MB. The [production comparison](../artifacts/v56/comparison.html) adds native replay, fixed-state alternatives and subsequent corrections, matched-time views, reference/target inspection and artwork recovery. [Frozen V56 Charcoal Studies](../archives/charcoal-studies-v56/index.html) includes four exact production before/after sequences. See [KIV-v56](KIV-v56.md) for current policy and deferred work; KIV-v37 is unchanged.

## Diagnosis before search expansion

Six accepted deposits/lifts from early, intermediate and late Tay/Mat states were compared at fixed pressure, loading and texture seed with nearby transverse shifts, .7 width, .7 pressure and a +.2 radian contact rotation. The native before/after crops and each contact followed by up to its next 64 actual operations are available in the comparison. Later replay is descriptive, not a counterfactual proof of wasted repair.

Transverse displacement improves four of six contacts. Mat's early shade gains 34.577 versus 27.630 normalized squared-error units, with slightly better reference-edge agreement; the opposite shift gives only 17.306. Its late angular deposit improves .163 to .214. Tay's intermediate lift improves .176 to .214. Both shifts lose on the inspected late Tay angular deposit, so retaining the original matters.

The loaded support is not always centred on the useful residual passage, even though the path centre is guided by reference tone. This is a placement failure, not evidence that every width is excessive. Uniform width reduction loses on all six inspected contacts. Rotation helps some cases, but has less consistent evidence than transverse placement. Lower deposit pressure changes pickup thresholds and exposed paper nonlinearly; Mat's early score drops to 3.566 even after quantity refitting. In some lifts, pressure scaling can be offset by quantity fitting, because the lifting mask is linear there. Opacity is therefore not a general substitute for lightly loaded charcoal. The diagnosis does not establish that geometry is the only remaining limitation or that all quiet shading profiles are adequate.

V50's narrow gesture planner already searches a few transverse anchor offsets before tracing. Its swept contact, pressure model and paper are different, so its exact gains cannot be attributed to placement alone. V56 borrows only the bounded placement idea; no rectangular V50 deposits replace V52-derived gestures.

## One bounded intervention

Base: V53 finite-face material/proposals, ordinary pixelwise evaluation and V54's earlier gates (global 11/9/7.5/6/5.5%, regional 17/15/13/11/10%; three qualifying checks, 95th percentile). Five reference targets and accepted-operation evidence are retained. No V54 Stage 5 tolerance or V55 filtering, fitting or promotion is active.

After evaluating the unchanged original candidate set, refine only when its winner is a positive deposit, lift or erase. Test two translations along the stick's long axis (transverse to usual travel), distance `max(.75 unit, min(8 unit, .18 max(widths)))`, one in either direction. Geometry is translated as a whole; texture seed, independent stick angles, pressure, cross-loading, breakup, entry and release remain identical. The native contact footprint is formed and fitted exactly, including target sealing and canvas boundaries. Existing candidates remain available; neither shift is selected unless its realised gain exceeds the current winner. No extra RNG draws, lookahead, quota, family weighting, multiscale objective or blending change.

There are at most two extra fit/evaluation contacts per eligible proposal, for every search depth. We cannot claim those fits are free replacements: they are additional work. The initially tested version refined the best deposit/lift even when it lost to blending; that wastes fits and is rejected. Eligibility was narrowed during Tay/Mat development, then the treatment was hash-frozen before rooster/Rainier. There was no regression-reference tuning.

A separate instance of the unchanged native fitter keeps the original candidate fields intact, including thorough search's 12 candidates. Its fitted masks are reused for realised evaluation and accepted raster work, then released; replay reconstructs the same contact through the historical production renderer. Native material12/stick10, anchored paper and release remain exact. Memory estimates include this bounded fitter/cache support.

## Decisions versus complete paintings

Shared Stage 1, identical canvas/seed and 64-operation budgets give mixed evidence. Tay improves pixel RMS 50.753 to 50.342 and reference-edge RMS 7.392 to 7.289, but broad mass worsens 23.934 to 25.026. Mat improves pixel RMS 51.660 to 50.841 and mass 30.886 to 29.917, but edge RMS rises slightly 11.110 to 11.131. Better immediate scores do not guarantee better tonal construction.

Complete views use the same prepared references, 640-pixel planning scale, seed, balanced search and operation/Continue budgets. V50 retains its frozen historical gates and material; it is a quality/compute benchmark rather than the causal scoring control. The production gallery provides 300/1400/2800, every actual transition, a matched Tay5600 extension and matched-time views. For Tay/Mat seed42, matched-time prefixes use the complete median-time representative run from three counterbalanced trials per painter. Other cases use their recorded complete generation wall. No omitted analysis or raster work is charged to a fictitious separate budget.

Original RMS is in 0-255 tones. Grain RMS measures canvas minus G1.2 in low-reference-structure areas; edge RMS compares G2 gradients at reliably structured reference pixels. These are diagnostics, not artistic scores. Final qualification is the recorded pixelwise gate.

| Subject/seed | Painter | Operations | Original RMS | Grain RMS | Ref-edge RMS | Final criteria |
|---|---|---:|---:|---:|---:|---|
| tay/42 | control | 5600 | 6.48 | 1.99 | 1.33 | yes |
| tay/42 | v56 | 5600 | 6.16 | 2.04 | 1.22 | yes |
| tay/42 | v50 | 5600 | 6.37 | 2.62 | 1.10 | yes |
| mat/42 | control | 2800 | 11.15 | 4.07 | 2.95 | yes |
| mat/42 | v56 | 2800 | 10.57 | 4.09 | 2.71 | yes |
| mat/42 | v50 | 2800 | 7.33 | 1.60 | 1.86 | yes |
| mat/73 | control | 2800 | 11.32 | 4.17 | 2.88 | yes |
| mat/73 | v56 | 2800 | 10.70 | 4.14 | 2.76 | yes |
| mat/73 | v50 | 2800 | 7.21 | 1.48 | 1.83 | yes |
| rooster/42 | control | 2800 | 16.38 | 2.70 | 4.34 | no |
| rooster/42 | v56 | 2800 | 15.55 | 2.98 | 3.91 | no |
| rooster/42 | v50 | 2800 | 13.90 | 1.62 | 3.57 | no |
| rainier/42 | control | 2800 | 19.89 | 5.12 | 3.79 | no |
| rainier/42 | v56 | 2800 | 19.52 | 5.31 | 3.62 | no |
| rainier/42 | v50 | 2800 | 18.04 | 2.99 | 3.48 | no |

Native review: V56 slightly improves facial edges and definition against the gate-only control, without obvious new repetitive artifacts. It still converges toward essentially the same softened portrait. Mat's likeness and light improve modestly, including seed73, but V50 gives more coherent modelling and purposeful planar/sharp passages. Rooster gains some feather definition but misses qualification; Rainier also remains incomplete and its light/tonal organisation does not match V50's stronger result. Existing lifting, erasure, long accents, angular contact and quiet shading remain available; no family participation target is imposed.

Operation economy improves modestly: final criteria are reached at Tay1536 versus1600 and Mat2048 versus2208; seed73 Mat2080 versus2208. Early transitions also move forward. These are genuine quality-gated events, but are not direct measurements of avoidable correction. The actual-stage counts below and subsequent-contact crops show that substantial blending and corrections remain. V56 does not establish a convincing reduction in later equivalent rebuilding, nor preserve the striking early material through final refinement.

| Subject | Painter | S2/3/4/5 entry operations | Operations in S1/2/3/4/5 | Blends in S1/2/3/4/5 |
|---|---|---|---|---|
| tay | control | 672/800/960/1216 | 672/128/160/256/4384 | 357/83/72/122/1455 |
| tay | v56 | 640/768/928/1184 | 640/128/160/256/4416 | 352/78/87/134/1518 |
| tay | v50 | 864/992/1088/1184 | 864/128/96/96/4416 | 348/12/1/0/467 |
| mat | control | 768/928/1216/1696 | 768/160/288/480/1104 | 311/67/110/177/392 |
| mat | v56 | 704/864/1120/1568 | 704/160/256/448/1232 | 290/71/105/176/452 |
| mat | v50 | 768/928/1120/1216 | 768/160/192/96/1584 | 249/4/2/0/34 |
| rooster | control | 384/512/832/1376 | 384/128/320/544/1424 | 153/37/67/163/230 |
| rooster | v56 | 352/480/768/1248 | 352/128/288/480/1552 | 156/42/66/130/287 |
| rooster | v50 | 640/928/1184/1376 | 640/288/256/192/1424 | 218/26/3/0/11 |
| rainier | control | 512/608/768/1120 | 512/96/160/352/1680 | 265/56/61/138/207 |
| rainier | v56 | 480/576/736/1088 | 480/96/160/352/1712 | 257/61/69/150/244 |
| rainier | v50 | 608/736/896/1056 | 608/128/160/160/1744 | 236/7/3/0/2 |

V57 reporting correction: stage allocation now follows accepted-operation progression boundaries. V50's internal scheduling pass clamps at three and is not a stage identity. Frozen artwork, transition operations and metrics are unchanged.

## Complete cost and decision

Three complete counterbalanced runs per representative case include reference analysis, proposal/contact formation, base and extra quantity fits, candidate scoring, accepted raster work, caches and stage transitions. Evidence analysis, disk writes and gallery replay are excluded. Median seconds:

| Subject | Operations | Control | V56 | V50 |
|---|---:|---:|---:|---:|
| tay | 1400 | 12.75 | 19.74 | 16.13 |
| tay | 2800 | 17.04 | 26.91 | 20.32 |
| tay | 5600 | 26.04 | 41.09 | 29.21 |
| mat | 1400 | 6.47 | 8.77 | 7.91 |
| mat | 2800 | 8.62 | 11.39 | 9.88 |

At final budget, V56 costs about 58% more than the causal control on Tay and 32% more on Mat. Host timing varies across trials; the full trial records and ranges are retained, not just one favourable run. Formation telemetry counts extra native fitting; shared fit counters include both base and refinement, so nested counters must not be added. The preserved-mask implementation avoids rasterising every refinement twice, but the extra fits still do not earn their cost. Small fidelity gains and a few fewer operations to qualification do not outweigh this increase or close the finished-quality gap to V50. V56 remains a recoverable experiment, not a new normal-selector challenger.

## Recovery and checks

One local recovery ZIP: `D:/leaf-trace/stroke-master/artifacts/v56/recovery-package.zip` (approximately **10.75 MB compressed**, with exact size in adjacent `package-bytes.json`). It is intentionally not the routine review attachment. Fifteen single lossless accepted streams recover all views; fixed subsequent sequences refer to spans of those streams. No duplicated native prefix images or full streams are packaged. Compact labelled sheets are the review previews; bulk PNGs, rejected variants and diagnostics stay outside Git.

`node v56-check.cjs` checks realised fit/gain, full score/cache/tiles, fixed-seed geometry alternatives, all search depths, deterministic histories, five-stage semantics, gate edits, Continue, targeting/Undo and native/2x replay/export. Historical V44/V50/V53/V54/V55 and oil generations remain identical to the frozen baseline. Complete Tay/Mat control and V50 accepted trajectories also match the frozen V55 evidence exactly. `node v56-browser.cjs` checks the real worker/lifecycle, the requested V50 selector, import/live identity, Continue, gates, targeting/Undo and actual PNG export. `node v56-gallery-browser.cjs` checks offline production replay and recovery. The extracted ZIP passed file hashes, core and offline-gallery checks. Its shipped sources regenerated both primary Tay 1400-operation trajectories exactly. The reference originals remain available for optimisation; artwork JSON restores operations, not a live optimiser session.

Reproduction: `node v56-reproduce.cjs`; repeated timing: `node v56-timings.cjs` and `node v56-timings.cjs --mat`. Outputs go to ignored parent artifacts/v56-work. The local package includes the frozen starting engine and original PNG references; active review uses lossless compact references with unchanged pixels. Historical bulk review links require the original checkout.
