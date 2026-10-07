# S01 reference calculation

Run `node tools/cafe-scenario/probe.mjs` for the comparison table and `node --test tools/cafe-scenario/probe.test.mjs` for scenario checks. No dependencies or browser are required.

This is an executable timing/job-policy probe, not the production model, renderer, shared world contract or motion study replacement. Do not import it into the visitor app. It uses 100 ms ticks and uniform aisle travel budgets; production uses the technical plan's fixed-step runtime and actual paths. Transfer the documented rules and causal checks to that implementation and compare with tolerances, not byte-identical probe timestamps.

The seed-17 LCG consumes one draw at every candidate arrival regardless of admission. Command ticks are applied before the next model step; equal-tick commands retain supplied order. Tables/jobs tie-break by stable IDs, primary server before helper. Integer work units avoid fractional progress drift. Terminal visit records are removed after cleanup; counters retain accounting; diagnostic events are capped at 160.

`probe.test.mjs` exercises complete visits/table reuse, admission drain/reopen, helper release during delivery/cleanup, helper travel reversals, replay/invalid input, preparation-rate reversal, causal comparisons, and per-tick bounds during 30-minute extremes/rapid toggles. These checks establish reference-rule behavior, not rendered movement, accessibility, device performance or production runtime correctness.
