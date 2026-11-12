# V32 - Crossover: graded construction

**Recommendation: retain V32 as an opt-in experiment for manual review; keep V31 the default.** Two colours help some later cheek/neck transitions and preserve construction masses. Early portrait modelling remains mixed, and abrupt ends/relief ridges persist. The improvement does not establish a generally better painter at the extra measured cost. No compensating mechanism was added.

[Self-contained gallery](../artifacts/v32/comparison.html) | [Declared design](../artifacts/v32/design.json) | [Measurements](../artifacts/v32/measurements.json) | [Cost/support summary](../artifacts/v32/summary.json) | [Mechanism sample](../artifacts/v32/mechanism.json).

## One treatment and preserved control

V32 retains V31 foundation, independent Shapes-scale attention, baseline anchors/candidates, ordinary V12 Shapes/pass1 donor geometry and keyed randomness, brush selection, pressure/taper/opacity/material, scoring, acceptance and scheduling. After scoring the uniform donor, it invokes the unchanged shared SelectiveLoading screen/fitter on that donor alone. Only eligible Flat/Filbert contacts can enter; no rotation or reshaping makes a contact eligible. The uniform donor remains a competing option, with earlier candidates retaining ties.

Each opportunity permits one screened donor, at most the existing two fits (softness .8/2) and two extra full canonical evaluations. Existing actual-contact least squares uses the **current structural canvas**, bounded sRGB endpoints, zero variation, existing correction/coherence/conditioning guards and 16,384-pixel patch cap. Loaded variants change only colour/loading metadata; exact geometry, alpha, height and seeded texture remain. Canonical scoring includes the entire footprint and halo. Baseline loading is invoked separately with its original contact opportunity and counters. `donorLoadingWork` records donor screening, eligibility, fits, samples, evaluations, improvement over uniform, nonpositive/positive-losing results, wins and measured screen/fit/evaluation cost. `crossoverWork` counts accepted uniform and loaded donor contacts; its evaluated count remains uniform donor opportunities. No renderer/fitter copy or permanent UI control was added.

Incoming Git revision and SHA256 file hashes were recorded before edits, with a clean working tree. `v32-control.cjs` restores the incoming engine and dependencies in memory. All six fresh V31 controls exactly match saved initial and final V31 stroke sequences. Standalone V22 generation is retired from the selector and current createSession; its shared candidates/loading remain. Verified restoration generates V22 with its recorded provenance and exactly matches the earlier independent restoration engine. Source-free historical V22 replay remains available. V12/V17 are Stable, V30/V31/V32 Experimental, V31 default by explicit user preference. No reset or commit.

## Small mechanism check before full paintings

A fixed 72-contact sample used24 proposal keys per source, seed42, after300 V31 operations, without accepting contacts during the sample. It was not chosen for attractive outcomes. Three contacts passed the screen and produced positive loaded improvements over uniform;69 safely produced no loaded alternative. This showed a selective but active treatment, so safeguards stayed unchanged. Three useful counterfactual improvements are not claims of wins against every baseline candidate. End-to-end evaluation below includes actual competition losses.

Every fitted pair retained all non-colour fields and exact deposited coverage/height. Re-fitting against a changed current canvas changed endpoints. Canonical patch gain agreed with independent full-canvas raster/objective including halo. Additional fixed target contacts were checked; a separate lateral-gradient fixture guarantees two actual fits cross nonzero target feather, preserve alpha/height and alter no outside pixels. No V27-V29 regional diagnostic programme was restarted.

## Fixed end-to-end comparison

Beaver512x640, Rooster632x461, tay-gradient512x640; seeds42/73; Balanced detail/search, default brushes, quiet body .25. Early300; initial1,400/5,600 proposals; Continue+7,000/+28,000. Pair order alternates. **All12 paintings reached1,400 and8,400 operations**, stopping at Stroke budget reached; no allowances increased.

All timings are fresh actual step work, including screening, fitting, scoring, attention and accepted-support telemetry. Reference analysis, replay, image export and verification are excluded. Single paired observations are not repeated speed estimates. Values are V31 / V32; final time includes initial and Continue.

|Case|Initial seconds|Final seconds|Initial evaluations|Final evaluations|Final proposals|
|---|---:|---:|---:|---:|---:|
|beaver42|6.352 / 6.639|21.551 / 22.653|5642 / 5746|34378 / 34995|8586 / 8631|
|beaver73|6.598 / 6.873|21.879 / 23.221|5654 / 5724|34438 / 34867|8600 / 8601|
|rooster42|5.498 / 5.573|20.121 / 21.380|5719 / 5770|35463 / 35716|8848 / 8835|
|rooster73|5.293 / 5.636|19.767 / 21.041|5734 / 5780|35446 / 35749|8845 / 8858|
|portrait42|9.736 / 11.024|31.278 / 39.110|6159 / 6675|40159 / 44467|9917 / 10223|
|portrait73|10.162 / 11.125|32.256 / 39.036|6210 / 6614|40686 / 44281|10054 / 10152|

Initial time changes: +4.5%, +4.2%, +1.4%, +6.5%, +13.2%, +9.5%. Final: +5.1%, +6.1%, +6.3%, +6.4%, +25.0%, +21.0%. Final evaluation counts rise about0.7-1.8% on Beaver/Rooster and8.8-10.7% on portrait. Structural error changes are in the summary: portrait final falls11.4-16.7%, while other changes are small/mixed; this is fidelity evidence, not artistic success.

