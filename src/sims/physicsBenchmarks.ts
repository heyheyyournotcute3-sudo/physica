import { fft1d } from '@/lib/fft';
import { rk4Step, integrateRk45 } from './integrators/ode';

/**
 * Exact & Numerical Physics Kernels shared between Landmarks, Interactive Simulations,
 * and the Vitest Physics Verification Suite.
 */

export const EARTH_OMEGA_RAD_S = 7.2921159e-5;
export const ONSAGER_TC = 2 / Math.log(1 + Math.SQRT2); // 2.26918531421...

/**
 * Coupled nonlinear double pendulum Hamiltonian / Lagrangian ODE in (theta1, theta2, omega1, omega2).
 */
export function doublePendulumDeriv(
  _t: number,
  y: Float64Array,
  out: Float64Array,
  m1 = 1,
  m2 = 1,
  L1 = 1,
  L2 = 1,
  g = 9.81
): void {
  const th1 = y[0];
  const th2 = y[1];
  const w1 = y[2];
  const w2 = y[3];

  const delta = th1 - th2;
  const sinD = Math.sin(delta);
  const cosD = Math.cos(delta);
  const denomBase = 2 * m1 + m2 - m2 * Math.cos(2 * delta);

  out[0] = w1;
  out[1] = w2;
  out[2] =
    (-g * (2 * m1 + m2) * Math.sin(th1) -
      m2 * g * Math.sin(th1 - 2 * th2) -
      2 * sinD * m2 * (w2 * w2 * L2 + w1 * w1 * L1 * cosD)) /
    (L1 * denomBase);
  out[3] =
    (2 *
      sinD *
      (w1 * w1 * L1 * (m1 + m2) +
        g * (m1 + m2) * Math.cos(th1) +
        w2 * w2 * L2 * m2 * cosD)) /
    (L2 * denomBase);
}

export function doublePendulumEnergy(
  y: Float64Array,
  m1 = 1,
  m2 = 1,
  L1 = 1,
  L2 = 1,
  g = 9.81
): number {
  const th1 = y[0];
  const th2 = y[1];
  const w1 = y[2];
  const w2 = y[3];

  const v1Sq = L1 * L1 * w1 * w1;
  const v2Sq =
    v1Sq + L2 * L2 * w2 * w2 + 2 * L1 * L2 * w1 * w2 * Math.cos(th1 - th2);
  const T = 0.5 * m1 * v1Sq + 0.5 * m2 * v2Sq;
  const V = -m1 * g * L1 * Math.cos(th1) - m2 * g * (L1 * Math.cos(th1) + L2 * Math.cos(th2));
  return T + V;
}

/**
 * Foucault pendulum horizontal planar equations in rotating frame:
 *   x'' - 2 * omega_z * y' + (g/L) x = 0
 *   y'' + 2 * omega_z * x' + (g/L) y = 0
 * where omega_z = omega_earth * sin(latitude).
 */
export function simulateFoucaultPrecessionRate(
  latitudeDeg = 59.86,
  omegaEarth = 0.025, // scaled Earth rate keeping total precession < pi/2
  gOverL = 9.0,
  totalTime = 40,
  dt = 0.002
): { measuredOmegaP: number; analyticOmegaP: number } {
  const phi = (latitudeDeg * Math.PI) / 180;
  const wz = omegaEarth * Math.sin(phi);
  // Launch through origin along +x in rotating frame so orbit passes cleanly through origin every half-swing
  let state: Float64Array = new Float64Array([0, 0, 1, 0]);

  const deriv = (_t: number, s: Float64Array, out: Float64Array) => {
    out[0] = s[2];
    out[1] = s[3];
    out[2] = 2 * wz * s[3] - gOverL * s[0];
    out[3] = -2 * wz * s[2] - gOverL * s[1];
  };

  let prevR = 0;
  let prevPrevR = 0;
  let lastTurningAngle = 0;
  let lastTurningTime = 0;
  const steps = Math.round(totalTime / dt);

  for (let i = 1; i <= steps; i++) {
    const nextState = rk4Step(state, deriv, (i - 1) * dt, dt);
    const r = Math.hypot(nextState[0], nextState[1]);
    if (i > 10 && prevR > prevPrevR && prevR > r && prevR > 0.25 && state[0] > 0) {
      // Positive-side apogee turning point (avoids pi-alternation ambiguity)
      const ang = Math.atan2(state[1], state[0]);
      lastTurningAngle = Math.abs(ang);
      lastTurningTime = (i - 1) * dt;
    }
    prevPrevR = prevR;
    prevR = r;
    state = nextState;
  }

  return {
    measuredOmegaP: lastTurningAngle / Math.max(1e-9, lastTurningTime),
    analyticOmegaP: wz,
  };
}

