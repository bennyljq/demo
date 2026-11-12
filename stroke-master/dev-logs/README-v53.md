# V53 — V52 charcoal in the five-stage painter

V53 carries the approved V52 loading, pressure-dependent tooth, release and independently pivoting stick face into ordinary painting. It is a useful material prototype, **not a promotion recommendation**. V44 remains stable/default; V53 is the selectable challenger. V50/V51 remain archived and retain their renderers. No commit was made. Oil and studio layout are unchanged.

Open [Charcoal Studies](../charcoal-studies.html), the [production comparison](../artifacts/v53/comparison.html), or the [frozen V52 gallery](../archives/charcoal-studies-v52/index.html). The comparison renders 25/100/200 prefixes, initial/refined allowances, reached boundaries, matched wall time, and seven actual alternatives at fixed states. Stage targets can be rendered alongside the paintings. JSON recovery buttons export source-free artwork at the selected prefix.

## Material and proposals

The new identity is planner53 / material12 / charcoal-stick-10. It uses one scalar charcoal coverage and `249 - 230 × coverage` for display. All V53 deposits use the V52 finite-face contact; no historical rectangular candidate is available inside V53. Historical documents dispatch through their original identities.

`charcoal-contact-v53.js` retains the frozen V52 noise, sampling and contact equations. Rotated row intervals avoid rejected corners; immutable anchored tooth is calculated lazily and cached, with a 16 MiB LRU ceiling. Thirteen reusable Float32 fields hold at most twelve fitted alternatives plus one replay field. Each field is bounded to 1.5 million pixels; a gesture is bounded to 4096 internal samples. Memory estimates reserve this storage before sessions/exports. Accepted operations release their private cached field and serialize only parameters.

Production units scale uniformly from the reference's longest edge / 640. Travel, face width, tooth and stick orientation use the same scale; non-square references retain their aspect ratio. Pressure forms a nonlinear realised footprint first. Least-squares fitting then adjusts **quantity**, without altering pressure or seed. Scoring and application reuse that footprint. Deposits, lift and erase share the coverage convention. Production blending replaces V52's nonconservative masked average with symmetric pairwise exchanges of existing charcoal. Blank paper stays blank and targeting seals exchanges at its boundary. Tests verify quantity conservation within Float32 tolerance; this is a simple redistribution model, not physical dust simulation.

Proposals follow reliable local structure or target level sets, with residual-dependent lengths, widths, cross-loading, pressure evolution and terminations. Ambiguous passages use a coherent target mass axis and a perpendicular alternative, without V51's seeded direction field. Balanced search proposes broad deposit/lift, release, angular contact, slender definition, erasure and blending in every stage. Stage five retains long definition and broad corrections. Thorough search adds profile/direction alternatives; fast search is intentionally smaller. There are no family quotas, novelty bonuses, authored stamps or hidden multi-deposit gestures. A counted operation is one uninterrupted contact; gallery sequences disclose their distinct deposits.

V50's attention, tonal objective, bounded search, five Gaussian targets and gate defaults are unchanged. Gate polling, edits, reset, Pause/Continue and local refinement retain the existing lifecycle.

## Visual gate and completed comparisons

The first Mat/rooster/Tay prefixes exposed overly repeated parallel construction. Target-following passages, independent angle evolution and broader pressure/release profiles were revised and inspected at 25/100/200 before full runs. These prefixes now show overlapping charcoal mass, varied loaded edges and staggered release. Early likeness remains weak because the assessed first target is heavily blurred. A later trial with still wider contacts did not improve convergence; it was reverted. Development used Mat and rooster, then engine/material/proposals/gates were SHA256-frozen before full Tay/Rainier runs. The freeze manifest is included in recovery.

Fixed-state evidence distinguishes proposal quality from selection. At rooster operation 25, release gains 177.5 versus broad shading 150.3 and is selected. At operation 200, blending gains 16.0 versus release 7.3 and shading 3.5. Mat operation 200 selects shading at 63.6 over blend 59.3. Useful material proposals can win the unchanged tonal objective; no objective/gate change was justified. These examples do not establish that all later choices are artistically good.

All runs use balanced search, seed42, **1400 initial + 1400 additional accepted operations**, seven evaluated alternatives per proposal. Every run reaches stage five; reaching it does not mean final criteria were met.

| Subject | V50 initial RMS | V53 initial RMS | V50 final RMS / wall | V53 final RMS / wall | Final criteria V50 / V53 |
|---|---:|---:|---:|---:|---|
| Mat | 11.86 | 26.07 | 7.33 / 7.15 s | 11.59 / 8.20 s | yes / yes |
| Rooster | 21.73 | 38.18 | 13.90 / 9.54 s | 20.64 / 9.78 s | no / no |
| Tay | 11.24 | 19.39 | 8.25 / 15.31 s | 9.31 / 16.75 s | yes / yes |
| Rainier | 20.79 | 23.94 | 18.04 / 10.30 s | 19.48 / 12.21 s | no / no |

