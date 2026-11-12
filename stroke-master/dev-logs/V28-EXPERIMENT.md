# V28 — Local Form

**Reject this constructor for broad repair.** Local feasibility is solved: 33 contacts were emitted across all 13 reused regions, including three/four-cell regions. There are genuine medium-scale improvements. Broad recovery remains weak: only one of three large contacts is positive, and the two retaining at least 25% of raw alpha area are rejected. Do not integrate automatically or add another mechanism to rescue this result.

[Successor gallery](../artifacts/v28/comparison.html) · [Declared design](../artifacts/v28/design.json) · [All metrics](../artifacts/v28/results.json) · [Summary](../artifacts/v28/summary.json). V27 evidence is unchanged.

## Fixed controls and constructor

Incoming Git was clean. V27 report/code/skips were read. No archive/access reorganisation, production planner, selector, scheduler, scoring, colour or material change was made. The exact V27 references, 13 regions, anchors, frozen 300/1400-operation states and canonical `freeze`/`measure` harness are reused. All V27 artifacts/sources, historical logs, retained reference/record inputs and production engine/planner/page sources were hashed before evaluation. There is no discovery or anchor-selection rerun.

One geometry implementation chooses at most three seeds without rendered scores: nearest discovered cell to the original anchor, deepest/densest cell, and geodesically farthest cell from chosen seeds. A portion contains connected cells within two graph hops, at most 13 cells. Duplicate portions are skipped without padding. Local PCA estimates orientation; ambiguous/single-cell cases deterministically use the longer grid axis, horizontal on ties. No six-cell gate remains.

Width derives from the smaller of local normal extent and local cell area divided by longitudinal extent, multiplied by .85 and adjusted for the actual seeded canonical brush spread/asymmetry. Straight contact length uses .88 of local extent minus end allowance. Only points and nominal width change; every other raw repair property, including pressure/colour/opacity/loading/body/texture seed, stays identical. There is no reference fitting or all-samples-inside veto. Actual deposited alpha crosses coarse cells in several cases. Local membership is guidance, not truth or clipping.

The declared analysis labels use canonical scale class (small/medium/large), mark alpha smaller than one discovered cell as a fine correction, and flag a large contact retaining 25% of raw alpha area as useful-area. These are diagnostics, not scoring/acceptance gates. Raw area is a relative extent comparison, not a claim that the whole raw footprint is useful. The conclusion also considers benefit, comparator harm and visual inspection, rather than deriving superiority from these labels alone.

## Outcomes and tradeoffs

| Evidence | Result |
|---|---:|
| Emitted / positive / rejected contacts | 33 / 23 / 10 |
| Regions with a positive contact | 12 / 13 |
| Positive best beats raw gain | 11 / 13 |
| Beats best refined / ordinary gain | 10 / 13 each |
| Beats best ordinary-or-refined gain | 9 / 13 |
| Medium / large / fine-labelled contacts | 30 / 3 / 0 |
| Positive large contacts | 1 / 3 |
| Positive large contacts retaining ≥25% raw alpha area | 0 |

Positive means unchanged common gain >1e-6: eligible, uncommitted paint. Rejected candidates remain hypothetical. Neither negative raw repair damage nor the following diagnostic results explain accepted V12 artifacts. V27 did not disprove region-informed planning.

Representative local contacts (native benefit/harm are separate sums in unchanged V27 units):

| Case/contact | Gain | Benefit / harm | Alpha area | Interpretation |
|---|---:|---:|---:|---|
| Beaver300 body1 / 1 |31.709|23.111 / .397|379.26|Medium; 71.4% raw area. Lower harm but less benefit/gain than raw and best ordinary/refined. |
| Rooster300 leg boundary2 / 2 |44.454|31.846 / 2.642|402.11|Medium; 78.3% raw area. Beats raw gain 44.051 and refined gain 37.083. |
| Rooster300 interior1 / 2 |12.617|12.789 / 0|1093.28|Large; a useful local improvement over ordinary gain 2.965, but only 12.0% raw area and 12.8% raw benefit. |
| Rooster300 boundary1 / 2 |-7.604|2.383 / 4.824|1239.29|Large; 26.0% raw area, rejected. Damage occurs principally inside the discovered region. |

The leg contact improves on best refinement with 6.9% more native benefit, 39.2% less harm and 24.0% more alpha area. Relative to raw it retains 80.7% benefit and cuts harm 66.6%. This is a substantive medium-scale win, not an extreme tiny-mark result. The beaver body contact retains 73.3% raw benefit with 72.5% less harm, while sacrificing common gain. That tradeoff should not be called universal superiority.

The highest-gain positive contacts retain 2–14% raw alpha area in nine regions, versus 51–78% in the small body/leg regions. Many beat a rejected raw repair while carrying more harm than the best ordinary contact; greater common gain does not imply lower damage. All alternatives' footprint, overlap, inside/outside benefit/harm, boundary/narrow-proxy damage and cost appear in the gallery. The positive large interior contact has no native harm and modest outside-region benefit, demonstrating that outside paint need not be harmful. The two broader-area large contacts both fail the common scorer. The fixed two-hop support does not establish adequate broad coverage in these larger irregular regions.

Only positive best contacts are summarised together (benefit199.39/harm53.94/alpha6305.00); even these are uncommitted diagnostic paint, not an accepted painting. Negative hypothetical harm is not aggregated as accepted damage. No class is padded to three evaluations, and controls retain their original 3 ordinary/1 raw/2 refined allowances.

## Cost, views and verification

Primary construction took 4.524ms; 33 canonical candidate evaluations took 25.065ms. There were another 33 treatment score/metric repeats and 78 control metric verification evaluations (144 evaluations overall). Full verification measurement work took 43.831ms for treatment and 297.083ms for controls; these include native diagnostics/support rastering and are not comparable to scorer-only timers. Replay/analysis, metric gathering, image rendering and verification are excluded from primary scorer timings. Historical V27 timings are reused as provenance, not a paired speed claim.

All 13 cases, 33 contacts and duplicate-portion skips are shown. Control pictures/metrics link directly to unchanged V27 evidence at identical crop coordinates. Pigment and common Neutral were inspected for the body/leg wins, the positive large interior mark and a rejected large boundary mark. Local geometry restrains the large white rectangular intrusion seen in raw repair, but does not solve colour fidelity: the leg remains a grey plane against a narrow brown reference. Neutral retains hard contact edges and ridges, especially in the white ground; better structural gain is not a demonstrated relief improvement.

The runner repeats geometry and all treatment metrics, verifies all 78 retained control metrics exactly, checks unchanged nongeometry properties, and fingerprints frozen canvas/RNG/cache/counters before/after. Focused maintained V27 checks run in memory with their output redirected only to V28: retained V12/V17/V22 decisions/RNG/cache/buffers through Continue and V12 at all depths remain exact. Representative treatment wins/losses match full-canvas raster and independent full-objective recomputation. Production/page hashes and all V27 evidence remain unchanged. No browser matrix is needed for this offline-only change. [Treatment checks](../artifacts/v28/tests.json) · [Retained checks](../artifacts/v28/retained-tests.json).

These are reused development cases, not independent generalisation evidence. Local feasibility and medium-scale merits are established here; credible broad-repair improvement is not. Stop with this constructor and evidence. No integration, detector change, colour refit, new penalty or larger portion search was added.
