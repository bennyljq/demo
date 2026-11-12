# V16: bounded final-contact validation

**Recommendation: revise, while retaining V16 as an experimental comparison option.** The supported correction removes the conspicuous crown halo without materially losing V15's fuller construction or final feather detail. The traced standing-toe artifact remains unchanged: it passes the existing coarse compatibility policy. V16 also costs about 53% more measured generation work. This is a partial boundary improvement, not recovery of both requested artifacts or an adoption decision. V14 is now the user-approved default; V12, V14 and V15 remain available and reproducible.

Open the [portable gallery](../artifacts/v16/comparison.html). Every painting pair has pigment-only and identical Neutral images. The ZIP contains all gallery/report dependencies and is checked after independent extraction. Historical claims of clean V15 feet in the immutable V15 report are qualified here: the faint surrounding toe mark is a real remaining defect.

## Freeze and scope

Incoming commit: `f7f8527e110a9537d02d597ef786da3fe1d57ab6`. Git showed the user's move of the V15 report into dev-logs; that move was preserved. Applicable workspace instructions, operational handoff, archived README-v15 and V14/V15 reports were read. No applicable AGENTS file was found. No commit, reset or branch change was made. Work stays in stroke-master/; original user assets and append-only dev-logs are preserved.

[freeze.json](../artifacts/v16/freeze.json) inventories incoming hashes/sizes. Frozen V12 source was verified against the V13 freeze; earlier frozen artifact hashes all matched. V14 source is unchanged. Only incoming engine integration and V15 fitter bytes were copied as new inert source evidence; existing frozen records/settings were reused. Fresh V15 short/full records produce exactly the historical strokes. Small-fixture comparisons also check V12/V14/V15 decisions, normalized records, real buffers, Continue and targeted work against the incoming implementation.

The single treatment is **final validation of actual canonical deposited support after V15 trimming**. Reference analysis, palette, foundation, attention, scheduling, three-candidate shortlist, objective/threshold, brushes, material and lighting remain unchanged. No fine-detail treatment, penalty, clipping mask, protection rule, anatomical coordinates, quotas or control broad-repair search was added.

## Local attribution: actual support and before/after buffers

The representative standing-toe artifact is at `(377,430)`; the crown artifact is at `(552,21)`. Coordinates exist only in bounded diagnostic tooling/evidence. [operation-trace.json](../artifacts/v16/operation-trace.json) records every operation depositing at those pixels, actual alpha/support, before/after RGB, coverage and height. The cropped buffers are updated through **every** preceding operation, not just strokes covering the selected pixel, and the final selected values equal full canonical replay. The gallery includes before/after/support views. These are pigment artifacts, with additional relief changes visible under Neutral; neither is merely a bounding-box overlap or relief-only shadow.

**Toe: operation 159, bright contact, width 11.444, early construction.** Actual alpha at the selected pixel is .87977. Minimum RGB changes from 253.953 to 43.540 immediately after that operation; later background work reduces the residual to 230.131. Height changes from 2.7461 to 2.3540 initially and ends at 2.3188, versus V14's 2.7461. This is real pigment spill and a height perturbation, not unchanged colour mistakenly attributed to fitting.

The contact's substantial actual support has **zero incompatible pixels** under the unchanged pass-0 test. All nine V15 fitting samples pass. At the artifact pixel the coarse reference is approximately `[224.6,217.1,213.1]`, while the sampled anchor is `[215.1,205.9,200.4]`; their difference passes the existing 100-unit construction tolerance. The native source there is white. This demonstrated mechanism is coarse compatibility admission, not missed grid samples, unchecked final trimming, or excessive fringe. Applying the new validator to this exact contact leaves width and support unchanged. Changing this policy is outside this single geometry remedy; no second remedy was combined with it.

**Crown: operations 103 and 245.** Operation 103 deposits alpha .48577 and lowers minimum RGB from 254.734 to 139.360; operation 245 deposits .53940 and lowers it further to 83.405. Subsequent work leaves 174.121, versus V14's 254.872. V15's final height is 2.8016 versus V14's 2.4431.

