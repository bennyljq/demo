# Stroke Master 2

Open **index.html** directly in Chrome to paint, or **brush-lab.html** to inspect the brushes. Both files contain their engine, scripts, and styles. No server, install, runtime network access, textures, brush stamps, neural models, or external services are used. The uploaded image appears only on the reference canvas; painting starts on warm ivory and consists entirely of recorded procedural strokes.

## First evaluation

Start in the brush lab: compare Flat, Filbert, Hog-bristle, and Round with seed 42, a curved gesture, width 140–180, load 1.15, depletion 0.75, pressure 1, and dry amount 0.25. Inspect **Relief Off** and **Strong study**, then the height view and an S gesture. The three thumbnails use seeds 42, 7961, and 15880. Fit shows the entire 1500 × 620 study; 100% provides native-pixel scrolling. PNG export saves the current displayed diagnostic view.

For a first real-image painting, use **1024 planning / Fine / Feedback / 3000 strokes / 12000 proposals / seed 42 / Restrained relief / 2048 export**. Compare Baseline with identical settings and marks. For quicker iterations, use 640 planning, Balanced, 1400 strokes and 5600 proposals. Add a small foreground and background mark only if the automatic estimate is unhelpful. Amber is foreground, blue is background; Erase and Reset remove marks. Changing marks affects the next **Paint**, not an already running or continued session.

The studio has Fit/100% inspection, live pass/error/work counters, Pause/Resume, Cancel, Replay, Save PNG, Save strokes, and Continue refinement. The reference and painting remain visible while the lower controls scroll. Transparency is composited on RGB **242, 239, 228**. Inputs are limited to 32 MB and 40 million decoded pixels. A previous preview remains visible while a new image/job is processed.

## Maintained sources and build

```sh
node build.cjs
node test.cjs
node browser-test.cjs
```

Use Node 22 or later. The build uses only Node standard libraries and generates `index.html` and `brush-lab.html` **in place**. Edit the sources rather than generated HTML:

- `engine.js`: the only canonical analysis, brush, scoring, and optimiser source.
- `worker.js`: studio worker lifecycle, pause/resume/continuation, replay/export.
- `app.js`, `lab.js`: the two small UIs.
- `index.template.html`, `brush-lab.template.html`, `styles.css`: layouts and shared styles.
- `fixtures.cjs`, `test.cjs`, `browser-test.cjs`: synthetic fixtures, numerical tests, real Chrome interactions.
- `render-strokes.cjs`: offline replay of exported JSON, without reference pixels.

The numerical tests assert that both generated HTML files embed the canonical engine exactly. Baseline and Feedback use that same production brush engine. The old two-brush renderer, fixed eight-segment approximation, fixed five-pixel scoring, grain overlay, non-reallocated regional loop, and material-difference assertion have been removed. There is no legacy version switch. Disposable v1 smoke artifacts were removed; the controlled pre-replacement images and measurements remain under `artifacts/comparison/` without their old engine.

## Brush and material model

The four brushes have different footprints and deposition rules:

| Brush | Footprint and paint behaviour |
|---|---|
| Flat | Broad ribbon, squared loading edge, pressure spread, parallel groups, slightly uneven loaded heel. |
| Filbert | Rounded caps and shoulders, sustained curved belly, softer edges and controlled release. |
| Hog-bristle | Unequal stiff bundles, irregular edge spread, deeper channels and substantially earlier broken coverage. |
| Round/detail | Compact pressure belly and narrow tapered ends for important accents and boundaries. |

A stroke records cubic Bézier control points, width, RGB colour, opacity, seed, pressure, taper, load, depletion, dry amount, pigment variation, thickness, pass, and layer. Geometry uses **canonical planning pixels**. Seeds produce persistent bundle positions/widths/loading, ridge weights, pigment phases, lateral lean, and edge phases. Brush-specific pressure profiles and the recorded pressure/release parameters govern spread along the path.

Texture uses normalised **distance along the curve** and position across its width. Unequal loading and broad pigment variation coexist with fine connected striations. Depletion opens persistent channels toward the end. No independently generated pixel noise or post-paint texture overlay is used. Fixed seeded fields are filtered over the render pixel footprint to suppress fine-groove aliasing; larger exports reveal detail from the same fields rather than generating new random fibres.

Adaptive subdivision tests quarter, midpoint, and three-quarter deviation, plus segment length, at the current render scale. It handles S curves and is capped at 96 segments with a depth limit. Stroke rasterisation scans local segment bounds and deposits each pixel once using the nearest path coordinate. Tile order does not change the material field.

Pigment, coverage, and height are composited **before lighting**. The simplified overlap rule is:

