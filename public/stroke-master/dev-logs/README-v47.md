# V47 — coherent tonal shapes and deliberate edges

**V44 is now stable/default. V47 is an unpromoted challenger; V46 remains the
developmental base.** The geometry experiment produces small numerical gains on
some references, but hard sided patches and extra computation prevent a claim of
better complete charcoal drawing. No automatic commit was made.

[Focused study](../charcoal-studies.html) · [Complete comparison and replay](../artifacts/v47/comparison.html)
· [One comparison/recovery package](../artifacts/v47/comparison-package.zip)
· [Archive and recovery index](../archives/README.md).

## Frozen control and diagnosis

V46's planner remains byte-identical, SHA256
`04e0d7ffb974ed1547d18d1e0d7c4eec6aa9e0a138e202d2d5b318bee46d8b3e`.
Its historical report and package remain unchanged. Exact generation, Continue,
RNG and native/2x replay are compared with the saved pre-V47 engine.

Reading README-v46 and full native images confirms starting widths `.25/.10/.03`
of the long canvas edge, initial length `1.35 × width`, later bound `3.2 × width`,
straight paths, the shared rounded contact, and fallback angle `−.35` in quiet
regions. Reference-tone scans shorten these contacts but do not independently
estimate a signed correction's shape. Repeated envelopes create separated early
masses and joins that need subsequent deposits, lifts and blending.

The fixed probes use the **same V46 200-operation state**, reference preparation,
anchor and restored RNG for both generators. Coordinates are native pixels:
Mat cheek `(210,205)`, forehead `(220,116)`; Rainier sky `(135,70)`, water
`(180,420)`; rooster tail `(160,170)`, boundary `(63,80)`.

| Region | V46 best gain | V47 best gain | Interpretation |
|---|---:|---:|---|
| Mat cheek | 255.702 | 255.702 | Rounded fallback remains useful |
| Mat forehead | 35.557 | 35.557 | No supported extension wins |
| Rainier sky | 4.549 | 4.549 | Mixed signed needs fragment extension evidence |
| Rainier water | 3.440 | 3.440 | Same limitation; oval retained |
| Rooster tail | 3.956 | 6.617 | New geometry/side profile improves scored coverage |
| Rooster boundary | 0.254 | 0.337 | Firmer supported side improves local gain |

These are objective gains, not artistic ratings. The tail winner touches more
opposing residual pixels (5747 versus5068 at unit opacity/support>.08), despite
higher fitted gain. Side treatment therefore does not establish spill prevention.
Reference guidance records operation geometry; no pixel is reference-clipped.

The first prototype required strict same-sign support everywhere. It narrowed
marks drastically, lost all six fixed comparisons and doubled or worse the
compact portrait/gradient errors. It was rejected before reference development.
Its small diagnostic records are kept in ignored `artifacts/v47-work`.

Diagnosis separates four limits. Geometry constrains early mass construction.
The material's uniformly rounded falloff contributes soft joins and waxy planes;
V47 changes only recorded contact shape/side falloff, retaining quantities and
tooth. Attention can cancel opposite needs: the fixed Rainier sky/water nine-sample
signed sums lose 58.4%/57.0% of their absolute correction magnitude. The objective
still permits bright spill and an abrupt geometric edge if aggregate gain wins.
None of these observations implies that additional curvature or randomness helps.

## Bounded geometry experiment

V47 uses three 7×7 support grids, weighted by current signed correction and
compatible reference tone. Their covariance supplies direction only when support
is elongated. Cross scans choose width; separate corridor scans choose length.
Extension requires comparable width, materially greater supported length and an
area bound of 1.8 times the corresponding V46 envelope. Weak evidence retains
the exact V46 rounded construction. Quiet broad correction and small connected
accents remain available throughout Paint and Continue.

A gentle cubic bend requires moderate reference tangent change and compatible
centre support. This is one bounded path estimate, not a ribbon library or search
over angles. Each scale has at most eight samples per cross side and twelve
corridor stations per length side. All three fitted deposit/lift pairs share their
support traversal. Candidate counts remain **Fast3 / Balanced7 / Thorough12**.
No lookahead, compulsory sweep, family quota or semantic subject rule was added.

