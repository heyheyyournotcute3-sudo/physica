# Physics Verification Log (`VERIFY.md`)

Every published book, equation, physical constant, and numerical simulation in **Physica** has been verified against graduate-level reference texts and automated invariant tests in `src/tests/physics.test.ts` and `src/tests/content.test.ts`.

## Active `TODO-VERIFY` Markers in Published Books
- **None (0 unresolved markers).**

## Verified Physical Constants & Exact Benchmarks Used
1. **Earth Sidereal Rotation Rate (Foucault Pendulum):** $\omega_\oplus = 7.2921159 \times 10^{-5}\text{ rad s}^{-1}$; default latitude $\phi = 59.86^\circ\text{ N}$ (Uppsala / Stockholm), giving $\Omega_p = \omega_\oplus \sin\phi$.
2. **2D Square-Lattice Ising Critical Temperature (Onsager 1944):**
   $$\frac{k_B T_c}{J} = \frac{2}{\ln(1 + \sqrt{2})} \approx 2.26918531421.$$
3. **Schwarzschild Spacetime Landmarks (Geometrized Units $G = c = 1$):**
   - Event horizon: $r_s = 2M$
   - Photon sphere: $r_{\text{ph}} = 3M$
   - Critical impact parameter (shadow radius): $b_c = 3\sqrt{3}\,M = \sqrt{27}\,M \approx 5.196152\,M$
   - Innermost Stable Circular Orbit (ISCO): $r_{\text{ISCO}} = 6M$
   - Weak-field perihelion precession per orbit: $\Delta\varphi = \frac{6\pi GM}{c^2 a(1 - e^2)}$
4. **Su–Schrieffer–Heeger (SSH) Chain Topological Phase Transition:**
   - Bloch Hamiltonian $\mathbf{d}(k) = (v + w\cos k,\, w\sin k,\, 0)$; winding number $\nu = 1$ for $w > v$ (topological, localized zero-energy edge modes) and $\nu = 0$ for $w < v$ (trivial).
5. **Two-Flavour Neutrino Oscillation Probability (Practical Units):**
   $$P(\nu_\alpha \to \nu_\beta) = \sin^2(2\theta)\,\sin^2\!\left(1.26693\,\frac{\Delta m^2\,[\text{eV}^2]\,L\,[\text{km}]}{E\,[\text{GeV}]}\right).$$
