# How to Piano chart authoring (Phase 10)

The generated song library is `song-manifest.generated.ts`. `generate-song-manifest.cjs`
scans every `.mxl` and `.musicxml` in `src/assets/piano/tracks` before normal `npm start`,
`npm run build`, `npm test`, and `npm run watch`. Restart a running dev server
after adding a file. Add an entry in `song-charts.ts` only when authoring a chart;
discovered songs otherwise have an empty chart. The registry is
independent of filenames. The
Turkish chart is in `turkish-chart.ts`; the complete Greensleeves chart is in
`greensleeves-chart.ts`; Liebestraum deliberately has an empty chart.

Each registered chart declares coverage explicitly. Greensleeves and Twinkle
Theme are `full`; Turkish March is `opening`. Unregistered songs are `listen`.
The Library uses this label without fetching or parsing score assets. Do not
infer full-song coverage from a nonempty phrase list.

Each `XmlPhrase` has one explicit `letters` entry per character. The chart is
independent of notes: the compiler never snaps a target to a pitch, voice or
sounding note. `measure` is the source measure label. `occurrence` defaults to
1; use `occurrence: 2` for a second performed visit or `'all'` to expand one
phrase over every visit. The compiler rejects missing measures, reversed hold
ends, simultaneous/non-increasing attacks, and same-key targets inside a hold.

`beat` is a **zero-based musical-unit offset**. Each song chart declares
`unitsPerQuarter`; the current charts use 2, so 1 unit is an eighth note and
`quarterOffset = beat / unitsPerQuarter`. A full 2/4 measure spans 0–4 units,
a full 3/4 or 6/8 measure spans 0–6, and a one-quarter pickup spans 0–2.
The ruler follows the measure's actual duration: a 15-quarter cadenza spans
0–30. A change of metre changes the usual measure span, not the unit length.
The endpoint is exactly the next **performed** measure start, even across a
repeat jump. The converter integrates the score's tempo map; chart positions
do not snap to sounding notes. The metronome retains its independent metric
pulse.

```ts
{ id: 'example', word: 'SUN', letters: [
  { start: { measure: 3, beat: 0 } },
  { start: { measure: 3, beat: 2 }, end: { measure: 3, beat: 3.5 } },
  { start: { measure: 4, beat: 0 } },
] }
```

A hold is a letter with `end`. The judgement accepts its attack in the same
Perfect/Good windows as a tap: 100 points for Perfect, 70 for Good, 0 for Miss.
A successful hold adds up to 100 fractional sustain points, computed as
`100 * credited held source duration / authored hold source duration`. The
attack updates combo immediately. Accepted early or late attacks receive hold
credit from the authored start; early release keeps partial credit without
changing the attack grade or combo. Re-pressing cannot extend a finished hold.
The default final-release allowance is 120 **real** milliseconds, multiplied
by playback speed in source time and capped at half of the hold duration. It
only forgives early release; holding beyond the endpoint is harmless. Window
blur finalises at the last sampled held position without allowance. The UI
rounds only the displayed total. A seek starts a fresh practice segment and
excludes skipped targets from the available score.

Numeric Perfect/Good tolerances and the hold buffer share the validated
`ScoringSettings` model with roll overlays. Defaults are 80/160/120 real ms.
Numbers are frozen during count-in and playback; overlay visibility can change
live. Attack overlays cover `target +/- tolerance * rate`, and the tail overlay
shows the capped early-release region. The passage displays up to three stable
wrapped lines directly above the Canvas. The current letter has an underline;
holds use a thin overhead bar whose fill shows credited sustain. Neither changes
character width.

Greensleeves is manually mapped to all 73 selected upper-staff attacks in
source measures 2-33, in 19 words with 17 holds. Measure 1 is listen-only. The
file has 33 written measures and no encoded repeat navigation; its recurring
phrases are written out. The wording and phrase breaks are plausible but still
need human musical review. Turkish March retains the existing 33-target chart.
Liebestraum is a playback/inspection source until a chart is authored.

The Twinkle Theme chart has 49 written upper-staff attacks expanded over its
encoded repeats to 98 performed letters, with 10 holds. Its 2/4 bars use the
same two-units-per-quarter ruler; all twelve variations and the complete
collection are intentionally uncharted. Its words and hold choices need human
musical review.

The committed Twinkle source collection has explicit `THEME.` and `VAR. I.`
through `VAR. XII.` headings. The 13 standalone `.musicxml` files in
`src/assets/piano/tracks/` preserve the original measure bodies, inherited
opening score state, and source-index provenance. The 325 source measures
partition into 24 Theme, 25 Variation I, 24 each for II?XI, and 36 for XII;
the extra Variation I measure is an alternate ending, not an extraction
duplicate. Repeated **performance** visits are expanded by the importer.
`song-library.spec.ts` checks the committed files through the same importer
and chart compiler used by the game.

The importer follows encoded note durations, tempo changes, dynamics, ties,
repeats and alternate endings, grace timing, arpeggio marks and pedal controller
64. Tuplets use their encoded durations; octave-shift marks do not transpose
MusicXML pitch data because the pitches already represent sounding notes.
Liebestraum's two long cadenza measures use their actual lengths instead of
forcing 6/4. MusicXML does not prescribe a unique piano performance: grace
slots and arpeggio spread remain deterministic approximations; written dynamics
map to fixed velocities, and crescendos are visual only. Slurs, articulations
and fingerings do not change audio. Unsupported navigation is rejected rather
than silently skipped.

The metronome clicks quarter beats for 3/4 and 2/4, and two dotted-half groups
per regular 6/4 Liebestraum bar; extended cadenza bars continue that pulse to
their actual end. Count-in is a full metric bar at the current tempo and speed.
Metronome volume is an independent 0-150% multiplier on the nominal click gain;
master gain applies to piano and clicks afterward. The metronome sample and
SoundFont/audio engine remain resident across song switches.