A supported cross-tone discontinuity can record side softness `.18` against the
normal `.85` opposite side. The side test is local: it can misread a long boundary
and create an artificial straight cut. The final native images expose this failure
in Mat's early dark masses and Rainier's sky. Interior passages retain soft edges.
The contact-only probe also isolates a kernel defect: at axial position `.1`,
the two sides approach `.432` and `.258` at the centreline. Applying side softness
to the rounded radius changes its axial falloff as well, creating a seam away
from the middle. This contributes artificial facets independently of attention
or reference analysis. It is documented in `contact-diagnostic.json`; the frozen
challenger was not retuned after regression evaluation. A future geometry trial
must keep a common axial envelope when varying cross-side softness.
Geometry scans stop extension at incompatible tonal/signed needs; rounded fallback
retains V46's known spill limitations. Parameters, cubic points and side profiles
are sufficient for source-free replay.

The contact record has distinct **planner47/material9/stick7/contact7** identity.
This prevents historical reinterpretation; it does not introduce another charcoal
quantity model. V42 deposit/lift/blend quantities and V46 objective/attention remain
unchanged. Normal generation and Continue accept all three operations.

## Geometry and attention ablation

`ablation.json` separates full geometry, symmetric edges, rounded-only geometry
and separate positive/negative attention on curved mass, portrait crop and Rainier,
seeds42/73, 300 Paint +300 Continue. All use the same V46 objective and quantities.

Separate-sign attention slightly improves the curved mass and portrait light
preservation, but worsens Rainier RMSE on both seeds:24.51→25.40 and25.07→25.79.
It is **not installed**. Side asymmetry is also mixed: portrait seed42 RMSE improves
15.82→15.64 while light damage worsens11.06%→16.90%; seed73 RMSE worsens
15.46→16.07. Rounded-only geometry beats extension on both curved-mass seeds.
These results do not support an objective edit, oval penalty or length reward.

## Complete outcomes and cost

Compact complete-drawing tests cover a smooth gradient, curved tonal mass, one
hard/one soft boundary, narrow light gap, portrait crop, appropriate sphere oval
and an overdarkened lifting case. They allow300 Paint +300 Continue. Full-size
references allow1400 Paint +1400 Continue with seed42 and identical EXIF/RGB,
Lanczos maximum640 preparation and charcoal luminance conversion.

| Drawing | V44 RMSE | V46 RMSE | V47 RMSE | V47 bright damage |
|---|---:|---:|---:|---:|
| sphere | 7.34 | 6.05 | 5.71 | 0.81% (93/11446) |
| gradient | 8.24 | 7.61 | 6.95 | no bright pixels |
| curved | 6.01 | 5.51 | 5.62 | 0.21% (30/14354) |
| hardsoft | 5.18 | 4.72 | 4.63 | 0.11% (10/8960) |
| gap | 12.61 | 11.38 | 11.39 | 12.62% (106/840) |
| portrait | 19.60 | 15.81 | 15.64 | 16.90% (110/651) |
| lifting | 3.01 | 1.98 | 2.03 | 0.00% (0/13935) |
| mat | 8.28 | 9.34 | 8.84 | 17.91% (825/4606) |
| rooster | 12.72 | 13.98 | 13.71 | 2.80% (5299/189545) |
| rainier | 18.52 | 19.31 | 19.29 | 67.96% (2611/3842) |
| tay | 10.19 | 11.26 | 10.98 | 100.00% (1/1) |
| orca | 11.36 | 11.61 | 11.72 | 33.16% (435/1312) |
| unused | 9.70 | 10.37 | 10.17 | 45.56% (41/90) |

Bright damage: target tone>220, output more than12 units darker. Tay has only
one such target pixel; its percentage is not a useful aggregate quality measure.

Three isolated repeats, median **1400-operation Paint wall seconds**, including
analysis, with reversed planner order and no simultaneous painting workload:

