# Architecture — incremental A03 implementation

Status: shared clock implemented; full world contract, command bridge, replay and registration remain pending. Renderer selection remains provisional pending comparison and device evidence.

`src/core/clock.ts` owns the renderer-independent 60 Hz quantum, integer tick, bounded catch-up (100 ms / six ticks), discarded-time diagnostics and fractional interpolation. It takes timestamps from the shell; it does not schedule frames, access the DOM or depend on a domain. Suspend clears timestamp/debt without changing world time. Reset also clears ticks/diagnostics. The rendering probe consumes this clock for both its café motion and plant equations.

`src/debug/rendering-spike.ts` currently owns DOM events, one animation-frame loop, pause, visibility, model fragment state and adapter disposal. This is transitional code, not the final world model/runtime. Renderer initialization, resizing, pause, hiding and reset suspend clock accumulation, avoiding catch-up jumps. Essential motion remains under reduced-motion settings.

`src/rendering/geometry.ts` owns layout coordinates and pointer conversion; `spike-adapter.ts` owns Canvas/Pixi resources. Neither owns model time. Runtime art is exported to `/assets/worlds/cafe/`; source art remains in its existing location until V02 formalizes manifests.

The next A03 slice must implement and test the typed WorldModel/command/event/action contract specified in the technical plan, shared command ordering and bounded replay diagnostics. Validate discrete café and continuous greenhouse implementations without adding either domain's fields to core. Do not declare A03 complete on the clock alone.

## Route migration authorized on 2026-10-08

The user requested removal of all old content from the page. This overrides the earlier instruction to preserve the legacy root until release. Root now builds the current probe; `/worlds/rendering/` is an equivalent entry and `/worlds/motion/` redirects to root. No legacy executable pages/scripts/styles ship in dist. This migration does not imply that the full café or release gate passed.

## Evidence

Clock tests cover equivalent tick sequences at 30/60/144 Hz, bounded overload, suspension, reset and invalid timestamps. Build verification checks compiled entries and excludes retired executable files. Browser QA is unavailable in this managed environment; actual device evidence for the previous Canvas portrait probe was supplied by the user (411×798, DPR 2.625, 600 samples, frame interval p50 16.7 ms / p95 16.8 ms, render-call p50 .2 ms / p95 .3 ms, initialization 264 ms). No input latency samples were recorded. These CPU timings do not establish GPU completion, full-world performance or renderer selection.
