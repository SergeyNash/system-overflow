# S02 reference calculation

Run `node tools/greenhouse-scenario/probe.mjs` for the scenario tables and `node --test tools/greenhouse-scenario/probe.test.mjs` for checks. No dependencies or browser required.

This is a stylized continuous-response probe, not a botanical simulation, production world model or rendered fragment. Do not import it into the visitor build. Transfer the documented rules into the shared typed world architecture after A01–A03; compare causal behavior and timings with tolerances, rather than copying 100 ms probe timestamps.

The deterministic model has no randomness or seed requirement. Commands at a tick apply in supplied order before the next step. Moisture loss, root response and leaf response then update in that order using explicit Euler steps. Time is model time, never wall time. Active state has constant size; diagnostic water events cap at 100, with cumulative accounting counters retained separately.

Tests check immediate soil/delayed leaves, useful response latency, excessive doses, overflow/accounting, gradual recovery, replay/invalid inputs, continuous suitability boundaries and per-tick bounds on four 30-minute input regimes. These do not verify rendered state readability, browser input handling, accessibility, numerical equivalence of the future runtime, or visitor understanding.
