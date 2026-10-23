import { createRng, type SeededRng } from '@/lib/rng';
import { rk4Step } from './integrators/ode';

/**
 * 1. 2D Square-Lattice Ising Model:
 *    H = -J sum_{<i,j>} s_i s_j - h sum_i s_i
 * Supports both Metropolis-Hastings single-spin sweeps and Wolff cluster updates.
 */
export interface Ising2DState {
  L: number;
  spins: Int8Array; // +1 or -1
  rng: SeededRng;
  sweeps: number;
  lastClusterSize: number;
}

export function createIsing2D(L: number, seed = 42, ordered = false): Ising2DState {
  const rng = createRng(seed);
  const spins = new Int8Array(L * L);
  for (let i = 0; i < L * L; i++) {
    spins[i] = ordered ? 1 : rng.next() < 0.5 ? 1 : -1;
  }
  return { L, spins, rng, sweeps: 0, lastClusterSize: 0 };
}

export function stepIsingMetropolisSweep(
  s: Ising2DState,
  T: number,
  J = 1,
  hField = 0
): void {
  const { L, spins, rng } = s;
  const n = L * L;
  const beta = 1 / Math.max(1e-5, T);

  for (let step = 0; step < n; step++) {
    const idx = Math.floor(rng.next() * n);
    const x = idx % L;
    const y = Math.floor(idx / L);
    const si = spins[idx];
    const nbSum =
      spins[y * L + ((x + 1) % L)] +
      spins[y * L + ((x - 1 + L) % L)] +
      spins[((y + 1) % L) * L + x] +
      spins[((y - 1 + L) % L) * L + x];
    const dE = 2 * si * (J * nbSum + hField);
    if (dE <= 0 || rng.next() < Math.exp(-beta * dE)) {
      spins[idx] = (si === 1 ? -1 : 1) as 1 | -1;
    }
  }
  s.sweeps += 1;
}

export function stepIsingWolffCluster(s: Ising2DState, T: number, J = 1): void {
  const { L, spins, rng } = s;
  const n = L * L;
  const pAdd = 1 - Math.exp((-2 * J) / Math.max(1e-5, T));
  const seedIdx = Math.floor(rng.next() * n);
  const clusterSpin = spins[seedIdx];
  const flippedSpin = (clusterSpin === 1 ? -1 : 1) as 1 | -1;

  const stack = new Int32Array(n);
  let top = 0;
  stack[top++] = seedIdx;
  spins[seedIdx] = flippedSpin;
  let size = 1;

  while (top > 0) {
    const curr = stack[--top];
    const x = curr % L;
    const y = Math.floor(curr / L);
    const neighbors = [
      y * L + ((x + 1) % L),
      y * L + ((x - 1 + L) % L),
      ((y + 1) % L) * L + x,
      ((y - 1 + L) % L) * L + x,
    ];
    for (let k = 0; k < 4; k++) {
      const nb = neighbors[k];
      if (spins[nb] === clusterSpin && rng.next() < pAdd) {
        spins[nb] = flippedSpin;
        stack[top++] = nb;
        size++;
      }
    }
  }
  s.lastClusterSize = size;
  s.sweeps += size / n;
}

export function computeIsingMagnetisation(s: Ising2DState): number {
  let sum = 0;
  for (let i = 0; i < s.spins.length; i++) sum += s.spins[i];
  return sum / s.spins.length;
}

export function computeIsingEnergyPerSpin(s: Ising2DState, J = 1, hField = 0): number {
  const { L, spins } = s;
  let e = 0;
  for (let y = 0; y < L; y++) {
    for (let x = 0; x < L; x++) {
      const si = spins[y * L + x];
      const right = spins[y * L + ((x + 1) % L)];
      const down = spins[((y + 1) % L) * L + x];
      e += -J * si * (right + down) - hField * si;
    }
  }
  return e / (L * L);
}

