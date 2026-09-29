# Personal site and game prototypes

- This is an existing Angular personal site. Verify installed versions and scripts; preserve its package manager and conventions.
- Each game owns `src/app/<game-name>/`. Before editing a game, read its local `AGENTS.md`, including when working from the repository root.
- Keep game rules, runtime, UI, styles and tests within that game's folder. Do not import another game's internals.
- Integrate games through the existing router using a lazy boundary. Keep eager site imports free of game code and assets.
- Reuse existing site facilities where appropriate; do not extract a shared game framework for hypothetical reuse.
- Make the smallest coherent implementation. Prefer direct functions and concrete types; abstractions must solve an existing problem.
- Preserve unrelated work. Avoid opportunistic renames, formatting sweeps and site-wide migrations.
- Keep game styles and CSS variables scoped to the game host. Do not change global typography or reset styles to achieve a local design.
- Discover relevant scripts and neighboring patterns once; read additional documents only when the task needs them.
- Use installed Angular guidance for Angular-specific work when invoked or relevant; simulation math and balance need no Angular handbook.
- Validate the affected behavior with the narrowest useful check. Build after integration/configuration changes; do not repeatedly run the whole suite for cosmetic edits.
- For visible changes, inspect the running affected screen if browser tooling is available; otherwise state that visual verification is outstanding.
- Report the result, meaningful verification and remaining limitations briefly.
