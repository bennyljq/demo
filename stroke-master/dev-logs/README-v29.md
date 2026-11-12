# V29 ? Right Paint

Offline single-colour fitting for fixed V27/V28 contacts. Decision: pause this candidate approach; colour fitting modestly helps medium contacts and existing controls but leaves broad weaknesses unresolved. No production integration.

Implementation: experimental/footprint-colour.js; runner v29-study.cjs; paired gallery v29-gallery.cjs; focused checks v29-test.cjs. Uses shared engine and unchanged V27 freeze/measure. No duplicate renderer/scorer.

Existing declaration and unused confirmation cases must be preserved. Reproduce from stroke-master/:

```text
node v29-study.cjs run
node v29-gallery.cjs
node v29-test.cjs
```

For a fresh scratch checkout before any results, node v29-study.cjs declare hashes controls and freezes the unused confirmation set. Do not redeclare existing evidence. node v29-study.cjs confirm checks the fixed development gate and refuses expansion here. No browser or full painting run required.

111 primary fits/evaluations; original and repeat verification tracked separately. All13 development cases and111 paired comparisons in [gallery](../artifacts/v29/comparison.html). Actual footprints unchanged. Native fit is approximate; unchanged canonical gain determines eligibility. Reused cases are development evidence, not independent generalisation. [Report](V29-EXPERIMENT.md).