/**
 * 2. Event-Driven Hard-Sphere (2D Disk) Molecular Dynamics in [0, 1] x [0, 1].
 *    Exact collision detection & elastic impulse exchange -> exact total kinetic energy conservation.
 */
export interface HardDiskGasState {
  N: number;
  radius: number;
  x: Float64Array;
  y: Float64Array;
  vx: Float64Array;
  vy: Float64Array;
  time: number;
  collisions: number;
}

export function createHardDiskGas(
  N = 64,
  radius = 0.022,
  seed = 101,
  bimodalInit = true
): HardDiskGasState {
  const rng = createRng(seed);
  const x = new Float64Array(N);
  const y = new Float64Array(N);
  const vx = new Float64Array(N);
  const vy = new Float64Array(N);

  const cols = Math.ceil(Math.sqrt(N));
  const spacing = (1 - 4 * radius) / cols;
  for (let i = 0; i < N; i++) {
    const gx = i % cols;
    const gy = Math.floor(i / cols);
    x[i] = 2 * radius + (gx + 0.5) * spacing;
    y[i] = 2 * radius + (gy + 0.5) * spacing;
    const angle = rng.range(0, 2 * Math.PI);
    // Start out of equilibrium (mono-speed ring) so relaxation to Maxwell-Boltzmann is dramatic!
    const speed = bimodalInit ? (i % 2 === 0 ? 0.55 : 0.18) : 0.42;
    vx[i] = speed * Math.cos(angle);
    vy[i] = speed * Math.sin(angle);
  }
  return { N, radius, x, y, vx, vy, time: 0, collisions: 0 };
}

export function stepHardDiskGasEventDriven(s: HardDiskGasState, dtTarget: number): void {
  const { N, radius, x, y, vx, vy } = s;
  const sigma = 2 * radius;
  const sigmaSq = sigma * sigma;
  let remaining = dtTarget;
  let subGuard = 0;

  while (remaining > 1e-11 && subGuard < 600) {
    subGuard++;
    let minDt = remaining;
    let hitType: 'none' | 'wallX' | 'wallY' | 'pair' = 'none';
    let hitA = -1;
    let hitB = -1;

    // Wall collisions
    for (let i = 0; i < N; i++) {
      if (vx[i] > 0) {
        const tWall = (1 - radius - x[i]) / vx[i];
        if (tWall >= 0 && tWall < minDt) {
          minDt = tWall;
          hitType = 'wallX';
          hitA = i;
        }
      } else if (vx[i] < 0) {
        const tWall = (radius - x[i]) / vx[i];
        if (tWall >= 0 && tWall < minDt) {
          minDt = tWall;
          hitType = 'wallX';
          hitA = i;
        }
      }
      if (vy[i] > 0) {
        const tWall = (1 - radius - y[i]) / vy[i];
        if (tWall >= 0 && tWall < minDt) {
          minDt = tWall;
          hitType = 'wallY';
          hitA = i;
        }
      } else if (vy[i] < 0) {
        const tWall = (radius - y[i]) / vy[i];
        if (tWall >= 0 && tWall < minDt) {
          minDt = tWall;
          hitType = 'wallY';
          hitA = i;
        }
      }
    }

    // Pairwise disk collisions
    for (let i = 0; i < N - 1; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = x[j] - x[i];
        const dy = y[j] - y[i];
        const dvx = vx[j] - vx[i];
        const dvy = vy[j] - vy[i];
        const b = dx * dvx + dy * dvy;
        if (b >= 0) continue; // Moving apart
        const v2 = dvx * dvx + dvy * dvy;
        const r2 = dx * dx + dy * dy;
        const disc = b * b - v2 * (r2 - sigmaSq);
        if (disc <= 0) continue;
        const tPair = Math.max(0, (-b - Math.sqrt(disc)) / v2);
        if (tPair < minDt) {
          minDt = tPair;
          hitType = 'pair';
          hitA = i;
          hitB = j;
        }
      }
    }

    // Drift all particles by minDt
    for (let i = 0; i < N; i++) {
      x[i] += vx[i] * minDt;
      y[i] += vy[i] * minDt;
    }
    remaining -= minDt;
    s.time += minDt;

    if (hitType === 'wallX') {
      vx[hitA] = -vx[hitA];
      s.collisions++;
    } else if (hitType === 'wallY') {
      vy[hitA] = -vy[hitA];
      s.collisions++;
    } else if (hitType === 'pair') {
      const dx = x[hitB] - x[hitA];
      const dy = y[hitB] - y[hitA];
      const dist = Math.hypot(dx, dy) || sigma;
      const nx = dx / dist;
      const ny = dy / dist;
      const dvDotN = (vx[hitB] - vx[hitA]) * nx + (vy[hitB] - vy[hitA]) * ny;
      vx[hitA] += dvDotN * nx;
      vy[hitA] += dvDotN * ny;
      vx[hitB] -= dvDotN * nx;
      vy[hitB] -= dvDotN * ny;
      s.collisions++;
    }
  }
}

