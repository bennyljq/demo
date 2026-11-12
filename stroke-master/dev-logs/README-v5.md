**# Stroke Master 5**



Open **\*\*index.html\*\*** for the studio or **\*\*brush-lab.html\*\*** for brush studies. Both pages run directly from disk without a server, dependencies or network requests. All work and generated artifacts stay inside \`stroke-master/\`; user assets remain untouched.



V4 adds artistic relief, directional light and cast shadows, shared studio/lab controls, export dimensions/methods, organised tabs and live fullscreen. Feedback is the only planner. The renderer selector, alternative planning branches and dedicated comparisons are removed. The thirteen v3 brushes, gestures, pigment/coverage objective, masks, deterministic budgets and continuation remain.



**## V5: foundation and unrestricted correction**



V5 corrects the v4 background lock. New paintings start with a temporary whole-canvas foundation, then large masses and global refinement. The maintained studio and brush-lab pages are regenerated from their sources. Brushes, deposition, lighting, relief, fullscreen, exports and replay remain shared and unchanged.



Foundation selection distinguishes three values recorded in \`metrics.foundation\`: the unconstrained whole-image RGB mean (\`wholeImageMean\`), a reliable estimated background tone (\`backgroundEstimate\`), and the selected nominal pigment (\`colour\`). Under squared RGB error the whole-image mean is the best constant approximation; it need not describe the background. Supported border-colour families, global affinity and the conservative forest subject envelope retain the useful v4 detection improvements. Interior background samples exclude uncertain boundaries, reserved subject areas and high-importance edges. The most populated deterministic 16-level RGB palette bin supplies its mean as a robust base tone. This chooses a useful dark forest base without limiting later green/brown/foliage colours. If fewer than 4% of pixels or 16 reliable samples exist, selection falls back to the rounded whole-image RGB mean. Method, sample count and a support-based confidence estimate are recorded; confidence is a heuristic, not a semantic probability.



The foundation is two overlapping sets of broad existing procedural contacts along the canvas's longer axis, including the future subject. It uses one nominal pigment, sufficient loading, low controlled pigment variation and body-dependent height. Width accounts for band area and the patch-work limit; thickness scales with width so large contacts do not introduce giant ridges. Every contact is recorded. Timeline zero remains blank ivory; there is no source underlay or unrecorded fill. Available broad enabled brushes are preferred. Restricting the enabled set to a narrow/specialised profile can leave a less uniform coat.



The allocation is bounded independently of achieved coverage: at most 10% of the smaller operation/proposal budget, normally 12 contacts (six bands twice). The supported minimum 60/60 budget uses six contacts, leaving 54 for painting. Large square images use enough bands to respect the 1.5-million-pixel candidate-patch limit; elongated images orient contacts along the long axis. Overlap aims for useful coverage, with no completion threshold. Continue preserves the prefix and random cursor, uses global residual work and never adds another foundation coat, even if the earlier coat was imperfect. Ordinary budgets, cancellation and plateau stops remain valid. Memory estimates now reserve larger foundation scratch patches, so some large planning/export combinations previously underestimated are refused under the same 768 MiB limit.



Masks and user marks are positive soft priorities for broad regional passes and diagnostics. Error tiles and sampled pixels on both sides stay eligible. Later revisit tasks are global. Fine colour proposals use the actual source at the requested point, with no permanent region-based colour exclusions. Ordinary paths retain full-path source-colour checks; deliberate short tangent repairs bypass shortening and can cross an estimated boundary. Their acceptance uses the actual affected patch plus both blur neighbourhoods. Background paint can cut back an overshoot; subject paint can extend an undersized silhouette. Accepted operations update all affected error tiles, so later damage can be revisited. Nothing is blurred or erased after painting.



Diagnostics record foundation RGB/method/confidence, allocated/accepted counts, remaining initial work allocation, scheduling-region proposal and accepted-contact counts, and the actual stop reason. Background/foreground/boundary activity describes the contact's bounding box against the estimate, not ownership. Variants may move a contact into a different diagnostic region, so per-region accepted counts need not be below the corresponding base-proposal count. These region labels never clip deposits.



**### Diagnosis and removed paths**



The regression combined the mandatory per-pixel 98% gate in \`step\`, background-before-all-subject task sorting, foreground-only targeted/continuation tasks, the hard eligible-pixel filter in \`location\`, background-only colour samples in \`propose\`, and mask crossings in \`trace\`/\`constrainStroke\`. Those paths and their completion status wording are removed. Source-colour geometry checks remain for ordinary proposals, with a deliberate repair exception. The old background-first tests asserting foreground exclusion, threshold completion and subject starvation are removed and replaced by \`v5-test.cjs\`. No broken planner remains behind \`backgroundFirst\`; that historical setting is ignored during new planning and replay. Saved strokes are authoritative. V5 retains the compatible v4 document/material schema and records \`plannerVersion: 5\` for new generation.



**### Matched local comparisons**



Before editing, the rooster was generated and saved with its settings in \`artifacts/v5/rooster-before.json\` and \`before-settings.json\`. Comparisons use Fine, seed 42, 1800 operations, 7200 proposal limit and body 0.65 on the existing local planning inputs from \`ayam-1.png\`, \`mat.jpg\` and the forest portrait. All stop at the operation limit. V4 before records remain authoritative; no old engine is retained.



\| Reference | V4 background operations | V5 foundation / later operations | V5 proposals | Structural error before / after |

\| --- | ---: | ---: | ---: | ---: |

\| Rooster | 527 | 12 / 1788 | 1819 | 0.012657 / 0.005939 |

\| Mat | 933 | 12 / 1788 | 1829 | 0.006698 / 0.002463 |

\| Forest portrait | 830 | 12 / 1788 | 1824 | 0.011290 / 0.005134 |



The [v5 comparison gallery]\(artifacts/v5/comparison.html) includes before/after Neutral, the identical Thick impasto preset, pigment-only views, foundation checkpoints, and canonical rooster crops for tail, breast/neck and leg/foot gaps. The foundation covers future subject and background alike (mean deposited coverage about 99.4% in these examples, measured descriptively, never used as a gate). Visual inspection shows reduced tail/breast protrusions and cleaner white space around and between the legs. White paint still carries deliberate relief under strong light. Broad faceted feather masses, some neck edge stepping and coarse toes remain at this budget; a lower aggregate error does not imply accurate fine anatomy. Forest foliage develops multiple colours over its dark base. There is no post-render cleanup.



\`artifacts/v5/studies.json\` records exact work, region activity, colour decisions, timing and stop reasons. Timings include snapshot appearance auditing and are not pure optimiser benchmarks. V4 galleries and captures are historical artifacts.



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



**\*\*Quiet-area paint body applies to the next painting.\*\*** Body 0 retains v3's requested thickness of 0.06; body 1 reaches 0.9. Brush-specific characteristics still apply. Quiet pigment variation stays restrained. Body does not alter colour, coverage, acceptance or orientation; weak orientation retains the smooth field and traced direction. No universal diagonal fallback was restored. The UI starts at 0.65; an omitted engine setting defaults to 0 for v3 comparisons.



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

node v5-test.cjs

node v5-studies.cjs

node browser-test.cjs

node browser-test.cjs --firefox

node benchmark.cjs

\`\`\`



Verification actually run for v5: \`node build.cjs\`, \`node v5-test.cjs\` (10 groups), \`node test.cjs\` (14 canonical groups), \`node v4-test.cjs\` (10 material/state/legacy groups), \`node v5-studies.cjs\`, and \`node browser-test.cjs\` in Chrome and Firefox (20 groups each). The focused tests deposit recorded damage, then require accepted source-coloured correction and substantial local improvement for background recovery, subject recovery and an intentionally wrong mask. They also check whole-canvas foundation coverage, minimum budgets, deliberately imperfect coverage without gating, continuation/prefix preservation, seeded pause/presentation invariance, exact material replay, historical metadata neutrality, and local/full boundary scoring agreement. Larger square/aspect-ratio foundation patches are checked against the work limit.
