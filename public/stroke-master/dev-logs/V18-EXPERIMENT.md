# V18: bounded detail/tonal trial rejected

**Reject the tested repertoire change; preserve V17.** Replacing the third detail-stage curve with an existing compact dab does not visibly improve useful eye detail or portrait tonal coherence in the short matched comparisons. The studio remains **V14 (default) / V17**, material 2, quiet-body default/reset .25. There is no V18 generation option or alias. User visual review remains the adoption gate.

Open the [compact offline comparison](../artifacts/v18/comparison.html) or [portable ZIP](../artifacts/v18/v18-comparison.zip). It covers whole paintings, early/final checkpoints, eye/face, smooth tone, feathers/hair, outlines and canvas surroundings, with pigment and common Neutral. Interactive crops reuse the whole images rather than duplicating a large gallery. An equal-size portrait bitmap/replay comparison and bounded candidate/material-buffer traces are included.

## Controls and bounds fixed before treatment

Incoming Git was clean at `82a2bc4` (full commit in [freeze.json](../artifacts/v18/freeze.json)). HANDOFF, current README and V15–V17 reports were read; no applicable AGENTS file was found. All work stays inside stroke-master/. No reset, commit, branch change or historical-log rewrite occurred.

The frozen V17 engine and its three small planner sources are stored once in `archives/v18-control.zip`, with source/archive hashes. Existing historical source archives and full V16 painting records are reused. The full V17 diagnostic control regenerates exactly the existing V16 full strokes: 16800 operations, 18088 proposals, 54240 candidates, 1288 rejections. V17 already established exact V16 buffers/records; no redundant full control JSON is created here.

Reference pixels and recorded settings, not filenames, define comparisons. Seed 42, Fine detail, Balanced search, the recorded curated brushes and existing foundation/palette/material are constant within each pair. Rooster uses the unchanged 632×461 V8 input and explicitly historical body **.65**. The supplied `Taylor-Swift-in-the-woods-beautiful-blonde-singer_2560x1600.jpg` is available and suitable; a fixed Lanczos 640×400 planning PNG is preserved. Portrait and blue/ochre use current body **.25**. No substitute portrait was required.

Before evaluating treatment, the portrait budget was fixed as initial 1400 operations/5600 proposals, then +700/+2800 (2100 operations); conditional follow-up was +3900/+15600 (6000 total). Rooster short uses the same first two historical stages; blue/ochre uses 360/1440. Early checkpoints are 1800 / 180 respectively. No promising short result justified longer treatment runs, so the conditional portrait budget and extended rooster treatment were not used. Full-rooster tracing is control-only diagnosis, not an extended treatment comparison.

## Bounded diagnosis before the trial

The offline trace inspects actual candidates and cropped resulting RGB buffers at a compact rooster feature and a smooth portrait cheek. The full rooster ROIs are pupil `[550,67,5,5]` and eye `[542,59,22,21]`; portrait ROIs are eye `[345,116,19,15]` and cheek `[338,135,23,25]`. Coordinates appear only in diagnostics, never planner rules. Canonical blank-surface deposition identifies substantial alpha support above .08 separately from the padded scoring halo. Regional native-RGB squared-error improvement is a diagnostic, not the acceptance objective or an aesthetic score.

| Region | Exact anchors | Actual-support candidates | Halo-only candidates | Locally beneficial candidates | Beneficial accepted | Beneficial globally nonpositive | Beneficial losing selection |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Rooster pupil, full control | 9 | 38 | 263 | 32 | 10 | 3 | 19 |
| Rooster eye, full control | 82 | 268 | 375 | 260 | 93 | 6 | 161 |
| Portrait eye, 2100 control | 16 | 84 | 93 | 69 | 25 | 2 | 42 |
| Portrait cheek, 2100 control | 4 | 39 | 104 | 31 | 14 | 0 | 17 |

