# V46 complete charcoal drawing experiment

V46 is a functioning separate drawing planner, but **has not earned promotion**.
V41 remains default. V44 remains the stronger reference control on several cases.
No commit or promotion was made. The complete [drawing review](../artifacts/v46/comparison.html)
and [compact package](../artifacts/v46/comparison-package.zip) include source-free
operation replay, early views, Paint, Continue and matched planning-time views.

## V45 discrepancy resolved

The local V45 generator and `foundation-review.zip` generator have the same SHA256:
`a8b3825a6a81067d927f3c6a67597cdaef077fc3fb37eb7ea202e90762974f82`.
It generates deposits only. Renderer support for lift/blend does not make those
actions reachable. Continue calls the same generator; its canvas-relative contact
bounds do not provide a distinct refinement repertoire.

No artwork JSON, optimiser record or timing log for the reported approximately
5,600-operation portrait was found in the supplied attachment or local V45 package.
If it used this selectable V45, its recorded planner operations were deposits.
The actual accepted count, proposals and elapsed time cannot be recovered from
that description. The studio shows accepted operations and candidate evaluations
separately; the default 1,400-operation allowance has 5,600 proposals. Those numbers
must not be equated. Balanced evaluates seven candidates per proposal, Fast three,
Thorough twelve. Historical V45 source and review remain unchanged; selector and
active painting labels now explicitly say foundation only / deposit only.

## Diagnosis and architecture decision

The problem was a restricted and costly action vocabulary, not insufficient ribbon
decoration. V46 uses the proven V42 deposit/lift quantity model, bounded symmetric
blend and narrow connected paths. It adds restrained rounded tonal contact,
separate material8/stick6 identity, and its own attention and proposal generation.
Quiet masses retain light paper tooth; accents retain stronger broken pickup.
No particle simulation, photographic underpainting, pixel replacement or final
filter is used. Replay needs only the recorded operations.

Signed residual samples at broad, medium and point scales guide attention. Each
proposal offers broad/medium/fine tonal correction, selective supported accents,
and blending. Tonal scans adapt contact extent; a wider-scale contrast check gates
fine connected marks. All functions remain available during Continue and targeting.
They are competing actions, not sequential phases or quotas. Broad paired fits
share a support traversal; zero-strength scoring skips unnecessary raster work.

The experimental score uses broad tone, fine tone and point residuals, with a small
smoothed gradient residual. Patch halos include the gradient dependency; focused
checks compare patch gains against the whole objective. The score **does not measure
artistry**. The objective ablation is mixed and increases bright-region damage in
the portrait crop despite lowering RMSE. Both final bright spill and accepted
damage to already-correct light pixels are audited explicitly. No arbitrary damage
penalty, compound proposal or lookahead was installed.

## Drawing evidence and tradeoffs

| Drawing | V41 RMSE | V44 RMSE | V46 RMSE | V46 light damage |
|---|---:|---:|---:|---:|
| sphere | 13.15 | 8.78 | 7.22 | 1.24% (142/11446) |
| silhouette | 14.89 | 8.32 | 7.83 | 1.01% (99/9804) |
| transitions | 12.49 | 7.09 | 7.82 | 0.80% (63/7920) |
| lifting | 5.44 | 3.50 | 2.41 | 0.00% (0/13935) |
| portrait | 34.12 | 25.46 | 18.72 | 14.29% (93/651) |
| mat | 12.32 | 8.28 | 9.34 | 17.22% (793/4606) |
| rooster | 20.57 | 12.72 | 13.98 | 3.10% (5875/189545) |
| rainier | 21.44 | 18.52 | 19.31 | 72.75% (2795/3842) |
| tay | 14.21 | 10.19 | 11.26 | 100.00% (1/1) |
| orca | 15.56 | 11.36 | 11.61 | 33.38% (438/1312) |

Three-run median planning wall seconds for **Paint at 1,400 operations**, including analysis:

| Reference | V41 | V44 | V46 |
|---|---:|---:|---:|
| mat | 4.79 | 7.09 | 10.62 |
| rooster | 6.16 | 9.52 | 10.74 |

V46 does not beat V44 consistently on the reference campaign. The form and
lifting improvements do not justify promoting its higher cost and softer feature
rendering. V41 stays default. V46 is retained as a reproducible drawing experiment.


The compact gate was revised before the reference campaign. Early prototypes
over-narrowed tonal contacts, imposed roughness everywhere, and left rectangular
joins. Rounded contacts and less restrictive coherent-tone scans improve complete
form modelling. The final sphere is quieter, and the contaminated case selects
genuine lifts. Silhouette and transition joins remain; quiet masses can look waxy,
and facial features can soften. The portrait crop's light damage is a real failure,
not a success hidden by average error.

