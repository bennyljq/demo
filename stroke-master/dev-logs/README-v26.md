# V26 operational snapshot

Open `index.html` from disk. V12 legacy (planner11/material2), V17, V22 default, V24, V25 and **V26 experimental: width stages (planner26/material2)** remain selectable. Quiet-area body default/reset remains .25. Sources are built with `node build.cjs`; generated Studio and brush laboratory share the same canonical engine.

V26 separates the recorded dominant-colour foundation from seven strictly bounded brush-body stages. Choose **V26 candidates per stage** before Paint (default4096). This captures the allowance and brushes for the session. Generic stroke/proposal budgets control retained planners; V26 global search uses candidate allowances, bounded saturation and the shared hard contact/operation/patch/memory limits. The 24000-operation ceiling remains a hard safety stop. Search depth and Detail remain recorded, but do not change V26's fixed candidate distribution. Quiet body controls the existing foundation; V26 painting contacts use fixed canonical body/material parameters.

At a candidate budget pause, **Continue this stage** adds the currently entered bounded stage allowance. It preserves stage, round, partial-round cursor, stagnation sequence and deterministic texture inputs. **Advance stage** records user-forced advancement, even from a manually paused stage. Stage-7 offers **Finish Stage-7**. Three completed negligible-improvement rounds (the third a different-offset confirmation) automatically advance; Stage-7 saturation finishes. A budget stop is never saturation. Completed Stage-7 cannot be reopened with generic Continue.

Pause/Resume keeps the active optimiser. Changing the next-run planner or allowance does not change that session's captured policy. Continued allowances are explicit user actions. Global cancellation retains the existing last saved painting snapshot; targeted cancellation keeps accepted local paint, and Undo restores the previous pixels, records, metadata and RNG cursor.

Targets use the active V26 width stage in both Auto/Fine. The target's core radius must be at least the stage's lower width bound; otherwise the UI explains that explicit advancement is required. Construction verifies unfeathered body widths, bounds target contact length, and moves centres inward so core cross-sections fit. Only then does the canonical target feather apply. Local rounds cannot advance global stages; target finish restores global scheduling, and subsequent rounds fit the changed canvas. No silent fine-scale or planner switch occurs.

Live provenance records stage/round/body extrema on each accepted painting contact, complete-round counts/reductions, stage-entry objective, tolerance, allowance extensions and endpoint stop reasons. JSON is a source-free replay document, **not an optimiser checkpoint**. Imports preserve planner26 provenance, loading, timeline and native/2x exports; Continue requires the live reference/optimiser session.

Commands, from `stroke-master/`:

```sh
node build.cjs
node v26-test.cjs
node v26-maintained.cjs
node v26-browser-smoke.cjs
node v26-study.cjs
node v26-gallery.cjs
node v26-gallery-browser.cjs
node v26-retained-browser.cjs
node v26-preservation.cjs
python v26-package.py
```

Chrome checks need local process/debugging socket access. The study is finite and expensive: predeclared caps512/512/1024/2048/8192/32768/65536 candidate evaluations for Stages1–7, at most110592 painting candidate evaluations per reference. Budget pauses receive bounded512 extensions until the stage cap; then the runner explicitly forces Advance/Finish. It never calls these stages saturated. Retained comparison runs cap at1400 operations/5600 proposals. Use the gallery's common operation prefixes and nearest measured-work prefixes; final paintings have unequal work. Reference decoding, replay and PNG generation are excluded from planning time. Historical logs and evidence are immutable.

[Experiment](V26-EXPERIMENT.md) · [KIV](KIV-v26.md) · [Offline gallery](../artifacts/v26/comparison.html) · [Design](../artifacts/v26/design.json) · [Focused verification](../artifacts/v26/tests.json) · [Browser verification](../artifacts/v26/browser-smoke.json).

## Deterministic policy protocol

## Foundation and canonical width

The most populated raw-reference RGB group uses 16-unit bins per channel: `floor(R/16)*256 + floor(G/16)*16 + floor(B/16)`. Each pixel contributes alpha/255 to population and colour sums; alpha-zero pixels contribute nothing. Ties choose the smallest numeric key, in R/G/B order. The representative colour is the alpha-weighted mean of the contributing raw RGB values, with no palette substitution. An entirely transparent reference falls back to the existing canvas colour. This is a dominant-colour estimate, not a background detector. Existing recorded canonical foundation bands apply it. Foundation is separate from the seven painting stages. No unrecorded reference image or underlay is inserted. Reference analysis/scoring retains the existing compositing semantics.

For longer working side L, Stage-n enforces `[L/2^n, L/2^(n-1)]`: at640, 320–640,160–320,80–160,40–80,20–40,10–20,5–10 pixels. **Body width** is the unfeathered geometric cross-section between canonical profile coordinates v=-1 and v=+1, where the coverage envelope is .5 before bristle/load texture. It equals nominal width times the actual canonical `footprint().spread`, including pressure/profile/release scaling. The reported body measure is the minimum and maximum at61 equally spaced stations along the central60% of the contact (`t=.20,.21,…,.80`). It is a sampled canonical body definition, not a pixel bounding box or a claim about every bristle. End taper, bristle gaps, filtering and canvas clipping are permitted exceptions. Pressure is1; no pressure curve or near-zero opacity/load hides a fine stroke inside a nominally broad one.

Construction first measures each seeded actual profile, then chooses a nominal width from the feasible interval `[lower/minSpread, upper/maxSpread]`, capped by the canonical1536 nominal-width limit. It verifies final body extrema again after constructing the final straight contact. Colour fitting cannot change geometry, pressure or width. No inherited coherent fitter shrinks these contacts. Short/medium/long length choices (.3/1/2.5 times the stage upper width, independently cycled) remain available, with a nondegenerate .3-times-lower length floor and a1.5L sweep ceiling. This permits short broad dabs. Extremely small images or extended planning sizes can encounter existing nominal-width/geometry/patch safety limits; the principal study uses working images with longer sides632/640.

