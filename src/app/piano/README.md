# How to Piano — audio and MIDI visualiser prototype

Run `npm start`, open `http://localhost:4200/piano`, wait for **ready**, then click
**Play**. The initial download includes the supplied 139 MB SoundFont. First Play
initialises browser audio; subsequent plays reuse the same engine. **Stop** mutes
the output, kills notes, resets controllers, and rewinds. Leaving the route aborts
pending loading and destroys the engine and AudioContext.

## Playback

- `spessasynth_lib` **4.3.14**, Apache-2.0; transitive versions are in the lockfile.
- [Official documentation](https://spessasus.github.io/spessasynth_lib/)
  and [licence](https://github.com/spessasus/spessasynth_lib/blob/master/LICENSE).
- The library loads SF2 directly. Its built-in AudioWorklet sequencer handles MIDI
  timing, note lengths, velocities, tempo events and controllers on the audio clock.
- The supplied SF2's bank 0 / program 0 is `piano` (the complete instrument).
  The other five presets are individual layers. The supplied MIDI contains no
  program changes and has a duration of 255 seconds. No musical events are edited.
- `angular.json` copies the matching installed worklet and its licence to
  `assets/piano/runtime/`. The distributed worklet is self-contained, including
  its embedded WASM; no CDN or separately fetched WASM is required.
- The existing `/piano` route and `src/assets` configuration already serve the
  component and the two supplied files. Asset URLs respect the document base URL.

Use localhost or HTTPS for browser AudioWorklet support. Installation in this
project currently needs `npm install --legacy-peer-deps` because the existing
`mathjax-angular` peer dependency targets an older Angular version.

## Verification performed

- Production build and `tsc --project tsconfig.app.json --noEmit` passed. Build
  reports initial bundle size and Moment CommonJS warnings.
- Angular served both supplied files, the worklet and its licence with HTTP 200;
  SHA-256 hashes matched the local files exactly.
- Headless Chrome generated nonzero PCM audio with the supplied `piano` preset.
- Stop produced zero output, zero voices and playback time zero, including after
  a test-injected sustained note. Three Play/Stop cycles reused one AudioContext
  and restarted at the beginning, with no console errors.
- A test-only jump to the final two seconds exercised natural completion and
  return to ready, followed by successful replay. The full 255-second piece was
  not listened to or played through during this automated check.
- Route navigation closed the AudioContext, including during initialisation.
- Simulated missing MIDI and failed worklet loading displayed readable errors.

Audible verification remains manual: confirm that Play sounds like Marche turque
on piano, Stop cuts all sound, and Play after Stop starts the piece again.

## Phase 2: track inspection

The Canvas shows four seconds ahead of a fixed playhead. Track selection changes
only the visualisation. Higher MIDI pitches appear higher; green bars contain the
current playback position. Empty tracks display a message. Stop shows time zero.

| Track index (zero-based) | Name | MIDI channel (1–16) | Notes |
| --- | --- | --- | --- |
| 0 | Unnamed | None | 0 |
| 1 | Unnamed | 1 | 838 |
| 2 | Unnamed | 2 | 776 |

There are 1,614 notes across two note-bearing tracks. No melody or hand assignment
is inferred. Stored channel values are zero-based (0 and 1 respectively).

`piano-timeline.ts` uses the already-installed `spessasynth_core` 4.3.22 parser
(`BasicMIDI.fromArrayBuffer`) and `midiTicksToSeconds`, on the existing downloaded
MIDI buffer. A typed adapter pairs parsed note events per track/channel/pitch,
including zero-velocity note-offs and FIFO pairing for repeated pitches. Durations
end at note-off, regardless of sustain. Unmatched starts are omitted because they
have no note-off duration; all supplied notes have matched endings. `getNoteTimes`
was not used because it groups notes by channel without preserving track identity.

`piano-roll.ts` reads the documented `Sequencer.currentTime` every drawing frame.
It does not accumulate elapsed time or schedule audio. RAF and ResizeObserver run
outside Angular and are cancelled/disconnected when the component is destroyed.
The existing audio service still owns and disposes of the audio engine.

Phase 2 verification: production build and app TypeScript check passed. Three
focused tests passed for tempo-map conversion across note durations, chords,
zero-velocity note-offs, sustain independence, repeated pitches and track/channel
identity. Run them with Chrome available:

```sh
npx ng test --watch=false --browsers=ChromeHeadless --ts-config=src/app/piano/tsconfig.spec.json --include=src/app/piano/piano-timeline.spec.ts
```

The isolated test configuration avoids an existing unrelated stale
`HomepageV3Component` import in the homepage spec.

Headless Chrome verified opening rectangles, empty-track handling, pitch fitting,
simultaneous chord rectangles, active bars crossing the playhead, Stop/replay,
track selection during playback, resize at DPR 2, and navigation cleanup. Visual
time and emitted note events aligned with sequencer time near 2 seconds and 121
seconds (a test-only seek to 120 seconds was used). Exactly one MIDI request was
made; no browser console errors occurred. Screenshots were inspected. Audible
synchronisation remains for manual review; no listening test was performed.

## Phase 3: fixed-word typing passage

Click Play, listen to the first short phrase (0–2 seconds), then type the letters
at the playhead. Spaces need no input. Stop clears the attempt; Play starts a fresh
attempt. The result appears after 15.16 seconds and the full soundtrack continues.
If a track selector or another editable control has focus, click outside it before
typing; input intended for those controls is ignored.

The editable chart is `piano-chart.ts`: fixed words reference explicit timeline
note IDs. Times below are an inspection report, not a second source of timing.
The chart compiler derives them from the MIDI and rejects missing references,
letter-count mismatches, and non-increasing or simultaneous attacks.

Selected line: zero-based track 1, MIDI channel 1 (stored channel 0). Its opening
B4–A4–G#4–A4–C5 contour and subsequent moving upper notes suggest a melody, compared
with track 2's lower A3 bass and repeated C4/E4 chord accompaniment. This is a
manual musical interpretation, not an automatic hand or melody assignment.
The first five attacks are listen-only. Chord attacks use one selected upper note;
the brief G5/A5 grace notes immediately before 9, 11 and 13 seconds are omitted.
Phrase boundaries, word grouping and ornamental omissions are provisional.

| Word | Selected attacks (seconds) | Pitches in order |
| --- | --- | --- |
| APPLE | 2, 2.25, 2.5, 2.75, 3 | D5 C5 B4 C5 E5 |
| FISH | 4, 4.25, 4.5, 4.75 | F5 E5 D#5 E5 |
| BIRD | 5, 5.25, 5.5, 5.75 | B5 A5 G#5 A5 |
| HOUSE | 6, 6.25, 6.5, 6.75, 7 | B5 A5 G#5 A5 C6 |
| STAR | 8, 8.5, 9, 9.5 | A5 C6 B5 A5 |
| MOON | 10, 10.5, 11, 11.5 | G5 A5 B5 A5 |
| TREE | 12, 12.5, 13, 13.5 | G5 A5 B5 A5 |
| SUN | 14, 14.5, 15 | G5 F#5 E5 |

There are 33 letters over 13 seconds of playable attacks. No typing changes audio.
Track selection affects only the inspection roll. Current and next-four-word
previews use fixed letter spacing; the narrow attack strip shares the roll's
horizontal coordinate mapping and fixed playhead.

`piano-judgement.ts` is independent of Angular and rendering. Configurable windows
are centralised in `TIMING_WINDOWS`: Perfect <=80 ms, Good <=160 ms, Miss after the
160 ms late boundary. Nearest unresolved target wins, ties go earlier, and a wrong
key leaves that target unresolved. Wrong-key feedback lasts 0.5 seconds of real
time. Every frame/input expires all overdue targets, so missing letters cannot
block progress. Floating-point tolerance is limited to one nanosecond at inclusive
boundaries. The summary waits until the last late window closes even if all letters
were resolved early.

Both input and drawing read `PianoPlaybackService.playbackPosition`. The existing
RAF drives drawing and time sampling, with no independent gameplay timer. Angular
receives updates only when judgement or phrase state changes. Keydown handling
ignores repeats, Ctrl/Alt/Meta shortcuts, composition and editable controls;
Shift/case differences are allowed. The listener is removed on route destruction.

Automated verification: production build and TypeScript check passed; all 10 piano
tests passed (including the original timeline tests). Existing bundle-size/Moment
warnings remain. Run the complete focused set with:

```sh
npx ng test --watch=false --browsers=ChromeHeadless --ts-config=src/app/piano/tsconfig.spec.json --include="src/app/piano/*.spec.ts"
```

Headless Chrome keyboard automation verified previews, Listen, wrong-key feedback,
uppercase matches, continued input after misses, focused-selector input exclusion,
track selection without chart/audio changes, completion with soundtrack continuing,
Stop/replay reset, and keyboard/audio cleanup. A real-time automated run yielded
4 Perfect / 0 Good / 29 Miss, as expected from its deliberately sparse inputs;
there were no console errors. The screenshot was inspected for word/strip layout.
This was not human playtesting or an audible musical-feel assessment. No latency
calibration is applied, and the selected phrases/words still need human review.

## Phase 4: preview, playback speed and feedback

The preview now shows the current word plus the next four words, where available.
Upcoming words are quieter; the current word and individual result colours stay
prominent. The preview wraps on narrow screens without horizontal overflow. The
chart and its selected upper-line attacks are unchanged.

Speed options are **0.5×, 0.75×, 1×, 1.25×, 1.5× and 2×**. Choose a speed while
ready. It remains selected after Stop and is applied to SpessaSynth's sequencer
before Play, including the first Play. The control is disabled during loading and
playback. The [sequencer API](https://spessasus.github.io/spessasynth_lib/sequencer/)
documents `playbackRate` and `currentTime`. In the installed implementation,
`currentTime` advances in original MIDI seconds at the chosen rate. Thus the roll,
attack strip, words and chart stay in source-song coordinates. Playback rate changes
the MIDI sequence speed through SpessaSynth; no audio samples or note pitches are
changed by this code. Pitch preservation was not checked by listening.

Judgement retains **80 ms Perfect** and **160 ms Good** real-time windows at every
speed. Source-song timing differences are divided by playback rate for hit choice,
miss expiry and completion. Nearest-target and tie rules are unchanged. Wrong-key
feedback and the one replaceable result label use 500 ms of wall time; neither
controls gameplay timing. Success and miss feedback show a short letter pulse or
fade plus a named label. Perfect also draws one short expanding ring at the
playhead. Batch misses update all letter states and show only one label.
`prefers-reduced-motion` suppresses the animations and ring while retaining result
text and colour. Stop, replay and route destruction clear the transient feedback.

Verification: production build and app TypeScript check pass. All **14 focused
tests** pass, including equal real-time judgements at all six speeds, scaled miss
and completion boundaries, nearest-target selection at 2×, and rate-independent
wrong-key feedback. Headless Chrome measured source-song clock advancement close
to 0.5, 0.75, 1, 1.25, 1.5 and 2 original seconds per wall second, with Canvas
reading the same sequencer time. Browser checks covered five-word preview, speed
retention after Stop, first-play rate application, Perfect/Good/Miss labels and
bounded effects, real-time feedback expiry, reduced-motion suppression, and no
mobile horizontal overflow. The playback engine was reused without console errors.
Human listening and playtesting remain to assess pitch and musical feel.

## Phase 5: MusicXML source proof of concept

The speed selector's first option is 0.5×, so the earlier `[value]` binding could
be applied before Angular created its options. The browser then displayed the first
option while the service still held 1×. Each speed option now binds its `selected`
state to the same service signal. The service still sets `sequencer.playbackRate`
explicitly after audio initialisation and before every Play. A fresh, untouched
page was checked: control value, stored rate and sequencer rate were all 1×, and
the first playback advanced at approximately 1 original song second per wall
second. The slow/fast choices and Stop/Play retention remain available.

The supplied `WA_Mozart_Marche_Turque_Turkish_March_fingered.mxl` was inspected:
it is compressed MusicXML with 137 measures, 1,651 written notes, 189 grace
notes, arpeggiation, and other notation. Compressed MXL and grace timing are
outside this limited importer. The MusicXML selector therefore plays the separate
**original** `src/assets/piano/how-to-piano-poc.musicxml`, not a conversion of the
supplied Mozart score or the original Turkish March MIDI. The supplied MXL remains
untouched for a later import milestone.

The fixture is one piano part, two staves and four 4/4 measures, with 480
divisions per quarter note. It is hand-inspectable: simultaneous treble/bass notes,
a bass chord, a treble rest, one A5 tie from measure 2 to 3, an E-flat pitch,
tempos 120 and 90 BPM, and playback dynamics 80% and 120%. MusicXML defines
`<sound dynamics>` as a percentage of default forte MIDI velocity 90, so these
become velocities **72 and 108**; [MusicXML 4.0 playback reference](https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/sound/).

`musicxml-import.ts` uses browser `DOMParser` to read this narrow uncompressed
`score-partwise` subset. It retains 22 written identities (including the rest
and the tied continuation), part/staff/voice/measure/onset/duration/tie metadata,
tempo events, and dynamics. The tie becomes one sounding attack with two source
IDs. There are **20 sounding attacks**: 13 on staff 1 voice 1, and 7 on staff 2
voice 2. Source metadata stays in `ImportedScore` after an in-memory format-1 MIDI
is produced by SpessaSynth Core's `MIDIBuilder` (Apache-2.0). The existing
SpessaSynth sequencer and SF2 play that MIDI. The score performance events also
directly supply the piano-roll timeline; neither playback nor drawing uses a new
clock. Source switching reuses the loaded SoundFont/audio context and clears the
previous view/attempt. The MIDI typing chart is unchanged and appears only for
the original MIDI source.

Expected timing at 1×: measures 1–2 run from **0 to 4.0 seconds** at 120 BPM;
measures 3–4 run from **4.0 to approximately 9.333 seconds** at 90 BPM. The A5
tie starts at **3.5 seconds** and lasts approximately **1.167 seconds**, with no
new attack at 4.0 seconds. The E-flat5 note begins at approximately **5.333
seconds**. Encoded MusicXML durations determine these times; no note-type timing
is guessed. If tempo or playback dynamics are absent, the importer explicitly
falls back to 120 BPM and velocity 90.

Unsupported playback constructs, including compressed MXL, repeats, endings,
grace notes, ornaments, articulations, pedal, wedges, arpeggiation and malformed
ties, produce a diagnostic. Harmless print and layout details are ignored.
Tuplets encoded through durations, additional parts, expressive ramps, and other
unimplemented MusicXML features are not claimed as faithful playback. The
importer does not add humanisation or articulation.

Verification: production build and app TypeScript checks pass; all **18 focused
piano tests** pass. Fixture tests cover treble/bass alignment, a simultaneous
chord, the advancing rest, the cross-measure tie, tempo-derived seconds, velocity
conversion, generated MIDI note count, and unsupported-construct diagnostics.
Headless Chrome verified the fresh 1× fix, source switching, nonzero PCM output
from the MusicXML source, roll/seq position alignment, Stop/replay at 1.5×,
restoration of the MIDI typing chart, reuse of the same AudioContext, and cleanup
on navigation. No browser console errors occurred. Screenshots were inspected.
Generated-event correctness was checked; human listening and musical quality of
the fixture have not been verified.

## Phase 6: supplied Turkish March score

Choose **Turkish March — MusicXML** at `/piano` to play the supplied compressed
score. MIDI and the four-measure MusicXML fixture remain separate source options;
only the original MIDI has a typing chart. The MXL is read through its
`META-INF/container.xml` rootfile declaration (`score.xml` in this archive), then
converted into in-memory MIDI for the same SpessaSynth/SF2 path. No additional ZIP
package was present in the project, so the small container reader locates the
declared ZIP entry and uses the browser's `DecompressionStream('deflate-raw')` for
DEFLATE. A browser without that format reports a loading error.

The source has **one piano part, two staves, 137 numbered measures (0–136), 1,651
`<note>` elements**, of which **36 are rests** and **189 are grace notes**. Thus
those 1,651 are not all sounded attacks. There are 322 chord-member elements,
24 arpeggiation marks, 27 written dynamic directions, four wedge spans before
repeat expansion, one explicit tempo (120 BPM), and treble/bass clefs. The score
uses 2/4, eight divisions per quarter, and half-length boundary measures around
repeats. Nine non-nested repeat sections plus the first/second ending at measures
104/105 yield **241 performed measures**, **2,876 performed written note/rest
instances** (64 rests, 282 grace notes), and **2,812 sounding attacks** over
**223.5 seconds at 1×**. Performed voice groups are staff 1 voice 1: 1,450;
staff 1 voice 2: 40; staff 2 voice 5: 1,322 attacks. Repeated source measures
retain their number and receive distinct occurrence IDs. A first-ending barline
is shown only on its first pass; the second pass continues to measure 105.

Encoded `<duration>` values, backups, chords, rests, divisions, pickups, ties,
tempo, and `<sound dynamics>` drive MIDI and the same piano-roll timeline. Numeric
dynamics follow MusicXML's percent-of-forte (velocity 90) rule. A direction with
only a written symbol uses the central `WRITTEN_DYNAMICS` table in
`musicxml-import.ts`; those fixed velocities are approximations, not pianist
interpretations. Source pitch spelling, type, dots, accidental, fingering, staff,
voice, measure, grace status and notation categories remain on written notes.
Malformed timing, unsupported navigation and unpaired ties/wedges fail with a
diagnostic instead of playing a partial score. Tuplets use encoded durations.

The 189 source grace notes have no explicit timing attributes. Their performed
copies take a bounded slot at the start of the following principal note: 25% of
its duration, capped at a quarter of a quarter-note and at half its duration.
Successive grace steps divide that slot, while grace chord members share a step.
The principal's original end and all measure boundaries stay fixed, so the two
staves do not drift. Explicit `steal-time-following` and
`steal-time-previous` percentages choose and shorten that donor; `make-time`
inserts real time into both staves and later measure positions. Grace timing is a
deterministic performance policy, not a reconstruction of the editor's intent.
Arpeggio marks at measure 106 and later spread the simultaneous staff chord
bottom-up by at most 0.04 quarter per note, capped to 35% of its shortest note.
The marks there span voices 1 and 2, which are grouped for the spread. Original
note ends and following beats remain fixed.

The roll labels actual measure starts with source measure numbers and `×2` on
repeat occurrences. Dynamic symbols, tempo/text, active clefs and paired wedge
spans appear in its annotation lane with staff prefixes where both staves are
visible. A status line retains current clefs, dynamics and tempo when their
markers scroll away. Wedges are **displayed but do not produce continuous volume
ramps**. Slurs, articulations and fingerings remain metadata; they are not
engraved or audibly interpreted. MIDI and score pitch axes use sharp-based
scientific names (MIDI 60 = C4), while MusicXML spelling remains in metadata.
The speed selector now includes 2.5× and 3×; 1× remains the initial value.
Master Volume is 0–500%, initially 100%, and ramps the final output gain over
15 ms during playback. Stop mutes independently of the saved volume; Play restores
the chosen level. Neither volume nor source selection changes judgement timing.

Verification: production build and app TypeScript check passed; **25 focused
Chrome tests** passed. Tests cover the MXL rootfile, source inventory, repeat
visits/ending, grace timing without drift, explicit `make-time`, cross-voice
arpeggiation, bar/annotation positions at the fixture's 120→90 BPM change,
pitch naming, and judgement at 3×. Headless Chrome loaded the score locally,
showed the opening and wedges at measures 38–39, and traversed the entire piece
at 3× through measures 0, 38, 61, 128 and natural completion. Volume mute gave
zero PCM output; Stop, replay, all three source switches, retained 3×/volume,
and route cleanup passed without console errors. These are automated checks,
not human listening; musical feel, the grace-note policy and audible arpeggiation
still need listening review. The existing bundle-budget and Moment warnings remain.

Phase 7 v2 chart editing, holds, badges, volume ticks and seeking are documented
in [CHART-AUTHORING.md](./CHART-AUTHORING.md). The phase 6 verification above
describes its own snapshot; see that guide for the current practice controls.

## Phase 8

The current [chart guide](./CHART-AUTHORING.md) supersedes the phase 7 v2
chart syntax and badge layout described earlier in this history. Turkish March
MusicXML is the only selectable source. XML letter targets are independent of
sound attacks and use the score's authored measure coordinate. The roll has a
separate letter lane, adjustable Look ahead, measure labels and two themes.
An optional local-sample metronome provides a 2/4 count-in and score-beat
clicks. MIDI and the four-measure fixture remain for regression coverage.

## Phase 9

Open `/piano`. The Song selector contains every MXL under
`src/assets/piano/tracks`. The manifest is regenerated by npm's normal
start/build/test/watch pre-scripts; restart a running dev server after adding a
new file. The chosen score is fetched on selection, cached after successful
import, and replaced without recreating the SF2 engine. A bad song shows a
local error; choose another song to continue.

Greensleeves has a manually authored 73-letter, 19-word, 17-hold chart covering
source measures 2-33 and all written recurring phrases. Measure 1 is
listen-only. The supplied file contains no repeat signs; its phrase repetitions
are written out. Liebestraum intentionally displays "No typing chart yet" while
its audio, timeline and seek work. The Turkish chart is unchanged. See
[CHART-AUTHORING.md](./CHART-AUTHORING.md) for coordinates and scoring.

The new score separates attack points from fractional hold bonuses and shows
both totals on completion. Developer settings expose shared timing tolerances,
a 120 ms release buffer, and optional roll overlays. The passage wraps by
width into at most three stable lines; result styling leaves word widths fixed.
Metronome volume 0-150% scales only its click gain and survives Stop and song
switches. The supplied 6/4 Liebestraum uses two dotted-half metronome groups;
its cadenza bars retain their longer actual durations.

Phase 9 automated checks: app TypeScript and production build passed; 41
focused Chrome tests passed. Headless Chrome loaded all three scores; it played
Greensleeves at 3x through the natural end, played Liebestraum with an empty
chart, switched songs after audio initialisation, exercised partial and full
holds, Wrong/combo, seek score reset, zero click gain with unchanged piano gain,
and rapid selection without page exceptions. Layout was inspected in both
themes at 2- and 10-second look-ahead, including a narrow viewport. These
checks did not include human listening or a human assessment of phrase wording
and musical feel.

## Phase 10

Chart `beat` values are now musical units, with an explicit `unitsPerQuarter`
per song. Turkish March, Greensleeves and Twinkle Theme use two units per
quarter. The Turkish and Greensleeves charts were migrated from their previous
coordinates; a saved pre-migration fixture compares all 106 attack times and
their hold endpoints. Pickups and cadenza bars use their actual lengths, and
barline endpoints resolve to the next performed visit through repeats. See
[CHART-AUTHORING.md](./CHART-AUTHORING.md) for the syntax and extraction command.

The reading passage now sits immediately above the roll. Its overhead bars
fill as a held letter earns sustain credit; the underline marks only the
current letter. Ready means the chart, score, metronome sample (if enabled),
audio engine, SF2 and selected MIDI sequence are prepared. A browser that
starts with audio suspended shows **Enable audio** first; click it to finish
preparation, then Play starts the normal count-in.

The Twinkle collection remains selectable. Its printed Theme and Variation
I–XII headings delimit 13 standalone MusicXML files under `tracks`; the
reproducible extractor preserves the 325 written source measures exactly once
across these files. The Theme has 24 written 2/4 measures and 48 performed
measures through encoded repeats, for about 48 seconds at its initial tempo.
Its 98-letter chart covers the repeated theme and includes 10 holds; the
variations and complete collection have no typing chart. These words and
holds are provisional musical interpretations.

The focused Chrome test suite compares extraction content, imported scores,
chart timing, repeat endpoints and readiness gating. Automated browser checks
also exercised fresh suspended-context activation, first Play, rapid song
selection, a full Theme run at 3x, and playback starts for Variations I, XI
and XII. Analyser measurements found nonzero PCM for Theme, Variation I and
Variation XII. No human listening or judgement of musical feel has been done.
