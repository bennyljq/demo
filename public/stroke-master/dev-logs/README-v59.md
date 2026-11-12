# V59 — charcoal construction without blending

V59 is implemented as a separate experimental selection. Exact frozen **V58 Benchmark** is exposed in response to human review, particularly Tay5600; **V44 stays default**, with V50 Baseline and V54 Challenger preserved. No promotion or commit. V59 improves removal-only construction but does **not** match V58's finished modelling: quiet skin and hair retain faceted overlapping contact edges. This is a useful limitation study, not a claim that zero blending is artistically superior.

[Cold native V50 reference](../artifacts/v59/v50-reference.html) | [Native progression, stage artwork, matched wall and decisions](../artifacts/v59/comparison.html) · [Tay progression](../artifacts/v59/tay-progression.jpg) · [Mat progression](../artifacts/v59/mat-progression.jpg) · [Held-out finals](../artifacts/v59/regression-finals.jpg) · [Native excerpts](../artifacts/v59/native-finals.jpg) · [Stage transitions](../artifacts/v59/stage-boundaries.jpg) · [Matched-time finals](../artifacts/v59/matched-time.jpg) · [Construction decisions](../artifacts/v59/construction-decisions.jpg) · [Recovery ZIP](../artifacts/v59/recovery-package.zip) · [KIV](KIV-v59.md).

The causal control suppresses blend slots before construction/fitting, consuming their original single RNG draw. All remaining definitions, seeds, guidance, scalar fitting, pixelwise acceptance, caches and gates are exactly V58. Fast/balanced/thorough generate **2/6/10** control candidates; disabled blends cost no fitting, ranking or accepted operations. The control is reproducible with planner charcoal59 and charcoal59Mode removal; it is absent from the normal selector.

Development on Tay42/Mat42 showed coherent broad masses beneath excessive broken contact. At 1400, removal-only current-target pixel / coarse-mass / grain RMS are Tay **35.19 / 8.62 / 23.02**, Mat **30.13 / 6.95 / 16.83**. Both remain in Stage 1. The existing fit already optimises scalar quantity under pixelwise error, while pressure determines nonlinear contact continuity before that fit. Scalar optimality does not establish artistically appropriate loading: at Tay1399 the steadier candidate reduces grain but worsens local broad-mass error. Contact geometry and the unchanged objective both constrain its usefulness; indiscriminately reducing all doses is not an evidenced remedy. Local single-operation comparisons below separate tonal mass, grain and reliable reference edges; original V58 blends can legitimately quiet contact without improving every structure. Counts alone do not identify waste.

One bounded improvement occupies only freed slots: ordinary V58 tonal-guided shade/deposit or lift, with physical pressures **[.95, 1, .95]**, breakup **.12** and load bias **0**, followed by the original single dose fit. More continuous pickup can carry a lower fitted quantity, constructing quieter values through overlap. Lift/erase remain subtractive; their existing pressure-independent masks are preserved. Original nonblend slots and RNG streams remain exact. Search ceilings stay **3/7/12**, one contact per proposal and accepted operation. There is no new material, diffusion, compound hidden stroke, postprocess, objective, quota or forced hatching. A local target whose guided support misses the circle uses the original nonblend fallback.

Alternatives rejected for this brief: deposit-only construction, reducing every dose, forcing narrow outlines/hatching, scoring texture energy, relaxing stalled gates, filtered scoring and extra placement fits. The chosen contact correction was frozen after the two development finals and before rooster42, Rainier42 and Mat73 (hashes in recovery freeze.json). No subsequent tuning.

| Shared state / candidate | Operation / fitted dose | Local mass RMS Δ | Local grain RMS Δ | Local reference-edge RMS Δ |
|---|---|---|---|---|
| tay1399 / v58 best blend | blend / 1.000 | 0.00 | -0.44 | -0.66 |
| tay1399 / removal best lift | lift / 0.048 | 0.87 | -0.15 | -0.07 |
| tay1399 / v59 best deposit | deposit / 0.303 | 1.86 | -1.24 | -0.44 |
| mat1399 / v58 best blend | blend / 1.000 | -0.00 | -2.00 | -0.01 |
| mat1399 / removal best deposit | deposit / 1.000 | -0.38 | -0.07 | -0.00 |
| mat1399 / v59 best deposit | deposit / 0.882 | -1.12 | -1.50 | -0.01 |

