# A01: toolchain bootstrap

Date: 2026-10-07. Baseline: `8bb0cd8f337dd467784e71fc37dbd3f124d1854a`. Status: local install/typecheck/test/build verified; remote CI and browser/renderer gates remain pending.

## Selected and pinned tools

| Tool | Pin | Responsibility |
| --- | --- | --- |
| Node | 24.19.0 (`.nvmrc`) | Matching local/CI runtime; package engines require Node 24.19+ within major 24 |
| npm | 11.9.0 (`packageManager`) | Committed lockfile; clean installation with `npm ci` |
| TypeScript | 6.0.2 | Strict checking, unchecked-index and optional-property checks |
| Vite | 8.3.3 | Development/production builds of new modules |
| Vitest | 5.0.3 | New TypeScript model/core/shell tests in Node |
| Node types | 24.10.1 | Configuration/script type support |

Compatibility checked against [Vite requirements](https://vite.dev/guide/), [Vitest requirements](https://vitest.dev/guide/) and [Node release information](https://nodejs.org/en/about/previous-releases). Installed package engines and resolved dependencies were also checked locally. These are explicit compatible pins, not a claim that every pin is the newest release. Change them deliberately with a refreshed lockfile and clean checks.

No UI framework, state-store package, ECS, worker or backend is added. PixiJS and Playwright remain A02 decisions/additions: the renderer must first be tested with actual scenes/devices, and browser checks require a real app entry. Do not mark those checks passed through this bootstrap.

## Clean-checkout commands

Use `nvm install` / `nvm use` or an equivalent Node version manager, then:

```sh
npm ci
npm run check
```

| Command | Current behavior |
| --- | --- |
| `npm run dev` | Vite on loopback, serving existing root files and TypeScript sources |
| `npm run typecheck` | `tsc --noEmit` over src and tool configs; bundling does not replace it |
| `npm test` | Vitest for src tests, then every repository `.test.cjs` / `.test.mjs` outside dependency/build/git directories |
| `npm run test:legacy` | Existing flow-model Node tests |
| `npm run validate:assets` | Checks WebP container headers if runtime art exists; prints actual count; production manifest/frame validation remains V02 |
| `npm run build` | Clean/copy static runtime files, compile typed navigation module, verify output |
| `npm run preview` | Vite serves the full production dist directory on loopback |
| `npm run check` | Typecheck → tests → asset-header check → build/output verification |

`test:e2e` is deliberately not exposed as a pretend passing command. Add pinned Playwright, production-build tests and the CI browser job in A02/P05 when the world entry exists. Browser installation/execution in a managed environment must follow that environment's permitted preview workflow. No server/browser was started for this package.

## Migration and output

The legacy root HTML/CSS/JS remain byte-identical in dist. `build-static.mjs` first clears stale output, then copies them and any existing worlds runtime directory, excluding study tests/README. Vite writes `dist/worlds/navigation.js` without clearing that prepared output. The old `node build-static.mjs` remains a legacy/static-only command; use `npm run build` for typed modules.

`src/shell/world-route.ts` implements the concept's supported world identifiers and unknown-hash fallback, with tests for default/direct/unknown routes. It is a pure module with no browser imports. This does not load or publish a world. No new visitor HTML, fake unavailable-world cards or disabled placeholder controls are added. A02/A03 will replace the single library build entry with actual multipage world entries while preserving legacy output.

Output checks require the navigation bundle, compare all four legacy root files byte-for-byte and reject leaked tests, Markdown or package metadata. Root `publicDir` copying is disabled. Scenario tools, docs, dependencies and TypeScript test sources stay outside the visitor output.

## CI and evidence

`.github/workflows/check.yml` performs checkout, Node setup from `.nvmrc`, `npm ci` and `npm run check` on pushes and PRs, with read-only contents permissions. No deployment or credentials are introduced. A remote GitHub Actions run is separate evidence from a local successful check.

Locally: exact dependencies installed and `npm run check` passed with 3 new route tests and 13 existing reference/legacy tests. Runtime asset count was zero in this main baseline; the motion study and greenhouse response are separate pending PRs. Test discovery automatically includes their Node tests once merged; the conditional static copy supports motion-study runtime files. The published private Site is not rebuilt or redeployed by this package.

Next: A02 representative renderer/viewport spike, then A03 architecture/clock/lifecycle contracts using both scenario domains. V02 assets and actual browser/device/performance evidence remain open.
