# Stroke Master v7 quality-recovery report

Recovery is partial. Task-focused search restores opportunities for fine directional work and produces more neck marks in both matched rooster seeds. It does not recover the supplied v3 feather flow or a reliable eye. Background cleanup and silhouette quality regress in places. The two requested targeting UI fixes are complete and verified in Chrome and Firefox.

## Baseline and diagnosis

No applicable AGENTS.md, local Git history, v3 source or source backup was found. Available v3 records/images are historical replay evidence, not enough to reconstruct its planner or the supplied artistic result. The supplied images are not matched benchmarks. Current source and verified behavior guided changes.

The pre-edit canonical v6 source is archived as non-runtime evidence in [engine-v6-source.txt](artifacts/v7/engine-v6-source.txt). The fresh rooster seed-42 baseline exactly matches the authoritative v6 full capture's common error, candidate count and operation count. Fixed input: `artifacts/v3/rooster-input.json`, 632?461 pixels, Fine, body 0.65, Balanced, seed 42, Neutral, 1800 operations / 7200 proposal cap. Seed 99 uses the same decoded pixels/settings. Mat (450?450) and forest portrait (640?400) use authoritative v6 full records with those same settings.

Confirmed code mechanisms: v6 selected primary scales by stage lottery, added unrelated scale rivals, ranked by absolute total gain, and used coarse residual attention. Large/medium candidates used coarse colour/path estimates. Broad repairs bypassed ordinary source-colour path shortening; narrow-feature exclusion applied to their sampled region, not every deposited pixel. Fine proposals could also be inflated to 0.022 E on high residuals, defeating narrow sizing. No objective weights or gain threshold were changed.

Ranked hypotheses, limited to three:

1. **Attention and task starvation.** Eye and directional neck residuals receive few useful opportunities when the same global coarse-error search chooses both problem and candidate scale. Supported by instrumentation and the task-attention trial; this is the retained intervention.
2. **Mixed-scale competition.** Absolute gain lets unrelated broad corrections outbid intended fine work. Plausible contributor; removing unrelated rivals within a task helps express that task, but the experiment does not isolate ranking from attention well enough to assign a causal percentage. Absolute gain remains intact.
3. **Broad-repair exceptions crossing useful structure.** Plausible overwrite mechanism; the bounded boundary-veto trial did not produce a convincing recovery, so its veto was removed.

[Bounded v6 diagnostic](artifacts/v7/diagnosis.json) versus [final v7 diagnostic](artifacts/v7/diagnosis-v7.json), same seed/budget: eye seed points 3?9 and width-under-6-pixel candidates 8?37; neck points 15?68 and narrow candidates 56?374. Narrow candidates led comparisons 1?5 at the eye and 6?54 at the neck. ?Led? includes rejected proposals; it is not an accepted-stroke count. Large winners' scoring-patch bounds intersected the eye box 20?19 times. Those bounds include blur halos: this is evidence of possible competition, not proof of later paint covering an earlier eye. Feet remained well sampled (398?350 points) but their narrow comparison leaders fell 333?229.

Neutral, pigment-only and identical Impasto views show that coarse geometry already exists in pigment; lighting is not the chief explanation. Progress at 300/900/1800 operations shows fine detail is sometimes proposed and wins, rather than never appearing. Temporal overwrite remains unquantified. Eye anatomy, semantic feather continuity and broad mark placement remain unresolved.

## Controlled experiments

Three hypotheses were tested sequentially, without a parameter sweep or objective-weight changes. [Experiment measurements](artifacts/v7/experiment-measurements.json) retain settings, counts, times and record hashes; the gallery retains each rejected alternative's final neutral view.

| Experiment, seed 42 | Candidates | Runtime ms | Common error | Decision |
| --- | ---: | ---: | ---: | --- |
| Disable primary scale lottery only | 12898 | 7946 | 0.004734 | Lower error, no convincing feather-flow recovery; insufficient alone |
| Task-focused search, initial coarse attention | 15178 | 8934 | 0.006138 | Weak fine opportunities; revised within this hypothesis |
| Restrict broad repairs near directional structure, on initial task trial | 14286 | 7025 | 0.007128 | No clear visual benefit; rejected |

The task trial was refined using the same diagnosed failure: sample tiles proportionally instead of repeatedly choosing the largest of 32 tile draws, use feature-weighted point residual for directional/fine attention, and remove the legacy fine-width inflation. The retained planner chooses Block-in/Shapes/Directional/Fine work before candidate comparison and explores nearby variants of that task. Deliberate coherent broad repairs remain available at every depth. Existing tracing, brush selection, source-scale estimates, absolute gain, failure cache, foundation, renderer and local support rules remain.

This is a partial planning improvement, not an overall aesthetic win on every feature or reference. No protected painted regions, masks, new brushes, renderers or user-facing planner switches were added.

## Matched evaluation and tradeoffs

[Whole paintings, feature crops, progress and relief comparisons](artifacts/v7/comparison.html). [Exact final settings/work/times](artifacts/v7/v7-measurements.json). All matched-cap rows use 1800 / 7200 caps. The 1600-operation row uses 6400 proposals and is the approximate candidate-cost comparison.

