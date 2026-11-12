# Stroke Master v12 — coherent paint surfaces

V12 ships one bounded overlap change. Thin correction paint can no longer compress an arbitrary fraction of thick underlying impasto. The fixed-record comparison shows substantially less scratchy foot fringe and more coherent feather marks, with pigment and coverage bit-identical. Broad rectangular background ghosts and regular foundation bands remain. This is a convincing partial improvement, not a complete material recovery.

Open the [offline comparison gallery](artifacts/v12/comparison.html). It includes matched whole paintings, ghost/fringe/eye/neck/feet/quiet-background crops, four existing brush families and the existing blue/ochre contrasting fixture. Native and 2× sources display at the same size. Both sides use the unchanged Neutral and Raking presets, including their existing shadow settings. Click images for full-resolution inspection.

## Baseline and scope

Incoming tracked work was clean at commit `25f6cdd7d991f08dafb9814e956fa10859714952` (SM v11). No commit, reset or branch change was made. Work stays inside `stroke-master/`. Applicable ancestor/project instructions were checked; none were found. README, HANDOFF, V10/V11 reports and the relevant canonical engine, worker, lab and build paths were read before editing.

The exact input is the v11 fixed recording `artifacts/v11/full.json`: 16,800 recorded operations, 632×461 planning pixels. Its provisional historical planner metadata is left intact; the operations, not that label, define this comparison. Its replay matches every captured v11 RGB/coverage/height hash. The current v11 planner, including the one-in-sixteen bounded residual revisit, is retained.

[freeze.json](artifacts/v12/freeze.json) captures the source/input hashes, commit, historical evidence and pre-change production hashes. The exact incoming engine and HANDOFF are inert evidence in `artifacts/v12/engine-before.txt` and `handoff-before.txt`. They are not runtime engine alternatives. V10/V11 artifacts, reports and scripts are verified unchanged. Earlier historical records are read for compatibility, not regenerated.

## What actually creates the defects

The old rule is **not** simple accumulation. With existing height H, fresh profile height h and actual deposition alpha a:

```text
H' = min(24, H × (1 − 0.38a) + ha)
```

Pigment and coverage composite independently of existing height values. Material pigment modulation tests the presence of a height buffer, not its contents. Therefore a height-only intervention can preserve both colour and coverage exactly.

The trace checks actual covered 3×3 neighborhoods, not just operation bounding boxes. It records old/new height, actual alpha, RGB, coverage and central-difference slopes. Later per-pixel compression is included when attributing surviving slope contributions. The selected broad/fine operations have the largest positive surviving contribution along the final slope among the respective non-foundation width groups at the selected near-source-colour background points. This is local attribution, not a claim that either operation alone creates the entire crop.

| Trace | Broad background ghost | Fine foot fringe |
| --- | ---: | ---: |
| Actual point | (491,77) | (470,352) |
| One-based operation | 134 | 3127 |
| Brush / canonical width | flat / 42.439 | round / 2.464 |
| Load / body | 1.35 / 0.606 | 0.96 / 0.48 |
| Actual alpha | 0.8641 | 0.8442 |
| Earlier height H | 3.4364 | 1.6467 |
| Fresh profile height h | 1.7156 | 0.04441 |
| Compressed earlier height 0.38aH | 1.1283 | 0.5282 |
| Net height change | +0.3540 | −0.4907 |
| Height immediately after | 3.7904 | 1.1559 |
| Final height | 2.5819 | 0.8688 |

At the broad point, operation 134 turns earlier brown pigment `[191,151,142]` into nearly white `[246,241,240]`, while considerable old height survives and fresh paint adds height. Coverage is already essentially complete before and after. The final pigment is `[254,253,253]`, yet Neutral produces `[147,147,147]`: colour correction has not corrected geometry. The final slope is approximately `(-1.077,-0.294)`.

The flat profile has narrow shoulder/endpoint transitions (0.025 normalized units), and its fresh height retains a positive baseline `0.4 + 0.6 × ridge` through the covered profile. Deposited height therefore drops over a narrow alpha boundary. This exposes squared footprints; substantial earlier relief also survives subsequent colour corrections. The broad defect involves **A (surviving old relief), B (abrupt new height) and C (flat footprint boundary)**. Limiting thin-stroke compression does not repair that profile and can leave some broad edges more visible.

