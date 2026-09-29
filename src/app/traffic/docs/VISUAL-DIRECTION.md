# Visual direction — living traffic diagram

Proposed identity: a warm midnight city map with crisp road markings, luminous car platoons, mechanical signal controls and satisfying bursts of movement. Strategic legibility comes first. This direction belongs to this game only.

## Composition

The road board is the dominant surface: about 70% of desktop play area. A compact top strip displays wave, completed trips, credits and heat. Place a control rail beside the board on wide screens and below it on narrow screens. Intermission choices temporarily occupy the board; never crowd it with a permanent wall of cards.

Use the site's existing font assets initially. Bold condensed-feeling system display type, normal readable control labels and tabular numerals are sufficient. Avoid downloading a font pack for the prototype.

The map background is dark navy; roads are visibly lighter, with warm chalk lane markings. Mint means movement/reward, amber means waiting, coral means critical congestion. Labels, shapes and indicators reinforce color. A red light is a control state; it does not itself mean failure.

## Geometry and depth

Roads and lane markings establish the visual language. Controls can echo road signs with short labels, sturdy edges and a small press offset. Use broad negative space around the junction and subtle relief on interactive controls. Reserve inset panels for instruments. Avoid repeating rounded, outlined dashboard cards for every number.

Use `traffic-tokens.scss` as the starting palette and motion source. Component code may add local geometry variables; recurring visual decisions should become named tokens. Canvas receives resolved palette values once per theme change, never reads computed styles every frame.

## Feedback

| Event | Feedback |
| --- | --- |
| Phase requested | Immediate pressed state and pending phase indicator |
| All-red clearance | Small junction pulse plus an explicit clearing indicator |
| Platoon released | Brief leading-car trail, subtle lane emphasis |
| Credits earned | Stable number update; batch small rewards rather than spraying text for every car |
| Upgrade purchased | 180 ms mechanical pop; show the changed capacity/timing on the board |
| Queue approaching danger | Graduated lane amber, waiting-time label and restrained heat movement |
| Critical heat | Coral edge accent and clear cause; no repeated full-screen flashes |
| Wave cleared | Short board-wide sweep, then readable choice cards |

No idle animation should compete with vehicles. Defer shader backgrounds, bloom and high particle counts. If ambient movement is added, keep it very slow and low contrast, and disable it with reduced motion.

## Usability and accessibility

Keep text sharp and stable; do not animate number widths. Label both phases in words and directions. Heat includes a numeric value and a reason. Never rely on traffic-light color alone.

Use visible keyboard focus and semantic buttons; custom styling does not require custom inaccessible widgets. Provide a pause control at all times, mute after audio exists, and at least 44 px touch targets. Arrow/directional icons must have labels or accessible names.

At 390 × 844, keep the road square above the control rail; the page may scroll, but important controls must remain reachable. At 1440 × 900, avoid inflating HUD cards to fill space. Respect safe-area padding if fullscreen support is later added.

Reduced motion removes bursts, trails, pulses and transitions; ordinary vehicle movement conveys the simulation and can continue. Pause freezes both gameplay and decorative movement.

## Visual acceptance

Inspect actual screenshots of `calm`, `rush-hour`, `near-gridlock`, `upgrade-choice` and `results` when those scenes exist. Check desktop and narrow viewports, long numeric values, keyboard focus and reduced motion. Store approved reference images only after the user selects the direction; do not call unreviewed generated screens canonical.