[fitting-trace.json](../artifacts/v16/fitting-trace.json) reproduces the exact first 245 accepted operations and traces their fitting rounds. Operation 103 trims at every one of its three rounds and returns another modified cubic without validation; its final contact has five incompatible substantial-support pixels. Operation 245 trims once, then all nine path/shoulder samples pass, but actual deposition has **71 incompatible pixels** above alpha .08. A concrete witness is `(556,21)`, with alpha .90370, roughly ten pixels before its trimmed starting centreline. The filbert's rounded cap deposits there; V15's samples inspect the path and lateral shoulders with endpoint zero. This is a demonstrated missing-endpoint/final-contact check, not a claim that a low-coverage fringe alone explains the halo. The selected halo pixel itself passes coarse compatibility; failure elsewhere in that same actual contact supports narrowing the geometry.

Applied in isolation to those frozen contacts, the validator narrows operation 103 from 27.689 to 10.335 and operation 245 from 34.625 to 17.949, eliminating their support at the selected crown pixel. It leaves the toe contact intact. Full-run decisions then diverge normally through the shared residual objective and RNG; later artistic differences are not attributed to a single isolated stroke.

Shared background foundation bands and the distant pale relief outline remain under Neutral. They are not presented as pigment-fitting failures or concealed with altered lighting.

## One correction and its bounds

V16 shares V14 construction and V15's exact compatible-cubic trimming. A small optional callback after V15 fitting invokes the canonical rasteriser into a cropped transient support surface. It tests deposited coverage greater than .08 against the existing compatibility function, including rounded caps, pressure/release resets and intervening raster positions. This is a geometry check: accepted contacts are recorded/rendered whole, with no pixel clipping or runtime reference mask in replay.

There are at most four validation renders per candidate. A failed contact narrows by .72 at most three times, with the existing .65 width floor. If it still fails, its cubic collapses to an empty path; canonical zero gain rejects it. Every proposal still evaluates exactly three candidates. Passing V15 contacts retain their trimmed width; this is not a global return to V14 minimum-width fitting. The same rule applies at every stage, Continue and targeted work.

Each patch is bounded by the canonical 1.5-million-pixel limit. Support RGB/coverage plus raster geometry arrays cost approximately 32 bytes per patch pixel, at most 48 MB plus bounded profile/geometry scratch. The shared memory estimate already reserves patch scratch and 64 MiB overhead; validation runs before candidate scoring, without persistent image-sized planner arrays. Raster-pixel validation is resolution dependent and deliberately permits alpha at/below .08. It does not guarantee a perfectly cut-out silhouette, high-resolution edge equivalence to the source, or compatibility against native colour during coarse construction.

## Visible tradeoff at unchanged budgets

The short matched run used the existing 160×112 thin curve and 192×128 blue/ochre fixtures at 360 accepted operations, and the unchanged 632×461 rooster at 2100. Seed 42, Fine/Balanced, quiet body .65, reference pixels, enabled brushes, material/light and allocation remained fixed. V16 retains fuller early tail/body masses than V14; its crown halo is reduced. The thin fixture has exactly V15's strokes/buffers. The blue/ochre subject remains coherent, with no visible worsening in this run; fragmented quiet-background construction remains unresolved. No separate coverage project was attempted.

That justified the established extended rooster schedule: `1400/5600`, then additions `700/2800`, `700/2800`, `7000/28000`, `7000/28000`. Both reach 16800 operations, stopping at each operation cap. Checkpoints at 1800, 5000, 10000 and 15138 plus final show the whole silhouette, surrounding canvas, crown, feet/gaps, eye, feathers, tail and background.

At 1800 V16 preserves connected dark tail/body masses rather than V14's open ribbons. Crown marks remain stylised during construction. Later checkpoints preserve useful broad mark character and feather separation. Final crown surroundings are visibly cleaner than V15 and approach V14. Eye detail remains a small stylised ring/accent; it is not a separate recovery claim. Tail texture and internal dark masses differ, without a clear material loss of V15 construction. The surrounding toe ghost persists: the selected pixel has **exactly the same final RGB and height in V15 and V16**. Apparent improvements elsewhere in the feet do not establish a fix for that artifact.

