# Little Worlds: Decision Log

## D003 — Renderer selection remains provisional

- Date: 2026-10-07.
- Status: pending actual-device review; no renderer ratification claimed.
- Candidates: Canvas 2D and PixiJS 8.21.0 with WebGL preference, through interchangeable draw adapters.
- Evidence available: [representative spike](renderer-spike.md), real café art/actor workload, continuous plant-state inset, geometry/picking tests and measured build sizes.
- Missing evidence: actual viewport/readability, initialization/interaction/frame behavior, filtering/layering, resource teardown and target-device load cost.
- Consequence: A03 world rules and lifecycle must depend on an adapter contract rather than either drawing library. Canvas is the review page's default, not the final renderer decision.
- Decision rule: compare actual device results with technical-plan budgets and record the rejected alternative and reason before treating A02 as passed.

## D002 — Complete café lifecycle and admission control

- Date: 2026-10-07.
- Status: accepted by the project owner in chat.
- Evidence: owner found iteration-0 graphics/movement satisfactory, reported server/table overlap and disappearing food, and explicitly accepted the proposed complete lifecycle and entrance-queue intervention.
- Choice: visitors arrive, queue, take a table, order, wait, eat, leave; serving staff cleans the dirty table before reuse. Food progresses to an empty plate instead of disappearing. Add the entrance sign alongside the kitchen dial and helper apron.
- Consequences: model separate customer/order/table states, finite waiting capacity, staff delivery/cleanup workload and aisle-based routes. Pausing admission affects future arrivals; already accepted guests continue.
- Specification: [cafe-scenario.md](cafe-scenario.md) is authoritative for this lifecycle scope and supersedes the motion study's repeated cycle and C01's two-action-only scope.
- Limits: iteration-0 art acceptance is not final visual/device validation. Timings, rates, job policy, complete S01 director specification and implementation remain pending.
- Revision trigger: causal traces or actual visitor review show unreadable consequences, unfair job allocation or an admission intervention without distinct exploration value.

## D001 — Pixel art direction

- Date: 2026-10-06.
- Status: selected by the project owner in chat.
- Problem: choose a consistent medium before production art and renderer decisions.
- Choice: direction A, warm 16-bit-inspired pixel dioramas.
- Evidence: owner explicitly preferred A after seeing matched pixel and illustrated café references.
- Alternatives: direction B, hand-drawn illustrated dioramas.
- Consequences: define a coherent pixel grid, sprite scale, filtering and animation rules; retain legible DOM typography. Simplify decoration and improve action-object affordances.
- Limits: preference establishes art direction, not visitor appeal, responsive readability, production cost, or performance. Static references are not a sprite atlas or playable prototype.
- Revision trigger: actual-size or motion tests fail readability, coherent assets cannot be produced economically, or the owner revises the choice with new evidence.
- Implementation detail: source-grid sizes and palette tokens in visual-language.md are provisional and require checks.
