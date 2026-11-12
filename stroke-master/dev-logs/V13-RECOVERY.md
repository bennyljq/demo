# Stroke Master v13 — avoidable pigment damage

**Retained: one soft collateral penalty in candidate evaluation.** The matched current-v12 comparison has cleaner foot gaps and fewer persistent pale fragments, while preserving the readable eye, flowing feathers and useful broad marks. The benefit is partial: broad relief ghosts remain, and a diagonal background patch is conspicuous under identical Neutral lighting. Generation costs about 5.7% more in this pair. This is a pigment decision change, not a relief remedy or a general quality guarantee.

Open the [compact offline gallery](artifacts/v13/comparison.html). Each accepted-operation checkpoint has separate pigment and identical Neutral presentations, with expandable native feet, complete spill footprint, eye, neck, tail and upper-background crops. Recorded-decision panels include reference, actual raster alpha and complete affected footprints. Click images for native resolution.

## Frozen incoming state

Work stayed inside `stroke-master/`. Ancestor/project instructions were checked; no applicable AGENTS.md was found. README, HANDOFF and V10–V12 recovery reports were read. Incoming tracked Git state was clean at `22c1d4cee2ed8279cce4ef47227e70db0252b75e` (v12). The first freeze status includes only the newly created diagnostic runner. No commit, reset or branch switch was made.

[freeze.json](artifacts/v13/freeze.json) preserves incoming production hashes, 447 historical v10–v12 files/report hashes, runtime, input and matched settings/schedule. The original canonical engine and complete handoff are preserved verbatim as inert evidence in [engine-before.txt](artifacts/v13/engine-before.txt) and [handoff-before.txt](artifacts/v13/handoff-before.txt). These archives are never runtime planner choices. Earlier v8/v9 reference and recording files remain unchanged.

Control is the **incoming v12 engine**, with planner 11 and material 2. It was regenerated this iteration; historical v9/v11 generation is not its substitute. Its strokes agree with the historical v11 treatment, but its explicitly versioned material is v12. The source is 632×461, Fine, seed 42, Balanced, Body .65, with the v9 enabled-brush list and no priority marks or local work. Both sides use the unchanged v9 allocations: 1400/5600, then additions 700/2800, 700/2800, 7000/28000 and 7000/28000. Final caps are 16800/67200.

Both presentations use Neutral azimuth 225°, elevation 55°, intensity 1, ambient .65, white light, warmth/shadow 0. Pigment changes only relief to 0. Node v24.20.0, Windows x64. Lighting, foundation, colour fitting, brush proposals, geometry, material and attention scheduling were not retuned.

## Diagnosis: losses are represented but outweighed

Historical v9 prefix replay reconstructs structural pigment and cached errors before three recorded strokes. Structural scoring uses exact unstriated raster deposition; material images add the existing pigment texture and material-2 relief. The independent raster-alpha footprint defines deposited pixels, and objective decomposition includes the entire scoring halo. Rectangle overlap alone is not treated as deposition.

| Recorded operation | Actual deposited pixels | Existing error reduced | Existing error introduced | Net existing gain | Supported accurate damage |
| --- | ---: | ---: | ---: | ---: | ---: |
| 63, demonstrated flat spill, width 79.159 | 1312 | 93.95074 | 45.92113 | 48.02961 | 23.94380 |
| 134, useful broad background repaint, width 42.439 | 3029 | 583.17908 | 39.60653 | 543.57255 | 1.29963 |
| 3127, ordinary round correction, width 1.155 | 2 | .033469 | .013695 | .019773 | 0 |

These operation numbers refer to **v9**, including its fine correction; v11's operation 3127 is a different stroke. Operation 134 corrects substantial wrong pigment in the upper background, although its relief remains problematic. It is useful broad repainting for this pigment investigation, not a claim that its final material appearance is ideal.

For operation 63, normalized point-colour error reduced/introduced is 69.96065/46.50013; soft accurate-area point damage before spatial gating is 24.95657. Operation 134's corresponding values are 594.35755/26.44921 and 1.29963. Point-colour measurements are distinct from the existing importance/coverage-weighted **70% coarse blur, 20% fine blur, 10% point** objective. Their differences do not establish a missing-footprint bug. The entire-objective loss of 45.92113 demonstrates **B: substantial damage is represented correctly but outweighed by gains elsewhere**. Multiscale weighting attenuates isolated point mistakes by design; no objective weights were changed. [Complete diagnosis](artifacts/v13/diagnosis.json).

