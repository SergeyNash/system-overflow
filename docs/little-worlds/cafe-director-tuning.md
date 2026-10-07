# Café S01: director timing and job policy

Date: 2026-10-07. Status: first reproducible implementation baseline, subject to playable review. Owner-approved scope is [cafe-scenario.md](cafe-scenario.md); these numerical choices are engineering recommendations, not additional claimed owner approvals.

## 1. Parameters and initial scene

| Parameter | Baseline | Rule |
| --- | --- | --- |
| Tables | 3, one guest per table | No table-count upgrade in this slice |
| Entrance waiting slots | 6 | FIFO; a full queue makes subsequent arrivals visibly pass by |
| Pickup slots | 2 | Finished preparation waits at the kitchen if both slots are occupied |
| Candidate arrivals | First at 4 s, then 3.5–4.5 s apart | Seed 17; integer jitter; consume the same RNG draw even when admission is paused/full |
| Seating walk / ordering | 2 s / 1 s | Reserve the table before walking; request one order at ordering completion |
| Preparation | Slow 9 s, normal 6 s, fast 3 s for a new order | One cook, FIFO requests; no speculative food production |
| Delivery | 2 s outbound, 1 s transfer, 2 s return | Guest starts eating at transfer completion; worker remains busy through return |
| Eating / departure walk | 7 s / 2 s | Finish eating once, then walk out; no recurring meals |
| Cleanup | 2 s outbound, 1 s collection, 2 s return to disposal | Dirty plate remains until collection; table releases only after return/disposal |
| Helper arrival / departure | 2 s / 2 s | Capacity activates at arrival completion; capacity is unavailable during travel |
| Baseline controls | Normal kitchen, one server, admission on | Helper starts off |

Start with three seated guests whose orders are requested, empty pickup, empty entrance queue, clean occupied tables and server ready. This is an intentionally busy baseline with no hidden prehistory simulation. At the first tick the cook starts the oldest request. Reset restores these conditions and seed; preserve the user's pause preference.

These are stylized timings. Production path length and walking speed must fit the travel budgets without teleportation or table crossings; re-tune the common model and scenario if the accepted composition requires longer paths. The timing probe is not a browser animation specification.

## 2. Job allocation and transition order

Use the oldest eligible job across ready-dish delivery and dirty-table cleanup. Job eligibility starts when preparation enters pickup or when the departing guest reaches the exit. Break equal timestamps by visit ID. Staff picks a job only when idle; selection reserves it atomically. Dispatch the primary server first, then the optional helper. New work cannot overtake an older eligible job; the finite three-table system bounds work ahead without adding a hidden priority mode.

Cleanup starts after guest departure, never while a guest still occupies the chair. A cleaning table remains unavailable throughout outbound, collection and disposal. At collection completion, the plate changes from table-bound to carried. At disposal, the table becomes clean/free and the completed visit record can be released. Aggregate counts preserve accounting; do not retain unlimited customer histories.

Per fixed tick: apply validated commands → advance timed customer stages → advance staff phases/transfers → advance preparation/pickup → process candidate arrival → reserve clean tables FIFO → assign staff jobs → start the next preparation. Newly started tasks advance on the following tick. Multiple eligible events in one tick resolve deterministically in this order.

Keep customer, order, table and job states distinct in the production domain. The probe combines them into one visit record solely for a small reference calculation. IDs link a guest to their one order and table; staff never serves another guest's dish. A blocked completed preparation retains its dish/work rather than discarding it or starting a second order.

## 3. Actions, feedback and edge cases

| Target / command | Interaction and immediate feedback | Delayed consequence and limits |
| --- | --- | --- |
| Dial / `pace(0..2)` | Tap/click opens three native options; Enter/Space activates; show selected label and dial position | Apply the new rate to remaining work on the next tick, preserving completed progress. Faster cooking can change preparation within 3–9 s; delivery depends on staff availability |
| Apron / `helper(boolean)` | One tap/native button changes desired state; show `Помощник идёт`, `Помощник работает` or `Помощник заканчивает` as appropriate | Arrive after 2 s; accept tasks only when available. Release completes any current delivery/cleanup and return, then a 2 s departure; idle release departs immediately |
| Sign / `admission(boolean)` | Tap/native button toggles and displays `Принимаем гостей` / `Пауза приёма` | Change the next candidate arrival's behavior, within 4.5 s; accepted queued guests continue. New arrivals visibly pass by. Reopen waits for the existing arrival schedule |

