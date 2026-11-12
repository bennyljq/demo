# V15: coherent construction with V14 boundary discipline

**Recommendation: retain the construction treatment as an experiment pending visual review.** V15 fills the rooster's early body/tail more coherently and preserves clean feet. The blue/ochre subject improves partially, but its quiet background remains fragmented; the eye is still less clear than V12/source. This is not general construction recovery or an adoption decision. No additional detail change was made.

Open the [studio](index.html), [offline gallery](artifacts/v15/comparison.html), or the [portable comparison package](artifacts/v15/v15-comparison.zip). V12 remains the default; V14 and V15 have separate experimental options. All use material 2; planner metadata is 11, 14 and 15 respectively. V12 has no V13 collateral penalty.

## Hypothesis, implementation and causal limits

Inspection confirmed V14's global minimum-width behaviour: every incompatible shoulder can reduce the width of the entire contact, while centreline crossings scale the entire curve around its midpoint. It also reduces width at the anchor **before** tracing, sets length from that width, and uses three curved candidates without V12's coherent broad-repair repertoire. Those are separate limits, not consequences established by the V14 report.

V15 shares V14's candidate constructor and changes its fitting callback only. It samples nine positions over the actual cubic, identifies the contiguous compatible interval surrounding the central sample, and extracts that exact cubic portion with de Casteljau subdivision. A compatible centre can keep its width while incompatible path ends are removed. If the centre itself needs narrowing, it narrows; there is no universal short-wide shape or size quota. The new pressure/release envelope is rechecked after trimming, within a three-round bound.

Shoulders are found from the **canonical footprint function**, including brush spread, pressure, taper, lean and rotation, rather than V14's fixed conservative spread multiplier. Seven binary steps per side and a small centre search bound this work. Sampling uses canonical path-length coordinates. Colour and soft-priority compatibility are unchanged, including coarse construction scales/native detail pixels. A small coverage fringe is allowed; actual pigment/height is never clipped to the reference. Sampling cannot guarantee compatibility between reads, and the last fitting round can terminate before complete convergence.

Thus the primary treatment combines shortening-before-global-narrowing with more faithful footprint sampling. It does **not** isolate shortening alone from that sampling change. Analysis, palette, foundation, attention, scheduling, objective, acceptance threshold, material, renderer, three-candidate limit and curve repertoire remain fixed. No broad-repair restoration, semantic rule, underlay, new penalty or budget increase was made.

An opt-in trace of the exact final V15 decisions found 305 of 825 Block-in candidates retained their width while shortening; 84 narrowed. But 528/825 already entered fitting below half their nominal width, after the unchanged anchor-normal scan. The fitter therefore cannot recover all missing broad construction. The limited blue/ochre recovery is also consistent with the unchanged repertoire/attention constraints; this experiment does not prove which remaining mechanism dominates.

## Preserved controls and session integration

Incoming tracked state was clean at `25412490712590f73df53531dcfa26db44965cab`. Project instructions, HANDOFF and V14 report were inspected. No reset, branch switch or commit was made. All work stays inside `stroke-master/`.

Existing V12 source/hash and the V14 historical freeze were verified. [freeze.json](artifacts/v15/freeze.json) hashes incoming sources, settings, records and evidence. Only the incoming canonical engine, original V14 constructor and handoff were archived, because those files change; existing records/images remain in place. V14's default mathematics are preserved exactly, with two adapter lines allowing its constructor to be shared. Original bytes are in `v14-planner-before.txt`; `engine-before.txt` reproduces the prior integration. Frozen full V14 strokes and short fixture records regenerate exactly. Earlier evidence is hash-checked unchanged.

The explicit engine dispatch adds V15 without a plugin framework or another application. The selector gains one option and the active painting label recognises planner 15. Paint's immutable binding, Continue, Resume, targeted refinement and Undo remain shared. Imports replay recorded strokes/material independently of next-run selection. Worker protocol, renderer, material, lab UI, styles and lighting code are unchanged; both standalone pages were regenerated.

## Visual comparison

The existing rooster pixels/settings and V9 schedule are used unchanged: seed 42, Fine/Balanced, quiet body .65, curated brushes; 1400/5600 initially, then additions 700/2800, 700/2800, 7000/28000 and 7000/28000. Both sides reach 16800 operations, with normal operation-cap stops at every boundary. V12 images are verified existing evidence; V14 is rerun directly against V15.

At **1800**, V15's dark tail interior and red/ochre body have fuller connected masses and fewer open ribbons than V14. Standing-foot shape and lifted-toe gaps remain clean, with modest edge texture. It also introduces heavier early tail relief. At **5000/10000**, neck/breast feathers separate over a more coherent mass, while dark tail marks remain broader; the eye improves gradually rather than through a dedicated rule. At **15138/final**, V15 retains readable feet, silhouette gaps and useful broad marks. The eye is a small ring/accent and remains weaker than the source/V12; fine feather structure is still stylised and uneven. Final non-foundation counts are 71 large/232 medium/16485 small versus V14's 46/130/16612. The visible mass improvement, rather than these counts, supports retention.

The **160×112 thin curve**, at the recorded 360-operation budget, remains continuous with little surrounding pigment; no clear artistic win over V14 is claimed. The **192×128 blue/ochre fixture**, also at 360, has a more connected ochre body and larger coherent blue contacts, but visible broken background/interior contacts remain. It still falls short of V12's coherent construction, so white-background rooster gains do not establish general success.

