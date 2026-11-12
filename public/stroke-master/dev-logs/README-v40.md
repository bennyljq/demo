# V40 — Oil substrate and first dry charcoal study

Oil remains the default and V33 remains its frozen planner. V39's floating inset,
whole-window dragging, opacity, modal interaction and transparent backdrop remain
intact. No commit was made.

## Oil canvas

Appearance exposes **Canvas texture**, configured by `appearance.canvasTexture`
in `studio-defaults.js`: default .12, range 0–.5 canonical height units; zero
disables it. A fixed orthogonal weave is evaluated in canonical coordinates.
Substrate height is separate from deposited `heightMap`, RGB and coverage. Lighting
normals, shadows and height-view exports use paint plus weave, with weave attenuated
by `exp(-paintHeight / 1.2)`. Pigment-only output remains untinted. Native stroke
exports and smooth bitmap exports use the same composed rendering.

Historical documents missing this field render with zero texture, including when
imported through studio appearance precedence. Explicit invalid texture fails
validation. New studio paintings and Reset appearance use configuration; lighting
presets retain the current weave amount. Engine defaults stay historical for
existing API callers and regression fixtures.

## Charcoal material and shared engine

Choose **Charcoal (experimental)** for the next Paint. Oil planners, quiet-area
body and oil brush selection are hidden for that selection; oil lighting controls
are hidden for an active charcoal painting. Selector changes cannot reinterpret
existing work. Charcoal needs no extra material controls in this first version.

Shared: reference preparation/masks, seeded location/search, scorePatch/fullScore,
proposal budgets, scheduling, session worker, Pause/End pass, global refinement,
target feather/Undo, replay checkpoints and both PNG export methods.

Charcoal-specific: planner `charcoal40` / plannerVersion 40, materialVersion 3,
brushVersion `charcoal-stick-1`, medium `charcoal`, `paper-grain-1` ground and
recorded side/tip marks. Candidate widths follow coarse-to-fine stages; candidates
mix reference tangent directions and seeded orientations, broad side marks and
narrow tips. Oil foundation passes and V33 donor/loading/attention extensions
are bypassed. Oil identities and algorithms remain authentic.

The paper is nearly white (246 minus a fixed irregular grain of at most 3).
Deposits use pressure-dependent grain pickup, a travel-pressure envelope, bounded
edge coverage and repeated darkening toward RGB 28. Paper grain stays anchored to
the ground across marks and replay scales. No pigment striations, deposited height,
directional lighting, smudging, erasing, blending or dust simulation applies.
The same charcoal deposition runs in candidate scoring and final material.

The grayscale target is documented and recorded as
`srgb-luma-2126-7152-0722-to-28-246`: composite the prepared reference, compute
`Y = .2126 R + .7152 G + .0722 B` directly in sRGB channel values, then set all
channels to `28 + 218 Y / 255`. This is a practical luma target, not linear-light
physical luminance. Preparation uses EXIF transpose and Lanczos to a 640 long edge;
no contrast enhancement or crop. Source/prepared hashes are in the evidence.

## Material gate and first paintings

[Compact stroke study](../artifacts/v40/stroke-study.png): side marks at left,
tips in the centre, pressures .35/.7/1.2 from top to bottom; overlapping side marks
at right. Inspected before generation integration. The initial periodic grain
read as mesh and was replaced with fixed irregular grain. The revised study reads
as dry charcoal: broken light pickup, dense pressure, paper pinholes and darker
overlaps. Edges are still visibly simple. The study JSON is an importable replay.

[Mat](../artifacts/v40/mat.png) and [Rainier](../artifacts/v40/rainier.png) use seed
42, balanced detail/search, 640 edge, initial cap 1400 marks / 5600 proposals.
Both stop at the proposal cap: Mat accepts 319 marks, Rainier 310, each evaluating
39,200 candidates. Recorded candidate work was about 21.2 / 19.2 seconds on this
machine; these are single observations, not benchmarks or oil comparisons.
[Local review with grayscale targets](../artifacts/v40/study.html).

Mat has a recognisable face and lei arrangement, directional marks and useful dark
masses, but hard pale polygons interrupt facial modelling. Rainier suggests forest
and reflection masses; the mountain and quiet sky remain poorly resolved. Paper is
visible in highlights and grain holes, but coarse dark blocks dominate both.
This is a credible material starting point and a weak first painter, not a mature
charcoal renderer. **The single next improvement is tone-aware pressure/coverage
fitting for broad side marks**: place lighter tonal masses accurately before
irreversible darkening. No speculative additional mechanisms were added.

## Verification and reproduction

From `stroke-master/`:

- `node build.cjs`
- `node v40-study.cjs`
- `python v40-prepare.py` then `node v40-paint.cjs`
- `node v40-test.cjs` and `node v40-defaults.cjs`
- `node v33-test.cjs --out=artifacts/v40`
- `node v39-browser.cjs` and `node v40-browser.cjs`

All passed. Frozen V12/V17/V31/V33 comparisons preserve exact decisions, scoring,
RNG and material through continuation/targets/Undo; historical native/2x replay
also passes. Texture-zero equals omitted texture, texture changes no oil deposits
or decisions, and thick paint attenuates weave. Charcoal repeats exactly; native
and 2x timelines agree with replay at forward/backward positions; no height is
deposited. Browser checks cover Paint, selector changes during refinement,
target/Undo, source-free import and both 2x PNG methods against canonical replay.
V39 desktop workflows pass, including floating-reference dragging/opacity and
narrow layout. Transparent backdrop was checked directly in computed style.
Chrome required execution outside the sandbox because its GPU subprocess failed
inside it. Other browsers and touch remain untested.

Small reports/fixtures and runners are under `artifacts/v40` and project sources.
PNGs and the local HTML review are generated ignored artifacts. Full painting
JSONs and prepared source PNGs stay in the OS temporary directory
`stroke-master-v40`, outside Git; rerun the two preparation/painting commands to
restore them. Existing historical evidence is preserved.
