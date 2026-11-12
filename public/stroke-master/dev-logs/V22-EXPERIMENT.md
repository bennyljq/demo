# V22: contour direction helps modelling; revise before adoption

**Keep V22 for manual comparison and revise before broader adoption.** Both portrait seeds have fewer horizontal cheek bands and more connected cheek/neck modelling than V21. Direction alignment does not remove abrupt contact ends, forehead facets or broad vertical neck slabs. The rooster's crown/head changes unfavourably in detail despite open thin gaps. V14 remains default pending user visual approval; no second contact-shape, boundary or material treatment was added.

[Whole-painting gallery](../artifacts/v22/comparison.html), [portable ZIP](../artifacts/v22/v22-comparison.zip), [fixed trace](../artifacts/v22/directions.html), [matched candidate examples](../artifacts/v22/candidates.html), [design](../artifacts/v22/design.json), [measurements](../artifacts/v22/measurements.json). Earlier [V20 quality evidence](../artifacts/v20/comparison.html) is preserved separately.

## What caused the directions

The existing algorithm already estimates **luminance contours**, not downhill directions: its tensor angle includes pi/2. However, it uses a fine reference scale and suppresses the field below tensor energy9; weak-gradient contacts use a decorative fallback direction. A high native confidence can also differ from the contact-scale colour transition. Rotating all paths by90degrees would reverse useful existing behaviour.

Before treatment, we traced the first accepted nonempty Flat/Filbert contact in each of three fixed cheek/neck regions, three operation windows (0-700,700-1400,1400-2100) and seeds42/73: **18 contacts**, without favourable-angle selection. We observed initial construction, coherent fitting, final actual-support validation and canonical footprint, while asserting both full V21 records stayed exact. Twelve anchors have zero existing field confidence. Only two meet the conservative contact-scale RGB confidence gates, both seed42; their initial contour errors are75.0degrees (cheek) and62.4degrees (neck). Fitting changes the sampled direction discrepancies by at most2.15degrees. It narrows/trims but does not repair those orientations.

Other samples align well or have genuinely ambiguous contact-scale gradients. The overlays also show Flat end faces and overlapping footprint edges that can look like whiskers even when the centre path follows contours. Thus fallback/scale mismatch contributes, but the image effect cannot be attributed entirely to direction. The treatment targets the demonstrated reliable mismatches only; it makes no anatomy or jaw-order inference.

Four matched counterfactual examples take the first proposed contour sibling in each fixed cheek/neck region on the unchanged seed42 control trajectory, plus the first gradient sibling. Initial anchor, width, brush and material parameters match their ordinary sibling. Shared fitting and fresh support checks apply. Neck ordinary/contour gains are56.90/94.98; gradient3.93/4.16. The right-cheek example aligns but loses1.99/1.82, and the left-cheek example has no eligible loaded fit. These examples explain placement and limits, not painting acceptance or a direction bonus.

## One selective geometry extension

V22 preserves all three ordinary candidates and RNG draws. At most one additional Flat/Filbert sibling changes points only, using the original proposal anchor, comparable initial width and all original brush/material/target/seed parameters. It reuses existing blurred RGB references, canonical tracing, cubic construction, coherent fitting and final actual-support validation. The new path cannot reuse its sibling's support result. A small optional callback extends the shared constructors; default V14/V17/V20/V21 paths remain exact. There is one canonical renderer and fitter.

The local RGB tensor uses nine positions over a radius of width/4, selecting the nearest existing blur scale. Three-channel gradients estimate an undirected contour; thresholds fixed before painting review require mean gradient energy>.25, sqrt(energy)*width>=8, tensor coherence>.75 and signed-gradient consistency>.6. Initial width must reach4, native importance<=.35, and mismatch from the original path must exceed15degrees. Flat/noisy/conflicting fields offer no alternative. RGB handles isoluminant transitions, but these encoded-sRGB thresholds are not a perceptual colour model; discrete existing blur scales and sharpness gating can miss legitimate transitions.

Local contour signs are aligned with the previous tangent before the existing .6/.4 blend, avoiding reversals. Tracing stops when confidence becomes unstable and retains the existing stage colour-distance/boundary stop. Existing fitting may further shorten or narrow. There is no broader width search, path bonus, quota, clipping or scheduling change.

