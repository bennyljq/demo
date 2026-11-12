# V45 representation and proposal audit

The attached V44 first-100 image and demonstration screenshot show the same long,
straight, nearly constant-width footprint at different orientations and strengths.
The supplied `assets/charcoal-smudges.jpg` includes changing direction, unequal
loading, wide/short contacts and pointed terminations. It is a character reference;
none of its texture pixels or silhouettes enters the renderer. Repository and
drive-root searches found no AGENTS.md. The V44 report was read as historical
evidence, including its admission that early contacts remain rectangular.

## Concrete V44 bottlenecks

| Property | Renderer / demonstration | Actual broad proposal / fitting |
|---|---|---|
| Curvature | Four cubic controls; V42 connected paths | V41 broad controls are collinear. V44 residual moments reconstruct four collinear points again. Only narrow connected paths retain curves. |
| Width evolution | V44 seed field is roughly .89–.99 with tiny centre offsets | Incidental seed character, not evidence-guided taper/swell. No explicit broad width profile. |
| Pressure evolution | V42 three pressure knots; hand demonstrations vary pressure | Broad V41 geometries are rebuilt at pressure 1 and default profile [1,1,1]. Connected accents use [.65,1,.55]. |
| Contact angle / unequal sides | Side/tip names; edge softness | No physical evolving angle or independently asymmetric loading. Rotating a strip changes its orientation, not contact evolution. |
| Longitudinal density | Seed pickup and endpoint envelopes | Available natural breakup, but no evidence-guided broad entry/exit progression. Strength fit scales the whole fixed realization. |
| Independent travel/contact size | Operation accepts arbitrary points and width | Initial travel = width ×2.3 or ×3.1. Normal walks can shorten it. V44 covariance adapts aspect, caps travel at width×6, and remains straight. |

V42 Balanced begins with four tone operations, a narrow connected deposit/lift and
a blend. Only about three useful broad deposition alternatives compete in the
deposit-only control. V44 adds complete-support fitting and residual moments;
neither changes this representation into a broad spatial gesture. Search count
alone therefore overstates broad repertoire. The objective can choose only the
realized candidates it receives. Fitting does not discover missing curvature.

## Artist/material observations and implementation

These are design connections to demonstrations, not a claim to simulate a brand.

- [Nitram: soft charcoal](https://nitramcharcoal.com/blogs/blog/getting-nitram-soft-charcoal)
  shows side coverage and fine-point accents, describes pressure-controlled light
  and dense lines, and builds tone by layering. V45 separates contact width from
  travel, pressure from fitted strength, and quantity accumulation from texture.
  The study tests deposition without the source's subsequent lifting/blending.
- [Jake Spicer: landscape demonstrations](https://www.artistsandillustrators.co.uk/how-to/drawing/how-to-draw-a-landscape-in-charcoal/)
  uses a sweeping canopy arc and the broad edge of snapped willow for energetic,
  tapering grass. V45 connects evidence-guided cubic travel with width/pressure
  evolution, rather than restricting curves to point accents. Wet media in this
  demonstration are outside the study.
- [Lancelot Richardson: charcoal texture demonstrations](https://www.artistsandillustrators.co.uk/how-to/drawing/how-to-create-different-textures-with-charcoal/)
  layers a broad tonal base and adds marks following the direction and length of
  fur. V45 distinguishes quiet side shading from coherent broken channels and
  tests overlapping passages. Its white-gap/fur examples inform contact evolution;
  dust, solvents, and later subtraction are not used to improve these outputs.
- [Drawing sticks and large gestures](https://www.artistsandillustrators.co.uk/how-to/unknown/how-to-choose-life-drawing-materials/)
  demonstrates underhand side/point use and movement from the shoulder/arm. This
  supports independent contact size and spatial travel, including long slender
  and short broad operations. Numerical profile knots are our compact approximation.

## V45 implemented limits, including unused features

One cubic path; three knots each for width (.08–1 of the recorded maximum envelope),
pressure (.05–1), normal bias (−1–1), contact-angle loading (−1–1), and longitudinal
loading (.05–1); separate entry/exit envelope (.01–.5 of travel); quiet/broken
contact. The maximum envelope is bounded independently of trajectory length.
Physical pressure is clamped to one in deposition and controls pickup, not width.
The fitted opacity multiplier is independent. Bias shifts the changing width inside
the maximum envelope. Contact angle changes loading across it, not path direction.

Planner hypotheses use maximum lengths of .065–.72 times canvas edge and maximum
contact widths of .018–.20 times edge (Balanced), with evidence shortening travel
and narrowing contact. These are bounds, not fixed aspect ratios. Pressure derives
from local residual need. Width/pressure knots come from five normal scans of that
need. Target tonal ridges and coherent target tangents guide curved travel. Quiet
isotropic regions use residual moments for orientation and straight broad shading.
Halfplanes/ramps do not supply invented ridge curves. Seven fits and seven scores
per Balanced proposal; three Fast and twelve Thorough. No seed search or diversity
reward. No objective, attention or historical placement change.

Bias, contact-angle and loading knots are **currently demonstrations only**: actual
planner defaults are zero bias/angle and unit loading. Unequal pressure already
gives entry/exit density evolution, but it is not evidence of angle/loading search.
Broken contact is currently reachable through sufficiently coherent narrow evidence;
broken broad gestures are supported by the renderer but not a separate Balanced
proposal. This is a remaining proposal limitation, openly exposed by the review.

## Four failure classes and iteration

1. **Cannot represent:** a discontinuous sharp corner, multi-turn scribble or
   separate disconnected contact islands cannot be one cubic gesture. The authored
   S-curve/crossing tests establish continuous paths, not these missing capabilities.
2. **Representable but not proposed:** fixed broad-band anchor (120,120) ranks an
   authored complete sweep above all seven local alternatives. This is a proposal
   gap, not score suppression. The curved broad travel bound was extended from .34
   to .72 without increasing candidates. The complete illustrative sweep can still
   outperform that bounded approximation. The unused physical profiles above are
   also concretely represented-but-unproposed.
3. **Proposed but rejected:** the fixed anchors store every candidate's realized
   operation, fit and objective gain, plus the authored counterfactual's rank.
   All seven are positive at these clean anchors; six lose to the winner. Positive
   losers are different from negative/zero-fit rejection. Full runs record zero fits,
   positive alternatives and accepted family counts separately. There is no evidence
   here to justify changing the objective to reward gesture variety.
4. **Accepted but rasterizes poorly:** first prototype curvature showed wedges at
   clipped interior segment projections. V45 alone now uses signed radial distance
   at those projections and .25-pixel flatness with shorter segments; nearest-path
   ownership deposits once per pixel. Fit, score, apply and replay use that same
   realization. Different accepted strokes still create seams and direction bands.

The first prototype used residual centroids to steer curves and invented turns in
flat adjoining regions. Target-ridge steering removes that behavior. A narrow
ridge-sensing window then missed the broad-band centre; sensing was widened without
painting that wider area. Regular sinusoidal contact channels were replaced by
seeded smooth irregular profiles; quiet contact modulation is only .025×(1−pressure).
These interventions were motivated by fixed analytic cases and Mat, not Orca.
Only the final frozen treatment is the reported holdout; no holdout image was used
to select parameters. Prototype bulk remains outside Git.

The straight/profile ablation removes curvature and evolution while retaining
V45 contact and proposal fitting. The legacy-proposal ablation retains V45 material
and score, but uses V44 geometry generation. Both operate on band/taper only and
disable blend/lift. Their feedback changes later choices, so they are whole short
construction ablations, not identical-location per-stroke causal estimates.
