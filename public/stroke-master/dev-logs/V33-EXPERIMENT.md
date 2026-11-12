# V33 — Crossover: same painting, less work

**Keep V31 as the practical general recommendation and default. Replace the normal V32 option with V33.** Exact reuse reduces measured V32 painting time by 11.5% on portrait and 16.2% on Beaver (seed 42). V33 retains V32's graded paintings, including their mixed artistic evidence. The optimisation helps the accuracy/time tradeoff, but the shared improvement also benefits V31; it does not establish a general reason to prefer graded construction.

[Measurements](../artifacts/v33/measurements.json) | [Summary/checkpoints](../artifacts/v33/summary.json) | [Exact threshold observations](../artifacts/v33/crossover.json) | [Equivalence](../artifacts/v33/equivalence.json) | [Existing identical V32 images](../artifacts/v32/comparison.html) | [Restoration](README-v33.md).

## Control and profiling

Incoming Git was clean at 433af2bf6b387803c6f68b3261dbdd1a4c9cd68d. [Manifest](../artifacts/v33/incoming.json) freezes SHA256 hashes of incoming application, dependencies, settings, reference inputs and records. The Git loader restores V32/V30 in memory without another app or engine copy. No reset, automatic commit, historical-log edits or broad artifact cleanup.

Before edits, representative seed 42 portrait and Beaver ran initial 1400/+7000 using the existing settings and proposal limits. Temporary in-memory function timers split raster preparation, copying, integral/scoring and loading. [Full profile](../artifacts/v33/profile.json): portrait 39.01 s, raster29.03 s, canonical evaluations22.62 s, halo/objective scoring4.71 s, support preparation2.07 s, copyPatch.886 s; Beaver 23.06 s, raster17.61 s, evaluations11.24 s, scoring2.08 s, support preparation.960 s, copyPatch.389 s. Categories overlap: evaluation includes raster/copy/scoring, and scoring includes integral construction. Geometry itself is only.182/.127 s. Donor screen/fit/evaluation are separately recorded: portrait 1.418/1.377/2.892 s; Beaver.712/.129/.301 s. Contact sampling and both fits stay together in the fitter timer; its support is already shared between fits.

A [diagnostic initial breakdown](../artifacts/v33/profile-detail.json) puts profile-table construction at 2.683 s portrait and2.201 s Beaver, versus patch copying.219/.102 s. Per-pixel deposition timers add substantial instrumentation overhead; these are bottleneck diagnostics, not speed estimates. The follow-up diagnostic briefly overlapped the end of the full Beaver profile; none of these observations is used for speed claims. Repeated uninstrumented benchmarks below ran alone. Profiling source/timers were temporary and removed.

## Two related exact changes

1. Reuse immutable seeded brush properties and profile tables inside one synchronous proposal. Uniform and colour-only variants share their entry. Loading screens, actual-contact sampling and accepted-support/structural/material rendering receive the same proposal map. Full and alpha-only tables are separately constructed at the original pixel footprint. No alpha-only substitution, new fit, formula change or Float32 rounding change. The fitter, scorer and renderer remain canonical; table arithmetic is byte-identical to the control.
2. Omit copyPatch's background fill. Every RGB and coverage element is copied from the current canvas before reading, including target Undo region copies. Arrays and their Float32 storage remain the same.

No persistent canvas cache, reduced opportunities, approximate scores, pruning, new penalty, changed eligibility/patch limits, scheduling, geometry, loading metadata, brush material, objective, attention or RNG. Most overall savings come from repeated accepted rendering and shared raster preparation, not just donor loading. The loaded/uniform competition and all trajectories are unchanged relative to V32. V31 uses these same improvements without a behaviour change.

## Repeated useful performance

Windows / Node v24.20.0, preserved portrait 512×640 and Beaver 512×640, seed 42, Balanced detail/search, default brushes, quiet body.25. Each engine/reference first completes a full initial+Continue warmup. Three measured runs per side alternate V32/V33 first (AB/BA/AB); warmup starts with V33. Both use the unchanged existing timers, including support telemetry. Values are median [minimum–maximum], seconds. All runs reach1400 then8400 accepted operations with1400/5600 and+7000/+28000 limits.

|Case|Painter|Initial s|Continue s|Total s|
|---|---|---|---|---|
|portrait|v32|10.591 [10.581–10.625]|26.883 [26.768–26.955]|37.474 [37.348–37.581]|
|portrait|v33|9.719 [9.702–9.721]|23.447 [23.354–23.492]|33.150 [33.075–33.211]|
|beaver|v32|6.524 [6.519–6.548]|15.724 [15.680–15.738]|22.242 [22.205–22.285]|
|beaver|v33|5.831 [5.806–5.855]|12.803 [12.793–12.905]|18.634 [18.599–18.760]|

