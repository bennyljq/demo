# V21: revise before adoption; retain the manual comparison

V20's magnitude screen demonstrably excludes useful modest corrections. Replacing it with predicted lateral improvement recovers some of those contacts, but **does not consistently improve the new portrait**. Keep V21 experimental for manual comparison; do not promote it or change V14's default. More loads are not an acceptance criterion. No second screening variant or planner mechanism was added after reviewing this result.

Open the [offline gallery](../artifacts/v21/comparison.html), [portable ZIP](../artifacts/v21/v21-comparison.zip), [diagnostic](../artifacts/v21/diagnostic.json), [design](../artifacts/v21/design.json) and [measurements](../artifacts/v21/measurements.json).

## False-negative evidence, before production changes

Incoming Git was clean. README, HANDOFF, V20 report/KIV and the actual implementation were read; no applicable AGENTS file was present. Incoming engine and V20 fitter were CRC/byte/hash verified into archives/v21-control.zip. The test-only loader preserves the retained control without another application.

The diagnostic followed the incoming V20 trajectory. Proposal stride 19, at most 24 rejected Flat/Filbert contacts per case and eight per first-failing reason, was fixed before treatment. It reused the original two fits and unchanged full objective; counterfactual fits never affected decisions. The best existing choice includes eligible V20 loaded alternatives. A substantial gain means extra gain above max(1e-6, 5% of the absolute best existing gain). This is a sampling diagnostic, not an unbiased population estimate.

| Sample | Sampled | Beats own ordinary | Beats best existing | Substantial |
| --- | ---: | ---: | ---: | ---: |
| Controlled gradient | 14 | 6 | 3 | 3 |
| New portrait | 24 (19 fitted, five patch-cap skips) | 16 | 8 | 5 |
| Rooster crown/feet region | 9 | 7 | 7 | 6 |

The gradient's six magnitude rejects include two substantial wins; its eight small-footprint rejects include one. The portrait's seven magnitude rejects include one substantial win against the best existing choice. Other sampled false negatives involve bend/coherence and the absolute regression-potential gate. Five portrait patches exceeded 16384 pixels and were never fitted; 28 otherwise eligible sampled-screen contacts also hit that cap. Low-alpha/outside/ill-conditioning and unsupported geometry remain distinct skip reasons. Evidence records the first failed screen, so counts are not mutually independent causes.

This establishes a screening weakness, rather than geometry alone being the principal limitation. It does not justify fitting every reject: boundary samples can improve numerically too. We changed only the magnitude/potential requirement and deliberately retained the small-footprint and coherence/bend safeguards.

## One bounded change

Nine canonical alpha-aware samples estimate desired deposited colour from the reference and current structural paint. With weights alpha squared times (1 + twice importance), the existing lateral regression predicts SSE improvement over the best uniform correction. V21 requires that improvement to exceed both **12 times total sample weight** (RMS of two colour units over three channels) and **5% of uniform residual variance**. These values were fixed before whole-painting review, not tuned to gradient selection. The estimate uses clamped feasible deposited colours, so it is a cheap screen, not a final objective or promised improvement.

The V20 path retains its exact original tests and decisions. A small flag selects the V21 estimate; both paths share one fitter and canonical renderer. Width >=4, alpha >.08, source/correction bend limits, correlated correction slopes and regression conditioning remain. Endpoint RMS >=10, bounded [0,255] solves, one selected contact/two softnesses (.8/2), balance .5, variation zero and the 16384-pixel patch cap remain. Ordinary candidates are never replaced. Full canonical scoring and its .000001 acceptance threshold decide all acceptance. Colour-equivalent support reuse never admits invalid geometry; the invalid V19 boundary remains rejected.

Geometry, brushes, foundation, attention, scheduling, objective, material 2, document 4, oil-library-3.0 and loading version1/srgb are unchanged. No orientation, longitudinal, palette, material or boundary treatment was introduced. New records identify planner21. Quiet body remains .25; rooster explicitly reproduces historical .65.

## Matched paintings and measured costs

The supplied 1080x1350 assets/tay-gradient.jpg is aspect-preservingly sampled by Chrome Canvas2D to app-supported **512x640**. Its saved working PNG supplies identical pair pixels. Fine/Balanced, seeds42 and73, enabled default brushes, 1400 operations/5600 proposals then +700/+2800 are common within each portrait pair. Early1800 and later2100 checkpoints follow the existing convention, with optional construction300. Rooster uses its established curated brushes and same schedule; gradient and blue/ochre use360/1440, early180/construction90. Whole views and fixed forehead, cheek, nose/mouth, hair-boundary, crown and feet crops share images. Pigment and common Neutral are available; portrait native/1024x1280 canonical replay has equal display widths.

