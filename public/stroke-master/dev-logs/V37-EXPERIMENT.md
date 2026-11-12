# V37 — Challenger: gradual stroke-end deposition

**Reject at the local mechanism gate and pause stroke-end development.** The fixed fade genuinely softened contact ends, but mainly exchanged distinct boundaries for exposed underpaint, diffuse overlap and weaker deposited coverage. It did not earn a place against V33. No full seed42/73 painting benchmark, candidate integration or failed selector entry was created. V33 remains champion/default; V12/V17/V31 remain available. Human review remains the promotion gate.

## Current truth and hypothesis

V36 is committed at `d92bd2da067ef7cbcba169fdeb738bd5075d5bf4`. Its pressureCurve [.25,1,.25] narrowed shoulders; it did not fade longitudinal deposition. The user now judges those comparisons visually tied, with a slight V33 preference for rooster initial and initial-work head detail. This is recorded as a [human note](../artifacts/v37/human-notes.json), without a fabricated V36 vote JSON. The immutable V36 report remains the assessment made at that time.

The corrected [V35 human votes](v35-human-votes.json) are present and authoritative. Schema,16 rounds, protocol SHA256 and both Rainier preferences were verified. Mapping each selected anonymous column gives V33 15 / V17 1 / V12 0. This resolves the earlier missing-file note in the current handoff. It describes one judge's early/final rounds and different seeds, not a universal ranking. The input vote file was not modified.

The V37 hypothesis was that reducing deposited paint near contact ends might soften pigment boundaries without changing width or path. Existing pressure curves affect geometric spread, opacity applies uniformly, and depletion changes reservoir/dryness throughout travel; none expresses a symmetric bounded end-only deposition fade while holding those choices fixed. A small temporary extension of canonical deposition was therefore tested, rather than repurposing them.

## One fixed mechanism, chosen before viewing outputs

The profile is `u = clamp(min(t,1-t)/.18,0,1)` and `F = u*u*(3-2*u)`, multiplying only the original deposition alpha. Here t is normalized travel along the existing rasterized contact. The first/last18% fade smoothly from zero to full deposition; the middle64% is exactly unchanged. There was no sweep or tuning after inspection.

Path, width, curvature, pressure, geometric taper, brush choice, seed, internal texture, colour/loading fields and per-covered-paint thickness remain unchanged. Geometry/footprint functions are untouched. The canonical compositor uses attenuated alpha for coverage, pigment blend and the existing height deposition/compression update; height is not independently flattened. This reduces deposited paint while preserving contact geometry. Unsupported compound/sustained/stippler metadata was rejected. The experimental document extension was version5 with `endDeposition:1`; unknown profile values and version4 documents carrying it were rejected. Historical/default metadata bypassed the extension exactly. No duplicate renderer or permanent source-transform loader was introduced.

The [protocol](../artifacts/v37/protocol.json) froze the six V36 selections before treatment outputs: Rainier sky108/lake43, Pillars background147, portrait cheek/neck20, late portrait sharp contrast2944 and rooster feather4458, using zero-based operation indexes. Canonical V35 document hashes and exact selected contact objects were verified. Every original/faded pair was deposited against the same preceding canvas. The sharp contrast in the portrait is an upper-lip mark; these samples do not establish semantic coverage of every nostril or feather.

## Local findings and gate decision

The review package includes a single lossless gallery with40 shared whole-image PNG assets. It shows reference, preceding canvas, original contact and faded contact, with pigment/Neutral and whole/contact/context crops drawn at display time. Zooms include100% and400% for the narrow protection contacts. These are local interventions into partial paintings, not completed V37 paintings.

| Fixed contact | Deposited alpha area retained | Original / faded local raster median(ms) | Finding |
|---|---:|---:|---|
| Rainier sky108 |72.4%|2.843 /3.784|Softer pale end reveals the earlier dark layer; overlap becomes diffuse rather than convincingly modelled.|
| Rainier lake43 |78.9%|4.150 /5.799|Rounded contact termination becomes a blurred rectangular band/halo against underpaint; hard boundaries are exchanged for another artifact.|
| Pillars background147 |78.2%|1.542 /2.039|Curved mark's end becomes quieter, a credible local softening; body, direction and colour difference remain. This isolated benefit does not clear the coverage/overlap gate.|
| Portrait cheek/neck20 |78.4%|3.556 /5.040|Earlier broad layers show through softened ends; not evidence of improved finished cheek/neck modelling.|
| Portrait lip contrast2944 |94.3%|.405 /.321|Small central accent mostly survives; subtle end attenuation. Does not show that all lips/nostrils would be protected.|
| Rooster feather4458 |71.8%|.425 /.304|Narrow local feather/body accent loses end strength; existing preceding detail masks much of the difference. No clear new decisive detail.|