```text
coverage_new = 1 − (1 − coverage_old) × (1 − alpha)
pigment_new  = pigment_old × (1 − alpha) + stroke_pigment × alpha
height_new   = min(24, height_old × (1 − 0.38 × alpha) + deposited_height × alpha)
```

The height unit is a canonical pixel. New paint partly compresses covered ridges and adds thickness. Broad bundles carry most relief; fine fibres contribute little height. A fixed, recorded light direction shades the combined surface using height gradients. Off removes shading exactly; whole paintings default to restrained shading, while the lab allows a stronger study. This suggests layered oil-like paint, not a physical wet-paint simulation. It does not model flow, mixing chemistry, impasto curls, or cast shadows.

## Planning, scoring, and feedback

1. Composite transparency; compute scale-aware blurred references, luminance gradients, a smoothed orientation tensor, and boundary importance. Weak/ambiguous gradients have a stable diagonal fallback. A palette of up to 48 anchors retains frequent tones, salient/saturated accents, and distant colours. A bounded ±14 RGB correction smooths anchor transitions.
2. Grow a coarse colour-guided priority mask. Explicit marks use deterministic multi-source Dijkstra propagation; otherwise similar border-connected regions are an automatic background estimate. Softened labels guide order and geometry, not a hidden cutout. No semantics are inferred.
3. Block in with loaded flat paint, then refine shapes and boundaries using reference-guided curves. Tracing checks colour and priority along the path; bounded additional checks shorten crossing curves. Sampling on both sides of the local normal adjusts width to region thickness. Important boundaries prefer round marks, broader shapes filberts, and some textured regions hog-bristle.
4. Coverage distinguishes accidental unpainted gaps from ordinary layered paint. Feedback uses high-error tiles and local importance. Large residual colour errors in quiet regions receive larger repair marks; fine passes target important boundaries rather than making the entire canvas microscopic. Three informed candidates vary position/scale and are structurally scored on local patches. Baseline uses stratified reference-informed sampling and accepts each proposal without comparison or error-guided placement.
5. After acceptance, cache affected errors and tile totals. Render live material previews and audit final appearance at two blur scales.

Structural scoring uses **the same deposited alpha/coverage as material rendering**. It omits pigment striations and relief lighting to keep candidate evaluation cheaper. It therefore cannot fill a region structurally while leaving its material deposition nearly empty. This is an approximation of material *colour*, not of material *coverage*.

For each pixel, with RGB errors normalised by `255²`:

```text
colour_loss = (1 + 2 × importance) × mean_RGB[
  0.70 × coarse_box_error² + 0.20 × fine_box_error² + 0.10 × point_error²
]
gap_loss = 0.025 × (1 − accumulated_coverage)² × reference_background_contrast
reported_error = sum(colour_loss + gap_loss) / sum(1 + 2 × importance)
```

Box radii are rounded from **0.0047 and 0.0016 times the planning long edge**, with a one-pixel minimum. Targets and scoring use identical clipped boxes at image boundaries. Candidate patches contain two blur halos: one for all affected score pixels and another for their neighbouring samples. Integral tables evaluate boxes; there are no full-canvas copies/rescores per candidate. Tests compare local deltas against complete evaluation, including boundary-crossing cases, within `1e-8`.

Accepted refinement gain must exceed **0.000004 per affected pixel**, or **0.0000015** in targeted revisits. The recorded monotonic audit applies to this structural colour-plus-coverage objective, not to shaded material error. Material audits measure final displayed RGB error after blur at 0.003 and 0.012 of the long edge, low-coverage fraction, and unshaded pigment tonal drift. They permit high-frequency texture and relief. Lower structural error alone is not an aesthetic judgement or a guarantee of better material colour.

## Productive sessions and reproducibility

Stroke and proposal budgets are independent: **60–24000 strokes** and **60–120000 proposals** per session, including extensions. Refinement tests at most three candidates per proposal. Block-in begins with 20% of the stroke allocation; shape/fine passes and global revisits follow. Background precedes foreground in regional passes. Unused regional strokes **and proposals** carry forward; a final global accent-recovery task revisits error left by regional plateaus. Allocation-transfer metrics can count the same unused allowance at multiple transfers and are not a unique-stroke count.

Regional plateaus stop after 80 consecutive rejected proposals; global revisits use 128. Stop reasons distinguish stroke cap, proposal cap, scheduled completion, and exhausted useful proposals after revisits. Time never decides completion. If the result reaches its stroke cap while error remains, **Continue refinement** adds budgets to the retained session, keeps its reference analysis, paint, error tiles and RNG cursor, and records the extension in `continuationHistory`. If proposals plateau despite substantial work, more budget can try another targeted revisit but cannot promise improvement.

