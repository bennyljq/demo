# HARD Pianist — local instructions

Scope: `src/app/piano/`, the `/piano` route, and piano-owned assets under `src/assets/piano/`. Follow the repository root instructions too. Explicit task instructions take precedence.

## Working style

- This is a mature Angular 22 game after Phase 19. Inspect the actual code before changing it; the docs describe intent and may lag implementation.
- Make a bounded, behavior-preserving change unless the task explicitly requests new behavior. Favor fewer concepts and clearer ownership over lower line count alone.
- Remove obsolete code and duplicated logic after verifying callers. Do not replace one small function with a facade, event bus, generic framework, speculative interface, or several forwarding files.
- Match existing naming and structure where useful. Split a file only if the moved code has a real single responsibility and fewer cross-file dependencies.
- Keep game styles and tokens component-scoped. Preserve light/dark themes, reduced-motion behavior, keyboard focus, and narrow viewport layout.
- Keep generated files generated. `song-library.config.cjs` is the registry source; run `generate-song-manifest.cjs` after config or asset changes. Do not hand-edit `song-manifest.generated.ts`.
- Follow `CHART-AUTHORING.md` for musical coordinates, holds, repeat visits, phrase wording and coupling. Never modify score data merely to make a chart pass.
- Audio-clock scheduling owns demo sound. Canvas frames render and apply due judgements; they must not schedule note-on/off sounds. Preserve the source-song-time versus real-time speed conversion.
- Do not remove channel retirement or cleanup paths without a replacement that handles queued uncancellable synth events. Keep route exit, cancellation, seek, blur and Settings behavior deliberate.
- A refactor must keep human Results separate from Demo, preserve frozen result snapshots, and retain the Phase 19 grading contract.

## Read only relevant context

| Work | Read |
| --- | --- |
| Simplification | `docs/PHASE-20.md` and the relevant section of `docs/ARCHITECTURE.md` |
| Adding or exposing a song | `docs/CONTENT-WORKFLOW.md` and `CHART-AUTHORING.md` |
| Changing user-facing behavior | `README.md` current Play flow and affected Phase 18/19 notes |
| Timing, demo or synth lifecycle | Relevant `audio/`, `gameplay/` and existing focused tests; see architecture contracts |
| Visual changes | Phase 19 notes and `phase19-review/` only when that screen is affected |

## Validation and reporting

- Run the smallest focused tests for the behavior you touch, then the complete piano suite and production build at the end of a substantial Phase 20 slice. Use the project's actual scripts when they regenerate the manifest.
- For interaction or visual behavior, inspect the affected browser flow when tooling is available. Human listening remains necessary for audible quality and perceived sync.
- In the final report, name the code removed or simplified, explain why the new path is easier to follow, give actual checks and note any behavior you could not verify.
- Do not use subagents for a routine local refactor. Delegate independent read-only investigation only when specifically asked or when a task truly spans separate subsystems.