| Reference | V44 | V46 | V47 | V47/V46 |
|---|---:|---:|---:|---:|
| mat | 6.80 | 10.08 | 10.14 | 1.006× |
| rooster | 9.15 | 10.23 | 10.75 | 1.051× |
| rainier | 13.04 | 15.38 | 17.32 | 1.126× |

V47 geometry analysis from the development Paint trace (part of total wall time):

| Reference | Geometry ms | Residual queries/proposal | Reference queries/proposal |
|---|---:|---:|---:|
| mat | 43.8 | 243.7 | 301.8 |
| rooster | 39.7 | 182.6 | 302.7 |
| rainier | 41.7 | 205.6 | 276.1 |

Matched V44 **Paint + Continue** captured wall time, actual V47 accepted counts:

| Reference | V44 budget seconds | V47 accepted | V47 RMSE |
|---|---:|---:|---:|
| mat | 9.44 | 1230 | 14.02 |
| rooster | 16.46 | 2253 | 14.57 |
| rainier | 20.57 | 1772 | 20.70 |
| tay | 32.68 | 2129 | 12.28 |
| orca | 37.61 | 2363 | 12.05 |
| unused | 34.19 | 2686 | 10.28 |

These prefixes use single-run captures; their cost claims are limited by timing
variation. The repeated Paint timings above establish the narrower runtime
comparison. Every full reference run accepted1400 Paint and1400 Continue operations.

Visual review separates numerical quality from character. Mat's values improve
slightly over V46, but the early masses acquire straight cutoffs and later facial
planes remain waxy. The rooster retains recognisable structure with a somewhat
firmer tail; its early body still develops as overlapping patches. Rainier barely
changes in final error, while sky facets and scraped accents remain conspicuous.
The compact curved mass remains grainy; the light gap survives but its flanks
need many repairs. There is no consistent reduction of repeated construction.

Tay remains recognisable but smooth facial planes and geometric edge cuts persist.
Orca's body survives while the water develops angular patchwork; V47 slightly
worsens its final error. Wonder Lake preserves the large shoreline/reflection layout,
but loses mountain detail and leaves facets across atmosphere and water. None overcomes V44's
stronger final structure at its lower error. These regression results support
retaining V46 as the developmental base rather than promoting V47.

Accepted counts, proposals, candidate evaluations and deposit/lift/blend counts
are reported independently. Timed traces include initial analysis, Continue setup,
all geometry, quantity fits, scoring rasters and application. PNG encoding,
captures, metrics and offline diagnostics/replay are excluded. Matched-time views
use real acceptance timestamps and report actual accepted counts. A prefix can
exhaust its available operations before the comparison budget; it is not extended
artificially. The repeated isolated timing campaign is separate from single-run
captured traces. Geometry milliseconds, residual queries and reference queries
are recorded separately in `geometryWork`; the three fixed grids are reused within
each pair, while current-state dependent analysis is recomputed after corrections.

The offline operation audit reports damage to already-correct bright pixels,
restoration occurrences, contact shapes, curves and direction reversals. A reversal
can be useful modelling, so it is not automatically called wasted work. It helps
inspect later repair together with replay. No hidden acceptance penalty is added.


Operation-economy diagnostics for final development drawings (pixel occurrences,
not unique pixels; useful adjustments can also reverse direction):

| Reference/planner | Bright damage occurrences | Direction reversals/changed | Passage / asymmetric / curved contacts | Mean raster segments |
|---|---:|---:|---:|---:|
| mat V46 | 902 | 28.7% | 0 / 0 / 252 | 1.16 |
| mat V47 | 880 | 31.7% | 65 / 334 / 288 | 1.17 |
| rooster V46 | 18689 | 37.3% | 0 / 0 / 611 | 1.37 |
| rooster V47 | 16089 | 43.5% | 45 / 440 / 578 | 1.39 |
| rainier V46 | 1446 | 44.3% | 0 / 0 / 263 | 1.09 |
| rainier V47 | 1549 | 45.9% | 17 / 447 / 221 | 1.06 |

