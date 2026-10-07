# Café: accepted lifecycle and next iteration

Date: 2026-10-07. Work package: S01. Status: lifecycle and intervention scope accepted by the owner; numerical tuning, complete director specification and implementation remain pending.

This specification supersedes the repeated guest/order cycle in the [motion study PR #6](https://github.com/SergeyNash/system-overflow/pull/6). Read with [concept](concept.md), [technical plan](technical-implementation-plan.md) and [decision log](decisions.md). It does not mark S01 or the architecture gates complete.

## 1. Owner feedback and accepted scope

The owner accepts the graphics and movement as satisfactory for iteration 0. Two observed defects remain: servers overlap tables, and dishes disappear without a readable eating/cleanup sequence. Endless eating by the same seated guests is a temporary study behavior, not the intended café scenario.

Next, implement one complete customer lifecycle, with a visible entrance queue and admission control. Keep the selected warm pixel direction. Approval of iteration 0 does not establish browser/device QA, final sprite registration, performance or visitor validation.

## 2. Customer, order and table lifecycles

| Entity | State progression | Visible evidence |
| --- | --- | --- |
| Customer | Arriving → entrance queue → walking to reserved table → ordering/waiting → eating → leaving → exited | A customer arrives, waits outside, takes a seat, receives a specific order, eats and visibly walks out |
| Order | Requested → preparing → ready at pickup → carried → delivered → consumed | Preparation and delivery refer to the seated customer's order; no food is produced for absent customers |
| Table | Clean/free → reserved → occupied → dirty → cleaning → clean/free | Reservation prevents duplicate seating; an empty dirty table still cannot admit a guest |
| Dish | Full → partly eaten → leftovers/empty plate → carried away for cleanup | Food changes as eating progresses; the plate remains after departure until staff collects it |

Keep stable customer/order/table IDs. Store semantic states independently of animation positions. Eating finishes once per served customer, followed by departure; do not restart eating or generate a fresh order for that customer indefinitely. Reuse a character appearance only for a new customer ID after the previous visit ends.

A table becomes free only after both customer departure and completed cleanup. Cleanup belongs to the serving staff's finite workload alongside delivery. A worker cannot deliver and clean simultaneously. Food or a plate must never disappear merely because a render timer expires.

## 3. Entrance queue and admission

The entrance queue is part of the visible world. Reserve a clean free table for the first eligible queued customer before starting their seating walk. Seat customers in FIFO order. Use a finite waiting capacity; when it is full, new arrivals visibly pass by. Do not stack unlimited people or silently delete accepted customers.

The entrance sign has two Russian labels: `Принимаем гостей` and `Пауза приёма`. Pausing admission makes new arrivals pass by. Customers already in the entrance queue remain eligible for seating; customers inside continue through service, eating and departure. Admission pause does not freeze the simulation. Reopening admission affects subsequent arrivals and does not spawn an instant batch.

Queue capacity and arrival cadence are tuning parameters still to be chosen. For the next lifecycle slice, accepted customers do not abandon the queue or their orders. If patience/abandonment is added later, explicitly specify visible reasons, cancellation/accounting and handling of food already being prepared. Do not implement abandonment as silent deletion.

## 4. Three accepted interventions

| Target | Action and immediate feedback | Actual consequence | Limits and reversal |
| --- | --- | --- | --- |
| Kitchen dial | Choose `Спокойно`, `Обычно` or `Быстро`; dial position and cook pose acknowledge the setting | Preparation rate changes; pickup can accumulate if delivery is slower | Three bounded settings; reselecting the current setting adds no capacity; lowering pace is allowed |
| Helper apron | Call/release one helper; helper visibly arrives or completes departure | Delivery and cleanup capacity changes once the helper is available | One helper; release finishes the current task and returns/clears carried items before exit; never drop an order or plate |
| Entrance sign | Toggle `Принимаем гостей` / `Пауза приёма`; sign changes immediately | Future arrivals join the queue or pass by; already accepted work can drain | Binary reversible policy; does not increase kitchen, staff or table capacity |

Provide native keyboard-operable DOM equivalents with the same commands and current states. While user-paused, disable world-changing actions with a clear reason; retain reset/navigation. Hidden-tab suspension, same-seed reset and pause preservation follow the concept/runtime contract.

The exact policy for changing the rate of an in-progress preparation task and toggling a helper during arrival/departure remains an S01 tuning decision to document before implementation. Repeated input must remain idempotent and bounded.

## 5. Causality and exploration

Three interacting constraints shape the scene: kitchen preparation, staff delivery/cleanup, and usable tables. The entrance queue makes the downstream effects visible; admission is a demand intervention.

- Faster cooking may create ready dishes waiting at pickup while customers still wait for delivery.
- A helper may reduce delivery and dirty-table delays when there is relevant work; with little demand, the helper can be idle.
- Dirty tables can block seating even after customers have left, causing the entrance queue to persist.
- Pausing admission can let accepted work drain. A smaller queue alone is not proof of higher throughput: fewer guests were admitted.
- Slower cooking can reduce pickup accumulation while total service remains constrained elsewhere.

These consequences must emerge from actual rates, job allocation and buffers. Do not schedule a crisis, explanatory banner or bottleneck shift independently of model state. No score, compulsory correct sequence, currency or completion gate is introduced.

## 6. Movement, serving and dish readability

Author paths through walkable aisles for desktop and portrait layouts. Place service/cleanup anchors at table edges; never route an actor's floor anchor through a tabletop footprint. Sort occlusion using floor anchors and appropriate furniture layers. Test full sprite bounds, not just center points, so reaching and walking poses do not appear to stand on tables.

Guests walk from entrance to seats and back to the exit. Serving shows arrival at the correct table and transfer of its dish. Eating progress drives full/partial/empty plate states. Empty plates remain on dirty tables until a server reaches them, collects them and completes cleanup. Return poses must reflect whether a worker carries a dish, dirty plate or nothing.

Required art additions include arriving/queued/walking/leaving customer states, eating transitions, dish stages, dirty/clean table signals, plate-carrying cleanup poses and admission-sign states. Existing art is an iteration-0 reference, not evidence these states already exist.

## 7. Next implementation slice and acceptance

The next playable slice should complete arrival → queue → seating → order → preparation → delivery → eating → exit → cleanup → table reuse, with all three controls. Follow the technical plan's architecture gates; do not copy the study's cyclic model into the final world contract.

Before coding the model, finish S01 with explicit timings, arrival seed/cadence, queue/pickup capacities, staff job selection and starvation prevention, helper transitions, preparation-rate semantics and baseline/counterfactual traces. Timing values are not approved by this document. Keep meaningful effects readable within the concept's proposed observation windows and tune them from evidence.

Acceptance evidence for the slice:

- A no-input trace contains at least two distinct completed visits and reuse of a cleaned table; no customer eats indefinitely.
- Table reservation prevents simultaneous assignment. Dirty tables block seating until cleanup completes.
- Every dish belongs to an order/customer; every accepted customer has exactly one current lifecycle state. Terminal customers/orders are accounted for without unbounded retained history.
- Finite queue/pickup/table/worker limits hold under long runs and extreme permitted controls. No customer, dish or staff task silently vanishes.
- Admission pause preserves already accepted guests and work; new arrivals visibly pass by; reopening does not fabricate arrivals.
- Helper release during delivery or cleanup finishes that task safely. Tests cover reversals and repeated toggles.
- Model traces compare kitchen-first, helper-first and admission pause under the same seed; report observed consequences, including idle capacity and cases with no throughput improvement.
- Visual review checks walking/serving/cleanup paths and dish progression on desktop and portrait layouts. Owner feedback is recorded separately from automated model checks and actual visitor observation.

Iteration-0 visual acceptance is recorded. S01 numerical/director completion, V02 asset production, architecture validation, browser/device review and P06 visitor evidence remain open.