export function reverseHardDiskVelocities(s: HardDiskGasState): void {
  for (let i = 0; i < s.N; i++) {
    s.vx[i] = -s.vx[i];
    s.vy[i] = -s.vy[i];
  }
}

export function computeGasKineticEnergy(s: HardDiskGasState): number {
  let e = 0;
  for (let i = 0; i < s.N; i++) {
    e += 0.5 * (s.vx[i] * s.vx[i] + s.vy[i] * s.vy[i]);
  }
  return e;
}

export function computeBoltzmannH(s: HardDiskGasState, bins = 12, vMax = 1.1): number {
  const counts = new Float64Array(bins);
  const dv = vMax / bins;
  for (let i = 0; i < s.N; i++) {
    const v = Math.hypot(s.vx[i], s.vy[i]);
    const b = Math.min(bins - 1, Math.floor(v / dv));
    counts[b] += 1;
  }
  let H = 0;
  for (let b = 0; b < bins; b++) {
    if (counts[b] > 0) {
      const vMid = (b + 0.5) * dv;
      // In 2D velocity space d^2v = 2 pi v dv, so phase-space density f2D(v) = P(v) / (2 pi v dv)
      const f = counts[b] / (s.N * 2 * Math.PI * vMid * dv);
      H += (counts[b] / s.N) * Math.log(Math.max(1e-12, f));
    }
  }
  return H;
}

/**
 * 3. 2D Transverse-Magnetic (TMz) Yee-Grid FDTD Solver for Maxwell's Equations (c = 1):
 *    dEz/dt = (1/eps_r) * (dHy/dx - dHx/dy) - sigma * Ez
 *    dHx/dt = -dEz/dy
 *    dHy/dt =  dEz/dx
 * Courant stability condition in 2D: S = c dt / dx <= 1 / sqrt(2).
 */
export interface Fdtd2DState {
  nx: number;
  ny: number;
  courant: number;
  Ez: Float64Array;
  Hx: Float64Array;
  Hy: Float64Array;
  invEps: Float64Array;
  damp: Float64Array;
  stepCount: number;
}

export function createFdtd2D(
  nx = 96,
  ny = 64,
  courant = 0.68, // <= 1/sqrt(2) = 0.70710678
  dielectricEps = 2.25,
  slabEnabled = true
): Fdtd2DState {
  const n = nx * ny;
  const Ez = new Float64Array(n);
  const Hx = new Float64Array(n);
  const Hy = new Float64Array(n);
  const invEps = new Float64Array(n).fill(1);
  const damp = new Float64Array(n).fill(1);

  const sponge = 10;
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      const idx = y * nx + x;
      const dxEdge = Math.min(x, nx - 1 - x);
      const dyEdge = Math.min(y, ny - 1 - y);
      const d = Math.min(dxEdge, dyEdge);
      if (d < sponge) {
        const u = (sponge - d) / sponge;
        damp[idx] = Math.exp(-0.22 * u * u);
      }
      if (slabEnabled && x >= Math.floor(nx * 0.56) && x <= Math.floor(nx * 0.68)) {
        // Dielectric slab with a central aperture/lens curvature
        invEps[idx] = 1 / Math.max(1, dielectricEps);
      }
    }
  }
  return { nx, ny, courant, Ez, Hx, Hy, invEps, damp, stepCount: 0 };
}

