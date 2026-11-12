# V23: bounded shape revisiting does not solve broad recovery

**Reject this treatment for adoption; retain V23 only as an experimental comparison. V14 remains default.** The stage restriction is real, and a few larger contacts improve the existing objective, but this bounded treatment does not convincingly recover the unfinished beaver scene or improve late cheek refinement. No second fix was stacked after this result.

[Offline gallery](../artifacts/v23/comparison.html) · [Portable gallery ZIP](../artifacts/v23/v23-comparison.zip) · [Predeclared design](../artifacts/v23/design.json) · [Measurements](../artifacts/v23/measurements.json) · [Same-anchor diagnosis](../artifacts/v23/diagnostic.json) · [Actual repair footprints](../artifacts/v23/repair-footprints.json)

## Evidence and causal finding before treatment

Incoming Git was clean. No applicable AGENTS.md was found. README/HANDOFF, V22 report and KIV were read. All retained ZIPs passed CRC verification before archiving the incoming engine and seven planner/helper sources in archives/v23-control.zip, with SHA-256 verification through v23-control.cjs. Historical dev-logs remain byte-identical; no reset, automatic commit or branch change occurred.

The seven supplied screenshots show the portrait improving with global continuation and a local cheek pass; the beaver subject improves strongly under targeted work while the river/landscape remains incomplete. Historical V5 provides a different painterly reference, not a matched causal control. Filenames do not supply seeds, target circles, modes or reproducible timing. Copies are in the gallery's manual/ directory.

Actual planningTask uses a four-pass scale progression during Paint, then forces pass3 for Continue and both auto/fine targeting. Balanced nominal widths at edge640 are 67.2 / 19.2 / 7.68 / 3.84px before importance, minimum, target and boundary fitting. All current stages construct three curve candidates (factors1/.78/1.18); V22 can add one Flat/Filbert contour sibling. There is no later width search in this path. Quiet flat areas shortlist Filbert/Flat/Mop; coherent thin edges can shortlist Round/Liner/Rigger, textured detail can use Fan/Hog/Stippler, and sharp small fine features can use Round/Detail/Bright. The selected enabled brushes and geometry determine the actual profile. Foundation covers the canvas independently of accurate reference colour.

The bounded diagnostic sampled the first twelve continuation anchors in each predefined region, with no favourable-gain selection, on the unchanged V22 seed42 trajectory. It compared normal V22 proposals with Shapes width/brush construction at the same location/state, while retaining strict Fine tracing and validation. Production treatment followed this finding; later pre-fit measurements only clarified where narrowing happened, without changing the treatment.

- beaver/body: 428 actual anchors; 4/12 sampled same-anchor probe wins; pre-fit widths 0.71–2.71px, fitted widths 0.65–2.71px.
- beaver/water: 527 actual anchors; 2/12 sampled same-anchor probe wins; pre-fit widths 0.71–2.53px, fitted widths 0.65–1.82px.
- portrait/cheek: 89 actual anchors; 2/12 sampled same-anchor probe wins; pre-fit widths 7.61–16.89px, fitted widths 7.61–16.89px.

**Attention is not excluded globally, but absence of anchors does not explain these sampled regions.** Stage lockout prevents useful cheek-scale alternatives. Beaver's stronger limitation is geometry compatibility/narrowing: many intended wider contacts become tiny fragments even before coherent fitting; fitting and actual-support retries can further trim/narrow them. Larger initial scale does not guarantee a usable larger footprint. Positive gain is also insufficient to win against the normal/loaded candidates. Coverage alone is not fidelity.

## One bounded policy

V23 keeps the ordinary V22 candidates, contour construction and RNG draws. Every eighth non-foundation Fine proposal additionally constructs **one** Shapes-scale candidate at the same selected residual anchor. Only width and the existing brush shortlist use pass1. At Balanced640 the useful requested scale is 19.2px, importance-adjusted; the unchanged target cap and minimum apply. This is not Block-in's 67.2px scale.