/**
 * Schwarzschild effective potential and orbital benchmarks (geometrized G = c = 1).
 * Orbit equation in Binet variable u = 1/r:
 *   d^2u / dphi^2 + u = M / L^2 + 3 M u^2
 */
export function findSchwarzschildISCO(M = 1): number {
  // Effective potential V_eff(r, L) = (1 - 2M/r)(1 + L^2/r^2).
  // Marginal stability occurs where dV_eff/dr = 0 and d^2V_eff/dr^2 = 0 simultaneously.
  // Solve numerically via Newton search on discriminant of circular orbit condition:
  // r^2 - (L^2/M) r + 3 L^2 = 0 => double root when (L^2/M)^2 - 12 L^2 = 0 => L^2 = 12 M^2 => r = 6M.
  const d2VAtCircular = (r: number): number => {
    // Given circular orbit at r, L^2 = M r^2 / (r - 3M)
    const L2 = (M * r * r) / (r - 3 * M);
    const h = 1e-4 * M;
    const v = (rad: number) => (1 - (2 * M) / rad) * (1 + L2 / (rad * rad));
    return (v(r + h) - 2 * v(r) + v(r - h)) / (h * h);
  };

  let lo = 3.5 * M;
  let hi = 12.0 * M;
  for (let iter = 0; iter < 60; iter++) {
    const mid = 0.5 * (lo + hi);
    if (d2VAtCircular(mid) < 0) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return 0.5 * (lo + hi);
}

export function measureSchwarzschildPrecession(
  M = 1,
  semiMajorA = 120,
  eccentricity = 0.2
): { numericShiftRad: number; analyticShiftRad: number } {
  const rPeri = semiMajorA * (1 - eccentricity);
  const rApo = semiMajorA * (1 + eccentricity);
  // Exact relativistic angular momentum for turning points rPeri and rApo:
  const u1 = 1 / rPeri;
  const u2 = 1 / rApo;
  // Using energy equality (1 - 2Mu1)(1 + L^2 u1^2) = (1 - 2Mu2)(1 + L^2 u2^2)
  const num = 2 * M * (u1 - u2);
  const den = u1 * u1 * (1 - 2 * M * u1) - u2 * u2 * (1 - 2 * M * u2);
  const L2 = num / den;

  // Integrate d^2u/dphi^2 = M/L^2 - u + 3 M u^2 from perihelion (u = u1, du/dphi = 0)
  // until next perihelion (du/dphi crosses 0 from negative to positive near 2*pi)
  const deriv = (_phi: number, y: Float64Array, out: Float64Array) => {
    out[0] = y[1];
    out[1] = M / L2 - y[0] + 3 * M * y[0] * y[0];
  };

  let phi = 0;
  const dPhi = 0.002;
  let y: Float64Array = new Float64Array([u1, 0]);
  let passedAphelion = false;
  let perihelionPhi = 2 * Math.PI;

  for (let step = 0; step < 5000; step++) {
    const nextY = integrateRk45(y, deriv, phi, phi + dPhi, 1e-11, dPhi);
    if (phi > 2.5 && y[1] < 0 && nextY[1] <= 0) {
      passedAphelion = true;
    }
    if (passedAphelion && phi > 5.5 && y[1] > 0 && nextY[1] <= 0) {
      // Linearly interpolate zero of du/dphi
      const frac = y[1] / (y[1] - nextY[1]);
      perihelionPhi = phi + frac * dPhi;
      break;
    }
    phi += dPhi;
    y = nextY;
  }

  return {
    numericShiftRad: perihelionPhi - 2 * Math.PI,
    analyticShiftRad: (6 * Math.PI * M) / (semiMajorA * (1 - eccentricity * eccentricity)),
  };
}

/**
 * Null geodesic photon sphere & critical impact parameter (black hole shadow radius).
 * Null orbit equation: (du/dphi)^2 = 1/b^2 - u^2 (1 - 2Mu).
 */
export function computeBlackHolePhotonBenchmarks(M = 1): {
  photonSphereR: number;
  shadowRadiusB: number;
} {
  // Effective potential for photons: W(r) = (1 - 2M/r) / r^2. Peak gives unstable photon sphere.
  let lo = 2.05 * M;
  let hi = 5.0 * M;
  const dW = (r: number) => {
    const h = 1e-6 * M;
    const W = (rad: number) => (1 - (2 * M) / rad) / (rad * rad);
    return (W(r + h) - W(r - h)) / (2 * h);
  };
  for (let i = 0; i < 60; i++) {
    const mid = 0.5 * (lo + hi);
    if (dW(mid) > 0) lo = mid;
    else hi = mid;
  }
  const rPh = 0.5 * (lo + hi);
  const wMax = (1 - (2 * M) / rPh) / (rPh * rPh);
  const bCrit = 1 / Math.sqrt(wMax);
  return { photonSphereR: rPh, shadowRadiusB: bCrit };
}

/**
 * 1D Split-Step Fourier (Strang Splitting) Solver for Time-Dependent Schrodinger Equation:
 *   i hbar dpsi/dt = [ -hbar^2/(2m) d^2/dx^2 + V(x) ] psi
 * Units: hbar = 1, m = 1 unless overridden.
 */
export interface SplitStep1DState {
  N: number;
  L: number;
  dx: number;
  x: Float64Array;
  re: Float64Array;
  im: Float64Array;
  V: Float64Array;
}

export function createSplitStep1D(
  N: number,
  L: number,
  initPsi: (x: number) => [number, number],
  potential: (x: number) => number
): SplitStep1DState {
  const dx = L / N;
  const x = new Float64Array(N);
  const re = new Float64Array(N);
  const im = new Float64Array(N);
  const V = new Float64Array(N);

  let normSq = 0;
  for (let i = 0; i < N; i++) {
    const xi = -0.5 * L + i * dx;
    x[i] = xi;
    const [r, m] = initPsi(xi);
    re[i] = r;
    im[i] = m;
    V[i] = potential(xi);
    normSq += (r * r + m * m) * dx;
  }
  const invNorm = 1 / Math.sqrt(Math.max(1e-30, normSq));
  for (let i = 0; i < N; i++) {
    re[i] *= invNorm;
    im[i] *= invNorm;
  }
  return { N, L, dx, x, re, im, V };
}

export function stepSplitStep1D(
  s: SplitStep1DState,
  dt: number,
  mass = 1,
  hbar = 1
): void {
  const { N, L, re, im, V } = s;
  const halfDtOverHbar = (0.5 * dt) / hbar;

  // 1. Half-step potential evolution: exp(-i V(x) dt / (2 hbar))
  for (let i = 0; i < N; i++) {
    const phase = -V[i] * halfDtOverHbar;
    const c = Math.cos(phase);
    const sn = Math.sin(phase);
    const r = re[i];
    const m = im[i];
    re[i] = r * c - m * sn;
    im[i] = r * sn + m * c;
  }

  // 2. Forward FFT to k-space
  fft1d(re, im, false);

  // 3. Full-step kinetic evolution: exp(-i hbar k^2 dt / (2m))
  const dk = (2 * Math.PI) / L;
  for (let j = 0; j < N; j++) {
    const kj = j < N / 2 ? j * dk : (j - N) * dk;
    const phase = -(hbar * kj * kj * dt) / (2 * mass);
    const c = Math.cos(phase);
    const sn = Math.sin(phase);
    const r = re[j];
    const m = im[j];
    re[j] = r * c - m * sn;
    im[j] = r * sn + m * c;
  }

  // 4. Inverse FFT back to x-space
  fft1d(re, im, true);

  // 5. Second half-step potential evolution
  for (let i = 0; i < N; i++) {
    const phase = -V[i] * halfDtOverHbar;
    const c = Math.cos(phase);
    const sn = Math.sin(phase);
    const r = re[i];
    const m = im[i];
    re[i] = r * c - m * sn;
    im[i] = r * sn + m * c;
  }
}

export function computeNorm1D(s: SplitStep1DState): number {
  let sum = 0;
  for (let i = 0; i < s.N; i++) {
    sum += s.re[i] * s.re[i] + s.im[i] * s.im[i];
  }
  return sum * s.dx;
}

/**
 * Exact Jacobi real symmetric matrix diagonalisation for tight-binding, SSH, and 1D Hamiltonian eigenvalues.
 */
export function jacobiEigenSymmetric(
  matrix: Float64Array,
  n: number,
  maxSweeps = 80
): { eigenvalues: Float64Array; eigenvectors: Float64Array } {
  const A = new Float64Array(matrix);
  const V = new Float64Array(n * n);
  for (let i = 0; i < n; i++) V[i * n + i] = 1;

  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let offDiagNorm = 0;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = A[p * n + q];
        offDiagNorm += apq * apq;
      }
    }
    if (Math.sqrt(offDiagNorm) < 1e-12) break;

    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = A[p * n + q];
        if (Math.abs(apq) < 1e-14) continue;
        const app = A[p * n + p];
        const aqq = A[q * n + q];
        const tau = (aqq - app) / (2 * apq);
        const t =
          tau >= 0
            ? 1 / (tau + Math.sqrt(1 + tau * tau))
            : -1 / (-tau + Math.sqrt(1 + tau * tau));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = t * c;

        A[p * n + p] = app - t * apq;
        A[q * n + q] = aqq + t * apq;
        A[p * n + q] = 0;
        A[q * n + p] = 0;

        for (let r = 0; r < n; r++) {
          if (r !== p && r !== q) {
            const arp = A[r * n + p];
            const arq = A[r * n + q];
            A[r * n + p] = c * arp - s * arq;
            A[p * n + r] = A[r * n + p];
            A[r * n + q] = s * arp + c * arq;
            A[q * n + r] = A[r * n + q];
          }
          const vrp = V[r * n + p];
          const vrq = V[r * n + q];
          V[r * n + p] = c * vrp - s * vrq;
          V[r * n + q] = s * vrp + c * vrq;
        }
      }
    }
  }

  // Sort ascending by eigenvalue
  const indices = Array.from({ length: n }, (_, i) => i).sort(
    (i, j) => A[i * n + i] - A[j * n + j]
  );
  const eigenvalues = new Float64Array(n);
  const eigenvectors = new Float64Array(n * n);
  for (let col = 0; col < n; col++) {
    const src = indices[col];
    eigenvalues[col] = A[src * n + src];
    for (let row = 0; row < n; row++) {
      eigenvectors[row * n + col] = V[row * n + src];
    }
  }
  return { eigenvalues, eigenvectors };
}

