# V26: reject promotion of the tested strict-width policy

**Keep V22 default. Retain V26 as a selectable experiment; reject promotion of this policy.** Useful detail eventually returns, but sustained strict widths do not demonstrate better construction at comparable accepted-operation or measured-work checkpoints. Broad collateral damage, costly searching and pronounced late/Neutral texture oppose adoption. No further planner mechanism was added to rescue the result.

[Offline gallery](../artifacts/v26/comparison.html) | [Portable review ZIP](../artifacts/v26/v26-comparison.zip) | [Protocol/commands](README-v26.md) | [KIV](KIV-v26.md) | [Design](../artifacts/v26/design.json) | [Work](../artifacts/v26/measurements.json) | [Matched objectives](../artifacts/v26/checkpoints.json) | [Collateral](../artifacts/v26/collateral.json)

## Actual policy and baseline

Intake Git was clean, with a command-scoped safe.directory exception for workspace ownership. No applicable AGENTS.md existed. Current README/HANDOFF, KIV-v25, V25 report and actual engine/session sources were read. V12(planner11/material2), V17, V22 default, V24 and V25 remain selectable and unchanged in generation. V26 uses planner26/material2 and the same canonical renderer, materials, loading field, halo objective, sessions and exports. Historical assets/logs/evidence/archives are untouched. No reset or automatic commit.

Foundation selects the most populated16-unit RGB bin, alpha-weights contributing raw pixels, ignores alpha-zero pixels, breaks ties by ascending numeric R/G/B key, and uses the contributing pixels' weighted mean. Existing **recorded canonical foundation** bands apply it. It is separate from seven width stages; it is not a background detector or reference underlay.

Stage-n bounds body width to `[L/2^n, L/2^(n-1)]`: at640,320-640 through5-10 pixels. Body means canonical nominal width times actual pressure/profile spread, measured at61 stations across the central60% of the unfeathered contact. The final minimum/maximum must fit the interval. Natural ends, bristle gaps, filtering and canvas-edge clipping remain. Construction uses full pressure, low release taper and nondegenerate short/medium/long paths; colour fitting cannot shrink geometry. Subpixel widths/paths outside canonical recording limits are rejected. [The protocol](README-v26.md) defines the precise sampled measure and construction bounds.

Flat/Filbert serve Stages1-2; Hog is added at3-4 and Round at5-7, intersected with captured enabled brushes. Whole-image grids, spacing at most.7 times the stage lower width, use five deterministic round offsets. Two slots per cell distribute three widths, four directions, three lengths and the curated brushes across rounds. Flat/Filbert get bounded uniform and two-colour fits using the existing canonical colour-field evaluator; Hog/Round get perpendicular uniform alternatives. Fits use the current canvas. Each slot counts separately; fitting calls, footprint pixels, sampled pixels and time are bounded/counted separately. No V22 anchor gate, V25 pixel protection, width bonus or acceptance quota is inherited. The unchanged full-footprint/halo objective requires raw positive gain greater than1e-6.

Meaningful complete-round reduction is `max(1e-8, stage-entry normalized objective * 1e-4)`. Two negligible rounds require a different-offset confirmation; meaningful improvement resets the sequence. This is bounded sampled saturation, not exhaustive search. Calibration on uniform/detail/curved fixtures preceded principal inspection; independent full-score drift is far below the numerical floor. Tolerances were not tuned to images.

Candidate budget pauses preserve partial rounds and offer Continue/explicit Advance; Stage-7 offers Continue/Finish. Planner/settings bind at session start. Targets retain the same width stage, require a sufficiently large core before feathering, and reuse cancel/Undo. Terminal completion/safety closes Studio continuation/target controls. JSON records stage/round/body and progression provenance, but remains a replay document rather than an optimiser checkpoint.

## Fixed study and cost