Prefix replay cannot establish historical alternatives. A separate [bounded live trace](artifacts/v13/live-trace.json) runs the actual incoming v12 control to 100 accepted operations: 104 proposals, 688 candidates. Observation consumes no RNG and its recorded strokes match the uninstrumented current control exactly. Each non-foundation candidate is also evaluated with the single experimental utility on the same pre-stroke state. Fifteen observed decisions rank another candidate highest; operation 63 is additionally recorded.

At the actual operation-63 decision, the original stroke remains the winner: gain 48.02961, damage 23.94380, utility 36.05771. **This conservative setting does not veto that stroke in its original context.** It is not tuned to eliminate one pixel. At operation 21, the existing winner has gain 1689.79146 and damage 604.23231; another still-broad flat candidate has gain 1624.03321 and damage 248.86080. Their utilities are 1387.67530 and 1499.60281, respectively. The new bias can preserve a useful broad mark while sacrificing some gain to avoid substantially more damage. The actual treatment trajectory first differs at accepted operation 21. No connection to earlier v6 design changes is asserted.

## Precisely one penalty

At each pixel whose structural RGB actually changes under candidate rasterization, define:

```text
P0, P1 = mean squared RGB difference from point reference, before/after
F0, F1 = mean squared RGB difference from existing fine-blur target, before/after
t = clamp((sqrt(P0) - 8) / 16, 0, 1)
a = 1 - smoothstep(t)
u = clamp((sqrt(F1) - sqrt(F0) - 1) / 3, 0, 1)
s = smoothstep(u)
D = sum[a × s × max(0, P1 - P0 - 9) / 255² × (1 + 2 × importance)]
utility = existing net gain - 0.5 × D
smoothstep(v) = v²(3 - 2v)
```

Accuracy is full through 8 RGB RMS error and fades to zero at 24. A nine-unit squared-error allowance tolerates small colour differences; this is not a blanket allowance for every three-unit channel change. Fine-blur RMS worsening supplies spatial support: zero through one unit, fading to full at four. Isolated texture changes with little fine-scale degradation have little or no penalty. The fine radius is the engine's existing reference-scaled radius, not a new spatial subsystem.

Actual raster RGB changes supply support, including partial alpha and targeted feathering. Feathering is not applied a second time as a mask. Pixels unchanged by deposition contribute nothing; the existing objective still scores all blur-halo effects. Compound contacts are evaluated as one composed operation. There is no brush-width/family/background penalty, protection mask, hard boundary or new UI dial. Correcting inaccurate paint and repainting anywhere remain possible.

The original objective already charges losses. This term adds a deliberate asymmetric preference: **losses on already accurate pigment, backed by neighboring fine-scale degradation, are more costly than equal gains elsewhere**. It is a risk bias, not a new reference-accuracy metric. Original `gain`, structural errors, tiles, audit, progress and targeted-improvement metrics remain unchanged and separate from `utility`.

Utility consistently ranks ordinary/repair candidates and repair variants, and controls rejection/failure-cache bookkeeping. Non-foundation acceptance requires both original gain and utility above the unchanged 1e-6 threshold. The unchanged recorded foundation sequence retains its existing behavior. No adverse original-objective stroke can become acceptable through the nonnegative penalty. One coefficient and one setting were tried; there was no sweep or compensating planner change.

## Matched visual results and work

A short paired run stops at 2100 with caps 2100/8400. Broad coverage and subject formation remain convincing enough to proceed. Control: 2234 proposals, 16010 candidates, 9.002 s generation. Treatment: 2273, 16173, 9.589 s. The final short crop and the 1800 full checkpoint show somewhat cleaner gaps; neither is fragment-free.

Exactly one full paired experiment follows. All five boundaries stop at their unchanged operation caps, with no plateau stops or budget extensions to compensate for slower treatment.