## Measured cost

Final measurements below are a sequential fresh-process pair, avoiding competing generation processes. Initial overlapping exploratory timing was replaced by this pair, with identical resulting strokes. Step work excludes checkpoint image writing. Generation wall time excludes checkpoint presentation and final replay/export. These are single local runs, not confidence intervals.

| Final rooster | Frozen V15 | V16 |
| --- | ---: | ---: |
| Operations / accepted contacts | 16800 / 16800 | 16800 / 16800 |
| Proposals | 18104 | 18088 |
| Candidates / candidate contacts | 54288 / 54288 | 54240 / 54240 |
| Rejections | 1304 | 1288 |
| Measured step work | 20.595 s | 31.532 s |
| Generation wall excluding presentations | 20.920 s | 31.887 s |
| Non-foundation large / medium / small | 71 / 232 / 16485 | 74 / 230 / 16484 |
| Structural error | .00074824 | .00082825 |
| Sampled peak RSS | 288.3 MiB | 278.6 MiB |
| Sampled peak array buffers | 103.7 MiB | 101.7 MiB |
| Shared guard estimate | 160.8 MiB | 160.8 MiB |

Fewer candidates do not imply lower cost: V16 has .09% fewer candidates but approximately **53.1% more step work**. No algorithmic efficiency or memory reduction is claimed. RSS includes reference/analysis, allocator retention and runtime state; sampled peaks every 128 proposals cannot isolate transient validation allocations. No extra treatment budgets compensate for this cost.

[matched-work.json](../artifacts/v16/matched-work.json) compares the nearest accepted prefixes at approximately 20.595 s: V15 final 16800 versus V16 10835 operations. V16 is less resolved at that work budget, particularly in tail/feather texture, despite its cleaner crown. Numerical error is higher in V16; the crown claim comes from actual support and visible comparisons, not lower error.

## Integration, validation and housekeeping

The studio has four explicit choices; V14 is default for new sessions, V16 remains experimental. Planner 16/material 2 provenance is exported. Immutable Paint binding, shared Continue/Resume/local/Undo, selector preservation, active-painting identification, imports independent of selection, timeline and full/current-frame exports remain shared. Only dispatch/default/metadata, the optional V15 adapter and required frontend/build integration change the existing sources; worker/material/lighting/analysis/objective/control code remain unchanged.

Six numerical groups pass, covering exact frozen V12/V14/V15 decisions/records and continuation/local work, deterministic V16, bounded validation, valid canonical replay, local/full scores including feathering, cancellation and exact Undo. Eleven maintained V7 regression groups pass through an adapter explicitly selecting V12 and redirecting outputs into V16. Thirty real Chrome groups pass for all four choices, session binding, pointer refinement, pause/resume/cancel/Undo, historical import/timeline, JSON provenance, actual 2× full PNG and current-frame PNG. Both standalone pages are regenerated. The portable package is checked by hashes and real Chrome after extraction: 134 resources and 67 images in each presentation. Current build/checks pass again after housekeeping. Git diff checks pass; only authorised integration, experimental and housekeeping changes occur inside stroke-master/.

Housekeeping is separate from the treatment. [housekeeping-summary.md](../artifacts/v16/housekeeping-summary.md) lists reclaimed space, archive provenance, active dependencies and restoration. Historical unique evidence, stroke records, frozen sources and runners are compressed with relative paths and verified by CRC plus every file's SHA-256 before removing originals. Only disposable profiles/incomplete downloads are directly deleted. Current planners, user assets, immutable dev-logs, V14/V15 galleries and active test/build fixtures remain available. Temporary outline-trace runners are separately archived; no runtime diagnostic hooks or abandoned V16 variants remain.

**Decision for review:** keep the justified crown correction visible as V16 experimental, but revise before any broader adoption. The remaining toe defect has a demonstrated compatibility-policy cause, and the validation cost needs future consideration. This iteration deliberately stops at one supported geometry remedy.
