# V11: recover neglected correction areas

**One bounded residual-revisit change is retained.** The matched extended run corrects the reproducible gray foot spill and reduces debris across the larger foot/silhouette crop, while preserving a readable eye and intricate neck/saddle feathers. Ivory pigment fragments, horizontal foundation bands and raised correction ghosts remain. Neutral lighting makes some correction ridges more conspicuous; this is a pigment recovery, not a relief fix.

Open the [offline comparison](artifacts/v11/comparison.html): colour-fit diagnosis over the complete footprint, short matched check, whole paintings and feet at 1800/5000/10000/15138/final, subject/background crops, and the contrasting fixture. Pigment-first and identical Neutral presentations are separate. Art direction toward a less lifelike finish remains deferred.

## Preserved state and method

Read applicable instructions, README, HANDOFF, V9-EXPERIMENT, V10-RECOVERY and relevant implementation before editing. No applicable AGENTS.md was found. Git was clean before the new runner; current commit is `2bc24da7cc5256514983f033de38f5daa554905f` (`SM v10`). No commit, reset or branch change was made. All writes stay inside `stroke-master/`.

[Freeze](artifacts/v11/freeze.json) records source/input hashes, runtime and exact settings/schedule. V9/v10 evidence, reports and runners remain byte-identical. The incoming HANDOFF is preserved in [handoff-before.txt](artifacts/v11/handoff-before.txt). Original engine SHA-256: `bdf5aa96d044452916b5d2fdf6fc34073ef3a7bfb88c9850617671962c0bd7e0`; retained engine SHA-256: `6a7acf1fecf1ce46bacb39f27d773be2f5879c4f214dde5166d192a369394b38`.

Rooster input is the verified decoded v9 source, 632 × 461, Fine, seed 42, Balanced, Body .65, the same enabled brushes and no priority marks/targeted work. Start 1400/5600; add 700/2800, 700/2800, 7000/28000, 7000/28000. Allocated final caps remain 16800/67200. Neutral: azimuth 225°, elevation 55°, relief 1, intensity 1, ambient .65, white light, warmth/shadow 0. Pigment views use relief 0 only. Node v24.20.0, Windows x64. Equal seeds/budgets do not imply identical strokes or equal compute.

## Colour counterfactual and actual refinement path

Operation 63's geometry, alpha, body and every other recorded operation were retained. Its actual independently rasterised coverage above 1e-5 defines 1312 deposited pixels, including 480 subject and 832 background pixels under the existing source-derived region classifier. The colour fit accounts for pre-stroke structural pigment and alpha:

`c = clamp(Σ a[S - (1-a)B] / Σ a², 0, 255)` per channel, where `a` is actual deposition alpha, `B` is the existing unstriated structural RGB and `S` is source RGB. It minimizes point-colour squared error on that footprint, not the multiscale objective. Material striations/clamping are not fitted. The simpler alpha-weighted source average `ΣaS/Σa` was computed for comparison, not substituted for the fit.

Original colour [195,184,181]; source average [216.227,210.487,207.326]; fitted colour [217.776,212.523,209.438]. Coverage and height remain bit-identical. The selected final pixel lightens from [203.827,194.814,192.127] to [222.823,218.603,215.845] but remains gray. Final deposited-footprint background squared RGB error falls about 12.2%, while subject error rises about 1.7%. Immediate existing objective gain falls from 48.02961 to 32.38966; final structural error changes only from .000749855 to .000747706. Complete-footprint pigment and Neutral views show this tradeoff. These findings do not justify colour fitting as the principal production remedy. [Colour-fit evidence](artifacts/v11/colour-fit.json).

A narrowly instrumented **live v7 session** regenerated the exact v9 strokes, buffers, RNG and candidate count through all continuations. Stroke replay was used only for images/objective calculations, never claimed to restore planner state. Observation consumed no RNG. Checkpoint full-score recalculation independently confirms pixel errors, structural tile sums and feature tile sums agree with cached values within 1e-8.

