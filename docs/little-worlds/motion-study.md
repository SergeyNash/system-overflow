# Cafe Motion Study

Date: 2026-10-06. Status: runnable representative fragment; browser/device acceptance pending.

Source baseline: `c226b53f76f79f940fb0a02d8780cbd89e083677`. Follows owner-selected pixel direction A and the refined A2 scene. This is the next bounded V01/V02 preparation step, not the full cafe or final renderer decision.

## Review location

The source page is `worlds/motion/index.html`, served at `/worlds/motion/`. The existing root experiment remains intact. Build with `node build-static.mjs`; the build now includes the separate study page and cleans old output first.

## What to inspect

| Check | Expected behavior | Evidence status |
| --- | --- | --- |
| Character identity and frame alignment | Cook stays at stove; server/helper retain scale and foot registration | Assets inspected; animated browser check pending |
| Work and delivery | Orders appear at pickup; a carrying actor delivers then returns empty-handed | Model tests pass; visual coherence pending |
| Pace change | Faster preparation can produce pickup accumulation | Model tests pass |
| Helper | Arrives before handling work; completes an assigned delivery on release | Model tests pass |
| Pause/reset | Freeze cycle; reset returns baseline and retains user pause | Client implementation present; browser interaction pending |
| Background tab | No catch-up on return, user pause preserved | Client implementation present; browser interaction pending |
| Narrow layout | Rear kitchen/pickup above guest tables; reachable 44px controls | Explicit portrait layout present; device check pending |
| Reduced motion | Remove decorative steam/pose oscillation; still show domain movement | Client implementation present; browser check pending |
| Load failure | Clear error and retry, no invisible enabled controls | Client implementation present; fault-injection check pending |

No browser or screenshot infrastructure was improvised: the Sites managed workflow requires control-browser, which is unavailable in this session. No visual pass, measured frame rate, mobile readability, contrast pass or visitor observation is claimed.

## Automated evidence

`node --test worlds/motion/model.test.mjs flow-model.test.cjs`: eight tests pass. New checks cover conservation and finite queues, helper arrival/release, improved delivery with an additional server and identical deterministic model runs. Existing legacy checks still pass. `node --check worlds/motion/app.mjs` passes. Static build succeeds.

## Integration and known limits

The model is a deliberately small study with fixed guest destinations and repeat orders. It is separate from the future TypeScript/Vite/world contract. No backend/dependency framework, actual customer arrival model, scenario approval or collection navigation is introduced. The study should inform later art/interaction decisions, not silently become the final implementation.

Generated atlases are initial assets with manually registered crops, not a complete production sprite collection. Static guest poses and one helper carrying pose remain limitations. The apron/dial DOM graphics are placeholders for isolated production assets. Future work should validate source grid, refine motion, finalize S01/S02 and V02, then bootstrap A01–A03.

## Asset provenance and export

[Generation prompts](motion-art-prompts.md).

All three inputs were generated with built-in ImageGen using A2 as visual reference. Runtime WebP exports are lossless conversions using Sharp; no creative edits, rescaling or alpha removal occurred. The model renders actors separately from the generated empty room and uses a separate empty-hand walk atlas for returns. Image dimensions and alpha channels were inspected before import. Original generated PNGs remain in the generation workspace; runtime exports and prompts are the reusable repository deliverables.
