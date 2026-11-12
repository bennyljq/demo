# V29 ? Right Paint: footprint-fitted colour

**Pause this candidate approach: colour correction does not resolve its weaknesses.** The single-colour fit helps existing candidates generally and produces modest improvements to medium local contacts. V28 geometry still adds useful medium alternatives, but it does not become a credible broad repair through colour fitting. Keep that distinction: neither V27 disproved region-informed planning nor do negative hypothetical raw repairs explain accepted V12 artifacts.

The exact13 reused cases are development evidence, not independent generalisation. No production integration or further mechanism was added. [Gallery](../artifacts/v29/comparison.html), [all paired metrics](../artifacts/v29/results.json), [summary](../artifacts/v29/summary.json), [declaration](../artifacts/v29/design.json).

## Fixed method and controls

Incoming Git was clean, inspected with a command-local safe.directory exception after Git's ownership check; no Git configuration, reset or commit. V28 report/implementation and recorded skips were read. All historical V27/V28 evidence/logs and canonical engine/rendering/material/scoring, Stable V12/V17 and Experimental V22 were hashed before evaluation and remain byte-identical. No production page or loading changes.

Every existing contact receives exactly one analytical fit:39 ordinary,13 raw regional,26 refined and33 V28 local,111 total. The region, anchor and all paint/geometry/texture parameters remain fixed. The fitter invokes canonical raster sampleColour over the complete actual support, without region clipping. For channel c it solves clamp(sum(w*a*(reference[c]-canvas[c]*(1-a)))/sum(w*a*a),0,255), where w=1+2*importance, reusing the inverse-compositing weighted least-squares mathematics in selective-loading.js with a single colour column. The native RGB approximation accounts for current structural canvas, exact deposition alpha and reference throughout the footprint. All inputs here are unloaded single contacts. The implementation also composes ordered alpha for compound contacts; that extension is not evidence of tested compound performance.

No new colour space, palette, geometry search or material model. Full structural patch scoring with the unchanged halo evaluates each fitted stroke; approximate native fit loss never decides acceptance. Structural compositing has no pigment modulation; material pigment/Neutral views retain seeded modulation and clamping. RGB fitting therefore does not promise matching attractive material pigment. Fit work is bounded by the canonical1,500,000-pixel patch limit, one alpha buffer and one analytical solution. Every candidate's original and fitted colour, gain, native benefit/harm, inside/outside and boundary/narrow harm, actual pixels/alpha area/overlap and costs appear in the gallery/results.

## Paired outcomes

| Class | Contacts | Gain improves | Positive original ? fitted |
|---|---:|---:|---:|
| Ordinary |39|33|34 ?33|
| Raw regional |13|13|2 ?3|
| Refined regional |26|25|6 ?6|
| V28 local |33|22|23 ?25|

Higher structural gain often remains negative. All paint is uncommitted diagnostic paint; rejected hypothetical damage is not summed as accepted painting damage. Native benefit and harm remain separate, including useful outside paint and harmful inside paint.

| Fixed scale | Contacts | Gain improves | Positive original ? fitted |
|---|---:|---:|---:|
| Small |34|28|29 ?28|
| Medium |45|34|34 ?36|
| Broad (canonical large) |32|31|2 ?3|
| Local medium subset |30|20|22 ?24|
| Local broad subset |3|2|1 ?1|

29/32 broad contacts remain rejected. The newly positive broad raw beaver300 body2 contact changes gain?.627 ?9.309, with benefit14.673/harm8.467 and alpha791.41. Its fitted refined comparator reaches15.723 at medium scale (the other broad refined contact reaches12.016); a rescued raw score does not establish broad-region completion. Both local broad contacts retaining at least25% raw area remain rejected (?7.604 ??5.710 and?13.839 ??12.402). The positive local broad interior contact stays exactly12.617, fitted RGB255/255/255, alpha1093.28 but only12% raw area. Geometry, useful coverage and current residual?not simply wrong paint colour?remain limitations of this constructor. This is evidence about fixed contacts, not identification of all planner bottlenecks.

All13 case class-best comparisons below show original best ? fitted best gain; best indices may differ. Full paired comparisons at fixed indices are in the gallery. Local beats best fitted ordinary/raw/refined in9/13 cases, versus9/13 before fitting; the advantage already existed in V28 rather than arising from a special fitting effect.