The **V21 loading screen/fitter remains byte-for-byte unchanged**. Its one selected contact/two softness fits compete across all four geometries; each also retains a single-colour form. Balance.5, softness.8/2, variation0, endpoint/alpha/conditioning guards and16384-pixel fitting-patch cap remain. Actual canonical footprint/halo objective and .000001 acceptance threshold decide selection. Foundation, attention, scheduling, boundary tolerance, material2, document4, oil-library-3.0, loading1/srgb, relief and export rendering are fixed. Planner22 provenance is added; quiet body stays.25.

## Complete comparisons and cost

The working references/settings/budgets exactly reuse V21: supplied tay-gradient.jpg at512x640, Fine/Balanced/default brushes, seeds42/73,1400/5600 then +700/+2800; construction300, established early1800 and final2100. Rooster uses its established curated brushes and historical quiet body.65 at the same schedule. Smooth gradient and blue/ochre use360/1440, construction90/early180. Every pair has identical inputs and accepted-operation budgets. Crops include cheeks, neck, forehead, eyes/mouth, hair boundary, crown, feet and gaps. Pigment/Neutral and native/1024x1280 canonical portrait replay have equal display sizes. V20's earlier gallery is retained without copying another application or its images locally.

| Case/planner | Ops | Step s | Total generation s | Eligible loading contacts | Loaded eval/accepted | Contour proposed/survived/loaded/wins |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| portrait / v21 | 2100 | 9.202 | 9.517 | 372 | 410/145 | 0 |
| portrait / v22 | 2100 | 9.869 | 10.135 | 429 | 469/167 | 133/133/60/67 |
| portrait73 / v22 | 2100 | 9.666 | 9.861 | 426 | 470/164 | 113/113/58/52 |
| portrait73 / v21 | 2100 | 9.303 | 9.506 | 346 | 380/142 | 0 |
| gradient / v21 | 360 | 0.773 | 0.798 | 35 | 22/13 | 0 |
| gradient / v22 | 360 | 0.800 | 0.815 | 42 | 24/13 | 21/21/13/10 |
| rooster / v21 | 2100 | 5.207 | 5.525 | 83 | 108/32 | 0 |
| rooster / v22 | 2100 | 5.289 | 5.565 | 84 | 108/36 | 17/17/1/4 |
| contrast / v21 | 360 | 0.714 | 0.743 | 7 | 4/1 | 0 |
| contrast / v22 | 360 | 0.731 | 0.757 | 7 | 4/1 | 0/0/0/0 |

Contour loaded counts mean contacts that receive at least one surviving loaded alternative, not all attempted endpoint fits; weak endpoint fits can produce no alternative. Of contour wins,39/67 are loaded for seed42,36/52 for seed73,8/10 for gradient and0/4 for rooster. All proposals in these runs survive fitting, with134/116 support calls for133/113 portrait alternatives. Validation remains a real check, not inherited approval.

| V22 case | Direction / construction / fitting / validation / single-colour evaluation ms | V21 loading screen / fit / loaded evaluation ms |
| --- | ---: | ---: |
| portrait | 5.9 / 45.3 / 4.3 / 57.9 / 97.8 | 210.3 / 211.3 / 477.3 |
| portrait73 | 2.8 / 44.3 / 3.3 / 66.7 / 109.4 | 194.1 / 231.9 / 515.6 |
| gradient | 0.5 / 7.4 / 0.5 / 8.1 / 12.6 | 26.1 / 12.2 / 16.8 |
| rooster | 1.1 / 39.9 / 0.5 / 5.4 / 9.3 | 101.5 / 21.8 / 55.2 |
| contrast | 0.3 / 7.2 / 0.0 / 0.0 / 0.0 | 21.1 / 2.4 / 2.8 |

Construction includes the three small initial-contact clones needed to preserve ordinary inputs, plus new path construction. Direction timing includes callback analysis along the path. Loading evaluation is reported separately, avoiding double counting with the extra single-colour evaluation timer. Total step work includes these and the changed downstream ordinary trajectory; not all differences are attributable to direction. Initial reference/session analysis is separately available in measurements.json, and total generation includes it and continuation bookkeeping but excludes snapshots/replay/export. No persistent image-sized direction cache or lower-memory claim is introduced.

