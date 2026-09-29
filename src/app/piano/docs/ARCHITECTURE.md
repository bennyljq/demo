# Piano architecture and contracts

This map is based on the supplied Phase 19 README and folder summary. Check imports, APIs and code before editing; it does not claim to be a freshly verified dependency graph.

## Main path

`MusicXML/MXL score → normalized score and timeline → authored chart / run words → playback and count-in → typing/hold judgements → canvas and UI → frozen human result`.

The game is organized by responsibility around `piano.component.ts`. The component owns screen stages and user actions. Its HTML covers Home, Library, Play, Results and the demo keyboard; its SCSS owns local themes and layout. A smaller component is useful only if it clearly reduces state coupling or stage branching. Moving methods out for file size alone can make the flow harder to trace.

| Boundary | Current owners | Must preserve |
| --- | --- | --- |
| Library | `song-library.config.cjs`, generator, generated manifest, `song-library.spec.ts` | Curated visibility and matching asset metadata; generated file is not authored source |
| Score | `music/musicxml-import.ts`, `mxl-container.ts`, `piano-timeline.ts`, `piano-chart-time.ts` | Measure, repeat, tempo and note identity needed by charts and playback |
| Authored run | `charts/song-charts.ts`, song-specific charts, Twinkle preparation/randomizer, `gameplay/piano-chart.ts`, `twinkle-coupling.ts` | Correct authored coordinates, letter counts, repeat reuse, holds and note coupling |
| Transport/sound | `audio/piano-playback.service.ts`, metronome, player performance | One audio-clock transport; count-in, song-time position, scheduled demo sound, retained SF2 engine across quick restarts |
| Judgement/result | `gameplay/piano-judgement.ts`, scoring settings, demo controller, run result and grade | Speed-adjusted timing, penalties, holds, human-only immutable Results and grade thresholds |
| View | `rendering/piano-roll.ts`, geometry, demo keyboard, component HTML/SCSS | Canvas time/geometry, UI stage behavior, theme and reduced motion |

## Behavioral invariants for refactors

1. Selecting a song prepares its local score, SF2 and a fresh playable word assignment. Armed Reroll changes words without refetching score/audio. Human Restart/Escape and Results Replay use fresh words; Demo completion/cancellation returns to armed Play with the same words. Practice seek keeps words; Demo starts at song time zero.
2. Count-in is derived from the selected position's meter, tempo and speed and is scheduled on the audio clock. The song position stays frozen until the sequencer begins. Avoid a duplicated downbeat.
3. Demo's full bounded note-on/off plan is scheduled on the synth audio clock. Canvas samples the transport to apply the same ordered actions to judgement, including catch-up after delayed/hidden frames. It cannot determine whether demo sound happens.
4. Queued synth note-ons lack ordinary cancellation. Cancelled demo channels are muted and retired through their last queued event, including across synth resets. A refactor that makes stop look simpler must still guarantee no late sound.
5. Source-song time drives chart position and roll. Typing tolerance and hold allowance are real-time windows; convert song-time deltas by the current playback rate. Canvas animation timestamps do not set hit scores.
6. Human input ignores demo, repeat/modified/composing keydown and editable controls. Blur and Settings release human-held notes, while the demo continues through those cases. In-game Home stops the run but keeps the component and audio engine available for another song; leaving the route destroys the component, audio service and listeners.
7. Demo does not create human Results. Human Results freeze words, per-letter judgements, speed, unrounded floored score and grade. Seeked runs are Practice grades; listen-only, demo and zero-target sessions have none. Grade thresholds remain S ≥95%, A ≥85%, B ≥70%, C ≥50%, D otherwise unless specifically changed.
8. Theme has 98 performed targets and six performed holds over repeat visits; Variation I has 322 attacks and eight holds. Preserve source-coordinate and repeat policies rather than trying to force both through a lossy common template.
9. Phase 19 keeps stable Play controls/passage position, bounded roll hit effects, component-scoped aubergine/lavender themes, motion toggle, reduced motion, flame toggle and grade reveal. Treat appearance as behavior where layout and feedback convey timing.

The figures and behavior above reflect the supplied README as of Phase 19. Before updating tests or documentation, resolve any discrepancy against current source and desired player behavior.

## Ownership rules when simplifying

- Keep parsing and data transformation independent of Angular and DOM.
- Keep the synthesizer and audio scheduling in the playback/performance layer. Avoid moving audio to component event handlers or RAF.
- Keep timing and judgement functions independent of UI state; keep visual effects out of scoring.
- Let the component coordinate stages, actions and view state. Consolidate duplicated stage guards and cleanup at their true owner, but avoid a new orchestration layer that merely forwards calls.
- Prefer explicit song-specific chart definitions plus a small shared compiler over a universal chart schema that obscures musical differences.
- No persistence or cross-game service extraction is part of Phase 20.
