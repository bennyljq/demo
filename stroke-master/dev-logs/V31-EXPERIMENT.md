# V31 — Crossover: construction attention

**Recommendation: revise before adoption; retain the selectable experiment and evidence.** Giving the donor its own attention improves early Beaver construction in both seeds, including at equal initial work. Rooster gains are modest and portrait modelling remains mixed. It does not establish a consistently better early painter. V22 remains the default; V30 stays available unchanged. No second mechanism was added to rescue the result.

[Self-contained gallery](../artifacts/v31/comparison.html) · [Design](../artifacts/v31/design.json) · [Measurements](../artifacts/v31/measurements.json) · [Support/cost summary](../artifacts/v31/summary.json) · [Diagnostic](../artifacts/v31/diagnostic.json).

## Short diagnostic before treatment

The existing seed42 Beaver/portrait V30 initial states were reconstructed exactly to1,400 operations with their preserved references. Six fixed visible patches were traced through initial painting, then five unchanged donor contacts per patch were scored at representative positions on the frozen final state. These locations exist only in diagnostic evidence, never in production.

|Patch|Anchor visits|Positive / accepted donors during initial painting|Positive losing donors|Positive frozen counterfactuals|
|---|---:|---:|---:|---:|
|Beaver body|27|24 /11|13|4/5|
|Beaver log|32|31 /19|12|2/5|
|Beaver river|14|14 /12|2|5/5|
|Portrait cheek|12|6 /1|5|0/5|
|Portrait forehead|13|9 /5|4|3/5|
|Portrait neck|8|7 /0|7|2/5|

Beaver river/body retain useful full-footprint opportunities despite receiving attention; independent allocation is plausible, not proven necessary. Portrait cheek contacts are unsuitable at these sampled locations, and neck contacts often lose selection. The evidence supports a bounded test while explicitly exposing construction/selection limitations. Thirty frozen counterfactual evaluations are diagnostic work, outside painting timers. In-memory tracing was removed; its small source is preserved as [diagnostic-source.txt](../artifacts/v31/diagnostic-source.txt).

## One attention treatment

V31 moves V30's existing single donor opportunity; baseline V22 candidates retain their original anchors and RNG. The donor's authentic V12 Shapes/pass1 constructor, geometry/colour constraints, brushes/materials, keyed isolated randomness, full canonical footprint/halo scoring and acceptance competition are unchanged. Location changes the resulting geometry and colour: this is an attention-policy comparison, not a fixed-stroke comparison. No broad repair, fitting, loading fit, colour fit, bonus, penalty, clipping, semantic rule or stage quota was added.

The signal is squared RGB distance between the current **structural canvas box mean** and `A.scales[1]`, the existing reference Shapes box mean. Radius is `max(1,round(edge*.006))`:4 pixels and a9×9 box at640. This differs from existing objective/error tiles (importance-weighted multiscale errors) and feature tiles; those scores are not assumed to be regional colour mismatch. Spatial averaging reduces isolated detail priority and opposite residual cancellation; it is not proof of connected component membership.

A fixed `2r+1` lattice covers the frame. Each ordinary opportunity samples64 lattice nodes uniformly and uses a mismatch-weighted reservoir to select one. No highest-feature pixel, foreground/background gate, flood, multiscale hierarchy or full-canvas scan/blur per proposal. Lazy cached means depend on at most four existing tile revision counters. Accepted paint refreshes those revisions; sampled stale values recompute. Cache arrays/counters and revisions participate in existing target Undo; their cloned bytes enter its memory estimate. Target sampling uses the existing feather weight, with a centre fallback for tiny targets. Deposition retains canonical feathering.

## Fixed evaluation and numerical outcomes

Seeds42/73, established Beaver/rooster/tay-gradient working pixels (512×640 /632×461 /512×640), Balanced detail/search, default brushes, quiet body.25, common Neutral. Limits declared before treatment results: early300; initial1,400/5,600 proposals; Continue+7,000/+28,000. All twelve runs reached both operation limits, stopping at **Stroke budget reached**. No allowances increased. All V30 timings are fresh; its three seed42 full stroke records exactly match preserved V30 evidence. Pair order alternates.

Values below are V30 / V31. Times are seconds of actual step work, including attention, construction/evaluation, acceptance and support telemetry; analysis/replay/export/verification excluded.

|Case|Initial time|Final time|Initial evaluations|Final evaluations|Final proposals|
|---|---:|---:|---:|---:|---:|
|Beaver42|5.555 /6.467|19.298 /21.426|5675 /5642|34875 /34378|8711 /8586|
|Beaver73|5.793 /6.333|19.517 /21.272|5688 /5654|34728 /34438|8666 /8600|
|Rooster42|5.020 /5.371|18.430 /19.915|5779 /5719|35515 /35463|8855 /8848|
|Rooster73|5.019 /5.163|18.668 /19.523|5831 /5734|35811 /35446|8931 /8845|
|Portrait42|9.576 /9.671|29.795 /31.213|6337 /6159|41810 /40159|10312 /9917|
|Portrait73|9.644 /9.915|29.705 /31.449|6375 /6210|41795 /40686|10313 /10054|

