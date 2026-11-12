# Stroke Master prototype

Open `index.html` directly in a current desktop browser. No install, server, network access, or runtime packages are needed. Choose an image, keep **Feedback / Balanced / 1400 strokes / seed 42** initially, and press **Paint**. Compare **Baseline** using the same image, seed, detail, budget, and mask marks.

Foreground (amber) and background (blue) marks are optional. Click or drag on the reference; Erase removes marks and Reset restores the automatic estimate. Replay animates saved strokes without running the optimiser. Save PNG exports the completed painting at its planning dimensions; Save stroke JSON includes the records, settings, palette, objective audit, and metrics. A cancelled job retains its preview, but export/replay use the last **completed** painting. Loading a new reference also retains the previous painting until the new job produces a preview.

Input is limited to 32 MB and 40 million decoded pixels. The named `PLAN_MAX_EDGE = 640` constant caps output's long edge, preserving aspect ratio to integer-pixel rounding. Smaller inputs are not enlarged in processing. Both previews scale to fit their panels. Transparent decoded pixels are composited on opaque warm ivory, RGB **242, 239, 228**, before analysis; hidden RGB in fully transparent pixels cannot affect planning.

## Representation and processing

The HTML contains three source blocks: the numerical engine, worker bootstrap, and UI. The engine also runs verbatim in the Node tests. Analysis and painting run in a disposable Blob-backed worker. Only the reference canvas receives uploaded image pixels. Both painting buffers begin as a constant background; every change comes from a stored stroke.

Each plain stroke record contains `brush` (`flat` or `round`), three quadratic Bézier `points`, `width`, `pressure`, `taper`, `colour` (RGB), `opacity`, `textureSeed`, zero-based `pass`, and `layer`. Coordinates and widths are **output pixels**, with pixel centres at `(x + 0.5, y + 0.5)`. Curves use eight line segments for rasterisation. Flat brushes have squared ends; round brushes taper toward their ends. The structural buffer uses the uniform footprint. The material buffer uses the same footprint with coherent transverse bristles, gentle colour variation, and slight opacity variation. The final fixed canvas grain is less than one intensity unit. Strokes, dimensions, the background, and this implementation's rendering settings are sufficient to reconstruct the material painting; no reference or segmentation mask is needed for replay.

1. Composite transparency; compute three blurred reference scales, luminance gradients, a smoothed structure tensor, and boundary importance. Weak or ambiguous gradients use a stable diagonal orientation. A deterministic RGB histogram provides up to 24 restrained palette colours, with stable frequency/bin tie-breaking.
2. Estimate a coarse priority mask on a grid with a long edge of approximately 96 cells. With marks, colour-weighted multi-source Dijkstra growth extends the labels. Foreground-only marks get weak border background seeds. Without marks, border-connected cells with similar adjacent colours form an automatic background estimate. Blur the labels to avoid abrupt guidance. The estimate is not semantic segmentation.
3. Allocate the stroke budget to three broad-to-fine passes: **28%, 36%, 36%**. In each pass paint background before foreground. Shorten strokes whose endpoints cross a priority boundary rather than applying a hidden cutout mask.
4. Baseline uses stratified, jittered sampling and reference-informed directions, colours, and sizes. It accepts every stroke without comparing candidates or using error for placement. Feedback uses the same block-in, then samples high-error tiles and locally important pixels, testing four informed variations per refinement proposal.
5. Render progress from typed pixel buffers. Progress messages occur every 16 proposals; image previews every 48 proposals, without PNG encoding. Yielding, previews, UI timing, and replay chunk sizes do not drive planning. Cancellation terminates the worker immediately. Job IDs discard stale messages; workers and Blob URLs are released on completion, cancellation, restart, and unload.

## Objective and limits

At pixel `p`, the structural loss is:

```text
weight(p) = 1 + 2 × boundary_importance(p)
loss(p) = weight(p) × mean_RGB[
  0.8 × (box5(paint) − box5(reference))²
  + 0.2 × (paint − reference)²
] / 255²
reported_error = sum(loss) / sum(weight)
```

`box5` uses a 5 × 5 window with repeated edge pixels. Colour and tonal agreement dominate; boundaries get additional weight. Fine pixel agreement has lower weight. The score does **not** measure composition, brush beauty, semantics, or physically realistic oil paint. A five-pixel smoothing window is modest at maximum resolution; the minimum brush size is also essential to prevent pixel chasing.

Candidates copy only their local structural patch. Integral tables evaluate blurred colour; the affected score area includes a two-pixel halo and the copied patch another two pixels. Cached pixel errors and touched 24-pixel tiles are updated after acceptance. There are no per-candidate full-canvas copies or full-image rescoring. A full verification score and a separate material score are computed once at completion.

Refinement accepts only a positive loss decrease greater than **0.00002 per affected pixel**, in normalised units. Minimum widths are **8 / 5 / 3 px** for Loose / Balanced / Fine. A region stops after **120 consecutive rejected proposals**, or its fixed proposal quota. Each refinement region gets at most three proposals per allocated stroke; each proposal tests four candidates. Total strokes are clamped to **60–6000**, proposals are bounded by `3 × budget`, and candidate evaluations by `12 × budget`. Region quotas are not recycled, so finishing below the stroke budget is expected. The reported stop reason distinguishes reaching the stroke budget, exhausting proposal quotas, and completing with region plateau stops. Elapsed time never determines completion.

