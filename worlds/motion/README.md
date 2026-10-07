# Cafe motion study

A buildless, separate visual/motion proof at `/worlds/motion/`. It does not replace the existing root experiment or claim completion of V01, V02, A02 or P01.

Open through an HTTP server (ES modules), not `file://`. Build all pages with `node build-static.mjs`. Tests: `node --test worlds/motion/model.test.mjs flow-model.test.cjs`.

## What exists

- Generated environment and transparent actor exports, converted to lossless WebP without resizing/recoloring.
- Separate carrying and empty-hand return poses; manually authored atlas rectangles.
- Simple fixed-step order cycle, bounded pickup slots, three kitchen rates, helper arrival and completion-before-release.
- Pause/reset, hidden-tab stop without catch-up, keyboard-native DOM actions, reduced decorative motion, loading error/retry.
- Desktop and portrait canvas compositions; portrait reuses environment/furniture crops at explicit positions rather than merely shrinking desktop.

## Limits

This is a small reusable visual study, not the final typed world contract. It has cyclic guest targets, no arrivals/patience/admission policy, stylized service timings, authored paths, static guest poses and incomplete production frame registration. The helper currently has one carrying pose; complete production cycles are pending. Guest identities remain fixed; plates indicate actual delivery.

The physical apron and dial are DOM/CSS placeholders. Background contains furniture and light texture; it is not a production environment atlas. Source art grids have not been ratified. Canvas resizes follow media queries, and pixel filtering is disabled; fractional CSS display scaling still needs actual device review.

Shared clock/core integration, deterministic command replay, view interpolation, resource ownership and greenhouse integration belong to later architecture/prototype work. Do not copy this page wholesale into the final architecture.

Browser QA was unavailable in the current managed environment (no control-browser skill). Responsive layout, frame alignment, accessible operation, contrast, actual input latency and device performance are therefore unverified. The published page is for inspection; passing model tests does not validate the experience.

## Assets

`assets/environment.webp`: empty generated room. `assets/characters.webp`: initial working/carrying/guest atlas. `assets/return-poses.webp`: empty-hand server/helper walks. Original generated PNGs are 1536 × 1024; all runtime exports preserve those dimensions and use lossless WebP.

Prompts and provenance: `docs/little-worlds/motion-study.md`. The images were generated with built-in ImageGen; no external source was supplied. Generation-service usage terms should be reviewed at final asset production.
