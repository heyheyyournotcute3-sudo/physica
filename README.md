# Physica — Explorable 3D Library of Advanced Physics

**Physica** is a browser-based 3D library of graduate-level physics. You arrive in a domed rotunda beneath a rotating astronomical oculus where a Foucault pendulum precesses at $\Omega_p = \omega_\oplus \sin\phi$ ($\phi = 59.86^\circ\text{ N}$). Six two-storey wings radiate outward at $60^\circ$ intervals—one per major field of physics—each ending in a real-time 3D landmark physics exhibit.

Hovering over any of the **60 volumes** on the shelves lifts the book slightly ($1.5\text{ cm}$ slide, $3^\circ$ tilt) and displays its title, difficulty, reading time, and prerequisites. Clicking pulls the book off the shelf into your hands, hinges open its cover, and hands off seamlessly to a crisp HTML + KaTeX two-page spread reader featuring step-by-step derivations, symbol-unit hover cards, scrubbable motion graphics, and live numerical simulations.

---

## Six Wings & Live 3D Landmarks

| Wing | Field | Flagship Monographs (12 Total) | 3D Alcove Landmark |
| --- | --- | --- | --- |
| **I** | Classical & Analytical Mechanics | *Lagrangians and the Principle of Least Action* · *Hamiltonian Chaos* | Chaotic Lagrangian Double Pendulum |
| **II** | Electromagnetism & Optics | *Maxwell's Equations in Motion* · *Waves, Interference and Fourier Optics* | Tesla Resonator & Dispersive Spectral Prism |
| **III** | Thermodynamics & Statistical Mechanics | *Entropy and the Arrow of Time* · *Phase Transitions and the Renormalization Group* | Kinetic Maxwell–Boltzmann Gas Chamber |
| **IV** | Relativity & Cosmology | *Spacetime: From Special to General Relativity* · *The Expanding Universe* | Real-Time Schwarzschild Black Hole Lensing ($b_c = \sqrt{27}\,GM/c^2$) |
| **V** | Quantum Mechanics & QFT | *The Wavefunction and Its Evolution* · *Quantum Field Theory: From Fields to Particles* | Single-Quanta Double-Slit Interference Buildup |
| **VI** | Condensed Matter, Particle Physics & Frontiers | *Topology in Condensed Matter* · *The Standard Model and Beyond* | 3D Bravais Lattice Acoustic & Optical Phonons |

Plus **48 structured "Coming soon" volumes** (8 per wing) across ground-floor and mezzanine shelves.

---

## Numerical Methods & Physics Verification

Forward Euler is never used for Hamiltonian systems. Every simulation states its integrator and timestep in its `Method` drawer and is continuously tested against analytical benchmarks in `src/tests/physics.test.ts`:

- **Symplectic Velocity Verlet & 4th-Order Yoshida** (`src/sims/integrators/ode.ts`) — bounded energy error $< 10^{-4}$ over $10^5$ steps.
- **Classical RK4 & Adaptive Dormand–Prince RK45** — verified $O(\Delta t^4)$ convergence, double-pendulum energy conservation, Foucault precession, and Schwarzschild ISCO ($6GM/c^2$) & perihelion advance.
- **1D Strang Split-Step Fourier TDSE** — preserves quantum L2 norm $\|\psi\|_2^2 = 1$ within $10^{-10}$ and matches analytical square-barrier tunnelling within $2\%$.
- **2D Yee-Grid FDTD Maxwell Solver** — stable up to Courant limit $S = 1/\sqrt{2}$ with dielectric refraction and absorbing sponge layers.
- **2D Ising Metropolis & Wolff Cluster Algorithms** — Binder cumulant crossing within $2\%$ of Onsager's exact $k_B T_c / J = 2 / \ln(1 + \sqrt{2}) \approx 2.269$.
- **Event-Driven Hard-Sphere Molecular Dynamics** — exact collision kinematics conserving kinetic energy to machine precision with Loschmidt velocity-reversal ($\mathbf{v}_i \to -\mathbf{v}_i$).
- **Exact Jacobi Hermitian Diagonalisation** — harmonic oscillator spectrum, SSH winding numbers $\nu \in \{0, 1\}$, and topological zero-energy edge modes.

---

## Accessibility & 2D Catalog Mode

- **Full 2D Scholarly Catalog (`#/catalog` or "Browse as List"):** Every book, derivation, motion graphic, and simulation is 100% operable without WebGL.
- **Keyboard-Only Navigation:** `Tab` cycles nearest visible books in 3D (`Enter` opens, `Esc` returns to shelf); `←` / `→` / `PageUp` / `PageDown` flip pages; `M` opens the radial floor-plan map; `/` opens instant `MiniSearch`.
- **Screen-Reader Support:** Crisp semantic HTML + KaTeX MathML output, motion-graphic beat transcripts, and live simulation `aria-live` state descriptions.

---

## Quick Start

```bash
npm install --legacy-peer-deps
npm run dev          # Start local Vite dev server
npx tsc --noEmit     # Strict TypeScript check
npx vitest run       # Run all 19 physics & content verification tests
npm run build        # Production build to dist/index.html
```
