# V66: Angular 22 and GitHub Pages

This is a standalone static application. Do not port it into Angular components, use the Angular router for its pages, or add a backend. No Angular project or existing Pages workflow exists in this checkout; these steps integrate the produced files into your existing project.

## Produce and inspect the package

From the full checkout, with Node 22+:

```powershell
node stroke-master/build.cjs
node stroke-master/v66-test.cjs
node stroke-master/v66-browser.cjs
node stroke-master/package-v66.cjs
```

Output: **`stroke-master/dist/stroke-master/`** and the deterministic **`stroke-master/dist/stroke-master-v66.zip`**. Its `package-manifest.json` lists exact members and hashes. It includes studio, About, brush lab, embedded runtime workers/codec/fonts, explicit local GIF source/codec/licence files, small showcase JPEGs and surviving text logs. Historical bulk galleries and replay archives are excluded. In this runtime copy the studio's Charcoal Studies link points to the development history; the complete study tool remains in the full checkout.

**Public asset check:** `ASSET-NOTICES.md` identifies three rights-pending showcase outputs. Confirm the underlying reference-image permissions and credits before publishing them, or remove that showcase and its three assets from the package allowlist. Font and encoder notices are already included. This package does not establish source-image rights.

## Copy into the Angular project

Copy the **contents** of the output directory into your Angular project's `public/stroke-master/`. For example, replacing the destination paths with the actual existing Angular workspace:

```powershell
Copy-Item -LiteralPath 'D:\leaf-trace\stroke-master\dist\stroke-master' -Destination 'C:\path\to\angular-project\public' -Recurse -Force
```

Check the result is `public/stroke-master/index.html`, not an extra `stroke-master/stroke-master/` layer. For an existing destination, copy its contents rather than nesting the directory; remove stale files only within that verified destination. The package is generated from an allowlist and refuses unexpected pre-existing package members.

Verify your Angular 22 application's `angular.json` build `options.assets` includes the public directory. The current official [workspace configuration](https://angular.dev/reference/configs/workspace-config#assets-configuration) describes copying asset files as-is and uses `public/` by default. An explicit equivalent is:

```json
"assets": [{ "glob": "**/*", "input": "public" }]
```

Preserve your other asset entries. The files must appear at `stroke-master/` inside the actual browser output directory produced by your builder. Run your existing production build, typically `ng build --configuration production`, with the same `base-href` already used by the parent Angular Pages deployment. Inspect its output instead of assuming a fixed project or `dist/.../browser` name.

Add a normal navigation anchor. For a root deployment use `<a href="/stroke-master/">Stroke Master</a>`; for a project Pages deployment use `<a href="/repository-name/stroke-master/">Stroke Master</a>`. With an accurately configured Angular `<base href="/repository-name/">`, `<a href="stroke-master/">Stroke Master</a>` also resolves from that base. Do not use `routerLink`, an iframe, or an Angular catch-all redirect for this destination.

## Publish through the existing Pages workflow

Keep the existing workflow that builds Angular and uploads its browser output as the Pages artifact. Ensure that artifact includes the new `stroke-master/` directory. If using a branch-based Pages site instead, copy the built static files into its configured publishing source. [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) hosts static HTML, CSS and JavaScript; no server-side runtime is needed.

No special COOP/COEP headers, SharedArrayBuffer, runtime CDN, SPA route rewrite or custom worker server is required. The studio creates Blob workers from locally embedded engine and codec source. Additional Content Security Policy rules, if imposed by your parent site, must allow those Blob workers and the app's embedded scripts; ordinary Pages imposes no custom policy from this package.

## Verify the deployed files

1. Open both the parent navigation link and `https://owner.github.io/repository-name/stroke-master/index.html` directly. Also test `/stroke-master/` for a root-hosted site.
2. Open `about.html` directly and refresh it. Check the three showcase images, all 65 version entries and development-source links. Old log links to bulk evidence require the full checkout, as labelled.
3. In the studio, create V33 oil and V58 charcoal work. Confirm worker start, Pause, Continue, replay and PNG/JSON downloads. Import an archived artwork and check its recorded identity.
4. Use More → Export options → Export replay GIF. Try two sizes and durations, final hold, looping and cancellation. Open the saved GIF in an independent viewer; check first and final frames.
5. Check DevTools for missing files, worker errors or attempted external requests. The package itself makes no upload requests. First hosted loads need network; no service worker is provided. Reopening the complete local folder supports offline review in tested Chrome.

V66's automated browser suite serves the actual package at both `/stroke-master/` and `/repository-name/stroke-master/`. It does not claim a real Angular 22 build or a public Pages deployment was executed in this repository.
