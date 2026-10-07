# A02: representative renderer comparison

Date: 2026-10-07. Status: inspectable spike and automated geometry/build checks ready; actual browser/device evidence and renderer selection remain pending.

Open `/worlds/rendering/` through `npm run dev`, or through `npm run preview` after `npm run build`. This is a review/debug page, separate from `/worlds/motion/` and the future production `/worlds/` collection. It deliberately exposes renderer/layout/guide/measurement controls. Do not copy those controls into the visitor shell.

## What the spike exercises

- Identical ordered draw recipes on Canvas 2D and PixiJS 8.21.0/WebGL preference. Generated café background and cropped character atlases are real study assets, not an empty-canvas benchmark.
- Animated carrying/returning staff, optional second actor, cook/guest poses and a code-native pixel plant inset driven by the S02 response equations. This inset is a state-change probe, not finished greenhouse art.
- Desktop and explicitly recomposed portrait layouts, logical resolution 1, nearest filtering, CSS pixelated scaling and pointer target conversion. Native DOM action equivalents remain available.
- Conservative table-top masks and authored polylines. Arc-length traversal avoids the study's straight-line crossings. Body bounds are checked along every path in both layouts. These masks do not yet represent all chairs/walls/door collisions or a full physical navigation system.
- Async Pixi initialization, a private stopped ticker and external rendering; one rAF owner advances the probe at 60 Hz. Hidden tabs stop without catch-up; user pause is retained. Resize keeps probe state. Switch/retry disposes the old adapter; generation guards discard stale async initialization.
- Reusable Pixi sprites/cropped textures, explicitly owned image sources and disposal. Canvas releases its canvas; Pixi destroys stage/pool/textures/sources without destroying shared white textures.
- Visible asset/renderer failures and retry/Canvas selection, bounded rolling telemetry and copyable device evidence. No automatic fallback silently labels a Canvas result as WebGL.

Kitchen pace only changes cook pose cadence here; the helper only changes actor count. Staff routes are an autonomous visual cycle. The full café customer/order/cleanup model is not connected. Plant watering uses a small typed visual probe with continuous state; it is not the final world API. Neither demonstration claims completion of P01/P02/P04.

## Measurements and limits

The page reports renderer/layout, viewport/user agent, device pixel ratio, logical resolution, initialization time, draw recipe count, frame-interval p50/p95, CPU render-call p50/p95 and input-to-render-call p95. Samples retain at most 600 frames or inputs. Frame intervals exclude the initial one-second warm-up and paused/hidden periods. Measurements reset on renderer/layout changes and hidden-tab transitions.

These are client measurements when someone actually runs the page, not stored test results. Render-call duration is not GPU completion or input-to-visible-paint latency. Initialization includes first image loading when uncached, and therefore must be compared with explicitly recorded warm/cold conditions. User agent/viewport alone do not identify a physical device reliably; record device/browser separately during review.

Current build emits about 13.35 kB (6.40 kB gzip) for the spike entry and 516,034 bytes (151,829 bytes gzip) across all emitted asset JS chunks, including lazy Pixi platform/backend modules. Those totals are packaging cost, not a measured network waterfall. Canvas is the initial selection; Pixi is dynamically imported on selection. Runtime art remains 2,471,802 bytes lossless WebP before transport compression. Check network/load cost on actual target devices before ratifying a renderer.

No browser, device, screenshot, GPU/frame-rate, memory-leak or accessibility acceptance is claimed. The current managed Sites environment lacks the required control-browser capability; no preview server, browser installation or alternate browser-control path was used. Geometry tests cannot establish visual correctness of manually registered atlases or subjective readability.

## Device review procedure

1. Run the built page on a desktop browser and a real target phone. Record device/OS/browser, cold/warm loading, viewport and zoom.
2. For each renderer/layout, wait at least 10 seconds, enable the helper, change kitchen pace and water the plant. Copy measurements after another 20 seconds. Repeat without guide overlays.
3. Inspect sprite registration, nearest filtering at actual CSS scaling, foreground layering, target size/focus, table-edge approaches and portrait aisle readability. Pixel jitter/fractional scaling remains a potential finding, not accepted by a mathematical path check.
4. Resize/rotate, pause/resume, hide/return, switch renderer repeatedly, use retry, navigate away/back and test reduced motion/keyboard operation. Record blank canvases, new background loops or resource failures.
5. Exercise a failed WebGL initialization and missing asset in a permitted test environment. Confirm readable error/retry and Canvas availability.
6. Compare bundle/load cost, interaction responsiveness and stability against technical-plan budgets. Append observed values and findings, then select the renderer in D003. Do not fabricate observations or silently close A02 because the build passes.

## Handoff

Automated evidence: strict typecheck; same-recipe adapters build; tests for all sampled body/table intersections, path traversal and CSS coordinate conversion; existing route/model/reference checks; byte-identical legacy output; three WebP headers; spike HTML/module output. Device review remains the A02 gate before final renderer ratification.

A03 can define renderer-independent world/clock/lifecycle contracts using these two adapters and S01/S02 domains while keeping renderer choice explicitly provisional. Replace this visual probe with domain projections during P02/P04. Preserve the original motion study until final migration is justified.

Primary API references: [Application](https://pixijs.com/8.x/guides/components/application), [Ticker plugin](https://pixijs.com/8.x/guides/components/application/ticker-plugin), [Textures](https://pixijs.com/8.x/guides/components/textures).
