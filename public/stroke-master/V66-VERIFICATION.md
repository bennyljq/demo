# V66 verification

Verified on Windows, Node 24.20.0 and installed desktop Chrome, 2026-10-18. The pre-V66 comparison revision is `5b1ef9589a0cb2c09d9d525eed0c6dd7b3d5fa7e`. This is release/workflow validation, not a new artistic benchmark or planner promotion experiment.

## Executed checks

- `node stroke-master/build.cjs`: studio, brush lab, About and durable development-source index build successfully; JavaScript sources parse. The source index accounts for all 65 versions and preserves original logs.
- `node stroke-master/v66-test.cjs`: passes. Fresh/missing charcoal settings use V58, explicit archived configuration is retained, and oil remains V33. Explicit V33/V58/V50/V44 generation, material and Continue match the committed engine exactly on the focused fixture. Existing accepted streams are reused for exports; no photographic planning tournament was rerun.
- Eight actual export-worker GIFs decode with the codec and match independently accumulated native accepted-operation surfaces at **every sampled position**. V33 oil and V58 charcoal each use 160, 240 and 480 pixel long edges; historical V2 uses 160 and 240. Tests cover different durations/fps, play-once and looping, untouched canvas, final state, full-frame disposal, global colour table, total delay and exact final hold. Empty/one-action valid documents and invalid/overlarge controls also pass.
- `node stroke-master/v66-browser.cjs`: passes against the actual production folder served at both `/stroke-master/` and `/repository-name/stroke-master/`. Covers direct About navigation/refresh, all local About links, showcase decode, 65 index entries, 390px and desktop layout, file:// studio startup, fresh V58 Paint, Continue retaining V58 after selecting archived V44, real pointer targeting/Undo, defaults reset preserving the artwork, and a new V33 painting.
- Browser checks cover both PNG enlargement methods, exact native 2x PNG pixels, saved JSON roundtrip, GIF export from a live partial replay and imported V33/V58/V2/V44 documents, success/cancel/close cleanup, unchanged live document/replay position/job identity, visible archived identity, keyboard Escape and the narrow GIF drawer. No runtime exceptions were observed.
- Independent Pillow decoding checks all 12 generated/browser GIF files, every frame, dimensions, total timing, hold and loop extension. `v66-review.cjs` captures actual Chrome GIF playback at early, middle and held-final states. Contact sheets, final frames and desktop/mobile About/GIF screenshots were opened and visually inspected. The sampled progression follows the real paintings; no disposal ghosts, missing intervening deposits or palette-table pumping were observed. Low-resolution enlargement reveals expected palette/dither structure. This is a focused visual review, not a claim of flicker-free performance for every possible artwork/viewer.
- Packaging uses an allowlist, SHA-256 manifest and deterministic ZIP metadata. Bulk diagnostics, reference originals, recovery archives and test outputs are excluded. All pre-V66 tracked development logs remain unchanged.

## Representative GIF measurements

These short exports use 1.3 seconds/4 fps/0.7 hold at 160 pixels; 2.1 seconds/5 fps/1.2 hold at 240; and 2 seconds/12 fps/1 hold at 480. Timings below include encode plus the subsequent native comparison and file writes; they are local observations, not UI export-speed promises. RGB error is reported over RGBA channels against native replay (alpha error is zero).

| Stream | Long edge | Frames | Encoded bytes | Largest per-frame RMS error (0–255) | Check wall time |
| --- | ---: | ---: | ---: | ---: | ---: |
| V33 oil, Beaver, 8,400 operations | 160 | 6 | 90,273 | 2.33 | 13.38 s |
| V33 oil | 240 | 12 | 397,615 | 2.38 | 16.84 s |
| V33 oil | 480 | 25 | 2,981,695 | 2.43 | 34.45 s |
| V58 charcoal, Tay, 5,600 operations | 160 | 6 | 110,363 | 0 | 4.85 s |
| V58 charcoal | 240 | 12 | 502,156 | 0 | 7.13 s |
| V58 charcoal | 480 | 25 | 4,143,065 | 0 | 15.82 s |
| Historical V2 oil | 160 | 6 | 51,672 | 2.06 | 16.79 s |
| Historical V2 oil | 240 | 12 | 233,530 | 2.14 | 21.66 s |

