# Little Worlds: Selected Pixel Direction

Date: 2026-10-06. Packages: V01 refinement and V02 preparation.

Status: the owner selected direction A (pixel art) in the project chat. Refined composition A2 and a six-state reference sheet have been generated and shown in that chat. They are static visual references; motion, actual viewport readability, runtime assets and interaction are not yet validated.

Sources: [concept](concept.md) and [technical plan](technical-implementation-plan.md). Baseline: `e3b09aa1b20fc4283285654b5a0b351988d81efa`.

## 1. Selected direction and reference availability

Use a warm, readable, 16-bit-inspired pixel diorama. Retain cream/butter walls, teal furniture and aprons, terracotta floor accents, dark stepped outlines, and expressive compact characters. The owner explicitly preferred A over the illustrated alternative on 2026-10-06; this settles the medium, not every detail in the generated artwork.

Reference identifiers:

| Reference | Content | Availability |
| --- | --- | --- |
| A | Initial pixel café, wide and portrait | Generated image shown in the project chat |
| B | Matched illustrated café | Comparison only; not selected |
| A2 | Simplified selected scene, labeled pace dial and helper apron | Generated image shown in the project chat |
| Café states | Waiting, cooking, delivery, pickup accumulation, accepted action, pause | Generated image shown in the project chat |

Generation method: built-in ImageGen. No third-party input image was supplied; A2 derives from A, and the state reference derives from A2. Prompts are preserved in [visual-generation-prompts.md](visual-generation-prompts.md).

The PNG references have NOT been uploaded to this GitHub branch. Binary upload did not finish in the current workflow. This PR intentionally contains text specifications only, with no broken image links or claimed asset delivery. Before downstream agents produce art from scratch, supply the selected references as attachments or finish repository asset import. Generated images are not runtime sprites, and no sprite atlas is delivered by this change.

## 2. Composition and clutter reduction

Wide scene: rear kitchen, central pickup counter, foreground guest tables, entrance front-left. Portrait: kitchen at top, pickup/apron in the middle, tables below, entrance bottom-left. Preserve one cook, one regular server, three seated guests, one arriving guest, three queued dishes and the two action objects in both compositions.

A2 removes most decorative jars, hanging pans, rug patterns, small plants and busy surface textures. Keep broad readable shapes and a small number of subordinate plants. The kitchen-to-counter-to-guest causal path must be more prominent than decoration. Never hide an action target behind a plant, wall edge or actor.

The empty helper apron remains beside pickup, labeled `Помощник`. The physical kitchen dial is labeled `Темп кухни`. These labels are implementation copy, not text to bake into sprites. Use nearby DOM labels positioned with the scene transform and associated with actual accessible controls.

The reference dial uses flames as decoration; implementation must include three unambiguous notch positions and one pointer. Color and flame size alone cannot identify selected pace. The generated picture does not define the dial's final hit region or selector behavior.

## 3. Pixel grid, scale and camera

Proposed asset-grid baseline: 480 × 360 logical art pixels for the desktop composition, 240 × 400 for portrait; characters approximately 24–32 pixels high. These are starting constraints for the animation/renderer spike, not measurements extracted from the 1536 × 1024 reference PNGs.

Author assets on one agreed source grid. Avoid mixed pixel densities between characters, props and background. Render with nearest-neighbor filtering and prefer integer artwork scaling. If a viewport cannot fit an integer multiple, use scene framing, portrait recomposition, or surrounding space rather than arbitrarily shrinking the entire desktop scene. Typography remains independent DOM text at readable CSS sizes.

Use an elevated orthographic-like cutaway camera. Logical positions, navigation paths and portrait object transforms must be specified separately from the generated perspective. Do not infer walkable areas or hit targets from an illustration alone.

Test before ratification at 1440 × 900, 390 × 844 and 320-pixel width, plus short landscape and browser zoom. Actual viewport acceptance is still pending. A2's portrait illustration is not a responsive application test.

## 4. Layer and ownership rules

| Layer | Contains | Rule |
| --- | --- | --- |
| Rear environment | Walls, windows, fixed kitchen structure | No essential action text in textures |
| Floor | Tile surface and authored paths | Low-contrast pattern; paths need not be drawn |
| Furniture | Tables, stove, pickup, apron peg | Stable IDs and pivots; define occlusion boundaries |
| Actors / carried props | Cook, server, customers, optional helper, delivered dishes | Stable domain identity; explicit depth ordering |
| Causal state | Ready plates, tickets, meaningful work/wait poses | Driven by model projections |
| Input feedback | Focus brackets, accepted/rejected acknowledgment | Temporary; cannot complete an order |
| DOM shell | Copy, equivalent actions, pause/reset/navigation | Usable with keyboard and touch |

