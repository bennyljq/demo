# V34 protocol and restoration

V34 validates and consolidates V33; it does not name a painter. Current UI: Stable V12/V17, Experimental V31/V33, default V33. Authentic generated graded records remain planner33. V22/V30/V32 generators stay archived; recorded replay remains supported. Existing versioned logs and evidence are immutable.

Run commands from `stroke-master/`:

```text
node build.cjs
node v33-test.cjs --out=artifacts/current-checks
node v33-browser.cjs --out=artifacts/current-checks --gallery=artifacts/v34/comparison.html
node v33-preservation.cjs --manifest=artifacts/v34/incoming.json --out=artifacts/current-checks
```

Chrome must be installed at the harness default path or supplied via CHROME_PATH; the managed sandbox may require approval for its processes. Browser checks use the existing CDP harness. The first painting uses the actual default selection. Focused tests use the original frozen V32 via v33-control.cjs and verify retained algorithms, exact strokes/buffers/replay and lifecycle. They do not regenerate the established three-reference benchmark collection. Historical full benchmark commands are opt-in; current V33 tools default to `artifacts/current-checks` and accept `--out=...`. Preserve all existing evidence directories when running them.

V34 results: [tests](../artifacts/v34/tests.json), [browser](../artifacts/v34/browser.json), [preservation](../artifacts/v34/preservation.json), [new eight-run verification](../artifacts/v34/verification.json), [gallery manifest](../artifacts/v34/gallery.json). Preservation compares all incoming tracked file hashes except the declared current edits, and requires the engine to match the incoming source with only the default constant, fallback and export changes. No cleanup modifies the artistic implementation.

The [design](../artifacts/v34/design.json) was recorded before treatment comparisons. It specifies exact source/working-PNG/RGBA hashes, Lanczos preparation/Pillow version, crops, materials, brushes, budgets, checkpoints, pair order and error matching. Existing assets were used without substitutions. Mat 450→640 is an explicit upsample, forest 2560×1600→640×400 preserves aspect. Prepared PNGs are retained; the temporary preparation script was removed. The study asserts their hashes and settings. `v34-study.cjs` records every accepted prefix, canonical full documents, checkpoint PNGs and exact buffer/replay agreement. Its accepted-prefix timing excludes checkpoint export/inspection. Initial 1400/+7000 Continue and proposal allowances are unchanged. The smaller paired measured time selects nearest prefixes; first common-error crossings use actual observations, never interpolation.

Reproduce study evidence in a **new** directory, copying only incoming.json, design.json and the two `*-source.png` inputs from artifacts/v34. Then run:

```text
node v34-study.cjs --restore --out=artifacts/v34-reproduction
```

The study refuses to overwrite measurements. `--restore` invokes the shared in-memory Git loader with that directory's incoming manifest. It restores the exact incoming V33 engine and dependencies, while explicitly selecting V31/V33. This avoids the later default-only source change and avoids copied applications/engines. Preserve Git object `1ce73cfa0b31511e9b72d207f0f0b76eb5e2612b`. Timing and matched-time prefixes can vary across machines; equal-operation decisions remain deterministic for these inputs/settings.

`python v34-gallery.py` rebuilds the V34 gallery from its retained exact evidence (Pillow WebP support required). It embeds deduplicated quality88 native-dimension previews and fixed pixel crops; exact PNG/JSON links require adjacent files, while all pictures and controls work in the HTML alone. No previous gallery is copied. Reported single observations must not be confused with the [established V33 repeated benchmark](../artifacts/v33/summary.json).

Historical restoration instructions remain [README-v33](README-v33.md), [README-v32](README-v32.md) and earlier versioned logs. `v33-control.cjs` still defaults to frozen V32; its optional manifest restores incoming V33. JSON replay preserves artwork/provenance, not optimiser state. No reset or automatic commit occurred.