Pigment and common Neutral are both included for every painting/checkpoint/crop pair. Neutral still reveals horizontal foundation bands and broad contact relief, including stronger early tail ridges. The common material/light was not adjusted to conceal those defects. Sources and whole paintings, feet/gaps, eye/face, neck/breast, tail and quiet background are provided. The portable ZIP contains the gallery and every referenced image, including both presentations; it is checked independently of the workspace's historical folders.

## Bounded detail diagnostic

After construction evaluation, an in-memory instrumented rerun verified **exactly the same final V15 strokes**. No diagnostic hooks are added to the studio/engine. Regions are explicitly recorded, rather than used as planning rules. [detail-diagnostic.json](artifacts/v15/detail-diagnostic.json) distinguishes attention, proposed regional improvement and global selection.

The 5×5 pupil region received 15 anchors, only six during detail work; 269 candidates had scoring support overlapping it. Fifty proposals offered positive regional and global structural gain; 48 selected an improving candidate. Eight selections missed a candidate with greater pupil-region gain. The larger eye region received 90 anchors/437 candidates, with 108 improving proposals and 107 improving selections; seven regional alternatives lost selection. No region-improving eye proposal was globally rejected. Neck separation received 858 anchors/3643 candidates; 995 globally/regionally improving proposals, 988 improving selections and four region-improving proposals rejected by global gain.

This rules out wholesale eye neglect or widespread rejection as the explanation. It does not show that the curved candidates represent the pupil/ring artistically: structural improvement can be diffuse, and direct late pupil attention is sparse. The limited selection losses, unchanged curved repertoire and sparse exact-feature attention do not identify one causal local remedy. Consequently **no second detail treatment** was added; isolated representation versus exact-feature attention remains unresolved. Increasing budgets or adding an eye rule would not resolve that attribution.

## Work and memory

Full V14 and V15 timing runs use separate fresh Node processes with matched settings. Measurements exclude diagnostic tracing and subtract checkpoint rendering from generation wall time. These are single runs, not a statistical speed benchmark.

| Final rooster | Frozen V14 decisions, fresh timing | V15 construction only |
| --- | ---: | ---: |
| Operations / accepted contacts | 16800 / 16800 | 16800 / 16800 |
| Proposals | 19368 | 18104 |
| Evaluated candidates / contacts | 58080 / 58080 | 54288 / 54288 |
| Rejected proposals | 2568 | 1304 |
| Measured step work | 19.31 s | 20.53 s |
| Generation wall, excluding checkpoint images | 19.64 s | 20.85 s |
| Sampled peak RSS | 225.3 MiB | 299.0 MiB |
| Sampled peak array buffers | 94.1 MiB | 99.7 MiB |
| Shared memory guard estimate | 160.8 MiB | 160.8 MiB |

V15 uses about 6.5% fewer candidates but about 6.3% more measured work in this pair. Its footprint fitting and broader affected paint are more expensive; fewer candidates are not equal compute. No speed improvement or memory reduction is claimed. RSS samples every 128 proposals include reference/analysis, patches, runtime and allocator retention; they are not an isolated planner allocation measurement. V15 adds bounded temporary geometry/property arrays, not persistent image-sized analysis arrays. [Full V14](artifacts/v15/v14-full-statistics.json), [full V15](artifacts/v15/v15-full-statistics.json) and [short statistics](artifacts/v15/short-statistics.json) include memory context and stops.

An approximately **matched measured-work** comparison uses the nearest accepted prefixes at 19.313 s: V14 16800 operations/58080 candidates versus V15 15764/50808. V15 still has fuller masses and clean feet, with somewhat less final refinement. This uses accumulated measured step time, not candidate counts or exported replay duration; single-run timing noise remains. Short fixture timings share one process and are descriptive only: thin V14/V15 .571/.603 s, contrast .481/.502 s. V12 timing is not compared across runs.

## Validation and remaining scope

Passed: five focused numerical groups, eleven maintained regressions and twenty real Chrome lifecycle groups across all three selectors. Checks cover frozen V12/V14 decisions and records (excluding measured runtime fields), continuation/local passes, deterministic V15, three-candidate work, exact canonical/feathered replay, local/full scoring, cancellation/Undo, recorded JSON and actual 2× PNG exports, historical import/timeline, immutable session provenance and preservation when changing next-run selection. Exact source comparison verifies that canonical changes are only dispatch/metadata and that V14's default fitting is unchanged. No unrelated UI matrix or Firefox suite was run.

Commands: `node build.cjs`, `node v15-test.cjs`, `node v15-regression.cjs`, `node v15-browser-smoke.cjs`, `node --expose-gc v15-experiment.cjs short`, `node --expose-gc v15-experiment.cjs full v14`, `full v15`, `node v15-experiment.cjs matched`, `node v15-diagnostic.cjs`, `node v15-gallery.cjs`, and `node v15-gallery-check.cjs`. Chrome ran with approved local execution. Tests and regenerated evidence write only under V15; historical runners are adapted without editing their evidence. The [extracted-package check](artifacts/v15/gallery-check.json) verifies resource hashes and all 56 images in each presentation without relying on historical folders.

Retain this bounded treatment for manual comparison. Coherent quiet-background recovery, semantically meaningful eye detail and relief bands remain unresolved. User visual approval decides adoption; V12 and V14 must remain available until that review.
