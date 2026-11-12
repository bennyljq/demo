# V66 asset and dependency provenance

The showcase is rendered from existing accepted-operation records, not generated illustrations or source photographs pasted underneath a painting.

| Asset | Evidence / identity | Public reuse status |
| --- | --- | --- |
| `assets/showcase/oil-v33.jpg` | V35 `canonical-records.zip`, `beaver42-v33.json`, 8,400 operations | Reference `assets/references/beaver-1.png`: creator and permission not documented |
| `assets/showcase/charcoal-v58.jpg` | Existing V58 `tay-v58-42.json.gz`, 5,600 operations | Reference `tay-gradient.jpg`: creator and permission not documented |
| `assets/showcase/charcoal-v50.jpg` | Existing V58 `mat-v50-42.json.gz`, 2,800 operations | Reference `mat.jpg`: creator and permission not documented |

These are rights-pending study outputs. Do not interpret inclusion in a local review package as a licence for the underlying photographs or illustration. Confirm rights and attribution before publicly publishing these three files; alternatively remove the showcase section and its three assets from the production allowlist. Reference originals, supplied teaching examples and bulk diagnostic galleries are not shipped. No ownership or public-domain claim is made.

The studio embeds local Inter and Newsreader font files under SIL OFL 1.1; complete notices are embedded in each generated studio/lab page. Sources and licence files are retained in `assets/fonts/` in the full checkout.

GIF encoding uses **modern-gif 2.1.0**, copyright 2021–PRESENT wxm, MIT. Official release: https://github.com/qq15725/modern-gif/tree/v2.1.0 (npm release 2026-04-16). The unchanged release tarball, registry metadata, source and MIT licence are retained under `vendor/modern-gif/`. Its SHA-512 npm integrity is `sha512-9ZGD5b4jNUge0fvFP1bd9Hsqz5CSZI1al3EhCJ+WFkZgmn5NO1yvVwXJA/LTqro85l2Gt0+S0dDFgVYhYtLLWg==`.

`build-adapter.cjs` deterministically exposes the upstream low-level writer/LZW codec and decoder in `codec.js`, omitting its high-level batch/palette API. The upstream codec is unchanged. Stroke Master's worker supplies indexed frames incrementally and builds the GIF header with the codec. No `modern-palette` code is used or required. The locally supplied palette and fixed ordered dithering are export-only. There is no runtime CDN, upload or external encoder service.

Maintenance review on 2026-10-18 checked official repository commit metadata and npm release metadata. modern-gif had an April 2026 release; gifenc's latest observed commit was September 2024. Selection reflects that evidence, not a guarantee of future maintenance. Keep the pin and licence when updating the adapter. The production manifest records exact shipped hashes.