Portrait initial/Continue/total reductions: 8.2% /12.8% /11.5%. Beaver:10.6% /18.6% /16.2%. Ranges do not overlap between sides. Measurements used the optimised painter under its V32 identity before selector/version archival cleanup; that final registry cleanup is not credited with a further saving. Full final V33 equivalence is verified separately.

Analysis/setup is outside painting: portrait V32 0.214 [0.214–0.223]s, V33 0.201 [0.190–0.225]s; Beaver V32 0.198 [0.193–0.205]s, V33 0.196 [0.189–0.198]s. Reference decoding, checkpoints, comparisons, replay/export and document verification are also outside painting. No painting work shifted to analysis. Profile maps allocate inside step, and both sides retain all timer calls.

|Case|Painter|Opportunity / checkpoint|Screen s|Fit s|Evaluation s|
|---|---|---|---|---|---|
|portrait|v32|baseline / initial|0.178 [0.178–0.179]|0.191 [0.188–0.192]|0.431 [0.430–0.431]|
|portrait|v32|baseline / final|0.191 [0.191–0.192]|0.191 [0.188–0.192]|0.431 [0.430–0.431]|
|portrait|v32|donor / initial|0.180 [0.178–0.180]|0.166 [0.166–0.167]|0.375 [0.372–0.381]|
|portrait|v32|donor / final|1.339 [1.339–1.343]|1.293 [1.291–1.306]|2.781 [2.772–2.815]|
|portrait|v33|baseline / initial|0.177 [0.177–0.178]|0.163 [0.161–0.163]|0.341 [0.340–0.341]|
|portrait|v33|baseline / final|0.190 [0.190–0.192]|0.163 [0.161–0.163]|0.341 [0.340–0.341]|
|portrait|v33|donor / initial|0.178 [0.177–0.180]|0.137 [0.136–0.138]|0.287 [0.287–0.290]|
|portrait|v33|donor / final|1.326 [1.325–1.332]|1.091 [1.091–1.097]|2.161 [2.158–2.162]|
|beaver|v32|baseline / initial|0.080 [0.079–0.080]|0.022 [0.021–0.022]|0.055 [0.054–0.055]|
|beaver|v32|baseline / final|0.082 [0.081–0.082]|0.022 [0.021–0.022]|0.055 [0.054–0.055]|
|beaver|v32|donor / initial|0.125 [0.125–0.127]|0.024 [0.024–0.025]|0.054 [0.054–0.055]|
|beaver|v32|donor / final|0.677 [0.677–0.678]|0.119 [0.117–0.120]|0.282 [0.280–0.283]|
|beaver|v33|baseline / initial|0.080 [0.079–0.081]|0.017 [0.017–0.017]|0.038 [0.038–0.039]|
|beaver|v33|baseline / final|0.082 [0.081–0.083]|0.017 [0.017–0.017]|0.038 [0.038–0.039]|
|beaver|v33|donor / initial|0.124 [0.124–0.125]|0.018 [0.018–0.019]|0.039 [0.039–0.039]|
|beaver|v33|donor / final|0.671 [0.671–0.673]|0.092 [0.092–0.094]|0.198 [0.197–0.199]|

Final includes initial; Continue category costs are the final-minus-initial values in raw records. Existing fitMs includes contact sampling/raster and the two endpoint solutions; evaluationMs includes canonical raster/halo scoring, not just arithmetic. Screening barely changes; larger savings occur in fitting/evaluation and accepted rendering. Small baseline categories are noisy. No candidate or loading count reduction is claimed.

|Case|Initial / final candidates|Donor screened / fits / loaded evaluations|Baseline fits / loaded evaluations|
|---|---|---|---|
|portrait|6675 / 44467|10211 / 3516 / 3060|488 / 455|
|beaver|5746 / 34995|8619 / 450 / 421|82 / 81|

Both sides have identical counts on every repetition. Portrait donor wins 291; Beaver 120. Portrait proposals 10223; Beaver 8631. Donor fits stay3516/450, loaded evaluations3060/421; losing variants still receive full scoring. Retained V12/V17/V31 get the shared helper improvement; their accepted behaviour is independently verified. The practical comparator below uses optimised V31, not a slower historical engine.

## Fidelity versus measured time

Repeated medians at equal accepted counts, seed 42 only; references remain separate. Structural objective error is fidelity evidence, not proof of equal artistic quality.

|Case|Painter|Initial error / s|Final error / s|
|---|---|---|---|
|portrait|v33|0.0007958274 / 9.719|0.0001795284 / 33.150|
|portrait|v31|0.0009353281 / 8.865|0.0002154964 / 27.598|
|beaver|v33|0.006736325 / 5.831|0.002169747 / 18.634|
|beaver|v31|0.006938487 / 5.715|0.002230119 / 17.758|

At8400, portrait V33 reduces error16.7% relative to optimised V31 while taking20.1% more time. Beaver reduces error2.7% while taking4.9% more time. The full measured trajectory checkpoints are in summary.json. Its conservative checkpoint threshold brackets avoid interpolation.