The planner/engine freeze precedes Tay, Orca and Wonder Lake evaluation. Tay and
Orca are **previously used regression checks**, not new holdouts. Wonder Lake is
an unused NPS photograph by Emily Mesner, marked public domain by its source;
its preparation/provenance/SHA are recorded. No longer portrait run was required:
the visible edge/construction failures already answer the promotion question.


Paired-fit support at identical fixed states (positive-alpha sample pixels,
counted once per shared deposit/lift pair; excludes accent/single/blend fits):

| Probe | V46 support pixels | V47 support pixels |
|---|---:|---:|
| mat cheek | 9018 | 9212 |
| mat forehead | 6900 | 7114 |
| rainier sky | 32098 | 32254 |
| rainier water | 6204 | 6204 |
| rooster tail | 18381 | 18381 |
| rooster tail boundary | 1378 | 1378 |

The geometry grid itself costs about40ms per1400-operation development Paint
trace. Contact support, fitting and scoring dominate total cost. The raster
segment audit above does not show a wholesale increase in path subdivision;
the larger/firmer selected envelopes still change fitting and application work.

Final delivery checks: the standalone review passes51 native canvas comparisons
and480px layout; the archive still opens all33 historical studies. An extracted
package restores all39 native drawings with exact RGBA SHA256 agreement and no
references. The tool restorer copies all50 files exactly and refuses a changed
destination. Historical ZIPs pass CRC checks and remain in place.

## Research and verification

[Nathan Fowkes' accessible course description and curriculum](https://artschoolvideos.com/course/portrait-drawing-in-charcoal-full-demo/)
support simple light/shadow masses and selective soft/sharp edges. The paid lesson
was not watched. [Fussell's accessible portrait process](https://thevirtualinstructor.com/sketching-with-charcoal-portrait.html)
describes broad value applications, soft blending and renewed detail. These inform
the implementation choices; neither source supplies a numerical kernel or a
semantic drawing policy. [Wonder Lake provenance](https://npgallery.nps.gov/AssetDetail/bd44780c-93e9-42a6-bc92-905b78868472).

Focused checks preserve historical oil and charcoal40–46 generation/restoration,
V47 determinism at both seeds/all depths, source-free native/2x replay and timeline
seeking, patch/full score equality, targeting/Undo and invalid identity rejection.
Actual studio checks exercise Paint, Continue after changing the next-Paint
selector, target gesture/Undo and exact2x PNG export. Actual historical imports
preserve planner/material/stick identity after selector changes.

The normal selector is only V44 Stable, V46 Experimental and V47 Challenger.
Retired standalone charcoal tools/studies have one archive index, exact tool
checksums and a non-overwriting restoration command. Existing bulky historical
reviews/packages remain at their original archive locations; no duplicate archive
ZIPs or rewritten Git history. Shared material, renderer and study dependencies
remain available. Generated V47 bulk is ignored outside Git.

Reproduce from the studio root: `python v46-prepare.py`, `python v47-prepare.py`,
`node v47-fixed.cjs`, `node v47-study.cjs`,
`node v47-ablation.cjs`, `node v47-benchmark.cjs`, then
`node v47-benchmark.cjs --regression` after the recorded freeze. Existing prepared
V46 references are reused; Wonder Lake's prepared source/provenance is in V47
evidence. Run `node v47-timing.cjs` with no other painting workload, followed by
`node v47-damage.cjs`, `node v47-build-review.cjs`, `node v47-check.cjs`, browser
checks and package recovery verification. The one package includes independent
replay, canonical records, checks, measurements, report and recovery instructions.

Fixed probes require the retained V46 canonical records. Historical comparison
checks use `../artifacts/v47-work/engine-v46.js` and its `experimental` directory.
That exact engine is recoverable from the existing V46 package's `recovery` tree,
SHA256 `7ad585731856e009e2bf0550ef2af589ba6137d2f619ccca382d8652179cf4b6`:
copy its engine as `engine-v46.js` and retain the adjacent experimental modules.
Standalone V47 artwork restoration needs only its own package and `node restore.cjs`.
