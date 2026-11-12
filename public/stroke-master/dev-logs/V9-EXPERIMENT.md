# V9 controlled extended-refinement experiment

Unchanged v7 recovers a readable eye and continuous feather flow with the prescribed continuation allowance. Detail visibly accumulates in the inspected checkpoints. Background bands and raised correction ghosts persist under neutral lighting, and the tail and wing retain broad facets. This is an investigation; production remains v7. Stop here for visual review.

Open the [offline comparison](artifacts/v9/comparison.html). It includes the reference, preferred v2, standalone short v7, all captured pigment prefixes, common Neutral views, and native crops. Click images for their PNGs. No lighting was individually retuned.

## Method and frozen state

The working tree was clean before creating the runner. Current Git commit: `08ba42893e757b5bdfd74d049e2dccf4cb22d5e3` (`SM v8`). No commit, reset, branch change, build or unrelated UI/browser suite was performed. All writes stay inside `stroke-master/`. Applicable instructions, README, HANDOFF, V8-BASELINE and the relevant session, continuation, snapshot, validation and replay implementation were read before editing.

[Manifest](artifacts/v9/manifest.json) records all exact source/input hashes, settings, limits, commit and runtime. Engine SHA-256: `bdf5aa96d044452916b5d2fdf6fc34073ef3a7bfb88c9850617671962c0bd7e0`.

| Reused frozen input | SHA-256 |
| --- | --- |
| Decoded rooster, `artifacts/v8/evidence/rooster-input.json` | `7f585cf7994dd54b335a14253fefff9a93529d8e483a548a4eb36504f2f93b2d` |
| Preferred v2 record, `artifacts/v8/evidence/preferred-v2.json` | `279c46b264fbf03447af99f073a4ddc3a522a0b7b16e220195ee86c66264e7a8` |
| Verified short v7 record, `artifacts/v8/evidence/baseline-v7.json` | `5d84ef38718519d4b64dc0e624c3baa272528c0b692ab8c3964532c154eebdc1` |
| V8 frozen production manifest | `d77ee24512b62a3dc61161250de52071d777a7430547b7ed715c062130627bbd` |

Settings are copied from the verified short v7: Fine, seed 42, Balanced, Body (`quietBody`) 0.65. Enabled brushes: flat, filbert, round, bright, mop, liner, detail, hog, fan, stippler. No priority marks or targeted work. Material: directional-1 Neutral, relief 1, azimuth 225, elevation 55, intensity 1, white light, warmth 0, ambient 0.65, shadow 0, shadow distance 14. Pigment presentation uses the same neutral settings with relief 0. Input is 632 × 461. Runtime: Node v24.20.0, Windows 10.0.19045, x64.

[Runner](v9-experiment.cjs) uses `createSession`, `step`, `extend`, `snapshot`, `validateDocument` and `replay` from the production engine. Inspection and assertions confirm `extend` adds allocations to total caps, including unused reservations. Start 1400 operations / 5600 proposals; then add 700/2800, 700/2800, 7000/28000, 7000/28000. Final allocated caps: 16800/67200. Existing limits include 24000 strokes, 120000 proposals, 96000 contacts and 30720000 candidate contacts; none was hit. The single session retains its original 12 foundation operations throughout. No restart, new foundation, acceptance override or planner change occurs.

One [final document](artifacts/v9/final.json), document v4 / planner v7, stores settings and continuation history. [Checkpoint markers](artifacts/v9/checkpoints.json) identify its prefixes; there are no duplicate large prefix JSON files. Rendering happens afterward. The original generation runner is preserved as inert [provenance](artifacts/v9/generation-runner.txt), matching the manifest runner hash. A subsequent render-only fix prepared score targets through `createSession` without stepping; another render-only change added an upper-background crop after visual inspection. The generation/marker function remains byte-identical. Current rendering-runner hash is in [render timing](artifacts/v9/render-timing.json); the control verification records the earlier rendering-runner hash.

Commands used: `node v9-experiment.cjs generate`, `node v9-experiment.cjs verify`, `node v9-experiment.cjs render`, plus prefix replay and source/hash checks. Generation should only be rerun intentionally because it replaces v9 evidence. Git ownership handling used command-local `safe.directory`, without changing Git configuration.

## Checkpoints and actual work

