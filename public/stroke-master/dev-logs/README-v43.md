# V43 - bounded charcoal placement; broad shading branch rejected

V43 is an experimental challenger, not a promotion. V41 remains the default.
V41/V42 controls, oil and the completed studio UI are preserved. No commit.
[Complete comparison](../artifacts/v43/comparison.html),
[single review/recovery package](../artifacts/v43/comparison-package.zip),
[canonical studies](../charcoal-studies.html).

The causal traces separate broad deposits/lifts, connected deposits/lifts and
blending on exact recorded V42 seed42 material. Twenty-seven of30 fixed contact/region combinations are available; three absent
combinations are disclosed. Fixed normalised regions cover
rooster silhouette/feather rims, Mat forehead/cheek, Rainier sky/distant forest.
The first matching operation100-2399 of each type is used, without selecting by
alternative success; absent combinations are recorded. Crops show target, preceding
material, actual next contact and independently fitted alternatives. Complete
footprints are scored; wrong-sign changed quantity is a diagnostic, not a verdict.
See [trace protocol and measurements](../artifacts/v43/diagnosis.json).

Broad contacts create rectangular joins early: Mat's forehead/cheek and Rainier's
sky already contain isolated bounded patches before connected correction or blending.
Broad lifts can remove excess tone but leave further locally bounded changes.
Blending redistributes the current patch; its one-pass reach does not repair the
large-scale construction. Some connected footprints include both helpful and
opposing residuals across a rim. Conversely, a useful feather deposit can lose
score after a sparse shift. Thus absolute-residual anchoring is insufficient, but
forcing every path to one side would also remove useful cross-boundary marks.
These are observations of this fixed sample, not universal attribution percentages.

The retained change is candidate placement only. Five bounded normal translations
(0, +/- half width, +/- one width), with five longitudinal by three transverse
samples, rank signed deposit/lift residual separately. Geometry, useful length,
curvature and pressure profile survive translation. The best shifted contact is
fitted and compared to the original using the unchanged complete-footprint scorer;
ties retain the original. There is no silhouette clipping, semantic rule, quota,
forced outline, target pigment deposition or final-image filtering.

The existing V42 soft-contact support was used for the broad test. A strongly
rounded pressure envelope on all broad contacts lost too much tonal coverage on
compact transitions. The reduced test modifies only the largest deposit/lift pair:
softness1, end softness.35, pressure [.65,1,.65], with the original bounded geometry
and refitted strength; smaller broad alternatives remain. It still worsens Mat and
the compact transition. At2800 operations broad-only Mat RMSE14.98 versus V42 11.69;
at600 operations transition12.77 versus11.15. The combined sparse-placement/broad
probe also retains visible tonal patches. Reject this treatment. It lives only in
v43-treatments.cjs for reproducible studies; no broad toggle enters the runtime.
More extent/placement variants were not accumulated to rescue it.

The ablation gallery includes contour/transition300+300 and Mat/rooster1400+1400:
V42, early sparse placement alone, broad alone, their development combination,
and final V43 with original-placement retention. The production model shares V42
material5/charcoal-stick-3 and records planner43. Scoring, deposition, blending,
paper character and target feathering remain unchanged. Historical planner42
records replay exactly. Twenty-two replayable studies now include direct V42/V43
contour and transition cards showing both useful accents and unresolved tonal joins.

Existing640 EXIF/Lanczos sources, Balanced detail/search, seed42 development then
seed73 unchanged confirmation. Every main initial run uses1400 operations/5600
proposals plus one equal refinement allowance; all reach2800 operations. Actual
proposal counts/stops, operation families, fitted raster support sizes and nearby
correction sequences are in measurements.json. Preserved V41 images are reused as
visual references; their old timings are explicitly labelled historical. Fresh
serial V42/V43 timings drive approximate equal-work prefix views. Orca was prepared
and run only after freezing the treatment; no tuning followed.

| Case / seed | V42 RMSE initial -> final | V43 RMSE initial -> final | Fresh work seconds V42 / V43 (final) |
| --- | --- | --- | --- |
| rooster / 42 | 18.15 -> 14.66 | 17.27 -> 14.03 | 9.39 / 10.52 |
| mat / 42 | 15.98 -> 11.69 | 16.11 -> 11.50 | 12.09 / 13.01 |
| rainier / 42 | 23.22 -> 20.75 | 23.45 -> 20.74 | 11.87 / 12.60 |
| rooster / 73 | 17.60 -> 14.40 | 17.04 -> 13.84 | 9.83 / 13.64 |
| mat / 73 | 16.21 -> 12.10 | 15.74 -> 11.42 | 11.89 / 17.44 |
| rainier / 73 | 23.42 -> 21.03 | 23.27 -> 20.66 | 12.14 / 17.09 |
| orca / 42 | 16.46 -> 14.26 | 16.23 -> 14.00 | 20.23 / 28.20 |

Mat was preselected for the single5600-operation extension because forehead and
cheek blockiness persists. Both planners reconstruct1400+1400 then extend by2800,
not a changed initial schedule. V42/V43 final RMSE 8.50/8.22,
work 20.70/22.21s. More work improves
readability and focal detail for both; V43 still has forehead/cheek patch joins.
No other case received an enlarged allowance.

