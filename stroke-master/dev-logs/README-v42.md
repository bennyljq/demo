# V42 — Connected charcoal marks and material blending

V41 is now the charcoal baseline/default. V42 remains a separately identified
challenger. V40 is retired from normal selection, with explicit restoration and
historical replay preserved (`planner:'charcoal40'`, or
`node v41-paint.cjs --variant=v40`; prior V41 recovery bundle remains intact). Oil/V33, oil canvas texture and the completed V39 UI
are unchanged. No commit or automatic promotion.

[Canonical studies](../charcoal-studies.html) ·
[Complete comparison gallery](../artifacts/v42/comparison.html) ·
[Single comparison/recovery package](../artifacts/v42/comparison-package.zip).
The supplied V41 comparisons, rooster-charcoal-v1 and oil ayam-v2 were inspected;
the latter exports remain visual context, not comparable-work opponents.

## Restriction established before changing scoring

V41's side length is nominally 2.3 × width, edge/tip length 3.1 × width. The
quantised straight walk then clips each half at a tone change (tolerances 32/24/16).
Width also shrinks across boundaries. There is no direction-following curvature:
one reference tangent plus a small perturbation sets a straight cubic. Fine-phase
tips can be only a few pixels long. The fixed long lines and hatch arrays in the
studies are material capabilities, not paths its candidate generator can supply.

Frozen seed42 traces reproduce Mat and rooster decisions exactly. Mat evaluates
1400 tip deposits; 947 have positive gain, but only 30 win. Rooster evaluates 1401,
778 are positive and 135 win. Accepted tip maximum aspect is 2.8; accepted edge
maximum 2.93. Side deposits/lifts account for 995 Mat and 783 rooster operations.
This verifies restricted geometry and competition with larger tonal contacts;
it does not prove that the fitter or scorer universally rejects useful long lines.
[Actual geometry, fits, selection counts and ten feature-region traces](../artifacts/v42/diagnosis.json).

Connected probes on the same frozen surfaces are mixed: at Mat proposal435 a
45.8px × 3.84px path fits .410 and gains6.31, while the old 16.1px tip gains9.98.
Some probes fit zero, others lack reliable direction. Longer is not automatically
better. Actual V42 contour trials and paintings do accept long contacts under the
unchanged V41 objective/fitter. **No scoring correction was necessary.** The scalar
fit remains a limitation when one connected path crosses different desired tones.

## Practice, operations and planner access