At the fine point, operation 3127 improves pigment `[245,239,239]` to `[252,251,251]`, but cuts height by 0.491 despite only 0.044 of fresh profile height. Its slope changes from `(-0.330,0.264)` to `(-0.812,-0.165)`. Neutral darkens from `[230,224,224]` to `[167,167,167]`; later corrections leave nearly white pigment but Neutral `[148,148,148]`. It is principally an engraved depression produced by overlap compression, not a disproportionately tall newly deposited fine ridge. The lit fringe has both raised and depressed boundaries; brightness alone does not identify their sign.

[trace.json](artifacts/v12/trace.json) contains the actual operations and neighborhood events. [trace-lighting.json](artifacts/v12/trace-lighting.json) and before/after/final gallery crops use the **full composed height field**, so grazing shadows can read surrounding paint. Height images share the fixed height×20 grayscale mapping; coverage views share the uncovered-fraction mapping.

Directional normals read ±1 **canonical** pixel via bilinear height sampling; export scale changes sampling distance in raster pixels, not height units. The existing lights reveal real steep slopes. No normal/sampling inconsistency (**D**) was demonstrated. Global lighting reduction was not tested or retained.

## One intervention

The attempted and retained rule is:

```text
H' = min(24, H + a × max(−h, h − 0.38H))
```

The negative displacement is bounded by the amount of fresh paint available. Positive net additions retain their mathematical amount. The rule uses the existing canonical deposited height, which already reflects brush width, profile, load, depletion, thickness and texture. It has no new tuning constant, background classifier, location rule or mask. It retains compression and existing relief rather than flattening the surface. Very thin corrections over large height can still depress it gently; loaded small brushes can build raised accents on thinner paint.

This is one overlap remedy. No profile softening, brush-size multiplier, normal correction, planner change or lighting adjustment is combined with it. No new UI control, dependency, image buffer or raster pass was added.

The first comparison compiled the frozen control with exactly that one expression replaced as an **explicit diagnostic override**. It never rewrote the v11 recording. [comparison.json](artifacts/v12/comparison.json) records the override, source hashes and exact buffer hashes for six matched cases: rooster, existing contrast fixture and four-brush selection, each at native and 2× resolution. The production versioned implementation subsequently matches those candidate hashes exactly. RGB and coverage match control bit-for-bit in every case.

## Visual assessment and limits

- Foot corrections have much less engraved, scratch-like fringe at both resolutions and under both existing lights. Ivory pigment fragments and some local material edges remain.
- Eye and neck detail retain the same pigment. Much of the previous etched relief reads as overlapping paint instead; the surface is calmer. Some fine relief contrast is deliberately lost because its old magnitude came from compressing the undercoat, not from the fresh fine profile. This is a visual tradeoff, not proof that lower height is always better.
- Deliberate broad texture and impasto remain. The upper background's rectangular relief ghosts are not eliminated, and some become more visible as earlier relief is compressed less. Horizontal foundation bands remain.
- The quiet background is still painted and banded. There is no blanket background suppression.
- Flat/filbert/round/detail examples on a loaded undercoat retain their profile character. Fine scratches are restrained; loaded fine paint still has nonzero, varying texture and can form raised accents on a thin substrate. The brush lab also uses the new material for newly generated studies.
- The existing blue/ochre silhouette retains its broad painted surface and prominent impasto. Small correction grooves are calmer; squared broad patches remain. Improvement is less dramatic than the rooster fringe.

At 2×, the existing profile filter resolves sharper fine-brush peaks. In the controlled loaded round example, peak bare-paint height is 0.336 at native versus 0.448 at 2×, while integrated height per canonical pixel changes only from 44.586 to 43.961 (−1.4%). Bare-paint height buffers are exactly equal between legacy and new material at each scale. This is pre-existing resolution-dependent filtering, not a new width/height scale multiplier. Equivalent-scale visual comparisons show the same qualitative benefit; native and export rasters are not expected to be pixel-identical.

Deferred mechanisms are broad-profile edge transitions, foundation band geometry and remaining pigment fragments. They were not pursued in this iteration. This result does not establish that the formula is a complete physical paint model or works best for every style.

