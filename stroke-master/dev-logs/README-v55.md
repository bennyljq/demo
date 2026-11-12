# V55 ? Scale-aware evaluation of charcoal

V55 is **not adopted**. Same-scale analysis corrects a real incentive to smooth material, but this bounded experiment loses facial modelling, reference-supported edges and compute economy. The final drawings do not justify the extra work. V44 remains stable/default; frozen V54 remains the existing challenger. Oil and studio controls are unchanged. No automatic promotion or commit occurred.

Open the [production comparison](../artifacts/v55/comparison.html), [Charcoal Studies](../charcoal-studies.html), or [offline recovery](../artifacts/v55/recovery-package.zip). The comparison offers 300/1400/2800, matched 5600 Tay, actual transitions, matched-time views, original references, diagnostic crops and lossless artwork JSON. Frozen [V52](../archives/charcoal-studies-v52/index.html), [V53](../archives/charcoal-studies-v53/index.html) and [V54](../archives/charcoal-studies-v54/index.html) material examples remain available. Historical bulk links require the original checkout.

## Cause and causal comparisons

The causal control uses V53 material/proposals plus V54 early gates, with V54 final tolerance removed. Full frozen V54 is a separate comparison. Fixed states and a 64-operation Stage 1 run keep the stage assignment fixed; promotion experiments are reported separately. Geometry, pressure, seed, attention, candidate budgets and search depth are unchanged.

Immediately before legacy Tay operation 1400, the pixel-winning blend improves pixel error by 1.259 normalized squared-error units, but worsens coarse mass RMS from 5.478 to 5.484 and lowers low-structure grain RMS from 3.603 to 3.521. Same-scale quantity fitting sets that blend to zero. This is direct evidence of the objective rewarding texture removal, not just a blend count. Some blends remain useful: Mat before 600 retains positive coarse blend gain. Early Tay blending improves reference-edge error more than the scale-fitted deposit, so preserving every mark would also be wrong.

The shared 64-operation run improves broad mass RMS from 8.752 to 6.135 under scale evaluation versus 7.763 under pixel evaluation. However, reference-edge RMS worsens to 5.525 versus 5.061. More texture is accompanied by incorrect structure. Full trajectories show repeated coarse broken contacts being repaired by finer stages, rather than a clear reduction in equivalent rebuilding. Counts below describe actual stage allocation and do not establish waste on their own.

## Precisely what changed

Stages 1?4 compare `G?(native canvas)` with the existing target `G?(reference)`. Sigma fractions remain .035/.0175/.00875/.004375 of the longer side; the finite separable Gaussian has radius `ceil(3?)`, normalized weights and replicated real-canvas boundaries. The target is never blurred again. Stage 5 initially compares raw canvas/reference, without V54 tolerance. Native material12/stick10 rendering is untouched.

Quantity is fitted at fixed native contact geometry using the full filtered delta. Every affected pixel in the expanded support contributes to evaluation and cache updates, including outside the native mark. The unchanged attention sampler continues to use raw stage residuals. Analysis buffers are separate from artwork. Existing target storage uses Float32 intermediate rounding; analysis uses Float64. The tiny target rounding difference is disclosed rather than presented as bitwise equality to a mathematical Gaussian.

Small kernels use direct sums; larger kernels pack two real scanlines into cached complex FFT plans. Filtering is exact finite convolution within double precision, not an approximate Gaussian. There is one scale per stage, bounded patch work and no full-canvas filter per candidate. Original proposal fitting remains, followed by scale quantity fitting, so its cost is included. A conservative certificate bounds provisional gain error from native Float32 raster rounding. The winning candidate and every overlapping contender are evaluated from the realised native delta before acceptance. Cache/full-score and independent direct-filter checks agree. Buffers are weakly held and cleared after acceptance; memory estimates include analysis and patch work.

## Promotion calibration and rejected alternatives

Keeping pixelwise promotion gates while changing scoring leaves Tay in Stage 1 until 2624 operations. The painter cannot efficiently satisfy a raw equality requirement using a coarse objective. Initially filtered global gates 3.6/3.2/3/2.8/5.5 and regional 6/5/4.8/4.6/10 also overconstrain construction; Mat is still in Stage 3 at 2800.