Stages1–2 curate Flat/Filbert;3–4 add Hog-bristle;5–7 add Round. The pool intersects the session's user-enabled brushes. An empty global selection is rejected; an incompatible stage pauses with the required family list and allows explicit advancement. It never silently enables the whole library. No profile equations were altered.

## Bounded deterministic search and colour fitting

Grid spacing is at most .7 times the stage lower width, with equal cells spanning the image. Every complete round visits all cells, including quiet regions. Successive rounds use offsets(.50,.50),(.23,.77),(.79,.31),(.37,.19),(.63,.87), cycling deterministically. Adjacent samples overlap in broad contact support; offsets and orientations revisit short-contact gaps. The rows are traversed deterministically. Previously rejected cells remain eligible in every subsequent round and are fitted against the then-current canvas.

Each cell has two evaluation slots. One contact combination selects three width levels, four directions, three lengths and the curated brushes, distributed by cell and round counters rather than a Cartesian sweep. Flat/Filbert slots compare a fitted uniform contact and its two-colour equivalent. Hog/Round use two perpendicular fitted uniform alternatives. Width, direction and length distribution rotates across rounds. Brush indexing uses `floor(cell/2)+round` so both paired alternatives retain the same brush while every curated family participates. Candidate textures derive from seed/stage/round/cell/combination; continuing a partial round preserves these inputs. Canonical foundation uses the existing session RNG. There is no residual-only anchor search, anatomical rule, compulsory stroke count or width reward.

Every candidate gets one bounded colour fit through the existing canonical raster's alpha/colour-footprint callback. The fit uses current structural canvas RGB, native reference RGB and common importance weights. A deterministic two-dimensional stride `ceil(sqrt(affectedArea/1024))` samples the bounded footprint. With canonical planning sides≤1536, no fit uses more than1366 sample stations; maximum spatial traversal is1536² pixels, subject to shared work/memory guards. Counters separately record fit calls, spatial pixels, sampled pixels and fitting milliseconds. The fit accumulates a constant number of coefficients; it does not allocate an image-sized sample list.

Uniform fits solve a clamped one-column least-squares colour. Loaded Flat/Filbert fits use the **existing** version1/sRGB loading field with balance.5, softness1.2 and variation0. Both RGB endpoints solve bounded two-column least squares (interior optimum or four box edges). No new gradient field, wet mixing or source stamping exists. Loaded alternatives are available in all seven stages and each counts as a separate evaluation and fit. No V22 loading-eligibility/anchor gate or V25 per-pixel protection is inherited. Each selected slot is scored and can be accepted immediately; the next slot refits the resulting canvas rather than evaluating a stale colour fit.

Acceptance is the existing common full-affected-footprint plus scoring-halo structural gain **greater than1e-6 in raw weighted score units**. Candidate width has no reward and no compulsory acceptance. Collateral native-pixel regression is measured after generation; it never vetoes paint. Canonical material/lighting and scoring equations remain unchanged.

## Saturation, budgets and sessions

Stage entry records normalized common objective. A complete round records candidate evaluations, accepted operations, ending objective and reduction. Meaningful round improvement exceeds `max(1e-8, stageEntryObjective*1e-4)`. Two complete negligible rounds schedule a third, different-offset confirmation round. Only a negligible confirmation advances automatically. Meaningful improvement resets the stagnation sequence. This is bounded sampled saturation, **not exhaustive search**. Stage-7 saturation finishes.

Tolerance was fixed and calibrated on uniform, geometric-detail and curved-colour fixtures before principal comparison inspection. Independent full objective recomputation differs from incremental updates by much less than the absolute floor; exact values and complete fixture rounds are in `calibration.json`. Neither tolerance was changed after viewing principal images.

The default per-stage candidate allowance is4096; its UI range is12–120000. An allowance is a safety/work limit, not saturation evidence. Exhaustion pauses and offers Continue this stage or explicit Advance; Stage-7 offers Continue or Finish. Continue adds another bounded allowance, preserving stage, round cursor, RNG/texture inputs, counters and any incomplete round. Incomplete rounds never enter saturation history. Shared hard operation/contact, candidate contact, patch and memory guards remain. V26 reserves memory against the24000-operation safety ceiling rather than pretending its legacy stroke-budget field limits generation. No elapsed-time stopping is used; time is measured separately.

The Studio shows stage/body interval, round, allowance used, recent complete-round reduction and stop reason. Planner, brush pool and relevant generation settings bind at session creation. Changing the next-run selector cannot change an active painting. Generic Continue is routed to V26 allowance extension. Pause/Resume preserves the live optimiser. Small targets require a core radius at least the current stage lower width and explicit advancement otherwise. Target construction verifies body limits before canonical feathering, limits travel and moves centres inward so cross-sections fit the target core. Auto/Fine use the same width stage; neither switches to another scale or planner. Local completion restores global scheduling; canonical Undo restores records, pixels, metadata and RNG. Imported JSON remains replay-only.

Accepted operations record stage, round and body extrema. Complete-round/end-point history records work and automatic saturation versus forced advancement. This explains generation provenance; it does not claim JSON restores optimiser state.


Terminal Stage-7 completion and hard session limits close the Studio target controls. Hard-limit snapshots capture the current stage endpoint as `safety limit`; neither saturation nor forced advancement is implied. Existing shared-analysis background diagnostics remain in metrics, but do not select V26 foundation or candidates.
