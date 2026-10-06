# Little Worlds: Experience Concept

Date: 2026-10-06. Work package: C01. Status: proposed concept specification, ready for review; experience validation is pending.

Scope sources: [roadmap](../little-worlds-roadmap.md) and [technical implementation plan](technical-implementation-plan.md). Baseline: `a38dc4977bdf6b5a998c95064eabf0d87328ea7c`.

## 1. Promise and visitor

Little worlds live on their own. Touch something, watch what changes, and try a different intervention.

The initial visitor arrives from a shared link out of curiosity. They do not need to know systems terminology or intend to complete a lesson. The value hypothesis is a brief, enjoyable opportunity to influence a small scene and discover an unexpected but understandable connection. The intended evidence is voluntary exploration and a visitor's own causal explanation, not just clicks or time spent.

The prior abstract prototype disappointed the project owner. That is direct feedback about this project's previous presentation, not a user study proving which new style or mechanic will succeed. The small-world direction is selected; café, specific controls, timing, and composition below remain implementation recommendations to test.

## 2. Decisions for the first design cycle

| Topic | Proposed decision | Reason / verification |
| --- | --- | --- |
| Entry | Open directly into a living café after loading | Let visitors see the experience before making a choice; test unaided discovery |
| Collection | Café and greenhouse in the first validated collection | Contrast queues with delayed/cumulative response; validate both |
| Scene | Angled 2D diorama with clearly separated preparation, pickup, and guest areas | Follow a visible order through the scene; check real-size layouts at V01 |
| Main interface | Interact with objects in the scene; concise equivalent DOM actions | Preserve scene space and accessible operation |
| Prototype actions | Kitchen pace dial and an additional serving helper | Two different constraints, immediate physical feedback, later effects |
| Repetition | Bounded settings, reversible changes, same-seed reset | Compare sequences without an endless upgrade ladder |
| Navigation | World names/thumbnails remain accessible while a scene runs | The next world is available without a completion requirement |
| Return | Switching away discards that world's run; returning restarts its baseline | Simple, predictable comparison; disclose this behavior before switching |
| Background tab | Stop without catch-up; retain an existing user pause | No unexplained change while the visitor is absent |
| Presentation | Russian visitor-facing copy; English technical artifacts | Match the existing audience and agent handoff requirements |

These are recommendations adopted for downstream design work, not claims of user approval or validated appeal. Pixel versus illustrated art remains open until V01. The renderer remains open until A02. Rates, numerical limits, asset counts, and exact gestures belong to later specifications.

## 3. The café as a place

A compact café contains an entrance/waiting area, a visible kitchen, a pickup counter, and a small set of guest tables. Orders visibly move from preparation to the counter to guests. Staff have readable work and waiting poses; customers sit, look toward their order, receive a dish, and leave. Small background motions make the place feel alive, but cannot obscure the order path.

The central visual question is: **why is that guest still waiting when someone else seems busy or dishes are already ready?** A visitor does not need to see a flow graph, capacity label, or success target to investigate it.

The starting situation has a visible preparation backlog and some serving headroom. A suitable seeded configuration should make the effect of increasing kitchen pace observable and, for a stronger intervention, make the pickup counter accumulate orders. This must emerge from service rates and buffers. It is a scenario to tune and verify, not a promise that every action sequence moves a bottleneck.

### Proposed intervention objects

| Object | Visitor action | Immediate confirmation | Model-dependent consequence | Reversal / limit |
| --- | --- | --- | --- | --- |
| Kitchen pace dial | Tap to open a compact selector; choose one of three named settings | Dial moves and kitchen adopts the accepted work pose | Preparation progresses at the new rate; pickup work may grow | Select a lower setting; show current choice; selecting it again has no extra effect |
| Helper's apron at the counter | Tap to call or release an additional serving helper | Apron/target acknowledges; helper visibly arrives or finishes departure | Serving capacity changes once the helper is actually available | One optional helper; no additional hire on repeated taps |

Candidate dial labels: `Спокойно`, `Обычно`, `Быстро`. The baseline setting and rates are selected at S01. Each setting must have an identifiable position or pose; an unlabeled color alone is insufficient.

The helper has a physical arrival path. Their capacity activates upon arrival. On release, a current delivery completes before the helper becomes unavailable and leaves. An in-progress order must not vanish. S01 must settle repeated toggles during arrival/departure, with state-based availability and clear feedback.

Two actions are sufficient for the representative prototype. An entry/demand control is a possible third action only if S01 shows a distinct exploration opportunity. Adding more controls is not a substitute for making these two worthwhile.

## 4. First visit: a concrete 30-second hypothesis

The following describes time after the café becomes interactive. Asset loading has its own visible status. Timing windows are tuning goals; they are not timed triggers that manufacture consequences. If the visitor does nothing, the scene continues normally.

