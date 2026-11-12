# V35 — protocol, reproduction and offline judging

V35 is evaluation infrastructure, with no new planner or selector. The current application's default and all artistic code remain unchanged. Authentic contestants use the maintained shared engine: display V12 legacy maps to planner11/material2; V17 to planner17/material2; V33 Optimised graded construction to planner33/material2. V33 keeps authentic loading capabilities. The same seed reproduces a planner, not identical random decisions across different planners.

Incoming revision: `29f92fba73d96c1654b67df6f0bdf8ae0638aa85`, initially clean. [Frozen protocol](../artifacts/v35/protocol.json) records reference identity, dimensions, orientation, preparation, source/PNG/RGBA hashes, source-selected crops, brush/material settings, budgets, order and judging dimensions. Its SHA256 is retained in verification, repetitions and votes. [Incoming manifest](../artifacts/v35/incoming.json) retains tracked implementation hashes and the observed working status at freeze, including the new evaluation files. Preserve this Git object and all older restoration dependencies.

All eight exact requested assets are present. Each is prepared once using Pillow 6.2.1, EXIF transpose, RGB conversion, aspect-preserving Lanczos to long side640, then RGBA. No enhancement, ICC transform, manual masks, semantic preprocessing or crop of the whole reference. Mat450→640 and rooster632→640 are explicit upsamples. One decoded buffer per reference is reused across all contestants and checked for mutation. Prepared PNGs remain authoritative for reproducing pixel identity across decoder versions.

Initial1400/5600 proposals, Continue+7000/+28000; accepted-operation observations300/1400/4000/8400 include foundation. Accepted contacts and evaluated candidate contacts are distinct. No rescue budgets; shortages and authentic stop reasons are explicit. Work uses the existing step timer, including rejected proposals and terminal steps. Setup, replay/export and gallery creation are excluded; per-run end-to-end context and export time are retained. `setupMs` covers session analysis; `endToEndMs` covers that session, painting, operation-checkpoint replay/exports and final record writing, excluding shared preparation/decoding, subsequent equal-work exports and gallery/package creation. Nearest accepted time prefixes disclose actual differences; equal candidate counts are never labelled equal compute.

Primary runs are sequential and fresh, in declared left rotations of V12/V17/V33. Each reference has a full initial+Continue warmup for each planner before its two seeds. A separate predeclared gradient/Beaver/Orca seed42 subset uses a warmup and three measured repetitions per planner in balanced order. Stroke hashes must match deterministic primary evidence; repeated runs create no duplicate galleries. Other timing observations are not precise speed rankings.

Run from `stroke-master/`. For a new competition against the current maintained implementation, use a **fresh directory**:

```text
python v35-prepare.py --out=artifacts/v35-reproduction
node v35-competition.cjs --out=artifacts/v35-reproduction --freeze
node v35-competition.cjs --out=artifacts/v35-reproduction
node v35-competition.cjs --out=artifacts/v35-reproduction --repeat
node v35-competition.cjs --out=artifacts/v35-reproduction --export-final
node v35-summary.cjs --out=artifacts/v35-reproduction
python v35-gallery.py --out=artifacts/v35-reproduction
node v35-check.cjs --out=artifacts/v35-reproduction
python v35-gallery.py --out=artifacts/v35-reproduction --package
```

For **exact historical reproduction**, copy only `protocol.json`, `incoming.json`, `references.json` and the eight `*-source.png` files into a fresh directory. Use the painting commands above with `--restore` on primary, repeat and final-export invocations. The existing Git loader restores the frozen engine/dependencies in memory, with no copied app/engine. Source assets must retain their frozen hashes. Equal-operation evidence is deterministic; timing/equal-work prefixes vary by machine. The focused checker validates the current engine and preservation; after future artistic changes add `--restore` to that checker to validate archived-engine replay without claiming preservation of the then-current application. Never overwrite immutable historical measurements.

`--export-final` only replays final records for authentic shortfalls; it generates no proposals or extra painting work. The gallery keeps the 8400 observation explicitly missing and adds an actual-final view so a stopped painting can still be judged. This observation was added when Orca V12 exhausted proposals; the frozen budgets, protocol thresholds and algorithms were not changed. Warmup and repeated timing rows deliberately export no checkpoint images: their empty `checkpoints`/`missingCheckpoints` fields describe uncaptured image evidence, not shortages. Use initial/final operation counts and stop reasons to identify actual shortfalls.

[Gallery](../artifacts/v35/comparison.html) opens directly from disk with all WebP85 previews embedded. [Offline ZIP](../artifacts/v35/offline-gallery.zip) contains the compact gallery, documentation and machine-readable summaries; extract it before opening `comparison.html`. Pictures, controls and votes need no other files. Exact PNGs, source-free replay JSON and trajectories are available separately in [Exact evidence ZIP](../artifacts/v35/exact-evidence.zip); extract that optional archive into the **same directory** to enable exact-evidence links after identity reveal. Package checks validate the combined extraction and both archive CRCs; the integrity sidecar remains outside the archives. No external publication or backend. Anonymous positions use SHA256(case key) modulo six permutations and stay consistent across checkpoints. Blinding is optional UI concealment, not a security boundary.

Votes are stored locally where supported; download JSON for durable human records. Every vote includes case, stage, rendering, crop, choice/tie, note and mapping. There are no prefilled human votes. Codex visual assessment is separate. Lower structural error is fidelity evidence, not proof of better art; references are never averaged into a quality ranking and no weighted master score exists.

Focused checks cover provenance, trajectories, operation/contact counts, exact checkpoint and equal-work replay, first crossings, gallery decoding, anonymous reveal, local links and vote roundtrip. Existing historical suites and galleries are not regenerated. [Report](V35-COMPETITION.md) · [KIV](KIV-v35.md).

Browser checks use the existing CDP harness and Chrome at its default path or `CHROME_PATH`. In this environment sandboxed Chrome crashed in GPU startup; the same focused check passed outside that sandbox. Painting data were unaffected. Packaged documentation rewrites evidence links to adjacent members, so the extracted gallery/docs remain local; package checks verify those links and archive CRC independently. Timing-only warmup/repeat rows have no exported checkpoint images; their capture flags are not painting-stop verdicts.