Alpha area is the sum of the isolated contact's coverage on a blank surface; it measures deposited contact paint, not uncovered final-canvas area. Foundation/underpaint can keep total canvas coverage high even while an individual mark weakens. The central region and geometric footprint remain unchanged, but lower end deposition necessarily exposes what precedes it.

Neutral was inspected independently. Softer local ridges follow reduced deposited paint, while internal texture and preceding/foundation relief remain. Relief does not explain away the pigment-level underpaint exposure or lake halo. The fade makes some endpoints less abrupt, but it does not establish better readability, coherent modelling, intentional edge variation or coverage. Sharp central accents are not uniformly erased; useful end accents can still weaken. These are Codex's provisional local inspections, not invented human V37 preferences.

Cost is measured only for single-contact rasterization on fresh surfaces, with two warmups and nine alternating original/faded samples. Allocation/setup, analysis and export are excluded. Broad contacts take more local work here, while the two tiny contacts are noisy and can be cheaper because fewer pixels receive paint. These small measurements are not whole-planner compute claims. No full challenger was integrated: evaluated/selected/deposited *search alternatives* are not applicable, rather than reported as a participation success. The six interventions were prescribed probes, not accepted optimiser decisions.

The explicit mechanism stopping rule applies: softened ends mainly expose underpaint or trade one boundary artifact for another. Full comparison, equal-work trajectories, stroke-economy claims and seed73 confirmation are therefore deliberately absent. No fresh champion painting timings were needed because no painting-compute claim is made. There was no objective change, proposal increase, forced quota or replacement hypothesis. Recommendation: **reject this treatment and pause this line of planner development**, not another automatically proposed taper variant.

## Preservation and focused checks

The probe verified identical geometry, bounds, pressure/taper, loading and seeded profile tables; exact central-region deposition; end-only alpha changes; live/replayed pigment, coverage and height agreement; and canonical evaluated patch/score equality with independent structural replay. Focused tests cover all4 retained planners/seeds42/73 matching the frozen runtime in decisions, candidate order, RNG and surfaces through pause boundaries, Continue and local cancel/Undo; real target feathering with no outside alpha/height; malformed metadata; native/2x export/replay; and exact absent-metadata historical rendering. Existing V33 regressions also pass after removal. All144 local gallery combinations decode and match crop bounds. No worker/UI route or cancellation machinery was changed, so another browser lifecycle benchmark was not added.

The renderer extension and its two probe runners were removed after rejection. Recovery is a4 KB patch over committed canonical source, plus small archived tools, not a copied application. The patch tool normalized the engine's earlier mixed working-file line endings; restoration uses exact committed V36 engine bytes with no semantic Git diff. Historical working-byte hashes were retained rather than rewritten, and that newline-only difference is explicitly recorded in [engine-restoration.json](../artifacts/v37/engine-restoration.json). The remaining114 frozen code files remain byte-identical. V33 behaviour/identity/default and historical replay remain exact. No reset, automatic commit, ref alteration or history rewrite occurred.

## Evidence and next handoff

All large temporary exports and package staging were outside the Git working tree. The one authoritative compressed review/recovery set is `D:/stroke-master-evidence/v37/v37-review.zip`; its gallery can be reviewed after extraction without reconstructing any engine. The project keeps only small protocols, results, checks, reports and reusable verification/package tools. [Artifact manifest](../artifacts/v37/artifacts.json) gives exact bytes/file counts, archive hashes, restoration and remaining temporary-file status. New retained evidence is below25 MB; V35/V36's compact evidence was not expanded or re-rendered. Git checkpoint refs/reflogs/history were not audited or altered.

See [README](README-v37.md), [KIV](KIV-v37.md) and [UI handoff](UI-REVAMP-HANDOFF-v37.md). The natural next pause is a usability review of the current studio; no UI redesign was implemented in V37.