| Actual control evidence | Finding |
| --- | --- |
| Pixel (430,350) | Importance 0, coherence 0. Final structural error .0173472; feature attention error .00251980, reflecting the .05 quiet-area factor. |
| Its tile 395 | Correctly updated through revision 119; eligible throughout. Final raw structural share .2063%, feature share .04831%, before anti-repeat weighting. |
| Selection after operation 63 | Tile selected 16 times; 121 proposal centres within 24 pixels. Centres in this tile mostly favour the nearby subject edge rather than the damaged quiet area. |
| Candidates actually depositing at the pixel | 161; all negative gain (best −.334414), all broad flat marks in the observed set. None accepted; no later accepted operation touches it. |
| Fine proposals directly at the point in regenerated final state | Twelve existing filbert candidates, widths 1.81–2.63, gains .15074–.37936, all above the unchanged 1e-6 threshold. No acceptance override. |
| Existing broad repair at that point | No candidate generated: analysed count increases, while proposed/cached counts do not. Its sampled coherent-region test fails before cache lookup. |

This establishes **attention/proposal-centre neglect of a correctable quiet residual**, not missing error data, hard eligibility exclusion or a stale-cache bug. Full-footprint acceptance correctly rejects collateral broad repairs, and can accept ordinary fine corrections when they are generated at the residual. Regional/feature averaging reduces its attention, but its objective gain is sufficient. It is not accurate to say the entire tile was never visited or that no candidate reached the pixel. [Live trace, selected centres, depositing candidates and probes](artifacts/v11/attention-trace.json).

## One general remedy

During global directional/fine work, one in sixteen proposal slots can select the **existing structural residual** instead of feature-weighted detail attention. Tile weights integrate the existing multiscale error; its 70% coarse/20% fine blur terms provide spatial context, rather than chasing a global worst pixel. The normal 32-point tile sampler uses structural error without its extra feature-importance multiplier in that slot. Existing soft regional priority, candidate generation, coherent broad repair and full-footprint acceptance remain.

A `revisitVersions` array permits one revisit attempt per tile revision. An unchanged attempted tile waits until accepted nearby work refreshes that tile; if no residual is eligible, ordinary attention fills the slot. Thus retry handling is bounded and all work stays inside existing budgets. Ordinary feature-guided search retains the other fifteen slots. Correction can occur anywhere; no coordinates, white-specific rule, permanent background mask or cleanup pass enters production.

Targeted location sampling returns through its existing local branch. The generic target-undo metadata snapshot includes the new eligibility array, and focused tests verify exact restoration. No colour-fit, objective-weight, brush scheduling or material/deposition change was combined with the intervention. New production snapshots identify `plannerVersion: 11`; document v4/brush library and old replay semantics remain. The provisional experiment records retain their captured planner-7 metadata; their candidate engine hash identifies the actual experimental search. Production search is byte-identical to the tested candidate except that snapshot metadata tag.

## Matched visual results and actual work

The short run uses the first two v9 allocations and stops normally at 2100. Its 1800 crop shows no obvious subject damage; the traced pixel is still gray then. One full matched treatment was subsequently generated. All five full-run boundaries stop at their operation caps, with no plateau or safety-limit stop. First differing accepted operation is 713; operation 63 is unchanged.

| Accepted ops / contacts | Control candidates / candidate contacts | Treatment proposals | Treatment candidates / candidate contacts | Treatment error | Treatment generation s |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1800 | 13892 | 1921 | 13789 | .006960823 | 7.829 |
| 5000 | 38566 | 5371 | 38441 | .002988564 | 15.814 |
| 10000 | 80545 | 11184 | 79770 | .001211011 | 28.015 |
| 15138 | 128930 | 18123 | 128871 | .000555476 | 40.975 |
| final 16800 | 146997 | 20545 | 145971 | .000460513 | 45.303 |

Interior checkpoints are active snapshots; final state is `Stroke budget reached`. All operations here have one contact. Allocations, all boundaries, actual counters and prefix checks are retained in [full checkpoints](artifacts/v11/full-checkpoints.json). The control consumes 20697 proposals and the treatment 20545, both below the 67200 allowance. No equal-compute or historical-v2 speed claim is made.