Jake Spicer describes fine pointed marks, smudging/shaping with stumps and
tortillons, lifted highlights and renewed sharp details, with distinct willow and
compressed materials. [Artist-authored instruction](https://www.artistsandillustrators.co.uk/how-to/drawing/how-to-draw-with-charcoal/).
These functional families support the toolkit; they do not prescribe our numerical
model. The [existing artist/manufacturer/museum study](V41-CHARCOAL-PRACTICE.md)
remains relevant. This is one stylised charcoal, not an exact product simulation.

The existing studies page now has 18 replayable cards. Historical V41 material
swatches remain; V42 adds long/thin straight and curved pressure-varying contacts,
narrow/broad blending, repeated blending and deposit → blend → lift → sharp redraw.
Sphere, cylinder, negative shape and straight/curved contour, taper and transition
targets use the actual V42 planner. Fixed curves/hatching are explicitly labelled
demonstration gestures. The planner generates individual contacts, not hatch
bundles; every operation counts as one contact.

V42 keeps the four broad V41 tone deposit/lift slots. The short edge pair becomes
a connected deposit/lift pair when local direction is reliable, otherwise the
old edge geometry remains. The least-selected tip slot becomes local blending.
Balanced search still evaluates seven candidates. Fast uses three residual-directed
slots; thorough retains its twelve-slot limit. No outline-first phase, usage quota,
semantic subject rules, source underlay or final filtering.

Paths use bounded local reference structure: up to sixteen steps on each side,
coherence ≥ .12, direction turn limited by a .82 dot product, raw-tone change ≤40,
and maximum .085 long-edge travel each way. A small normal search places the
contact at a useful current residual. Hermite controls make a genuine cubic;
excess deviation from the walked support splits/shortens it. Width is 1.5–6px at
these settings; recorded three-point pressure profiles taper width and pickup.
The existing bounded strength fitter and complete-footprint scoring decide whether
deposit or lift is useful. Broad masses remain available throughout refinement.

## Local blending rule

Coverage `q` is charcoal quantity. For each of four symmetric neighbour-pair
offsets inside the contact, exchange
`flux = .12 * strength * min(mask[p], mask[k]) * (q[k] - q[p])`.
All exchanges read the same input quantity, accumulate equal/opposite deltas, then
update once. At most eight neighbours give outgoing weight ≤.96 before strength;
quantity stays in [0,1] without removal/clamping. Radius is recorded in canonical
pixels, 1–6. Narrow stump-like and broad cloth-like contacts share this rule.

Mask includes pressure, softness and target feathering. Exchanges cannot cross a
zero-support boundary. Buffers and traversal are limited to the contact bounds;
this optimisation preserves all 44 recorded PNGs exactly. A bounded least-squares
strength fit may consult target error, but redistribution itself reads only existing
quantity. It never paints reference values or blurs final RGB. Tone is reconstructed
from the same anchored paper field. History bit4 records redistribution alongside
deposit1/lift2. Repeats predictably diffuse within support; no tool pickup/removal,
contamination, powder behaviour, fixative, paper damage or dust transport is claimed.
V41 lifting remains available, with curved/pressure-varying geometry. Full clean
paper recovery remains an explicit simplification.

## Comparisons and visual judgement

Identical EXIF/Lanczos 640 references, sRGB luma →28–246 target, balanced detail/search,
seed42. All six main initial drawings accept1400 contacts, then1400 more; actual
proposal counts and stroke-budget stops are visible. Times below are fresh serial
candidate-work observations after bounding blend work, not repeated benchmarks.
Analysis/display/export are excluded; JIT and external load limit compute claims.

| Seed42 case | Planner | Initial ops / proposals | Final ops / cumulative proposals | Work seconds initial -> total | RMSE initial -> final | Final connected / blends |
| --- | --- | --- | --- | --- | --- | --- |
| rooster | V41 | 1400 / 1401 | 2800 / 2810 | 4.88 -> 8.12 | 23.39 -> 19.73 | 0 / 0 |
| rooster | V42 | 1400 / 1401 | 2800 / 2805 | 5.33 -> 9.30 | 18.15 -> 14.66 | 965 / 59 |
| mat | V41 | 1400 / 1400 | 2800 / 2802 | 6.75 -> 10.53 | 16.90 -> 12.77 | 0 / 0 |
| mat | V42 | 1400 / 1400 | 2800 / 2800 | 7.41 -> 11.82 | 15.98 -> 11.69 | 624 / 132 |
| rainier | V41 | 1400 / 1400 | 2800 / 2800 | 6.95 -> 11.22 | 23.75 -> 21.49 | 0 / 0 |
| rainier | V42 | 1400 / 1400 | 2800 / 2800 | 7.57 -> 12.04 | 23.22 -> 20.75 | 424 / 88 |

Final V42 long/thin contacts (aspect at least8) are632 rooster,484 Mat and189
Rainier, versus zero in V41. Curved-control deviations are570/483/273; these
counts establish utilisation, not successful contour placement.

The gallery contains initial, final and approximately equal initial/total-work
prefixes at both seeds, with counts/time visible. Stronger gestures survive the
time-prefix comparison most clearly on rooster. Mat's gain is smaller at comparable
work; Rainier improves branch accents but its distant forest remains poorly organised.
Lower pixel RMSE is reported as a diagnostic, not an artistic score.

Connected-only disables the fitted blend slot while retaining identical geometry,
fitter, objective, RNG and seven evaluations. Mat/rooster plus contour/transition
are the small ablation subset. At2800 contacts Mat RMSE is11.98 without blending
versus11.69 combined; rooster14.78 versus14.66. Contour2.91 versus2.96 is slightly
worse with blending; transition11.33 versus11.15 slightly better. Visual differences
are modest. Most gain is connected geometry; blending is useful local construction,
not an established global cure. Its extra compute needs better placement, not a quota.

Seed73 was run unchanged and inspected on all three subjects. Rooster retains
connected feather/leg gestures; Mat's eyes/lips retain more deliberate boundaries;
Rainier gains branch-like accents but still contains scattered scratches and joins.
Refinement develops accents rather than only accepting more patches. Rim halos,
over-described feathers, faceted facial transitions and weak forest structure remain.

An audit of same16px midpoint cells within12 accepted operations finds local
deposit/lift switches, but no three-tool window in the six full V42 paintings.
Small contour/taper targets do contain such windows. Every accepted operation
strictly improves the objective; this excludes exact score reversal, not all waste.
The proximity check is a diagnostic with limited spatial reach, not proof that
all repeated corrections are necessary. [Counts/gains/utilisation](../artifacts/v42/measurements.json).

**Recommendation: retain V42 as challenger; revise before promotion.** It now uses
a useful range of charcoal gestures, rather than reducing every action to a short
rectangle. It still relies on patchwork for some tonal construction. The single
next priority is path placement and edge-side control: narrow contacts/lifts sometimes
straddle a contrast boundary, creating doubled rims and halos. Improve that before
adding more named tools or stronger global smoothing. V41 remains the default.

## Verification and recovery

Passed `build.cjs`, `v42-test.cjs`, `v42-preservation.cjs`, `v42-browser.cjs` and
the existing `v39-browser.cjs`. Frozen oil/V40/V41 decisions, RNG, continuation and
historical native/2x pixels agree; all six large V41 seed42 PNGs match preserved
bytes. Checks cover both seeds, fast/thorough limits, candidate/full gains and
quantity/history, conservation, empty-paper blending, bounded local spread,
target feathering/Undo, mixed-operation replay, timeline checkpoints and native/2x
row/full/frame/smooth exports. Chrome checks every gallery seed/view and all18
studies at zero/middle/final replay positions, including480px layout. Other browsers
and touch are untested. V39 drag/opacity/floating-reference and transparent backdrop pass.

Reproduce with prepared references from `python v41-prepare.py`; run
`node v42-diagnose.cjs`, then `node v42-paint.cjs --variant=v41` and `--variant=v42`
for seeds42/73. Compact targets: `--refs=contour,taper,transition`. Ablation:
`--variant=connected-only --refs=rooster,mat,contour,transition`. Then
`node v42-gallery.cjs` and `python v42-package.py`.

One ignored `artifacts/v42/comparison-package.zip` contains every gallery image,
the standalone comparison, frozen renderer/components, 22 final canonical records
and22 initial metadata/prefixes, manifests and restoration script. Identical
time-prefix/full images share files rather than duplicate exports. No duplicate
initial stroke arrays or second image archive. Loose records/prepared sources and
visual captures stay in OS temp, outside Git. [Exact contents/hash](../artifacts/v42/recovery.json).
Extract into a fresh directory, open `comparison.html`, or run
`node restore.cjs rooster-42-v42-refined 1` (2 for native2x).
`node restore.cjs mat-42-v42-work-refined 1` restores a timed checkpoint.
Recovery recreates artwork, not live optimiser state; reference assets are needed
only for replanning. Independent extraction and every packaged image are verified.
[Recovery checks](../artifacts/v42/recovery-checks.json).