| Case/planner | Ops | Step s | Generation loop s | Eligible | Fits | Loaded eval/accepted | Screen/fit/eval ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| portrait / v20 | 2100 | 8.462 | 8.485 | 207 | 117 | 234/91 | 192.5/122.2/250.7 |
| portrait / v21 | 2100 | 9.280 | 9.305 | 372 | 218 | 410/145 | 188.6/209.2/463.4 |
| portrait73 / v20 | 2100 | 9.484 | 9.514 | 219 | 129 | 258/93 | 194.8/153.0/345.6 |
| portrait73 / v21 | 2100 | 9.450 | 9.475 | 346 | 203 | 380/142 | 189.0/194.7/429.0 |
| gradient / v20 | 360 | 0.723 | 0.725 | 0 | 0 | 0/0 | 20.5/0.0/0.0 |
| gradient / v21 | 360 | 0.757 | 0.760 | 35 | 20 | 22/13 | 22.7/14.5/17.7 |
| rooster / v20 | 2100 | 5.250 | 5.273 | 82 | 56 | 108/32 | 98.5/21.7/55.6 |
| rooster / v21 | 2100 | 5.348 | 5.370 | 83 | 56 | 108/32 | 95.6/20.0/53.8 |
| contrast / v20 | 360 | 0.752 | 0.754 | 0 | 0 | 0/0 | 22.0/0.0/0.0 |
| contrast / v21 | 360 | 0.738 | 0.740 | 7 | 5 | 4/1 | 21.6/2.3/4.7 |

The reported run was repeated without concurrent tests; all full stroke records repeat exactly, including both portrait seeds. Step timers exclude reference analysis, snapshots, replay and encoding. Generation-loop time includes iteration bookkeeping but also excludes initial analysis and exports; this is not end-to-end user latency. Each final timing is one local observation per seed/pair in fixed control-then-treatment order. No general speed or memory claim follows. Portrait seed42 costs9.7% more step work; seed73 is roughly equal (-0.4%). Extra loaded evaluation cost is visible separately, and total trajectory cost includes changed ordinary proposals. Portrait work/native+2x replay and PNG encoding across both seeds is separately measured at29.09s; this is export work, not fitting.

Approximately matched work uses the nearest accepted-operation prefix of each complete schedule, with no production timing stop. Seed42: V20 **2100 /8462.191ms**, V21 **1540 /8462.149ms**. Seed73: V20 **2077 /9450.839ms**, V21 **2100 /9450.321ms**. This is not a replacement ratio. The gallery's work view uses these prefixes.

## Visual acceptance and limits

Seed42: cheek/nose tones connect in places and some isolated bright cheek breaks lessen, but forehead/hairline planes are more broken. Eye/iris cues and lip/teeth highlights become less distinct in parts. Seed73 also shows some connected modelling, but conspicuous cheek/forehead facets and dark eye masses remain. At1800,2100 and matched work there is no consistent reduction in distracting facets while preserving feature clarity. Both paintings retain painterly marks; that alone does not satisfy the requested quality gate. Native/2x and Neutral continue to show fibres and relief ridges; those artifacts are separate unresolved material/export concerns.

The controlled gradient has13 accepted loads and a more continuous tonal region, but does not establish a portrait-quality benefit. Blue/ochre has one accepted load and a small trajectory change without a compelling broad-coverage improvement. Rooster stroke decisions and canonical buffers are **exactly identical** between V20 and V21: crown fringe, toe gaps and feet remain as before. This is stronger than unchanged validation, but does not fix the existing outline artifact.

Final objective is2.7% worse on portrait seed42,4.2% better on seed73,21.6% better on gradient, unchanged on rooster and1.0% worse on blue/ochre. The mixed visual findings govern the recommendation; even lower error does not certify feature quality or fewer operations.

## Verification and preservation

Focused engine tests reuse five V17 and three V19 groups plus V21-specific checks: deterministic loaded records/RNG/buffers, one-contact/two-fit caps, non-colour equivalence, canonical local/full halo scoring, invalid boundary rejection, source-free timeline/native/2x, loading metadata, target feathering/cancellation/Undo/Continue, exact retained V14/V17 and loaded V20 controls. All ten complete comparison records repeat exactly. Real Chrome checks cover all four planner choices, session binding, Continue, targeted refinement/cancellation/Undo, historical imports and actual JSON/full/current-frame 2x PNG exports. Shared worker, lab, styles, V17 sources and historical logs/assets retain hashes.

Gallery and extracted portable ZIP are verified through Chrome, exact entry hashes and CRC. Reused V20/V18 controls are referenced rather than duplicated locally; identical generated PNGs share one file. Temporary review screenshots and redundant raw portrait pixels are removed. The bounded diagnostic/review tools are CRC/hash archived in archives/v21-diagnostic-tools.zip before removing their active scripts; restore those two filenames inside stroke-master to reproduce the opt-in audit. Unique records, source PNG, user asset and existing test dependencies remain. No reset, automatic commit or broad cleanup occurred.

**Decision: revise before adoption.** Preserve V20 as the clear control and V21 only as the requested manual experimental comparison. Screening false negatives are real, but recovering them is insufficient to deliver reliably better facial modelling. Further improvement needs a separately scoped decision; this iteration stops with the one tested treatment and unchanged default.