| Frozen case | Ordinary gain | Raw gain | Refined gain | Local gain | Local beats fitted competitors |
|---|---:|---:|---:|---:|---|
| beaver-300-water-1 | 4.016 ? 4.488 | -245.581 ? -87.446 | -67.583 ? -23.275 | 18.445 ? 19.177 | yes |
| beaver-300-body-1 | 34.221 ? 34.285 | 42.313 ? 43.562 | 33.217 ? 41.234 | 31.709 ? 33.695 | no |
| beaver-300-water-2 | 2.603 ? 2.770 | -918.174 ? -231.356 | -240.075 ? -43.266 | 14.351 ? 17.046 | yes |
| beaver-300-body-2 | 0.723 ? 1.102 | -0.627 ? 9.309 | 15.985 ? 15.723 | 14.414 ? 14.299 | no |
| beaver-300-boundary-1 | 2.016 ? 2.705 | -777.534 ? -348.380 | -72.086 ? -32.825 | 21.322 ? 22.673 | yes |
| beaver-300-boundary-2 | 3.571 ? 4.016 | -757.969 ? -325.381 | -75.373 ? -31.907 | 6.973 ? 13.461 | yes |
| beaver-1400-body-1 | 0.000 ? 0.000 | -52.557 ? -8.128 | -16.929 ? -2.295 | -36.426 ? -4.632 | no |
| beaver-1400-water-1 | 1.156 ? 1.129 | -932.181 ? -320.384 | -245.833 ? -70.990 | 9.255 ? 9.133 | yes |
| rooster-300-interior-1 | 2.965 ? 4.240 | -919.006 ? -666.036 | -54.531 ? -51.441 | 15.515 ? 15.515 | yes |
| rooster-300-boundary-1 | 1.259 ? 1.948 | -61.710 ? -54.885 | -4.518 ? -4.043 | 0.282 ? 0.282 | no |
| rooster-300-boundary-2 | 12.278 ? 15.840 | 44.051 ? 44.145 | 37.083 ? 44.935 | 44.454 ? 46.630 | yes |
| rooster-1400-boundary-1 | 2.346 ? 2.541 | -1122.992 ? -768.465 | -161.578 ? -121.228 | 8.114 ? 7.964 | yes |
| rooster-1400-boundary-2 | 0.021 ? -0.005 | -83.635 ? -77.197 | -6.526 ? -6.318 | 0.289 ? 0.289 | yes |

## Representative tradeoffs and image inspection

Grey leg (rooster300 boundary2, local2) changes RGB103/76/61.5 ?86.8/56.5/41.3. Gain44.454 ?46.630; native benefit31.846 ?35.131, harm2.642 ?4.280. Actual alpha402.11 remains78.3% raw area. It beats fitted raw and refined (best refined44.935), but the higher gain and browner pigment cost additional damage. The before/after pigment and Neutral crop inspection shows a darker/browner deposited plane while adjacent inherited grey planes persist; contact edges and relief remain. No special leg rule.

Beaver300 water2 local1: RGB239.1/224.3/195.5 ?203.0/184.1/154.5; gain14.351 ?17.046, benefit22.620 ?16.880 and harm13.910 ?6.868. Boundary harm13.910 ?6.451; unchanged alpha285.31. Fitting reduces damage while sacrificing useful benefit: a tradeoff, not universal dominance or broad recovery.

Beaver1400 body1 local1: RGB243.7/227.3/197.7 ?183.4/164.0/129.6; gain?36.426 ??4.632. Benefit10.855 ?2.846 and harm28.477 ?8.409; alpha300.08 unchanged. A large colour correction still fails acceptance. Rooster300 boundary1 local2 changes white to244.7/242.5/241.2 yet remains rejected; inspected pigment/Neutral show the unresolved pale contact through leg/ground structure. Beaver1400 water1 local2 changes colour slightly and reduces harm1.841 ?1.395, but gain falls9.255 ?9.133 with reduced benefit8.840 ?8.399. Native loss minimisation does not replace the full objective.

These five paired reference/pigment/Neutral strips were inspected directly. Height maps and alpha are verified identical for paired representative contacts. A better structural score is not evidence of better relief, and no aesthetic certification follows from these numerical outcomes.

## Confirmation, cost and verification

Before development gains, four unused frozen cases were selected by the first eligible distinct V12 discoveries at600 operations: two portrait, one beaver, one rooster; unchanged location policy, seed642, max128 draws per source, no treatment-score selection. All anchors, regions, ordinary/raw/refined/local candidates and discovery skips are preserved in [confirmation-cases.json](../artifacts/v29/confirmation-cases.json). There are11 discovery skips. These cases were only reconstructed/constructed; no treatment or control gains were evaluated.

The predeclared confirmation trigger required positive local improvement?10% in at least8/13 cases and a fitted local winner?5% better than the best fitted competitor in at least4. Only3 cases meet the first criterion (8 meet the second), so confirmation was not run. No additional fitting, geometry tuning or double loading was tried. The trigger is a diagnostic expansion gate, not a scoring or acceptance rule. Given weak paired local gains and continued broad failures, stop on development evidence.

Primary111 fits took114.578ms;111 additional canonical evaluations took154.589ms.111 fit repeats and222 runner verification evaluations are separate from primary timings. Two focused verification passes added100 candidate evaluations and50 independent full-score recomputations; maintained retained assertions are also outside primary work. Replay/reference analysis, footprint/native metrics, image generation and verification are excluded from these timers; single measurements are not a speed benchmark. Historical original timings are retained only as provenance.

All111 fits and measurements repeat deterministically. Every non-colour property and actual footprint/alpha statistic remains identical, with frozen canvas, material, RNG, cache and counters checked. Focused independent scoring checks cover ordinary/raw/refined/local wins and losses, compare exact full raster pixels and full-objective gains, and verify identical paired relief/coverage. A synthetic known paint is recovered from canonical compositing and RGB bounds are checked. Maintained V27 retained-planner assertions execute in memory with output redirected only to V29, covering V12/V17/V22 through Continue, V12 depths and historical replay. See [focused checks](../artifacts/v29/tests.json) and [retained checks](../artifacts/v29/retained-tests.json). No painting benchmark, broad browser matrix, archive changes or production integration.