| Accepted operations / contacts | Control proposals / candidates | Treatment proposals / candidates | Control generation s | Treatment generation s |
| ---: | ---: | ---: | ---: | ---: |
| 1800 | 1921 / 13789 | 1956 / 13928 | 8.213 | 8.893 |
| 5000 | 5371 / 38441 | 5425 / 38635 | 16.117 | 16.973 |
| 10000 | 11184 / 79770 | 11404 / 81182 | 28.012 | 29.744 |
| 15138 | 18123 / 128871 | 18593 / 132121 | 40.728 | 42.923 |
| final 16800 | 20545 / 145971 | 21224 / 150710 | 44.892 | 47.446 |

All candidates here have one contact, so candidate/contact counts agree. Allocated final caps are **16800 operations / 67200 proposals**, rather than the consumed work shown above. Final original structural error is .000460513 control / .000403515 treatment; this numerical improvement does not replace visual review. [Control work](artifacts/v13/full-control-work.json), [treatment work](artifacts/v13/full-treatment-work.json).

The whole composition, readable eye and dense feather flow survive. Feet/gaps have less pale debris, especially at 10000 and final, and the complete operation-63 footprint shows improvement beyond the diagnostic point. Broad tail and background brush character remain. Eye point error is slightly worse at 5000, and the full footprint's overall RGB MSE is slightly worse there; improvement is not uniform. Final eye/neck MSE is modestly lower, but neither is claimed to be a general aesthetic score.

Under identical Neutral, foundation bands and rectangular relief ghosts persist. The changed trajectory leaves a particularly visible diagonal patch between the legs. Neck relief remains coherent with material 2. This patch is shown openly in the gallery; pigment improvement does not establish better relief. Broad-profile ghosts remain deferred.

[Explicit regional measurements](artifacts/v13/statistics.json) use the existing feet crop and source-region diagnostic classifier, never a production background mask. Cumulative accepted supported-accurate damage through 1800 (excluding foundation) falls from **12200.54 to 10976.55**, about 10.0%. It is a treatment-aligned damage measure, not an independent quality score. Final feet source-background RGB MSE falls **67.37 → 45.22**; pixels above 24 RGB RMS residual fall **886 → 500**. Four-connected residual components of at least three pixels fall **55 → 41**. Early component counts can rise as large damaged areas split; component count alone is insufficient. Final full-footprint source-background MSE falls **116.88 → 73.94**, with residual pixels **580 → 301**. These are measured persistent pigment residuals, not counted subsequent repairs. **Fewer repairs are not established.**

Final accepted scale counts excluding foundation are large/medium/small **113/276/16399 control**, **104/246/16438 treatment**. Small marks increase 39 (0.24%); broad marks remain, though medium counts fall. Rejections increase **3745 → 4424**, a meaningful 18.1% relative increase, while rejection rate rises **18.2% → 20.8%** and total proposals increase 3.3%. The bounded rejection overhead is disclosed, not described as free prevention. There is no large rise in accepted tiny marks and no early coverage failure.

The existing 240×160 blue/ochre silhouette fixture supplies one modest generality check: matched 300/1200 caps, material 2 and unchanged settings. Control: 300 operations, 312 proposals, 2326 candidates, 1.228 s; treatment: 300, 319, 2379, 1.379 s. Both stop at operation caps, preserve the coloured subject/background and broad marks; contour/background mark differences remain. This one fixture supports compatibility, not universal superiority.

## Costs and implementation

Full generation time rises **5.69%**, candidates **3.25%** and proposals **3.30%**. These are one sequential matched pair, not a speed guarantee. Timing brackets only engine `step` calls; image capture, session creation and diagnostic callbacks are separate. Full creation is .342 s control / .298 s treatment; rendering/checkpoint capture is .686/.609 s. Short/full/contrast generation all use uninstrumented engines. No equal-computation claim follows from equal accepted strokes.

[Fixed-candidate evaluation benchmark](artifacts/v13/benchmark.json) isolates calculation cost: 125 identical candidate/state evaluations per sample, one warmup per side, three alternating timed pairs. Control median 258.212 ms (249.773–259.609); treatment 282.218 ms (281.219–282.623), about 9.3% more for this broad-heavy sample. It does not predict whole-run overhead. The bounded live trace takes 3.299 s, including 1.283 s measured observer work; its engine time excluding callbacks is approximately 2.016 s. Separate diagnostic replay/statistics and tests are additional analysis work, not included in generation timing.