export function stepFdtd2D(
  s: Fdtd2DState,
  sourceFreq = 0.11,
  sourceMode: 'dipole' | 'plane' | 'none' = 'dipole'
): void {
  const { nx, ny, courant, Ez, Hx, Hy, invEps, damp } = s;

  // Update H fields on staggered half-step
  for (let y = 0; y < ny - 1; y++) {
    const row = y * nx;
    const nextRow = (y + 1) * nx;
    for (let x = 0; x < nx - 1; x++) {
      const i = row + x;
      Hx[i] = (Hx[i] - courant * (Ez[nextRow + x] - Ez[i])) * damp[i];
      Hy[i] = (Hy[i] + courant * (Ez[i + 1] - Ez[i])) * damp[i];
    }
  }

  // Update Ez field
  for (let y = 1; y < ny - 1; y++) {
    const row = y * nx;
    const prevRow = (y - 1) * nx;
    for (let x = 1; x < nx - 1; x++) {
      const i = row + x;
      const curlH = Hy[i] - Hy[i - 1] - (Hx[i] - Hx[prevRow + x]);
      Ez[i] = (Ez[i] + courant * invEps[i] * curlH) * damp[i];
    }
  }

  // Soft source injection
  const t = s.stepCount;
  const env = Math.min(1, t / 18);
  const val = env * Math.sin(2 * Math.PI * sourceFreq * t);
  if (sourceMode === 'dipole') {
    const sx = Math.floor(nx * 0.28);
    const sy = Math.floor(ny * 0.5);
    Ez[sy * nx + sx] += val * 0.85;
  } else if (sourceMode === 'plane') {
    const sx = Math.floor(nx * 0.22);
    for (let y = 12; y < ny - 12; y++) {
      Ez[y * nx + sx] += val * 0.35;
    }
  }

  s.stepCount++;
}

/**
 * 4. FLRW Friedmann Cosmology Solver (in units of H_0^{-1}):
 *    da / dtau = a * sqrt( max(0, Omega_r a^-4 + Omega_m a^-3 + Omega_k a^-2 + Omega_Lambda) )
 */
export function solveFriedmannTrajectory(
  omegaM: number,
  omegaR: number,
  omegaLambda: number,
  tauMax = 2.5,
  dt = 0.005
): { tau: number[]; a: number[] } {
  const omegaK = 1 - omegaM - omegaR - omegaLambda;
  const tauArr: number[] = [0];
  const aArr: number[] = [1e-3];
  let a = 1e-3;
  let sign = 1; // +1 expanding, -1 contracting after turnaround in closed universe

  const steps = Math.round(tauMax / dt);
  for (let i = 1; i <= steps; i++) {
    const rhsSq = (val: number) => {
      const u = Math.max(1e-5, val);
      return (
        omegaR / Math.pow(u, 2) +
        omegaM / u +
        omegaK +
        omegaLambda * u * u
      );
    };

    const fVal = rhsSq(a);
    if (fVal <= 1e-9 && sign === 1 && omegaK < 0) {
      sign = -1; // Turnaround in closed universe
    }

    const deriv = (_t: number, y: Float64Array, out: Float64Array) => {
      const sq = rhsSq(y[0]);
      out[0] = sq > 0 ? sign * Math.sqrt(sq) : 0;
    };

    const next = rk4Step(new Float64Array([a]), deriv, (i - 1) * dt, dt);
    a = Math.max(0, next[0]);
    tauArr.push(i * dt);
    aArr.push(a);
    if (a <= 1e-4 && sign === -1) break; // Big Crunch reached
  }
  return { tau: tauArr, a: aArr };
}
