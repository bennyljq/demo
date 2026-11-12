# V38 — studio UI refinement

Open `stroke-master/index.html` directly. V33 remains champion/default; V12,
V17 and V31 remain available. No V38 planner, scoring or material change.

The workspace uses a stable right sidebar. Import a reference, select generation
settings and Paint. Running passes show captured settings, accepted strokes,
elapsed time and consumed allowance. Pause retains the remaining work; Resume
continues it. End pass preserves accepted deposits and the live optimiser, RNG,
counters and caches. Budget exhaustion means **Ready to refine**, not a final
artwork. Resolve an unfinished pass before global or targeted refinement.

Global refinement has its own additional-stroke budget. Targeted refinement is
still drag-and-release: the circle is visible throughout dragging and the local
pass; Escape, right-click, pointer cancellation or lost capture cancel an
unfinished gesture without submitting work. Keep targeting enabled means stay
in targeting mode after each pass, not automatic painting. Targeted Undo restores
the prior painting and random cursor; subsequent painting invalidates Undo as
before. New painting/reference/replay replacement requires confirmation.

The floating reference has a draggable heading and an aspect-locked resize
handle; both support arrow keys. It remains within the workspace, including
fullscreen. Hide/Show reference and Reset inset recover it. Side-by-side uses
equal preview panes with fitted aspect ratios; Fit gives comparable scale for
the matching live reference. Switching views does not seek or mutate the
painting. Fit/100%, fullscreen, Appearance, Replay and Export remain accessible.
Pigment only sets relief to zero; Lit surface restores the preceding lighting.
Detailed surface/lighting controls are expandable. Advanced contains next-paint
settings, brush/body/priority controls and Diagnostics. Under 560 px the canvas
sits above an independently scrolling sidebar rather than losing useful width.

## Editable defaults

Edit [`../studio-defaults.js`](../studio-defaults.js), then run `node build.cjs`
from `stroke-master/`. Configuration is embedded in the standalone HTML; there
is no server, bundler or automatic settings persistence. The file documents
valid choices/ranges, validates each value and safely falls back if invalid.
Advanced → Reset studio defaults restores the edited configuration for future
work and resets reference presentation. It does not alter captured pass budgets
or historical replay settings. Lighting keeps the existing rendering defaults.

Defaults: V33, balanced detail/search, 640 px planning long edge, seed 42,
quiet body .25, the existing enabled brush set; initial/global/target strokes
1400/1400/280. **Proposal limit per stroke** is the sole Advanced proposal field,
default 4. Proposals are `min(120000, ceil(requested strokes × multiplier))`:
5600/5600/1120 with the default budgets. This caps attempts; it guarantees neither
that many attempts nor accepted strokes. Each pass captures its allowance at
start. Global passes discard unused previous allowance and add precisely the
requested new allowance. Engine safety limits still apply: cumulative operations,
proposals, contact work and memory. Rejections explain the actual limit and retain
the live session. Existing direct engine continuation callers retain historical
semantics, verified by deterministic comparisons.

Planner/detail/resolution/seed/body/brushes/priority are next-painting settings;
they never replace the active planner. Search depth and budgets apply to the next
pass. Appearance applies now. Optional `studioPasses` JSON provenance records
captured allowances, consumed proposals and stop reasons; existing settings,
continuation/target histories and historical document formats remain supported.
An imported replay has no matching live reference or optimiser: it supports
timeline/playback, appearance and export, but cannot refine. The previous
reference is cleared on replay import to avoid a misleading comparison.

## Verification and retained artifacts

- `node v38-test.cjs`: defaults/rounding/fallback; End pass preservation of RNG,
  counters, deposits/errors; exact extension and atomic limit rejection; real
  worker Pause/End/refine, targeted End/Undo, immediate analysis stop and pause
  shading races.
- `node v38-browser.cjs`: real Chrome import/paint/pause/resume/end, natural and
  global exhaustion, targeted drag/cancellation/Keep/Undo, inset pointer gestures,
  split/hide/reset, Fit/100%, fullscreen inset, source-free import/timeline/playback,
  frame/full PNG exports and pigment/lit restoration, 480×720 layout. Full PNG
  pixels match canonical replay for both export methods. No runtime exceptions.
- `node v33-test.cjs --out=artifacts/v38`: exact explicit-setting V12/V17/V31/V33
  deterministic preservation through continuation and seeds 42/73, targeted
  cancellation/Undo, historical replay and feather/deposition checks.

Small results are in `artifacts/v38/{lifecycle-checks,browser-checks,v33-checks}.json`.
Only three ignored local screenshots (`empty.png`, `ready.png`, `narrow.png`)
are retained there. The test reference and replay are temporary fixtures; no
comparison archive, tournament, historical evidence expansion or commit.

Remaining review: visual approval of the layout and hands-on touch/fullscreen
behaviour in browsers other than desktop Chrome. The live optimiser still cannot
be reconstructed from imported JSON; cumulative engine safety limits remain.