The penalty shares candidate rasterization, reference targets, importance and the existing affected-area scoring traversal. It adds one pre-deposition Float64 integral **patch**, allowing fine spatial comparison without a second rasterization or full-image candidate table. Additional temporary memory is `24 × (patchWidth+1) × (patchHeight+1)` bytes per evaluated candidate. The largest recorded accepted patch in either full run is 632×153, requiring **2,339,568 extra bytes (2.23 MiB)**. There are **zero persistent new image arrays**; there is additional transient allocation/GC pressure. This is buffer accounting, not measured peak RSS. The memory guard conservatively reserves another **7,018,704 bytes** at this rooster size; limits are unchanged.

Canonical changes are local scoring/ranking/acceptance, its scratch-memory allowance, planner provenance **13**, and rebuilt standalone pages. Document v4, brush library 3.0 and new material **2** remain. Missing/legacy material replay stays exact. Captured experimental treatment documents retain their provisional planner-11 metadata; their source hashes identify the tested candidate. Production scoring/search function bodies match the experiment exactly; only snapshot provenance and conservative memory estimation differ. Historical planner tags never activate a parallel engine.

No temporary production observer, experiment toggle, second remedy or superseded trial is installed. Archived source and bounded runners exist only as reproducible evidence. Maintained v7 regressions now expect planner 13 and write into the new v13 evidence directory, preserving old captures.

## Verification actually performed

Main commands used (the initial freeze captured hashes and archives; candidate-source preparation resumed after the CRLF correction described below):

```sh
node v13-recovery.cjs freeze
node v13-recovery.cjs diagnose
node v13-recovery.cjs short
node v13-recovery.cjs full
node v13-recovery.cjs contrast
node v13-recovery.cjs trace
node v13-recovery.cjs statistics
node v13-recovery.cjs gallery
node --expose-gc v13-benchmark.cjs
node build.cjs
node v13-test.cjs
node v7-test.cjs
node v13-browser-smoke.cjs
node v13-recovery.cjs verify
```

[Four focused groups](artifacts/v13/tests.json) pass: independent full-surface point/box-sum utility including edge clipping, radius-2 blur, compound/feathered deposition and small texture tolerance; deterministic decisions, positive original gain/utility, accounting, continuation and modern saved replay; targeted support and exact undo including residual/revisit state; historical v2/v9/v11/current-control material/render identity, captured-treatment equivalence and unchanged unrelated functions/history. Eleven maintained [v7 regression groups](artifacts/v13/v7-regression/verification.json) pass, including useful broad repair without narrow-feature damage, fine recovery, candidate/contact bounds, halo scoring, cancel/continue, compound feather exports, preview invariance and unsafe-budget rejection.

[Real Chrome smoke](artifacts/v13/browser-smoke.json) passes: built studio/worker emits planner 13/material 2, actual modern and legacy 2× export pixels equal canonical replay, historical v11 import is not reinterpreted, and four brush-lab families retain material 2. Initial sandboxed Chrome startup failed before testing because its GPU process could not start; the existing local harness then passed with approved execution escalation. No browser/UI defect was hidden. Firefox and unrelated full UI/material matrices were not rerun.

Two diagnostic harness issues were corrected before final evidence: CRLF matching in the source transform, and a fixture initially supplying two rather than four Bezier control points. The source-preservation test also needed line-ending normalization. These did not alter the candidate formula or trigger additional generation/tuning. [Final artifact checks](artifacts/v13/artifact-checks.json) verify 447 frozen historical files/report hashes, 381 gallery image/link paths, builds, provenance and preservation of the complete incoming handoff. Superseded trace crop images were removed; complete affected-footprint panels remain.

**Decision: retain this bounded partial improvement.** Remaining defects include pale fragments at the standing foot and other silhouette edges, broad relief-profile ghosts, foundation bands, and the changed diagonal Neutral patch. Background-confidence selection, painterly abstraction and general performance optimization remain deferred.