Inspected Tay/Mat construction states motivated the bounded revised schedule: **global 6/5/4.5/4/5.5%, regional 10/8/7/6.5/10%**, 95th percentile, three qualifying checks and accepted-operation evidence retained. This is not equivalent difficulty to the old pixel limits. Actual V55 native 500 states fail both mass and regional limits; at 700 global mass is coherent but regional error still fails (Tay 12.36%, Mat 10.23%). Actual first qualifying transitions occur at Tay 896 (3.11/6.32%) and Mat 832 (3.09/6.62%). These states have adequate coarse masses, yet the native drawings contain strong broken errors that the gate does not judge.

Synthetic development checks reject wrong broad values, missing upper structure and broad halos. A deliberately darkened sparse highlight state on Tay nevertheless passes (2.77/5.99%); Mat's larger light damage fails. This exposes a remaining safeguard weakness. It is **not** evidence that these thresholds are safe for production. No regression-reference tuning or extra objective was added to rescue the result.

At actual V55 Tay operation 2800, the winning ordinary Stage 5 blend lowers local grain RMS from 8.029 to 7.007 while improving reference-edge RMS only from 2.952 to 2.926. The best lift improves edges more (2.825), but offers less pixel gain (0.343 versus 0.805). This is a concrete late texture-removal decision, with some tonal repair rather than pure waste. Ordinary Stage 5 substantially removes earlier texture: Tay ends at grain RMS 2.39, with worse edges than frozen V54. One narrowly bounded sigma-1 final extension was tested. It mixes filtered error with raw error using reliable reference gradients and bright/dark reference values, not sharp canvas edges. Fitting, acceptance, caching and qualification use that same weighted metric. The numeric 5.5/10 limits then have different meaning; raw metrics are reported separately. Its improvement is inconsistent: revised-gate Tay grain falls to 2.35, and Mat modelling remains incomplete. The extension is rejected and disabled by default. No new perceptual optimiser, texture reward, quota, cooldown or forced accents were added.

## Complete drawings

Original-reference RMS is in 0?255 tone units. Grain is raw minus G1.2 canvas in low-reference-structure regions; edge error compares G2 gradients on reliably structured reference regions. Neither is an artistic score. ?Criteria? is the relevant painter's final gate, not an assertion of equal difficulty.

| Subject | Painter | Operations | Original RMS | Grain RMS | Ref-edge RMS | Criteria |
|---|---|---:|---:|---:|---:|---|
| tay | gate-only | 5600 | 6.48 | 1.99 | 1.33 | yes |
| tay | V54 | 5600 | 6.81 | 2.36 | 1.33 | yes |
| tay | V55 | 5600 | 7.25 | 2.39 | 1.56 | yes |
| tay | V50 | 5600 | 6.37 | 2.62 | 1.10 | yes |
| mat | gate-only | 2800 | 11.15 | 4.07 | 2.95 | yes |
| mat | V54 | 2800 | 11.15 | 4.07 | 2.93 | yes |
| mat | V55 | 2800 | 21.37 | 8.00 | 5.22 | no |
| mat | V50 | 2800 | 7.33 | 1.60 | 1.86 | yes |
| rooster | gate-only | 2800 | 16.38 | 2.70 | 4.34 | no |
| rooster | V54 | 2800 | 16.38 | 2.72 | 4.34 | no |
| rooster | V55 | 2800 | 18.95 | 4.00 | 5.27 | no |
| rainier | gate-only | 2800 | 19.89 | 5.12 | 3.79 | no |
| rainier | V54 | 2800 | 19.89 | 5.12 | 3.79 | no |
| rainier | V55 | 2800 | 24.27 | 6.92 | 5.06 | no |

Native review confirms the numeric warning: V55 Mat has damaged white facial passages and unresolved modelling; rooster loses purposeful feather structure; Rainier retains abstract broken masses without sound light modelling. Tay becomes recognisable, but is not an artistic improvement over full V54 or the directional V50 benchmark. Soft and sharp passages do not coexist as purposefully as requested. Mat seed 73 also regresses and misses final criteria, so the result is not an isolated seed-42 failure. V50's 2800 prefixes match the frozen finished artworks exactly; its historical contact is preserved rather than substituted into V55.

Treatment source/settings were hash-frozen before rooster/Rainier. Their regression results were not used to alter the treatment.

