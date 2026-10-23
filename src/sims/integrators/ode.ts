/**
 * Symplectic and Runge-Kutta ODE Integrators.
 * Forward Euler is strictly forbidden for Hamiltonian systems in Physica.
 */

export type AccelFn = (q: Float64Array, out: Float64Array) => void;
export type DerivFn = (t: number, y: Float64Array, out: Float64Array) => void;

/**
 * 2nd-order Symplectic Velocity Verlet step.
 * Preserves phase-space volume and bounds Hamiltonian energy oscillations over 10^5+ steps.
 */
export function velocityVerletStep(
  q: Float64Array,
  v: Float64Array,
  accel: AccelFn,
  dt: number
): void {
  const n = q.length;
  const a0 = new Float64Array(n);
  const a1 = new Float64Array(n);
  accel(q, a0);
  const halfDt = 0.5 * dt;

  for (let i = 0; i < n; i++) {
    v[i] += halfDt * a0[i];
    q[i] += dt * v[i];
  }

  accel(q, a1);
  for (let i = 0; i < n; i++) {
    v[i] += halfDt * a1[i];
  }
}

/**
 * 4th-order Symplectic Yoshida (1990) integrator for separable Hamiltonians H(q,p) = T(p) + V(q).
 */
const CBRT2 = Math.cbrt(2);
const YOSHIDA_W1 = 1 / (2 - CBRT2);
const YOSHIDA_W0 = (-CBRT2) / (2 - CBRT2);
const YOSHIDA_C = [
  YOSHIDA_W1 / 2,
  (YOSHIDA_W0 + YOSHIDA_W1) / 2,
  (YOSHIDA_W0 + YOSHIDA_W1) / 2,
  YOSHIDA_W1 / 2,
];
const YOSHIDA_D = [YOSHIDA_W1, YOSHIDA_W0, YOSHIDA_W1, 0];

export function yoshida4Step(
  q: Float64Array,
  v: Float64Array,
  accel: AccelFn,
  dt: number
): void {
  const n = q.length;
  const a = new Float64Array(n);

  for (let s = 0; s < 4; s++) {
    const cDt = YOSHIDA_C[s] * dt;
    for (let i = 0; i < n; i++) {
      q[i] += cDt * v[i];
    }
    if (YOSHIDA_D[s] !== 0) {
      accel(q, a);
      const dDt = YOSHIDA_D[s] * dt;
      for (let i = 0; i < n; i++) {
        v[i] += dDt * a[i];
      }
    }
  }
}

/**
 * Classical 4th-order Runge-Kutta (RK4) step.
 * Global truncation error O(dt^4): halving dt reduces error by ~16x.
 */
export function rk4Step(
  y: Float64Array,
  deriv: DerivFn,
  t: number,
  dt: number
): Float64Array {
  const n = y.length;
  const k1 = new Float64Array(n);
  const k2 = new Float64Array(n);
  const k3 = new Float64Array(n);
  const k4 = new Float64Array(n);
  const tmp = new Float64Array(n);
  const next = new Float64Array(n);

  deriv(t, y, k1);

  for (let i = 0; i < n; i++) tmp[i] = y[i] + 0.5 * dt * k1[i];
  deriv(t + 0.5 * dt, tmp, k2);

  for (let i = 0; i < n; i++) tmp[i] = y[i] + 0.5 * dt * k2[i];
  deriv(t + 0.5 * dt, tmp, k3);

  for (let i = 0; i < n; i++) tmp[i] = y[i] + dt * k3[i];
  deriv(t + dt, tmp, k4);

  const sixth = dt / 6;
  for (let i = 0; i < n; i++) {
    next[i] = y[i] + sixth * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }
  return next;
}

/**
 * Adaptive Dormand-Prince RK45 solver over interval [t0, tEnd].
 */
export function integrateRk45(
  y0: Float64Array,
  deriv: DerivFn,
  t0: number,
  tEnd: number,
  tol = 1e-8,
  initialDt = 0.02
): Float64Array {
  const n = y0.length;
  let y = new Float64Array(y0);
  let t = t0;
  let h = Math.min(initialDt, tEnd - t0);

  const k1 = new Float64Array(n);
  const k2 = new Float64Array(n);
  const k3 = new Float64Array(n);
  const k4 = new Float64Array(n);
  const k5 = new Float64Array(n);
  const k6 = new Float64Array(n);
  const k7 = new Float64Array(n);
  const tmp = new Float64Array(n);
  const y5 = new Float64Array(n);
  const y4 = new Float64Array(n);

  let guard = 0;
  while (t < tEnd - 1e-14 && guard < 200000) {
    guard++;
    if (t + h > tEnd) h = tEnd - t;

    deriv(t, y, k1);
    for (let i = 0; i < n; i++) tmp[i] = y[i] + h * (1 / 5) * k1[i];
    deriv(t + (1 / 5) * h, tmp, k2);

    for (let i = 0; i < n; i++)
      tmp[i] = y[i] + h * ((3 / 40) * k1[i] + (9 / 40) * k2[i]);
    deriv(t + (3 / 10) * h, tmp, k3);

    for (let i = 0; i < n; i++)
      tmp[i] =
        y[i] + h * ((44 / 45) * k1[i] - (56 / 15) * k2[i] + (32 / 9) * k3[i]);
    deriv(t + (4 / 5) * h, tmp, k4);

    for (let i = 0; i < n; i++)
      tmp[i] =
        y[i] +
        h *
          ((19372 / 6561) * k1[i] -
            (25360 / 2187) * k2[i] +
            (64448 / 6561) * k3[i] -
            (212 / 729) * k4[i]);
    deriv(t + (8 / 9) * h, tmp, k5);

    for (let i = 0; i < n; i++)
      tmp[i] =
        y[i] +
        h *
          ((9017 / 3168) * k1[i] -
            (355 / 33) * k2[i] +
            (46732 / 5247) * k3[i] +
            (49 / 176) * k4[i] -
            (5103 / 18656) * k5[i]);
    deriv(t + h, tmp, k6);

    for (let i = 0; i < n; i++) {
      y5[i] =
        y[i] +
        h *
          ((35 / 384) * k1[i] +
            (500 / 1113) * k3[i] +
            (125 / 192) * k4[i] -
            (2187 / 6784) * k5[i] +
            (11 / 84) * k6[i]);
    }
    deriv(t + h, y5, k7);

    let maxErr = 0;
    for (let i = 0; i < n; i++) {
      y4[i] =
        y[i] +
        h *
          ((5179 / 57600) * k1[i] +
            (7571 / 16695) * k3[i] +
            (393 / 640) * k4[i] -
            (92097 / 339200) * k5[i] +
            (187 / 2100) * k6[i] +
            (1 / 40) * k7[i]);
      const scale = tol * (1 + Math.max(Math.abs(y[i]), Math.abs(y5[i])));
      const err = Math.abs(y5[i] - y4[i]) / scale;
      if (err > maxErr) maxErr = err;
    }

    if (maxErr <= 1 || h <= 1e-12) {
      t += h;
      y = new Float64Array(y5);
    }

    const factor =
      maxErr === 0 ? 2.5 : Math.min(2.5, Math.max(0.2, 0.9 * Math.pow(maxErr, -0.2)));
    h *= factor;
  }

  return y;
}
