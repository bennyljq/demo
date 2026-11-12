# V57 - Selective charcoal blending

**Reject the V57 painting treatment.** Continuous redistribution removes a real synthetic lattice artifact, but complete drawings become smoother without improved modelling or character. Fidelity falls slightly on every checked subject and qualification takes longer. V44 stays Stable/default, V50 Baseline and the existing V54 Challenger remain available. No promotion or commit; oil and studio lifecycle are unchanged.

Review the [material study](../artifacts/v57/blend-material.jpg), [native blend decisions](../artifacts/v57/blend-decisions.jpg), [Tay progression](../artifacts/v57/tay-progression.jpg), [Mat progression](../artifacts/v57/mat-progression.jpg), [regression/second-seed finals](../artifacts/v57/regression-finals.jpg), [stage boundaries](../artifacts/v57/stage-boundaries.jpg), [matched-time finals](../artifacts/v57/matched-time.jpg) and [native final excerpts](../artifacts/v57/native-finals.jpg). JPEG sheets are compact previews. The [production gallery](../artifacts/v57/comparison.html) supplies lossless native replay, all subjects at 300/1400/2800, Tay5600, every actual transition, reference/target views and JSON recovery. [Charcoal Studies](../charcoal-studies.html) adds an on-demand exact-renderer blend study while retaining the 23 approved material cases and frozen V52/V53 galleries.

## Diagnosis

V53 exchanges charcoal at four fixed displacement pairs: `(r,0)`, `(0,r)`, `(d,d)`, `(-d,d)`, where `d=round(.707r)`. Contact support and target weights limit both endpoints. At r=6, d=4, the exchanges cannot join different parity lattices; at r=12, d=8, the disconnected spacing increases. An isolated mark develops dotted/grid residues under repeated blends. Rotation changes the input/contact, but the exchange directions stay on the pixel axes. This is transport structure, not paper pickup: nondeposit contact does not sample V52's tooth. Constant and blank inputs remain constant. Conservation alone therefore misses a material defect.

Tests cover constant tone, ramp, isolated mark, boundary, textured shading and narrow gap; 1/6/24 repetitions, 0/30/45-degree rotations and 128/256 resolutions. Impulse previews use the **same 16x density amplification** for both operators; production paintings use ordinary tones. Ramp changes near contact edges demonstrate finite-support redistribution, not new paper structure.

Eight fixed production states cover Stages 1, 3, 4 and 5. The original winning blends all improve pixel error; where reference-supported edges occur, they also improve edge agreement. Early Tay's inspected blend improves crop pixel RMS 46.20 to41.17 and edge RMS 9.22 to8.09, while removing substantial texture. Its broad-mass diagnostic changes slightly in the wrong direction, so immediate pixel gain is not synonymous with better construction. Early Mat improves pixel RMS 71.80 to65.28 and edge RMS 17.66 to16.93. These are useful corrective operations, not evidence for banning blends.

Tool width and transport are distinct: Tay's broad contacts are width48/radius7.2 both early and in a quiet late passage; a late detailed contact is width5.75/radius1. Mat's late contact is width3/radius1. Existing reference-guided geometry already permits precise blending. The lattice defect is established synthetically; these crops do **not** establish that it dominates production loss. Support crossing several structures and imperfect proposal placement remain plausible limitations. Subsequent 32-operation control spans are descriptive, not counterfactual proof of avoidable repair.

## One bounded replacement

Base: V53 proposals and V52-derived deposits, ordinary pixelwise fitting/scoring/attention, V54 gate-only progression: global 11/9/7.5/6/5.5%, regional 17/15/13/11/10%, 95th percentile and three qualifying checks. No V54 final tolerance, V55 filtering or V56 placement fits.

Let `m` be targeted contact and `q` existing charcoal. V57 uses `dq = m * (K(m*q) - q*K(m))`, with a symmetric, zero-extended separable tent `K`. Pair weights `m_i K_ij m_j` conserve quantity; their row sums are at most one, giving a convex bounded update at opacity<=1. Float32 storage and an endpoint clamp for floating-point roundoff cause negligible measured conservation drift. Blank input stays blank; targeting seals transport, support callbacks and history flags.

