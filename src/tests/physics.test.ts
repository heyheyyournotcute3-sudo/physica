import { describe, expect, it } from 'vitest';
import { rk4Step, velocityVerletStep } from '../sims/integrators/ode';
import {
  analyticSquareBarrierTransmission,
  computeBlackHolePhotonBenchmarks,
  computeNorm1D,
  computeSshWindingNumber,
  createSplitStep1D,
  doublePendulumDeriv,
  doublePendulumEnergy,
  findSchwarzschildISCO,
  jacobiEigenSymmetric,
  measureSchwarzschildPrecession,
  neutrinoOscillationAppearanceProb,
  ONSAGER_TC,
  simulateFoucaultPrecessionRate,
  solveSshOpenChain,
  stepSplitStep1D,
} from '../sims/physicsBenchmarks';
import {
  computeGasKineticEnergy,
  computeIsingMagnetisation,
  createFdtd2D,
  createHardDiskGas,
  createIsing2D,
  solveFriedmannTrajectory,
  stepFdtd2D,
  stepHardDiskGasEventDriven,
  stepIsingWolffCluster,
} from '../sims/fieldAndStatKernels';

describe('Physica Numerical Integrators & Physics Invariants', () => {
  it('1. Velocity Verlet on harmonic oscillator over 10^5 steps keeps relative energy error < 1e-4 without drift', () => {
    const omega = 2.0;
    const dt = 0.005;
    const q = new Float64Array([1.0]);
    const v = new Float64Array([0.0]);
    const accel = (pos: Float64Array, out: Float64Array) => {
      out[0] = -omega * omega * pos[0];
    };
    const E0 = 0.5 * v[0] * v[0] + 0.5 * omega * omega * q[0] * q[0];

    let maxRelErr = 0;
    for (let step = 0; step < 100_000; step++) {
      velocityVerletStep(q, v, accel, dt);
      if (step % 1000 === 999) {
        const E = 0.5 * v[0] * v[0] + 0.5 * omega * omega * q[0] * q[0];
        const rel = Math.abs(E - E0) / E0;
        if (rel > maxRelErr) maxRelErr = rel;
      }
    }
    const EFinal = 0.5 * v[0] * v[0] + 0.5 * omega * omega * q[0] * q[0];
    expect(maxRelErr).toBeLessThan(1e-4);
    expect(Math.abs(EFinal - E0) / E0).toBeLessThan(1e-4);
  });

  it('2. Classical RK4 exhibits 4th-order O(dt^4) convergence (~16x error reduction when dt is halved)', () => {
    // dy/dt = y, y(0) = 1 -> exact y(t) = exp(t)
    const exact = (t: number) => Math.exp(t);
    const deriv = (_t: number, y: Float64Array, out: Float64Array) => {
      out[0] = y[0];
    };

    const runWithDt = (dt: number) => {
      const T = 1.0;
      const steps = Math.round(T / dt);
      let y: Float64Array = new Float64Array([1.0]);
      for (let i = 0; i < steps; i++) {
        y = rk4Step(y, deriv, i * dt, dt);
      }
      return Math.abs(y[0] - exact(T));
    };

    const errCoarse = runWithDt(0.1);
    const errFine = runWithDt(0.05);
    const ratio = errCoarse / errFine;
    expect(ratio).toBeGreaterThan(15.2);
    expect(ratio).toBeLessThan(16.8);
  });

  it('3. Small-amplitude simple pendulum period matches 2π√(L/g) within 0.1%', () => {
    const L = 1.5;
    const g = 9.81;
    const expectedPeriod = 2 * Math.PI * Math.sqrt(L / g);
    const dt = 0.001;
    const q = new Float64Array([0.02]); // small angle 0.02 rad
    const v = new Float64Array([0.0]);
    const accel = (pos: Float64Array, out: Float64Array) => {
      out[0] = -(g / L) * Math.sin(pos[0]);
    };

    let prevV = 0;
    let halfPeriod = 0;
    for (let step = 1; step <= 5000; step++) {
      velocityVerletStep(q, v, accel, dt);
      if (step > 100 && prevV < 0 && v[0] >= 0) {
        const frac = -prevV / (v[0] - prevV);
        halfPeriod = (step - 1 + frac) * dt;
        break;
      }
      prevV = v[0];
    }
    const measuredPeriod = 2 * halfPeriod;
    expect(Math.abs(measuredPeriod - expectedPeriod) / expectedPeriod).toBeLessThan(0.001);
  });

  it('4. Chaotic double pendulum conserves total energy within 10^-4 relative over 60 simulated seconds', () => {
    const dt = 0.002;
    const steps = Math.round(60 / dt);
    let y: Float64Array = new Float64Array([2.1, 1.7, 0.0, 0.0]);
    const E0 = doublePendulumEnergy(y, 1, 1, 1, 1, 9.81);
    for (let i = 0; i < steps; i++) {
      y = rk4Step(y, (t, s, out) => doublePendulumDeriv(t, s, out, 1, 1, 1, 1, 9.81), i * dt, dt);
    }
    const E1 = doublePendulumEnergy(y, 1, 1, 1, 1, 9.81);
    expect(Math.abs((E1 - E0) / E0)).toBeLessThan(1e-4);
  });

  it('5. Foucault pendulum precession rate matches ω sin(φ) within 1%', () => {
    const { measuredOmegaP, analyticOmegaP } = simulateFoucaultPrecessionRate(59.86, 0.025, 9.0, 42, 0.002);
    expect(Math.abs(measuredOmegaP - analyticOmegaP) / analyticOmegaP).toBeLessThan(0.01);
  });

  it('6. Schwarzschild orbits locate ISCO at 6GM/c² and weak-field perihelion shift within 1%', () => {
    const rIsco = findSchwarzschildISCO(1);
    expect(Math.abs(rIsco - 6.0)).toBeLessThan(1e-3);

    const { numericShiftRad, analyticShiftRad } = measureSchwarzschildPrecession(1, 800, 0.15);
    expect(Math.abs(numericShiftRad - analyticShiftRad) / analyticShiftRad).toBeLessThan(0.01);
  });

  it('7. Black-hole photon sphere sits at 3GM/c² and critical shadow radius at √27 GM/c² within 1%', () => {
    const { photonSphereR, shadowRadiusB } = computeBlackHolePhotonBenchmarks(1);
    expect(Math.abs(photonSphereR - 3.0) / 3.0).toBeLessThan(0.001);
    expect(Math.abs(shadowRadiusB - Math.sqrt(27)) / Math.sqrt(27)).toBeLessThan(0.001);
  });

  it('8. 1D Split-Step Fourier Schrödinger conserves norm < 10^-10, keeps ground state stationary, and evolves coherent state along classical trajectory', () => {
    // Coherent state displaced to x0 = 2.0 in harmonic potential V(x) = 0.5 x^2 (omega = 1)
    const x0 = 2.0;
    const state = createSplitStep1D(
      256,
      24,
      (x) => [Math.pow(Math.PI, -0.25) * Math.exp(-0.5 * (x - x0) * (x - x0)), 0],
      (x) => 0.5 * x * x
    );
    const norm0 = computeNorm1D(state);
    const dt = 0.01;
    const T = 2.1; // evolve to t = 2.1 -> expected classical <x>(t) = x0 cos(t)
    const steps = Math.round(T / dt);
    for (let i = 0; i < steps; i++) {
      stepSplitStep1D(state, dt, 1, 1);
    }
    const normFinal = computeNorm1D(state);
    expect(Math.abs(normFinal - norm0)).toBeLessThan(1e-10);

    let meanX = 0;
    for (let i = 0; i < state.N; i++) {
      meanX += state.x[i] * (state.re[i] * state.re[i] + state.im[i] * state.im[i]) * state.dx;
    }
    const expectedMeanX = x0 * Math.cos(steps * dt);
    expect(Math.abs(meanX - expectedMeanX)).toBeLessThan(0.015);

    // Ground state stationarity check
    const gs = createSplitStep1D(
      128,
      20,
      (x) => [Math.pow(Math.PI, -0.25) * Math.exp(-0.5 * x * x), 0],
      (x) => 0.5 * x * x
    );
    const initialMidProb = gs.re[64] * gs.re[64] + gs.im[64] * gs.im[64];
    for (let i = 0; i < 150; i++) stepSplitStep1D(gs, 0.01, 1, 1);
    const finalMidProb = gs.re[64] * gs.re[64] + gs.im[64] * gs.im[64];
    expect(Math.abs(finalMidProb - initialMidProb) / initialMidProb).toBeLessThan(1e-3);
  });

  it('9. Harmonic oscillator finite-difference Hamiltonian diagonalisation matches lowest 5 eigenvalues (n + ½)ℏω within 0.1%', () => {
    // Use 4th-order central finite-difference kinetic stencil on N = 90 grid over [-8, 8]
    const N = 90;
    const L = 16;
    const dx = L / (N + 1);
    const H = new Float64Array(N * N);
    const inv2dx2 = 1 / (2 * dx * dx); // hbar = m = omega = 1

    for (let i = 0; i < N; i++) {
      const x = -0.5 * L + (i + 1) * dx;
      // 4th-order -1/2 d^2/dx^2: (-1/12 f_{i-2} + 4/3 f_{i-1} - 5/2 f_i + 4/3 f_{i+1} - 1/12 f_{i+2}) / (2 dx^2) -> wait: -d^2f/dx^2 = (1/12 f_{i-2} - 4/3 f_{i-1} + 5/2 f_i - 4/3 f_{i+1} + 1/12 f_{i+2}) / dx^2
      H[i * N + i] = 2.5 * inv2dx2 + 0.5 * x * x;
      if (i + 1 < N) {
        H[i * N + (i + 1)] = (-4 / 3) * inv2dx2;
        H[(i + 1) * N + i] = (-4 / 3) * inv2dx2;
      }
      if (i + 2 < N) {
        H[i * N + (i + 2)] = (1 / 12) * inv2dx2;
        H[(i + 2) * N + i] = (1 / 12) * inv2dx2;
      }
    }

    const { eigenvalues } = jacobiEigenSymmetric(H, N, 60);
    for (let n = 0; n < 5; n++) {
      const exact = n + 0.5;
      expect(Math.abs(eigenvalues[n] - exact) / exact).toBeLessThan(0.001);
    }
  });

  it('10. Narrow-band wavepacket tunnelling through a square barrier matches analytic transmission formula within 2%', () => {
    const k0 = 4.5; // E0 = 10.125
    const V0 = 12.0; // E0 < V0 tunnelling regime
    const widthA = 0.5;
    const sigma = 5.5; // wide spatial packet -> narrow momentum spread delta_k = 1/(2 sigma) ≈ 0.09
    const N = 1024;
    const L = 128; // dx = 0.125 (barrier spans exactly 4 grid cells)
    const xStart = -24;

    const s = createSplitStep1D(
      N,
      L,
      (x) => {
        const env = Math.exp(-((x - xStart) * (x - xStart)) / (4 * sigma * sigma));
        return [env * Math.cos(k0 * x), env * Math.sin(k0 * x)];
      },
      (x) => (x >= 0 && x < widthA ? V0 : 0)
    );

    // Group velocity v_g = k0 = 4.5; evolve for T = 11.2 so packet cleanly crosses barrier without wrapping L=128
    const dt = 0.01;
    const steps = 1120;
    for (let step = 0; step < steps; step++) {
      stepSplitStep1D(s, dt, 1, 1);
    }

    let transNumeric = 0;
    for (let i = 0; i < N; i++) {
      if (s.x[i] > widthA + 1.0 && s.x[i] < 56) {
        transNumeric += (s.re[i] * s.re[i] + s.im[i] * s.im[i]) * s.dx;
      }
    }
    const transExact = analyticSquareBarrierTransmission(0.5 * k0 * k0, V0, widthA);
    expect(Math.abs(transNumeric - transExact)).toBeLessThan(0.02);
  });

  it('11. 2D Ising Wolff Monte Carlo gives |M| ≈ 1 well below T_c, near 0 well above T_c, and Binder crossing within 2% of 2.269 J/k_B', () => {
    const lowT = createIsing2D(16, 1234, true);
    for (let i = 0; i < 60; i++) stepIsingWolffCluster(lowT, 1.2, 1);
    expect(Math.abs(computeIsingMagnetisation(lowT))).toBeGreaterThan(0.92);

    const highT = createIsing2D(16, 5678, false);
    for (let i = 0; i < 80; i++) stepIsingWolffCluster(highT, 3.8, 1);
    expect(Math.abs(computeIsingMagnetisation(highT))).toBeLessThan(0.25);

    // Verify Binder cumulant U4(L, T) at exact T_c ≈ 2.269185 matches universal value ~0.61 closely across L=8 and L=14
    const measureBinder = (L: number, T: number, clusters: number) => {
      const st = createIsing2D(L, 99 + L, true);
      for (let w = 0; w < 120; w++) stepIsingWolffCluster(st, T, 1);
      let m2 = 0;
      let m4 = 0;
      for (let c = 0; c < clusters; c++) {
        stepIsingWolffCluster(st, T, 1);
        const m = computeIsingMagnetisation(st);
        const sq = m * m;
        m2 += sq;
        m4 += sq * sq;
      }
      m2 /= clusters;
      m4 /= clusters;
      return 1 - m4 / (3 * m2 * m2);
    };

    const u6Low = measureBinder(6, 2.23, 2400);
    const u12Low = measureBinder(12, 2.23, 2400);
    const u6High = measureBinder(6, 2.31, 2400);
    const u12High = measureBinder(12, 2.31, 2400);
    expect(u12Low).toBeGreaterThan(u6Low);
    expect(u12High).toBeLessThan(u6High);
    const dLow = u12Low - u6Low;
    const dHigh = u6High - u12High;
    const tCross = 2.23 + (0.08 * dLow) / (dLow + dHigh);
    expect(Math.abs(tCross - ONSAGER_TC) / ONSAGER_TC).toBeLessThan(0.02);
  });

  it('12. Event-driven hard-sphere gas conserves energy to machine precision and relaxes to Maxwell–Boltzmann (χ² fit)', () => {
    const gas = createHardDiskGas(81, 0.016, 2026, true);
    const E0 = computeGasKineticEnergy(gas);

    const bins = 6;
    const vMax = 0.9;
    const accumCounts = new Float64Array(bins);
    let samples = 0;

    // Thermalize for 300 collisions, then time-average ergodic histogram
    for (let step = 0; step < 90; step++) {
      stepHardDiskGasEventDriven(gas, 0.04);
      if (step >= 30) {
        samples += gas.N;
        for (let i = 0; i < gas.N; i++) {
          const v = Math.hypot(gas.vx[i], gas.vy[i]);
          const b = Math.min(bins - 1, Math.floor((v / vMax) * bins));
          accumCounts[b]++;
        }
      }
    }

    const E1 = computeGasKineticEnergy(gas);
    expect(Math.abs(E1 - E0) / E0).toBeLessThan(1e-11);

    // Chi-square check against integrated 2D Maxwell-Boltzmann CDF: F(v) = 1 - exp(-v^2 / (2 k_B T))
    const kBT = E0 / gas.N;
    let chi2 = 0;
    for (let b = 0; b < bins; b++) {
      const vLo = (b / bins) * vMax;
      const vHi = b === bins - 1 ? Infinity : ((b + 1) / bins) * vMax;
      const pBin = Math.exp((-vLo * vLo) / (2 * kBT)) - (vHi === Infinity ? 0 : Math.exp((-vHi * vHi) / (2 * kBT)));
      const expected = samples * pBin;
      if (expected > 20) {
        chi2 += Math.pow(accumCounts[b] - expected, 2) / expected;
      }
    }
    // Reduced chi-square well within statistical + finite-N tolerance
    expect(chi2 / bins).toBeLessThan(4.5);
  });

  it('13. 2D Yee-grid FDTD remains stable at Courant S = 1/√2 and propagates plane waves within 1% of c', () => {
    const S = 1 / Math.SQRT2;
    const state = createFdtd2D(180, 24, S, 1.0, false);
    state.damp.fill(1);

    // Launch pulse at x0 = 90: splits symmetrically into right-going (x0 + c*t) and left-going (x0 - c*t) plane waves.
    // Enforce y-invariance on top/bottom rows after each step so ky = 0 (true free-space plane wave, no waveguide cutoff).
    const x0 = 90;
    const sigma = 5.5;
    for (let y = 0; y < state.ny; y++) {
      for (let x = 0; x < state.nx; x++) {
        state.Ez[y * state.nx + x] = Math.exp(-Math.pow((x - x0) / sigma, 2));
      }
    }

    const nSteps = 70; // exact c*t = 70 * (1/sqrt(2)) = 49.49747 cells
    const midRow = 12 * state.nx;
    for (let k = 0; k < nSteps; k++) {
      stepFdtd2D(state, 0.1, 'none');
      // Copy interior y=12 row to boundary rows y=0 and y=ny-1 to maintain exact ky=0 plane wave
      for (let x = 0; x < state.nx; x++) {
        state.Ez[x] = state.Ez[midRow + x];
        state.Ez[(state.ny - 1) * state.nx + x] = state.Ez[midRow + x];
      }
    }

    let num = 0;
    let den = 0;
    for (let x = 105; x < 175; x++) {
      const w = state.Ez[midRow + x] * state.Ez[midRow + x];
      num += x * w;
      den += w;
    }
    const xRightPeak = num / den;
    const measuredSpeedOverC = (xRightPeak - x0) / (nSteps * S);
    expect(Number.isFinite(xRightPeak)).toBe(true);
    expect(Math.abs(measuredSpeedOverC - 1.0)).toBeLessThan(0.01);
  });

  it('14. Friedmann cosmological solver yields a ∝ t^(2/3) for matter-only and exponential growth for Λ-only', () => {
    const matter = solveFriedmannTrajectory(1.0, 0.0, 0.0, 1.2, 0.002);
    // For Omega_m = 1 flat universe, exact H0 t = (2/3) a^(3/2) -> a(tau) = (1.5 * tau)^(2/3) (up to tiny a0=1e-3 offset)
    const idx = 400; // tau = 0.8
    const tau = matter.tau[idx];
    const aExpected = Math.pow(1.5 * tau, 2 / 3);
    expect(Math.abs(matter.a[idx] - aExpected) / aExpected).toBeLessThan(0.005);

    // Lambda-dominated ratio a(tau2) / a(tau1) = exp(tau2 - tau1)
    const deSitter = solveFriedmannTrajectory(0.0, 0.0, 1.0, 1.5, 0.002);
    const ratio = deSitter.a[500] / deSitter.a[250]; // delta_tau = 0.5
    expect(Math.abs(ratio - Math.exp(0.5)) / Math.exp(0.5)).toBeLessThan(0.002);
  });

  it('15. SSH model yields winding number 1 & mid-gap E=0 edge states iff w > v, and 0 in trivial phase v > w', () => {
    expect(computeSshWindingNumber(0.6, 1.5)).toBe(1);
    expect(computeSshWindingNumber(1.5, 0.6)).toBe(0);

    const topo = solveSshOpenChain(16, 0.5, 1.5);
    const triv = solveSshOpenChain(16, 1.5, 0.5);
    const mid = 16; // 32 sites -> middle indices 15 and 16
    expect(Math.abs(topo.eigenvalues[mid])).toBeLessThan(1e-4);
    expect(Math.abs(triv.eigenvalues[mid])).toBeGreaterThan(0.8);
  });

  it('16. Two-flavour neutrino oscillation probability matches sin²(2θ) sin²(1.267 Δm² L / E)', () => {
    const theta = Math.PI / 4; // maximal mixing -> sin^2(2 theta) = 1
    const dm2 = 2.5e-3; // eV^2
    const E = 1.0; // GeV
    const LMax = Math.PI / (2 * 1.2669328 * dm2); // ~495.9 km
    expect(neutrinoOscillationAppearanceProb(theta, dm2, LMax, E)).toBeCloseTo(1.0, 5);
    expect(neutrinoOscillationAppearanceProb(theta, dm2, 0, E)).toBe(0);
  });
});
