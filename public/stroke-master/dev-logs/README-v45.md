# V45 — expressive charcoal deposition foundation

**Foundation review, not promotion.** V45 can construct with curved paths and
changing contact/pressure; it is no longer limited to straight decorated stamps.
The resulting vocabulary is **not yet a convincing general foundation**: broad
directional bands, short join patches and bright-region spill remain, and the real
reference cost is high. V41 stays default. No commit or full refinement campaign.

[Replayable foundation review](../artifacts/v45/foundation.html) ·
[Compact review package](../artifacts/v45/foundation-review.zip) ·
[Representation/proposal audit and artist sources](V45-AUDIT.md).

## What changed

New identity: planner45 / material7 / charcoal-stick-5. A cubic spatial gesture has
explicit width, pressure, asymmetric bias, contact-angle loading, longitudinal
loading and unequal termination profiles. Physical contact is separate from the
fitted strength. Quiet shading has minimal contact variation; broken contact has
seeded, smoothly changing irregular channels. Tooth stays paper-anchored. Texture
changes deposited quantity, follows contact, and is not an overlay or copied atlas.

The planner no longer rebuilds broad paths as lines, ties length to width, or fixes
all broad pressure profiles to one. Seven bounded Balanced hypotheses include long
slender, short broad, straight shading and evidence-guided curved side gestures.
Residual scans supply width/pressure evolution; target ridge/tangent evidence guides
curvature. A fixed-anchor counterfactual exposed a useful unproposed longer sweep;
one broad travel bound was widened, without extra candidates or an objective change.
Fit, score, application and replay use the same contact. V45 distance-based curved
support corrects projection wedges and deposits once per pixel at self-near portions.

Bias, contact-angle and longitudinal-loading evolution are still authored-only.
Broken broad contact is also a renderer capability, not a distinct Balanced
hypothesis. These remaining proposal gaps are documented rather than counted as
planner successes. A single cubic cannot represent discontinuous corners or
arbitrary multi-turn gestures.

## Review and results

The study is organized by nine capability pairs (three seeds, light/dense contact),
five tonal/overlap passages, seven actual analytic targets (two seeds), compact
representation/selection ablations, and Mat/rooster/Rainier plus frozen Orca.
Hand-authored marks and actual planner choices are labelled. Inspect every gesture
with the slider and its path/profile display; indices 1/25/50/100/150/200 are fixed
representative samples. All real cases reach 200 accepted operations and expose
25/50/100/200 prefixes with consistent crops. Analytic cases can stop earlier.
Equal-operation views use the shorter available prefix, without padding records.

Both control and challenger disable blending/lifting in this **diagnostic mode**.
Historical normal behavior remains intact. No other operation rescues these images.

| Prepared640, seed42, 200 deposits | V44 RMSE | V45 RMSE | V44 / V45 planning wall |
|---|---:|---:|---:|
| Mat | 61.32 | 39.01 | 3.26 / 8.95 s |
| Rooster | 30.85 | 32.61 | 1.84 / 7.75 s |
| Rainier | 39.70 | 37.44 | 2.52 / 7.08 s |
| Orca holdout | 32.26 | 29.66 | 5.24 / 8.29 s |

At V44's measured 200-deposit time, V45 uses 46/35/49/128 deposits respectively,
with RMSE 70.41/43.74/47.06/30.61. Thus equal-operation improvement on Mat/Rainier
does **not** establish matched-time improvement; only Orca improves this final
matched-time error comparison. Earlier sampled matches are mixed. Two serial,
reverse-order Mat timings confirm approximately 2.73–2.74× planning cost
(V44 3.25–3.26 s; V45 8.88–8.95 s). No timing extrapolation is used.

The broad-band test at 50 deposits improves from 18.95 to 12.86 RMSE. At the same
50 deposits, straight/profile and legacy-proposal ablations are 19.91 and 19.00.
On taper: 18.06 control, 13.72 V45, 18.38 straight/profile and 18.36 legacy proposals.
Later taper results are mixed: seed42 ends 13.28 versus 13.04; seed73 11.43 versus
10.68. Adjoining regions regress in both seeds. Straight and thin-curve controls
are included to expose cases where extra complexity does not help.

Assess the four axes separately:

- **Quality:** larger useful tonal coverage on Mat; broad curve continuity improves;
  rooster regresses in error; adjoining and taper remain problematic. Bright spill
  increases on the real references. At 200, the fraction of target pixels >220 that
  become >12 tone units too dark is Mat .049→.739, rooster .062→.105, Rainier
  .720→.964, Orca .786→1.000. This metric has a small/highly case-dependent light
  denominator and is not an artistic score, but clearly prevents a preservation win.
- **Expression:** real curved side contacts, tapered entry/exit and pressure changes
  are used. Curved accepted counts are 38/96/75/90 of 200 on the four V45 references;
  the diagnostic threshold is control-point departure >max(.8px,.07×envelope width).
  Those counts are not diversity targets. Quiet dark masses still show aligned
  broad bands and joins; accent fragments can look clipped or overassertive.
- **Economy:** earlier tone/structure can be established with fewer deposits in
  analytic bands and Mat. Wasted spill and disconnected short corrective patches
  remain; equal-operation benefit alone is insufficient.
- **Compute:** V45 reference evaluations are 1904/2541/2268/3199 versus
  1407/1561/1582/2401 control. Mat performs 1904 fits over 3.79M contact samples,
  22.81M score-patch pixels and 3.33M nonzero score-support visits; fit and score
  raster times are 2.94 and 2.88 s. Proposal time 2.98 s **includes** fitting.
  Larger/finer curved supports cost work even with seven candidates. Analysis,
  snapshots, PNG encoding and display are excluded from planning wall.

## Validation and recovery

Focused checks pass: seeds42/73 in Fast/Balanced/Thorough; exact live/native/2× replay,
non-monotonic timeline seeks, patch/full objective agreement, profile/cache identity,
overlap ownership, target feather/Undo and material validation. Frozen incoming oil
v12/v17/v31/v33 and charcoal40–44 decisions, RNG, continuation, material and replay
are exact. Browser checks cover all capability/target selectors, 480px layout,
V41/default historical controls and all33 historical studies (now lazily expanded).

Extract the compact package and open `foundation.html`; it needs no server, source
reference or network. `node restore.cjs mat-charcoal45-42 100 2` regenerates a native
2× prefix. It restores artwork, not optimiser state. Hash manifest, frozen renderer,
operations, target views, measurements and checks are included. Independent extraction
passes 191 pixel comparisons, including both material identities at native2×.
Generated bulk and
prototype records are ignored outside Git. Reproduce with `node v45-study.cjs`,
`node v45-diagnose.cjs`, `node v45-build-review.cjs`; run `node v45-check.cjs` and
`node v45-browser.cjs`. Prepared640 source PNGs reuse the existing V44 preparation.

Stop here for human review. The new representation is materially broader, but
remaining repetition, spill and measured cost do not support full-painting promotion.