Rooster retains connected feathers and useful leg/silhouette accents, with somewhat
cleaner placement in both seeds. Mat's eyes/mouth remain deliberate, but its broad
facial value planes still facet; the small final gain does not imply a proportion
or expression advantage everywhere. Rainier remains weak in distant forest and
sky organisation; seed42 is nearly tied and some initial value construction is
worse. Untuned Orca preserves the body silhouette and focal head markings, while
both backgrounds remain patchy. V43 preserves V42's expressive detail and is more
readable than V41 most clearly on rooster; neither is a universal artistic winner.

Extra work is explicit: Balanced still supplies seven engine candidates, but each
nonzero shifted connected proposal adds one fit and two complete-footprint probes
before the normal evaluation. At most two such pairs per proposal: nine fits and
11 score calls including the final seven. Fast/thorough still supply3/12; extra
work applies only to connected candidates with a nonzero proposed shift. The same
prepared V42 geometry is reused; there is no random search expansion. Metrics
record extraFits/extraScores and retainedOffsets, and work time includes them.
Counts reported as engine candidates alone must not be read as total evaluations.

Common-error first crossings use measured trajectories every25 operations and
never interpolate or extrapolate. They are numerical efficiency diagnostics,
not artistic judgements. Nearby deposit/lift switches use the same16px midpoint
cell within12 operations; this misses some overlapping large footprints and does
not prove waste. The separate timing-repeat.json repeats only rooster42 and Mat73
in two serial, order-reversed pairs because variable timing affects adoption.
Analysis, trajectory reads, replay/export and gallery construction are outside
candidate work time. Hardware load/JIT limit broad timing claims.

The repeats reduce the apparent seed73 slowdown: rooster42 V42 total work
9.42/8.96s versus V43 10.15/10.04s; Mat73 V42 11.59/11.38s versus V43
12.65/12.49s. At the common final V42 error, rooster42 first recorded crossings
use2800 operations for V42 and2425 for V43: 9.42/8.96s versus8.92/8.86s.
That is a modest, load-sensitive numerical efficiency benefit. Mat73 reaches the
common error at2500 V43 versus2800 V42 operations, but time is11.65/11.49s
versus11.59/11.38s: fewer operations do not make it faster. Other single-run
crossings, including untuned Orca, do not establish a general compute advantage.

Nearby deposit/lift switches at2800 operations, V42 -> V43: rooster42 42 ->39,
rooster73 51 ->42; Mat42 27 ->30, Mat73 39 ->19; Rainier42 39 ->36,
Rainier73 25 ->41; Orca42 49 ->41. This mixed result supports less local correction
in some cases, not a blanket reduction. All main three-tool windows are zero under
this limited proximity definition. Sharp accents and paper grain survive, while
patch seams/halos still need substantial work.

Recommendation against V41: retain V43 as an optional connected-detail challenger,
with V41 still the human-review default. Against V42: useful bounded placement
improvement, but do not promote on this evidence. Broad shading is not solved;
additional scoring costs compute and corrective work is not consistently lower.
Use the equal-work images and recorded crossings, not endpoint pixel error alone.

Focused checks cover both seeds, Fast/Thorough bounds, deterministic operations,
material/RNG, Continue, target feather/Undo, candidate/full-score agreement,
historical oil/V40/V41/V42 preservation, conservative blending, source-free replay,
timeline and native/2x row/frame exports. Browser checks cover Paint's planner43
identity, active-session selection, Continue/Undo and canonical PNG exports; all
22 studies replay at zero/middle/final. Existing V39 workflows remain checked.
The package freezes the renderer and includes every selectable image, final/long
record, initial metadata with final prefixes, manifests and standalone restore.
Independent extraction verifies all297 member hashes and106 exact recorded
checkpoints. The single roughly32MiB ZIP includes all200 selectable images,
39 final/extended records and37 initial metadata prefixes. Replay
recovers artwork, not optimiser state; prepared references are needed for replanning.
Large records/captures remain in OS temporary storage; PNG/HTML/ZIP outputs are ignored.

Reproduce: `python v43-prepare.py`; `node v43-paint.cjs --variant=v42` then
`--variant=v43`, also `--seed=73`. Ablations use
`--refs=contour,transition,mat,rooster --variant=placement-only` / `broad-only` /
`combined-probe`. Holdout: `--refs=orca`. Mat extension: `--refs=mat --long=yes`
for both controls. Then `node v43-timing.cjs`, `node v43-diagnose.cjs`,
`node v43-gallery.cjs`, focused checks, `python v43-package.py`, and
`node v43-recovery-check.cjs`. Extract comparison-package.zip and open
comparison.html, or run `node restore.cjs mat-42-v43-work-long 1` (2 for2x).

**Does V43 construct cleaner, more coherent drawings with less corrective work,
while preserving V42's expressive detail?** It preserves the detail and improves
some edge placement. Coherent broad shading and reliably less corrective work are
not established. Retain the limited challenger; reject the broad branch and keep
V41/V42 controls available for human review.