| Reference / seed / version | Ops / proposals | Candidates / contacts | Runtime ms | Common error |
| --- | ---: | ---: | ---: | ---: |
| rooster / 42 / v6 | 1800 / 1823 | 13069 / 13069 | 7882 | 0.005239 |
| rooster / 42 / v7 | 1800 / 2029 | 14545 / 14545 | 9629 | 0.006055 |
| rooster / 99 / v6 | 1800 / 1820 | 13030 / 13030 | 8818 | 0.005035 |
| rooster / 99 / v7 | 1800 / 2009 | 14361 / 14361 | 11289 | 0.006523 |
| rooster / 42 / v7 | 1600 / 1744 | 12536 / 12536 | 9881 | 0.007043 |
| monochrome / 42 / v6 | 1800 / 1814 | 12980 / 12980 | 7699 | 0.001023 |
| monochrome / 42 / v7 | 1800 / 2028 | 14494 / 14494 | 9510 | 0.001574 |
| portrait / 42 / v6 | 1800 / 1870 | 13220 / 13220 | 12088 | 0.003605 |
| portrait / 42 / v7 | 1800 / 2186 | 15540 / 15540 | 19970 | 0.003500 |

?Common error? is the unchanged unshaded weighted structural objective per weight. Candidate/contact counts include foundation; all these captures use single contacts. Runtime measures generation plus progress captures and final snapshot/material audit, excludes initial analysis and later comparison replay/renders, and is machine/load dependent. Portrait/Mat v6 times are historical measurements, not fresh reruns. Some v7 captures overlapped verification work; do not interpret wall time as a speed benchmark.

At matched caps, v7 spends about 11% more candidates on rooster seed 42. The 1600-operation run spends 12536 versus 13069 candidates/contacts (4% fewer), but takes longer in the measured run; candidate work is only a rough compute proxy because patch sizes and attention cost differ. It still shows directional neck marks at similar search allowance, with higher error and rougher edges. There is no claim of equal wall-clock cost or universal quality improvement.

Visual review: both rooster seeds gain more directional marks and neck separation. Many marks are thick/spotted rather than continuous feathers. The face still lacks a dependable eye; breast/tail masses survive but silhouette scratches and surrounding white cutbacks become rougher. Feet retain anatomy but toes and gaps remain angular; this is not a demonstrated feet-quality improvement. Mat has sharper, busier face/collar marks, with higher aggregate error and harsher facets. Forest foliage is less sparse, while some face/hair contours remain faceted; numerical error changes little. Identical Impasto exaggerates the same geometry rather than fixing it.

V6 seed 99 exposed a pre-existing floating-point repair colour of 255.00000000000003, rejected by strict replay validation. Its authoritative JSON is preserved; comparison replay clamps a copy only. Production now clamps newly averaged broad-repair colours to valid RGB bounds, with a regression test. Saved-document validation was not loosened.

## UI, cleanup and verification

Actual pre-fix browser evidence: the SVG had `hidden` present, computed `display: none`, and zero rendered dimensions despite `svg.hidden = false`. The shared overlay now changes the attribute explicitly, with dark/white outlines for centre and both boundaries. Real pointer-held screenshots and pixel differences against the same view with only the SVG hidden verify visible output in Fit, scrolled 100%, light/dark fills and fullscreen/DPR 2, in both browsers.

Persistent mode returns to an empty selection after normal completion, leaves global paused, ignores gestures during local work and preserves latest-pass Undo. Escape/cancel/new Paint/new image/import/global Resume/Continue disarm it. Switching off during work allows completion without re-arm. One-pass mode, stale tokens, source-free replay, feathered recorded paint and overlay-free exports remain verified.

Removed: primary scale lottery/preferences, residual/stall stage accumulation and dead stage fields, explicit class-width branches, unrelated scale rivals, fine residual-width inflation, obsolete quota assertions, temporary experiment/install/debug runners and duplicate experiment renders. Consolidated feature residual calculation and overlay CSS. V6 test entry points forward to current checks; its study command points to preserved captures. Only `engine.js` is a production planner. The archived `.txt` source is diagnostic evidence with no runtime references. [Reviewed engine diff](artifacts/v7/engine-review.diff).

Tests actually run and passed: build; 11 v7 engine groups; 14 canonical groups; 10 material/legacy groups; 10 foundation/recovery groups. Each installed Chrome and Firefox passed 13 existing targeted groups, 14 new visible/persistent groups and 20 full browser regression groups. These cover exact undo including feature tiles/RNG/cache, local/full scoring, deterministic pause/preview, unrestricted correction, depth bounds, all brushes, legacy replay, actual feathered 2? PNG/JSON downloads, lighting, fullscreen and lifecycle transitions. Reports and screenshots live under `artifacts/v7/`. Initial harness path/repeated-evaluation failures were corrected and the affected suites rerun successfully. Optional v3 suite and older benchmarks were not rerun.

Remaining gap: the supplied v3 artistic image was not reproduced. Fine feather flow, reliable facial anatomy, clean silhouette/background decisions and pleasing broad paint texture are still not guaranteed. Headless fullscreen and fallback were tested; interactive native Firefox fullscreen needs a manual check.
