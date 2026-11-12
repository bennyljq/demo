# V19 operational snapshot

Open brush-lab.html for the shared Flat / Filbert two-colour capability, or artifacts/v19/comparison.html for ten studies and three fixed-contact comparisons. The portable ZIP is artifacts/v19/v19-comparison.zip. Production choices remain V14 (default) and V17, material 2, quiet body .25. No V19 planner exists. Generation, attention, scheduling, acceptance and boundary validation are unchanged.

Flat / Filbert show Single colour / Two colours across width. Colour A remains the stroke colour; two-colour controls add B, transition position, softness, bounded variation, Swap A/B, tonal and contrasting presets. Straight/curved and all compatible gestures remain available. Seeds can be entered reproducibly or rerolled without resetting material controls. Pigment and normal relief views, 100% inspection, Save study JSON, native Save PNG and Save 2x rerendered PNG share canonical replay. Unsupported brushes retain single-colour deposition. Compound gestures store loading on each actual contact.

Document v4, brush oil-library-3.0, existing material versions and planner provenance remain authoritative. Optional per-contact loading version 1 / space srgb stores colourB [0,255], balance [0,1], softness [0,4], variation [0,.2]. Missing metadata is exact legacy rendering. The regular colour is A and textureSeed supplies the correlated phase. New study records have no plannerVersion because no planner generated them. Validate/import/replay/timeline/export require no reference. Old applications do not understand this extension and should not be used to replay new loaded records.

Current commands, from stroke-master/:

```sh
node build.cjs
node v19-test.cjs
node v19-experiment.cjs
node v19-cost.cjs
node v19-browser-smoke.cjs
node v19-lifecycle.cjs
node v19-gallery-check.cjs
```

Chrome must run with permission to start its local processes and debugging socket. Test-only Python is used by the archival controls and portable packaging. Browser checks download actual files inside artifacts/v19/downloads. The lifecycle suite reuses nineteen existing checks with V19 evidence paths. v17-test.cjs remains maintained; its frozen-source gate explicitly exempts the authorised lab/style edits. v18-check.cjs is a historical source-freeze check and cannot claim V18 runtime hashes for V19. Avoid running historical generators over prior evidence. Immutable dev-logs and all planner sources are preserved.

See V19-EXPERIMENT.md for fitting/cost/visual limits and KIV-v19.md for deferred work. Recommend a later separately bounded planner-integration proof, with unchanged support rejection and actual broad colour scoring. This capability alone proves no full-painting improvement.