Negative deltas indicate lower diagnostic error/energy, not artistic preference. Native before/after crops and all fitted competing proposals are in the review. These local changes do not establish a whole-trajectory win.

All five reference targets and gates remain unchanged: global **11/9/7.5/6/5.5%**, regional **17/15/13/11/10%**, 95th-percentile regional coverage, three qualifying checks with accepted-operation evidence. V50 keeps its historical targets/material and original strict early gates. No stage advances because its budget expires. Reports show actual boundary use, including the departing-stage operation at a boundary. A final criterion is a numerical gate, not an artistic verdict. At Mat42/2800, V59 is just below the limits (current 5.49% global / 7.98% regional) but has not completed three qualifying accepted-evidence checks; this is not a demonstrated unattainable final gate. Rooster (6.19 / 11.22%) and Rainier (8.70 / 11.21%) remain above the unchanged final limits. Removal-only Tay remains over its Stage 2 global limit (9.41 versus 9%); Mat has one qualifying Stage 2 check at its final boundary. These residuals and their visible contact texture are retained, not bypassed.

| Case | Model | Entry to S2 / S3 / S4 / S5 | Final qualification | Blends by S1–S5 |
|---|---|---|---|---|
| tay42 | v58 | 640 / 768 / 960 / 1184 | 1536 | 331 / 75 / 78 / 102 / 1358 |
| tay42 | removal | 3040 / — / — / — | unmet | 0 / 0 / 0 / 0 / 0 |
| tay42 | v59 | 640 / 1024 / 1632 / 3136 | 5184 | 0 / 0 / 0 / 0 / 0 |
| tay42 | v50 | 864 / 992 / 1088 / 1184 | 1280 | 348 / 12 / 1 / 0 / 467 |
| mat42 | v58 | 768 / 928 / 1216 / 1664 | 2144 | 299 / 61 / 95 / 145 / 394 |
| mat42 | removal | 1760 / — / — / — | unmet | 0 / 0 / 0 / 0 / 0 |
| mat42 | v59 | 576 / 800 / 1184 / 1984 | unmet | 0 / 0 / 0 / 0 / 0 |
| mat42 | v50 | 768 / 928 / 1120 / 1216 | 1312 | 249 / 4 / 2 / 0 / 34 |
| mat73 | v58 | 768 / 960 / 1216 / 1664 | 2144 | 284 / 89 / 72 / 157 / 396 |
| mat73 | removal | 1696 / 2720 / — / — | unmet | 0 / 0 / 0 / 0 / 0 |
| mat73 | v59 | 544 / 768 / 1152 / 1888 | 2784 | 0 / 0 / 0 / 0 / 0 |
| mat73 | v50 | 768 / 928 / 1120 / 1248 | 1344 | 252 / 9 / 4 / 0 / 42 |
| rooster42 | v58 | 384 / 512 / 800 / 1248 | unmet | 148 / 29 / 55 / 99 / 249 |
| rooster42 | removal | 640 / 1152 / 2176 / — | unmet | 0 / 0 / 0 / 0 / 0 |
| rooster42 | v59 | 288 / 416 / 736 / 1280 | unmet | 0 / 0 / 0 / 0 / 0 |
| rooster42 | v50 | 640 / 928 / 1184 / 1376 | unmet | 218 / 26 / 3 / 0 / 11 |
| rainier42 | v58 | 512 / 608 / 768 / 1088 | unmet | 252 / 49 / 70 / 98 / 220 |
| rainier42 | removal | 2048 / — / — / — | unmet | 0 / 0 / 0 / 0 / 0 |
| rainier42 | v59 | 448 / 672 / 1056 / 2176 | unmet | 0 / 0 / 0 / 0 / 0 |
| rainier42 | v50 | 608 / 736 / 896 / 1056 | unmet | 236 / 7 / 3 / 0 / 2 |

The three-way native review exposes deposit, lift, erase and blend counts **by actual stage** for every current model/case; complete work and V50 stage mixes are retained in review-summary.json in recovery. V59 and removal have zero blend operations throughout. Qualification images and 300/1400/2800 plus Tay5600 are replayed from a single accepted stream per painting; 15 current streams plus five cold V50 streams in its separate reference page, with no duplicated prefix streams.

