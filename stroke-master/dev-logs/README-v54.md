# V54 — Charcoal through tonal construction

V54 retains V53's successful V52-derived contact and material12 / stick10 identity. The challenger changes promotion gates and adds a narrowly bounded Stage 5 texture tolerance. **V44 remains stable/default; no promotion or commit.** Oil and the studio layout are unchanged. Historical V53 generation and replay remain exact.

Open [Charcoal Studies](../charcoal-studies.html), the [trajectory/diagnostic gallery](../artifacts/v54/comparison.html), or [recovery](../artifacts/v54/recovery-package.zip). Frozen [V52](../archives/charcoal-studies-v52/index.html) and [V53](../archives/charcoal-studies-v53/index.html) material examples remain independently available. The gallery uses one lossless stream per painting, not duplicated prefix images. It includes 300/1400/2800, actual transitions, matched time, the 5600-operation Tay extension, gate-only controls, and native before/after blend crops.

## Diagnosis and experimental order

The new V53 control reproduces the packaged first2800 operations exactly on all four subjects. Blends in operations301–1400 are Mat719, rooster668, Tay789, Rainier666, as reported. **Actual stage use is more informative:** Tay spends1472 operations in Stage1, including952 blends; Mat spends1760, including1019. During Tay's Stage1, broad mass error falls from11.4 at500 to5.0 at1400, while fine texture RMS falls15.71→3.67. Much of the remaining pixelwise improvement is smoothing after useful broad values have formed.

Common native crops compare the winning blend with the best non-blend correction from the same proposal/state. At Tay operation300, blend gain48.70 exceeds deposit40.11. The blend reduces texture RMS1.341 and reference-edge error0.404, so this early smoothing partly repairs incorrect hard construction. At operation1400, blend gain1.259 exceeds lift0.130, but broad mass RMS **worsens0.019**, texture falls0.457, and reference-edge error improves only0.009. This is evidence of a texture penalty, not proof that every blend is wasteful.

For diagnosis only, broad mass is `RMS(Gσ(canvas) - targetσ)`, where `targetσ` is the existing `Gσ(reference)`. It is never blurred again. Gaussian support is the existing separable, radius-ceil(3σ), clamped-edge kernel. Fine texture is `canvas - G1.2(canvas)` in areas whose G2(reference) gradient is below0.8. Reference-edge error compares G2 gradients where the reference gradient exceeds2. These are native common-crop/full-state diagnostics, not artistic scores or acceptance rewards. Before/after crops and structural recovery/damage are visible in the gallery.

The addendum's gate-only experiment came first. No material, proposal, fit, score or blend changed. Selected editable defaults:

| Stage | V53 global / regional % | V54 global / regional % |
|---|---|---|
| 1 | 3 / 5 | 11 / 17 |
| 2 | 3.5 / 6 | 9 / 15 |
| 3 | 4 / 7 | 7.5 / 13 |
| 4 | 4.5 / 8 | 6 / 11 |
| 5 | 5.5 / 10 | **5.5 / 10** |

These were calibrated on inspected Tay/Mat states, not reversed arrays or regression references. Both300 states have materially incomplete masses and fail the new gates. Mat500 has global15.38 / regional24.93% and still lacks broad facial modelling; Tay500 fails global13.33%. Around700 the major masses are coherent: Mat10.68 /16.00%; Tay8.90 /10.51%. Three accepted-operation checks promote Mat at768 and Tay at672. At those actual transitions, coarse RMS is8.16/7.60; brightest-fifth mean error is+1.80/+4.47 tone levels, darkest-fifth−1.92/+2.63. Mat's1458 Stage1 target pixels above200 have no coarse light loss exceeding12 levels. Original-reference bright-pixel damage is separately reported; an early blurred target is not identical to the original. Regional95th-percentile safeguards,32-operation evidence and three checks remain. Intermediate transitions were visually inspected for modelling, silhouette and light before freezing.