Mat seed73 reproduces the trade-off: V50 RMS7.21 / 7.26 s; V53 RMS11.54 / 8.42 s, both criteria met. At the common wall allowance V50 reaches 2800 operations; V53 reaches Mat1951, rooster2623, Tay2062, Rainier1276 (seed73 Mat1923). The gallery truncates the slower stream at its last completed operation before that allowance. It does not change operation budgets or stage gates.

V53 preserves visible stick character into refinement. Tay retains a recognisable face and selective dark accents, but visible planar corrections remain in the hair and forehead. Rainier retains the tree and mountain silhouettes, but sharp light corrections fragment the foreground. Mat loses fine facial modelling and light preservation relative to V50. Rooster retains charcoal feather construction but weaker final definition. Broad/lift/blend corrections consume operations that V50 spends on detail. Thus material character survives, while final quality and economy need further work.

The light-damage diagnostic counts original target pixels above220 whose painting is over12 darker. Mat: 10.66% V50 vs32.13% V53; rooster6.06% vs9.28%; Rainier71.24% vs80.24%. Tay has only **one** eligible pixel, so its100% result is not a useful light-preservation statistic. This diagnostic is separate from unchanged acceptance/gates.

## Cost and verification

Native 640×300 tests compare all39 frozen V52 specimens (13 families × three seeds). Deposit/lift/erase density is **exactly equal**. Display rounding can differ by one byte at half-integer ties; production replay/export agree exactly. Rub intentionally differs as documented above. Representative cold native costs: side71→51 ms, release55→36, angular39→28, quiet45→22, overlap144→66. Slender/hatch can be slower; no uniform speedup is claimed. Side contact keeps261 samples while visits fall from1,409,380 to299,338.

| V53 run | Internal samples | Contact raster visits | Formed field pixels | Tooth calculations |
|---|---:|---:|---:|---:|
| Mat | 704,038 | 112,143,275 | 27,788,540 | 202,500 |
| Rooster | 561,341 | 113,040,246 | 38,581,690 | 231,926 |
| Tay | 711,749 | 248,766,230 | 60,212,028 | 327,680 |
| Rainier | 522,908 | 164,603,958 | 39,877,164 | 229,760 |

These counts include candidate formation, not just accepted marks. Fit pixels range9.56–21.87 million. Actual reused field storage peaks0.33–0.69 MB plus1.62–2.62 MB tooth in these native runs; ceilings are larger. Visits exclude fitting/scoring and blend neighbour work. Complete wall time includes initial analysis, proposal construction, formation, fitting, scoring, application and gate transitions. Evidence encoding and PNG writing are measured separately and excluded; diagnostic alternative scoring is included. Timings are single-machine observations, not statistical performance claims. Fit time overlaps proposal time and must not be added to it.

Checks pass seeded determinism at all depths, exact native/2× replay, realised-footprint gains, incremental score/tile agreement, Continue, targeting/Undo, gate edits/reset, and frozen generation/Continue/replay for oil v12/v17/v31/v33 and charcoal40–51. Real browser checks cover the worker lifecycle, source-free import, actual native/2× PNG export, current/frozen galleries, and comparison alternatives with network disabled. Full benchmark arrays and intermediate images remain ignored outside Git.

## Reproduction and recovery

From the checkout, run:

```powershell
node stroke-master/build.cjs
node stroke-master/v53-material-check.cjs
node stroke-master/v53-check.cjs
node stroke-master/v53-browser.cjs
node stroke-master/v53-gallery-browser.cjs
node stroke-master/v53-study.cjs
node stroke-master/v53-study.cjs --regression
node -e "require('./stroke-master/v53-study.cjs').run('mat','charcoal50',{seed:73});require('./stroke-master/v53-study.cjs').run('mat','charcoal53',{seed:73})"
node stroke-master/v53-build-review.cjs
python stroke-master/v53-package.py
```

The package inventory measures actual uncompressed gallery/review assets, including all ten lossless streams, four original references, frozen V52 display photographs and renderer dependencies; the measured total is **9.58 MB uncompressed**, below10 MB. Optional studio/reproduction tools bring the full recovery package to about10.68 MB uncompressed (5.45 MB ZIP). No prefix snapshots or duplicate accepted streams ship. `recovery-package.zip` includes the studio, checks, frozen baseline and source references for reproduction. Extract separately, open `charcoal-studies.html` or `artifacts/v53/comparison.html`, and use Recover JSON to import a selected prefix into `index.html`. Imported artwork replays without the target; live optimisation/Continue requires starting a new painting with the target. No saved optimiser state is claimed. Historical bulk links require the original checkout. See `gallery-bytes.json` and `OPEN-FIRST.txt` in the package for inventory and instructions.