Additional warmed, uninstrumented runs record the first accepted crossing of V31's initial and final error levels (incremental/full objective comparison tolerance 1e-14); opposite pair order is used on portrait/Beaver. These are single supplementary observations, not repeated estimates, and use the same 1400/+7000 limits. They show how many accepted operations and how much measured painting work reach each common objective level:

|Case|Common error level|Painter|First accepted crossing|Painting s|
|---|---|---|---|---|
|portrait|0.000935328061 (initial V31)|v33|1116|9.147|
|portrait|0.000215496353 (final V31)|v33|7032|27.732|
|portrait|0.000935328061 (initial V31)|v31|1400|8.799|
|portrait|0.000215496353 (final V31)|v31|8400|27.275|
|beaver|0.00693848702 (initial V31)|v31|1400|5.670|
|beaver|0.00223011922 (final V31)|v31|8400|17.491|
|beaver|0.00693848702 (initial V31)|v33|1355|5.725|
|beaver|0.00223011922 (final V31)|v33|8111|18.068|

Do not infer a robust small timing advantage from these single crossings. Portrait V33 reaches the final common error at 7,032 operations versus8,400 for V31, but takes27.732 s versus27.275 s (about1.7% more); the initial common error takes1,116 versus1,400 operations but9.147 s versus8.799 s. The portrait trajectories approach a crossover; Beaver gains little at added work. With no clear user visual preference for graded painting, V31 remains the practical general recommendation. V33 makes the graded option cheaper and useful for a lower final portrait objective at higher work; it does not manufacture an artistic improvement.

## Exact outputs, memory and lifecycle

All six established reference/seed pairs (Beaver, Rooster, portrait;42/73) reach1400/8400. Every candidate is compared in order, including stroke geometry/colour/loading and canonical before/after/gain, alongside per-proposal RNG, acceptance count, total and task index. Initial/final stroke records also match saved V32 evidence. Structural RGB/coverage, pigment RGB/coverage/height, error buffers and construction-attention cache are exact. Documents, native/2x Neutral pixels, JSON/native/2x source-free replay and timeline endpoints are exact. Hashes/candidate traces are in equivalence.json. Only plannerVersion32/33, settings.planner v32/v33 and property names ending Ms (timing fields) are normalised. Verification-only __trace/__key/__scratchPeak* are never serialised and are not painting state.

|Case/seed|Peak retained table bytes|Peak unique entries / tables|
|---|---|---|
|beaver42|147456|5 / 9|
|beaver73|147456|5 / 9|
|rooster42|147456|5 / 9|
|rooster73|147456|5 / 9|
|portrait 42|147456|5 / 9|
|portrait 73|147456|5 / 9|

The measured default-reference peaks are shown above; five single original contacts permit up to 160 KiB of full/alpha profile tables. Aliases share table storage. Small maps, seeded property objects and bundles add JS-object overhead; reported bytes measure typed buffers, not process RSS. A conservative 5 MiB table-buffer bound covers retained planners' maximum 16 candidates/refinements ×16 contacts plus accepted rendering, including temporary target-decorated child identities. Grouped contacts can therefore retain more than the default crossover sample; this is still proposal-local. Existing64 MiB fixed memory reserve remains, and guard/patch limits are unchanged. Construction/filtering temporary arrays already existed. No map survives step or appears in Undo, snapshots, worker messages or replay.

[Focused tests](../artifacts/v33/tests.json) cover retained decisions/RNG/surfaces/counters, Pause/Resume boundaries, deterministic interleaved sessions, target/cancel/Undo and two real fitted aliases crossing a nonzero feather. Cached gains/pixels/coverage/height equal uncached control, with no outside deposition. [Chrome checks](../artifacts/v33/browser.json) cover session ownership after selector changes, Continue, pointer target/Undo, local/global Pause/Resume/cancel, fresh V31 after cancellation, JSON/timeline and pixel-exact native/2x PNG, plus V22/V30/V32 import. Chrome required an unsandboxed local test launch because the restricted-token GPU subprocess failed; no application workaround was added. A test wait was corrected to await the new archive's provenance, rather than the preceding imported document. All final browser checks pass.

[Preservation](../artifacts/v33/preservation.json):3,621 untouched incoming files byte-identical, including archived logs/references/evidence/restoration and worker source. Canonical geometry, brush properties/tables, deposition, objective, attention/location and loading equations are unchanged. Stable V12/V17; Experimental V31 default/V33; V22/V30/V32 and earlier standalone generators archived. Historical restoration and replay preserve provenance, and shared donor/loading implementation stays in production.

Stop here. Stroke ends/direction, relief/material, wet mixing and expanded brushes remain deferred in [KIV-v33](KIV-v33.md). **Graded construction now has a better accuracy/time tradeoff than V32, but V31 remains the practical general recommendation.**