The pairs were measured without concurrent tests, with seed73 reversing planner order. These are single local observations per seed, not general speed estimates. Portrait step work increases7.2%/3.9%. Additional direction work is modest, but extra validation/evaluation and the changed painting trajectory still cost time.

Approximately matched work uses nearest accepted-operation prefixes of the unchanged complete schedules. Seed42: V21 **2100 /9202.353ms**, V22 **1661 /9202.630ms**. Seed73: V21 **2100 /9302.768ms**, V22 **1857 /9303.390ms**. No production time-stopping rule or replacement ratio is claimed. Both work comparisons retain the cheek tonal benefit, while remaining facets/end faces are visible. Replay/PNG timings are separately reported, not hidden in generation work.

## Visual findings and decision

At construction300, changed paths already build larger connected cheek planes. At1800/2100, both seeds show fewer repeated horizontal whisker bands on the left cheek and more coherent cheek/neck masses. The matched-work comparisons retain that gain. The neck can replace several diagonal strokes with a broad **vertical slab**, so improved orientation is not synonymous with natural modelling. Forehead, chin and nostril facets, abrupt rectangular/tapered ends and angular overlap remain conspicuous. Pigment stays painterly rather than excessively smooth; Neutral and enlarged replay expose fibres/relief ridges, which are separate unresolved material/export issues.

Eyes and lips remain recognizable; the seed42 eye/iris separation is clearer in places. Both seeds still have dark eye masses and angular nose/mouth boundaries, with some individual highlights changing. Hair boundaries remain readable but do not become uniformly cleaner. The treatment is a useful tonal direction experiment, not a solved facial-detail policy.

Rooster crown/feet/gap crops remain necessary because trajectories diverge. Feet and the raised-leg/body white gap remain open, but the crown becomes a different, jagged red construction with stronger dark head planes and altered comb gaps/eye accent. This is an unresolved feature/outline concern despite unchanged actual-support policy. Existing pale/coarse boundary artifacts are not fixed. Blue/ochre offers zero contour candidates and **exactly unchanged strokes and canonical buffers**. The controlled gradient improves its tonal fit without establishing universal artistic benefit.

Final structural objective decreases11.5%/11.7% on the portrait,22.5% on gradient and3.3% on rooster; blue/ochre is unchanged. These numbers and the alignment/win counts do not override the specific visual limits. **Revise before adoption; retain the manual comparison, keep V14 default.** No further contact-shape, longitudinal, scheduling, outline or material mechanism was implemented after reviewing these results.

## Verification, archive and maintenance

Incoming Git was clean, current instructions/docs/report/KIV and real code were read, and no applicable AGENTS file was found. All existing archives passed CRC and recorded control hashes before creating the necessary incoming V21 engine/shared-helper/loading snapshot. archives/v22-control.zip verifies each source hash; v22-control.cjs runs it outside the app. The historical V17 baseline loader now retrieves its exact retained V14 bytes from that verified snapshot when the live shared constructor changes; old archives contain an earlier different V14 helper. No reset, commit or broad cleanup occurred.

Five reused V17 engine groups, three V19 loading groups, seven maintained planner groups and six direction checks pass. Direction tests cover isoluminant RGB gradients, sign consistency, identical ordinary candidates/RNG, flat exact fallback, fresh support validation and the shared loading cap. Both full V22 portrait records repeat exactly and match source-free material replay; all five V21 controls match existing full records. Timeline/native/2x replay, invalid V19 boundary rejection, loading metadata, Continue/target/feather/cancel/Undo and historical controls remain covered. **41 real Chrome checks** pass across five choices, session binding, Resume/targeted cancellation/Undo, historical imports and actual JSON/full/current-frame2x exports.

Gallery views and the extracted portable package are checked in Chrome with CRC/exact entry hashes. Whole images supply crops; reused control frames/records are referenced and identical generated files share one copy. User assets, historical dev-logs and unique evidence remain. Capped diagnostic/review scripts are hash/CRC archived before active removal; no permanent trace hooks or abandoned direction variant remains. Current README/HANDOFF/KIV record the experimental state and unresolved limits.