Instrumentation includes actual accepted strokes, candidate evaluations, proposals, rejected proposals, plateau stops, initial/final error, a refinement objective audit, material error, mean material/structural colour difference, and peak local patch pixels. `estimatedWorkingBytes` is a conservative array-allocation estimate, **not a measured browser memory peak**. It excludes browser image decoding, JS object/GC overhead, and UI copies. Planning arrays stay bounded by 640 × 640; the maximum encoded/decoded input checks constrain accepted inputs, although the browser must first decode an image to discover its dimensions. No GPU optimisation has been added.

Determinism applies to the **stroke records** for identical decoded planning pixels, mask marks, settings, and seed in the same implementation. Mulberry32 is the only planning randomness. Reroll uses browser cryptographic randomness to choose a new explicit seed. Browser image decoding, colour management, resizing, floating-point implementation, and PNG encoding can vary; cross-browser PNG byte identity is not promised. Full JSON files include elapsed measurements, so compare their `strokes`, not their bytes.

## Tests and measured comparison

Run from this folder with Node 22 or later:

```sh
node test.cjs
node browser-test.cjs
```

The browser harness uses installed Chrome and Node's built-in WebSocket, with a direct `file:` URL. Set `CHROME_PATH` if Chrome is elsewhere. Its disposable browser profile, downloads, fixtures, reports, and screenshots stay inside `artifacts/`; the profile is removed on exit. Restrictive sandboxes may require permission for local Chrome loopback debugging. No npm dependencies are used.

**57 algorithm checks passed.** These cover four generated fixtures, seeded scheduling invariance, exact material replay with different chunk sizes, monotonic accepted refinement loss, local/full score agreement within `2e-7`, material/structural correspondence, mask processing/order, transparency, aspect ratio, minimum widths, resource quotas, maximum-budget clamping, actual plateau stops, and rejecting excessive planning dimensions.

The controlled comparison below uses **all four** 144 × 96 fixtures, Balanced detail, seed 42, no marks, identical palettes, and a maximum budget of 360 strokes. Runtimes are local Node engine measurements, including analysis and rendering; they are hardware/runtime dependent. Feedback is allowed more candidate work, but the same stroke cap. Neither renderer is required to win a test.

| Fixture | Baseline strokes | Feedback strokes | Baseline time | Feedback time | Baseline error | Feedback error |
|---|---:|---:|---:|---:|---:|---:|
| Flat silhouette | 360 | 287 | 1.100 s | 2.001 s | 0.011212 | 0.001037 |
| Gradient + curved boundary | 360 | 283 | 1.099 s | 2.479 s | 0.007802 | 0.000751 |
| Small high-contrast details | 360 | 298 | 1.000 s | 1.981 s | 0.021836 | 0.006556 |
| Transparent shape | 360 | 198 | 1.096 s | 2.347 s | 0.002515 | 0.000369 |

Feedback reduced this objective on every fixture, using fewer strokes and roughly twice the runtime. Material/structural mean absolute RGB differences were **1.07–2.53 / 255** across these runs. Exact candidate counts and material errors are in `artifacts/evaluation.json`.

**13 browser checks passed in Chrome 154.** Tested actual file upload; analysis and painting cancellation; immediate restart and stale-message protection; foreground, background, and eraser pointer interaction; mask reset; slow/fast replay with exact pixel equality; actual PNG/JSON downloads; exported pixel equality and dimensions; transparency; the actual 640-pixel decode cap; upload during an active worker; and no browser exceptions. The 640 × 320 curved fixture with 300 strokes took approximately **0.80 s** in Chrome, evaluating 1176 candidates. Its peak local patch held 19,511 pixels, and estimated array working memory was **49.0 MB**. This is a synthetic example, not a performance guarantee. Browser marked-feedback and baseline timing examples use different masks and are **not** a controlled comparison; the table above is.

Rendered fixture images, the desktop browser screenshot, and the 640-pixel painting were opened and inspected visually. Feedback preserved silhouettes and the curved boundary, with visible directional layering. The small-detail fixture remained the hardest: narrow features soften or merge. The larger gradient image showed stepped palette colours, occasional ivory flecks, and stroke overlap at boundaries. Lower numerical error alone does not establish a more attractive painting. No real photographic input, Firefox, Safari, or touchscreen interaction was tested.

## Next three improvements

1. Preserve rare accent colours while allocating palette entries across gradients. The curved gradient visibly forms colour bands, and frequency-only palette selection can omit a small salient colour in a photograph.
2. Improve boundary-aware stroke length and curvature proposals. The current endpoint check can still cross a curved boundary, leaving seams and overshoot; the high-contrast detail fixture has the largest residual error.
3. Add a small, diverse photographic evaluation set and tune coverage/texture from those results. Synthetic shapes establish correctness, but do not establish portrait likeness or pleasing foliage. Ivory gaps and repetitive bristle marks are visible in the inspected outputs.

The most useful next manual test is a portrait or still life with a clear subject boundary and textured background: compare both renderers with the same seed/budget, then mark foreground/background and repeat Feedback. Inspect subject shape, edge overlap, leftover ivory, and whether the extra feedback work produces a painting you prefer.
