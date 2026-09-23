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
Track selection affects only the inspection roll. Current and next-two-word
previews use fixed letter spacing; the narrow attack strip shares the roll's
horizontal coordinate mapping and fixed playhead.

`piano-judgement.ts` is independent of Angular and rendering. Configurable windows
are centralised in `TIMING_WINDOWS`: Perfect <=80 ms, Good <=160 ms, Miss after the
160 ms late boundary. Nearest unresolved target wins, ties go earlier, and a wrong
key leaves that target unresolved. Wrong-key feedback lasts 0.5 seconds of song
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