Tracing, material parameters, anchor-normal compatibility, coherent fitting and fresh actual-support validation use pass3/native RGB, with the existing colour threshold64 and mask threshold.45, four actual-support attempts, .72 narrowing and .65 floor. Geometry may narrow or collapse. Target alpha retains the established feathered support; no paint is deposited outside it. Ordinary detail alternatives remain available. The existing objective and acceptance threshold.000001 decide whether the alternative wins, with no width quota, bonus, forced acceptance or stage restart.

A private copy of the current random cursor supplies the probe texture seed; it neither advances nor resets the session cursor. The session's planner and probe cursor persist through Continue and targeting, are restored by local Undo, and do not change when the next-run selector changes. Cancellation retains accepted local work and restores global scheduling. The probe is uniform-colour; the unchanged V21 loading screen still offers at most two fits for one of the ordinary/contour contacts, keeping the V22 loading cap and choices intact at that anchor. No attention policy, foundation reset, new completion gate, contact-end change or material/export change was added.

## Long-session design and measurements

References are assets/tay-gradient.jpg and assets/beaver-1.png, aspect-preserving Chrome Canvas2D downsampling to512x640, exactly the application path. Both primary fixtures use seeds42/73, Balanced detail, Balanced search, default enabled brushes, quiet-body.25 and common Neutral material. Each pair uses1400 initial operations and7000 additional global operations. Predeclared portrait targeting is cx190/cy315/radius60/feather8, one1000-operation auto pass. Beaver uses cx168/cy361/radius100/feather10, four consecutive1000-operation auto passes. These are explicit reproduction assumptions; they are not recovered manual sessions. Rooster is a compact360+360 boundary/detail regression at its retained632x461 working reference. Every planned operation budget completed.

Gallery views include1400,8400, final targeting (portrait9400/beaver12400), common Neutral, pigment-only, fixed crops, sources and approximately matched global measured-work prefixes. Rooster uses360/720. Prefix comparisons keep the original complete-run schedule, not a new time-stopping policy. Initial coherent portrait modelling remains similar; only late Fine construction can diverge. There is no claim of general computational efficiency from one local timing per pair.

| Case | Final ops | V22 / V23 step seconds | Change | Probe attempts / wins | Median accepted width px / support pixels | Final objective change |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| beaver42 | 12400 | 21.782 / 23.208 | 6.5% | 1539 / 274 | 2.17 / 8 | -2.9% |
| beaver73 | 12400 | 22.829 / 23.167 | 1.5% | 1548 / 261 | 1.84 / 7 | -2.9% |
| portrait42 | 9400 | 26.129 / 27.073 | 3.6% | 1450 / 177 | 4.24 / 64 | -5.8% |
| portrait73 | 9400 | 27.099 / 27.792 | 2.6% | 1545 / 213 | 4.25 / 59 | -6.2% |
| rooster42 | 720 | 2.420 / 2.380 | -1.7% | 55 / 6 | 2.20 / 9 | -0.5% |

| Case | Empty after construction/fitting | Nonpositive score | Positive but lost selection | Below half global shape width | Added build/fit/support / evaluation ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| beaver42 | 81 | 159 | 1025 | 1411 | 315.7 / 330.3 |
| beaver73 | 76 | 163 | 1048 | 1421 | 309.6 / 323.8 |
| portrait42 | 72 | 903 | 298 | 835 | 502.2 / 557.0 |
| portrait73 | 52 | 995 | 285 | 918 | 519.3 / 591.7 |
| rooster42 | 0 | 0 | 49 | 54 | 10.2 / 10.8 |

The width counter named narrowed includes target limiting as well as narrowing; it is not a count of support rejections alone. Empty candidates have collapsed/degenerate paths. Nonpositive and losing counts apply to surviving evaluated probes, and together with accepted probes account for every survivor. Added construction time includes existing fitting/support. Total step differences also include changed downstream trajectories and measurement noise; the compact rooster's small negative change is not an efficiency claim. Footprint pixels count canonical deposited coverage>.08, not bounding-box area or nominal width. Full ranges/distributions and accepted operation indices are recorded.

