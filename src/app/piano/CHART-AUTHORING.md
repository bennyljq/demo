# How to Piano chart authoring

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
Perfect/Good windows as a tap: 100 points for Perfect, 70 for Good, −10 for a missed attack.
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
encoded repeats to 98 performed letters, with 6 current holds. Its 2/4 bars use
the same two-units-per-quarter ruler; Variations II–XII and the complete
collection remain uncharted. The immutable authored template has
twelve phrases: eleven four-letter slots and one five-letter slot.
prepare-twinkle-run.ts draws seeded words from the common-word bank, then
compiles and couples them before Ready. It rejects identical consecutive
assignments and retries boundedly when a word choice conflicts with a held key,
including across phrase boundaries. Both repeat visits share each word. The
authored placeholder words and hold choices still need human musical review.

For both playable Twinkle songs, each target must coincide with exactly one performed
staff-1 sounding attack. `coupleStaffMelody` checks the target's source
measure and repeat occurrence, maps its complete pitch bundle by retained
sounding-note IDs, verifies hold endpoints, and rejects missing or duplicate
attacks. Tied continuations are not new attacks. Chord attacks retain every
pitch in the bundle. The coupled note, rather than
a separate hand-authored pitch list, supplies velocity and original sounding
end to player audio. When editing either chart, keep full staff-1 coverage across
every performed visit; a mismatch prevents the song from loading instead of
silently autoplaying or omitting melody notes. Other charts do not use this
coupling.

Variation I uses `twinkle-variation-01-chart.ts`: 25 written measures (25–49)
expand to 48 performed measures through the 25–32 first ending, measure 33
second ending, and the repeat of measures 34–49. The chart covers all 322
performed upper-staff attacks in 25 authored word slots, with eight holds at
the cadence notes in measures 32, 33 and 49 and the longer notes in measure
41 (including repeat visits). Measures 29, 30, 46 and 47 begin with tied
continuations, so their first **new** attack is at beat 0.5. There are no
grace notes in this extracted variation; the lower staff has two voices.
Each complete eighth-note bar uses one common eight-letter word; measures 29,
30, 46 and 47 use seven-letter words because their first note is a tied
continuation. The two alternate-ending single-note cadences use one-letter
words. Those phrase choices and the holds
are provisional musical interpretations. At 120 BPM the piece lasts 48 seconds,
averaging 6.7 attacks per second and peaking at eight per second in its
eighth-note runs. Eight holds remain isolated from those dense runs.

The established audio endpoint rule is unchanged: a tap sounds only until its
original note-off. At 1×, 290 of Variation I's non-hold targets have notes
shorter than the 160 ms Good late window, so an accepted hit late enough in
that window can be silent. At 0.5× the count is zero; at 3× it is 314. This
is a timing and feel limitation to review by ear, not a different grading rule.
Per-run rerolls change only words; source locations, repeat expansion, note
bundles, velocities and holds remain fixed. The compiler retries any assignment
that creates an overlapping same-key hold.

## Phase 21 mode patterns and demand

Rhythm Only compiles the original authored phrases with their attack and hold coordinates; it needs no word draw. Word Concert draws words at each human run boundary. Eight Keys replaces only each phrase's `word` with its manually editable QWER/UIOP pattern in `charts/eight-keys-chart.ts`. The existing XML chart compiler expands repeat visits and validates hold/key conflicts, then the same staff-1 coupler checks complete sounding-attack coverage. To edit a pattern, inspect the source pitch contour, pickup, ties, repeat and neighboring phrase transitions; change the matching phrase string; run `eight-keys-chart.spec.ts` and a full demo check. Repeat visits must reuse the pattern.

The initial Theme mapping covers 49 written attacks over 12 phrases, expanded to 98 performed attacks with six holds. Most phrases have four attacks across two measures; phrase 8 has five. The left hand uses QWER in the opening and return, and the right hand uses UIOP in the middle section. Variation I maps 25 written phrase slots to 322 performed attacks and eight holds. Most bars have eight attacks; measures 29, 30, 46 and 47 have seven new attacks after a tied continuation; 31 and 48 have four; 32, 33 and 49 have one; 41 has three. The pattern changes hands at phrase sections and compresses wide pitch ranges into each four-key hand. These are provisional ergonomic assignments, not literal piano fingering or a fixed pitch-to-key map; human playtesting should refine phrase transitions and fast same-finger attacks.

Initial patterns, in authored phrase order (the source file is authoritative):

These strings are finger slots, not physical-key requirements. Settings maps
QWER to L1-L4 and UIOP to R1-R4 by default and can bind each slot to another
distinct A-Z letter. Canvas targets show the slot numbers 1-4, using the
orange and green fills to distinguish hands. The authored patterns and melody
coupling remain unchanged when a player changes bindings.

| Phrase IDs | Eight Keys patterns |
| --- | --- |
| Theme 1-4 | `QQEE`, `RREE`, `EEWW`, `WWEQ` |
| Theme 5-8 | `PPOO`, `IIUU`, `PPOO`, `IIOIU` |
| Theme 9-12 | `QQEE`, `RREE`, `EEWW`, `WWEQ` |
| Variation I 25-28 | `EWQWQWQW`, `REWEWEWE`, `UIOPPOIU`, `POPOIUIU` |
| Variation I 29-33 | `PPOIIUU`, `PPOIIUU`, `WROQ`, `Q`, `Q` |
| Variation I 34-38 | `POIOIOPO`, `OIUIUIOI`, `OIUIUIOI`, `OIUIUIOI`, `POIOPOIU` |
| Variation I 39-41 | `OIUIPOIU`, `OIUIPOIU`, `PIU` |
| Variation I 42-45 | `EWQWQWQW`, `REWEWEWE`, `UIOPPOIU`, `POPOIUIU` |
| Variation I 46-49 | `PPOIIUU`, `PPOIIUU`, `WROQ`, `Q` |

Run `node src/app/piano/generate-demand-metadata.cjs` after editing a visible chart. Its focused Karma report uses the existing importer, chart builders and coupling and writes `song-demand.generated.ts`; do not edit the generated values. Demand counts required attacks including performed repeat visits, excluding spaces and hold duration as characters. The active span starts at the first attack and ends at the later of the last required coupled note's sounding end and the final hold endpoint. Average WPM is `12 × count / active span`. Peak is `12 × maximum attack count / window length` for a sliding five-source-second half-open interval `[start, start + 5)`; use active span if shorter. These are rhythm-constrained attack rates, not free-typing benchmarks. Initial generated Theme demand is 98 attacks over 47.5 s: average 24.76, peak 26.4 WPM. Variation I is 322 over 47.5 s: average 81.35, peak 96 WPM. All three current modes share these densities because they share attack locations.

Phase 18 scoring uses Perfect +100, Good +70, Miss −10 and Wrong −10.
Successful attacks increment the combo once and earn `2 × (combo − 1)`;
hold progress adds only its existing proportional bonus, up to +100. Raw
attack, sustain and combo points retain negative penalty debt before the
attempt's fixed speed multiplier; only the displayed score is clamped and
rounded. For N eligible attacks and H holds, maximum score is
`speed × [100N + 100H + N(N − 1)]`. Skipped practice targets do not count.

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