Initial time changes respectively+16.4/+9.3/+7.0/+2.9/+1.0/+2.8%; final+11.0/+9.0/+8.1/+4.6/+4.8/+5.9%. Evaluation counts fall slightly, but cost rises: different locations produce larger/more expensive contacts. Attention itself totals.244/.240/.175/.166/.271/.272s, already included; donor evaluation totals4.48/4.44/4.69/4.67/9.08/9.03s versus V30 3.11/3.12/3.45/3.54/7.51/7.48s. Cache setup is included in separately recorded analysisMs, not step work; it was not timed separately. Construction and initial proposal counters are retained in the full measurements. These are single local observations, not repeated timing estimates.

|Case|Initial accepted donors|Final accepted donors|Median actual initial support pixels|
|---|---:|---:|---:|
|Beaver42|827 /943|3024 /2669|94 /293|
|Beaver73|767 /949|2820 /2627|105 /293|
|Rooster42|611 /619|1123 /1167|47 /172|
|Rooster73|600 /598|1131 /1141|51 /148|
|Portrait42|458 /567|677 /895|519 /646|
|Portrait73|438 /551|660 /857|480 /603|

Support is actual deposited alpha>.08; every accepted donor's pixels/alpha area is recorded, not inferred from requested width. Gallery includes300/1400, fixed crops, final equal8400 operations, initial/final equal work and pigment/Neutral. At equal initial work V31 has1040/1183/1231/1331/1366/1304 operations versus V30 1400; final7379/7538/7676/7986/7999/7897 versus8400. Matching differences are below.002s. Compatible seed42 V22/V12 initial context is reused from V24/V25, without historical planner runs.

## Visual findings and seed differences

- **Beaver:** both seeds establish more connected orange body, brown log and turquoise river planes earlier, with a less interrupted mountain/landscape. The gain remains visible at equal initial work even with fewer strokes. Continue retains and develops those masses. Substantial colour/shape approximations remain; pale paint is not proof of unpainted canvas. Sky and water still carry conspicuous broad contacts. Neither seed demonstrates universal scene completion or reduced relief.
- **Rooster:** denser tail blocking appears in both seeds; body/neck differences are smaller. Initial feet retain rough pale fringes and simplified toes, and crown/head accents change. Later refinement reduces the fringes and retains open leg/silhouette gaps. No large new final surrounding spill is evident, but initial boundary cleanliness is not uniformly improved. Seed73's benefit is less pronounced than Beaver's; donor count barely changes.
- **Portrait:** some cheek/neck planes connect and the seed73 nose loses a conspicuous V30 vertical slab. Early cheek/neck modelling remains ribboned/faceted, and eye/lip detail changes; seed42 does not establish clearly better facial modelling. Final likeness/detail largely recover at equal work, with different remaining gradient fragments and contact ridges in Neutral. This is not consistent evidence of smooth early facial construction. Seed42 final structural error rises2.7%, seed73 falls3.8%; those figures do not decide artistic quality.

Repeated construction leaves conspicuous coherent bands in portrait planes, while eyes/fine features still require later baseline recovery. This is a possible overworking/detail-allocation tradeoff, not an anatomical diagnosis. Inspection found no global untouched region attributable to the policy, but six images do not prove absence of neglect. Accepted donor counts, broad support and lower errors are not aesthetic certification. Double loading remains active and unchanged as a capability; portrait accepted loaded counts are107/105 V31 versus158/157 V30. Uniform donor competition changes their opportunity, without extending loading to donors.

## Verification and preservation

[Focused checks](../artifacts/v31/tests.json), [Chrome lifecycle](../artifacts/v31/browser.json) and [preservation](../artifacts/v31/preservation.json) pass. V12/V17/V22/V30 match the recorded incoming Git engine through Continue. Disabled attention reproduces V30 decisions/RNG/surfaces/evaluation counts; V31 repeats at both seeds. Independent full blur validates the cached signal; tile revisions invalidate means. Cache/counters/revisions restore on Undo. Target attention/deposition respects feather support; full-footprint gains match independent full-canvas objective. All twelve final replays are exact. Renderer/scorer/material/loading, baseline location/refresh and donor constructor/RNG key are unchanged.

Chrome covers categories/default, captured planner through Continue/target/Pause/Resume/Undo, cancellation, fresh V30 after V31 cancellation, JSON/native timeline/2x PNG and frame export, source-free import, historical loaded replay and gallery assets. Worker stale-job protection remains unchanged. Replay restores recorded strokes/provenance, not optimiser state. The self-contained gallery embeds native-dimension WebP previews (~10.9MB); exact PNGs/JSON remain alongside.

Incoming Git was clean. The incoming commit is recorded in [incoming.json](../artifacts/v31/incoming.json); `v31-control.cjs` restores V30 from that revision in memory, without an application copy. 2,907 untouched incoming files are byte-verified, including V30 and earlier logs/evidence/assets/archives. The current handoff is concise, with historical records retained in version control and linked reports. No reset, commit, destructive cleanup, new renderer or permanent diagnostic framework.

Stop with this policy. Attention is useful for earlier Beaver construction, but does not reliably solve early portrait/clean-boundary modelling. **Revise before adoption**; keep the evidence/manual option and V22 default. Do not compensate within V31. Compute optimisation, donor loading, material/relief and broader brushes remain deferred; V27–V29 regional construction stays paused.
