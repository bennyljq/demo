# V41 — Charcoal proficiency study and challenger

V40 is unacceptable as a painter. Its recognisability and passing technical tests
were not artistic success. It remains a reproducible comparison baseline, not an
endorsement. V41 is a challenger pending human review; Oil/V33 and the charcoal
V40 selector default remain unchanged. Oil canvas texture is deferred and untouched.

[Canonical studies page](../charcoal-studies.html) ·
[Comparison gallery](../artifacts/v41/comparison.html) ·
[Commissioned practice study and primary sources](V41-CHARCOAL-PRACTICE.md).
The supplied stroke study, Mat, Rainier, `rooster-charcoal-v1.png` and `ayam-v2.png`
were inspected. The latter exports provide visual context, not matched-work cases.
User-added assets and historical V40 evidence are preserved. No commit was made.

## Verified diagnosis

The seed42 Mat trace reproduces exactly **319 marks / 5600 proposals / 39200
evaluations**. Of 5281 rejected proposals, **5203** had an already too-dark centre.
Shared attention continued visiting those residuals, but V40 could only darken.
This is verified; it does not mean every pixel of those footprints was too dark.
[Five traced proposals and synthetic results](../artifacts/v41/diagnosis.json).

The first traced side contacts are roughly 34–38 pixels wide and 165–174 pixels
long; a 9.5-pixel tip contact travels 109 pixels. At 640 edge these cross several
facial planes rather than fitting one. Four of seven orientations are random;
the others follow the reference tangent with perturbation. Broad fixed-.72
deposition overshoots; low pressure changes both footprint and grain pickup rather
than supplying a reliable light value. Long tips protrude across boundaries.
The constant-reference-150 trial has target 156.2, mean 144.3, and pixel extremes
31.2–245.2: acceptable local averages conceal an uncontrolled patchwork.

**Scheduling did not stall in coarse construction.** It uses the maximum of
accepted and proposed progress. Mat phase proposal counts were 1008 / 1792 /
1568 / 1232, with 177 / 66 / 47 / 29 accepts. Rejection/irreparable residuals,
not an accepted-count-only schedule, dominate. Scheduling is preserved. A V41
form trial did reveal a different problem: removing all broad candidates after
the early phase leaves unfinished masses. V41 keeps one broad geometry available.

Oil's .7 coarse / .2 fine / .1 point objective rewards averages over local tone,
and its uncovered-paint term is unsuitable for charcoal paper. A perfect-paper
synthetic test has old score 4.996; an unnecessary .00001-strength deposit gains
.0000263. V41's tone-only score is approximately zero there. This verifies an
objective mismatch, **not** that the micro-deposit reward caused V40's main failure:
V40 never proposes that strength. [Objective test](../artifacts/v41/objective-diagnosis.json).
Candidate and actual deposition agree; a rendering mismatch was not found.

## Changes tied to those failures

One small [charcoal component](../experimental/charcoal-v41.js) supplies operations,
contact pickup, deposition/removal, bounded strength fitting and candidates.
Geometry traversal, seeded location search, score infrastructure, worker sessions,
refinement, replay and export remain shared. No copied engine or general medium
framework was introduced. V40's candidate/material code remains intact.

V41 keeps remaining charcoal quantity `q` in coverage. Deposit is
`q += (1-q)*alpha`; lift is `q *= (1-alpha)`. Tone derives from anchored paper
`P` as `P-(P-28)*q`. Thus lifting removes what is present, reveals the original
grain, and never paints white. A byte history field distinguishes untouched,
deposited and previously lifted regions even after full recovery. Checkpoints,
target Undo and their memory accounting retain that field. Full clean recovery is
allowed; staining, eraser residue, paper damage, binders and dust are omitted.

