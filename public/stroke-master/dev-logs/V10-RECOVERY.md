# V10 background-artifact diagnosis

**Foundation height causes the quiet horizontal bands, but removing it leaves the rectangular correction ghosts and gray/ivory foot debris.** Some raised ghosts become more conspicuous. The pigment defect traced below requires a paint-placement or colour decision, not a lighting adjustment. No sufficiently supported small production fix emerged, so the app and standalone pages remain unchanged v7.

Open the [offline comparison](artifacts/v10/comparison.html): exact v9 control versus foundation-height ablation, pigment first, identical Neutral lighting, existing native crops, one before/after stroke trace, and one contrasting-background check. The ablation is diagnostic only; it is not offered as improved production behaviour.

## Fixed-record experiment

Read applicable instructions, README, HANDOFF, V8-BASELINE, V9-EXPERIMENT and the relevant deposition/replay implementation before editing. No nonempty applicable AGENTS.md was found. Work stayed inside `stroke-master/`. Current commit is `08ba42893e757b5bdfd74d049e2dccf4cb22d5e3` (`SM v8`). V9 was already uncommitted, including HANDOFF and its evidence/runner/report; all that evidence was preserved. The pre-v10 HANDOFF is copied byte-for-byte to [handoff-before.txt](artifacts/v10/handoff-before.txt). No commit, reset or branch change was made.

[Freeze](artifacts/v10/freeze.json) records production, input and historical evidence hashes, Git status, v9 settings and schedule. Engine SHA-256 remains `bdf5aa96d044452916b5d2fdf6fc34073ef3a7bfb88c9850617671962c0bd7e0`. Exact v9 final-document SHA-256 is `a5ce9b7e2736d9e4beb12de429101e321f7a3df151b1e99feb61264d038c98bd`; decoded rooster input SHA-256 is `7f585cf7994dd54b335a14253fefff9a93529d8e483a548a4eb36504f2f93b2d`.

Replay uses the same 632 × 461 v9 document, Fine, seed 42, Balanced, Body 0.65, recorded enabled brushes and material. Both sides use Neutral azimuth 225°, elevation 55°, intensity 1, ambient .65, relief 1, white light, warmth/shadow 0. Pigment views change only relief to 0. There is no generation or trajectory change in this comparison.

Foundation operations are identified by recorded `layer: "foundation"`, which `foundationStroke` assigns. Their contiguous prefix and count are checked against the document's accepted-foundation metadata; the intervention does not assume twelve operations. This document actually has indices 0–11. Each foundation operation is rasterised normally into the diagnostic surface, then only its height update is restored to the preceding height buffer. Every later operation is replayed unchanged.

The height array stays present. Removing it entirely would also disable pigment striations and would be an invalid height-only intervention. Inspection shows pigment/coverage deposition does not read existing height values. Later height **does** depend on earlier height through `min(24, oldHeight * (1 - alpha * .38) + depositedHeight * alpha)`. Thus the final height difference reflects later compression of foundation ridges, not simple subtraction of an untouched foundation image.

[Diagnosis](artifacts/v10/diagnosis.json) confirms **final RGB and coverage are bit-identical** between control and ablation. Control material buffers match v9 exactly. This is a clean height intervention for pigment/coverage; later height and its lighting response change as intended.

## Findings and one local trace

| Area | Control mean height | Ablated mean height | Visual result under identical Neutral |
| --- | ---: | ---: | --- |
| Quiet background | 2.7545 | 0 | Horizontal bands disappear; all its height came from foundation. |
| Upper background | 3.0006 | 1.1632 | Raised diagonal rectangular ghosts remain, with increased contrast in parts. |
| Lower artifact crop | 2.6910 | .0253 | Background bands diminish; subject-edge fragments persist. |
| Feet / silhouette gaps | 2.2793 | .4640 | Gray/ivory pigment cutbacks remain; their relief changes. |

These are buffer descriptions, not aesthetic scores. Upper ghosts surviving with foundation height removed establish a later-deposition contribution; the investigation does not attribute each ghost to a specific operation. Whole-painting and eye/neck/tail crops retain exactly the same pigment detail. Neutral shading changes on the subject too, and expressive later-stroke relief remains. The intervention creates a flat quiet background and more visible correction rectangles elsewhere; that mixed result does not satisfy the requested visual goal.

One conspicuous pale foot cutback was traced locally, inside `[428,347,45,44]`. The selected source pixel **(430,350) is [255,255,255]**. Actual independent coverage, before/after material buffers and saved-prefix replay identify **operation 63** as the surviving cause there:

| Property | Evidence |
| --- | --- |
| Stroke | Flat; width 79.159 canonical pixels; pass 0, painting layer; curve gesture; not tagged edge repair. |
| Paint / body | Colour [195,184,181]; thickness .48; opacity .97; load 1.35; depletion .07; dry .08; pigment .35. Global Body setting remains .65. |
| Footprint | Bounds `[406,292,520,416]`; isolated raster coverage at the selected pixel .83403. The gallery shows the actual coverage footprint, not just bounds. |
| RGB before → after | [254.3673,254.4113,254.2235] → [203.8272,194.8141,192.1269]. |
| Height before → after | 2.65292 → 3.12014. |
| Coverage before → after | .98973 → .99830. |
| Survival | No later operation deposits at that pixel; its post-operation RGB equals final v9 RGB exactly. |

The gallery shows source, prefix 62, prefix 63 and final local crops in both presentations. The stroke visibly introduces a broad gray mark over nearly white pigment; it also raises local height. Wrong pigment is directly demonstrated in relief-off views, while Neutral lighting adds a height response. This is a combined pigment/material defect, not a shadow-only artifact. Candidate attribution used actual local buffer changes and their surviving contribution to the final source residual; mere footprint overlap was insufficient. Prefix 63 independently validates and replays to the recorded pixel.

## Production decision and small generality check

**No production fix was attempted.** Foundation-height removal accounts for one defect type but preserves or emphasizes others and removes deliberate foundation texture. A narrower material remedy still needs evidence that it preserves useful relief. It cannot repair the demonstrated gray pigment spill. No background mask/freeze, white-specific rule, lighting retune, deposition version change, planner/search/objective change or UI control was added.

The same fixed-record ablation was applied to the existing blue/ochre `silhouette` fixture at 240 × 160. One unchanged v7 short record uses Fine, seed 42, Balanced, Body .65, the v9 brush list, and caps 300/1200. Both sides use that exact record and identical settings. Its deterministic repeat matches strokes, RNG and material buffers. Pigment/coverage remain exact through ablation; rectangular brush structure persists and there is no consistent visible recovery in the common Neutral views. This is a modest generality check of the diagnostic, not a production treatment or broad benchmark.

There was no justified production candidate, so candidate short/full matched generation, new 1800/5000/10000/15138 checkpoints, a rebuild and a browser smoke test were not run. The gallery's whole rooster is the actual v9 final control, not a new generated result. Its existing checkpoints remain available in the [v9 gallery](artifacts/v9/comparison.html). No trajectory-equality claim is made for a hypothetical changed engine.

## Actual work, costs and verification

| Record | Allocated ops/proposals | Accepted ops / contacts | Consumed proposals | Candidates / candidate contacts | Stop |
| --- | --- | ---: | ---: | ---: | --- |
| Reused v9 final | 16800/67200 | 16800 | 20697 | 146997 | Stroke budget reached |
| Small contrasting fixture | 300/1200 | 300 | 317 | 2373 | Stroke budget reached |

Rooster generation this iteration: **0**. Paired diagnostic raster replay: 6.932 s; initial whole/crop rendering and PNG export: .230 s. Local trace replay: .115 s; measured trace rendering: .006 s. Pixel selection, regional analysis, I/O outside these timed blocks and verification are additional overhead, so these are phase times, not end-to-end runtime. V9's previously measured 46.981 s generation is preserved historical evidence, not a v10 regeneration.

The contrasting record spent 1.268 s in `step`, with .070 s session creation. Its determinism replicate spent 1.134 s in `step`, with .039 s creation. Diagnostic paired replay: .260 s; rendering/export: .033 s. [Contrast record and measurements](artifacts/v10/contrast.json). No historical v2 speed comparison or performance project was undertaken.

[Focused verification](artifacts/v10/verification.json) passes: runner syntax; exact v9 control buffers and Neutral PNG; exact ablation pigment PNG; independently validated/replayed culprit prefix; isolated coverage-footprint pixels; contrasting-record determinism/validation/replay; v2/v3 material replay compatibility against frozen v7; unchanged production/build/standalone hashes and unchanged v8/v9 evidence hashes. Commands: `node v10-recovery.cjs diagnose`, `contrast`, `verify`, `gallery`, and `node --check v10-recovery.cjs`. No deposition changed, so targeted-refinement boundary/undo tests and unrelated browser/UI suites were unnecessary. The runner refuses to overwrite the saved diagnostic or contrasting record.

## One next experiment — not executed

Run a **fixed-footprint colour-fit counterfactual for the traced broad stroke**: retain operation 63's geometry, alpha, body and every other recorded operation; replace only its paint colour with the alpha-weighted source colour fitted over its actual deposited footprint. Compare the original and counterfactual using the existing full-footprint structural metric plus pigment/Neutral crops of the foot and affected subject. This tests whether the spill comes mainly from colour fitting or an unsuitable broad footprint before proposing a general planner remedy. Diagnostic coordinates are acceptable for this investigation; any eventual production change must generalize without subject-specific regions. This counterfactual has not been run.

Stop here for visual review. Production remains v7, with no speculative recovery fix shipped.