| Case / accepted budget | Model | Original RMS | Reference-edge RMS | Grain RMS | Stage / qualified |
|---|---|---|---|---|---|
| tay42 / 5600 | v58 | 6.06 | 1.17 | 2.04 | S5 / yes |
| tay42 / 5600 | removal | 26.91 | 4.87 | 17.15 | S2 / no |
| tay42 / 5600 | v59 | 13.58 | 2.26 | 7.93 | S5 / yes |
| tay42 / 5600 | v50 | 6.37 | 1.10 | 2.62 | S5 / yes |
| mat42 / 2800 | v58 | 10.94 | 2.75 | 4.18 | S5 / yes |
| mat42 / 2800 | removal | 28.39 | 7.71 | 12.10 | S2 / no |
| mat42 / 2800 | v59 | 13.99 | 2.81 | 6.00 | S5 / no |
| mat42 / 2800 | v50 | 7.33 | 1.86 | 1.60 | S5 / yes |
| mat73 / 2800 | v58 | 10.87 | 2.70 | 4.17 | S5 / yes |
| mat73 / 2800 | removal | 27.66 | 7.51 | 11.72 | S3 / no |
| mat73 / 2800 | v59 | 13.75 | 2.75 | 5.88 | S5 / yes |
| mat73 / 2800 | v50 | 7.21 | 1.83 | 1.48 | S5 / yes |
| rooster42 / 2800 | v58 | 15.27 | 3.76 | 2.82 | S5 / no |
| rooster42 / 2800 | removal | 26.72 | 8.60 | 5.85 | S4 / no |
| rooster42 / 2800 | v59 | 15.78 | 3.70 | 3.38 | S5 / no |
| rooster42 / 2800 | v50 | 13.90 | 3.57 | 1.62 | S5 / no |
| rainier42 / 2800 | v58 | 19.53 | 3.59 | 5.45 | S5 / no |
| rainier42 / 2800 | removal | 35.10 | 6.88 | 16.70 | S2 / no |
| rainier42 / 2800 | v59 | 22.19 | 4.18 | 8.19 | S5 / no |
| rainier42 / 2800 | v50 | 18.04 | 3.48 | 2.99 | S5 / no |

Removal-only makes recognisable coarse masses but leaves uncontrolled speckle and weak modelling. V59 recovers likeness, silhouette and light, with useful long defining strokes and sharper features; early advances are consequently legitimate. Nevertheless its tonal planes remain polygonal and uneven. Tay's brow, nose, cheek and hair show competing contact edges at 5600; Mat's forehead/cheek and violin shoulder stay fragmented. Rainier repeats this across cloud and mountain planes. Rooster is closer to V58, but quiet background/body passages are less restrained. V50 remains a strong finished-quality reference. Stage 5 reduces V59 grain (Tay ~8.87 at entry to 7.93 at 5600), but does not erase the conspicuous patchwork; adding texture tolerance would not cure this demonstrated failure.

V59's earlier construction is markedly more useful than removal alone, but late correction consumes considerable accepted work: Tay enters S5 at 3136 and qualifies at 5184 versus V58's 1184/1536. Surviving marks do not consistently support form. Zero blends and higher texture energy are not an economy or character win. No claim is made that every V58 blend is needed; restoring a carefully limited blend in a future version is justified as a hypothesis for quiet contact discontinuities, with reference-supported structure protected. V59 never restores it.

| Case | Model | 1400 wall s | Final wall s | Three final runs, sorted s |
|---|---|---|---|---|
| tay | v58 | 9.45 | 18.05 | 17.59 / 18.05 / 19.94 |
| tay | removal | 8.49 | 25.41 | 23.73 / 25.41 / 25.64 |
| tay | v59 | 7.93 | 17.00 | 16.77 / 17.00 / 17.60 |
| tay | v50 | 13.73 | 24.85 | 24.40 / 24.85 / 24.88 |
| mat | v58 | 4.83 | 6.33 | 6.14 / 6.33 / 6.57 |
| mat | removal | 4.26 | 6.78 | 6.40 / 6.78 / 6.83 |
| mat | v59 | 3.88 | 5.28 | 5.20 / 5.28 / 5.39 |
| mat | v50 | 6.29 | 7.82 | 7.78 / 7.82 / 7.83 |

