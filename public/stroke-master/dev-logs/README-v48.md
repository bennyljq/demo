# V48 — Progressive charcoal construction and selective definition

**Rejected at the small causal gate.** V44 remains stable/default; V46 remains
the frozen development control. V48 is available as the requested Challenger,
with no promotion or commit. V47 is retired from normal selection and preserved
in the [archive](../archives/index.html), including its report and recovery ZIP.

Open the [complete progression study](../artifacts/v48/comparison.html) through
[charcoal studies](../charcoal-studies.html), or extract the single
[comparison/recovery package](../artifacts/v48/comparison-package.zip).
The study contains 50 complete drawing streams, both seeds, all six checkpoints,
causal ablations, native/thumbnail views and matched planning-time prefixes.

The five user-supplied images in `assets/charcoal-progression-examples` were
inspected alongside frozen V46/V47 early and final drawings of Mat, rooster and
Rainier. Example 1 establishes the illuminated face and shadow side, then
strengthens hair and surroundings; soft cheek and neck edges still disappear
into nearby tone. Example 2 makes the eyes precise while much of the lower face
remains unresolved. Example 3 defines one eye before neighbouring forms. Example
4 uses angular hat blocks to describe the subject; the later fingers and cheek
are selective definitions, so rectangularity alone is not a failure. Example 5
preserves the central light passage while hair and facial structure gain contrast.
These selected snapshots support value relationships and local edge decisions;
they do not prove unshown actions. The separate five-stage guide is a repertoire,
not a mandatory outline, ground, sequence or fixative pass.

The practical gap is early construction. Frozen V46 and V47 spread separate dark
contacts around the head or through the landscape before establishing connected
major relationships. Their later accumulated modelling becomes recognisable,
but patch joins and indiscriminate detail remain. V48 must improve this sequence,
not merely replace each contact with a more varied mark.

The V47 defect was confirmed without modifying its renderer: at axial position
0.1, a rounded lift with side softness 0.18/0.85 gives centreline limits
0.432006 and 0.257699. Away from the midpoint, the side profile also changes axial
falloff. V47's source SHA stays unchanged; all 39 archived drawings replay with
their original RGBA hashes. V48 delegates contact rendering to V46, with equal
centreline limits at all five tested positions. Its identity is planner48 with
the shared material8/stick6/contact6; no asymmetric contact or new material was
introduced. Historical planner46 and planner47 identities remain distinct.

The mechanism was specified before implementation. Broad reference averages
use radius 2.5% of the long edge, intermediate averages 0.9%, alongside the
existing fine average, full-resolution tone and fine boundary differences.
All are cached analysis, never canvas imagery. The local definition value is
`1 / (1 + (broad residual / 20)^2 + (intermediate residual / 16)^2)`, with a
small floor for fine contrast corroborated by coherence. This is a structural
attention approximation, not semantic or artistic importance.

Broad squared-error weight varies from 0.65 to 0.25 as local agreement improves;
intermediate weight from 0.20 to 0.25; fine weight from 0 to 0.10; point weight
from 0.15 to 0.40. Fine boundary differences retain weight 0.15. A bright point
relative to its intermediate neighbourhood adds up to 0.35 point weight, so a
narrow light is protected even before broad construction settles. No global
contrast ceiling, copied blur, compulsory foundation or operation-count stage is
used. All existing contact sizes and deposit/lift/blend/accent actions remain
available; the existing fine-width choices respond to the local definition value.

Full V48 samples the current nonnegative objective at the same 64 random anchors
as V46. Unit-opacity material rendering supplies a quadratic opacity fit under
the current weights; final acceptance scores the fitted rendered operation.
Reference data does not enter replay. Accepted work updates definition only in
the affected region, including the broad dependency halo, and rebases cached
errors there. A mistaken region loses definition and regains broad emphasis.
Full-resolution and boundary floors continue to offer corrections; the existing
plateau/proposal limits still stop unproductive work, and Continue supplies new
allowance without discarding the canvas, RNG or construction evidence. Targeting
uses the same objective within its feathered mask and can make broad corrections.
Undo restores the construction state as well as pixels and RNG.

Changing objective values cannot be compared across weight epochs or versions.
Snapshots label the internal construction objective and record rebasing. Normal
V48 UI error/improvement uses a separately maintained fixed point-error measure;
comparison tables use fixed full-resolution RMSE, broad RMSE and light damage.
The fit-versus-render maximum gain difference was 7.22e-08; patch
versus full rendered-objective difference was 1.35e-13.

The causal test used complete 160×120 drawings: a lit rounded form, broad masses
with a narrow light gap, a Mat portrait crop, a Rainier landscape crop, and a
rounded form with a fine cross that must read early. Each used seeds 42/73,
300 Paint plus 300 Continue, and 25/50/100/200 checkpoints. Controls share V46
contacts: attention-only changes location while retaining V46 fitting/objective;
objective-only retains V46 attention; full V48 combines them. V44 provides stable
context. Exact fitting is part of the objective variant, so its effect cannot be
separated from evolving weights by this ablation. This is explicitly a bundled
objective/fitting experiment, not proof that every state-dependent objective fails.

Final full-resolution RMSE, averaged across both seeds (lower is better):

