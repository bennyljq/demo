# V52 — Procedural charcoal capability study

Open [Charcoal Studies](../charcoal-studies.html) from disk. No server or network is needed. Planner development remains paused. V44 stays default; scoring, stage progression, oil, studio and historical material identities are unchanged. No commit.

## References and observable goals

All four supplied originals were inspected. `shading-example-1` shows repeated side-held contact: uneven cross-loading, directional streaks, exposed tooth and dark intersections. Stick angle differs from travel. `shading-example-2` separates hatching, diagonal side-stick passages unloading across repeated strokes, and rubbed powder. Heavy pressure fills more tooth; light contact remains granular. `shading-example-3` combines angular dark planes, slender gestures, rubbing and selective light areas. None of these complete swatches is one operation. `charcoal-smudges` suggests wedges, spiky ends and partial contact, but its medium is uncertain; it is an aesthetic shape reference.

Judge internal loading, exposed paper, directional breakup, edge transitions, termination and accumulation. Parameter diversity and numerical correctness do not establish artistic success.

## Capability and controls

[Renderer](../experimental/charcoal-v52.js), [recipes](../charcoal-studies-v52-recipes.js) and [UI](../charcoal-studies-v52.js) are isolated from production. A sampled finite stick face follows a path with independent contact angle, width, pressure, cross-loading, entry/release and correlated breakup. Smooth travel uses Catmull–Rom interpolation; angular travel retains corners. Maximum contact dose per gesture prevents sampling-dependent darkening; separate deposits accumulate tone. Paper tooth stays anchored across seeds/operations; gesture grooves follow contact coordinates. References never enter generation. No textures, tracing, photographic stamps, target fitting or final-image filters.

13 families cover side contact, pressure release, angular contact, quiet density, short expansion, slender taper, curved sweep, repeated angular contacts, hatching, shading gradient, overlap, rubbing and removal. Angular/sweep studies are compound uninterrupted motions, each counted as one operation. Repeated angular contacts use 3 operations; gradient 15; hatch 19; overlap 6; rub 3 deposits + 1 rub; removal 3 deposits + 1 lift + 1 erase. Internal contact samples and their cost are disclosed separately.

Each family offers seeds 42/73/109 × pressures 0.55/0.8/1.15, and widths 0.6/1/1.4, including weak specimens. Controls adjust seed, pressure, width, rotation and independent stick pivot. Native detail is 240 × 120 pixels at 1:1. PNG exports rerender at native or 2× size. V50/V51 comparisons use the same straight travel, width and pressure; their original paper/deposition is retained, so tone is not calibrated across models.

## Visual review and limitations

Initial outputs retained smooth loaded strips. Contact patches, tooth exposure and transverse release were revised. A later angular revision shortened travel and pivoted the stick to form compact wedges rather than a long zigzag ribbon. Native sheets, gallery screens, seed/pressure variations and historical controls were inspected after revision.

Side shading now has uneven loading and staggered ends. Repeated diagonal passes visibly accumulate dark-to-light shading. Slender and broad contacts differ; rub softens existing grain; lift and crisp erasure remain distinct.

**Artistic acceptance remains partial.** Quiet density still has a strip envelope and some side contacts retain an overly continuous loaded edge. Compact angular contacts provide wedges and projections, but loaded lobes remain smoother and more designed than the stock reference. Low pressure can fragment too far. These limitations and weak seeds are visible. No portrait optimisation hides them; planner integration should remain paused.

This is an authored capability model, not validated stick physics. One scalar density omits dust, wear and embedded pigment. Rub is a masked average of existing charcoal and does not strictly conserve pigment at mask boundaries. Erasure uses a geometric edge. Export scales existing tooth instead of inventing finer physical paper texture.

## Verification, costs and recovery

From the repository root:

```powershell
node stroke-master/v52-check.cjs
node stroke-master/v52-browser.cjs
python stroke-master/v52-package.py
```