Pressure-dependent tooth pickup is coherent and subordinate to tone. Hard/soft
contact edges and travel fade are recorded. For each bounded footprint, the
fitter solves a weighted least-squares scalar strength against the current surface
and raw target, clamped to 0–.95. Deposit and lift candidates then compete through
actual score gains; neither gets a quota. Strict objective improvement rejects
exact reversal cycles. Local quantity can still be constructively deposited and
lifted more than once; that is not claimed to be physical dust redistribution.

Seven candidates remain the balanced limit: paired deposit/lift footprints plus
a smaller contact. Length/width are reduced at tonal boundaries and orientation
follows reference structure. A broad candidate remains available for unfinished
masses and refinement. No random-candidate expansion, semantic face/sky rules,
source underlay, reference-pixel replacement or final filtering was used.
V41 uses .3 coarse / .2 fine / .5 point tone error, modest edge weighting and no
uncovered-paper reward. White-target tests accept no charcoal deposits.

The practice study supports broad side shading, edge/tip accents, layering,
anchored tooth, selective lifting and reductive construction. Those are sourced
behaviours; our kernels, bounds and fitter are simulation choices. Blending is
explained but deferred: the demonstrated remaining fault is contact construction,
not evidence that a stump operation is necessary. Charcoal is not treated as graphite.

## Studies and identities

More → **Charcoal studies** opens 11 reproducible, labelled studies: contacts,
value ladder/ramp, layering, hard/soft/broken edges, hatching, broad/precise lifts,
deposit → lift → redraw, sphere, cylinder and light shape against dark ground.
Every card has operation stepping; forms show their analytic target and use the
actual scored planner (240 initial + 240 refinement operations). Initial failures
and remaining contact joins are disclosed. Hatch bundles are demonstration gestures,
not a claimed planner capability. The page embeds the canonical sources at build.

Charcoal's Planner selector now remains visible and separate from oil choices:

| Selection | Session planner | Planner / material / brush versions |
| --- | --- | --- |
| Charcoal V40 — baseline | `charcoal40` | 40 / 3 / `charcoal-stick-1` |
| Charcoal V41 — challenger | `charcoal41` | 41 / 4 / `charcoal-stick-2` |

Selection applies to the next painting; Continue/target retain captured identity.
V41 attaches target metadata before fitting, so deposit and lift are feathered
and constrained. V40's historical behaviour is preserved. Oil choices, UI themes,
floating-reference movement/opacity and transparent modal backdrop are preserved.

## Drawing results

Identical prepared inputs: EXIF transpose, Lanczos, long edge 640, balanced
detail/search, seed42. Target remains V40's documented sRGB luma mapping:
`28 + 218 * (.2126 R + .7152 G + .0722 B) / 255`. No enhancement or crop.
[Source/RGBA hashes](../artifacts/v41/references.json).

Every run gets 1400-operation / 5600-proposal initial caps and one equal refinement
allowance. In this table `initial + refinement` counts are per pass; RMSE is
common pixel tone error before/after refinement, not either planner's objective.

| Seed42 | Accepted operations | Proposals | Candidate-work seconds | RMSE |
| --- | --- | --- | --- | --- |
| Mat V40 | 319 + 131 | 5600 + 5600 | 27.6 + 3.7 | 48.4 → 48.3 |
| Mat V41 | 1400 + 1400 | 1400 + 1402 | 7.3 + 6.6 | 16.9 → 12.8 |
| Rainier V40 | 310 + 155 | 5600 + 5600 | 22.5 + 2.2 | 55.8 → 55.7 |
| Rainier V41 | 1400 + 1400 | 1400 + 1400 | 7.7 + 7.4 | 23.8 → 21.5 |
| Rooster V40 | 286 + 142 | 5600 + 5600 | 20.5 + 2.3 | 54.9 → 54.7 |
| Rooster V41 | 1400 + 1400 | 1401 + 1409 | 8.0 + 5.4 | 23.4 → 19.7 |