These categories do not all partition candidates: zero-gain ties can lose selection. Multiple useful sibling candidates commonly lose to another useful sibling; those losses are not proof of an acceptance bug. Low globally nonpositive counts argue against widespread rejection of useful local work. Pupil anchors occur once in construction and eight times in the final detail pass; direct precise attention is sparse even though many nearby candidates are offered. This supports investigating placement separately, but does not prove placement alone explains artistic readability.

Existing candidates are all curves. At pupil operation index 1410, the selected bright curve has width 1.35, path length 2.58, four substantial-support pixels, local RGB gain 111432 and objective gain .654865. The counterfactual dab using the same initial candidate inputs, seed and fitting has one support pixel, local gain 37770 and objective gain .211904. At index 10081, the original third hog curve collapses and has zero gain; a valid compact dab gains .044803 versus the selected fan curve's .028680. Thus a compact representation can help a particular offered anchor, but not universally.

The two cheek detail anchors have high directional coherence (.897/.921). At index 1201, the selected third round curve has width 2.02, length 8.82, 13 support pixels and local gain 209931; the compact counterpart has one support pixel, local gain 17464 and objective .126527 versus 1.030313. At index 1552, local gains are 370509 versus 104476; objective gains 1.812102 versus .431173. Compactness removes useful tonal correction area rather than solving the single-colour transition. Counterfactual generation restores RNG and diagnostic counters; the original full control strokes remain exact. Across direct detail anchors, the dab improves the original third objective at 3/8 pupil, 25/81 eye, 2/13 portrait-eye and 0/2 cheek anchors. It is one hypothesis, not a search over tuned variants.

## One tested intervention

Only candidate index 2, in passes 2/3, changes its existing gesture from `curve` to `dab`. The canonical dab makes a short contact of length .24×width and low taper .1. It retains the original candidate's variable width, brush, colour, single texture-seed draw and other settings, then passes through unchanged coherent fitting and V17 actual-support validation. It is an alternative in the same three-candidate shortlist, not a quota of tiny marks. Construction/middle curves, attention, stage allocation, palette/foundation, acceptance gain threshold, alpha .08, caps, four checks, .72 retries, .65 fitting floor, optimization, material and renderer remain unchanged.

No anatomy rules, anchor offsets, second placement treatment, mixing system, new brush/dependency/control, enlarged shortlist, depth/budget increase, global smoothing or relief change was added. The trial lives only in archived offline diagnostic tooling. Its evidence records correctly identify **planner 18/material 2** and can replay as historical documents; generation is unavailable in the studio. They are never relabelled as V17 controls.

## Matched short results and cost

| Fixture / side | Operations | Proposals | Candidates | Rejects | Step seconds | Generation seconds | Replay + both PNG seconds |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Rooster V17 | 2100 | 2171 | 6489 | 71 | 4.667 | 5.269 | .839 |
| Rooster trial | 2100 | 2164 | 6468 | 64 | 4.631 | 5.232 | .722 |
| Portrait V17 | 2100 | 2170 | 6486 | 70 | 5.263 | 5.748 | .816 |
| Portrait trial | 2100 | 2168 | 6480 | 68 | 5.239 | 5.709 | .812 |
| Blue/ochre V17 | 360 | 376 | 1104 | 16 | .710 | .798 | .109 |
| Blue/ochre trial | 360 | 375 | 1101 | 15 | .678 | .752 | .102 |

These are one uninstrumented observation per side in control/trial order, not a speed claim. Generation includes analysis; checkpoint replay/export time is excluded. Final replay/PNG is separately measured and includes both presentations and PNG encoding. Work is closely matched (3–21 candidate evaluations difference) but exact proposal counts differ as acceptance changes. Fixed-anchor counterfactuals additionally compare the exact same sampled inputs. Trace timing is instrumented and excluded. Peak/retained memory was not measured; no memory improvement is claimed.

