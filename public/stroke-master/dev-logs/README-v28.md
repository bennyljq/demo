# V28 operational snapshot

V28 is an offline Local Form feasibility follow-up. **Reject this constructor for broad repair:** 33 contacts across all 13 V27 regions, 23 positive, with genuine medium-scale wins; only one of three large contacts is positive and broader coverage remains weak. No production/access/archive changes. Stable V12/V17 and Experimental V22 default remain unchanged.

[Gallery](../artifacts/v28/comparison.html) · [Report](V28-EXPERIMENT.md) · [KIV](KIV-v28.md) · [Design](../artifacts/v28/design.json).

From `stroke-master/`:

```sh
node v28-study.cjs run
node v28-gallery.cjs
node v28-test.cjs
```

`run` reconstructs the exact V27 states, checks frozen evidence/policy hashes, reuses and verifies control metrics, evaluates at most three local contacts, repeats metrics, and writes V28 only. `declare` is for fresh evidence before evaluation and refuses an existing design. One local geometry implementation is retained. Gallery controls link to V27; preserve both artifact folders together. No build or browser matrix is required because production sources/pages are untouched.

The focused test reuses `v27-test.cjs` in memory while directing its output into `artifacts/v28/retained-tests.json`; it never invokes V27 evidence writers. The original handoff remains an unchanged suffix. No reset, commit, new painting run or archival reorganisation.