All operations in this run have one contact: **accepted contacts equal accepted operations**, and **candidate contacts equal candidate evaluations** in every row. Those separate raw counters are retained in checkpoint JSON. Times below are cumulative generation seconds and cumulative continuation-API milliseconds. Error is the existing structural score, not an aesthetic score.

| Checkpoint | Allocated ops/proposals | Accepted ops / contacts | Consumed proposals | Candidates / candidate contacts | Structural error | Generation s | Continue ms | State |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| boundary-1 | 1400/5600 | 1400 | 1504 | 10786 | 0.008438414 | 7.600 | 0.000 | Stroke budget reached |
| operations-1800 | 2100/8400 | 1800 | 1938 | 13892 | 0.007583801 | 8.634 | 0.200 | active |
| boundary-2 | 2100/8400 | 2100 | 2263 | 16211 | 0.007094171 | 9.426 | 0.200 | Stroke budget reached |
| boundary-3 | 2800/11200 | 2800 | 3001 | 21485 | 0.006069979 | 11.208 | 0.419 | Stroke budget reached |
| operations-5000 | 9800/39200 | 5000 | 5394 | 38566 | 0.003933176 | 16.862 | 0.647 | active |
| boundary-4 | 9800/39200 | 9800 | 11043 | 78767 | 0.001755130 | 29.058 | 0.647 | Stroke budget reached |
| operations-10000 | 16800/67200 | 10000 | 11293 | 80545 | 0.001662835 | 29.562 | 0.870 | active |
| operations-15138 | 16800/67200 | 15138 | 18138 | 128930 | 0.000900604 | 42.315 | 0.870 | active |
| final | 16800/67200 | 16800 | 20697 | 146997 | 0.000749855 | 46.981 | 0.870 | Stroke budget reached |

All five stages stop normally at their stroke caps; there are no plateau stops. No requested accepted-operation checkpoint is missing. The 201040-candidate target was **not reached**, so there is no candidate checkpoint or overshoot to report. The final cap is exhausted with 46503 proposal reservations unused. That is why actual proposals/candidates remain below the historical counts; it is not a reason to alter stopping or extend this experiment further.

Generation is the sum of timed `step` calls: 46.981375 s. Initial session creation/reference analysis: 397.658 ms. Four `extend` calls: 0.8698 ms total. Marker storage/RNG checking: 0.2227 ms, excluding console logging. Loop overhead, prefix hashing, snapshots, JSON writes and rendering are excluded from generation time. These are phase measurements, not total end-to-end runtime. Latest saved-prefix rendering plus regional analysis: 23.732905 s, separately measured. The identical uninstrumented verification replicate took 45.499514 s in `step`, with 382.667 ms creation and 0.4149 ms continuation. This replicate verifies instrumentation, not a second treatment. No historical v2 speed comparison is possible.

The standalone short v7 used 1800/7200 caps and consumed 2029 proposals / 14545 candidates, error 0.006055132. Extended v7 at 1800 follows an initial 1400 cap plus continuation and consumes 1938 / 13892; its record is different and its error is higher. It is not expected to reproduce the standalone benchmark.

At equal accepted operations, preferred v2 has 15138 operations / 201040 recorded candidates; extended v7 has 15138 / 128930. Preferred v2's existing full structural error is 0.000933803, extended v7's recomputed error 0.000900604. The final historical-allowance comparison is 16800 / 146997. Neither comparison controls historical conditions or computational cost.

## Deposited eye and neck detail

[Feature statistics](artifacts/v9/feature-statistics.json) use the v8 method: actual raster coverage above 1e-5 within eye `[520,40,95,75]` and neck `[440,100,165,155]`; narrow means minimum contact width below 0.012 E, E = 632. An operation counts once per region. Quantiles use the sorted index floor((n-1)q). Axial coherence weights whole contact path segments by length for operations depositing in that crop, not pixel-local tangents. Higher concentration means more aligned axes; it does not measure quality. Preferred and short comparator results match v8 exactly.

Each cell is **narrow/depositing operations; median width/E; median path length/E; narrow axial concentration**. Width and path medians summarize all depositing operations, as in v8. JSON also includes p10/p90, dominant angles, and all-operation direction statistics at every marker.

