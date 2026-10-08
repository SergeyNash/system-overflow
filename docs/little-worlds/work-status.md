# Current update — 2026-10-08

The user authorized retiring all old page content. The current café/plant rendering probe is now the root entry; retired executable files are excluded from publication and the old motion route redirects to root. Sources/tests remain for reference.

A03 has started with a shared fixed clock integrated into the probe. Full contracts, command ordering and replay remain pending; see [architecture](architecture.md). The user supplied positive Canvas portrait frame/CPU timings, documented there. Pixi comparison, production assets, complete café lifecycle and visitor evidence remain pending.

# Little Worlds: Work Status

**A02 preparation (2026-10-07):** [renderer comparison spike](renderer-spike.md) at `/worlds/rendering/` supports Canvas/Pixi, real café art, checked aisle paths, portrait composition, target picking and a plant response inset. Strict checks/build pass. Actual browser/device evidence and D003 renderer selection remain pending; this does not complete A02. Next: review this page, then implement renderer-independent A03 clock/world/lifecycle contracts with an explicitly provisional adapter choice.

**Latest reconciliation (2026-10-07):** motion-study PR #6 incorporates main `85be73eeb52d4179bbdf3b48b590b529c00ab937`, including S01/S02 and A01. The static build uses main's conditional world copy and test exclusions; the study assets/page remain available at `/worlds/motion/`. This resolves integration conflicts, not the reported table-path or dish-lifecycle defects. Owner visual acceptance remains iteration 0; browser/device evidence remains pending.

**Toolchain continuation (2026-10-07):** [A01 bootstrap](toolchain.md) adds pinned dependencies, strict TypeScript, Vite/Vitest, clean static output and CI. Next: A02 representative renderer checks, then A03 shared world/clock/lifecycle contracts. Earlier status sections below are historical checkpoints.

Updated: 2026-10-06. This file is the continuation point for work performed through the project chat. Read alongside the [roadmap](../little-worlds-roadmap.md) and [technical plan](technical-implementation-plan.md).

Latest continuation update: **2026-10-07 — S02 greenhouse response**, below. Earlier sections describe historical checkpoints.

## Current state

- Roadmap, C01 and selected pixel specification are merged as of `c226b53f76f79f940fb0a02d8780cbd89e083677`.
- A runnable [cafe motion study](motion-study.md) now lives at `worlds/motion/`, with generated environment/actor exports, a small order cycle and accessible DOM controls.
- Runtime art is imported in this change; original A/A2 comparison PNG upload remains separate and is not claimed complete.
- Model checks and static build pass. Browser/device QA remains unavailable/pending; no motion/viewport/contrast acceptance is claimed.
- Next: inspect the study, repair observed art/motion/layout issues, then complete V02/S01/S02 and the A01–A03 architecture gates.
- Full world models, greenhouse, collection release and actual visitor observation remain pending.

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