|Case|Eligible initial / final|Fits initial / final|Extra evaluations initial / final|Loaded donor wins initial / final|Measured loading seconds initial / final|
|---|---:|---:|---:|---:|---:|
|beaver42|45 / 225|90 / 450|80 / 421|33 / 120|0.216 / 1.123|
|beaver73|35 / 219|70 / 438|68 / 411|26 / 113|0.199 / 1.131|
|rooster42|19 / 154|38 / 308|35 / 289|11 / 42|0.125 / 0.968|
|rooster73|21 / 136|42 / 272|40 / 257|12 / 34|0.131 / 0.882|
|portrait42|241 / 1758|482 / 3516|436 / 3060|121 / 291|0.761 / 5.731|
|portrait73|265 / 1829|530 / 3658|466 / 3173|145 / 330|0.796 / 5.870|

Final eligibility is2.6% on Beaver,1.5-1.7% on Rooster and17.2-18.0% on portrait. Final donor loaded wins are120/113,42/34 and291/330 respectively. On portrait42,3,060 extra evaluations produce2,348 nonpositive results,421 positive losses and291 wins; portrait73 has2,382 nonpositive,461 positive losses and330 wins. Weak fits are discarded (456/485 portrait). A variant can improve a negative uniform gain and still remain nonpositive. Baseline loaded acceptances remain independently recorded: V31/V32 final16/13 and12/11 Beaver,19/22 and23/17 Rooster,107/115 and105/120 portrait. These changed totals reflect changed trajectories; disabled-loading tests verify the original opportunity exactly.

Portrait donor loading costs5.73/5.87s, including roughly1.39/1.38s screen,1.40/1.46s fit and2.94/3.04s evaluation. Total final excess7.83/6.78s also includes changed trajectory work; it is not solely loading overhead. All support distributions use actual deposited pixels with alpha>.08 and alpha area, not nominal requested width. The shared fitter rasterises actual support once and reuses its samples for both endpoint fits; full scorer evaluations remain canonical.

## Visual reading

Gallery shows initial/final equal accepted operations and nearest accepted prefixes at the smaller paired measured time, plus300 early, full frames, unchanged fixed crops, pigment and common Neutral. Images are canonical replays; no final blur. Native-dimension WebP previews compress presentation only; exact PNG/JSON remain beside the compact self-contained gallery. Historical V22/V12 seed42 initial context is canonically replayed from established matched records, without historical planner reruns or a causal claim about V12 blocking.

- **Beaver42:** early orange body contacts connect more broadly; the initial body retains V31's mass with different log facets. The final body/log arrangement remains clear. Small pigment continuity gains survive approximately equal work; contact seams remain visible under Neutral.
- **Beaver73:** initial body planes and log silhouette are preserved, with modest redistribution of light/orange patches. Final differences are small: some connected planes, some changed patch boundaries. There is no consistent whole-scene superiority or fixed-count coverage claim.
- **Rooster42:** broad body/tail colour blocking remains coherent. Tail contacts can look more filled, with some smaller feather distinctions changed. Feet/crown are preserved, including imperfect thin foot edges; no clear net improvement in early boundaries.
- **Rooster73:** neck/body patches rearrange more than they blend; large golden contacts and abrupt tips persist. Feet and crown remain readable. Later refinement develops both versions productively, with small differences at equal work; no general boundary improvement.
- **Portrait42:** broader cheek planes and later cheek/neck tonal connection improve some internal steps, including some benefit at equal final work. Initially a strong light band crosses the nose/cheek, and lip facets change. Eye/nose/lip identity survives later refinement, but this is not uniformly better feature modelling. Equal initial work shows fewer V32 operations and still large planes/ends.
- **Portrait73:** early broad cheek bands and a more angular nose correction are a regression in local modelling despite lower numerical error. Final cheek/neck pigment is somewhat more connected; features recover, but gains over V31 are modest at equal work. Directional bands remain.

At equal final work V32 prefixes are7,893/7,773 Beaver,7,865/7,840 Rooster and6,763/6,928 portrait versus8,400 V31. Equal initial work uses1,289/1,299,1,368/1,251 and1,043/1,128 V32 versus1,400 V31. Exact time differences/prefixes are in measurements. Neutral still exposes long contact ridges and abrupt shoulders/ends on cheek, forehead, hair, body and logs. Loading changes across existing brush width; it cannot fix every gradient direction or end transition. Changed downstream strokes contribute to visual differences, so not every smoother pixel is directly attributable to a loaded donor.

## Verification and stop

[Focused tests](../artifacts/v32/tests.json), [Chrome integration](../artifacts/v32/browser.json) and [preservation](../artifacts/v32/preservation.json) pass. Retained V12/V17/V30/V31 match incoming control through Continue. Seeds42/73 are deterministic; donor-loading disabled exactly reproduces V31 decisions/RNG/surfaces/evaluation counts and baseline loading counters. Actual alpha/height, target feather/full halo, per-opportunity cap2, Undo counter/cache/RNG restoration, provenance and source-free timeline/native/2x replay are verified. Chrome checks next-run selection, Continue, pointer targets/Undo, local/global Pause/Resume/cancel, a fresh V31 after V32 cancellation, archived V22 import and pixel-exact native/2x PNG export. All12 full records replay exactly. Incoming historical files/logs/assets and canonical loading/attention/worker sources are byte-preserved; restoration relies on the recorded Git object, not a copied engine.

Stop this bounded experiment here. Retain V32 opt-in for the user's visual review; no promotion or compensating changes. End/shoulder shaping, directional bands, measured compute optimisation, relief/material, wet mixing, limited palette and brush expansion remain separate; V27-V29 stays paused. See [KIV-v32](KIV-v32.md) and [protocol/restoration](README-v32.md).

**Did two colours justify the extra work?** They help some later portrait transitions, but early modelling and other references are mixed. That earns an opt-in experiment, not a clear general replacement for V31 at5-6% extra final work on Beaver/Rooster and21-25% on portrait. User visual review remains the adoption gate.