| Subject | Painter | Stage 2/3/4/5 entry operations | Operations in S1/2/3/4/5 | Blends in S1/2/3/4/5 |
|---|---|---|---|---|
| tay | gate-only | 672/800/960/1216 | 672/128/160/256/4384 | 357/83/72/122/1455 |
| tay | V54 | 672/800/960/1216 | 672/128/160/256/4384 | 357/83/72/122/1446 |
| tay | V55 | 896/1152/1664/2272 | 896/256/512/608/3328 | 41/34/140/201/1378 |
| mat | gate-only | 768/928/1216/1696 | 768/160/288/480/1104 | 311/67/110/177/392 |
| mat | V54 | 768/928/1216/1696 | 768/160/288/480/1104 | 311/67/110/177/387 |
| mat | V55 | 832/1152/1792/2656 | 832/320/640/864/144 | 15/19/90/177/96 |
| rooster | gate-only | 384/512/832/1376 | 384/128/320/544/1424 | 153/37/67/163/230 |
| rooster | V54 | 384/512/832/1376 | 384/128/320/544/1424 | 153/37/67/163/228 |
| rooster | V55 | 640/832/1312/1856 | 640/192/480/544/944 | 23/9/21/42/238 |
| rainier | gate-only | 512/608/768/1120 | 512/96/160/352/1680 | 265/56/61/138/207 |
| rainier | V54 | 512/608/768/1120 | 512/96/160/352/1680 | 265/56/61/138/209 |
| rainier | V55 | 1344/1600/1888/2656 | 1344/256/288/768/144 | 98/32/49/181/42 |

## Compute cost

Three counterbalanced complete runs per representative subject include session analysis, filtering, fitting, ranking, native raster work, caches and transitions. Evidence analysis, file writes and browser replay are excluded. Medians in seconds:

| Subject | Operations | Gate-only | Full V54 | V55 ordinary final |
|---|---:|---:|---:|---:|
| tay | 1400 | 11.23 | 11.48 | 32.46 |
| tay | 2800 | 15.19 | 16.49 | 39.36 |
| tay | 5600 | 23.31 | 26.79 | 46.32 |
| mat | 1400 | 5.33 | 5.31 | 13.57 |
| mat | 2800 | 7.12 | 7.49 | 16.64 |

The roughly twofold total cost, and still larger intermediate cost, is material. Single-run matched-time views use accepted prefixes at the common minimum allowance across available painters; they complement the counterbalanced timing evidence. Profiling records separate analysis, native proposal fits, filtered fits, exact evaluation, provisional ranking and cache work; nested counters must not be summed. In the median complete Tay V55 run, filtered quantity fitting takes 18.70 s, exact filtering/evaluation 3.90 s, provisional ranking 1.08 s and accepted-cache maintenance 0.47 s. The compact solver improves on the initial double-filter prototype, but remains too expensive for a worse drawing. Reducing blends alone would not change this decision.

## Recovery and verification

Current runtime gallery assets total approximately **10.14 MB uncompressed** and are counted in [gallery-bytes.json](../artifacts/v55/gallery-bytes.json), around 10 MB uncompressed. Eighteen single accepted streams use lossless columnar Float64 transport, byte-plane shuffling, gzip and base91. Prefix views and before/after sequences share streams; no duplicated prefix images or display texture overlays. Original reference pixels survive lossless WebP conversion. Optional reproduction tools and cold historical bulk galleries are identified separately.

From the recovery directory: `node v55-check.cjs`; `node v55-reproduce.cjs` regenerates development, rejected variants and frozen regressions; `node v55-timings.cjs` and `node v55-timings.cjs --mat` repeat counterbalanced timings. These write ignored evidence under the parent artifacts folder. Node and a local Chrome are needed for the corresponding checks; the galleries themselves work offline without a build/server.

Checks cover independent finite-Gaussian agreement, whole-support realised candidate gain/fit/ranking, full score/cache/tile consistency, seeded determinism, unchanged raw attention, three-check stage semantics, gate edits, Continue, coarse/final targeting and Undo, native/2x replay and export. Frozen V53/V54/V50 and oil histories reproduce exactly. The extracted ZIP passed inventory hashes, core checks and offline gallery checks; shipped sources regenerated the primary Tay control and V55 1400-operation prefixes exactly. Real studio worker checks keep V44 default and existing V54 controls; offline browser checks compare production pixels, recovered JSON, matched-time/analysis views and frozen material galleries.

Artwork JSON restores accepted operations and replay/export. It does not save a live optimiser session; retain the original reference and regeneration settings for renewed optimisation. This experiment remains available for audit, not as a new studio preset.