Tent reach starts at `sqrt(3)*oldRadius`. At the path centre, current reference coherence>.35 and original-reference cross-passage contrast>24 enable narrowing across the reference tangent. The cross factor is `clamp(24/contrast,.2,1)`; its x/y projections are serialized as two radii. **This is axis-aligned separable guidance, not a rotated tensor or per-pixel structural guard.** It can miss edges elsewhere in the tool footprint and protects oblique gaps less precisely. No canvas edge, stage number or blend quota governs protection. Incorrect sharp construction remains smoothable.

This is not exactly matched smoothing strength: product endpoint weights replace V53's minimum weights, and discrete tent moments differ, particularly at radius1. At 128 pixels after six blends, impulse spread variance is about108 versus95 for V53. On noisy shading around the correct constant tone, RMS residual falls to .00053 versus .00162; unrestricted gap centre density rises to .540 versus .524 (input .05). Known-gap guidance reduces that damage to .256, but does not perfectly preserve the light. Continuous transport is therefore not sufficient protection by itself.

Exactly the original blend slots are replaced: one in fast/balanced search, two already present in thorough search. No additional candidate or RNG draw. Deposits/lifts/erase, pressure, geometry and texture seeds remain exact. New planner57/material13/stick11 serializes the blend identity; native deposit version10 remains unchanged. Fitted contact and redistribution are reused for evaluation/acceptance, then released; uncached replay reconstructs the exact same operation. Eight linear box passes implement each tent pair with bounded patch allocation; neighbour work, allocation and fits are included in timings. No artwork blur or texture overlay.

The treatment was frozen after Tay/Mat and Mat73, before rooster/Rainier. A subsequent verification-only fix excluded zero-target-weight pixels from history/support callbacks and rejected unknown transport versions; it does not change any untargeted comparison trajectory. A memory-only verification adjustment reserves a second possible paper cache for live/replayed deposits. Freeze and corrective hashes are retained. Final timings were repeated after that fix. No regression-reference tuning or second treatment.

## Complete paintings and economy

Original RMS is a diagnostic, not an artistic score. Grain measures canvas minus G1.2 in quiet reference regions; reference-edge RMS compares G2 gradients at reliable reference structure. V50 retains its different historical material and gates, so it is a finished-quality benchmark rather than the causal control. All use the same sources, 640-pixel planning scale, balanced search, seeds and Continue budgets.

| Subject / final budget | Original RMS control / V57 / V50 | Grain control / V57 | Reference-edge RMS control / V57 / V50 |
|---|---|---|---|
| Tay42 / 5600 | 6.48 / 6.74 / 6.37 | 1.99 / 1.38 | 1.33 / 1.39 / 1.10 |
| Mat42 / 2800 | 11.15 / 11.35 / 7.33 | 4.07 / 3.57 | 2.95 / 3.11 / 1.86 |
| Mat73 / 2800 | 11.32 / 11.64 / 7.21 | 4.17 / 3.62 | 2.88 / 3.10 / 1.83 |
| Rooster42 / 2800 | 16.38 / 16.71 / 13.90 | 2.70 / 2.65 | 4.34 / 4.48 / 3.57 |
| Rainier42 / 2800 | 19.89 / 20.18 / 18.04 | 5.12 / 4.14 | 3.79 / 3.96 / 3.48 |

Tay remains recognisable, with recovered eyes, lips and hair edges, but quieter final passages become softer. Mat's modelling and likeness remain behind V50; removing regular residual texture does not create purposeful facial planes. Both Mat seeds lose. Rooster gains no convincing feather/silhouette benefit; Rainier remains poorly resolved around its light, mountain and tree structure. Final pixelwise criteria are met on both portraits by all three painters, and remain unmet on rooster/Rainier. Stage 5 does not rescue V57's character: Tay grain falls from4.90 at1400 to1.38 at5600, compared with control5.76 to1.99. More grain would not by itself solve the modelling deficit.

| Subject | S2/3/4/5 entry control | S2/3/4/5 entry V57 | Final qualification control / V57 |
|---|---|---|---|
| Tay42 | 672/800/960/1216 | 704/864/1056/1376 | 1600 / 1760 |
| Mat42 | 768/928/1216/1696 | 800/960/1248/1728 | 2208 / 2272 |
| Mat73 | 736/896/1184/1632 | 800/960/1248/1760 | 2208 / 2304 |
| Rooster42 | 384/512/832/1376 | 384/544/896/1440 | neither |
| Rainier42 | 512/608/768/1120 | 576/704/896/1280 | neither |

