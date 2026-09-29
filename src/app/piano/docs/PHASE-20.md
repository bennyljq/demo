# Phase 20 — make the game easier to change

Goal: reduce the effort to understand, debug and extend the current game. Preserve the Phase 19 play flow before expanding the library. Use this as a sequence of small code changes, not one repository-wide rewrite.

## First pass: evidence and baseline

1. Inspect the actual `piano.component.ts`, playback service, chart preparation, generators and imports. Identify real complexity: state ownership, duplicated stage transitions, redundant variants, dead paths and repeated data conversion. Do not infer dead code from filename or size.
2. Record current focused test/build commands and baseline results. Use the generated manifest from its source config, and avoid treating old historical README test counts as current results.
3. Name up to three concrete candidates with exact files/call sites, expected deletions/changes, behavioral risk and the smallest test that protects each. Rank by maintenance value and safety; line count alone is not a goal.

## Incremental cleanup slices

- Slice A: one high-confidence flow, preferably a duplicated stage guard, state reset or cleanup path in the component and its direct collaborators. Simplify at the owner; remove replaced branches, flags and tests that only asserted obsolete implementation detail. Preserve the full current Play flow.
- Slice B: chart and song preparation. Trace the source config → generator → generated metadata → score → chart mapping → fresh run words. Deduplicate only repeated transformation or validation that is identical in practice. Keep song-specific authored choices explicit.
- Slice C: audio and timing. Attempt only after the earlier slices are stable. Map every cancel and reset path first. Do not shorten code by bypassing the audio clock, channel retirement or speed conversion. Separate cosmetic effects from musical state if they are currently tangled.
- Slice D: documentation. Make the README's current Play flow concise and accurate; retain or archive historical phase notes with working links. Update `CHART-AUTHORING.md` only for a changed authoring contract. Remove stale docs when the new workflow supersedes them.

For a narrowly scoped task, choose one slice and run its matching checks before the next task. When a task explicitly authorizes broader cleanup, complete justified slices sequentially and check each affected behavior before continuing. If inspection finds no safe high-value change, return a prioritized plan with evidence rather than perform a cosmetic rename.

## Acceptance for each slice

- The same player action still reaches the same stage and produces the same sound, chart, scoring and Results, unless a change is explicitly requested.
- A reader can trace the modified behavior through fewer decisions or owners; include a before/after explanation grounded in actual code.
- Deleted code has no remaining callers or hidden use in generator, tests, demo or assets.
- Relevant tests pass. After a substantial slice, run the complete piano suite, application TypeScript check and production build using the actual repository scripts.
- For stage/UI changes, browser-check a representative human run, Demo, cancellation and replay, with no console errors. Human listening is required to claim audible quality or perceived sync.

## What to avoid

- Rewriting the entire component and service at once.
- Moving every stage into a new component simply to reduce the root file's line count.
- Replacing concrete chart definitions with opaque data or runtime reflection.
- Changing gameplay timing, scores, audio scheduling, word freshness or library visibility as an incidental cleanup.
- Adding dependencies, a new state framework, generic factories or shared utilities for hypothetical future games.

## Exit to content work

At the end of cleanup, capture the shortest verified path for adding a hidden existing score or a new score, the commands that regenerate and validate it, and any authoring friction still present. Only then take the next song through `CONTENT-WORKFLOW.md`; improve the workflow in response to that real addition.
