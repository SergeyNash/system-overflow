# Greenhouse S02: accumulated watering and delayed response

Date: 2026-10-07. Status: reproducible engineering baseline for the second world; playable/visual review and visitor evidence remain pending. Scope follows [concept](concept.md) and [technical plan](technical-implementation-plan.md). The owner selected the little-world direction; this document does not claim separate approval of these coefficients or finished art.

## 1. Experience and distinction from café

A small greenhouse contains one visibly dry potted plant, a watering can and a readable patch of soil. The visitor can water it. Soil responds immediately; roots and leaf posture respond more slowly. Repeated watering before the leaves respond can accumulate too much moisture, causing later stress. Observe, wait, or reset and compare one dose with several.

The café concerns discrete customers, jobs and shared capacity. This world concerns continuous bounded state, accumulated input and response lag. Share clock, lifecycle, input/accessibility and renderer facilities; do not force either domain into the other's queue model.

One bounded watering action is sufficient for this fragment. No plant death, score, permanent damage, growth economy or compulsory success screen. The dry plant remains available for intervention on long visits. Light/temperature are fixed supportive scenery, not additional simulated controls in this slice.

## 2. Deterministic state and equations

All quantities are stylized normalized values, not horticultural units or biological predictions. No RNG is needed. Reset returns the same configuration.

| Quantity | Range / initial | Meaning |
| --- | --- | --- |
| `moisture` (m) | 0–1 / 0.20 | Soil moisture; drives immediate soil appearance |
| `root` (r) | 0–1 / 0.20 | Filtered root-zone response to soil moisture; hidden model variable |
| `posture` (p) | 0–1 / 0.20 | Continuous leaf lift; drives plant appearance |
| Water dose | 0.26 per accepted action | Fixed portion, no variable-duration pour |
| Evaporation | 0.003 per model second | Bounded loss; soil cannot go below zero |
| Root / posture time constants | 6 s / 8 s | Two response lags; never use a timer-triggered recovery animation |

On accepted `water`: add `min(0.26, 1-m)` to moisture; the remainder is runoff. Neither roots nor leaves change at command time. Multiple accepted commands accumulate in sequence, including within one tick; saturation produces overflow rather than unlimited stored water or future queued pours.

Each model step of duration `dt`:

1. `loss = min(m, 0.003*dt)`; `m = clamp(m-loss, 0, 1)`.
2. `r = clamp(r + (m-r)*dt/6, 0, 1)`.
3. `p = clamp(p + (S(r)-p)*dt/8, 0, 1)`.

Suitability `S(r)` is continuous:

| Root range | Target leaf posture |
| --- | --- |
| `r <= 0.25` | `0.20` |
| `0.25 < r < 0.40` | `0.20 + 0.80*(r-0.25)/0.15` |
| `0.40 <= r <= 0.65` | `1.00` |
| `r > 0.65` | `1.00 - 0.85*(r-0.65)/0.35` |

The 100 ms reference calculation uses explicit Euler updates in the listed order. The production fixed-step runtime should reproduce causal behavior and approximate timing at its chosen quantum. Check timestep convergence during P04 rather than treating probe snapshots as exact production timestamps. Maintain water balance `initial + doses = current moisture + evaporation + runoff`, within numerical tolerance.

## 3. Action and shared lifecycle

Target: watering can beside the pot. One click/tap or native keyboard Enter/Space on `Полить` emits one `water` command. No drag/hold gesture, cost or arbitrary cooldown. Show accepted feedback within the technical plan's input budget: a restrained can/pour acknowledgement and actual soil/runoff change. A decorative pour must not deliver water a second time when it completes.

Repeated taps do not mean repeated success. At saturation, the soil cannot darken further; overflow visibly drains at the pot edge. Use bounded/coalesced effects rather than one persistent animation object per click. Audio may accompany pouring but conveys no essential information. Reject invalid payloads without mutation and suppress duplicate pointer/native-click submission.

While user-paused, disable world-changing input with a clear reason. Pause freezes moisture loss and both response lags. Hidden tabs stop without catch-up. Reset clears state, commands, water feedback and paths, preserving user pause. Switching away disposes the run; returning starts the standard baseline. During loading or failed assets, disable actions and show retry; never accept invisible pours. These are shared runtime rules, not handled by the headless probe.

Reversal means withholding further doses while evaporation gradually reduces excess moisture. Do not offer instant undo/drain in this fragment. Reset provides a separate same-baseline comparison. The long recovery after excess is part of accumulated influence, but the visitor can always reset or switch worlds.

## 4. State-to-visual mapping

