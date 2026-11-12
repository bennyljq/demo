**# Stroke Master 4**



Open **\*\*index.html\*\*** for the studio or **\*\*brush-lab.html\*\*** for brush studies. Both pages run directly from disk without a server, dependencies or network requests. All work and generated artifacts stay inside \`stroke-master/\`; user assets remain untouched.



V4 adds artistic relief, directional light and cast shadows, shared studio/lab controls, export dimensions/methods, organised tabs and live fullscreen. Feedback is the only planner. The renderer selector, alternative planning branches and dedicated comparisons are removed. The thirteen v3 brushes, gestures, pigment/coverage objective, masks, deterministic budgets and continuation remain.



**## Background-first addendum**



New paintings automatically finish an obvious background before starting the subject. Detection uses supported border colours: a dominant flat colour for white/black backgrounds, or a related colour family for textured backgrounds such as the dark green forest. Global colour affinity avoids walking from black into a lit face. Textured scenes reserve a conservative subject envelope to protect similarly coloured hair/clothing. Priority marks override the estimate; ambiguous scenes retain ordinary scheduling.



Every background pass runs first. A final coverage pass uses the existing procedural brushes until **\*\*every estimated background pixel has at least 98% deposited coverage\*\***. This covers the entire region rather than an average or an allocated share of strokes. Background samples exclude foreground colour, while foreground curve constraints retain soft boundaries. Background ribbons may overlap the reserved silhouette as underpainting. Foreground colour/detail starts after the recorded layer boundary; later targeted work stays on the foreground.



Budgets remain hard limits. If they run out before completion, painting stops on the background and offers continuation instead of skipping to the subject. Continuation preserves the prefix and finishes the background first. JSON records the resolved \`backgroundFirst\` setting and completion operation/count/coverage metrics. Old documents replay unchanged. This is an estimate, not semantic segmentation; similar-coloured boundaries may need priority marks. Finishing the foundation can leave less work for subject detail at a fixed small budget.



See the [background-first gallery]\(artifacts/v4-background/comparison.html): reference, completed-background checkpoint and final painting. \`node background-test.cjs\` runs ten ordering, full-region coverage, local-reference, continuation, marks and deterministic-state groups. Layer masks and softening buffers are included in memory estimates. Brush definitions and the pigment/coverage objective remain unchanged.



**## Controls and state**



The reference/painting area occupies roughly 70% of the studio. The lower 30% has a persistent action/status bar and five tabs. Its content scrolls vertically while previews remain visible. Tabs support Left/Right and Home/End; controls have labels and visible keyboard focus.



\| Tab | Controls |

\| --- | --- |

\| Paint | Import reference image, detail, planning size, seed, budgets, quiet-area body, priority marks |

\| Surface & light | Presentation settings that apply immediately, presets and reset |

\| Replay | Import painting JSON, timeline, transport and playback speed |

\| Export | Shared dimensions/method for full/current PNG, stroke JSON download |

\| Advanced | Continuation budgets, enabled brushes and descriptive metrics |



Pause/Resume appears during a generated session. Continue refinement appears when it finishes. Imported JSON provides replay rather than an optimiser session. Cancel also cancels export. Continuation keeps the reference, marks, original generation settings and random cursor, while extending the budgets. Presentation remains adjustable; changing next-painting settings does not alter continuation.



**\*\*Surface relief / height exaggeration applies now\*\***, including paused, imported and replayed paintings. Range: 0–6. It amplifies stored composited height without changing deposits or records. Relief 0 bypasses directional light, tint and shadows and shows pigment exactly. Amplification cannot recover missing paint from an old document.



**\*\*Quiet-area paint body applies to the next painting.\*\*** Body 0 retains v3's requested thickness of 0.06; body 1 reaches 0.9. Brush-specific characteristics still apply. Quiet pigment variation stays restrained. Colour, coverage, acceptance and orientation are unchanged; weak orientation retains the smooth field and traced direction. No universal diagonal fallback was restored. The UI starts at 0.65; an omitted engine setting defaults to 0 for v3 comparisons.



For pronounced white-background relief, start with **\*\*640 planning / Fine / seed 42 / 3000 strokes / 12000 proposals / body 0.65 / Thick impasto study\*\***. The preset sets relief 3.5, azimuth 225°, elevation 28°, intensity 0.65, ambient 1.2, neutral tint/temperature, shadows 0.25 and reach 14 planning pixels. Raise body toward 1 for heavier new deposits. Old imports can only amplify existing height. For softer portrait skin, start with Neutral or raise elevation/ambient.



Foreground/background priority marks, Erase, Reset, all thirteen enabled brushes and additional continuation budgets remain. Fit/100% inspection is available in both pages. Studio 100% shows the bounded preview pixels; inspect an exported PNG for full output resolution. Transparent references composite onto warm ivory. Image loading accepts at most 32 MB and 40 million source pixels.



**## Lighting and material**



Shading uses the composed pigment, coverage and height, after all overlapping deposits. Light is infinitely distant. Canvas azimuth is 0° right, 90° bottom, 180° left, 270° top; 225° illuminates from the upper left. Elevation 90° is overhead; low values give grazing light.



Normals use height differences one canonical planning pixel apart. Diffuse response is the normal/light dot product plus neutral ambient fill, normalised by a flat surface's response. Thus white light preserves flat pigment rather than darkening everything when elevation changes. Tint can change flat colour without inventing relief. The illumination multiplier is bounded to 0.58–1.48. There is no contrast filter, independent shading of each brush, specular/glitter effect or second renderer for presets.



Tint multiplies directional RGB by \`colour / 255\`. Warmth then multiplies red/green/blue by \`1 + warmth × (0.16, 0.035, −0.16)\`; ambient stays neutral. Neutral, Raking light and Thick impasto study set the same underlying controls.



Cast shadows are separate from normal-based darkening. A bounded ray march samples neighbouring height toward the source and compares it with the light-ray slope. Reach is 1–24 canonical planning pixels; distance-dependent self-shadow bias limits artifacts and strength is capped at 0.6. Overhead light has no lateral shadow. Height and distances retain canonical units across output sizes. Row batches read the entire composed field, avoiding tile seams and missing halos.



Studio previews are bounded to a 640-pixel long edge and use 6 shadow samples. Optimisation previews are throttled; newer lighting requests supersede older row batches. Exports and saved lab PNGs use 12 samples. Lab lighting relights four cached material studies, including overlapping strokes on the selected substrate; geometry changes rebuild them. Pigment, footprint and height views, three seeds and the all-brush contact sheet remain.



Material audits describe shaded fine/coarse error, undercoverage and signed appearance/pigment drift. They never veto intentional stronger relief or participate in candidate acceptance. Studio metrics describe the last painting snapshot and explicitly say when later lighting makes that audit historical. Imports without their reference cannot get a fresh reference-fidelity audit.



**## Export and limits**



Full and current-frame PNG actions share one panel. Width/height stay aspect locked, with Match planning, 2× planning, 2048/4096 long-edge and custom presets. Current-frame export uses the settled timeline count; full export uses every operation.



**\*\*Render from strokes\*\*** is recommended. It rerasterises the recorded marks at the requested dimensions and shades their composed material at final quality. It never enlarges the scrub preview.



**\*\*Smooth bitmap enlargement\*\*** is deliberately softer. It first renders the requested full/partial frame from strokes at the document's canonical planning dimensions under current final-quality lighting. Then it uses browser smooth canvas resampling. Only one bitmap method is exposed; \`imageSmoothingQuality\` is not claimed to guarantee a named algorithm. Browser results can differ. Neither method restores reference detail absent from the stroke list.



Limits remain **\*\*1536 planning edge, 4096 export edge, 24000 operations, 120000 proposals and 768 MiB estimated working memory\*\***. Estimates include planning arrays, preview material, export pixels/encoding reserve, bitmap buffers and retained timeline material/checkpoints. Checkpoints have a separate maximum of 32 MiB/eight entries. A large planning/output combination can be refused even when each dimension is valid. Estimates are conservative, not promises of exact process RSS. Exports use disposable workers and remain cancellable. Editing lighting during export cancels it; stale worker results or PNG callbacks cannot download old output.



**## Fullscreen and compatibility**



The viewport button calls \`requestFullscreen()\` from a user gesture, with an in-page expanded fallback if unavailable/rejected. Both show fitted live paint, status, applicable Pause/Resume and Exit. Native \`fullscreenchange\`, resize, Escape and fallback exit restore the studio. The worker and bounded preview continue: entering/exiting does not implicitly pause, reseed or allocate a viewport-sized material surface. Completed paintings and replay also work.



V4 JSON stores directional presentation while retaining brush version \`oil-library-3.0\`. V2/v3 imports retain their stored relief/vector interpretation through a compact shading branch; no complete legacy engine is retained. Editing imported lighting upgrades the presentation to v4 while preserving every brush record and its definition version, including \`oil-ribbon-2.0\`. Historical renderer metadata is accepted as information; replay needs no removed planner. Lighting invalidates shaded frames while retaining unshaded timeline checkpoints.



JSON is validated before replacing the current painting: versions, brush IDs, finite values, geometry, contacts, materials and work/memory bounds. Files over 48 MB are rejected; errors render as text. The offline helper uses the same validation, replay and final shading:



\`\`\`sh

node render-strokes.cjs artifacts/v4/rooster-body-0.65.json 2048

\`\`\`



Output is always \`artifacts/replayed.png\` inside this project. A partial stroke list renders a partial frame offline.



**## Maintained sources and verification**



\`engine.js\` is canonical. \`worker.js\` handles optimisation, cached studio relighting, seeks and export; \`app.js\` and \`lab.js\` handle their pages. \`light-controls.js\` supplies the shared presentation UI. Edit sources, templates and \`styles.css\`, then regenerate the existing standalone pages with \`build.cjs\`.



Run from this folder with Node 22 or later:



\`\`\`sh

node build.cjs

node test.cjs

node v3-test.cjs

node v4-test.cjs

node background-test.cjs

node browser-test.cjs

node browser-test.cjs --firefox

node benchmark.cjs

\`\`\`



The fourteen canonical engine groups, nine retained brush/compound/timeline groups, ten v4 material/light/state groups and ten background-first groups pass. Before-change captures are in \`artifacts/v4/before.json\`, \`v3-\*.json/png\` and \`README-v3.md\`. All three captured v3 paintings and all thirteen brush studies retain exact pigment, coverage, height and legacy pixels. The initial v4 body studies preserve exact v3 generation with historical ordering (\`backgroundFirst: false\` in their capture script); their variants retain identical pigment, coverage and structural error while changing height. New automatic background-first generation intentionally changes planning order and records.



Twenty real-browser groups pass in each of Chrome and Firefox. The workflows test imports, backward/forward and rapid seeks, current lighting, actual JSON/PNG downloads, both methods and full/current counts, dimensions, final shading, invalid imports/sizes, cancellation/stale output, priority marks, brush choices, pause/light/resume, fullscreen/fallback, continuation, compact layout, background completion before the subject, and lab controls/downloads. Paused optimiser responses cannot overwrite scrubbed frames. Fullscreen/pause/lighting runs produce exactly the same worker records as uninterrupted runs in the same browser. Tiny cross-runtime transcendental rounding differences are not treated as changed planning decisions.



Browser profiles/downloads remain inside \`artifacts/v4/\`. \`cdp.cjs\` uses Chrome CDP; \`firefox.cjs\` uses [Firefox WebDriver BiDi]\(https\://developer.mozilla.org/en-US/docs/Web/WebDriver/How_to/Create_BiDi_connection) without an automation dependency. Set \`CHROME_PATH\` or \`FIREFOX_PATH\` to override executables. Chrome 154 and Firefox 157 were exercised. Native fullscreen succeeded in Chrome. Headless Firefox denied native fullscreen despite an activated context; live expanded fallback, pause/resume and Escape passed. Native fullscreen in an interactive Firefox window remains unverified.



**## Comparisons and measured performance**



Open [the comparison gallery]\(artifacts/v4/comparison.html) for labelled whole paintings and 100% image links. Each lighting series uses the **\*\*same stored surface\*\***: original, neutral, relief 4, raking, warm, cool, shadows off, shadows on. Separate fresh rooster images compare body 0, 0.65 and 1 with identical impasto lighting. The supplied inline v3 rooster and existing v2 output were inspected. The controlled saved v3 comparison uses 1800 strokes; it is not claimed to reproduce the supplied image's unknown settings.



At Fit and canonical 100%, white-background marks become conspicuous, dark tail structure stays readable and orange neck pigment retains its identity. Neutral preserves portrait skin most closely; strong/grazing light exaggerates face/fabric overlaps. Warm/cool intentionally change colour. There are no row seams, halo cutoffs or added gloss. High body with low elevation can still look etched, and pale highlights can clip. Raise ambient/elevation or lower body/relief for a softer study.



\| Initial v4 Node measurements, before background-first ordering | Time |

\| --- | ---: |

\| Fresh 1800-stroke rooster, body 0 / 0.65 / 1 | 5.83 / 5.86 / 5.82 s |

\| Rooster 632×461, neutral shading | 24 ms |

\| Same rooster, final raking/shadow shading | 135–157 ms |

\| 2048×1494, 1800-stroke material replay | 9.31 s |

\| Same output, final shadow shading | 1.82 s |

\| Same export, estimated memory | 265 MiB |



Generation uses Fine / seed 42 / 7200 proposal budget. These are measurements, not guaranteed browser timings; browser relight timings appear in the verification JSONs. Same-surface rooster fine appearance error is 0.00351 original, 0.00365 neutral, 0.00499 relief 4 and 0.00422 raking. Structural error remains 0.00564246 across fresh body settings. Strong material need not win a reference-similarity metric.



Remaining limits: a height field has no overhangs, wet mixing, fluid simulation, global illumination or semantic anatomy. Shadows only reach the selected short radius; preview/final sampling may differ slightly. New body cannot reconstruct old missing deposits. Strong low light exaggerates geometric simplification; large exports can take tens of seconds. Browser bitmap resampling differs. Useful historical captures remain under \`artifacts/\`; executable removed-planner comparisons and the superseded browser suite are gone.