Pause acknowledges a safe worker boundary; analysis may finish before the acknowledgement. Resume retains state without recomputing or reseeding. Cancel terminates the worker and invalidates stale messages. Upload/restart also discard stale workers. Completed workers stay alive intentionally for continuation; obsolete workers/Blob URLs are released. Export/replay use a separate disposable worker while the optimiser is paused or complete. Invalid extension requests preserve the completed session.

Continuation keeps the original detail, mask, reference, seed cursor, and material settings; changing these controls then pressing **Paint** starts a new session. Only additional budgets alter continuation and are logged. Continuing is available only in the current tab: reloading, cancelling, or replacing the reference releases the optimiser state. Saved stroke JSON is a replay document, not a full optimiser checkpoint.

Identical decoded planning pixels, initial marks, settings, seed, and extension history produce identical stroke records in this implementation. Preview cadence, pause duration, scheduling, and replay speed do not affect the sequence. Browser decoding/resizing/colour management may differ. Export resolution changes geometric approximation accuracy and pixel footprint filtering; it preserves stroke identity but does not promise scaled pixel equality or PNG byte equality across browsers.

## Resolution, memory, and replay

Planning options are **640 / 1024 / 1536** long edge; smaller sources are not enlarged for planning. Export either matches planning or rerasterises at **2048 / 4096**. The geometry and seeds remain canonical; export generates pigment, coverage, and height at the requested dimensions and then shades that surface. It never enlarges the completed painting bitmap. Export resolution alone adds **material detail**, not additional source detail or better likeness.

Memory is estimated before analysis and export. The **768 MiB soft allocation limit** includes conservative planning arrays/temporaries, local scratch, stroke-object allowances, preview/export surfaces, and encoding reserves. A 1536-square plan plus 4096-square export is refused; 640-square planning permits 4096-square export. Candidate patches are capped at 1.5 million pixels, curve segments at 96, and total proposals/strokes at the limits above. Full RGBA previews are throttled by work count and transferred directly, without PNG encode/decode cycles.

The estimate is not a hard browser-process RSS cap. Browser image decoding/colour management, garbage collection, compositor/driver storage, and external process overhead remain outside exact control. Encoded-size checks occur before decode; the decoded-pixel check necessarily happens afterward. A single CPU worker runs optimisation; JavaScript does not automatically use the RTX GPU. Profiling did not justify adding GPU or multi-worker optimisation in this iteration.

JSON records include brush definition version `oil-ribbon-2.0`, canonical dimensions, background, material/light settings, strokes/seeds, continuation history, and audits. Replay requires the matching engine version but **no reference pixels**. For offline replay of a saved file:

```sh
node render-strokes.cjs artifacts/browser/stroke-master-strokes.json 2048
```

This writes `artifacts/replayed.png`. Keep this engine/build with saved JSON for long-term reproduction. The offline helper's actual source-free 480 × 320 replay was exercised during verification.

## Verification and measured comparison

**14 engine verification groups passed**, covering canonical build identity, all four fixtures, determinism/scheduling, pause/resume, exact replay including height, local/full scoring, objective monotonicity, continuation, reallocation/plateaus/work limits, brush distinction, coherent pigment, pressure/depletion, tile order, adaptive work limits, relief/off/overlap, extended resolution, and memory refusal/allowance cases. The obsolete near-zero structural/material pixel-difference assertion is gone.

**16 real-browser verification groups passed in Chrome 154**: direct disk upload, analysis/painting cancellation and restart, retained pause/resume and equivalence to an uninterrupted run, exact slow/fast replay, continuation, stale-result protection, foreground/background/erase/reset interaction, Fit/100%, actual PNG/JSON download and matching pixel equality, transparency, replacement upload, actual 1536 planning, unsafe memory combination refusal, actual 2048/4096 exports, and all brush-lab profiles/gestures/views/relief/export. The browser harness uses Node's WebSocket and local Chrome debugging; set `CHROME_PATH` for a different executable. Its profile is created and removed inside `artifacts/browser/`.

Controlled comparison: **240 × 160**, Balanced, seed 42, no marks, maximum 700 strokes in both generations. V2 uses a proposal cap of 2800, and both modes share analysis/palette/brushes. V1 outputs were generated and measured *before* replacing the engine. V2's structural objective changed, so generation-to-generation comparisons use a **common blurred final-material RGB MSE**, evaluated on the saved v1 painting and v2 painting. This table shows the finer audit scale; the report also includes the coarse scale.