/**
 * Analytic 1D rectangular potential barrier transmission probability (E < V0 or E > V0).
 * Units: hbar = 1, m = 1 unless specified.
 */
export function analyticSquareBarrierTransmission(
  E: number,
  V0: number,
  widthA: number,
  mass = 1,
  hbar = 1
): number {
  if (Math.abs(V0) < 1e-12 || E <= 0) return 1;
  if (Math.abs(E - V0) < 1e-8) {
    const factor = (mass * V0 * widthA * widthA) / (2 * hbar * hbar);
    return 1 / (1 + factor);
  }
  if (E < V0) {
    const kappa = Math.sqrt((2 * mass * (V0 - E)) / (hbar * hbar));
    const sh = Math.sinh(kappa * widthA);
    const denom = 1 + (V0 * V0 * sh * sh) / (4 * E * (V0 - E));
    return 1 / denom;
  }
  const k2 = Math.sqrt((2 * mass * (E - V0)) / (hbar * hbar));
  const sn = Math.sin(k2 * widthA);
  const denom = 1 + (V0 * V0 * sn * sn) / (4 * E * (E - V0));
  return 1 / denom;
}

/**
 * Su-Schrieffer-Heeger (SSH) winding number & finite open chain spectrum.
 */
export function computeSshWindingNumber(v: number, w: number, steps = 512): number {
  if (Math.abs(v - w) < 1e-9) return 0.5;
  let totalAngle = 0;
  let prevPhi = Math.atan2(0, v + w);
  for (let i = 1; i <= steps; i++) {
    const k = -Math.PI + (2 * Math.PI * i) / steps;
    const dx = v + w * Math.cos(k);
    const dy = w * Math.sin(k);
    const phi = Math.atan2(dy, dx);
    let dPhi = phi - prevPhi;
    while (dPhi > Math.PI) dPhi -= 2 * Math.PI;
    while (dPhi < -Math.PI) dPhi += 2 * Math.PI;
    totalAngle += dPhi;
    prevPhi = phi;
  }
  return Math.round(totalAngle / (2 * Math.PI));
}

export function solveSshOpenChain(cells: number, v: number, w: number) {
  const sites = 2 * cells;
  const H = new Float64Array(sites * sites);
  for (let m = 0; m < cells; m++) {
    const a = 2 * m;
    const b = 2 * m + 1;
    H[a * sites + b] = v;
    H[b * sites + a] = v;
    if (m < cells - 1) {
      const nextA = 2 * (m + 1);
      H[b * sites + nextA] = w;
      H[nextA * sites + b] = w;
    }
  }
  return jacobiEigenSymmetric(H, sites);
}

/**
 * Two-flavour neutrino oscillation survival/appearance probability:
 *   P(nu_alpha -> nu_beta) = sin^2(2 theta) * sin^2(1.2669328 * dm2[eV^2] * L[km] / E[GeV])
 */
export function neutrinoOscillationAppearanceProb(
  thetaRad: number,
  dm2Ev2: number,
  lengthKm: number,
  energyGeV: number
): number {
  const sin2TwoTheta = Math.pow(Math.sin(2 * thetaRad), 2);
  const phase = (1.2669328 * dm2Ev2 * lengthKm) / Math.max(1e-9, energyGeV);
  return sin2TwoTheta * Math.pow(Math.sin(phase), 2);
}