Still life640x480, established beaver-1 and tay-gradient512x640 working decodes, and established rooster632x461; seed42 plus beaver73. All pairs share working pixels, seed, material, enabled brushes, quiet body.25 and Neutral presentation. Predeclared crops accompany whole paintings. A separately labelled post-study150x150 crown crop only reads existing rooster images; it changes no generation or tolerance.

V26 caps Stages1-7 at512/512/1024/2048/8192/32768/65536 evaluations, total at most110592 plus foundation. The unattended runner grants bounded512 extensions then explicitly forces advancement. Retained V12/V22 runs cap at1400 operations/5600 proposals. Gallery checkpoints compare common1400-operation prefixes and nearest prefixes to the fastest retained final planning time. Unequal-work final panels are disclosed. Candidate counts/stage numbers are not equal computation. The foundation differs, so these comparisons test the complete V26 policy rather than isolating scheduling.

An initial indexing-parity bug excluded intended brushes. That diagnostic run was stopped and retained under `invalid-distribution/`, excluded from the following numbers. Repertoire assertions were added; the corrected study restarted with identical tolerance, caps, objective and contact rules. This was a compliance correction, not an artistic rescue. No aesthetic tuning followed.

| Case | V12 / V22 / V26 seconds at1400 operations | V12 / V22 / V26 common objective at1400 |
|---|---:|---:|
| Still |51.62 /13.45 /173.33|.000113 / .000272 / .001064|
| Beaver42 |17.70 /6.64 /169.16|.007571 / .013788 / .010293|
| Beaver73 |18.43 /6.82 /162.83|.007798 / .014036 / .010223|
| Portrait |25.06 /11.32 /157.04|.000933 / .001545 / .002085|
| Rooster |12.55 /5.48 /135.17|.006089 / .007261 / .014704|

Lower objective is better numerically, not an aesthetic score. At matched work, V26 has only30/26/26/24/18 accepted operations respectively; V12 has122/137/156/183/218 and V22 has1400. Prefix time mismatch is retained in JSON, including the portrait's roughly1.43-second mismatch. V26's matched-work objectives are worse than both controls in every case.

| V26 bounded final |Operations|Candidates/contacts|Planning seconds|Fit seconds|Fit footprint pixels / samples|Final objective|Stage-7 stop|
|---|---:|---:|---:|---:|---:|---:|---|
|Still|12067|110380|292.09|105.43|397201270 /12185797|.000069|User finish|
|Beaver42|24000|88718|275.36|99.99|395614622 /10288285|.001973|Safety ceiling|
|Beaver73|24000|88865|269.61|97.77|390272618 /10294785|.001930|Safety ceiling|
|Portrait|24000|90943|265.21|96.58|381872178 /10443255|.000188|Safety ceiling|
|Rooster|18100|110236|246.60|87.72|349227873 /12008668|.001535|User finish|

Every Stage-1 saturated. Stages2-6 all hit caps and were forced; Stage-7 had two forced finishes and three24000-operation safety stops. Thus35 endpoints comprise **5 saturations,27 forced advances/finishes,3 safety stops**. No late stage is presented as saturated. All endpoints, including the final hard-stop snapshot, have both views/crops. In each Stage-1 the last54 evaluated candidates accepted nothing; they were18-38% of that stage's painting evaluations. Total Stage-1 planning took25-58 seconds. Fine-stage saturation cost remains unestablished beyond the finite work already spent.

V26 fitting took about36% of final planning time. Its footprint counter measures bounding-area work, not every repeated geometry projection. Retained aggregate fitting cost is **unmeasured**, not zero; available loading/contour counters are partial, separately retained in `fitting-memory.json`. Times exclude analysis, snapshot/replay and PNG generation. One timing per run, sequential shared Node process with overlapping verification/browser activity: contention, allocator reuse and GC limit speed claims.

Windows10.0.19045, Node24.20.0, i5-14500, about31.8GiB system memory. Per-run sampled cumulative process RSS maxima ranged197-430MiB; V26 conservative planning estimates reserve the24000-operation ceiling at172-181MiB. These are different measures and neither is an isolated planner RSS peak. Extended1536 planning may exceed the unchanged candidate patch guard; the study does not certify that setting.

