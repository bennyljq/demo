**# Stroke Master 3**



Open **\*\*index.html\*\*** directly in Chrome for the studio, or **\*\*brush-lab.html\*\*** for individual paint studies. Both generated files are self-contained. All maintained sources, supplied assets, tests, and generated artifacts stay inside \`stroke-master/\`. There are no runtime network requests, dependencies, texture images, embedded stamps, neural models, or backend.



Start with **\*\*640 planning / Fine / Feedback / 3000 operations / 12000 proposals / seed 42 / curated brushes / Restrained relief / 2048 export\*\***. Use 1024 planning and more work for the larger portrait photograph. The 632-pixel rooster and 450-pixel monochrome portrait are not enlarged for planning. Strong relief is useful for inspecting brushes but exaggerates grooves in a whole painting. The measured comparison below uses 1800 operations rather than the recommended 3000, to show both versions at an identical modest budget.



**## What changed**



The library expands from four to thirteen profiles, with eleven named gestures, explicit compound contacts, and automatic shortlists informed by local image structure. The studio loads stroke JSON without a reference, scrubs recorded painting operations, restores material correctly when moving backward, and distinguishes full-painting PNG export from current-frame export. The lab exposes every brush, compatible gestures, contact rotation where useful, substrates, diagnostic views, three seeds, and a downloadable labelled contact sheet.



The existing local scorer, palette, mask, pass scheduling, continuation, worker architecture, and canonical renderer remain. V2's four brush definitions remain exact. The old replay animation loop in the UI is replaced by the shared timeline; saved v2 documents are validated and kept as v2 rather than silently relabelled. No complete legacy engine is retained. \`artifacts/v3/README-v2.md\` records the prior implementation and measurements; it is historical documentation.



**## Sources and regeneration**



Run from this directory with Node 22 or later:



\`\`\`sh

node build.cjs

node test.cjs

node v3-test.cjs

node browser-test.cjs

node v3-browser-test.cjs

node benchmark.cjs v3

node compare.cjs

\`\`\`



\`engine.js\` is the only brush, analysis, scoring, planning, document-validation, and timeline engine. \`worker.js\` owns optimiser and studio replay work; \`app.js\` and \`lab.js\` own UI controls. Edit the templates and \`styles.css\`, then regenerate **\*\*the existing\*\*** \`index.html\` and \`brush-lab.html\` with \`build.cjs\`. Tests check that both pages embed the canonical source exactly. \`render-strokes.cjs\` uses that same engine for offline source-free rendering:



\`\`\`sh

node render-strokes.cjs artifacts/v3/v2-golden.json 480

node render-strokes.cjs artifacts/v3/timeline-document.json 960

\`\`\`



Output is always \`artifacts/replayed.png\`. Both commands were exercised. The helper validates v2/v3 format and resource bounds and rejects JSON larger than 48 MB. \`fixtures.cjs\` supplies controlled references and a standard-library PNG writer. \`cdp.cjs\` shares a small Chrome harness between asset decoding and v3 browser verification; no automation package is installed. Browser profiles are created and removed inside this folder. Set \`CHROME_PATH\` for another Chrome executable.



**## Profiles, gestures, and materials**



These are three separate concepts in the records and engine:



\* **\*\*Profile:\*\*** contact shape and bundle/tip geometry.

\* **\*\*Gesture:\*\*** path, pressure envelope, contact sequence, and release.

\* **\*\*Material:\*\*** load, depletion, dry amount, pigment variation, thickness, and final relief lighting.



\| Profile | Model and intended distinction |

\|---|---|

\| Flat | Original v2 squared, loaded ribbon and parallel bristle groups. |

\| Filbert | Original v2 rounded caps, shoulders, and sustained belly. |

\| Hog | Original v2 uneven stiff bundles, irregular spread, and broken dry coverage. Hog is a hair/material description; this retained profile models a flat bristle contact. |

\| Round | Original v2 compact pressure belly and tapered ends. Its saved records remain exact. |

\| Bright | Firm chisel contact, sharper shoulders, concentrated loading ridge, and less compliant spread. Short chisel is a separate gesture, rather than the only distinction from Flat. |

\| Angle | Asymmetric leading corner and slanted contact edges. Rotation changes which side cuts into the mark. |

\| Fan | Separated seeded bundle tracks diverge as the contact splays along its travel. Fine bundles are filtered over the render footprint. |

\| Mop | Feathered soft deposition, restrained pigment variation, little groove or relief; useful for quiet transitions. No wet mixing is claimed. |

\| Liner | Narrow stable connected contact with controlled release. |

\| Rigger | Narrow long-hair contact, sustained reservoir, and restrained direction-dependent lag. Shares a fine-line family with Liner and Script. |

\| Detail | Small dabs and accents with low thickness and controlled release. Round remains independently available. |

\| Script | Expressive pressure belly and thick-to-thin release; visibly different defaults from Liner/Rigger. |

\| Stippler | Persistent seeded clusters of tip contacts. Rotation, pressure, and load affect each cluster; repeated contacts retain the same seeded identity. |



The lab provides Straight pull, Curved pull, S pull, Press-and-lift leaf, Short chisel, Dot/dab, Tapered flick, Fan sweep, Stipple sequence, Dry scumble, and Circular loop where compatible. A leaf stores a three-value pressure envelope. A loop stores four connected cubic contacts; a stipple sequence stores six separate contacts with derived seeds and progressive loading. Dot/dab and chisel use compact recorded paths. Dry scumble is a dry/load treatment, not another brush geometry. Most gestures remain one cubic, while compound gestures explicitly record their submarks.



An operation may contain up to **\*\*16 contacts\*\***. Imports cap total contacts at **\*\*96000\*\***, in addition to the 24000-operation cap. Each contact has at most 96 adaptive curve segments. Automatic stipple proposals currently contain six contacts and are counted as six in candidate-work metrics. There are no hidden thousands of submarks behind one cheap operation. Timeline position counts top-level painting operations, so a compound operation appears as its complete recorded sequence.



Coordinates, width, and height are in canonical planning pixels. The seeded bundles, pressure envelopes, and cluster positions remain in that coordinate space at every resolution. Pixel-footprint filtering suppresses tiny grooves, fan tracks, and stipple tips at small scales; larger exports reveal the same fields. There is no pixel noise added after painting. Compound rasterisation, patch bounds, material rendering, structural scoring, and offline replay use the same contacts.



Material overlap retains the v2 rule: coverage unions deposited alpha, RGB alpha-composites pigment, and deposited height partly compresses prior ridges before adding thickness. Lighting is computed from the combined height field after deposition. Relief Off is exactly the unshaded pigment view. This is an oil-like layered paint approximation; it does not model solvent, wet mixing, paint chemistry, flow, folded impasto, or cast shadows.



**## Brush research and approximation**



The supplied \`assets/brush-strokes.png\` informed vocabulary and gestures; both rooster images were inspected before changes. The following manufacturer pages were opened during implementation:



\* [Rosemary & Co Masters Choice]\(https\://www\.rosemaryandco.com/oil-brushes/masters-choice-oils) describes angular cut-in, the stronger snap of short flats, rounds/filberts, and a ferrule that spreads fan hairs. These descriptions informed distinct contact and edge behaviours.

\* [Rosemary & Co Red Dot Riggers]\(https\://www\.rosemaryandco.com/oil-brushes/red-dot-collection/red-dot-riggers) describes fine needle-point lines and continual pigment delivery. It informed the sustained reservoir approximation and the related Liner/Rigger/Script family.

\* [Winsor & Newton Winton Hog Fan]\(https\://www\.winsornewton.com/products/winton-hog-brush-winton-hog-fan) distinguishes hog bristle material from head shapes, including Bright, Flat, Round, Filbert, and Fan. It informed the explicit distinction between the retained Hog profile and geometry families.



These are qualitative engineering interpretations, not calibrated measurements of those products. Watercolour-like examples in the chart are adapted to opaque oil-like deposition. Mop softness does not imply water diffusion, and the renderer never samples the chart or supplied paintings as textures.



**## Automatic painting**



The existing deterministic reference-guided optimiser remains. Transparency composites on warm ivory \`[242,239,228]\`; the reference is used for analysis and candidate colours, not as an underlay. Palette anchors preserve common tones and small saturated accents. Colour/border propagation estimates a soft priority mask; optional foreground/background marks guide order and constraints. Marks affect the next Paint; continuation retains its original analysis and marks.



Local features are measurable: sampled region width, orientation coherence, edge importance/sharpness, difference from a smoothed reference as texture density, residual error, and pass/scale. They produce at most three plausible brush candidates. Broad shapes favour Flat/Filbert/Bright; quiet transitions allow Mop; coherent narrow structure allows Round/Liner/Rigger/Script; late small sharp accents allow Detail; directionally textured regions allow Fan/Hog/flicks; irregular texture allows Stippler. There is no feather, hair, or face classifier. An advanced enabled-brush selector restricts choices; curated defaults omit Angle/Rigger/Script, which remain available when enabled. Each image need not use every brush.



Quiet regions now follow a smooth position-dependent orientation field, and tracing retains it where the measured tensor is ambiguous. Pigment variation and thickness are reduced there, while actual procedural deposition remains. This removes the conspicuous uniform diagonal fallback from quiet white backgrounds without copying reference pixels or suppressing material across the painting.



Feedback scores local patches with the exact material alpha and coverage, while omitting pigment variation and lighting from the structural colour objective. Clipped blur radii remain tied to planning resolution. Local/full score deltas are checked, including compound contacts and boundaries. Baseline uses the same brushes and analysis with stratified sampling and no acceptance comparison. Block-in, shape, fine, revisit, and accent passes retain budget carry-over, plateau stops, and error-directed revisits. Completion is work-based, never time-based.



\`metrics.brushWork\` records candidates, accepted operations, and candidate contacts per brush. \`gestureWork\` records accepted gesture operations; \`gestureCandidates\` records candidate operations/contacts per gesture. \`acceptedContacts\` and \`candidateContacts\` make compound cost explicit. Studio counters distinguish accepted operations, candidates, proposals, and rejected proposals.



Pause/Resume retains optimiser state and RNG position. Completed workers stay alive for Continue refinement. Backward timeline inspection uses a separate material surface and cannot undo the optimiser. Continue restores its retained full state, adds stroke/proposal budgets, and records history. Imported JSON cannot continue optimisation because it contains neither reference analysis nor RNG/checkpoint state. Changing seed, detail, brush selection, or marks and pressing Paint starts a new session.



**## JSON import and timeline**



**\*\*Load stroke JSON\*\*** is separate from Choose image. It validates format and definition version, canonical dimensions, operation/contact limits, brush IDs, cubic geometry, finite numbers, colour/material bounds, seeds, pressure envelopes, and estimated memory before allocating replay surfaces. File size is limited to 48 MB. Nested contact lists and unsupported definitions are rejected. Errors and filenames use text nodes, and a rejected file preserves the previous valid painting.



Supported documents are **\*\*v2 / \`oil-ribbon-2.0\`\*\*** and **\*\*v3 / \`oil-library-3.0\`\*\***. V2 uses only its original four brush IDs and original deposition behaviour. The minimal adapter validates and projects the old document into the shared replay envelope; it does not change its version or brush meaning. Pre-change hashes of RGB, coverage, and height match exactly at **\*\*240 and 480 long edges\*\***, and actual Chrome import/replay was verified. New pressure/contact features are rejected in v2 files.



Loaded metadata shows dimensions, operation count, document version, and brush definition version. The same timeline handles imported documents, completed fresh paintings, and paused snapshots. At zero, the canvas is the recorded blank background; at k, it is exactly the first k recorded operations. Start/End and −1/+1 controls, Play/Pause, three speeds, and keyboard Home/End/Left/Right/Space are supported. Dragging pauses playback. The position label shows the displayed count separately from the pending target, and keeps the last valid frame while seeking.



Seeking runs in a worker. Input requests coalesce over 16 ms, worker batches yield every 24 operations, and request/generation IDs discard stale frames. Backward seeking restores unshaded Float32 RGB, coverage, and height, then replays forward from the best retained checkpoint. Lighting is recomputed afterward. No shaded bitmap is used as material state. Checkpoints use at most **\*\*32 MiB and eight entries\*\***, evict oldest entries, and appear in the memory estimate. A zero checkpoint budget still supports correct replay from blank. No checkpoint is stored for every frame.



Studio timeline preview uses at most 640 planning pixels on the long edge for responsive inspection. **\*\*Save full painting PNG\*\*** rerasterises all operations at the selected export resolution. **\*\*Save current frame PNG\*\*** rerasterises the displayed count, with a filename such as \`stroke-master-frame-11.png\`. The latter is disabled while a target is pending. Export never scales the preview bitmap. Save strokes always saves the whole replay document. JSON import does not restore a continuation session.



**## Resolution and resource bounds**



Planning choices remain 640/1024/1536; export is Match planning/2048/4096. Inputs are limited to 32 MB and 40 million decoded pixels. The allocation estimate includes reference analysis, material/structural surfaces, local patches, stroke-object allowances, export/encoding reserves, and timeline storage. The 768 MiB soft limit refuses a 1536-square plan plus 4096-square export; 640 planning supports 4096 export. The UI also checks combined timeline/export memory.



Budget limits remain 24000 operations and 120000 proposals. A candidate patch is capped at 1.5 million pixels. Work rises with operation area, contacts, adaptive geometry, resolution, and proposals. A single CPU optimiser worker keeps controls responsive; no GPU acceleration is assumed. Estimates are allocation estimates, not a hard browser RSS ceiling: decode, colour management, driver/compositor storage, garbage collection, and process overhead differ by environment. Exact cross-browser pixel equality is not promised.



**## Matched local-asset evaluation**



All five supplied assets were opened before settings were chosen. \`ayam-1.png\` is the rooster reference; \`ayam-stroke-master-v2.png\` is the supplied artistic baseline with unknown generation settings, preserved untouched. \`mat.jpg\` is a monochrome portrait. The larger photograph includes a portrait, curls, fabric, and foliage. No substitutes were downloaded.



Before editing the engine, v2 outputs, decoded reference pixels, stroke JSON, counts, settings, timings, and golden replay hashes were captured. Both generations use the exact saved pixels, **\*\*640 planning / Fine / Feedback / seed 42 / 1800 operation cap / 7200 proposal cap / relief 0.45 / no marks\*\***. Dimensions are 632×461, 450×450, and 640×400. Both accept 1800 operations; compound contacts make actual work differ. Timings include analysis, planning, and final material audit in Node, before PNG writing. They are single measurements on this machine.



\| Asset | V2 proposals / candidates | V3 proposals / candidates | V2 / V3 accepted contacts | V2 / V3 candidate contacts | V2 / V3 seconds | V2 / V3 blurred material error |

\|---|---:|---:|---:|---:|---:|---:|

\| Rooster | 2285 / 6135 | 2270 / 6090 | 1800 / 1825 | 6135 / 6300 | 4.953 / 5.176 | 0.004087 / 0.003510 |

\| Monochrome portrait | 2034 / 5382 | 1920 / 5040 | 1800 / 1805 | 5382 / 5175 | 3.330 / 3.469 | 0.002686 / 0.002657 |

\| Colour portrait | 1961 / 5163 | 1950 / 5130 | 1800 / 1805 | 5163 / 5255 | 4.499 / 4.941 | 0.005048 / 0.004968 |



The common error is final displayed RGB MSE after the same blur, normalised by \`255²\`. V3 is slightly lower on these three examples, but this is not an equal-contact/equal-time comparison or a general aesthetic win. Reports include both blur scales, coverage, tonal drift, structural error, accepted brush/gesture counts, and actual work. No test requires a version to win. The original synthetic comparisons also retain their v2 images and measurements; new outputs are labelled v3 rather than overwriting them.



Visual inspection of every new profile at 1500 pixels, characteristic gestures, whole matched paintings, and the labelled contact sheet found:



\* **\*\*Rooster:\*\*** overall tail/body/head/leg arrangement survives; white background marks are quieter and less uniformly diagonal. The small eye is still simplified, orange neck feather structure is incomplete, and narrow toes remain rough. The supplied higher-quality v2 rooster remains a useful artistic baseline; it is not falsely presented as a matched-settings benchmark.

\* **\*\*Monochrome portrait:\*\*** head silhouette and main eye/nose/mouth masses remain recognisable. Quiet skin/background directions are less repetitive. Small facial transitions, lip shape, eyelids, and likeness remain blocky at this work budget; low error alone does not establish better likeness.

\* **\*\*Colour portrait:\*\*** red mouth and clothing, face placement, hair mass, jacket, and foliage separation remain. Some finer hair/eye structure is lost, skin has visible facets, and foliage lacks natural texture. Broader green marks are deliberate approximation, not semantic plant rendering.



Useful files are \`artifacts/v3/{rooster,monochrome,portrait}-comparison.png\` (**\*\*reference / captured v2 / v3\*\*** columns), their individual PNG/JSON files, \`matched-comparison.json\`, and \`v2-benchmark.json\`/\`v3-benchmark.json\`. Saved decoded input JSON makes reruns reproducible without browser resize differences. \`benchmark.cjs v3\` repeats current measurements. **\*\*Do not run \`benchmark.cjs v2\` after replacement\*\***: that capture command belongs to the pre-change step and would overwrite the historical benchmark with the current engine. No old renderer is required to inspect these comparisons.



**## Verification actually run**



**\*\*14 retained numerical groups\*\*** pass: canonical build identity, resource limits, scheduling/determinism, exact replay, local/full scoring, monotonic accepted gains, continuation, plateau/carry-over, thirteen brush distinctions, material coherence, tile order, relief/overlap, all controlled fixtures, and extended planning/export. **\*\*Nine v3 groups\*\*** pass: exact v2 compatibility, all compatible profile/gesture combinations, seed/contact distinction, new-field tile invariance at two scales, compound scoring/coverage, random material-state seeks, checkpoint eviction/zero budget, malicious inputs, and actual automatic usage/contact accounting.



**\*\*16 retained Chrome groups\*\*** pass: local upload, cancellation/restart, pause/resume, exact slow/fast replay, continuation, stale messages, masks, inspection, actual PNG/JSON downloads, baseline, transparency, replacement upload, 1536 planning/memory refusal, and actual 2048/4096 exports plus existing lab controls. **\*\*13 v3 Chrome groups\*\*** pass: source-free v2/v3 import, random seeks, malformed-file preservation, rapid scrubbing, real keyboard events, speed/pause, actual pointer drag, partial/full PNG pixel equality, fresh timeline/continuation, all thirteen profiles/three seeds, compound gestures/substrates/diagnostics/contact-sheet download, and no uncaught exceptions. Browser checks use Chrome 154 on this machine.



Reports: \`artifacts/v3/engine-regression.json\`, \`verification.json\`, \`browser-verification.json\`, and \`artifacts/browser/results.json\`. The final numerical stress case used 1024×682 planning with 240 operations/241 proposals in approximately **\*\*3.62 s\*\***, then 2048×1364 rendering plus PNG writing in **\*\*3.29 s\*\***. Process RSS snapshots were about 289/423/495 MiB before/after planning/after export, not continuous peak measurements. The Chrome 1536-square/60-operation case took about **\*\*6.11 s\*\*** and leaves about 60% undercovered; it tests resources rather than quality. The actual 4096 export completed in about **\*\*7.05 s\*\***.



\`artifacts/v3/stroke-master-all-brushes.png\` is the labelled three-seed contact sheet, with characteristic gestures above shared straight pulls per row. \`artifacts/brushes/all-brushes-seeds.png\` provides larger uniform curved studies; individual 1500×620 PNGs are alongside it. \`artifacts/v3/lab-\*.png\`, \`gesture-\*.png\`, \`substrate-\*.png\`, \`diagnostic-\*.png\`, and \`timeline-studio.png\` record inspected browser views.



**## Remaining limitations**



Fine-line families are deliberately related, and seed differences can be subtle at small widths. Fan tracks remain tidier than real splayed bristles. Compound loops can show joins and material-loading transitions; repeated stipple contacts are controlled clusters rather than arbitrary photographic texture. Strong relief still looks polished/striped compared with thick folded oil paint. Quiet orientation varies smoothly rather than inferring artistic form. Portrait likeness and small facial/rooster accents still depend on planning resolution and sufficient work.



The timeline is source-free replay, not optimiser persistence. Preview is capped at 640; inspect a rerasterised export for larger material detail. Cross-browser verification, wet blending, semantic art direction, and physically simulated bristle dynamics remain outside this version. Higher export resolution reveals recorded material; it cannot recover missing reference detail or repair an under-budget painting.
