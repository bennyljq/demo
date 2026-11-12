# V44 — natural broad contacts and coherent tonal placement

V44 is a reviewable experimental challenger built on V42. V41 remains the charcoal
default; V42/V43, oil, substrate and the completed UI are preserved. No promotion
or commit. The user found **no meaningful visual improvement in V43**; its earlier
report is historical, not evidence that the original failure was solved.

[Comparison gallery](../artifacts/v44/comparison.html) ·
[Complete review/recovery package](../artifacts/v44/comparison-package.zip) ·
[33 replayable studies](../charcoal-studies.html).

## Diagnosis before implementation

Incoming V42/V43 early200, initial1400 and refined2800 images showed rectangular
foundations and mottled joins already in the early construction. Mat's forehead
and cheek, Rainier's sky/forest and the rooster's tail/breast were traced on exact
V42 seed42 material: before, after and 200 contacts later, with fixed-region crops
and signed tone-error maps. All 33 available traces are retained, without choosing
contacts according to V44 success. See [diagnosis](../artifacts/v44/diagnosis.json).

Positive aggregate scores can hide unnecessary damage inside a footprint. Across
all broad deposits, unweighted squared-tone harm/help was 1.34% for Mat, 6.73% for
Rainier and 7.05% for rooster. Individual deposits with harm above 10% of help
numbered 1140/1909, 1348/1725 and 833/1340 respectively. These diagnostics are
separate from the full objective; neither a positive gain nor these ratios are
an artistic verdict. Sparse geometry evidence and the large-contact length floor
allowed contacts to span opposing residuals.

On the rooster, 399 of 2805 inspected proposal locations had dirty bright centres.
Lifts were available at all 399, positive at 395, and won at 371. Availability alone
would not prove usable cleanup, but these actual alternatives and winners provide
no basis for changing attention or the objective. Geometry and broad deposition
were the supported interventions. Blending redistributes a local patch; it cannot
undo poor large-scale construction by itself.

## Material and placement