| Window | What the visitor sees | Opportunity / expected action | What can be learned |
| --- | --- | --- | --- |
| 0–3 s | A guest waits; a cook works; a prepared order is carried through the scene. The kitchen dial is legible and the world name is small but visible. | Observe movement without a start button or introduction | This is a living place that can be explored |
| 3–10 s | The backlog remains visible. Pointer focus or touch selection highlights the dial. A small, non-repeating affordance may draw attention to its shape. | Open the dial and choose a faster setting; alternatively inspect the helper | An object is actionable and the world acknowledges the change |
| 10–20 s | Cooking visibly responds. Some prepared dishes arrive sooner and guests receive them; pickup may begin filling if the chosen pace exceeds serving capacity. | Follow the order movement; try another setting or watch | A change has consequences beyond the touched object |
| 20–30 s | More dishes can be ready while guests still wait. The counter/helper target is readable beside the accumulation. | Call the helper, lower kitchen pace, or reset and compare | Improving one part does not guarantee all waiting disappears |

The first action is an opportunity, not an onboarding requirement. A visitor who calls the helper first should see its actual use or unused capacity. Do not secretly change rates so every action looks effective.

Immediate action feedback occurs within the input-latency budget in the technical plan. A meaningful consequence should be possible within approximately 5–15 seconds of a useful intervention. S01 must test this window under the selected seed/rates. If the model takes too long, tune the stylized world pacing rather than announce an outcome before it exists.

### First-screen copy

Candidate world title: `Маленькое кафе`.

Candidate short invitation: `Попробуй что-нибудь изменить.` It may appear unobtrusively once and can be omitted if the objects communicate action on their own. Do not overlay instructions on the guest/order path.

Primary shared controls: `Пауза`, `Продолжить`, `Сначала`, `Миры`. Optional explanation entry: `Что здесь происходит?`.

The optional explanation should describe something already visible. Example after actual pickup accumulation: `Блюда готовы, но их ещё нужно разнести.` Do not say this on a timer when the counter is empty, or prescribe the next action as the correct answer.

## 5. Why someone would intervene again

The second intervention must have a reason inside the scene:

1. A ready dish waits at pickup while a guest still looks toward the kitchen. The visitor may call the helper.
2. The helper waits with nothing to carry. The visitor may speed preparation or release the helper.
3. A strong kitchen setting produces more pickup accumulation than a moderate one. The visitor may reduce pace and compare.
4. Reset returns the same starting conditions, allowing the visitor to try helper-first versus kitchen-first.

These are counterfactual branches, not a compulsory sequence. Each should remain possible through model rules. The café does not end with a score, a correct-answer banner, or an unlock. A comfortable rhythm, an intentionally busy scene, and observation without improvement are all allowed outcomes.

Pleasure should come from readable small motions, responsive objects, recognizable guest/staff reactions, and changes in the scene's rhythm. Decorative celebrations, achievements, currency, or an infinite capacity ladder are outside this version.

## 6. Observation, long visits, and limits

Without input, arrivals, preparation, and deliveries continue within finite admission and buffer limits. The scene must not become blank, pile up an unlimited number of customers, or collapse into overlapping sprites. S01 defines waiting/admission policy and the domain model implements it visibly.

Long visits retain ongoing variations in arrivals and work through the seeded rules. Characters can have decorative pose variations, but their essential waiting/working/completion states come from the model. There is no hidden difficulty ramp or forced crisis added to keep engagement high.

At a maximum setting, the control shows the current limit. Repeated selection provides restrained acknowledgement without issuing an extra upgrade. An intervention may provide no improvement when another part limits the process; show waiting or idle capacity rather than artificial progress.

Pause freezes model-related movement, not navigation or keyboard focus. World-changing actions are unavailable while paused with an understandable reason. Reset is always available. Reduced motion suppresses decorative flourishes while preserving readable state changes. Muting never hides essential information.

## 7. Collection, navigation, and session behavior

On the prototype route `/worlds/`, the default is café; `/worlds/#greenhouse` opens greenhouse directly when available. In the finished collection, world navigation is compact and persistent. It must remain available on narrow layouts without overlaying critical scene targets.

During the prototype, the greenhouse is a minimal technical/experience fragment and must be labeled honestly where exposed for review. Do not present it as a finished second world. A planned intersection is omitted from visitor navigation until playable; visitors do not need disabled future content cards.

