# Physica Phased Execution Plan (`docs/plans/roadmap.md`)

## Phase 0 — Foundations
- Strict TypeScript configuration, Zod content & simulation schemas (`src/lib/schema.ts`), seeded deterministic PRNG (`xoshiro128**`), physical constants & colour-blind-safe wing palettes, Zustand persistent store (`src/state/store.ts`), URL deep-link router, and CI workflow.

## Phase 1 — Library Architecture, Navigation & Shelf Instancing
- Full-scale 20 m domed Rotunda with rotating astronomical star oculus and central Foucault pendulum, plus six 32 m × 12 m two-storey themed wings at $60^\circ$ intervals.
- Analytical capsule spatial collision (`radius = 0.3 m`, `eyeHeight = 1.65 m`), Explore (click-to-walk, drag-look, scroll) + First-Person (Pointer Lock WASD) + Touch Joystick + Keyboard Tab book cycling + Fast-Travel Spline Map (`M`).
- 60 instanced books with baked spine textures, <3.5 m debounced hover lift (1.5 cm slide, $3^\circ$ tilt), rim highlight, and scholarly metadata tooltip.

## Phase 2 — Book State Machine & Crisp HTML Page-Flip Reader
- Explicit typed state machine (`idle -> hovered -> pulling -> opening -> reading -> closing`).
- 3D-to-DOM handoff aligned to projected page bounds, cylindrical page-curl transition, two-page spread / single-page responsive layout, TOC, multi-ribbon bookmarks, glossary cards, equation symbol hover, search (`MiniSearch`), and prerequisite camera flights.

## Phase 3 & 4 — Numerical Integrators, Live Simulations, Motion Graphics & Pipeline
- Symplectic Velocity Verlet, 4th-order Yoshida, RK4, adaptive RK45, Split-Step Fourier (1D TDSE with radix-2 FFT), 2D Yee-grid FDTD, Metropolis/Wolff 2D Ising, Event-Driven Hard-Sphere MD, SSH Hermitian diagonaliser.
- Declarative scrubbable Motion Graphics engine (`src/motion/`) with captions/transcripts and KaTeX equation morphs.

## Phase 5, 6, 7 & 8 — Six Wing Landmarks, 12 Flagship Monographs + 48 Stubs, Catalog Mode, Accessibility & Verification
- All 6 running 3D physics landmarks in wing alcoves (clicking opens corresponding flagship book).
- All 12 graduate-grade flagship books (12–16 explicit pages each, numbered equations, derivations, live simulations, motion graphics, exercises with hints & worked solutions, conventions, references) + 48 structured stubs.
- Full 2D Catalog Mode, reduced motion, dark/paper reader themes, Web Audio synthesis, and comprehensive Vitest physics & content test suites.