| Fixture / mode | V1 strokes | V2 strokes | V1 time | V2 time | V1 common material error | V2 common material error |
|---|---:|---:|---:|---:|---:|---:|
| Silhouette / Baseline | 700 | 700 | 0.233 s | 0.706 s | 0.004157 | 0.003696 |
| Silhouette / Feedback | 435 | 700 | 0.462 s | 1.878 s | 0.000254 | 0.000212 |
| Curved gradient / Baseline | 700 | 700 | 0.178 s | 0.727 s | 0.003483 | 0.002159 |
| Curved gradient / Feedback | 421 | 700 | 0.392 s | 1.447 s | 0.000468 | 0.000314 |
| Fine details / Baseline | 700 | 700 | 0.153 s | 0.614 s | 0.013829 | 0.012665 |
| Fine details / Feedback | 435 | 700 | 0.337 s | 0.920 s | 0.003447 | 0.000899 |

V2 improves this material metric on these three fixtures in both modes, but costs roughly **3–4 times v1's runtime** and uses more accepted feedback strokes. This is not equal-work or broad photographic superiority. The transparent fixture also ran in both v2 modes: Baseline/Feedback errors **0.002254 / 0.000327**, times **0.697 / 1.914 s**, 700 strokes each. No renderer is required to win a test and no examples were omitted. V1 coverage cannot be reconstructed from its PNG and is not compared to v2's coverage metric. Full counters, structural errors, material audit values and timings are in `artifacts/evaluation.json` and `artifacts/comparison/v1.json`.

Measured resource examples:

- Node: 1024 × 682 planning, 240 strokes / 243 proposals, **2.69 s**; 2048 × 1364 rerasterisation plus PNG writing **2.11 s**. Process RSS snapshots were approximately **241 MiB before**, **374 MiB after planning**, and **447 MiB after export** in the full test process. These are process snapshots, not isolated or continuous peak measurements; earlier fixture objects and GC affect them. The planning allocation estimate was 188 MiB including reserve.
- Chrome: 1536-square planning with 60 strokes, **3.96 s**, then an actual 2048-square export. The 640-plan → 4096-square export took approximately **3.74 s**, including PNG completion. Main-thread heartbeat continued during extended planning. The 60-stroke case intentionally tests dimensions/resources: it leaves about **58% undercovered** and is not a recommended quality budget.

Images were opened for visual inspection: all four brushes across three seeds, curved/S gestures, overlapping paint with relief off/restrained/strong, height views, studio Fit/100%, whole-painting comparisons, and high-resolution exports. V2 displays clearer pigment flow and layered ridges; the detail fixture preserves the narrow bars and small accent better. Gradient colours transition more smoothly. Tradeoffs remain: some coverage seams/ivory flecks, repetitive diagonal directions in weak-gradient areas, regular dry channels, and an overly polished/striped appearance under strong relief. Larger output does not repair an under-budget painting.

Useful artifacts:

- `artifacts/brushes/all-brushes-seeds.png`: rows Flat, Filbert, Hog, Round; columns seeds 42, 7961, 15880. Individual 1500-pixel studies are alongside it.
- `artifacts/brushes/overlap-relief-*.png` and `overlap-height.png`: combined surface and lighting studies.
- `artifacts/comparison/*-v1-*.png`, `*-v2-*.png`, `*-reference.png`: every controlled pre/post comparison.
- `artifacts/browser/studio-fit.png`, `studio-100.png`, `lab-fit.png`, `lab-100.png`: browser inspection captures.
- `artifacts/browser/planning1536-export2048.png`, `planning640-export4096.png`: resolution/resource stress outputs.

## Remaining limitations

The most important unresolved limitation is **art direction on photographic subjects**. No suitable local portrait/still life was available, and no arbitrary evaluation imagery was downloaded. The synthetic tests support correctness and measurable reconstruction improvements, not portrait likeness or painterly taste. The strokes remain more regular, flatter, and less irregularly loaded than the supplied thick oil reference. The simple relief/overlap model cannot reproduce its folded paint and accumulated impasto.

Other practical limits: the automatic mask is only a colour/border estimate; orientations may favour diagonal marks in quiet regions; small accents still need sufficient Fine planning work; strong relief can exaggerate grooves; no browser session persistence/import UI or cross-browser verification is included. Saved JSON can be replayed offline, but cannot restore optimisation after closing the tab. Performance grows with pixel count, stroke area, and proposal count; the hardware examples are not guarantees for the user's machine.

The next useful improvements are (1) evaluate a user-provided portrait/still life at matched work budgets, (2) improve loaded heels and irregular dry-channel breakup without losing fibre continuity, and (3) profile/reuse local brush/patch buffers to reduce CPU allocation cost before considering GPU acceleration.