| Situation | Defined behavior |
| --- | --- |
| First visit without a world hash | Load standard café seed and begin its autonomous life |
| Direct link to a valid world | Load that world's standard baseline |
| Unknown world identifier | Fall back to café with a brief readable notice; avoid a blank page |
| User pause | Retain state; display `Продолжить`; disable world-changing actions |
| Hidden tab | Freeze; on return resume only if the user did not pause |
| Reset | Same seed/config and settings; clear gestures, queues of commands, and old effects; preserve existing user pause |
| Switch world | Cancel/dispose departing run; start destination baseline; preserve the shared user-pause preference |
| Return to a previously visited world | Start baseline; do not simulate elapsed time or restore an unfinished run |
| Reload / new browser visit | Start baseline; no simulation progress is stored |
| Failed critical asset load | Show error and retry; never leave invisible active targets |

Use a short navigation note such as `При переходе мир начнётся сначала.` where the reset-on-switch behavior is discoverable. Do not add a confirmation modal on every transition. Audio and motion preferences may persist locally; inability to store preferences must not block the experience.

## 8. Greenhouse: a distinct reason to explore

The greenhouse should feel like tending a small place that responds slowly. A dry plant and visible soil invite a watering intervention. Water/soil responds immediately; plant posture or growth responds later. Repeated watering before that response may accumulate too much moisture and produce visible stress if supported by the model.

Prototype: one bounded watering action and an observable response delay through the same runtime. The precise dose, baseline soil condition, environmental losses, response equation, and delay are S02 decisions. A prototype target is a readable plant response roughly 8–20 seconds after a useful dose, subject to model tuning; no instantaneous recovery animation substitutes for it.

Finished-world candidates add light or ventilation only when each creates a different causal experiment. The scene must offer something worth noticing during the wait: soil changing, water settling, or plant state cues. Rapid taps must not be treated as evidence of successful exploration.

Café asks what limits delivery now; greenhouse asks how accumulated influence and delayed response change the result. This contrast is the reason for the second world. Neither world needs theory text as an entry requirement.

## 9. Scope and exclusions

The representative prototype contains café with two actions, selected-style key art and animations, pause/reset/navigation, accessible action equivalents, and a minimal greenhouse. It remains a prototype until the technical checks and actual visitor observations pass.

The first complete release contains a finished café, a validated and finished second world, coherent navigation, loading/retry, responsive compositions, and optional concise explanations. The intersection requires a later independent decision.

No accounts, backend, rankings, payments, virtual economy, editor, progress storage, forced curriculum, analytics platform, or automatic release schedule. No timer announcing an outcome that did not occur. No parameter dashboard as the first screen.

## 10. Hypotheses and next evidence

| Uncertainty | Next check | Failure response |
| --- | --- | --- |
| Action objects are discoverable | V01 real-size compositions, then unaided P06 observation | Change silhouettes, location, target feedback, or gesture |
| The kitchen-to-pickup chain is understandable | S01 causal traces and P06 explanation in visitor's own words | Change order representation, timing, or composition |
| The scene invites a second intentional action | Representative P03 interaction and P06 observation | Revise consequential states and reasons to intervene |
| Pixel or illustrated direction reads better | Matched café states at V01 on wide/narrow screens | Rework composition before mass asset production |
| Two controls provide enough exploration | Counterfactual S01 scenarios and observation | Improve reversals/limits first; add a third action only for distinct value |
| Reset-on-switch feels predictable | Navigation review and prototype sessions | Improve disclosure or explicitly revise session policy |
| Greenhouse delay is noticeable rather than dull | S02 timing, P04 fragment, actual observation | Improve visible intermediate signals and pacing without faking recovery |
| Core supports both domains | A03 contract review and P04 integration | Revise architecture before expanding content |

P06 retains the roadmap thresholds: 4/5 visitors discover an action unaided, 3/5 make a second intentional intervention, and 3/5 relate one consequence to their action. These are qualitative iteration criteria, not market or retention proof. All observations are pending. Agent reviews cannot replace real visitor sessions.

## 11. C01 acceptance and handoff

| Required outcome | Where specified | Current evidence |
| --- | --- | --- |
| Concrete first 30 seconds | Section 4 | Written proposal; interaction not implemented |
| First action and feedback | Sections 3–4 | Two object/action recommendations; gesture design pending S01 |
| Reason for subsequent intervention | Section 5 | Four causal branches; domain verification pending |
| Observation, reset, departure, return | Sections 6–7 | Explicit behavior to carry into lifecycle specification |
| Collection structure and first release | Sections 7–9 | Café-first, two-world release, deferred intersection |
| Scope and open hypotheses | Sections 9–10 | Boundaries and evidence plan stated |

C01 produces a reviewable concept specification. It does not validate appeal or complete implementation. Next assignment: **V01**, matched pixel and illustrated café reference scenes using the same layout, actors, action targets, and waiting/pickup situation. Show both styles at realistic wide and narrow sizes before choosing one. Use this scene/action proposal as a common comparison basis; record any necessary revisions instead of silently changing the experience.