39 specimens pass seeded reproducibility, JSON recovery, incremental replay, bounded density, half/native/2× scaling and rotated pressure/contact variation checks. Overlap increases tone; lower pressure reduces pickup; rub/lift/erase cannot invent charcoal on blank paper; removal cannot darken pigment. Production and charcoal41–51 source content equals HEAD after Windows newline normalisation. Oil v12/v17/v33 and charcoal44/50/51 session/document replay agree. These tests establish correctness, not resemblance.

Browser tests passed with network disabled, both in the checkout and an extracted recovery package: reset/replay, actual recipe import, native/2× PNG pixel agreement, seed/pressure/contact variations and lazy historical comparison. No remote requests or runtime exceptions. Startup was about 150–190 ms, with 220,800 canvas pixels allocated (main + detail); first-contact generation was about 96–135 ms cold. Offscreen cards render on visibility and release storage when they leave view. Closed variation/comparison panels release canvases. Legacy code loads only for comparison. Rendering is synchronous; exports can briefly occupy the main thread. Replay regenerates prefixes rather than retaining snapshots.

Representative seed-42 costs at 640 × 300 are reported in `artifacts/v52-work/checks.json`. Side contact uses 261 samples and 1,409,380 bounded pixel visits, about 60 ms warm. Slender accent uses 314 samples / 63,177 visits, about 8 ms. Gradient uses 15 operations / 1,135 samples / 1,646,526 visits, about 110 ms. Overlap uses 6 operations / 1,233 samples / 3,542,073 visits, about 190 ms. Rub uses 4 operations / 1,015 samples / 3,904,693 visits, about 282 ms. Timings vary by run; rub additionally evaluates 25 neighbours per affected pixel, outside this visit counter. Each operation uses a temporary density mask; rub also copies density. Raster cost grows approximately with pixel area. These are study costs, not proposed planner costs.

The package script measures **all current gallery files and required assets uncompressed**, including reference originals and comparison dependencies. The gallery is about **0.61 MB**, below 10 MB. Main contributors: reference JPGs 398,654 bytes and engine 123,978 checkout bytes. Exact inventory/hashes: `artifacts/v52-work/gallery-bytes.json`; recovery: `charcoal-v52-recovery.zip` beside it. Generated bulk stays outside Git.

Unzip separately and open `charcoal-studies.html`. Export/recover recipes retain exact operations, seeds and partial replay counts. This format is separate from studio painting documents. Studio and [historical archive](../archives/index.html) navigation requires the original checkout; old artwork and packages were retained. Archive bulk never loads into the current gallery.

## Fogleman homework

[Shape](https://github.com/fogleman/primitive/blob/master/primitive/shape.go) separates representation, rasterisation, copying and mutation; [Triangle](https://github.com/fogleman/primitive/blob/master/primitive/triangle.go) mutates bounded vertices and rejects invalid geometry. Later, constrained mutations could explore coherent contact profiles. Stroke Master already stores parametric gestures and seeded texture; primitive geometry alone supplies no charcoal grain or loading.

[State](https://github.com/fogleman/primitive/blob/master/primitive/state.go) caches energy and restores mutations. [Worker](https://github.com/fogleman/primitive/blob/master/primitive/worker.go) searches random starts and hill climbs using rasterised scanlines. A later planner could investigate local gesture mutation; V52 introduces no optimiser.

[Core](https://github.com/fogleman/primitive/blob/master/primitive/core.go) fits colour at fixed alpha and updates error over affected scanlines. Stroke Master already fits strength, evaluates bounded patches and maintains incremental errors/tiles (`evaluateCandidate`, `scorePatch`, V44 `adapted`). Reusable scratch masks and tighter contact bounds may reduce future raster costs. RGB/RMSE optimisation cannot fix an inadequate material representation or establish artistic resemblance.

No Primitive code was copied or ported. Its [MIT licence](https://github.com/fogleman/primitive/blob/master/LICENSE.md) requires retaining Michael Fogleman's copyright and permission notice for future substantive code reuse.