Actual treatment operations **6502 and 13873** are white filbert corrections, widths 3.251 and 3.065. At the traced pixel they change RGB first to [249.525,248.858,248.482], then [254.257,254.166,254.115]. They are observed accepted corrections, not a synthetic repair inserted into the recording. The exact proposal slot for these operations was not instrumented, so neither is claimed to be directly tagged as a revisit-slot acceptance; the matched treatment tests the single search change and its ensuing trajectory.

Across the full existing feet crop, source-background mean squared pigment error falls from 222.47 to 67.37, and source-subject error from 235.27 to 202.56. Across the full bounds of operation 63, both subject and background error decrease, and the gallery includes all affected subject pixels. These diagnostic groupings use existing source `regionValues`, not a production mask or aesthetic score. [Regional measurements and actual corrective operations](artifacts/v11/comparison-statistics.json).

Visually, late foot/silhouette gaps are cleaner, the eye remains readable and dense flowing feathers remain. Intermediate paintings still contain blocky shapes and debris; improvement is not uniform at every checkpoint. Tail mark character changes, with some sharper flecks. Ivory fragments under/around toes and the planted foot persist. Quiet background pigment is identical and its horizontal bands remain. Upper-background pigment error is slightly worse (35.50 → 36.98 over that whole crop); rectangular ghosts remain, and fine corrective ridges around feet can be conspicuous under Neutral. No relief improvement is claimed or concealed.

The existing blue/ochre silhouette fixture uses matched Fine/42/Balanced/.65 settings and caps 300/1200. Control: 300 operations, 317 proposals, 2373 candidates. Treatment: 300, 312, 2326; both stop at their operation cap. The common views retain subject shape and coloured background brush character, with modest contour differences rather than a broad quality guarantee. This one contrasting reference is not a benchmark matrix.

## Costs, checks and shipped state

Generation is timed only around engine `step` calls; creation, continuation, replay and export are separate. Short treatment generation: 8.741 s; creation .360 s; continuation .1825 ms. Full: 45.303 s; creation .353 s; four continuations .5091 ms. Full saved-prefix raster replay: 3.855 s; rendering/PNG export .697 s. Contrast treatment: 1.275 s generation; .063 s creation; .168 s replay; .021 s rendering/export. The historical v9 generation measurement is 46.981 s from a different execution, not a controlled speed result.

Diagnostic colour fit: 13.254 s raster replay across control/counterfactual structural/material surfaces, .246 s initial rendering/export, no generation. Completed live control trace: 44.150 s in `step` excluding .187 s measured callback work, plus checkpoint analysis/loop overhead; no historical speed inference. One slower VM instrumentation attempt was cancelled before completing and replaced with same-context diagnostic compilation; its partial work is not included in the completed trace timing. No partial diagnostic result was used as evidence.

Passed [five focused engine groups](artifacts/v11/candidate-verification.json): determinism/accounting/continuation; one attempt per unchanged revision; targeted support and exact undo including revisit state; saved treatment validation/replay and prefix preservation; historical v2/v3 golden materials and exact v9 replay. [Chrome smoke](artifacts/v11/browser-smoke.json) verifies the built studio worker creates planner-11 records, imports the v9 recording without reinterpretation, and opens the standalone brush lab. Local browser startup required the same approved local-execution escalation used by the existing harness. No unrelated browser/UI matrix was run.

Commands: `node v11-recovery.cjs fit`, `trace`, `short`, `full`, `contrast`, `render <record>`, `compare`, `gallery`; `node v11-test.cjs`; `node build.cjs`; `node v11-browser-smoke.cjs`; syntax/hash/link checks. The runner refuses to replace captured diagnostic/treatment records. Production hooks were never installed. The candidate source is inert provenance under v11, not a maintained parallel planner.

Shipped changes are the bounded attention opportunity and its eligibility state in the canonical engine, new snapshot metadata, regenerated standalone pages, and current documentation/tests. Maintained v7 test assertions now expect newly generated planner metadata 11. No new UI controls or dependencies were introduced. Stop after this iteration; pigment recovery does not resolve the separate material ghosts or deferred art direction.