| Record | Eye | Neck |
| --- | --- | --- |
| Preferred v2 | 848/925; .003234; .007886; .305 | 4851/4959; .003234; .012328; .701 |
| Standalone short v7 | 60/100; .004914; .015658; .209 | 217/314; .003803; .016704; .605 |
| Extended 1800 | 58/91; .004369; .016667; .306 | 247/337; .003797; .013612; .632 |
| Extended 5000 | 244/277; .003797; .010169; .292 | 950/1041; .003234; .010441; .624 |
| Extended 10000 | 545/578; .003234; .008138; .300 | 2244/2335; .002813; .009276; .617 |
| Extended 15138 | 855/888; .002846; .008029; .290 | 3800/3891; .002578; .008052; .612 |
| Extended final 16800 | 945/978; .002813; .008013; .291 | 4304/4395; .002531; .008043; .614 |

## Visual findings

**Feathers and eye recover.** At 1800 the neck/body are chunky and the eye is weak. By 5000 finer directional feather marks and a small recognizable eye appear. At 15138 and final, the dark eye is readable with a separated light ring, and narrow golden/red marks form continuous neck and saddle flow. This is substantially closer to preferred v2's visible flow. Geometry and mark character still differ. Preferred v2's neck paths are longer and their axes more concentrated in these measurements; final v7 has more short, narrow marks. The angular teal wing and broad tail masses remain.

**Detail accumulates in the inspected sequence; overwrite is not demonstrated.** Deposited counts grow, widths/path medians shrink and the eye and feathers remain legible in late crops. No engine plateau occurred. Prefix preservation proves accepted records persist, not that every earlier mark stays visible. Neither cumulative deposit counts nor a final image establishes detail-destroying overwrite, and this investigation does not claim that individual marks never get covered.

**Some contour defects diminish; material artifacts persist.** Breast/beak contours become cleaner as refinement proceeds. Gray/ivory cutbacks around the tail and feet/silhouette gaps remain. The final common Neutral view has strong horizontal bands in the quiet background and raised diagonal rectangular ghosts above the back, near the head. They are much weaker or absent in pigment-only crops. The gallery includes paired quiet/lower-artifact crops and an additional upper-background crop `[300,0,230,105]`, selected after inspecting the final view to show conspicuous correction ghosts. That additional crop changes no measurements or generation decisions.

**The remaining gap is mixed, not simply too few fine marks.** Increased allowance addresses the earlier eye/feather shortage. Broad shape facets, stroke placement/path character, and visible background/material history now account for important remaining differences. Relief-off versus Neutral directly establishes a height-lighting contribution to the bands/ghosts. It does not isolate which foundation or later correction operations created them. More accepted strokes and lower structural error alone do not establish better art.

## Verification and remaining confounds

[Control verification](artifacts/v9/verification.json) passes: a full run without markers has exactly the same strokes, continuation history, final RNG, actual work counters, material RGB/coverage/height, and structural RGB/coverage. The final document validates and replays to exact saved material buffers. Prior stroke prefixes survive all four continuations and subsequent work. Budgets, contacts and monotone checkpoint counters are consistent.

[Prefix verification](artifacts/v9/prefix-verification.json) validates every captured prefix and independently replays it to pixel-identical saved pigment PNGs. It also rechecks all frozen production/build/standalone hashes, reused input/source hashes, and equality of original versus final generation logic. Runner syntax checks pass. Production sources, standalone pages and historical evidence remain unchanged; HANDOFF is the only edited tracked file. No unrelated test suite was run.

Historical v2 planner source, full body/search/priority history and runtime remain unknown. Brush libraries differ. Equal accepted operations are not equal candidate work; equal proposal allowances are not equal compute, because candidate counts and patch costs differ. The final v7 run uses more accepted operations but fewer candidates than preferred v2. The short standalone and extended 1800 schedules differ. One seed and one subject cannot establish general quality recovery. Structural error excludes the material presentation, and regional geometry measurements do not score aesthetics. Height origin and individual mark occlusion have not been isolated.

## One recommended next experiment — not executed

Run a **fixed-record foundation-height replay ablation** on this final document: replay the original as a control; in a diagnostic copy, clear only foundation height before applying the unchanged later operations, retaining foundation RGB/coverage and all later deposition. Assert final pigment and coverage are bit-identical and compare both under the same Neutral preset, especially the quiet and upper-background crops. This would test whether early foundation height drives the persistent bands and how much correction ghosting remains from later history. Foundation origin is a hypothesis, not an established cause. Make no planner, renderer or UI change while testing it.

The ablation and planner simplification have not been run or implemented. Await user visual review of this comparison.