The gallery reports operations and blends by actual stage for all painters. V57 uses more blends on Tay, similar totals on Mat and fewer on rooster/Rainier; none establishes success. Delayed qualification and slightly worse final structure give no evidence of improved operation economy. Matched-time comparisons use each painter's full median-time representative trial and the common minimum allowance; other subjects use recorded generation times. Soft/sharp balance still favours V50's purposeful directional construction.

## Cost, preservation and recovery

Three counterbalanced complete runs per representative case include reference analysis, contact formation, filters, fits, candidate evaluation, accepted raster work, caches, GC/allocation and transitions. Evidence analysis/I/O and gallery replay are excluded. Final median seconds and full trial ranges are retained in the local records. 

| Subject / operations | Control | V57 | V50 |
|---|---:|---:|---:|
| tay / 1400 | 9.84 | 10.23 | 13.45 |
| tay / 2800 | 13.30 | 13.58 | 16.96 |
| tay / 5600 | 20.51 | 20.58 | 24.50 |
| mat / 1400 | 4.86 | 5.15 | 5.91 |
| mat / 2800 | 6.52 | 6.89 | 7.41 |

Final V57 cost is about 0.3% above control on Tay and 5.7% on Mat. Final trial ranges: Tay control19.95-21.84s, V5719.51-20.79s; Mat control6.41-6.88s, V576.60-7.07s. Host drift overlaps; do not infer a robust Tay speed difference. Filtering telemetry records eight box passes per blend fit (about116 million filter visits and1.39GB cumulative array allocation on the primary Tay run), with about1.74MB estimated largest scratch call; these are included in painting wall, not free work. Fit redistribution reuse avoids recomputing it for every candidate raster.


Reject this combined tent/guidance replacement; it proves that eliminating sparse-exchange artifacts alone does not deliver better paintings. Do not expand automatically into a full rotated/per-pixel transport search, blanket blend restraint, segmentation or perceptual scoring. [KIV-v57](KIV-v57.md) retains V56's modest gains/disproportionate fitting cost and placement diagnosis, positively reviewed V52 material, the V50 benchmark and human promotion policy. Structural-versus-tonal planning remains the next distinct deferred direction.

V56's V50 stage-use error is corrected in its report, runner, review metadata and local recovery ZIP: actual allocation derives from progression boundaries, not the clamped scheduling pass. Tay now reports 864/128/96/96/4416 operations in Stages1-5; Mat768/160/192/96/1584. Frozen artworks, entries and metrics are unchanged.

One V57 local recovery ZIP: `D:/leaf-trace/stroke-master/artifacts/v57/recovery-package.zip`; exact size and current gallery bytes are in adjacent `package-bytes.json` and `gallery-bytes.json`. About **10.84 MB compressed**, with active gallery **9.86 MB uncompressed** and selected sheets **1.35 MB**.. Fifteen single lossless accepted streams serve every prefix and transition; no duplicated prefix streams/images. Bulk diagnostics remain in ignored parent artifacts/v57-work. The ZIP is not the routine review attachment.

Checks: `node v57-check.cjs`, `node v57-browser.cjs`, `node v57-gallery-browser.cjs`, `python v57-package-check.py`. Coverage includes blank/constant/conservation/bounds/target sealing, realised gain and fit optimum, cache/full-score agreement, both seeds/all search depths, five-stage semantics, Continue, targeting/Undo, native/2x replay/export, unchanged historical oil/V44/V50/V53/V54/V55/V56 histories, the normal selector and offline galleries. The extracted package passed file hashes, core and offline gallery checks and regenerated both Tay/Mat primary1400 control/challenger prefixes exactly. Actual studio import and 2x V57 PNG export passed. Complete control/V50 streams also match frozen V56 evidence. Recovered JSON restores artwork rather than the live optimiser.

Reproduce paintings: `node v57-reproduce.cjs`; diagnostics: `node v57-blend-study.cjs`, `node v57-synthetic-evidence.cjs`, `node v57-production-diagnose.cjs`; timings: `node v57-timings.cjs` and `node v57-timings.cjs --mat`; review: `node v57-build-review.cjs`, `node v57-evidence.cjs`, `python v57-sheets.py`. Original references and frozen starting engine are included. Cold historical bulk review links require the checkout.
