# V36 reproduction and restoration

V36 is rejected. V33 remains the champion/default; V12, V17 and V31 remain available. Shared runtime code was not modified. Read [experiment](V36-EXPERIMENT.md) and [KIV](KIV-v36.md).

Open [compact challenger comparison](../artifacts/v36/comparison.html) or [retained V35 gallery](../artifacts/v35/comparison.html) directly. They need no loose painting PNGs. Current galleries use compressed previews; exact replay evidence is lossless. Human voting remains optional and unfilled by Codex.

There is one authoritative archive for each retained evidence set:

- `artifacts/v35/canonical-records.zip`: 48 complete final documents,48 trajectories, original SHA256 restoration manifest and historical package-check recovery tool. Prepared source PNGs, source metadata/protocol and small numerical/timing reports remain beside it.
- `artifacts/v36/rejected-challenger.zip`: isolated treatment/study/diagnosis/test tools,4 final challenger documents and8 fresh champion/challenger trajectories. Small protocol, paired counts/timing, diagnosis, freeze, checks and original exact PNG hashes remain beside it.

From `stroke-master/`, verify the compact package policy with `python v36-storage-check.py`. This checks both archive CRCs/all member hashes, all preview decodes, source hashes, rejected-code absence and combined generated storage below 200 MB. The active useful engine regression remains `node v33-test.cjs --out=artifacts/current-checks`; browser lifecycle is `node v33-browser.cjs --out=artifacts/current-checks`. Chrome may need execution outside the sandbox because its GPU process can fail there. Historical tests that need painting fixtures should use their recorded on-demand restoration; do not regenerate all historical benchmarks.

Restore exact V35 evidence with `node v36-restore.cjs --case=rainier42-v33`, or `--all` for the historical full V35 check. It extracts canonical JSON and regenerates every available exact PNG for that case, checking original bytes. V12 Orca's missing8400 remains missing. See [V35 storage instructions](../artifacts/v35/README-restoration.md).

If reconstructing the original V35 packages, recover their superseded checker with `python -c "import zipfile; zipfile.ZipFile('artifacts/v35/canonical-records.zip').extract('v35-package-check.py', '.')"`. This is an optional historical tool, not part of the current compact check.

Restore exact V36 comparison images with `node v36-export.cjs --case=rainier42`, or `--all`. This replays canonical records directly from both archives and verifies original PNG byte hashes; the rejected planner stays absent. Small paired metadata selects the authentic equal-work prefixes. Restore diagnostics by recovering the archived diagnosis runner and the relevant V35 JSON records, then running it.

To regenerate the compact gallery, restore the four seed42 V35 V33 cases, run `node v36-export.cjs --all`, then `python v36-gallery.py`. No painting optimisation rerun is needed.

To reproduce the rejected experiment, run `python v36-evidence.py --restore`. This restores the four isolated tools and12 compressed buffers; it does not change the app. The engine and relative dependencies come from frozen Git commit `29f92fba73d96c1654b67df6f0bdf8ae0638aa85` via `v33-control.cjs` and champion.json. Existing pressure curves make records readable by the canonical renderer, without new material metadata. `node v36-test.cjs` exercises focused treatment risks. To rerun seed42, use a fresh copy of the study workspace with the preserved references/protocol and an empty V36 output directory except champion.json; the study refuses to overwrite measurements/protocol. Do not change the treatment after confirmation. Seed73 was not rendered because seed42 failed the artistic gate.

Use a fresh reproduction directory for expanded evidence. Remove on-demand restorations afterward using deletion-manifest.json; do not run broad recursive deletion. The one-time `v36-cleanup.py` verifies archives and permitted untracked target paths and refuses an already recorded cleanup. Immutable versioned reports retain their original links; current storage instructions describe superseded packages explicitly. No original references or historical Git objects should be deleted.

Future work should keep initial/final records plus only trajectories needed for comparisons, crop decoded shared visuals at display time, losslessly archive canonical records, verify restoration, then remove duplicate exports/packages. Keep unique evidence even if a storage target cannot be met. Do not add selectable failed planners or commit large evidence archives. An ignore rule cannot shrink previously stored Git history.