Produce environment and actors separately. A flattened complete café image cannot represent changing orders or staff. Texture ownership and disposal remain renderer/asset-manager concerns under the architecture contract.

## 5. State and animation specification

The state sheet establishes pose directions only. Production sequences need consistent pivots, grid and identity; the six vignette backgrounds are not assets to cut into animation frames.

| State | Visual signal | Candidate animation | Model / input condition |
| --- | --- | --- | --- |
| Waiting guest | Elbows on table, chin on hand, empty dish space | Two restrained poses, slow 1.5–2 s cycle | Guest is waiting for a dish |
| Cook working | Stirring/preparation pose, occasional steam | Four work frames, 0.8–1.2 s cycle | Preparation station has active work |
| Server carrying | Same dish visible in hands while walking | Four walk frames; model time sets travel duration | Assigned delivery and actual carried order |
| Pickup accumulation | Separate ready plates in explicit slots | Static placement; brief arrival settle | Ready orders awaiting valid transfer |
| Idle staff | Relaxed stance and empty hands | Two low-motion frames or static pose | No work available; do not fake productive work |
| Action accepted | Pointer/setting changes, short cream bracket | 120–200 ms acknowledgment | Accepted command; no imagined downstream outcome |
| Unavailable / paused action | Disabled DOM action, pause symbol and explanation | Static; no pulsing invitation | Paused lifecycle or action-specific constraint |
| Helper arriving / leaving | Same helper walking along an authored path | Shared walking vocabulary with distinct identity | Serving capacity activates/deactivates under scenario rules |

Durations and frame counts are proposed production defaults. Test them in a short representative animation before approving them. Faster kitchen pace changes meaningful preparation timing; decorative frame speed must not be used as the sole evidence of increased capacity.

The pause vignette applies to unavailable interaction, not a rule that every object becomes gray. Pause freezes model-related animation. Reduced motion removes steam, wobble and decorative pulses; waiting/working/ready/idle states remain distinguishable through static poses and objects.

## 6. Color, type and input feedback

Proposed tokens for implementation review: cream `#F4E7CD`, teal `#2B716B`, terracotta `#B96842`, outline `#302B26`, focus `#FFF1B8`. These are chosen approximations, not colors sampled or contrast-tested from the images. Validate contrast before using them for text or controls. Do not assume cream focus is sufficient against cream walls; add a contrasting dark edge.

Use a legible sans-serif for controls and labels. Decorative pixel typography is optional for a small title only; body/status/control text must remain readable and support zoom. Maintain at least 44 × 44 CSS-pixel target regions independently of art size. Hover is supplementary; focus and touch selection use the same target emphasis.

Show a restrained object bracket on focus/selection. The constant highlight in A2 is a visual-design reference, not an instruction to permanently glow both objects. Maintain quiet autonomous life before input.

## 7. Asset production handoff

Minimum separate exports after grid/animation acceptance:

- Café environment and furniture layers, wide/portrait layout data.
- Cook: idle and work; server: idle, walk and carry; guest: arrive, wait, receive/eat, exit.
- Optional helper: arrival, active delivery, idle and departure.
- Plates and stable dish variants; ticket representation and finite pickup slots.
- Pace dial base/pointer/three setting markers; helper apron/peg; focus feedback.
- Optional bounded steam and short acknowledgment effects.

Each export needs stable key, source grid, dimensions, pivot, animation frames/durations, layer, hit-region metadata where relevant, and provenance. Runtime labels remain DOM. One frame-grid proof should precede bulk asset generation. Confirm applicable generation-service usage terms at asset import; this document does not assert a specific license.

## 8. Remaining gate

Selected medium: complete. Refined composition and representative static state directions: produced for review. Remaining work:

1. Make selected reference images available to future implementing agents without relying on chat memory.
2. Ratify source grid and scene transforms using real-size layout checks.
3. Produce a short representative motion proof with stable pivots and readable action feedback.
4. Validate target/readability/contrast and reduced-motion states.
5. Complete V02 inventory and exports, and S01 causal timing without forcing model outcomes.

Do not mark all V01/V02 checks complete or start mass production on the basis of two static generated images. Renderer selection remains conditional on A02 evidence.