Gate-only makes Tay recognisable at1400 and reduces unnecessary coarse-stage residence. However, by5600 its texture RMS is1.99, versus5.76 at1400; late pixelwise refinement again smooths much of the gained character. A separate restrained-blending control adapted exchange radius and maximum quantity to the ratio of block-mean tonal residual to pixel residual, without a quota/cooldown/ban. With old gates it postpones Tay's first transition to2304 and leaves Mat in Stage1 at2800. Combining it with earlier gates gives weaker modelling: Mat RMS16.21 at2800; Tay8.34 at5600 with reference-edge error1.78 versus control1.29. **Both restraints are rejected.** Fewer or weaker blends did not earn their cost.

Scale-aware coarse acceptance was not implemented: the simpler gate experiment solves the early residence problem. The concrete remaining failure is late, small-amplitude smoothing, so the next experiment was restricted to Stage5 rather than introducing a filtered/multiscale optimiser.

## Retained Stage 5 change

V54 uses `e = (max(0, abs(canvas - reference) - tolerance) / 255)^2` only in Stage5. Tolerance is at most **five tone levels**. It falls to zero around reliable reference gradients, with a two-pixel neighbourhood safeguard, and is zero wherever the original transformed reference exceeds210. Very dark areas receive at most two levels. The map derives from G1.2(reference); sharp canvas edges alone receive no protection. Incorrect larger errors remain correctable. No strokes are frozen, high-frequency energy rewarded, extra sharp marks forced, or texture restored after painting.

At fixed pressure/contact/seed, the actual full-quantity raster supplies the linear quantity delta. A bounded ten-step convex bisection fits the same tolerated error used for acceptance and cached errors. Raster, incremental errors, tile sums and whole-canvas scores agree. The actual material canvas remains untouched by analysis filtering and uses V53's unchanged deposition/removal/conservative exchanges.

Promotion additionally requires the **original pixelwise global5.5 / regional10% final gates**, with their own incrementally maintained errors/tiles. Thus tolerance does not silently loosen final qualification. The studio's existing readout shows these binding pixelwise gates; tolerated diagnostics are recorded separately. A synthetic wrong mass that passes tolerated error but fails the old pixel gate is rejected. Threshold numbers alone would not establish equivalent difficulty; the explicit raw guard does preserve this final requirement.

At the final recorded qualification checks, raw / tolerated global errors are Mat4.37 /4.20% and Tay2.67 /2.43%. The reported original-reference RMS below retains tone-level units; these percentage errors are separate optimisation diagnostics.

Tay gate-only versus this tolerance at5600: texture1.99→2.36, original RMS6.48→6.81, reference-edge error1.33→1.33. The gain is modest. Native cheeks/forehead retain some broken shading while eyes, mouth and hair edges remain defined. Substantial late smoothing still occurs; this is not a claim that all early character survives.

## Complete trajectories and trade-offs

Developed on Tay/Mat, including Mat seed73; material/proposals/scoring/gates were SHA256-frozen before rooster/Rainier. All primary runs use balanced search, seed42,1400+1400; Tay has two more matched1400 allowances to5600. Each counted operation remains one contact. New stage-entry counts (Stages2/3/4/5):

| Subject | V53 | V54 |
|---|---|---|
| Mat | 1760 /1952 /2208 /2400 | 768 /928 /1216 /1696 |
| Tay | 1472 /1600 /1728 /1824 | 672 /800 /960 /1216 |
| Rooster | 1344 /1728 /2208 /2624 | 384 /512 /832 /1376 |
| Rainier | 1152 /1280 /1440 /1632 | 512 /608 /768 /1120 |

| Final | Original RMS V53→V54 | Texture RMS | Reference-edge RMS | Bright damage | Complete wall |
|---|---|---|---|---|---|
| Mat2800 | 11.59→11.15 | 3.34→4.07 | 3.37→2.93 | 32.13→21.32% | 8.55→7.14 s |
| Tay5600 | 6.42→6.81 | 2.04→2.36 | 1.29→1.33 | one eligible pixel | 23.73→22.12 s |
| Rooster2800 | 20.64→16.38 | 2.41→2.72 | 6.98→4.34 | 9.37→4.81% | 9.02→6.56 s |
| Rainier2800 | 19.48→19.89 | 3.37→5.12 | 3.95→3.79 | 80.24→66.15% | 12.20→8.34 s |

