# V22 operational snapshot

Five choices: V14 unchanged default, V17, V20 experimental, V21 experimental and V22 experimental: contour direction. Quiet body defaults/reset.25; material2, document4, oil-library-3.0/loading1/srgb are unchanged. V22 adds at most one direction sibling; original candidates/RNG/fitting/support and unchanged V21 loading policy remain. Recommendation: revise before adoption; keep the manual comparison for cheek/neck tonal gains, with remaining ends/facets and rooster crown/head concerns.

Commands from stroke-master/:

```
node build.cjs
node v22-test.cjs
node v22-experiment.cjs
node v22-browser-smoke.cjs
node v22-gallery-check.cjs
node v22-gallery-check.cjs package
```

v22-test.cjs composes maintained engine/loading tests, direction checks and full portrait repeats/preservation. Prior lifecycle wrappers assume historical selector counts. Browser checks need local Chrome process/socket permission; Python is test-only for verified archive loading/packaging. Normal app/import/export requires neither Python nor historical planners.

[Report](V22-EXPERIMENT.md), [gallery](../artifacts/v22/comparison.html), [ZIP](../artifacts/v22/v22-comparison.zip), [trace](../artifacts/v22/directions.html), [examples](../artifacts/v22/candidates.html), [KIV](KIV-v22.md). Incoming V21 engine, three shared geometry sources and two loading sources are in archives/v22-control.zip; v22-control.cjs verifies exact bytes. Historical v17-control.cjs reuses the exact V14 entry for old comparison, because earlier retirement archives hold a different earlier helper. The offline tools in archives/v22-diagnostic-tools.zip can be restored to stroke-master/ to reproduce capped traces and matched examples; no production trace infrastructure exists.