During helper arrival, an off request lets the helper reach the endpoint and depart without taking a task. During departure, an on request finishes departure, then starts a fresh arrival. Repeated selection of the same desired state never restarts travel or creates another helper. Finish assigned tasks safely even if desired state changes several times.

One activation emits one command; native keyboard activation and pointer handlers must not submit duplicate commands. Use click/tap, no hold/drag gesture. Canceled gestures submit nothing. Invalid values do not mutate the model. Close the dial selector on Escape or outside activation; opening/closing it does not change pace.

While user-paused, do not accept world-changing commands; reset/navigation and focus remain available. Hidden tabs stop without catch-up. Reset clears pending inputs, effects and paths. During loading, show a visible loading/retry state, disable scene actions, and cancel old work on navigation; do not simulate invisible interactions. World lifecycle remains governed by the technical plan, not this probe.

## 4. First 30 seconds and attention

| Window | Actual baseline evidence | Attention / opportunities |
| --- | --- | --- |
| 0–4 s | Three seated guests wait; cook starts work; server has no dish yet; first newcomer approaches | Keep the dial visible beside the working cook; the apron and entrance sign remain discoverable |
| 4–10 s | Entrance starts filling; first dish is ready at 6.1 s, served at 9.1 s in the probe | Follow kitchen → pickup → aisle → table. A faster kitchen changes this chain; a helper can initially be idle |
| 10–20 s | Second dish is served at 15.1 s; first guest eats, leaves at 18.1 s; cleanup competes with delivery | Full/partial/empty plate and walking-out states explain why an empty table can still be unavailable |
| 20–30 s | First table is cleaned/reused at 23.1 s; third dish is delivered at 26.1 s; entrance queue reaches its bound | Follow empty plate → worker → disposal → seating. Choose helper, admission pause or another kitchen setting |

Probe timestamps have 100 ms granularity and are examples from ordinary rules, not triggers for prescribed animations. No-input life repeats complete visits. No compulsory first action, win state or theory overlay is introduced. A helper-first action can show unused capacity until work appears; do not manufacture a benefit.

Composition relationships for both viewports: entrance/queue → aisle → seats; kitchen → pickup → aisle service anchors; dirty table → aisle → disposal. Keep all three action targets clear of those paths. Author actual desktop/portrait anchor coordinates and furniture masks during V02/A02; do not reuse the study's table-crossing straight lines. Full/partial/empty food and dirty/clean table states must read without relying on color alone.

## 5. Reproducible causal traces

Run `node tools/cafe-scenario/probe.mjs`. [cafe-scenario-traces.md](cafe-scenario-traces.md) records the generated comparison. All cases use seed 17 for 180 simulated seconds:

- Baseline: no input.
- Kitchen-first: fast at 5 s, helper on at 20 s.
- Helper-first: helper on at 5 s, fast at 20 s.
- Fast-only / helper-only: that one action at 5 s.
- Admission-pause: stop new admissions at 30 s, reopen at 90 s.

Fast-only increases aggregate ready-dish waiting from 20 to 66 dish-seconds while leaving cleaned visits at 16. This is the intended local-improvement/global-limit branch. Both interventions yield 21 cleaned visits; helper-only yields 19. These counts measure this configuration and window, not general performance claims or visitor-visible scores.

Admission pause illustrates a different effect: at 60 s the queue is 3 instead of 6, and at 90 s it is 0 instead of 6. Accepted guests are still being served. After reopening, the 180 s totals match baseline: the buffer drains temporarily and fills again. Do not report a throughput gain or promise a lasting smaller queue. With admission kept off, the test confirms all accepted visits eventually finish and every table becomes free.

Tests also check helper release during delivery/cleanup, travel reversals, cooking-rate reversal, identical replay, invalid inputs and bounded state on every tick of 30-minute runs at all six pace/helper extremes, plus rapid command toggling. A reference-rule check is not evidence of browser input latency, frame interpolation, scene collision avoidance, accessibility or a visitor's understanding.

## 6. Handoff and remaining gates

S01 now has a reproducible numerical/job-policy baseline and first-visit direction. Transfer its state rules and causal tests into P01 after S02/A01–A03 establish the shared architecture. The probe is intentionally excluded from the visitor build and must not become the final world implementation by import.

Before a playable lifecycle slice is accepted: produce V02 customer/dish/cleanup/sign states; ratify actual paths and table masks; verify the full lifecycle and three controls in the view; measure response/viewport/accessibility/performance; record owner review and later P06 visitor observations. No final art, rendered scenario or visitor evidence is claimed here.
