# Physica: 3D Physics Library — Specification

## Vision

Physica is a browser-based 3D library you walk through. Every book on its shelves is an interactive text on an advanced physics topic, full of live simulations and animated explanations.

You arrive in a domed rotunda where a Foucault pendulum swings beneath a star map. Six wings branch off it, one per field of physics, each with its own architecture and light. As you walk the aisles, hovering over a spine lifts the book slightly and shows its title, difficulty and prerequisites. Clicking pulls the book off the shelf and into your hands. It opens, and you turn real, curling pages. Each page mixes careful prose and typeset equations with motion graphics you can scrub and simulations you can poke at: drag a potential barrier and watch a wavepacket tunnel through, or cool an Ising lattice past its critical temperature.

## Design Principles

- **Correct first.** The physics must hold up to a graduate student. Pretty but wrong is a failure.
- **Intuition before formalism.** Every concept is shown moving before it is written as an equation.
- **The library is the interface.** The 3D world is how you browse, but every book is also reachable from a plain 2D catalog.
- **Readable pages.** Pages are rendered as crisp HTML, not blurry textures, so text and math are always sharp and accessible.
- **Fast on ordinary hardware.** A mid-range laptop should hold 60 fps.

## Layout & Six Wings (1 unit = 1 metre)

- **Rotunda:** Circular hall (20 m radius, 18 m dome height) with an astronomically accurate rotating star oculus and a central Foucault pendulum ($\Omega_p = \omega_\oplus \sin\phi$, $\phi = 59.86^\circ\text{ N}$). Six arched portals at $60^\circ$ intervals lead into the six wings.
- **Wing I — Classical & Analytical Mechanics:** Warm walnut, brass fittings, ceiling clockwork; chaotic double-pendulum landmark.
- **Wing II — Electromagnetism & Optics:** Dark slate, light shafts, prism spectrum caustics; Tesla coil with procedural branching arcs & dispersive prism landmark.
- **Wing III — Thermodynamics & Statistical Mechanics:** Copper pipes, amber light; hard-sphere kinetic gas relaxing toward the Maxwell–Boltzmann speed distribution.
- **Wing IV — Relativity & Cosmology:** Cool silver observatory alcove; Schwarzschild black hole with real-time gravitational lensing shader ($r_{\text{ph}} = 3GM/c^2$, shadow $\sqrt{27}\,GM/c^2$).
- **Wing V — Quantum Mechanics & QFT:** Pale blue-white frosted glass; single-quanta double-slit interference buildup landmark.
- **Wing VI — Condensed Matter, Particle Physics & Frontiers:** Crystalline columns, iridescent accents; 3D crystal lattice with travelling acoustic & optical phonon waves.

## Catalog Scope (v1)

- **60 books total** across the 6 wings (10 per wing: 2 fully authored multi-page flagship monographs + 8 "Coming soon" structured stubs).
- **12 Flagship Books:**
  1. *Lagrangians and the Principle of Least Action* (Mechanics)
  2. *Hamiltonian Chaos* (Mechanics)
  3. *Maxwell's Equations in Motion* (Electromagnetism)
  4. *Waves, Interference and Fourier Optics* (Electromagnetism)
  5. *Entropy and the Arrow of Time* (Thermal & Statistical Physics)
  6. *Phase Transitions and the Renormalization Group* (Thermal & Statistical Physics)
  7. *Spacetime: From Special to General Relativity* (Relativity & Cosmology)
  8. *The Expanding Universe* (Relativity & Cosmology)
  9. *The Wavefunction and Its Evolution* (Quantum & QFT)
  10. *Quantum Field Theory: From Fields to Particles* (Quantum & QFT)
  11. *Topology in Condensed Matter* (Frontiers)
  12. *The Standard Model and Beyond* (Frontiers)

## Numerical Methods & Physics Invariants

- **Hamiltonian ODEs:** Symplectic Velocity Verlet / 4th-order Yoshida (bounded energy error, zero secular drift).
- **Non-Hamiltonian / Geodesic ODEs:** Classical RK4 & adaptive Dormand–Prince RK45.
- **1D Time-Dependent Schrödinger Equation:** Split-step Fourier method (Strang splitting with exact unitary kinetic & potential half-steps, conserving $\|\psi\|_2^2 = 1$ to machine precision).
- **2D Maxwell Equations:** Yee-grid FDTD at Courant number $S \le 1/\sqrt{2}$ with sponge absorbing boundaries.
- **2D Ising Model:** Metropolis–Hastings & Wolff single-cluster flips around Onsager's exact $k_B T_c / J = 2 / \ln(1 + \sqrt{2}) \approx 2.269185$.
- **Hard-Sphere Gas:** Exact event-driven elastic pair/wall collisions conserving total kinetic energy to machine precision.
- **Tight-Binding / SSH Chain:** Exact Hermitian matrix diagonalisation and winding number integration.