## Runtime and memory

Node v24.20.0, full 16,800-operation native record, one warmup per side and three alternating timed replay/render pairs. GC runs outside replay timers. Initial Neutral timings were noisy (candidate 20.8–64.5 ms), so only rendering was repeated on the same fixed surfaces: three warmups and nine alternating pairs. Lighting quality is unchanged final rendering with 12 shadow samples.

| Operation | Control median (range), ms | Candidate median (range), ms |
| --- | ---: | ---: |
| Replay / deposition, 3 pairs | 3487.5 (3447.7–3500.5) | 3456.1 (3438.9–3493.5) |
| Neutral render, 9 repeat pairs | 16.69 (15.83–17.44) | 16.65 (15.90–21.98) |
| Raking render, 9 repeat pairs | 177.81 (167.76–190.27) | 179.43 (164.23–185.74) |

The ranges overlap. There is no demonstrated speed improvement or material runtime regression in this small sample; do not generalize sub-percent median changes. Additional image-array memory is **0 bytes**. Both full surfaces use 5,827,040 bytes for RGB, coverage and height; the same per-stroke scratch arrays are reused. A scalar material-version field is added. This is buffer accounting, not a measured RSS claim. See [benchmark.json](artifacts/v12/benchmark.json) for every sample, initial noise and repeat provenance.

## Compatibility and actual validation

`engine.js` remains canonical. Newly generated studio records and lab studies retain document version 4 and brush library `oil-library-3.0`, with **`materialVersion: 2`**. Planner metadata remains **11**. Missing materialVersion, or explicit version 1, selects the exact legacy height rule; unsupported versions are rejected. Version 2 requires document v4. No historical record is migrated automatically.

The material tag is retained through document validation, live worker previews, timeline checkpoint copies/resets, source-free replay and both stroke/smooth export worker surfaces. Smooth export still shades at planning size before scaling. Targeted strokes use the same rule/support; Undo restores original buffers and retains the surface material version. There is no experiment switch in production.

Commands actually completed:

```sh
node v12-surfaces.cjs trace
node v12-surfaces.cjs compare
node build.cjs
node v12-test.cjs
node v12-browser-smoke.cjs
node --expose-gc v12-benchmark.cjs
node --expose-gc v12-benchmark.cjs render
node v12-surfaces.cjs detail
node v12-gallery.cjs
```

Six focused engine groups pass: historical v2/v3/v4 buffer/render identity (including the user's v2 asset and full v9/v11 records); exact diagnostic candidate hashes at native/2×; matched deterministic sessions and unchanged planner operations/RNG/counters; new-record replay and forward/backward cached timeline round trips; fine texture/loaded accents and canonical volume checks; targeted support, exact Undo and continuation; invalid-version rejection, embedded canonical source and historical evidence checks. Details are in [tests.json](artifacts/v12/tests.json). The group labels combine related assertions; no new full planner regeneration was run.

Real Chrome checks pass for the built studio and optimiser worker, new material/planner metadata, exact modern and legacy **2× final export-worker pixels**, historical v11 import without reinterpretation, and flat/filbert/round/detail studies in the built lab. See [browser-smoke.json](artifacts/v12/browser-smoke.json). An initial test-harness string-escaping error was corrected before the successful run; it was not a production defect. No Firefox or unrelated full UI suite was run.

Final artifact checks verify gallery script syntax and 82 image/link paths, all 240 frozen historical files, and preservation of the entire incoming HANDOFF as the suffix of the updated file. See [artifact-checks.json](artifacts/v12/artifact-checks.json). Git diff whitespace checks pass; all pending changes remain inside `stroke-master/`.

The existing fine-brush peak assertion initially assumed less than 25% resolution variation. Inspection showed the pre-existing profile filter accounts for the 33.5% peak change on bare paint. The final check verifies canonical integrated height and exact legacy/new bare-paint buffers instead of masking that known variation.

Use `trace` only in a fresh output directory: it deliberately refuses to overwrite its frozen trace. `compare` reproduces the explicit override; `detail` renders full-field before/after evidence; the gallery is regenerated from those artifacts. Stop here for visual review of the bounded partial improvement.
