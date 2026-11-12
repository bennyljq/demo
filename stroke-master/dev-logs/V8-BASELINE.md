# V8 baseline and historical recovery

This is an investigation package. The production painter is still v7: no source, planning, scoring, brush, lighting, UI or standalone-page changes were made. No planner experiment was implemented.

## Preserved state

Git has one initial commit, `6606abe66738c458044a23324d2f4abb6ae4ba60` (`stroke master v7`), and no earlier version in its history or reflog. At capture, the only working-tree entry was the untracked `stroke-master/assets/stroke-master-strokes-v2.json`. That file was preserved without alteration. No commit, reset, clean or branch change was performed. Git's ownership check was handled by a command-local `safe.directory` override, without changing Git configuration.

[Frozen baseline](artifacts/v8/baseline/manifest.json) contains exact copies of ten production sources/pages, `build.cjs`, README, HANDOFF and the v7 report, with SHA-256 hashes, commit/status, Node/Git/platform information and build instructions. Both copied HTML pages are runnable directly from disk and embed the captured engine exactly. This is a frozen diagnostic snapshot, not another maintained painter.

[Evidence inventory](artifacts/v8/inventory.json) records original paths, exact copies, dimensions and file/pixel hashes. It preserves the original rooster PNG, fixed decoded input, preferred v2 PNG/JSON, historical benchmark PNG/JSON pairs and authoritative v7 seed-42 PNG/JSON. The decoded benchmark input equals the original rooster's RGBA pixels. The new v2 document does not embed a reference hash or priority marks; its association with that rooster is supported by its exact corresponding output and visual subject, not an embedded source identifier.

## Bounded historical search

One project-only search inspected Git history/reflog, archived sources, backup/archive filenames and standalone HTML engine signatures. It ended during initial inspection, within the approximate ten-minute limit. No whole-machine search or private browser/editor database access occurred.

| Classification | Discovery |
| --- | --- |
| Original executable v2/v3 planner | Not recovered. Current HTML contains v7; the other project apps contain no Stroke Master engine. |
| Other executable historical source | `artifacts/v7/engine-v6-source.txt` is the existing complete v6 archive, outside the requested v2/v3 recovery. The current renderer retains legacy brush paths, not a complete v2 planner. |
| Replayable stroke records | New `assets/stroke-master-strokes-v2.json`; v2/v3 rooster benchmark records under `artifacts/v3/`; v2 golden records and hashes. |
| Rendered images | Preferred `assets/ayam-stroke-master-v2.png`, original `assets/ayam-1.png`, v2/v3 benchmark PNGs and current v7 PNG. |
| Historical descriptions | `artifacts/v3/README-v2.md`, `artifacts/v4/README-v3.md`, comparison settings/measurements. These are documentation, not recovered source. |

## Verified replay and settings

**The 15,138-operation v2 record reproduces `assets/ayam-stroke-master-v2.png` pixel-for-pixel**, at 632 x 461 with its recorded legacy relief/light. Both historical 1,800-operation benchmark records also replay exactly to their associated PNGs. The frozen current implementation regenerates the saved v7 seed-42 strokes, pigment, coverage, height and displayed pixels exactly. Legacy golden surfaces match existing hashes at 240 and 480 pixels. [Verification](artifacts/v8/verification.json).

The preferred v2 record uses document version 2 / `oil-ribbon-2.0`, Fine, seed 42, final caps 16,800 operations / 67,200 proposals, relief 0.45 and light `[-0.45,-0.55,0.8]`. It stopped at 15,138 accepted operations, 67,200 proposals and 201,040 recorded candidates. Four recorded continuations add 700, 700, 7,000 and 7,000 operations. Initial caps of 1,400 / 5,600 follow arithmetically from the final caps and additions; they are derived, not a recovered original UI configuration.

The historical v2/v3 benchmarks use Fine, seed 42, 1,800 / 7,200 caps and that legacy presentation. V3 uses `oil-library-3.0` and records its enabled brushes. V7 uses Fine, seed 42, Balanced search, body 0.65, 1,800 / 7,200 caps and Neutral directional lighting. Its actual work is 2,029 proposals / 14,545 candidates. Historical priority marks, complete executable source and generating runtime are unknown. Historical body/search settings absent from a record remain unknown; modern defaults were not imputed.