Bright damage uses original target>220 and painting over12 darker; Tay's single eligible pixel is uninformative. Mat/Tay meet final criteria; rooster/Rainier **remain incomplete**. Mat seed73: RMS11.54→11.30; texture3.53→4.33, both criteria met. V54 improves Mat's facial modelling/light, rooster's feather structure, and Rainier's tree silhouette/broken foreground. Rainier's values remain weaker by pixel error and the lake remains soft. Tay is recognisable and well modelled but relatively smooth late. These qualify the result; texture RMS alone is not success.

Blend counts / actual stage operations:

| Subject | V53 S1 | V54 S1 | V53 S5 | V54 S5 |
|---|---|---|---|---|
| Mat | 1019/1760 | 311/768 | 52/400 | 387/1104 |
| Tay5600 | 952/1472 | 357/672 | 1098/3776 | 1446/4384 |
| Rooster | 780/1344 | 153/384 | 6/176 | 228/1424 |
| Rainier | 743/1152 | 265/512 | 88/1168 | 209/1680 |

Earlier advancement exposes detail work sooner, including useful later blending. The gallery shows all five stages and matched-time truncations. Similar-looking late reconstruction remains, so savings are not inferred from counts alone.

## Cost, preservation and recovery

Three counterbalanced complete Tay repetitions give median V53→V54 walls:1400 **13.13→9.69 s**,2800 **17.94→14.06 s**,5600 **24.87→23.08 s**. Three complete Mat repetitions give median2800 walls **8.99→7.19 s**. Stage5 tolerance itself adds about2.63 s of fitting and46 ms reference analysis in the primary Tay run, versus gate-only19.74 s total. Reusable fit scratch peaks0.44 MB; the tolerance map plus raw error cache uses12 bytes/native pixel. Fits inspect49.93 million patch pixels across12 derivative scans each. Contact work and all raster/scoring/gate work are included in wall; contact-visit counters alone omit some fit/flux loops. No artwork-filtering pass is added. Diagnostics, PNG/record writing and review replay are excluded and measured separately. Single-machine timings vary; repeated timings are included in recovery.

Checks cover deterministic seeds/depths, fitted gains and whole-canvas/cache/tile agreement, guarded final promotion, accepted-operation stage semantics, live gate edit/reset, Continue, targeting/Undo, native/2× replay/export and source-free import. Frozen oil v12/v17/v31/v33 and charcoal40–51/V53 generation/Continue/replay agree exactly. The V52/V53 material source files are byte-identical to the frozen baseline. Offline browser checks cover current sequences, independent V52/V53 galleries, gzip record decoding, fixed-state crops and matched time. Bulk arrays/images remain ignored outside Git; no commit was made.

From the repository root:

```powershell
node stroke-master/build.cjs
node stroke-master/v54-check.cjs
node stroke-master/v54-browser.cjs
node stroke-master/v54-gallery-browser.cjs
node stroke-master/v54-reproduce.cjs
node stroke-master/v54-timings.cjs
node stroke-master/v54-timings.cjs --mat
python stroke-master/v54-package.py
```

Recovery includes sources, frozen control, exact streams, calibrated defaults, diagnostics and reproduction tools. Extract separately; open Charcoal Studies or `artifacts/v54/comparison.html` offline. Recover JSON imports the selected artwork prefix into the included studio. Optimiser state is not restored; regeneration/Continue requires starting from the source. Historical bulk navigation requires the original checkout. `gallery-bytes.json` measures all active gallery/review dependencies uncompressed, including lossless records and original references; the measured active total is **9.31 MB uncompressed**, below10 MB. Optional studio/reproduction files bring recovery to about10.76 MB uncompressed (7.31 MB ZIP). No duplicated prefix images or accepted streams ship.