| Complete test | V44 | V46 | Attention only | Objective only | Full V48 |
|---|---:|---:|---:|---:|---:|
| sphere | 7.41 | 5.86 | 5.01 | 6.62 | 6.02 |
| gap | 12.71 | 11.72 | 10.45 | 13.38 | 11.91 |
| portrait | 20.02 | 15.57 | 14.88 | 17.41 | 16.59 |
| landscape | 27.16 | 25.49 | 25.11 | 26.85 | 27.34 |
| early-detail | 8.31 | 7.56 | 6.62 | 8.54 | 7.49 |

Native and thumbnail inspection confirmed the same detached patch start on both
seeds. V48's gap construction improves some early checkpoints, and fine accents
can read by 50 operations; fine detail is not universally postponed. Those gains
do not establish coherent early massing. The portrait still begins with separate
background and feature dashes, and its final face retains joined, waxy planes.
The landscape retains spotty sky/forest modelling and becomes less faithful in
both final tone and broad values. The sphere is mixed. Attention alone explains
much of the numerical gain in the gap, portrait and fine-feature tests; adding
the evolving objective/fitting generally loses that benefit. The failure is
broader than merely delayed useful detail, and no material changes were added to
rescue it.

Fixed light/broad measures and offline operation diagnostics:

| Full V48 test | Bright reference pixels | Mean light damage V46 / V48 | Mean broad RMSE V46 / V48 | Point-error-increasing actions V46 / V48 |
|---|---:|---:|---:|---:|
| sphere | 11446 | 0.82% / 0.91% | 1.92 / 2.28 | 1.0 / 22.5 |
| gap | 840 | 19.46% / 15.95% | 5.52 / 5.71 | 0.0 / 1.0 |
| portrait | 651 | 12.98% / 9.75% | 5.89 / 7.08 | 0.5 / 1.5 |
| landscape | 584 | 75.00% / 58.05% | 7.55 / 10.59 | 0.0 / 10.5 |
| early-detail | 11446 | 1.48% / 2.37% | 2.20 / 2.76 | 0.5 / 13.5 |

Light damage is the fraction of reference pixels above 220 whose material tone
is over 12 units too dark. Broad RMSE uses the same fixed 2.5%-radius blur for all
versions. A point-error-increasing action or pixel-direction reversal can be a
useful broad correction; the offline audit does not automatically call it waste.
At the same 600 operations V48 usually has worse portrait/landscape results, so
the extra fitting has not bought useful operation economy. All 50 final streams
accepted 600 operations, with 600–629 proposals;
recorded stops were Stroke budget reached. Counts and material-action totals are shown
for every checkpoint in the study.

Repeated isolated wall times include analysis, fits, candidate raster/score,
application, local evidence and Continue setup. No capture, metric calculation
or replay is inside the timing windows. Medians of three runs, reversed planner
order on alternating repeats:

| Test | V44 Paint / total ms | V46 Paint / total ms | V48 Paint / total ms | V48 / V46 total |
|---|---:|---:|---:|---:|
| portrait | 334 / 596 | 365 / 618 | 980 / 1971 | 3.19× |
| landscape | 343 / 574 | 316 / 551 | 968 / 1857 | 3.37× |
| early-detail | 331 / 583 | 300 / 532 | 903 / 1838 | 3.45× |

Candidate counts stay 3/7/12 and no lookahead was added. Exact unit-render fits
and wider scoring halos dominate the extra cost; fit pixels/ms and local-update
ms are recorded. Reference analysis is cached and there is no global analysis
pass for each proposal. The bounded implementation is still substantially more
expensive without a defensible complete-drawing improvement. Matched-time views
use actual acceptance timestamps from the captured drawing runs; repeated timings
are separate evidence and are not substituted for those traces.

**Campaign stopped at the required gate.** No Mat/rooster/Rainier 1400 + 1400
development campaign, Tay/Orca/Wonder Lake regression campaign, longer refinement
or additional reference was run for V48. Tay, Orca and Wonder Lake are previously
used regressions, never novel holdouts here. The source freeze records this
decision and the final causal evidence was rerun from the frozen source. The
separate Mat studio 300 + 300 check verifies mechanics, not artistic validation.
This milestone therefore does not claim V48 succeeds or that full outcomes were
validated. The useful result is a reproducible rejection of this concrete
strategy before a larger campaign.

Focused checks passed: historical oil and charcoal40–47 generation/Continue/RNG
and native/2× replay versus saved V47 source; unchanged V46/V47 SHA; both seeds
and all search depths deterministic; source-free replay and seeking; exact target
Undo; actual studio Paint/Continue with deposits, lifts and blends; historical
V40–V48 JSON imports; actual 2× PNG export matching replay; fixed reporting error.
The standalone study and package recovery checks are included in the ZIP.

From the original workspace, `python v48-prepare-baseline.py` recovers the
historical check engine from the existing V47 ZIP without duplicating its package.
Regenerate with `node v48-study.cjs`, then run
`node v48-timing.cjs`, `node v48-build-review.cjs`, `node v48-verify.cjs`,
`node v48-economy.cjs` and the focused `v48-*-check.cjs`/browser scripts.
`python v48-report.py` refreshes this report; `python v48-package.py` creates the
single package. Prepared Mat/Rainier sources remain in local V46 artifacts.
Extract the ZIP independently, open `comparison.html`, and run
`node restore.cjs` to reproduce all 50 native PNGs without source images,
dependencies or network. Large generated evidence stays ignored outside Git.
Human review remains the promotion gate; V44 is unchanged as default.