Approximately matched global work: beaver42 v22 8400 ops / 15216.1ms; beaver42 v23 7837 ops / 15215.6ms; beaver73 v23 8270 ops / 15919.6ms; beaver73 v22 8400 ops / 15920.0ms; portrait42 v22 8400 ops / 22094.1ms; portrait42 v23 8044 ops / 22095.6ms; portrait73 v23 8168 ops / 22175.2ms; portrait73 v22 8400 ops / 22174.4ms. These comparisons likewise retain unresolved beaver masses and give no convincing cheek-quality advantage.

## Visual assessment and decision

Both beaver seeds remain fragmented after8400 global operations: body/face have interruptions, broad river regions retain the foundation-like mass, and rocks/trees/background remain coarse. The identical local sequence restores readable face/body/fur in both controls and treatments. V23 changes some background/sky contacts, but does not complete the surrounding scene. Median accepted probe support is only7–8 pixels, despite occasional widths near17px and footprints near1000 pixels. Calling every probe win a broad repair would misrepresent this result.

Both portrait seeds retain recognizable eyes, lips and hair boundaries. The1400 paintings retain the same broad coherent modelling with small late differences. At8400 both still accumulate short cheek bands and angular planes; after the predefined local pass both have a substantially smoother left cheek. V23's neck and hair modelling changes locally, but the treatment does not establish less whisker accumulation or better facial modelling across seeds. Mouth/eye highlights vary with the diverged trajectories; there is no claim of exact feature preservation after a repair.

Compact rooster crown, feet and thin white gaps remain open. Some red/green body contacts differ; the sparse720-operation check cannot establish full feather/feature quality. The prior V22 crown concern remains unresolved. Existing boundary/material/Neutral relief artifacts are not repaired by this experiment. No major new broad overwrite is evident in the fixed crops, but a compact regression check is not universal boundary proof.

Objective improvements (about2.9% beaver and5.8–6.2% portrait) do not establish the requested artistic recovery. Primary final step costs increase1.5–6.5% locally. **Reject adoption of this bounded scale treatment, keep its experimental/manual option and evidence, and stop.** Reconsidering compatibility-driven narrowing or another independent treatment needs a separately scoped iteration. Do not weaken checks or tune the circles/frequency to manufacture success.

## Authentic V12 restoration and verification

The original constrainStroke/propose/residual flood/resized/candidate branch and repair-refinement/cache behavior were recovered from the hash-verified artifacts/v17/engine-v16.txt in archives/v17-retirement.zip (source hash recorded in [provenance](../artifacts/v23/v12-provenance.json)). They are extracted original code, integrated with maintained shared renderer/session infrastructure, without a second engine or obsolete UI. New V12 legacy generations record **planner11/material2**; the V13 collateral penalty is absent. Shared helpers remain generation-compatible against the executable baseline, not merely described as similar. V12 replay from historical JSON remains independent of which generator is selected; importing a historical record does not restore its missing optimiser/reference session.

Fresh1400-operation beaver/portrait V12 comparators use the same current Balanced settings and seed42. Both full decisions, RNG and all canonical material buffers match the archived executable exactly. Additional checks cover all three search depths, Balanced/Fine, Continue, targeting/cancellation, repair refinements/cache and Undo. These initial-only manual comparisons are not a long-run V12 superiority claim.

Maintained canonical support/material/direction checks are reused with explicit restoration exceptions. Verification records in artifacts/v23 cover retained controls, full historical V22 portrait records, full long V23 repeated records, exact source-free pigment/Neutral replay, deterministic probe work, native compatibility, feather support, local/global restoration and historical imports. Real Chrome checks exercise seven choices, unchanged defaults, session binding, Resume, pointer targeting, cancellation, Undo, actual JSON/full/current-frame2x PNG exports, and loaded V23 timeline replay. The gallery and extracted portable package are checked separately.

Useful diagnostic/preparation tools are CRC/SHA-256 archived through the existing ZIP mechanism; temporary extracted source and integration scripts are removed from the active tree. User assets, prior galleries and append-only logs are preserved. Deferred: gradient tuning, contact ends, material/export texture and exhaustive scheduling redesign.