V40 seed42 stops at proposal caps; V41 reaches operation caps. Times are single
observations, with some concurrent work; no controlled speed/efficiency ranking
is claimed. The gallery includes seed42 comparisons at V40's actual initial
operation counts. Existing Mat/Rainier initial PNGs are reused and match replay
exactly; optimiser reconstruction was necessary to obtain their refinement passes.

The controlled Mat ablation disables only lifting in V41. It accepts 948 deposits
from 5600 proposals, with RMSE 24.6. Full V41 at the same **948 operations** includes
249 lifts and RMSE 19.9. The no-lift refinement adds only 141 deposits; full V41
continues developing tone and detail. V40 → no-lift V41 also includes material,
geometry and scoring changes, so it is not presented as an isolated fitting-only
causal result. [All counts, times, stops and ablation](../artifacts/v41/measurements.json).

Seed73 confirms the pattern on all three references: V41 reaches 1400 + 1400
operations; refined RMSE is Mat 12.6, Rainier 21.5, rooster 20.0. V40 accepts only
266/282/208 initially, with proposal-cap or plateau stops. Detailed per-pass
figures and both seeds are in the same gallery/measurements, not another tournament.

Visual assessment: Mat now has coherent facial planes, controlled middle values
and selected eye/mouth accents; refinement improves modelling, but cheek/forehead
contacts remain faceted. The rooster retains tail/body/leg proportions, a useful
light breast against darker wings and clear paper, with directed feather accents;
contours still have a halo and patch joins. Rainier recovers mountain/sky/forest/
reflection masses; its forest remains an indistinct band and refinement adds
limited structural detail. These are substantive drawing improvements, not artistic
success inferred from recognisability or RMSE.

**Can it construct a convincing charcoal drawing? Not consistently yet.** It is
a credible rough-study challenger, especially Mat and the rooster, but does not
establish mature proficiency across the three. The single remaining priority is
the contact fit: one scalar strength on a straight footprint facets curved tonal
transitions and produces edge halos. Improve that before adding unrelated tools.

## Verification and recovery

Passed: `node build.cjs`, `node v41-test.cjs`,
`node v33-test.cjs --out=artifacts/v41`, `node v41-browser.cjs` and the existing
`node v39-browser.cjs`. Checks cover frozen oil/V40 decisions and native/2x rendering,
seeds42/73 determinism, candidate/full deposition and gain agreement, quantity/history,
deposit/lift replay, target feather/Undo, continuation, full/frame native2x and smooth2x
PNG agreement, source-free import, 11 studies at zero/middle/final replay positions,
480px studies layout and preserved V39 workflows. No charcoal height is deposited.
Chrome ran outside the sandbox; other browsers/touch remain untested.

Reproduce from `stroke-master/`: `python v41-prepare.py`; `node v41-diagnose.cjs`;
`node v41-material.cjs`; `node v41-forms.cjs`; run `node v41-paint.cjs` with
`--variant=v40` / `--variant=v41` for seeds42/73, and
`--variant=fit-only --refs=mat --seed=42`; then `node v41-gallery.cjs` and
`python v41-package.py`. Oil is not rerun as a competition opponent.

One durable, ignored [2.39 MB canonical ZIP](../artifacts/v41/canonical-records.zip)
remains outside Git at `artifacts/v41/canonical-records.zip`. It has 33 verified members:
13 final records, 13 initial metadata/prefix records, frozen renderer/component,
PNG encoder, restoration script and manifests. No duplicate initial stroke arrays
or PNG package. [Exact members/hash](../artifacts/v41/recovery.json).
Extract into a fresh directory and run `node restore.cjs mat-42-v41-refined 1`
(or `2` for native2x). Other stems are in measurements. Independent extraction
recreates V40/V41 original PNG bytes exactly and exercises 2x replay.
[Recovery checks](../artifacts/v41/recovery-checks.json).
Replay restores artwork, not optimiser state. Prepared sources, loose records and
visual captures remain temporary outside Git; local gallery PNGs are ignored.
