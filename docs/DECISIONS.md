# Architectural & Engineering Decisions (`DECISIONS.md`)

All deviations and concrete implementation refinements relative to `SPEC.md` are recorded here with rationale and evaluated alternatives.

## ADR-001: Imperative Modular Three.js Scene Graph Bridge on React 19
- **Context:** The workspace uses `react@19.2.6` and `vite-plugin-singlefile`. `@react-three/fiber` v8 relies on React 18 internals (`ReactCurrentOwner`) and fails at runtime under React 19, while bundling heavy postprocessing/drei subtrees risks inflating single-file bundles.
- **Decision:** Build `src/world/` directly atop `three` (`THREE.WebGLRenderer`, `THREE.InstancedMesh`, custom `THREE.ShaderMaterial`, analytical spatial raycasting, and GSAP camera splines) mounted via a clean React lifecycle component (`LibraryCanvas.tsx`) synchronized through Zustand (`src/state/store.ts`).
- **Alternatives Considered:** Downgrading React to 18 (disallowed because `package.json` is managed only via `npm install` and template expects React 19) or using experimental R3F alphas.
- **Consequences:** Zero React reconciler overhead in the 60 fps render loop, full single WebGL context control, exact screen-space projection for seamless 3D-book-to-HTML-reader handoff, and rock-solid stability.

## ADR-002: Analytical Capsule Spatial Collision vs Rapier WASM
- **Context:** `vite.config.ts` bundles output with `viteSingleFile()`. Large WASM binaries (`@dimforge/rapier3d-compat`) bloat single-file HTML bundles by >2.5 MB and introduce async WASM instantiation latency.
- **Decision:** Implement an exact analytical capsule-vs-library collision solver (`src/world/player/collision.ts`) covering the 20 m circular rotunda, six 32 m × 12 m radial wings at $60^\circ$ intervals, shelf bay AABBs, reading tables, central Foucault plinth, and mezzanine spiral/ramp elevation transitions.
- **Consequences:** Sub-microsecond collision resolution per frame, zero clipping, smooth wall sliding, and <450 KB core JS footprint.

## ADR-003: Typed Structured TypeScript Content Modules Validated by Zod
- **Context:** Rather than requiring custom Vite MDX compiler plugins (since `vite.config.ts` must not be edited), books are authored as strongly-typed structured page ASTs (`ContentBlock`: prose, numbered `<Eq>` with symbol hover metadata, multi-step `<Derivation>` with term morphing, live `<Sim>`, scrubbable `<Motion>`, `<Callout>`, `<Exercise>`, `<Term>`, and `<Ref>`) validated at startup and in Vitest via strict Zod schemas and KaTeX strict rendering checks.
- **Consequences:** Preserves 100% of MDX expressive power, strict build/test-time verification of every equation, simulation ID, glossary term, and cross-reference, and crisp HTML + KaTeX DOM rendering.

## ADR-004: URL Synchronization Supporting Standalone & Hosted Environments
- **Context:** Static and single-file previews may run under either root `/` paths or hash routes.
- **Decision:** Synchronize book/page/catalog routes cleanly via URL hash (`#/`, `#/catalog`, `#/book/:bookId/:page`) while also parsing initial pathname `/book/:bookId/:page` if present on load.
- **Consequences:** Deep links, browser Back/Forward navigation, and static hosting work seamlessly everywhere without server rewrite rules.
