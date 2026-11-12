# V39 - Studio simplification and visual redesign

## State-to-controls map (implementation contract)

| State | Workspace | Primary action area | Other visible controls |
| --- | --- | --- | --- |
| Empty | Import reference image | Central import only | Planner, detail, resolution, search; Settings; More |
| Reference preview | Reference | Paint | Four essential settings; Import new reference; Settings; More |
| Painting/refining | Painting; configured reference view retained | Pause, End pass | Compact pass progress, accepted strokes, elapsed; utilities |
| Paused mid-pass | Painting | Resume, End pass | Same pass progress; inspection and utilities |
| Ready | Painting | Global refinement, Targeted refinement, Save image | Undo when available; short stop reason; utilities |
| Targeting | Painting and live circle during gesture | Same ready actions, targeted mode visibly selected | Release/Escape/right-click hint; Undo when available |
| Imported replay | Painting | Playback, Save image | One refinement limitation; utilities |

Settings is a modal drawer with Painting, Appearance, View and Advanced groups.
Replay and export options are contextual panels opened from More. Essential
generation settings move into Settings once painting begins. No persistent tabs,
budget forms, reference-view toolbar, duplicate title or explanatory paragraphs.
Import new reference remains in the header for every nonempty state, including
running and paused sessions. Dialogs isolate pointer and keyboard interaction
from the painting; closing a panel cannot submit a target pass.

## Controls and replacement

Use **Import new reference** in the header to start a new painting. Images are
decoded and checked before the single replacement confirmation. Chooser cancel,
invalid images and declined confirmation preserve the live session. Acceptance
invalidates old worker messages and returns to reference preview; Paint is explicit.

Reference defaults to Floating inset. Starting Paint preserves the current view;
new references and Reset studio settings restore the configured view. The floating
inset is draggable across its image/title, with a separate resize corner and
0-100% image-opacity slider. Opacity persists through passes; new references and
inset/studio reset restore 100%. Its controls stay visible at zero opacity.

Settings holds painting budgets/options, appearance, reference views and Advanced
brushes/priority/diagnostics. More holds JSON import, replay and export options.
Save image directly exports the full painting using the selected export settings.
Replay and Export panels retain timeline, current-frame export, stroke rendering
and bitmap enlargement. Pause resumes the captured pass; End pass preserves a
refinable session. Remaining targeting mode waits for another gesture, never repeats.

## Editable defaults and appearance precedence

Edit [studio-defaults.js](../studio-defaults.js), then run `node build.cjs` from
`stroke-master`. Initial/global/target allowances are 1400/1400/280, with proposal
multiplier 4. Keep targeting defaults true. Each pass captures its allowance.

The `appearance` object exposes heightExaggeration (0..6, default .5), lightAzimuth
(0..360), lightElevation (5..90), lightIntensity (0..2.5), ambientLight (.05..1.5),
lightWarmth (-1..1), shadowStrength (0..0.6), shadowReach (1..24 planning pixels),
and lightColour (RGB, each 0..255). Comments record all defaults and ranges;
`studioAppearance` validates and maps them into renderer settings. Invalid
configuration falls back per field. Reset appearance restores configured values.

Explicit imported appearance wins; configuration fills only missing values.
New sessions use configuration. Imported invalid explicit values still fail
validation. Legacy recorded lighting is preserved. Presentation changes affect
rendering and both PNG methods, never deposited height, pigment or planner scoring.
No persisted UI settings exist: there is no storage migration or hidden override.

## Themes and fonts

Paper is the default; Graphite and Porcelain are available in Settings. Shared
studio tokens control surfaces, spacing, focus and typography. Neutral canvas
surrounds and unchanged painting pixels keep theme colour outside the artwork.
Inter and Newsreader Latin WOFF2 files total about 103 KiB, are locally bundled
under SIL OFL, and embed into the standalone page with their license notices.
See [font sources and licenses](../assets/fonts/README.md). No runtime network.

## Follow-up adjustments - 2026-10-10

- **Floating inset default:** `referenceView` and its validation fallback now use
  `floating`. Removed the hardcoded hide in `startPainting()` that overrode the
  default after upload. Paint preserves the selected view through later passes.
- **Whole-window dragging:** the image, title and window surface move the inset.
  The corner resize control remains independent; arrow-key movement and resizing
  remain available.
- **Reference opacity:** added a labelled 0-100% slider inside the floating window.
  It fades only the image, leaving controls usable at 0%. Mouse/keyboard changes
  do not drag the window or alter painting pixels. The slider remains usable at
  minimum inset size; opacity survives refinement and resets with a new reference
  or inset/studio reset.
- **User-authored backdrop override:** `.studio dialog::backdrop {background: none}`
  is present in [studio.css](../studio.css). Preserve this choice so opening a
  studio dialog does not dim the painting. The dialog remains modal.

The reference-view, dragging/resizing and opacity changes were rebuilt and checked
in desktop Chrome with `v39-browser.cjs`. The manual backdrop override was confirmed
in source during this documentation update; browser checks predate that override.

## Validation and remaining limits

Run from the repository root:

- `node stroke-master/build.cjs`
- `node stroke-master/v39-test.cjs`: all appearance mappings/fallbacks, import
  precedence, actual .5 rendering, identical strokes/scoring/RNG/material data.
- `node stroke-master/v39-browser.cjs`: desktop Chrome replacement from running
  and paused sessions, chooser/confirmation cancellation, invalid input and stale
  messages; targeting/Undo/cancel; reference modes; appearance/reset; both 2x PNG
  methods, full/frame exports; replay import; keyboard/focus; 480px layout.
- `node stroke-master/v33-test.cjs --out=stroke-master/artifacts/v39`: explicit
  settings preservation for retained planners, continuation, targeting/Undo,
  historical replay and deposition checks. No tournament.

All checks passed. Visual review covers empty, reference, painting, paused, ready,
targeting, imported replay, Settings and narrow layout in all three themes.
Text and primary-button contrast checks pass; theme switches preserve artwork and
export pixels. Reports and three representative screenshots are in
[artifacts/v39](../artifacts/v39); transient captures stay outside Git.
Engine and worker algorithms are unchanged. Touch devices and other browsers
were not exercised; desktop Chrome is the tested interaction environment.