These are not matched-budget preferred-v2/v7 results. Reproducing the local preferred v2 PNG does not establish reproduction of the separately supplied preferred v3 screenshot.

## What the strokes show

[Comparison gallery](artifacts/v8/comparison.html) includes preserved originals, identical pigment-only/Neutral presentations and native-resolution eye, neck, tail and background crops. [Statistics and methods](artifacts/v8/statistics.json) contain full brush counts, normalized widths/path lengths, recorded pass/layer order, operation quarters, directions and footprint overlap.

| Record | Operations | Narrow operations | Median width / E | Median path length / E | Round brush operations |
| --- | ---: | ---: | ---: | ---: | ---: |
| Preferred v2 | 15138 | 14512 | 0.003234 | 0.009636 | 13715 |
| Benchmark v2 | 1800 | 1257 | 0.003893 | 0.014231 | 1037 |
| Benchmark v3 | 1800 | 1220 | 0.005185 | 0.014800 | 611 |
| V7 baseline | 1800 | 1360 | 0.003826 | 0.016689 | 1361 |

`E` is the 632-pixel long edge. Narrow means minimum contact width below 0.012 E, not an aesthetic classification. Path length uses the compatibility renderer's adaptive curve geometry. Compound contacts are counted explicitly in the machine-readable report.

Footprint statistics rasterise each operation independently at native resolution and count pixels with coverage above 0.00001. Bounding boxes only allocate scratch surfaces. Repeated deposits indicate overlap, not proof of corrective intent or damage.

- Preferred v2 has 848 narrow operations depositing in the eye crop and 4,851 in the neck crop; v7 has 60 and 217. The benchmark v2/v3 neck counts are 97/78. Thus v7 already has substantial fine work at the modest benchmark allowance; missing fine proposals alone cannot explain the preferred image's advantage.
- Preferred v2 narrow neck paths have axial concentration 0.701 near 97 degrees; v7 has 0.605 near 104 degrees. These summarize whole paths that deposited in the crop, not pixel-local feather alignment. They are descriptive, not aesthetic scores. Curved tail paths are deliberately more dispersed.
- Preferred v2 records background/foreground groups through operation 1,007, then 13,914 `pass:3, layer:revisit` operations and 216 later accents. Those labels do not imply the modern circular targeting UI. V7 records 12 foundation operations and global painting thereafter; broad repairs can carry a late pass tag even early in the run.
- In the quiet background crop, preferred v2 has 65 broad pale operations, ending at index 173; v7 has six foundation operations, ending at index 11. Preferred v2 therefore preserves early diagonal background texture there. In subject crops, later deposits continue almost to the final operation.
- Over all touched pixels, repeat-deposit fractions are 83.7% for preferred v2 and 76.6% for v7. Those percentages depend on footprint size, foundation and operation count; they do not prove superior correction decisions.

Visual inspection confirms denser, more continuous narrow neck texture and a more articulated eye in the preferred v2 output. Its much greater continued work is a verified confound. Scheduling, brush selection, mark placement and ranking remain plausible additional explanations; missing original source prevents attributing the difference to a specific historical algorithm.

## Single next experiment, for review only

Run **unchanged v7 with the recorded v2 continuation allowance**: seed 42, the same decoded rooster, Fine, start at 1,400 / 5,600, then add 700 / 2,800, 700 / 2,800, 7,000 / 28,000 and 7,000 / 28,000. Preserve current foundation, objective, brushes and planner. Compare pigment at the recorded continuation boundaries and 15,138 accepted operations if reached; report actual proposals/candidates and any earlier stop. This isolates the large work/continuation confound before a simplified-planner experiment. It has not been run.

To recover original planning behavior, supply the **original standalone `index.html` from the v2 build that produced `assets/ayam-stroke-master-v2.png`**. Its engine/worker/UI scripts should be embedded. If only source survives, the same-build `engine.js`, `worker.js` and `app.js` would substitute. No outside location is known or presumed. If the supplied preferred v3 screenshot represents a different output, its original PNG and recorded strokes JSON would establish that separate reference.

Only new analysis/replay checks were run (`node v8-investigate.cjs`); no build or unrelated regression suite was run. Production and standalone hashes remain unchanged. Review is the stopping point.