V58's grayscale output is pixel-exact in every checked GIF frame. Oil is quantised, with maximum individual channel differences up to 29 in these cases. A fixed global palette prevents colour-table flicker; subtle image-anchored ordered dithering limits banding. All source actions contribute even when many actions occur between frames. Canonical output-size rendering is used throughout; displayed screenshots are not export inputs.

Machine-readable reports, decoded initial/final PNGs, review GIFs, contact sheets and screenshots are under ignored `stroke-master/artifacts/v66/`. They are not silently shipped in the production folder.

## Limits and inherited check failure

### Follow-up: live 1024px painting blocked by duplicate memory estimates

A reported 819 × 1024 V33 painting with 5,880 accepted operations could not export a 576 × 720 / 97-frame GIF. The old preflight counted planner/reference-analysis storage in the live session, again in the timeline's generic estimate, and again in the GIF worker's generic export estimate. Those last two replay operations do not allocate an optimiser. It also reserved compressed output separately from those generic estimates, making a valid export appear over budget.

The GIF UI and worker now share `strokeGIFMemory`: retain the live session's conservative estimate once; add timeline surface/cache and targeted Undo storage; budget output-size replay/contact scratch, document copies, codec overhead and 192 MiB for compressed chunks plus their contiguous result. The 768 MiB limit, 96 MiB output cap and frame/pixel-work limits remain. Concurrent PNG export is refused. The dialog displays the estimate and checks it before enabling Create GIF. No live session, accepted operation, rendering algorithm or appearance is changed.

For the reported dimensions/settings, the revised estimate is 596.7 MiB before targeted Undo storage, or 612.7 MiB with a 16 MiB Undo allowance. This is an accounting estimate, not measured browser RSS. `node stroke-master/v66-gif-memory-test.cjs` passes: it reuses 5,880 existing V33 records scaled to these planning dimensions, reproduces the old refusal, and exports through the actual worker at 576 × 720 / 97 frames / 9.5 seconds. Output is 24,338,590 bytes; final native-replay RGBA RMS error is 2.49/255 after palette quantisation. The hard budget and malformed retained estimates are checked, including independent worker rejection of an over-budget request. This fixture is not the user's artwork. The packaged browser workflow/export/Undo/cancellation suite also passes with the correction.

For an already-open painting, keep that tab open to retain its live optimiser and Undo. Save painting JSON, open the rebuilt studio in a new tab and import the JSON to export there. Reloading a painting tab discards its live optimiser; JSON restores artwork/replay only.

The old `node stroke-master/v39-test.cjs` was attempted and fails at its early expected appearance object because it omits the `canvasTexture: 0.12` field introduced in V40. That expectation is already stale in the committed pre-V66 code. No V66 rendering change caused this failure; the targeted current-release PNG/material checks above pass. The old historical suite was not rewritten or reported as passing.

There is no Angular 22 workspace or existing Pages workflow in this repository, so an actual Angular production build and public deployment were not executed. The produced static files were verified over ordinary nested-path HTTP. [Deployment guidance](DEPLOY-v66.md) cites current official Angular and Pages documentation and describes verification in the destination project.

Showcase reference-image permissions and attribution are unresolved; clear them before public publication, or omit the showcase as described in [asset notices](ASSET-NOTICES.md). No unsupported licence claim is made. Safari, Firefox and touch devices are not newly tested. Memory figures and output-work limits are estimates, not measured peak browser RSS. GIF viewers may vary playback scheduling. No service worker/offline installation is provided. No commit or public deployment was performed.