The supplied smudges informed directional breakup, uneven terminations and dense
versus broken contact. They are neither copied texture pixels nor an exact material
specification. [Richardson's texture guidance](https://www.artistsandillustrators.co.uk/how-to/how-to-create-different-textures-with-charcoal/)
connects layered broad tone, directional texture, shaped lifting and restated accents
to the overlap and deposit/blend/lift/redraw studies.
[Spicer's landscape guidance](https://www.artistsandillustrators.co.uk/how-to/drawing/how-to-draw-a-landscape-in-charcoal/)
informed varied gestures, negative-space cleanup and precise eraser edges; wet
charcoal/washes are outside this implementation.
[Nitram's soft-charcoal guidance](https://nitramcharcoal.com/blogs/blog/getting-nitram-soft-charcoal)
supports pressure-dependent side shading, layering, lifting and pointed accents.
These are design connections, not a claim of physically simulating a specific stick.

The new identity is **planner44/material6/charcoal-stick-4**, charcoalVersion4.
Broad tone/region deposits use a seeded reusable profile: nine width/centre samples
and seventeen directional pickup/termination samples, smoothly interpolated.
Width and end variation are modest. The bounded 128-entry cache can evict profiles
without changing their regenerated identity. Seed and contactStyle persist.
Paper grain stays surface-anchored; contact variation follows the gesture.
Pressure fills dense passages more evenly while light shading retains broken tooth.
Texture changes actual deposited quantity, so lifting and blending act on it.
Narrow accents, blends and precise erasers retain V42 contact geometry/material
behaviour. There is no noise overlay, atlas, particle simulation or texture search.

Full realized support replaces the original fit scan for broad proposals. Signed
correction moments adapt position, orientation, extent and aspect; opposing support
prevents the old large-contact floor from forcing a long mixed-sign mark. Coherent
support can retain and modestly extend a useful large contact. Changed geometry is
fitted again and scored using the same contact as deposition and replay. Connected
lifts use complete support to adapt their normal offset and width while preserving
curvature. Connected deposits retain V42 placement. No reference clipping, semantic
rules, mandatory cleanup, RGB replacement, attention or score change was added.

Seven Balanced candidates remain (three Fast, twelve Thorough). Up to five extra
fits per proposal cover changed tone geometries and a connected lift; extra scores
are zero. Support scans, pixels, geometry changes and extra fits are recorded in
charcoal44Work. The extra raster work is a real cost, despite unchanged candidate
counts. A first compact prototype still produced mottling; dense pickup was adjusted
once and the compact gate rerun. That final treatment was frozen for the full runs,
seed73 and the subsequent untuned Orca holdout.

## Causality and drawing results

The four-way compact gate uses seed42, 300 initial + 300 refinement contacts.
Contaminated boundary includes two identical smooth seed deposits in that allowance.
Reference crops preserve source pixel scale, but smaller canvas dimensions change
relative planner scale: these are local tests, not substitutes for full drawings.
The table gives refined tone RMSE only; inspect the gallery for character and edges.

| Test | V42 | Contact only | Placement only | V44 |
|---|---:|---:|---:|---:|
| Light/midtone fields |12.26|11.30|8.41|7.66|
| Smooth ramp |13.30|12.59|10.35|8.51|
| Hard/curved boundary |9.14|8.10|8.86|7.39|
| Contaminated boundary |9.77|8.73|9.86|8.28|
| Mat tone crop |28.24|27.06|20.29|19.31|
| Rainier tone crop |22.05|22.33|19.14|18.19|
| Rooster edge crop |22.31|21.23|20.37|18.83|

Both mechanisms contribute; contact alone slightly regresses Rainier and placement
alone regresses contamination. Fixed demonstrations show strengths/orientations,
overlap and deposit → blend → shaped lift → sharp redraw. They are explicitly
labelled demonstrations. Eight new actual planner studies compare V42/V44 on four
analytic targets; the previous 22 studies remain, giving 33 total.

Full runs use the same prepared640 references, Balanced, seeds42 then73,
1400 initial + 1400 refinement operations and 5600 proposals per pass. All main
passes reach their operation allowance. V41/V43 controls reuse preserved canonical
records and retain historical timing labels; their early views are source-free
200-operation prefixes with unknown timing/error left blank. Fresh V42/V44
comparisons include early, initial, final, matched candidate-work prefixes and fixed
tone/silhouette crops. Complete counts/costs are in
[measurements](../artifacts/v44/measurements.json).

| Drawing/seed | V42 initial/final RMSE | V44 initial/final RMSE | V42/V44 final candidate work, seconds |
|---|---:|---:|---:|
| Mat42 |15.98 / 11.69|11.05 / 8.35|11.95 / 17.11|
| Mat73 |16.21 / 12.10|11.68 / 8.52|11.59 / 16.91|
| Rainier42 |23.22 / 20.75|20.63 / 18.41|11.66 / 17.91|
| Rainier73 |23.42 / 21.03|20.63 / 18.39|11.66 / 16.95|
| Rooster42 |18.15 / 14.66|14.56 / 12.09|8.84 / 14.16|
| Rooster73 |17.60 / 14.40|14.76 / 12.23|8.98 / 13.87|
| Orca42, untuned |16.46 / 14.26|13.27 / 11.58|19.73 / 31.52|

Mat has more continuous facial construction and clearer eyes/nose; forehead and
cheek still contain directional bands. Rooster rims/legs are cleaner and feather
structure remains readable, but broad dark tail masses lose some broken grain and
gestural variety. Rainier's tonal masses read more coherently, yet conspicuous sky
bands and weak distant-forest structure remain. Untuned Orca has clearer body
markings and organized background tone, with directional smears still visible.
The treatment is not a universal artistic win.

Early V44 still contains narrow rectangular contacts and does **not** eliminate
original damage. At early200, bright-spill pixel events increase from 587 to1731
on Mat, 2854 to4309 on Rainier and 16133 to24155 on rooster. Total harm/help improves
in those early bands, but broader coverage also crosses bright areas. Later spill
and deposit/lift repair evidence is mixed, including more recent-damage lift events
on rooster. The exact-material [damage audit](../artifacts/v44/damage-audit.json)
separates early, initial remainder and refinement. Counts are pixel events, not
unique pixels; proximity to recent damage does not prove a lift was wasted.
Cleaner final boundaries reflect better construction **and ordinary repair**, not
complete prevention. Display damage maps use rounded tones; numerical audits use
the actual floating-point material.

Mat alone was extended to5600 to ask whether remaining facial patchwork disappears.
V44 improves from8.35 to6.05 RMSE (V42 11.69 to8.50), with better face continuity,
but forehead/cheek bands remain even after extension and in matched-work crops.
This is a persistent representation limitation, not a reason to extend every case.

## Cost, preservation and recommendation

Two fresh serial timing repeats, with reversed planner order on repeat2, confirm
the tradeoff. Mat V42/V44 total candidate work is 11.67–11.77 / 16.81–16.91s;
rooster is 8.96 / 14.17–14.29s. Measured planning wall time is respectively
12.58–12.69 / 17.72–17.82s and 9.61–9.63 / 14.84–14.95s. V44 costs approximately
43–59% more at equal2800 operations. At the first recorded crossing of V42's final
RMSE, V44 uses1275 Mat operations and1375 rooster operations, about13–14% less
candidate work. Crossings are sampled every25 operations, without extrapolation.
That is an error-efficiency result, not proof of an artistic advantage at equal time.
Gallery matches use candidate work; planning wall includes trajectory bookkeeping,
while whole-run wall also includes analysis and captures. See
[repeated timings](../artifacts/v44/timing-repeat.json).

Focused checks cover determinism, cache eviction, fitting/scoring/application gain,
native/2x replay, mixed historical records, Continue, targeting/feathering, Undo,
blend conservation, blank paper and candidate/extra-fit bounds. Frozen incoming-HEAD
controls compare oil and charcoal40–43 decisions, RNG, continuation and material.
Fifteen fresh V42 native checkpoints also match preserved incoming artwork exactly.
Browser checks cover Paint/default identity, active versus next selection, canonical
PNG/2x exports, playback/frame export, all33 studies, every gallery selector and
480px layout. The existing V39 browser regression also passes.

The approximately56 MB recovery package contains all579 gallery images,208
lossless crop coordinates,
canonical demonstrations, frozen renderer/studies, final operation arrays and
prefix metadata pointing to the largest corresponding record. Intermediate arrays
remain outside Git. Extract and open comparison.html; run
`node restore.cjs mat-42-v44-refined 2` for native2x or use a `work-refined` prefix.
Replay restores artwork without reference images, not optimiser state. Independent
extraction verifies member hashes, pixel-exact checkpoint/crop regeneration and
standalone native2x restoration. All425 checkpoint/crop/demo tests pass; results
are recorded in recovery-checks.json beside the package, with the preceding
artwork verification also included inside. PNG encoding optimization saves4.3 MB
without changing any RGBA pixel or canonical operation.

**Recommendation: retain V44 for human comparison; keep V41 default.** It makes
useful tonal and boundary progress but retains directional banding, increases early
spill and costs more per operation. Whole-support moments also reduce disjoint or
curved broad regions to a straight contact. These limitations and reduced tail grain
need artistic review before any promotion.
