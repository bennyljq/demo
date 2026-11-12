# V37 review and recovery

V37 was rejected at the six-contact mechanism gate. No full painting comparisons or seed73 confirmation were run. V33 remains champion/default and the app has no V37 selector entry. Read [experiment](V37-EXPERIMENT.md) and [UI handoff](UI-REVAMP-HANDOFF-v37.md).

The single authoritative review/recovery archive is **D:/stroke-master-evidence/v37/v37-review.zip**, outside the Git working tree. Exact archive SHA256, bytes and member counts are in artifacts/v37/artifacts.json and package-checks.json. Extract it into a review directory and open comparison.html. The gallery includes lossless whole images and crops at display time; no engine reconstruction, reference download or network is needed for visual review. All144 contact/view/area/zoom combinations were checked.

The ZIP contains the compact gallery, versioned report/readme/KIV/UI handoff, fixed protocol and contact/timing measurements, verification results, champion/recovery metadata, a small engine-v37.patch and two rejected-probe runners. There are no loose duplicate painting buffers retained. Existing canonical V35 records remain in stroke-master/artifacts/v35/canonical-records.zip; V37 did not extract them into the working tree or duplicate their full records. Keep the existing archives/Git restoration dependencies for regeneration.

To regenerate exact interventions in a separate reproduction checkout:

1. Restore source from recorded V36 commit `d92bd2da067ef7cbcba169fdeb738bd5075d5bf4`; preserve unrelated work. Have the existing V35 canonical archive/prepared sources and V36 diagnosis selections available.
2. Copy tools/v37-mechanism.cjs and tools/v37-probe-test.cjs from the ZIP into stroke-master/. The reusable gallery/package helpers remain in the project; tools/v37-review.py is also packaged for recovery.
3. Check `git apply --check /path/to/extracted/engine-v37.patch`, then apply that patch in this reproduction checkout. It adds the archived version5 `endDeposition:1` extension only. The current production renderer intentionally rejects version5.
4. Create a fresh directory outside the Git tree and point artifacts/v37/working.json `temporaryDirectory` there. Copy packaged champion.json, protocol.json and recovery metadata into artifacts/v37/. Preserve the fixed18% profile; do not sweep or tune it.
5. From stroke-master/, run `node v37-probe-test.cjs`, `node v37-mechanism.cjs`, then `python v37-review.py`. Original canonical document/member hashes are checked. Painting replay does not restore optimiser state.
6. Verify regenerated exact PNG hashes against the gallery asset hashes/member manifest before deleting temporary exports. Remove the probe patch/tools from the reproduction checkout afterward; do not add a failed planner to the studio.

The original six comparisons are already retained losslessly inside comparison.html. They can also be extracted as PNG assets with `python v37-package.py --extract-images --out=/outside/git/path`, using the archive identified in artifacts.json. `python v37-package.py --check` checks archive CRC/all member hashes, all40 embedded PNG decodes, package links and the25 MB target. `node v37-preservation.cjs` checks current source/defaults, authoritative votes and rejected-code absence; existing `node v33-test.cjs` remains the useful small engine regression.

Current V35 votes at dev-logs/v35-human-votes.json are authoritative and preserved. V36's updated human tie assessment is a separate note; immutable older reports remain unchanged. Large V37 staging files are removed after verified package restoration. No Git history cleanup was performed.
