# V66 — Closing release

V66 closes the current development chapter; it introduces **no new planner**. Oil V33 remains recommended/default. Charcoal V58 is recommended/default for fresh sessions and missing next-paint settings; V50 stays immediately available as an alternative with strong finished modelling and a rectangular early foundation. Historical/experimental selections are revealed explicitly. V64 and V65 are labelled unfinished research. Active sessions and imported documents retain their actual identities.

The standalone About / Development page edits the complete surviving V1–V65 record into a narrative, version index and developer map. All 124 pre-V66 files were reviewed, including dedicated V8–V14 reports where README files do not exist. Original logs are preserved. A generated source index and SHA-256 manifest travel with the package. Later V36 human assessment and V37's six-contact-only rejection are distinguished from the earlier reports. Current recommendations supersede historical defaults without rewriting them.

## Replay GIF

More → Export options → Export replay GIF. Controls: drawing duration 1–60 seconds, 2–30 fps, preset/custom long edge 64–1536, final hold 0.1–30 seconds, and loop. Aspect ratio is preserved to integer-pixel rounding. Sampling includes canvas zero and the complete final stream. Every intervening operation is applied through the canonical timeline/rasteriser; the optimiser never runs for export. Repeated short-stream positions merge with combined delays. An empty valid artwork produces one held canvas frame.

Rendering occurs at requested dimensions with scale-aware material and final-quality oil lighting. Snapshot artwork/appearance goes to an isolated disposable Blob worker. A bounded histogram over the sampled trajectory produces one global oil palette; image-anchored ordered dithering is fixed across frames. Charcoal's existing grayscale output uses all 256 gray entries and is exactly representable. GIF has a palette limit; oil is necessarily approximate. Full opaque frames with disposal 1 avoid stale content and transparent-patch artifacts. Delays round to hundredths, with an explicit visible final hold; looping uses the GIF Netscape extension, omitted for play-once.

Locally pinned MIT modern-gif 2.1.0 supplies unchanged low-level encoding, adapted without its batch API or modern-palette dependency. Palette analysis uses bounded samples; encoding keeps one RGBA frame and indexed frame at a time, plus compressed output. Oil uses two replay passes, charcoal one. Limits: 481 distinct frames, 160 million rendered pixels including palette pass, 96 MiB compressed output, and a shared 768 MiB replay-specific estimate. Count the retained live optimiser once, timeline surface/cache and targeted Undo separately, then output-size replay scratch, document copies, codec overhead and compressed-output buffers. These are guard estimates, not RSS measurements or exact file-size forecasts. Progress and cancellation terminate only the export worker and release its URL/buffers. Closing the dialog also cancels export.

The editable studio has no stored UI overrides. Deliberate configuration choices remain valid, including V64/V65; browser form restoration is superseded by the configured initialisation as before. Reset returns to V33/V58. Medium changes preserve each medium's explicit next-paint choice. Continue, targeting, Undo, JSON and replay use captured/recorded identity rather than next-paint selection. Ordinary JSON does not restore optimiser state.

## Build, package and evidence

From the repository root, Node 22+:

```powershell
node stroke-master/build.cjs
node stroke-master/v66-test.cjs
node stroke-master/v66-browser.cjs
node stroke-master/package-v66.cjs
```

`build.cjs` also generates About and the source index. Edit `.template.html`, `about.css`, `history-v66.json` and canonical JS, never embedded/generated copies. Rebuild the codec only through `node stroke-master/vendor/modern-gif/build-adapter.cjs`. No npm install is required.

Package: `stroke-master/dist/stroke-master/`. [Deployment instructions](../DEPLOY-v66.md) cover an Angular 22 public-directory copy, ordinary anchors, existing Pages workflow and nested paths. There is no Angular checkout or public deployment in this repository. [Asset notices](../ASSET-NOTICES.md) identify the showcase's original streams and unresolved reference-image rights. Clear those rights before publishing the showcase.

Small reusable validation scripts remain in source. Generated GIFs, decoded/native comparison data, screenshots and verification reports live under ignored `stroke-master/artifacts/v66/`. Existing evidence is recovered, not replanned: `v66-showcase.cjs` extracts the V35 oil record and reads the retained V58 charcoal streams. Run it once if these local V66 test documents are absent; the original ignored evidence archives must be available. This optional evidence/showcase recovery helper additionally needs Python with Pillow; ordinary build/package/runtime needs no Python or npm install. Those archives are not part of the runtime distribution. `v66-review.cjs` opens the generated GIFs for actual browser-playback captures.

See [V66 verification](../V66-VERIFICATION.md) for executed checks and practical limits. Full art-history benchmarks were not rerun. Current artistic limitations remain documented in [KIV-v66](KIV-v66.md).