The trial accepts 70/44/18 dabs on rooster/portrait/fixture. That proves availability, not artistic usefulness. At early and final checkpoints, rooster dark tail/body masses, feathers and foot gaps remain broadly similar; the eye remains a weak dark accent. Portrait contours and directional hair remain recognizable, but the face retains conspicuous discrete single-colour facets. Blue/ochre retains fragmented quiet background coverage. No clear new boundary spill or meaningful broad-character loss was identified in these short comparisons; no late-quality guarantee follows. The structural objective worsens 7.63%, 4.03% and 4.31%, respectively. Numerical deterioration supports caution but does not replace the visual result.

## Pigment, preview and larger replay are distinct

Actual replay before/after the two selected cheek contacts lowers material RGB squared error from 2345000 to 2147406, and 2117540 to 1749120. These are actual pigment improvements, not just predicted structural gains. Maximum local height changes are only .03722 / .02890; the existing height range remains .831–2.698. Common Neutral still exposes underlying ridge character after useful colour correction. The trace does not attribute every visible ridge to the latest thin contact.

The export diagnostic uses the same 2100-operation records and common lighting at **1280×800 on both sides**: Chrome high-quality enlargement of the 640×400 rendered bitmap versus canonical stroke replay at 1280×800, lighting scale 2. The gallery displays both at equal sizes and crops equally. Frozen V17 mean absolute RGB difference is 2.922 pigment / 3.096 Neutral over the whole output, and 5.101 / 6.001 over the cheek. Difference magnitude is not a quality metric.

Visual inspection finds harder colour facets in larger replay even with relief disabled; Neutral additionally exposes directional ridge/texture differences. Thus this is partly resolution-dependent stroke representation and partly material presentation. It cannot be diagnosed solely as insufficient attention or hidden by planner tuning. Uniform single-colour contacts have limited smooth-gradient expressiveness. Renderer consistency and future mixing remain deferred, explicitly recorded in [KIV-v18](KIV-v18.md).

## Validation, preservation and delivery

All canonical engine/planner/app/worker/material/lighting/styles/lab/build sources and all incoming dev-logs remain hash-identical. The preserved runtime contains no trial hooks, selector option or alternate application. Five maintained numerical groups pass: both body settings, exact V16/V17 decisions and Continue/local/Undo; all canonical brush alpha/support/caps/feathering; retries/exhaustion; unchanged V14 and historical replay; local/full scoring and exact replay. Six short evidence records replay exactly to their exported pigment PNGs. New V18 sessions are explicitly rejected.

Nineteen real Chrome lifecycle groups pass for V14/V17: default/reset .25, immutable Paint binding, next-Paint selection, Continue, pointer-target refinement/Undo, pause/resume/cancel, stale-job-safe lifecycle, timeline, historical V12/V13/V15/V16 imports, JSON provenance, actual 2× full and current-frame PNG exports. Additional Chrome checks cover all gallery crops/checkpoints/lights, every packaged image, equal-size export views, and independent import/reexport of rejected planner-18 evidence. Portable ZIP CRC/hashes and independently extracted browser review pass. An initial gallery run passed assertions but hit a transient Chrome-profile cleanup lock; a bounded verified-directory cleanup retry and rerun completed successfully.

Regeneration exposed an incoming generated-only studio CSS declaration (`.view-title` height 28px) absent from styles.css. Its exact incoming declaration was preserved after the build check; no unrelated styling change or source synchronization was made. Generated pages match incoming Git content. Rebuilding without handling that pre-existing discrepancy would discard the user's style; this is documented in the current handoff.

Temporary trace/trial/export/buffer tooling and superseded diagnostic image intermediates are verified in `archives/v18-diagnostics.zip`, with exact restore paths in `artifacts/v18/diagnostic-archive.json`. Frozen control sources are separate. Active test dependencies, six evidence records, compact images/JSON, prior archives, user assets and historical reports remain. No broad housekeeping occurred. **Reject this candidate change, retain V17 unchanged, and use the evidence to choose a later independently bounded placement or representation experiment after user review.**