Visual holdout inspection rejects V46 as a general challenger: at V41's Paint time,
Tay has waxy, distorted facial planes and broken features. At equal operations it
is more recognisable, but still softer than V44. Orca's subject survives while its
background develops soft repeated patches. The 5,600-operation portrait reduces
numerical error; that alone does not establish useful artistic convergence.
Bright-pixel percentages include their denominators in the review: Tay has very
few pixels above the fixed 220 threshold, so that metric is weak on this source.

A fixed directional redistribution probe uses the same 90-operation planner states
and 48 anchors on sphere, adjacent transitions and silhouette. Its best gains were
lower than the existing isotropic blend in all three cases. Both conserve quantity;
the directional version remains diagnostic code only. The compact portrait selects
very few blends naturally; accents are not imposed on quiet fields.

## Protocol, provenance and verification

Development uses Mat, rooster and Rainier. The treatment was frozen before Tay
and Orca; the freeze file hashes runtime sources. `assets/tay-gradient.jpg` is an
actual 1080 × 1350 photographic portrait, visually inspected, not prior rendered
artwork. Its hash and all reference preparation are recorded in `references.json`.
Its exact identity with an unavailable earlier attachment cannot be established.
References are EXIF-transposed RGB, Lanczos resized to at most 640 px long edge,
then transformed through the unchanged charcoal luminance mapping.

Real drawings use 1,400 accepted-operation allowances for Paint and Continue,
with four proposals per operation; Tay also gets a 5,600-operation convergence
run. Gate cases use 300 + 150 operations. Counts are allowances until accepted;
actual counts, proposals, candidates and stop reasons are reported. No compound
actions are counted as one. Planning traces include initial analysis, Continue
setup, fits, score rasters and material application. Captures, PNG encoding,
statistics, replay and diagnostic probes are excluded. Mat/rooster timings repeat
three times with reversed order and no concurrent painting workload. Single-run
time-prefix views remain observations, not statistically established speed claims.

Focused checks preserve exact historical oil and charcoal40–45 generation,
Continue, RNG, native/2x replay; V46 seeds42/73 at all depths; score accounting;
target feather/Undo; material conservation and version validation. Actual studio
Paint/Continue, target gesture/Undo and 2x PNG export are checked. The study page
keeps all 33 historical studies accessible. Large generated evidence stays ignored
outside Git, with rejected/preliminary captures archived in `artifacts/v46-work`.

Reproduce: `python v46-prepare.py`, `node v46-study.cjs`,
`node v46-benchmark.cjs`, `node v46-benchmark.cjs --holdout`, then
`node v46-timing.cjs`, `node v46-damage.cjs`, `node v46-build-review.cjs`.
Run browser checks with local Chrome available. `v46-check.cjs` compares against
the renderer extracted from the historical V45 package; shared oil modules are
copied from the preserved local experimental directory.

## Short visual research basis

Actual downloaded process images were inspected: Fussell's loose portrait masses,
stumped facial tone and restated accents, plus his skull's bulk lifting and pulled
cast shadow. The Met's Appian landscape contrasts quiet distant atmosphere with
sharp foreground vegetation; Salviati combines toned form with selective line.
These support interchangeable modelling actions, not an outline-first rule.
[Portrait demonstration](https://thevirtualinstructor.com/sketching-with-charcoal-portrait.html),
[skull process](https://thevirtualinstructor.com/charcoal.html),
[Met drawings](https://www.metmuseum.org/perspectives/materials-and-techniques-drawing-charcoal).

[Durand et al., paper and figures](https://people.csail.mit.edu/fredo/PUBLI/Drawing/drawing.pdf)
separate tone, stroke expression and precision. That separation informs planning;
their target-image threshold renderer cannot transfer to independent material
replay. Their interactive aesthetic choices also cannot become automatic semantic
judgment here. The reference still supplies observed tone and local structure,
not knowledge of a face, tree, meaningful narrative detail or artistic intent.

[Hertzmann's multiscale painter](https://mrl.cs.nyu.edu/publications/painterly98/hertzmann-siggraph98.pdf)
supports matching contact scale to spatial detail and recomputing residuals against
the current imperfect drawing. Its detail-as-importance heuristic is insufficient
for selective charcoal structure; its mandatory decreasing brush layers and opaque
source-colour strokes are not adopted. V46 keeps broad repair available in Continue.
