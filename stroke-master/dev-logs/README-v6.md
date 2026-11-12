**# Stroke Master 6**



Open [index.html]\(index.html) for the studio or [brush-lab.html]\(brush-lab.html) for brush studies. Both generated standalone pages work directly from disk without a server, dependencies, or network requests. All maintained work is inside \`stroke-master/\`.



V6 adds deliberate scale preferences, bounded comparison of coherent broad repairs, three search depths, and circular targeted refinement with recorded feathering and one-level undo. The existing thirteen brushes, material/lighting model, bounded whole-canvas foundation, unrestricted correction, replay, exports, and fullscreen remain. Foundation colour selection is unchanged from v5.



**## Stroke scale and progression**



Brush profile and mark size are separate: Flat can make a small mark and Round can make a broad one. For a canonical long edge \`E\`, classification uses nominal contact width \`W\` and swept-area estimate \`W \* max(W, pathLength)\`, rather than bounding-box area. Compound marks use the narrowest contact width. A long hairline therefore remains small.



\| Class | Minimum width | Minimum swept-area estimate | At E = 640 |

\| --- | --- | --- | --- |

\| Large | 0.035 E | 0.002 E squared | 22.4 px / 819.2 px squared |

\| Medium | 0.012 E | 0.0002 E squared | 7.68 px / 81.92 px squared |

\| Small | Below either medium threshold | Below either medium threshold | Includes long narrow marks |



These are conservative geometric estimates, not exact painted-pixel counts. Requested widths start near 0.075/0.026/0.006 E and then respect source structure, physical minimums, the detail setting and candidate-patch limits. Coarse colour/path estimates accompany large proposals; medium estimates accompany medium proposals. Geometry can reduce the resulting class. Coherent repair candidates bypass ordinary source-colour path shortening, preserving their useful footprint.



The seeded primary scale lottery follows these endpoint preferences:



\| Stage | Large | Medium | Small |

\| --- | ---: | ---: | ---: |

\| Early | 80% | 15% | 5% |

\| Middle | 25% | 50% | 25% |

\| Late | 5% | 15% | 80% |



Smoothstep interpolation connects stages 0, 0.5 and 1. Stage is monotonic. Work progress uses the larger accepted-operation/proposal budget fraction after excluding foundation work. Residual progress uses existing error-tile sums, whose structural objective is 70% coarse blur, 20% fine blur, and 10% point colour, plus importance/coverage weighting. The stage combines \`max(0.85 \* work, 0.72 \* work + 0.28 \* residualProgress)\` with its prior value. Consecutive unsuccessful work also moves the stage toward 0.85 before the 256-proposal plateau stop, so unresolved errors cannot indefinitely postpone detail. Continue retains a minimum stage of 0.85 and never repeats the foundation.



Preferences govern primary proposals, not acceptance quotas. Balanced/Thorough also compare alternative scales and broad repairs, so evaluated distributions differ from lottery percentages. Actual geometry and the objective decide what is accepted. Diagnostics record requested, proposed and accepted classes separately, including early/middle/late buckets; foundation operations are excluded. Stable candidate order resolves effectively equal gains. Pause, preview, lighting and UI timing do not consume planner randomness.



**## Broad repair and search depth**



V5's discrete passes coupled width to stage, sampled isolated error points, tried three nearby variants, shortened colour-crossing geometry, and required gain per affected pixel. V6 replaces the regional scheduling and variant loop with one foundation task followed by one global search task. Later accepted strokes must improve the same unshaded structural objective; only the bounded foundation is unconditional.



Each search samples existing residual tiles, then analyses a connected coherent discrepancy on a grid of at most 48 by 48 cells. Neighbours must have similar correction direction and reference colour; strong narrow features are excluded from the region estimate. The analysis is bounded to 2,304 visited cells. A useful connected region yields a broad contact along its major axis, with region-averaged colour and conservative width/length. Other candidates use different scales, source estimates, footprints and opacity. All are scored against the same current canvas by absolute objective delta, including the full affected area and two blur radii of patch context. There is no per-painted-pixel reward or complexity penalty; minimum positive total gain is 0.000001.



A broad candidate that fails or loses to another candidate gets bounded local width/length/opacity refinement before abandonment. Failed decisions are cached by region and relevant error-tile revision signatures; deposits touching those tiles invalidate the decision. The cache has at most 4,096 entries. Broad repair stays eligible late, during Continue and during Auto/Fine local work. Acceptance remains optional and accounts for collateral changes.



\| Search depth | Initial candidates per proposal | Additional repair refinement | Maximum contacts per proposal |

\| --- | ---: | ---: | ---: |

\| Fast | 3 | 0 | 48 |

\| Balanced (default) | 7 | 2 | 144 |

\| Thorough | 12 | 4 | 256 |



Balanced compares large, medium and small alternatives; Fast can use its third slot for a coherent repair. Thorough spends more work comparing footprints and refining a losing repair, rather than simply increasing the operation budget. Settings are fixed within a pass; edits apply to the next Paint, Continue, or targeted pass. Generation settings, continuation history and target history record search depth. Candidate/contact counts and active candidate work time are recorded by depth; elapsed pass/runtime measurements are separate. Search depth does not increase reference detail or export resolution.



Safety limits remain 1536 planning edge, 4096 export edge, 24,000 operations, 120,000 total scheduled/consumed proposals, 96,000 accepted contacts, 30,720,000 candidate contacts, 96 curve segments, 1.5 million candidate patch pixels, and 768 MiB estimated working memory. A compound operation has at most 16 contacts. Global reservations plus local proposals share overall safety limits. Export raster scratch retains its existing bounded allowance. Estimates are conservative workload checks, not guarantees of process RSS.



**## Targeted refinement**



1\. Pause a generated painting, or use a completed live painting.

2\. In **\*\*Paint\*\***, open **\*\*Targeted refinement\*\***. Choose **\*\*Auto / Fine detail\*\***, **\*\*Fast / Balanced / Thorough\*\***, and additional local operation/proposal budgets.

3\. Click **\*\*Targeted refinement\*\***. The studio returns to the authoritative latest live painting, with a clear message if a replay frame was being inspected.

4\. Press on the painting at the circle centre and drag to set its radius. The centre, inner circle and feather band appear while dragging. Release starts refinement automatically; there is no second confirmation.



Accidental selections below \`max(3, 0.006 E)\` canonical pixels are rejected with a brief message and selection stays active. Escape or pointer cancellation exits without painting. Mapping uses the actual object-fit image rectangle, including letterboxing, Fit/100%, scrolling, CSS pixels, device pixel ratio and fullscreen. The latest-state reply has a request token; cancelled selections and replacement images cannot reactivate it. Overlays are separate SVG UI and never enter exports.



Selection is available only with a paused/completed matching live optimiser and no conflicting local pass/export. Imported JSON is replay-only: it contains no reference/analysis session, so reference-guided refinement is disabled with an explanation. V6 does not reattach references.



Auto uses a local 30/45/25 scale preference; Fine detail uses 8/22/70. Requested local widths are additionally bounded by 0.65/0.28/0.09 times the selected radius and the existing physical/detail minimums. Both modes consider broader corrections. A small circle cannot reveal reference detail absent from the retained planning image.



Local proposals are sampled only within target support. Coherent-region analysis is restricted to that support; colour/context sampling can read surrounding reference pixels. The global task cursor, proposals and remaining allocations remain frozen throughout selection/local work. Accepted local operations append to the real session, updating structural RGB, pigment, coverage, height, errors and tile revisions. Resume uses those updated buffers. Completion leaves global painting paused; select another region or explicitly Resume/Continue. The local report gives accepted operations, candidates/contacts, active work time, objective improvement, remaining budgets and stop reason.



**### Feathering, replay and undo**



The inner circle has full deposition influence. A smoothstep taper spans a feather width of 12% of radius, bounded between 1 canonical pixel and \`max(2, 0.02 E)\` pixels. Outside \`radius + feather\`, no pigment, coverage or height changes. The same alpha multiplier applies to structural scoring and all material deposition. Scoring includes the complete feathered footprint and necessary blur halos, not just the circle centre.



Each affected operation records a compact canonical object:



\`\`\`json

"target": { "cx": 120, "cy": 80, "radius": 28, "feather": 3.36 }

\`\`\`



For compound operations this target applies to every contact. Canonical coordinates are scaled during replay/export, including patch origins and unequal axis scales. Timeline, high-resolution PNG and offline rendering all use the canonical rasteriser. Feathering is recorded paint, not a final bitmap mask. Lighting remains separate: shadows from changed height can extend outside the selection. Lighting is deliberately not clipped at the circle edge, avoiding a shading seam.



**\*\*Undo last targeted pass\*\*** restores the preceding stroke prefix, affected structural/material buffers, halo errors, tiles and revisions, totals, statistics, schedules, RNG cursor and histories. Snapshot storage is 44 bytes per pixel of the affected rectangular support plus blur context, with small tile/metadata overhead; it does not copy the entire analysis/session. Its bytes are recorded and included in snapshot/export estimates. Large selections can be refused by the existing memory guard. Undo is available until the next painting mutation or replacement, and applies to the most recent local pass only.



Pause/Resume work within a long local pass. Cancel stops local work, retains accepted operations, leaves the global session intact and offers Undo. Replacement reference, Paint and document import discard stale workers/selection/undo state. Global Cancel retains its existing behavior of terminating the optimiser and keeping the last saved snapshot.



**## Compatibility and retained behavior**



New documents retain \`version: 4\` and \`brushVersion: oil-library-3.0\`, record \`plannerVersion: 6\`, and add per-operation \`target\` plus informational \`targetHistory\`. Validation preserves planner provenance and rejects malformed target coordinates, radii, feather widths and pass options. V2/v3/v4 authoritative records replay unchanged; historical planning flags never activate a legacy scheduler. No executable v5 planner is retained.



The foundation remains 6-12 recorded broad operations within 10% of the smaller supported budget, with the existing reliable background-tone estimate/whole-image mean fallback. There is no dominant-colour initialisation, source underlay, segmentation ownership, post-render cleanup, or coverage gate. Priority marks remain soft global guidance.



The existing Paint / Surface & light / Replay / Export / Advanced tabs remain. Local controls fit in a collapsible Paint section; detailed scale/search diagnostics live in Advanced. Brush lab, current-frame/full exports, lighting presets, relief, timeline checkpoints (32 MiB/eight entries), stale seek/export cancellation and native/expanded fullscreen remain. Reference imports retain 32 MB / 40 million source-pixel limits; JSON retains 48 MB.



**## Measurements and visual evidence**



[Quick matched gallery]\(artifacts/v6/comparison.html) uses saved planning inputs from the rooster, Mat monochrome portrait and forest portrait assets, nearest-neighbour reduction to a 320-pixel bound, Fine, seed 42, body 0.65, 350 operations and 1,400 proposal limit. V5 was captured before engine edits, including exact settings, records, candidate/contact counts and runtime. It is now replay-only evidence.



\| Reference | V5 / v6 candidates | V5 / v6 contacts | V5 / v6 runtime ms | V5 / v6 structural error |

\| --- | ---: | ---: | ---: | ---: |

\| Rooster | 892 / 2446 | 907 / 2446 | 868 / 1248 | 0.074207 / 0.011209 |

\| Monochrome | 895 / 2432 | 910 / 2432 | 894 / 1417 | 0.046523 / 0.004905 |

\| Forest portrait | 892 / 2410 | 902 / 2410 | 732 / 1225 | 0.037168 / 0.008102 |



[Full matched gallery]\(artifacts/v6/full/comparison.html) uses the original planning inputs, Fine, seed 42, 1800 operations and 7200 proposal limit. V5 comparisons replay existing authoritative v5 records; these are not fresh v5 runtime measurements. V6 global work uses Balanced. Local crops use explicit additional Thorough budgets of 100 operations / 400 proposals per selection.



\| Reference | V5 / v6 candidates | V5 / v6 contacts | V6 runtime ms | V5 / v6 structural error |

\| --- | ---: | ---: | ---: | ---: |

\| Rooster | 4719 / 13069 | 4819 / 13069 | 8685 | 0.005939 / 0.005239 |

\| Monochrome | 4749 / 12980 | 4944 / 12980 | 7699 | 0.002463 / 0.001023 |

\| Forest portrait | 4734 / 13220 | 4879 / 13220 | 12088 | 0.005134 / 0.003605 |



Runtime includes final snapshot/material audit, excludes subsequent targeted passes, and is machine/load dependent. Operation limits alone do not equalise candidate cost. The JSON measurement files contain exact settings, counts, class distributions, depth work, runtime and local budgets.



Visual review: v6's rooster background has fewer diagonal scratches and broader quiet corrections, while its main feather masses remain coarse. Targeting makes the eye readable where the global result lacked it; neck/feet/gap crops show incremental corrections, with toes still blocky. Portrait eye/mouth crops show local feature work without turning the whole painting into a new block-in. Forest foliage and hair remain faceted; some broad masses are less natural despite lower error. Fine features, anatomy and pleasing marks are not guaranteed by aggregate error. Local improvement values are deltas of the global weighted structural objective, not claims of percentage improvement within the circle.



Controlled before/after fixtures and [verification.json]\(artifacts/v6/verification.json) cover a broad wrong-colour patch, an adjacent narrow high-contrast feature, fine detail, image-edge targets and subject/background crossing. Original galleries/assets remain historical evidence. The prior README/handoff are archived under \`artifacts/v6/README-v5.md\` and \`HANDOFF-v5.md\`.



**## Sources, build and verification**



\| Source | Responsibility |

\| --- | --- |

\| [engine.js]\(engine.js) | Canonical analysis, scale/search scheduling, brushes, target deposition, scoring, undo, validation/replay |

\| [worker.js]\(worker.js) | Batched global/local sessions, pause/cancel/undo protocol, preview, seek, lighting/export |

\| [app.js]\(app.js), [lab.js]\(lab.js), [light-controls.js]\(light-controls.js) | Studio, brush lab, presentation controls |

\| \`\*.template.html\`, [styles.css]\(styles.css) | Maintained page structure/style |

\| [build.cjs]\(build.cjs) | Embeds canonical sources in both standalone pages |



Edit maintained sources and rebuild; do not edit embedded copies. Node 22+ commands:



\`\`\`sh

node build.cjs

node v6-test.cjs

node test.cjs

node v4-test.cjs

node v5-test.cjs

node v6-browser-test.cjs

node v6-browser-test.cjs --firefox

node browser-test.cjs

node browser-test.cjs --firefox

node v6-studies.cjs

node v6-studies.cjs --full

node render-strokes.cjs artifacts/v6/full/rooster-targeted.json 2048

\`\`\`



Actual verification: 11 v6 groups, 14 canonical groups, 10 material/legacy groups, 10 foundation/recovery groups; 13 targeted groups and 20 existing regression groups in each installed Chrome and Firefox. Reports are under \`artifacts/v6/\`, with canonical output under \`regression/\` and foundation output under \`foundation-regression/\`. Browser checks use isolated temporary profiles and real pointer actions, including device pixel ratio 2, scrolled 100%, fullscreen, tiny/cancelled/stale selection, pause/resume/cancel, undo, replacement reference, saved JSON and pixel-exact 2x PNG downloads. Chrome native fullscreen is covered; Firefox headless can use expanded fallback, so interactive native Firefox fullscreen remains a manual check.



Historical \`v5-studies.cjs\` now points to preserved evidence/current commands; it does not overwrite v5 artifacts. Older capture/benchmark scripts are not part of the v6 workflow. The v3 optional suite was not rerun. Test fixtures write output files; source assets are not changed.



First manual checks: pause a rooster painting, inspect timeline zero, select Targeted refinement and drag over the eye; check automatic latest-state restoration and local start. Try Fine detail/Thorough on toes, hide/show the circle, Undo, then Resume/Continue. Compare Fit, scrolled 100% and fullscreen placement. Save JSON and a 2x PNG, reopen the JSON and check the refinement explanation.


