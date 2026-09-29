# Adding a playable song

Read `CHART-AUTHORING.md` for source coordinates, repeats, holds and coupling rules.

## Existing sources of truth

| Need | Owner | Action |
| --- | --- | --- |
| Source score | `src/assets/piano/tracks/` | Add an authorized score in the current MusicXML/MXL format; preserve musical data |
| Catalog metadata, visibility and default look-ahead | `song-library.config.cjs` | Add/adjust the entry; `visible: true` exposes it in the Library. Keep look-ahead within 2–10 s in 0.5 s steps |
| Derived metadata | `generate-song-manifest.cjs` → `song-manifest.generated.ts` | Run the generator and commit the generated diff; never edit it by hand |
| Playable letter targets | `charts/<song>-chart.ts` and `charts/song-charts.ts` | Author the mapping and declare coverage and units per quarter |
| Fresh run words | `charts/prepare-twinkle-run.ts` and word randomizer | Twinkle runs use the chart registry for their authored template. Extend this path only when the new song needs fresh wording |
| Eight Keys patterns | `charts/eight-keys-chart.ts` | Assign one editable QWER/UIOP pattern per authored phrase; inspect pitch contour, ties, repeats, holds and phrase transitions |
| Library demand | `generate-demand-metadata.cjs` → `song-demand.generated.ts` | Regenerate after chart changes; the report runs the existing importer and chart builders through focused Karma |
| Validation | `song-library.spec.ts`, relevant chart/coupling tests, browser | Check asset, note identity, count, coverage, repeats/holds and actual play/demo |

Only Theme and Variation I currently have `visible: true`. The other registered scores and some authored charts remain hidden until their intended play experience is checked.

## One-song path

1. Choose a hidden score with a suitable chart, or add an authorized MusicXML/MXL score under `src/assets/piano/tracks/`. Check importer output, performed repeats and tempo. Record intended attack and hold counts and deliberate exclusions.
2. Author or check `charts/<song>-chart.ts` in source coordinates and register coverage in `charts/song-charts.ts`. For a coupled melody, confirm every intended staff-1 sounding attack maps once, including repeat visits and holds. The current service uses Twinkle-specific word preparation for coupled songs; a different coupled song needs an explicit preparation decision before `playerPerformedMelody: true` is safe.
3. Add or update the entry in `song-library.config.cjs`, including mode-appropriate difficulty, `defaultLookAhead` and `visible: true` only after validation. Run `node src/app/piano/generate-song-manifest.cjs` and inspect `song-manifest.generated.ts`; do not edit it by hand. Author any Eight Keys phrase patterns and regenerate `song-demand.generated.ts` with `node src/app/piano/generate-demand-metadata.cjs`; do not edit derived values by hand.
4. Run focused import/chart/coupling tests, then `npm test -- --watch=false --browsers=ChromeHeadless --ts-config=src/app/piano/tsconfig.spec.json --include="src/app/piano/**/*.spec.ts"`, `npx tsc --noEmit --project tsconfig.app.json` and `npm run build`. In the browser, check selection, human input, Demo at 1× and 3×, seeks, replay and cancellation; listen for audible alignment.
5. Update the README for the actual Library and coverage. Change `CHART-AUTHORING.md` only if its authoring contract changed.

## Good content tooling

The existing importer/chart/coupling tests provide the current checks. A per-song report for uncovered and multiply assigned notes would help future content work if those tests become hard to interpret; no second importer is needed.

For each newly playable song, keep a focused test that protects its distinctive repeat/hold/word-assignment rule. Existing shared judgement tests protect the generic scoring math. Do not mirror every chart literal in a test.

## Source rights and packaging

The project's stated goal is public-domain classical music. Check the status of the specific score/edition and recording/SoundFont you plan to distribute; public-domain composition alone does not establish the rights to a particular digital edition. Keep new assets local and verify the site's base-href asset paths in a production build.
