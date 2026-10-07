# Little Worlds: Work Status

Updated: 2026-10-06. This file is the continuation point for work performed through the project chat. Read alongside the [roadmap](../little-worlds-roadmap.md) and [technical plan](technical-implementation-plan.md).

Latest continuation update: **2026-10-07 — S02 greenhouse response**, below. Earlier sections describe historical checkpoints.

## Current state

- Roadmap, technical plan and C01 concept are merged into `main` as of `e3b09aa1b20fc4283285654b5a0b351988d81efa`.
- The owner selected pixel direction A. See [decision D001](decisions.md) and [visual specification](visual-language.md).
- A2 simplifies the cafe and clarifies the two action objects. A six-state static reference has been generated and shown in chat.
- This change contains specifications and prompts only. Reference PNGs have not been uploaded to GitHub; asset import remains pending.
- Next: make references available to implementers, verify source grid/layout at actual sizes, produce a representative motion proof, then complete V02/S01.
- New app implementation, renderer validation, performance measurements and actual visitor observation remain pending.

## Working agreement for continuation

1. Check current `main`, open changes, and applicable repository instructions before each package. Do not rely solely on chat memory.
2. Take the next bounded package from the technical plan. Finish independent routine work without requiring the user to manage individual agent instructions.
3. Keep English specifications and Russian visitor-facing copy. Record assumptions and meaningful design changes.
4. Use a dedicated branch and reviewable PR. Provide a concise Russian explanation of the resulting behavior or decision, relevant evidence, and remaining limitations.
5. For visual or interaction work, provide inspectable reference images or a playable preview as appropriate. A code diff alone is insufficient evidence of the experience.
6. Keep the existing site working until the new fragment and release gates justify migration. Publishing requires the relevant hosting workflow; opening a documentation PR does not publish a site.
7. Update this status in each meaningful change. State artifact readiness separately from user decisions, measured quality, and visitor validation.

## Pending evidence and decisions

- Review of the proposed concept, especially first-visit appeal and the two intervention objects.
- Remaining V01 viewport/motion checks and V02 asset production; pixel medium is selected.
- S01/S02 full scenarios, pacing and domain coefficients.
- A02 renderer/device measurements and A03 ratified architecture.
- Prototype implementation, automated/manual checks, and five actual visitor observations.

No scheduled background work or autonomous work between chat turns is implied by this agreement.

## Accepted café scope — 2026-10-07

This update supersedes the older next-step notes above for café scope. The owner reviewed the published motion study from [PR #6](https://github.com/SergeyNash/system-overflow/pull/6) and accepted its graphics/movement for iteration 0. Server/table overlap and unreadable dish disappearance remain observed defects. PR #6 is still open at this update; this documentation PR is based on current `main` and does not duplicate its runtime files.

The owner accepted [D002](decisions.md) and [cafe-scenario.md](cafe-scenario.md): full visitor arrival/queue/service/eating/exit lifecycle, cleanup before table reuse, and a third intervention controlling admission. New arrivals pass by during admission pause; already accepted guests continue. Numerical timing and the complete director specification remain pending.

Next: complete S01 timing/job-policy/causal traces, V02 lifecycle assets and the required architecture gates, then implement a complete playable lifecycle slice. Fix paths through aisles and show eating/empty plates/cleanup. Greenhouse S02 and browser/device/performance/visitor evidence remain pending. Documentation acceptance does not mean these behaviors are already implemented or published.

## S01 director tuning — 2026-10-07

- Main baseline: `66498f3e666bf636489a7cd3f876edd7d7a196af`, after PR #7. PR #6 remains a separate pending motion-study change; no runtime study files are copied into this branch.
- [Director tuning](cafe-director-tuning.md) specifies numerical durations/capacities, seeded arrivals, FIFO delivery/cleanup allocation, helper reversals, cooking progress semantics, controls and first-30-second evidence.
- Dependency-free reference calculations in `tools/cafe-scenario/` reproduce [causal traces](cafe-scenario-traces.md). These are scenario evidence, not the final world model or a playable change.
- Checks cover full visits/cleanup, dish/customer accounting, admission drain/reopen, helper releases/reversals, repeated/invalid inputs, deterministic replay and 30-minute extremes/rapid toggles. No browser measurements or visitor evidence are implied.
- Next package: S02 greenhouse equations/timing and response trace, then A01–A03 shared architecture/renderer decisions alongside V02 lifecycle assets. Transfer the S01 rules into P01 only after those contracts exist. Playable café review remains required to ratify these initial timings.

## S02 greenhouse response — 2026-10-07

- Main baseline: `8bb0cd8f337dd467784e71fc37dbd3f124d1854a`, after PR #8.
- [Greenhouse scenario](greenhouse-scenario.md) defines one watering action, immediate soil change, two filtered response lags, accumulated excess, finite runoff, first-visit direction and state-to-visual mappings.
- `tools/greenhouse-scenario/` reproduces [response traces](greenhouse-scenario-traces.md) and checks one/repeated/rapid/spaced doses, recovery, deterministic replay and per-tick bounds/water accounting across 30-minute input regimes.
- These are stylized scenario calculations, not botanical predictions, production model contracts or website changes. Numeric tuning needs playable review. Art/device/accessibility/performance and visitor evidence remain pending.
- Next bounded work: A01 toolchain/bootstrap, then A02 representative rendering/viewport measurements and A03 shared clock/world/lifecycle contracts. Use café discrete jobs and greenhouse continuous lag as the two contract cases. V02 asset production remains parallel project work, without assuming it has already been done.