| Signal | Model source | Presentation |
| --- | --- | --- |
| Dry/moist/wet soil | `m < 0.30`, `0.30 <= m <= 0.80`, `m > 0.80` | Dry cracks, moist texture, saturated sheen; not color alone |
| Drooping/lifting/upright leaves | `p < 0.40`, `0.40 <= p < 0.70`, `p >= 0.70` | Distinct leaf silhouettes; interpolate posture using p in normal motion |
| Dry/wet stress context | `r < 0.30` / `r > 0.80` | Droop is read alongside dry or saturated soil; do not show a hidden-variable gauge |
| Accepted water / overflow | Command event with absorbed/overflow amounts | Immediate can feedback; soil changes or finite runoff at saturation |
| No immediate leaf change | Root/posture dynamics | Leaves retain their current pose; avoid fake instant improvement |

Discrete art frames must project the continuous posture, not start independent success/failure loops. Default projection thresholds are provisional and need actual-size review. Reduced motion uses stable posture/state changes and soil textures without pour particles or leaf flutter. Muted audio preserves every causal signal. Keep native DOM typography readable; no numerical parameter dashboard on entry.

Composition: plant/soil form the focal group, can is a distinct adjacent action object, and drainage stays visible at the pot base. Keep shared pause/reset/world navigation clear of the pot on portrait and desktop layouts. Assets needed: dry/moist/wet soil, at least three leaf silhouettes or a coherent continuous rig, can/action states and overflow. Pixel medium follows D001; exact coordinates/frame registration remain V02 work.

Optional Russian title: `Маленькая теплица`; optional invitation: `Полей и посмотри, что изменится.` Explanation is optional and condition-driven. For example, `Почва уже влажная. Листьям нужно время.` requires an actual wetting event and an unrecovered plant; `Воды накопилось слишком много.` requires wet stress. Do not announce recovery/stress solely because a fixed interval elapsed.

## 5. First visit and counterfactuals

| Window after loading | No-input / intervention evidence | Opportunity |
| --- | --- | --- |
| 0–5 s | Dry soil and drooping plant remain stable; can is legible | Observe or water without a start screen |
| Immediately after a dose at 5 s | Moisture rises from about 0.185 to 0.445; leaves stay at 0.20 | Notice immediate soil change without inferring completed recovery |
| 5–15 s after that dose | Root response accumulates; plant crosses posture 0.55 at total 15.3 s and upright 0.70 at 19.0 s | Wait and watch leaf lifting instead of tapping repeatedly |
| Further observation | One dose produces posture about 0.889 at total 30 s; three doses at 5/6/7 s produce wet stress and posture about 0.471 at 30 s | Reset and compare one dose with repeated correction |

These timestamps come from ordinary dynamics in the [reference traces](greenhouse-scenario-traces.md), not prescribed animation cues. Repeated doses can initially improve posture before the filtered root response reaches excess; the later decline is the useful counterfactual. After a single dose, evaporation eventually returns the plant to dryness; ongoing care is possible without an endless upgrade ladder.

Scenarios: no input; one dose at 5 s; three doses at 5/6/7 s; 30 rapid doses starting at 5 s; doses 60 s apart; and withholding further water after excess. Sixty-second intervals are a comparison input, not a recommended recipe: input rate can exceed evaporation and eventually accumulate excess.

## 6. Evidence, acceptance and handoff

Run `node tools/greenhouse-scenario/probe.mjs` and `node --test tools/greenhouse-scenario/probe.test.mjs`. The dependency-free probe is a calculation tool excluded from the visitor build; do not import it into the production world. It has constant-size active state and bounded diagnostic history.

Reference checks establish immediate soil versus delayed plant response, useful lift within the concept's 8–20 s window after watering, accumulation/excess, runoff conservation, gradual recovery, continuous suitability, reset/replay and bounded 30-minute runs under no input, sparse doses, every-tick watering and same-tick spam. No botanical accuracy, rendered readability, browser latency or visitor understanding is implied.

P04 implementation acceptance additionally requires: production timestep convergence; rendering schedules cannot affect outcomes; shared pause/hidden/reset/disposal tests; action feedback and plant state map to actual events/projection; overflow does not create unbounded effects; dry versus wet stress is readable without sound or a gauge; portrait composition and keyboard access are reviewed. Actual P06 visitors must supply the causal-explanation evidence.

S02 has a reproducible scenario baseline. Next: A01 stack/toolchain, A02 representative renderer/device spike and A03 world contracts/clock/lifecycle, with V02 art production. Finished-world candidates include bounded light or ventilation only after each has a distinct causal chain and validated visual evidence; they are deferred, not exposed as disabled visitor controls.
