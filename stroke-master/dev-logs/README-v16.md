# Stroke Master V16 evaluation

This document records the V16 operational state. Open `../index.html` for the standalone studio, `../brush-lab.html` for brush studies. Both work from disk. Sources and all work live inside stroke-master/.

Four comparison planners are available: V12 control (planner 11/material 2, no V13 penalty), V14 experimental (planner 14, **default**), V15 experimental (planner 15), V16 experimental (planner 16). V14's new-session default is explicitly user-approved; V16 is not promoted. See [V16-EXPERIMENT.md](V16-EXPERIMENT.md) and [gallery](../artifacts/v16/comparison.html).

Paint captures the chosen planner. Continue, Resume, targeted refinement and Undo retain it. Changing next-run selection preserves the current painting, reference, seed and settings. Selection is disabled during generation. Active-painting provenance remains separate from the next-run choice. Imports replay their recorded strokes/material independently of the selector. Cancellation, timeline, full/current-frame PNG and JSON exports retain the shared implementation.

V16 shares V14 construction and V15 trimming, then performs at most four canonical support checks per candidate. It narrows only a failing final contact and rejects an unresolved one as empty geometry. It retains the three-candidate shortlist and all shared analysis, material, scheduling and scoring. No reference clipping, protection mask, penalty or extra detail treatment is introduced. The crown halo improves; the demonstrated coarse-compatible toe artifact remains. Measured step work is about 53% higher than V15 at 16800 operations. Recommendation: revise before adoption, keep experimental comparison available.

From stroke-master/:

```sh
node build.cjs
node v16-test.cjs
node v16-regression.cjs
node v16-browser-smoke.cjs
node --expose-gc v16-experiment.cjs short
node --expose-gc v16-experiment.cjs full v15
node --expose-gc v16-experiment.cjs full v16
node v16-experiment.cjs matched
node v16-gallery.cjs
node v16-gallery-check.cjs
```

Current checks write only to artifacts/v16/. Chrome must be locally runnable. The numerical suite checks unchanged incoming V12/V14/V15 against frozen implementation bytes and verifies historical hashes or their verified archive entries. The V7 regression assertions and V14 browser lifecycle runner remain active dependencies; their adapters select the intended planner and redirect outputs. Fixtures, canonical helpers, CDP and PNG decoding remain shared.

Historical runners/evidence through V15 are preserved in `../archives/history-through-v15.zip`. Restoration paths and hashes are in `../artifacts/v16/housekeeping.json`; extract into stroke-master/ to recover original relative paths. Archived runners describe prior versions and can overwrite their historical outputs; use current commands above. Original user assets and append-only dev-logs remain untouched. V14/V15 original galleries and sources needed for manual comparison stay available.

`engine.js` owns canonical analysis, numerical helpers, V12 control, explicit dispatch, records and replay. `experimental/v14-planner.js` is the shared constructor/original fit; V15 provides trimming and an optional final callback; V16 supplies final support validation. The worker protocol, lab UI, lighting, styles and renderer remain shared. Regenerate both HTML pages after editing source.