Three sequential counterbalanced complete runs per development case/model (24 trajectories), balanced depth, same prepared PNGs and seed. Wall includes source preparation/session analysis, guidance, fitting, candidate ranking, raster/cache work, rejected proposals, Continue and stage transitions. Evidence Gaussian analysis, PNG writing, review replay/export and browser playback are excluded. Median **whole-run timing vectors** determine matched views; individual checkpoints are not independently cherry-picked. Held-out times are single-run evidence, not repeated performance estimates.

| Case / final wall allowance | V58 ops | Removal ops | V59 ops | V50 ops |
|---|---|---|---|---|
| tay / 17.00 s | 5124 | 3135 | 5600 | 2688 |
| mat / 5.28 s | 1752 | 1886 | 2800 | 881 |

| Case | Model | Anchor proposals | Candidates / single contacts | Fit pixels | Contact sample visits | Nested fit s | Nested planning s |
|---|---|---|---|---|---|---|---|
| tay | v58 | 5600 | 39200 | 21011083 | 227411508 | 13.31 | 13.74 |
| tay | removal | 5602 | 33612 | 30853428 | 339156601 | 20.88 | 21.31 |
| tay | v59 | 5600 | 39200 | 20111839 | 201012262 | 13.02 | 13.53 |
| tay | v50 | 5600 | 39200 | 0 | 0 | 0.00 | 0.00 |
| mat | v58 | 2800 | 19600 | 5941956 | 65531193 | 4.29 | 4.59 |
| mat | removal | 2800 | 16800 | 6914993 | 76518071 | 4.82 | 5.03 |
| mat | v59 | 2800 | 19600 | 5013567 | 50976143 | 3.35 | 3.58 |
| mat | v50 | 2800 | 19600 | 0 | 0 | 0.00 | 0.00 |

Fit time is nested in planning time, and both are already inside total wall; do not sum them. Native sample visits include geometry and raster contact work. V50 uses its historical raster/fit path, so V53-specific fields are unavailable (zero in this table means unavailable). Every operation is a single contact. V59 is cheaper per complete trajectory than removal and can be slightly cheaper than V58, but its final quality is weaker; compute savings do not establish equivalent artistic efficiency. Original-reference RMS, coarse mass, grain, edge and light diagnostics remain evidence, not promotion scores. Coarse diagnostics compare Gσ(canvas) directly with the existing Gσ(reference) target; they never filter the material or alter scoring.

Reproduce from this checkout or extracted ZIP: node v59-reproduce.cjs; node v59-diagnosis.cjs; node v59-timings.cjs (and --mat); node v59-build-review.cjs; node v59-evidence.cjs; python v59-sheets.py. Source PNGs are the established prepared references in artifacts/v53/sources.js. Frozen pre-V59 code lives in recovery-v59/frozen in the ZIP (ignored work/frozen in the checkout). Accepted-stream JSON export supports source-free native/2× replay; it does not restore the live optimiser. Exact source regeneration is verified separately.

Checks: node v59-check.cjs (historical generation/Continue including V58; seeds42/73, all depths/stages; exact removal slots/RNG and retained construction slots; monotone pure material addition/removal; realised optimal fits; cached/uncached raster and full/tile scores; target clipping/Undo; native/2× JSON replay; blend-document rejection), node v59-browser.cjs (actual V59 Paint/Continue/targeting, live editable gates, Undo, export/import, oil/V44/V50 lifecycle and exact frozen V58 Benchmark Paint), node v59-gallery-browser.cjs (offline native crops/accepted sequences/prefixes/matched views and frozen materials), node v59-recovery-check.cjs (six original-source 1400 prefixes), python v59-package-check.py (extracted hashes/core/gallery/regeneration). JPEG sheets are compact, reduced previews; native replay is lossless. Active gallery is approximately 10.18 MB (9.71 MiB) uncompressed, itemised in gallery-bytes.json; the five cold V50 benchmark streams are separately included in the ZIP; bulk diagnostics stay ignored outside Git. Frozen V52/V53 examples and archived V58 decisions remain available.