## Visual judgement and collateral

- **Early construction:** dominant-colour ground and broad contacts establish rough value/colour placement, but saturated Stage-1 is a poor visual block-in. Stage-2 still has large geometric intrusions. Sustained widths do not establish clearer construction than the controls at matched operations/work.
- **Still life:** box, sphere and shadow eventually recover. At1400, V26 remains soft/faceted with unresolved edges; V12 is more coherent. Final12067-operation modelling is numerically excellent, with conspicuous small-mark texture even in the flat backdrop/table. The extra detail is not a matched-work quality win.
- **Beaver, both seeds:** late stages recover the subject, landscape, water and rocks, unlike V25's incomplete scene. At1400, large masses are readable but subject/head and water relationships remain blunt; V12 is clearer. V26 has lower1400-operation error than V22 without establishing overall aesthetic superiority. Final24000-operation scene recovery is useful evidence of detail, with substantial microtexture and cost; no equivalent full24000 control claim is made.
- **Portrait:** final pigment preserves recognizable features and connected cheek/forehead tone. At1400, eyes, nose and lips remain broad patches while both controls define them more clearly. Late corrections retain tonal continuity but fill it with fine texture. Neutral turns that surface into pronounced hatch-like relief, so numerical improvement does not certify presentation quality.
- **Rooster:** Stage-1 spills large grey/brown masses into white. Final silhouette and toe gaps recover, but crown tips/eye/feather lines remain simplified. At1400 the fixed toe/crown crops show poorer separation than controls. Pigment-only eventually looks substantially cleaner; Neutral preserves strong background ridges and foreground texture from broad construction/corrections.

Native structural error regressed on48.3%/36.6%/36.0%/26.2%/65.1% of pixels after Stage-1 versus foundation, despite positive common-objective gain (still/beaver42/beaver73/portrait/rooster). This counts regression greater than1e-6 in normalized native RGB squared error, not anatomical damage or permanent failure. Later stages repair much of it while still regressing other pixels. `collateral.json` separately gives structural and actual pigment regressions, harm and benefit. No new clipping/protection rule was used.

**Decision: reject promotion; retain the selectable experiment and evidence.** Strict widths make broad approximation observable, but this study does not show improved construction. Useful late detail costs roughly2-5 minutes per V26 run,12067-24000 operations and88718-110380 evaluations, with significant surface/quiet-area damage. The protocol can be studied further in a separate experiment; this implementation adds no second mechanism to salvage the result.

## Verification and preservation

Focused interval/repertoire/alpha/tolerance/round/partial-budget/session/target/safety tests pass. Five retained planners exactly match the SHA-256-verified incoming engine's records, surfaces and RNG through Continue; canonical deposition/loading/profile functions are unchanged. Maintained support/material/loading/contour suites pass. Chrome verifies V26 plus all five retained lifecycle paths, pause/resume/cancel/Undo, historical imports and actual full/current-frame2x PNG/JSON exports.

Gallery checks validate320 primary painting panels plus32 crown panels;66 Chrome reference/checkpoint/view/crop combinations load correctly. All15 final records replay to pigment/Neutral exactly. Preservation independently recomputes every accepted body interval, checks seven endpoint reasons, and repeats actual generation prefixes through the first budget pause or at most128 operations. That is **not a full study repeat**; full regeneration is available with `v26-preservation.cjs --full`. Incoming control bytes/commit are recorded, retained modules are hash checked, and tracked historical logs/assets/evidence/archives are unchanged. [Focused](../artifacts/v26/tests.json), [maintained material](../artifacts/v26/colour-checks.json), [direction](../artifacts/v26/direction-checks.json), [V26 browser](../artifacts/v26/browser-smoke.json), [retained browser](../artifacts/v26/retained/browser-smoke.json), [preservation](../artifacts/v26/preservation.json).
