import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Info, Pause, Play, RotateCcw, StepForward } from 'lucide-react';
import { fft2d } from '@/lib/fft';
import { complexToCssColor, SEMANTIC_COLOURS } from '@/lib/colour';
import { usePhysicaStore } from '@/state/store';
import {
  analyticSquareBarrierTransmission,
  computeNorm1D,
  computeSshWindingNumber,
  createSplitStep1D,
  doublePendulumDeriv,
  doublePendulumEnergy,
  neutrinoOscillationAppearanceProb,
  ONSAGER_TC,
  solveSshOpenChain,
  stepSplitStep1D,
  type SplitStep1DState,
} from './physicsBenchmarks';
import {
  computeBoltzmannH,
  computeGasKineticEnergy,
  computeIsingEnergyPerSpin,
  computeIsingMagnetisation,
  createFdtd2D,
  createHardDiskGas,
  createIsing2D,
  reverseHardDiskVelocities,
  solveFriedmannTrajectory,
  stepFdtd2D,
  stepHardDiskGasEventDriven,
  stepIsingMetropolisSweep,
  stepIsingWolffCluster,
  type Fdtd2DState,
  type HardDiskGasState,
  type Ising2DState,
} from './fieldAndStatKernels';
import { rk4Step } from './integrators/ode';

export interface ParamControl {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
}

export interface SimMetadata {
  id: string;
  title: string;
  method: string;
  caveats: string;
  controls: ParamControl[];
}

export const SIM_REGISTRY: Record<string, SimMetadata> = {
  'action-paths': {
    id: 'action-paths',
    title: 'Variational Action Explorer',
    method: 'Gauss–Legendre 128-node quadrature on S[q] = ∫ (½m q̇² − mgq) dt',
    caveats: 'Endpoints fixed at q(0)=0, q(T)=0; mode nperturbs δq = α sin(nπt/T).',
    controls: [
      { key: 'alpha', label: 'Perturbation α', min: -1.5, max: 1.5, step: 0.02, unit: 'm', defaultValue: 0.55 },
      { key: 'mode', label: 'Harmonic n', min: 1, max: 4, step: 1, unit: '', defaultValue: 2 },
      { key: 'gravity', label: 'Gravity g', min: 2, max: 15, step: 0.5, unit: 'm/s²', defaultValue: 9.8 },
    ],
  },
  'double-pendulum': {
    id: 'double-pendulum',
    title: 'Lagrangian Double Pendulum',
    method: 'Classical RK4 on coupled Euler–Lagrange equations, Δt = 2.0 × 10⁻³ s',
    caveats: 'Point masses on rigid massless rods (L₁ = L₂ = 1 m); relative ΔE/E < 10⁻⁶.',
    controls: [
      { key: 'theta1', label: 'Initial θ₁', min: 0.2, max: 2.9, step: 0.05, unit: 'rad', defaultValue: 2.15 },
      { key: 'theta2', label: 'Initial θ₂', min: 0.2, max: 2.9, step: 0.05, unit: 'rad', defaultValue: 1.65 },
      { key: 'massRatio', label: 'Mass ratio m₂/m₁', min: 0.3, max: 2.5, step: 0.1, unit: '', defaultValue: 1.0 },
    ],
  },
  'chirikov-chaos': {
    id: 'chirikov-chaos',
    title: 'Chirikov–Taylor Area-Preserving Standard Map',
    method: 'Exact symplectic twist map (det J = 1 identically), 400 iterations/orbit',
    caveats: 'Click anywhere on phase space (θ, I) to seed new trajectories; golden KAM breaks at K_c ≈ 0.9716.',
    controls: [
      { key: 'K', label: 'Kick strength K', min: 0.05, max: 2.4, step: 0.02, unit: '', defaultValue: 0.85 },
      { key: 'seeds', label: 'Preset orbits', min: 8, max: 28, step: 2, unit: '', defaultValue: 16 },
    ],
  },
  'fdtd-maxwell': {
    id: 'fdtd-maxwell',
    title: '2D Yee-Grid FDTD Maxwell Wave Sandbox',
    method: 'Staggered Yee TMz FDTD, Courant S = cΔt/Δx = 0.68 ≤ 1/√2, sponge PML',
    caveats: '96 × 64 Yee cells; refractive slab occupies 0.56 ≤ x/L ≤ 0.68.',
    controls: [
      { key: 'epsR', label: 'Slab permittivity ε_r', min: 1.0, max: 5.5, step: 0.25, unit: '', defaultValue: 2.5 },
      { key: 'freq', label: 'Source frequency', min: 0.05, max: 0.18, step: 0.01, unit: 'c/Δx', defaultValue: 0.11 },
      { key: 'mode', label: 'Source (0=Dipole,1=Plane)', min: 0, max: 1, step: 1, unit: '', defaultValue: 0 },
    ],
  },
  'fourier-optics': {
    id: 'fourier-optics',
    title: '2D FFT Fraunhofer Diffraction & Aperture Painter',
    method: 'Cooley–Tukey 2D Radix-2 FFT (64 × 64 complex aperture grid), logarithmic dynamic range',
    caveats: 'Drag on left aperture mask in Custom mode (preset = 4) to draw arbitrary slits!',
    controls: [
      { key: 'preset', label: 'Preset (0=1Slit,1=2Slit,2=Airy,3=Grat,4=Paint)', min: 0, max: 4, step: 1, unit: '', defaultValue: 1 },
      { key: 'scale', label: 'Aperture width / radius', min: 2, max: 16, step: 1, unit: 'px', defaultValue: 5 },
      { key: 'sep', label: 'Slit spacing d', min: 6, max: 24, step: 1, unit: 'px', defaultValue: 14 },
    ],
  },
  'hard-sphere-gas': {
    id: 'hard-sphere-gas',
    title: 'Event-Driven Hard-Sphere Gas & Loschmidt Paradox',
    method: 'Exact analytical pair & wall collision times (zero overlap, machine-exact ΔE = 0)',
    caveats: 'Starts in non-equilibrium bimodal speed ring; use Reverse Velocities button to test Loschmidt!',
    controls: [
      { key: 'N', label: 'Disks N', min: 25, max: 81, step: 11, unit: '', defaultValue: 64 },
      { key: 'radius', label: 'Disk radius r', min: 0.014, max: 0.028, step: 0.002, unit: 'L', defaultValue: 0.02 },
    ],
  },
  'ising-rg': {
    id: 'ising-rg',
    title: '2D Ising Lattice (Metropolis & Wolff Cluster)',
    method: 'Exact Metropolis Boltzmann weights & Wolff single-cluster percolation updates on 44 × 44 torus',
    caveats: 'Exact Onsager T_c = 2 / ln(1+√2) ≈ 2.269 J/k_B; Wolff requires h = 0.',
    controls: [
      { key: 'T', label: 'Temperature T', min: 0.8, max: 4.0, step: 0.03, unit: 'J/k_B', defaultValue: 2.27 },
      { key: 'algo', label: 'Algorithm (0=Metropolis,1=Wolff)', min: 0, max: 1, step: 1, unit: '', defaultValue: 1 },
      { key: 'h', label: 'External field h', min: -0.4, max: 0.4, step: 0.05, unit: 'J', defaultValue: 0 },
    ],
  },
  'schwarzschild-orbits': {
    id: 'schwarzschild-orbits',
    title: 'Schwarzschild Relativistic Geodesics & ISCO',
    method: 'Classical RK4 on exact relativistic Binet/geodesic equation with −Mℓ²/r³ term (G = c = M = 1)',
    caveats: 'Horizon at r_s = 2M, photon sphere at 3M, ISCO at 6M (ℓ_ISCO = √12 ≈ 3.464 M).',
    controls: [
      { key: 'ell', label: 'Angular momentum ℓ/M', min: 3.1, max: 4.8, step: 0.05, unit: 'M', defaultValue: 3.85 },
      { key: 'r0', label: 'Initial radius r₀/M', min: 5.5, max: 18, step: 0.5, unit: 'M', defaultValue: 11.5 },
      { key: 'vr0', label: 'Initial radial kick', min: -0.18, max: 0.18, step: 0.02, unit: 'c', defaultValue: 0.08 },
    ],
  },
  'friedmann-cosmos': {
    id: 'friedmann-cosmos',
    title: 'FLRW Friedmann Scale-Factor & Horizon Solver',
    method: 'RK4 integration of (ȧ/a)² = H₀²(Ω_r a⁻⁴ + Ω_m a⁻³ + Ω_k a⁻² + Ω_Λ), Δτ = 5 × 10⁻³ H₀⁻¹',
    caveats: 'Spatial curvature Ω_k = 1 − Ω_m − Ω_r − Ω_Λ computed automatically; dashed curve shows ΛCDM.',
    controls: [
      { key: 'omegaM', label: 'Matter Ω_m', min: 0.05, max: 2.6, step: 0.05, unit: '', defaultValue: 0.31 },
      { key: 'omegaL', label: 'Dark Energy Ω_Λ', min: 0.0, max: 1.5, step: 0.05, unit: '', defaultValue: 0.69 },
      { key: 'omegaR', label: 'Radiation Ω_r', min: 0.0, max: 0.4, step: 0.02, unit: '', defaultValue: 0.0 },
    ],
  },
  'schrodinger-1d': {
    id: 'schrodinger-1d',
    title: '1D Split-Step Fourier Quantum Wavepacket Sandbox',
    method: 'Symmetric Strang Split-Step FFT (N = 256 grid, Δt = 0.012, ℏ = m = 1)',
    caveats: 'Unitary to machine precision (‖ψ‖₂² = 1); periodic wrap beyond x = ±16.',
    controls: [
      { key: 'V0', label: 'Barrier height V₀', min: 0.0, max: 16.0, step: 0.5, unit: '', defaultValue: 8.5 },
      { key: 'width', label: 'Barrier width a', min: 0.3, max: 2.2, step: 0.1, unit: '', defaultValue: 0.8 },
      { key: 'k0', label: 'Packet momentum k₀', min: 2.0, max: 5.5, step: 0.25, unit: '', defaultValue: 3.8 },
      { key: 'harmonic', label: 'Mode (0=Barrier,1=Coherent HO)', min: 0, max: 1, step: 1, unit: '', defaultValue: 0 },
    ],
  },
  'feynman-paths': {
    id: 'feynman-paths',
    title: 'Path-Integral Phasor Sum & QED Vertex Explorer',
    method: 'Coherent phasor summation ∑_{j=−40}^{40} exp(i S[q_cl + α_j η]/ℏ) + valid QED vertex rules',
    caveats: 'Mode 0 displays Cornu stationary-phase spiral; Mode 1 displays tree vs 1-loop QED coupling orders.',
    controls: [
      { key: 'hbar', label: 'Effective ℏ', min: 0.06, max: 1.2, step: 0.04, unit: 'S₀', defaultValue: 0.24 },
      { key: 'mode', label: 'View (0=Path Phasors,1=QED)', min: 0, max: 1, step: 1, unit: '', defaultValue: 0 },
      { key: 'loops', label: 'QED diagram (0=e⁻e⁻→e⁻e⁻,1=Compton,2=VacPol)', min: 0, max: 2, step: 1, unit: '', defaultValue: 0 },
    ],
  },
  'ssh-topology': {
    id: 'ssh-topology',
    title: 'SSH Topological Chain & Bloch Winding Explorer',
    method: 'Exact Jacobi Hermitian diagonalisation (2N = 28 sites) + Brillouin winding integral',
    caveats: 'Chiral symmetry pins topological edge states to E ≈ 0 up to finite-size exp(−N/ξ) splitting.',
    controls: [
      { key: 'v', label: 'Intracell hopping v', min: 0.2, max: 2.0, step: 0.05, unit: 't₀', defaultValue: 0.75 },
      { key: 'w', label: 'Intercell hopping w', min: 0.2, max: 2.0, step: 0.05, unit: 't₀', defaultValue: 1.45 },
    ],
  },
  'standard-model-lab': {
    id: 'standard-model-lab',
    title: 'Higgs Mexican-Hat Vacuum & Neutrino Oscillation Lab',
    method: 'Symplectic RK4 on V(φ₁,φ₂) = −½μ²r² + ¼λr⁴ | Exact 2-flavour PMNS oscillation formula',
    caveats: 'Switch Lab Mode: 0 = Spontaneous Symmetry Breaking dynamics, 1 = Neutrino L/E oscillations.',
    controls: [
      { key: 'mode', label: 'Lab (0=Higgs Hat, 1=Neutrino)', min: 0, max: 1, step: 1, unit: '', defaultValue: 0 },
      { key: 'thetaDeg', label: 'Mixing angle θ (or kick)', min: 8, max: 45, step: 1, unit: '°', defaultValue: 34 },
      { key: 'dm2', label: '10³ × Δm² (eV²)', min: 0.5, max: 5.0, step: 0.1, unit: '10⁻³eV²', defaultValue: 2.5 },
    ],
  },
};

export const SimRunner: React.FC<{
  simId: string;
  caption: string;
  notice: string;
  presetParams?: Record<string, number>;
}> = ({ simId, caption, notice, presetParams }) => {
  const meta = SIM_REGISTRY[simId];
  const { settings } = usePhysicaStore();
  const dark = settings.readerTheme === 'dark';

  const [params, setParams] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (meta) {
      for (const c of meta.controls) {
        initial[c.key] = presetParams?.[c.key] ?? c.defaultValue;
      }
    }
    return initial;
  });

  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<0.5 | 1 | 2>(1);
  const [showInfo, setShowInfo] = useState(false);
  const [readout, setReadout] = useState('');
  const [srDescription, setSrDescription] = useState('');
  const [resetCounter, setResetCounter] = useState(0);
  const [visible, setVisible] = useState(true);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mutable simulation states kept in refs for zero-GC 60fps canvas rendering
  const dpRef = useRef<{ y: Float64Array; trail: Array<[number, number]>; E0: number } | null>(null);
  const chirikovSeedsRef = useRef<Array<[number, number]>>([]);
  const fdtdRef = useRef<Fdtd2DState | null>(null);
  const customMaskRef = useRef<Uint8Array | null>(null);
  const gasRef = useRef<HardDiskGasState | null>(null);
  const isingRef = useRef<Ising2DState | null>(null);
  const grRef = useRef<{ phi: number; u: number; du: number; trail: Array<[number, number]>; plunged: boolean } | null>(null);
  const tdseRef = useRef<SplitStep1DState | null>(null);
  const higgsRef = useRef<{ y: Float64Array; trail: Array<[number, number]> } | null>(null);

  // Pause when scrolled/flipped out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]) setVisible(entries[0].isIntersecting);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Re-initialize stateful simulations when reset or structural params change
  const initSimState = useCallback(() => {
    if (simId === 'double-pendulum') {
      const y = new Float64Array([params.theta1 ?? 2.15, params.theta2 ?? 1.65, 0, 0]);
      const E0 = doublePendulumEnergy(y, 1, params.massRatio ?? 1, 1, 1, 9.81);
      dpRef.current = { y, trail: [], E0 };
    } else if (simId === 'chirikov-chaos') {
      const nSeeds = Math.round(params.seeds ?? 16);
      const pts: Array<[number, number]> = [];
      for (let i = 0; i < nSeeds; i++) {
        pts.push([(Math.PI * (i * 3 + 1)) % (2 * Math.PI), ((i + 0.5) / nSeeds) * 2 * Math.PI - Math.PI]);
      }
      chirikovSeedsRef.current = pts;
    } else if (simId === 'fdtd-maxwell') {
      fdtdRef.current = createFdtd2D(96, 64, 0.68, params.epsR ?? 2.5, true);
    } else if (simId === 'hard-sphere-gas') {
      gasRef.current = createHardDiskGas(
        Math.round(params.N ?? 64),
        params.radius ?? 0.02,
        101,
        true
      );
    } else if (simId === 'ising-rg') {
      isingRef.current = createIsing2D(44, 42, false);
    } else if (simId === 'schwarzschild-orbits') {
      const r0 = params.r0 ?? 11.5;
      const vr0 = params.vr0 ?? 0.08;
      const ell = params.ell ?? 3.85;
      grRef.current = {
        phi: 0,
        u: 1 / r0,
        du: -vr0 / Math.max(0.5, ell),
        trail: [[r0, 0]],
        plunged: false,
      };
    } else if (simId === 'schrodinger-1d') {
      const isHarmonic = Math.round(params.harmonic ?? 0) === 1;
      const V0 = params.V0 ?? 8.5;
      const width = params.width ?? 0.8;
      const k0 = params.k0 ?? 3.8;
      tdseRef.current = createSplitStep1D(
        256,
        32,
        (x) => {
          if (isHarmonic) {
            const x0 = -3.2;
            const env = Math.exp(-0.5 * (x - x0) * (x - x0));
            return [env, 0];
          }
          const x0 = -6.0;
          const sigma = 1.3;
          const env = Math.exp(-((x - x0) * (x - x0)) / (4 * sigma * sigma));
          return [env * Math.cos(k0 * x), env * Math.sin(k0 * x)];
        },
        (x) => {
          if (isHarmonic) return 0.5 * x * x;
          return Math.abs(x) <= width * 0.5 ? V0 : 0;
        }
      );
    } else if (simId === 'standard-model-lab') {
      const ang = ((params.thetaDeg ?? 34) * Math.PI) / 180;
      higgsRef.current = {
        y: new Float64Array([0.18 * Math.cos(ang), 0.18 * Math.sin(ang), -0.15 * Math.sin(ang), 0.24 * Math.cos(ang)]),
        trail: [],
      };
    }
  }, [simId, params]);

  useEffect(() => {
    initSimState();
  }, [initSimState, resetCounter]);

  const stepAndDraw = useCallback(
    (advanceSteps: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !meta) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth || 460;
      const h = canvas.clientHeight || 205;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const fg = dark ? '#e7e5e4' : '#1c1917';
      const muted = dark ? 'rgba(231,229,228,0.28)' : 'rgba(28,25,23,0.25)';

      if (simId === 'action-paths') {
        const alpha = params.alpha ?? 0.55;
        const nMode = Math.round(params.mode ?? 2);
        const g = params.gravity ?? 9.8;
        const T = 1.4;
        const computeS = (amp: number) => {
          const N = 128;
          const dt = T / N;
          let S = 0;
          for (let i = 0; i < N; i++) {
            const t = (i + 0.5) * dt;
            const qCl = 0.5 * g * t * (T - t);
            const dqCl = 0.5 * g * (T - 2 * t);
            const eta = amp * Math.sin((nMode * Math.PI * t) / T);
            const dEta = amp * ((nMode * Math.PI) / T) * Math.cos((nMode * Math.PI * t) / T);
            const q = qCl + eta;
            const v = dqCl + dEta;
            S += (0.5 * v * v - g * q) * dt;
          }
          return S;
        };
        const sCl = computeS(0);
        const sTrial = computeS(alpha);

        // Left: trajectories q(t), Right: parabola S(alpha)
        const mid = w * 0.54;
        ctx.strokeStyle = muted;
        ctx.strokeRect(26, 18, mid - 38, h - 38);
        ctx.strokeRect(mid + 14, 18, w - mid - 28, h - 38);

        // Classical path
        ctx.strokeStyle = SEMANTIC_COLOURS.positive;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const s = i / 80;
          const t = s * T;
          const q = 0.5 * g * t * (T - t);
          const px = 30 + s * (mid - 46);
          const py = h - 32 - (q / 4.2) * (h - 62);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Perturbed trial path
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
        ctx.lineWidth = 2.1;
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const s = i / 80;
          const t = s * T;
          const q = 0.5 * g * t * (T - t) + alpha * Math.sin(nMode * Math.PI * s);
          const px = 30 + s * (mid - 46);
          const py = h - 32 - (q / 4.2) * (h - 62);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();

        // Right panel: S(alpha) - S(0) quadratic bowl
        const rx0 = mid + 22;
        const rw = w - mid - 44;
        ctx.strokeStyle = SEMANTIC_COLOURS.secondary;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const aVal = -1.5 + (3.0 * i) / 60;
          const dS = computeS(aVal) - sCl;
          const px = rx0 + ((aVal + 1.5) / 3) * rw;
          const py = h - 32 - Math.min(1, dS / 35) * (h - 64);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const dotX = rx0 + ((alpha + 1.5) / 3) * rw;
        const dotY = h - 32 - Math.min(1, (sTrial - sCl) / 35) * (h - 64);
        ctx.fillStyle = SEMANTIC_COLOURS.highlight;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        setReadout(`S_cl = ${sCl.toFixed(3)} J·s  |  S_trial = ${sTrial.toFixed(3)} J·s  |  ΔS = +${Math.max(0, sTrial - sCl).toFixed(4)} J·s`);
        setSrDescription(`Action explorer at alpha ${alpha.toFixed(2)}: ΔS equals ${(sTrial - sCl).toFixed(4)} joule seconds.`);
      } else if (simId === 'double-pendulum' && dpRef.current) {
        const dp = dpRef.current;
        const m2 = params.massRatio ?? 1;
        const dt = 0.002;
        const nSub = Math.round(advanceSteps * 8 * speed);
        for (let k = 0; k < nSub; k++) {
          dp.y = rk4Step(
            dp.y,
            (t, y, out) => doublePendulumDeriv(t, y, out, 1, m2, 1, 1, 9.81),
            0,
            dt
          );
        }
        const L = Math.min(w, h) * 0.21;
        const cx = w * 0.36;
        const cy = h * 0.44;
        const x1 = cx + L * Math.sin(dp.y[0]);
        const y1 = cy + L * Math.cos(dp.y[0]);
        const x2 = x1 + L * Math.sin(dp.y[1]);
        const y2 = y1 + L * Math.cos(dp.y[1]);

        if (nSub > 0) {
          dp.trail.push([x2, y2]);
          if (dp.trail.length > 220) dp.trail.shift();
        }

        // Fading chaotic trace
        if (dp.trail.length > 1) {
          ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          dp.trail.forEach(([tx, ty], idx) => {
            if (idx === 0) ctx.moveTo(tx, ty);
            else ctx.lineTo(tx, ty);
          });
          ctx.stroke();
        }

        // Rods and bobs
        ctx.strokeStyle = fg;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.fillStyle = SEMANTIC_COLOURS.secondary;
        ctx.beginPath();
        ctx.arc(x1, y1, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = SEMANTIC_COLOURS.positive;
        ctx.beginPath();
        ctx.arc(x2, y2, 5.5 * Math.cbrt(m2), 0, Math.PI * 2);
        ctx.fill();

        // Right inset: phase portrait (theta2, omega2)
        const rx = w * 0.68;
        ctx.strokeStyle = muted;
        ctx.strokeRect(rx, 20, w - rx - 16, h - 40);
        const px = rx + ((Math.atan2(Math.sin(dp.y[1]), Math.cos(dp.y[1])) + Math.PI) / (2 * Math.PI)) * (w - rx - 16);
        const py = h * 0.5 - Math.max(-1, Math.min(1, dp.y[3] / 12)) * (h * 0.36);
        ctx.fillStyle = SEMANTIC_COLOURS.positive;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();

        const E = doublePendulumEnergy(dp.y, 1, m2, 1, 1, 9.81);
        const relErr = Math.abs((E - dp.E0) / Math.max(1e-6, Math.abs(dp.E0)));
        setReadout(`E = ${E.toFixed(4)} J  |  |ΔE/E₀| = ${relErr.toExponential(2)}  |  ω₂ = ${dp.y[3].toFixed(2)} rad/s`);
        setSrDescription(`Double pendulum total energy ${E.toFixed(3)} joules, relative drift ${relErr.toExponential(1)}.`);
      } else if (simId === 'chirikov-chaos') {
        const K = params.K ?? 0.85;
        const padX = 28;
        const padY = 14;
        const pw = w - 2 * padX;
        const ph = h - 2 * padY;
        ctx.strokeStyle = muted;
        ctx.strokeRect(padX, padY, pw, ph);

        const seeds = chirikovSeedsRef.current;
        const palette = ['#009E73', '#56B4E9', '#E69F00', '#CC79A7', '#D55E00'];
        seeds.forEach(([th0, I0], idx) => {
          ctx.fillStyle = palette[idx % palette.length];
          let th = th0;
          let I = I0;
          for (let iter = 0; iter < 360; iter++) {
            I = I + K * Math.sin(th);
            th = ((th + I) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
            const wrappedI = ((((I + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
            const px = padX + (th / (2 * Math.PI)) * pw;
            const py = padY + ((Math.PI - wrappedI) / (2 * Math.PI)) * ph;
            ctx.fillRect(px, py, 1.5, 1.5);
          }
        });
        setReadout(`K = ${K.toFixed(2)} (${K < 0.9716 ? 'Subcritical: Global KAM barriers intact' : 'Supercritical K > 0.9716: Global chaos'})  |  Orbits: ${seeds.length}`);
        setSrDescription(`Chirikov standard map at kick strength K = ${K.toFixed(2)} with ${seeds.length} orbits.`);
      } else if (simId === 'fdtd-maxwell' && fdtdRef.current) {
        const s = fdtdRef.current;
        const epsR = params.epsR ?? 2.5;
        // Update dielectric slab live
        for (let y = 0; y < s.ny; y++) {
          for (let x = Math.floor(s.nx * 0.56); x <= Math.floor(s.nx * 0.68); x++) {
            s.invEps[y * s.nx + x] = 1 / Math.max(1, epsR);
          }
        }
        const nSub = Math.round(advanceSteps * 2 * speed);
        const mode = Math.round(params.mode ?? 0) === 0 ? 'dipole' : 'plane';
        for (let k = 0; k < nSub; k++) {
          stepFdtd2D(s, params.freq ?? 0.11, mode);
        }

        const cellW = w / s.nx;
        const cellH = h / s.ny;
        let energySum = 0;
        for (let y = 0; y < s.ny; y++) {
          for (let x = 0; x < s.nx; x++) {
            const i = y * s.nx + x;
            const ez = s.Ez[i];
            energySum += 0.5 * (ez * ez / s.invEps[i] + s.Hx[i] * s.Hx[i] + s.Hy[i] * s.Hy[i]);
            const v = Math.max(-1, Math.min(1, ez * 2.6));
            if (v >= 0) {
              ctx.fillStyle = `rgb(${Math.round(20 + 225 * v)}, ${Math.round(24 + 140 * v)}, ${Math.round(35 + 30 * v)})`;
            } else {
              const nv = -v;
              ctx.fillStyle = `rgb(${Math.round(20 + 20 * nv)}, ${Math.round(24 + 145 * nv)}, ${Math.round(35 + 215 * nv)})`;
            }
            ctx.fillRect(x * cellW, y * cellH, cellW + 0.6, cellH + 0.6);
          }
        }
        // Highlight dielectric slab outline
        ctx.strokeStyle = 'rgba(255,255,255,0.55)';
        ctx.strokeRect(Math.floor(s.nx * 0.56) * cellW, 0, Math.floor(s.nx * 0.12) * cellW, h);

        setReadout(`Step ${s.stepCount}  |  Slab index n = √ε_r = ${Math.sqrt(epsR).toFixed(2)}  |  Field Energy = ${energySum.toFixed(2)}`);
        setSrDescription(`2D FDTD wave propagation with refractive index ${Math.sqrt(epsR).toFixed(2)}.`);
      } else if (simId === 'fourier-optics') {
        const N = 64;
        const preset = Math.round(params.preset ?? 1);
        const scale = params.scale ?? 5;
        const sep = params.sep ?? 14;
        if (!customMaskRef.current) {
          customMaskRef.current = new Uint8Array(N * N);
          for (let y = 24; y <= 40; y++) {
            for (let x = 28; x <= 36; x++) customMaskRef.current[y * N + x] = 1;
          }
        }
        const re = new Float64Array(N * N);
        const im = new Float64Array(N * N);
        const half = N / 2;

        for (let y = 0; y < N; y++) {
          for (let x = 0; x < N; x++) {
            let val = 0;
            const dx = x - half;
            const dy = y - half;
            if (preset === 0) {
              if (Math.abs(dx) <= scale * 0.5 && Math.abs(dy) <= 18) val = 1;
            } else if (preset === 1) {
              if (
                (Math.abs(dx - sep * 0.5) <= scale * 0.4 || Math.abs(dx + sep * 0.5) <= scale * 0.4) &&
                Math.abs(dy) <= 18
              )
                val = 1;
            } else if (preset === 2) {
              if (dx * dx + dy * dy <= scale * scale) val = 1;
            } else if (preset === 3) {
              for (let m = -2; m <= 2; m++) {
                if (Math.abs(dx - m * sep * 0.65) <= Math.max(1, scale * 0.25) && Math.abs(dy) <= 18) val = 1;
              }
            } else {
              val = customMaskRef.current[y * N + x];
            }
            // Checkerboard sign (-1)^(x+y) centers zero spatial frequency at (N/2, N/2)!
            re[y * N + x] = val * ((x + y) % 2 === 0 ? 1 : -1);
          }
        }

        const apertureCopy = new Float64Array(re);
        fft2d(re, im, N, N, false);

        let maxI = 1e-9;
        const inten = new Float64Array(N * N);
        for (let i = 0; i < N * N; i++) {
          const v = re[i] * re[i] + im[i] * im[i];
          inten[i] = v;
          if (v > maxI) maxI = v;
        }

        const box = Math.min(h - 24, w * 0.42);
        const cell = box / N;
        const leftX = w * 0.06;
        const rightX = w * 0.53;
        const topY = (h - box) * 0.5;

        for (let y = 0; y < N; y++) {
          for (let x = 0; x < N; x++) {
            const i = y * N + x;
            const ap = Math.abs(apertureCopy[i]);
            ctx.fillStyle = ap > 0.5 ? '#fafaf9' : '#18181b';
            ctx.fillRect(leftX + x * cell, topY + y * cell, cell + 0.5, cell + 0.5);

            // Gamma-compressed irradiance log1p
            const norm = Math.log1p(180 * (inten[i] / maxI)) / Math.log1p(180);
            ctx.fillStyle = `hsl(${205 - norm * 165}, 90%, ${Math.min(92, 6 + norm * 84)}%)`;
            ctx.fillRect(rightX + x * cell, topY + y * cell, cell + 0.5, cell + 0.5);
          }
        }
        ctx.strokeStyle = muted;
        ctx.strokeRect(leftX, topY, box, box);
        ctx.strokeRect(rightX, topY, box, box);

        const names = ['Single Slit', 'Young Double Slit', 'Circular Airy Pupil', '5-Slit Grating', 'Custom Painted Mask'];
        setReadout(`Aperture: ${names[preset]}  |  Far-Field = |FFT₂{A(ξ,η)}|²  |  Grid: 64 × 64`);
        setSrDescription(`Fraunhofer diffraction pattern for ${names[preset]}.`);
      } else if (simId === 'hard-sphere-gas' && gasRef.current) {
        const gState = gasRef.current;
        if (advanceSteps > 0) {
          stepHardDiskGasEventDriven(gState, 0.014 * speed * advanceSteps);
        }
        const box = Math.min(h - 18, w * 0.46);
        const lx = 14;
        const ty = (h - box) * 0.5;
        ctx.strokeStyle = fg;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(lx, ty, box, box);

        for (let i = 0; i < gState.N; i++) {
          const spd = Math.hypot(gState.vx[i], gState.vy[i]);
          ctx.fillStyle = spd > 0.48 ? SEMANTIC_COLOURS.negative : SEMANTIC_COLOURS.secondary;
          ctx.beginPath();
          ctx.arc(
            lx + gState.x[i] * box,
            ty + gState.y[i] * box,
            Math.max(2.5, gState.radius * box),
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        // Right panel: Live speed histogram + exact 2D Maxwell-Boltzmann curve
        const rx = lx + box + 22;
        const rw = w - rx - 14;
        const bins = 10;
        const vMax = 1.05;
        const counts = new Float64Array(bins);
        for (let i = 0; i < gState.N; i++) {
          const v = Math.hypot(gState.vx[i], gState.vy[i]);
          counts[Math.min(bins - 1, Math.floor((v / vMax) * bins))]++;
        }
        const E = computeGasKineticEnergy(gState);
        const kBT = E / gState.N; // In 2D, <1/2 m v^2> = k_B T (m = 1)
        const dv = vMax / bins;

        for (let b = 0; b < bins; b++) {
          const density = counts[b] / (gState.N * dv);
          const bh = Math.min(box - 12, density * 36);
          ctx.fillStyle = 'rgba(86, 180, 233, 0.45)';
          ctx.fillRect(rx + (b / bins) * rw, ty + box - bh, rw / bins - 2, bh);
        }

        // Analytic 2D Maxwell-Boltzmann P(v) = (v / kBT) exp(-v^2 / 2kBT)
        ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const v = (i / 60) * vMax;
          const pMb = (v / Math.max(1e-6, kBT)) * Math.exp((-v * v) / (2 * Math.max(1e-6, kBT)));
          const px = rx + (i / 60) * rw;
          const py = ty + box - Math.min(box - 6, pMb * 36);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const H = computeBoltzmannH(gState);
        setReadout(`Collisions: ${gState.collisions}  |  E_kin = ${E.toFixed(5)} (exact)  |  Boltzmann H = ${H.toFixed(3)}`);
        setSrDescription(`Hard sphere gas after ${gState.collisions} collisions, kinetic energy ${E.toFixed(4)}, Boltzmann H ${H.toFixed(2)}.`);
      } else if (simId === 'ising-rg' && isingRef.current) {
        const s = isingRef.current;
        const T = params.T ?? 2.27;
        const hField = params.h ?? 0;
        const useWolff = Math.round(params.algo ?? 1) === 1 && Math.abs(hField) < 1e-6;
        const nSub = Math.round(advanceSteps * 2 * speed);
        for (let k = 0; k < nSub; k++) {
          if (useWolff) stepIsingWolffCluster(s, T, 1);
          else stepIsingMetropolisSweep(s, T, 1, hField);
        }

        const box = Math.min(h - 14, w * 0.5);
        const cell = box / s.L;
        const lx = 18;
        const ty = (h - box) * 0.5;
        for (let y = 0; y < s.L; y++) {
          for (let x = 0; x < s.L; x++) {
            ctx.fillStyle = s.spins[y * s.L + x] > 0 ? '#009E73' : dark ? '#1f2937' : '#e7e5e4';
            ctx.fillRect(lx + x * cell, ty + y * cell, cell + 0.4, cell + 0.4);
          }
        }
        ctx.strokeStyle = muted;
        ctx.strokeRect(lx, ty, box, box);

        const mag = computeIsingMagnetisation(s);
        const eSpin = computeIsingEnergyPerSpin(s, 1, hField);
        // Right side: Onsager exact spontaneous magnetisation curve M_exact(T) = (1 - sinh^-4(2/T))^(1/8)
        const rx = lx + box + 24;
        const rw = w - rx - 16;
        ctx.strokeStyle = muted;
        ctx.strokeRect(rx, ty, rw, box);
        ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const temp = 0.8 + (3.2 * i) / 80;
          const mOns =
            temp < ONSAGER_TC ? Math.pow(Math.max(0, 1 - Math.pow(Math.sinh(2 / temp), -4)), 1 / 8) : 0;
          const px = rx + (i / 80) * rw;
          const py = ty + box - mOns * (box - 16) - 6;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Current (T, |M|) marker
        const mx = rx + ((T - 0.8) / 3.2) * rw;
        const my = ty + box - Math.abs(mag) * (box - 16) - 6;
        ctx.fillStyle = SEMANTIC_COLOURS.positive;
        ctx.beginPath();
        ctx.arc(mx, my, 4.5, 0, Math.PI * 2);
        ctx.fill();

        setReadout(`T = ${T.toFixed(2)} (T_c ≈ 2.269)  |  |M| = ${Math.abs(mag).toFixed(3)}  |  E/N = ${eSpin.toFixed(3)} J`);
        setSrDescription(`2D Ising lattice at temperature ${T.toFixed(2)}, magnetisation magnitude ${Math.abs(mag).toFixed(2)}.`);
      } else if (simId === 'schwarzschild-orbits' && grRef.current) {
        const g = grRef.current;
        const ell = params.ell ?? 3.85;
        const dPhi = 0.018 * speed;
        const nSub = Math.round(advanceSteps * 4);
        for (let k = 0; k < nSub && !g.plunged; k++) {
          const next = rk4Step(
            new Float64Array([g.u, g.du]),
            (_p, y, out) => {
              out[0] = y[1];
              out[1] = 1 / (ell * ell) - y[0] + 3 * y[0] * y[0];
            },
            g.phi,
            dPhi
          );
          g.u = next[0];
          g.du = next[1];
          g.phi += dPhi;
          const r = 1 / Math.max(1e-4, g.u);
          if (r <= 2.02 || r > 45) {
            g.plunged = r <= 2.02;
            break;
          }
          g.trail.push([r * Math.cos(g.phi), r * Math.sin(g.phi)]);
          if (g.trail.length > 520) g.trail.shift();
        }

        const cx = w * 0.34;
        const cy = h * 0.5;
        const scale = Math.min(w, h) * 0.022;

        // ISCO r=6M dashed, photon sphere r=3M dotted, event horizon r=2M black disk
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(86, 180, 233, 0.45)';
        ctx.beginPath();
        ctx.arc(cx, cy, 6 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(230, 159, 0, 0.55)';
        ctx.beginPath();
        ctx.arc(cx, cy, 3 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#09090b';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 2 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        if (g.trail.length > 1) {
          ctx.strokeStyle = SEMANTIC_COLOURS.positive;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          g.trail.forEach(([tx, ty], idx) => {
            const px = cx + tx * scale;
            const py = cy - ty * scale;
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
          const last = g.trail[g.trail.length - 1];
          ctx.fillStyle = SEMANTIC_COLOURS.highlight;
          ctx.beginPath();
          ctx.arc(cx + last[0] * scale, cy - last[1] * scale, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Right panel: V_eff(r)
        const rx = w * 0.64;
        const rw = w - rx - 14;
        ctx.strokeStyle = muted;
        ctx.strokeRect(rx, 16, rw, h - 32);
        ctx.strokeStyle = SEMANTIC_COLOURS.secondary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const r = 2.2 + (20 * i) / 80;
          const vEff = -1 / r + (ell * ell) / (2 * r * r) - (ell * ell) / (r * r * r);
          const px = rx + (i / 80) * rw;
          const py = h * 0.45 - Math.max(-0.18, Math.min(0.12, vEff)) * 380;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const currR = 1 / Math.max(1e-4, g.u);
        setReadout(`r = ${currR.toFixed(2)} M  |  ℓ = ${ell.toFixed(2)} M (ISCO at 6M, √12≈3.46M)  |  ${g.plunged ? 'PLUNGED INTO r=2M!' : 'Orbiting'}`);
        setSrDescription(`Schwarzschild orbit at radius ${currR.toFixed(1)} M with angular momentum ${ell.toFixed(2)} M.`);
      } else if (simId === 'friedmann-cosmos') {
        const om = params.omegaM ?? 0.31;
        const ol = params.omegaL ?? 0.69;
        const orad = params.omegaR ?? 0.0;
        const ok = 1 - om - ol - orad;
        const sol = solveFriedmannTrajectory(om, orad, ol, 2.4, 0.01);
        const lcdm = solveFriedmannTrajectory(0.31, 0, 0.69, 2.4, 0.01);

        const padX = 38;
        const padY = 18;
        const pw = w - padX - 18;
        const ph = h - 2 * padY;
        ctx.strokeStyle = muted;
        ctx.strokeRect(padX, padY, pw, ph);

        // Reference LCDM dashed
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = muted;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        lcdm.tau.forEach((tVal, i) => {
          const px = padX + (tVal / 2.4) * pw;
          const py = padY + ph - Math.min(1, lcdm.a[i] / 3.2) * ph;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.restore();

        // User universe curve
        ctx.strokeStyle = '#9A8CFF';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        sol.tau.forEach((tVal, i) => {
          const px = padX + (tVal / 2.4) * pw;
          const py = padY + ph - Math.min(1, sol.a[i] / 3.2) * ph;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();

        const geometry = Math.abs(ok) < 0.02 ? 'Flat (k=0)' : ok < 0 ? 'Closed (k=+1)' : 'Open (k=−1)';
        const q0 = 0.5 * om + orad - ol;
        setReadout(`${geometry}, Ω_k = ${ok.toFixed(2)}  |  Deceleration q₀ = ${q0.toFixed(2)} (${q0 < 0 ? 'Accelerating' : 'Decelerating'})`);
        setSrDescription(`Friedmann universe with ${geometry} geometry and deceleration parameter q0 = ${q0.toFixed(2)}.`);
      } else if (simId === 'schrodinger-1d' && tdseRef.current) {
        const s = tdseRef.current;
        const isHarmonic = Math.round(params.harmonic ?? 0) === 1;
        const V0 = params.V0 ?? 8.5;
        const width = params.width ?? 0.8;
        const k0 = params.k0 ?? 3.8;
        for (let i = 0; i < s.N; i++) {
          s.V[i] = isHarmonic ? 0.5 * s.x[i] * s.x[i] : Math.abs(s.x[i]) <= width * 0.5 ? V0 : 0;
        }

        const nSub = Math.round(advanceSteps * 3 * speed);
        for (let k = 0; k < nSub; k++) {
          stepSplitStep1D(s, 0.012, 1, 1);
        }

        const yBase = h - 22;
        // Draw potential V(x)
        ctx.fillStyle = dark ? 'rgba(230, 159, 0, 0.22)' : 'rgba(217, 119, 6, 0.2)';
        ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(16, yBase);
        for (let i = 0; i < s.N; i++) {
          const px = 16 + (i / (s.N - 1)) * (w - 32);
          const py = yBase - Math.min(1, s.V[i] / 18) * (h - 46);
          ctx.lineTo(px, py);
        }
        ctx.lineTo(w - 16, yBase);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw phase-coloured probability bars |psi(x)|^2
        let maxP = 0.05;
        let transProb = 0;
        for (let i = 0; i < s.N; i++) {
          const p = s.re[i] * s.re[i] + s.im[i] * s.im[i];
          if (p > maxP) maxP = p;
          if (s.x[i] > width * 0.5) transProb += p * s.dx;
        }
        const barW = (w - 32) / s.N;
        for (let i = 0; i < s.N; i++) {
          const p = s.re[i] * s.re[i] + s.im[i] * s.im[i];
          const bh = (p / maxP) * (h - 48);
          ctx.fillStyle = complexToCssColor(s.re[i], s.im[i], maxP);
          ctx.fillRect(16 + i * barW, yBase - bh, barW + 0.5, bh);
        }

        const norm = computeNorm1D(s);
        const E0 = 0.5 * k0 * k0;
        const exactT = analyticSquareBarrierTransmission(E0, V0, width);
        setReadout(
          isHarmonic
            ? `Coherent Harmonic State  |  ‖ψ‖² = ${norm.toFixed(6)}`
            : `‖ψ‖² = ${norm.toFixed(6)}  |  Measured T_right = ${(transProb * 100).toFixed(1)}%  |  Plane-wave T(E₀) = ${(exactT * 100).toFixed(1)}%`
        );
        setSrDescription(`1D quantum wavepacket norm ${norm.toFixed(6)}, right-side transmission ${(transProb * 100).toFixed(1)} percent.`);
      } else if (simId === 'feynman-paths') {
        const hbar = params.hbar ?? 0.24;
        const mode = Math.round(params.mode ?? 0);
        const qedDiag = Math.round(params.loops ?? 0);

        if (mode === 0) {
          // Left: Path bundle, Right: Phasor Cornu spiral sum exp(i alpha^2 / hbar)
          const mid = w * 0.48;
          for (let j = -14; j <= 14; j++) {
            const a = j / 14;
            const phase = (a * a * 2.2) / hbar;
            ctx.strokeStyle = j === 0 ? SEMANTIC_COLOURS.positive : `hsla(${((phase * 180) / Math.PI + 360) % 360}, 80%, 55%, 0.42)`;
            ctx.lineWidth = j === 0 ? 2.6 : 1.1;
            ctx.beginPath();
            for (let i = 0; i <= 40; i++) {
              const s = i / 40;
              const px = 20 + s * (mid - 32);
              const py = h * 0.5 - (0.3 * Math.sin(Math.PI * s) + a * 0.65 * Math.sin(Math.PI * s)) * (h * 0.42);
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }

          // Cornu spiral of little arrows
          let sx = w * 0.73;
          let sy = h * 0.56;
          const stepLen = 5.2;
          const pts: Array<[number, number]> = [[sx, sy]];
          for (let j = -32; j <= 32; j++) {
            const a = j / 16;
            const ph = (a * a) / hbar;
            sx += stepLen * Math.cos(ph);
            sy -= stepLen * Math.sin(ph);
            pts.push([sx, sy]);
          }
          const dxMid = (pts[pts.length - 1][0] - pts[0][0]) * 0.5;
          const dyMid = (pts[pts.length - 1][1] - pts[0][1]) * 0.5;
          ctx.strokeStyle = SEMANTIC_COLOURS.secondary;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          pts.forEach(([px, py], i) => {
            if (i === 0) ctx.moveTo(px - dxMid, py - dyMid);
            else ctx.lineTo(px - dxMid, py - dyMid);
          });
          ctx.stroke();

          // Resultant amplitude arrow
          ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(pts[0][0] - dxMid, pts[0][1] - dyMid);
          ctx.lineTo(pts[pts.length - 1][0] - dxMid, pts[pts.length - 1][1] - dyMid);
          ctx.stroke();

          setReadout(`Effective ℏ = ${hbar.toFixed(2)} S₀  |  Stationary window Δα ~ √ℏ = ${Math.sqrt(hbar).toFixed(2)}`);
          setSrDescription(`Feynman path integral Cornu phasor spiral at hbar = ${hbar.toFixed(2)}.`);
        } else {
          // Valid QED Feynman diagram renderer
          const cx = w * 0.5;
          const cy = h * 0.5;
          ctx.strokeStyle = fg;
          ctx.lineWidth = 2.2;
          if (qedDiag === 0) {
            // Moller/Bhabha t-channel photon exchange: 2 vertices -> O(e^2) -> alpha^2 cross section
            ctx.beginPath();
            ctx.moveTo(cx - 110, cy - 55);
            ctx.lineTo(cx - 35, cy);
            ctx.lineTo(cx - 110, cy + 55);
            ctx.moveTo(cx + 110, cy - 55);
            ctx.lineTo(cx + 35, cy);
            ctx.lineTo(cx + 110, cy + 55);
            ctx.stroke();
            // Wavy photon propagator
            ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
            ctx.beginPath();
            for (let i = 0; i <= 40; i++) {
              const x = cx - 35 + (70 * i) / 40;
              const y = cy + 6 * Math.sin((i / 40) * Math.PI * 6);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.stroke();
            setReadout(`e⁻e⁻ → e⁻e⁻ Tree Exchange  |  Vertices V = 2  |  Amplitude 𝓜 ∝ e² (dσ ∝ α²)`);
          } else if (qedDiag === 1) {
            // Compton e + gamma -> e + gamma
            ctx.beginPath();
            ctx.moveTo(cx - 110, cy + 45);
            ctx.lineTo(cx - 40, cy);
            ctx.lineTo(cx + 40, cy);
            ctx.lineTo(cx + 110, cy + 45);
            ctx.stroke();
            ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
            for (const [xA, yA, xB, yB] of [
              [cx - 110, cy - 50, cx - 40, cy],
              [cx + 40, cy, cx + 110, cy - 50],
            ]) {
              ctx.beginPath();
              for (let i = 0; i <= 30; i++) {
                const s = i / 30;
                const x = xA + (xB - xA) * s;
                const y = yA + (yB - yA) * s + 5 * Math.sin(s * Math.PI * 6);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();
            }
            setReadout(`Compton Scattering e⁻γ → e⁻γ  |  Vertices V = 2  |  Klein–Nishina dσ ∝ α²`);
          } else {
            // 1-loop Vacuum Polarization
            ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
            for (const [xA, xB] of [
              [cx - 120, cx - 34],
              [cx + 34, cx + 120],
            ]) {
              ctx.beginPath();
              for (let i = 0; i <= 28; i++) {
                const s = i / 28;
                const x = xA + (xB - xA) * s;
                const y = cy + 6 * Math.sin(s * Math.PI * 5);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.stroke();
            }
            ctx.strokeStyle = SEMANTIC_COLOURS.secondary;
            ctx.beginPath();
            ctx.arc(cx, cy, 34, 0, Math.PI * 2);
            ctx.stroke();
            setReadout(`1-Loop e⁺e⁻ Vacuum Polarisation Π(q²)  |  Vertices V = 2  |  Drives running α(Q²)`);
          }
          setSrDescription(`QED Feynman diagram mode ${qedDiag}.`);
        }
      } else if (simId === 'ssh-topology') {
        const v = params.v ?? 0.75;
        const wHop = params.w ?? 1.45;
        const nu = computeSshWindingNumber(v, wHop);
        const { eigenvalues, eigenvectors } = solveSshOpenChain(14, v, wHop);
        const sites = eigenvalues.length;

        // Left: Winding curve in (dx, dy) plane
        const cx = w * 0.25;
        const cy = h * 0.5;
        const scale = Math.min(w, h) * 0.16;
        ctx.strokeStyle = muted;
        ctx.beginPath();
        ctx.moveTo(cx - 70, cy);
        ctx.lineTo(cx + 70, cy);
        ctx.moveTo(cx, cy - 70);
        ctx.lineTo(cx, cy + 70);
        ctx.stroke();

        // Origin gap-closing point (0,0)
        ctx.fillStyle = SEMANTIC_COLOURS.negative;
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = nu === 1 ? '#CC66A8' : SEMANTIC_COLOURS.secondary;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let i = 0; i <= 90; i++) {
          const k = -Math.PI + (2 * Math.PI * i) / 90;
          const dx = v + wHop * Math.cos(k);
          const dy = wHop * Math.sin(k);
          const px = cx + dx * scale;
          const py = cy - dy * scale;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Middle: Eigenvalue spectrum E_n
        const mx = w * 0.53;
        const mw = w * 0.18;
        ctx.strokeStyle = muted;
        ctx.strokeRect(mx, 16, mw, h - 32);
        for (let n = 0; n < sites; n++) {
          const E = eigenvalues[n];
          const isMidGap = Math.abs(E) < 0.18 && wHop > v;
          ctx.fillStyle = isMidGap ? SEMANTIC_COLOURS.highlight : fg;
          const px = mx + ((n + 0.5) / sites) * mw;
          const py = cy - (E / 3.8) * (h * 0.42);
          ctx.beginPath();
          ctx.arc(px, py, isMidGap ? 3.8 : 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Right: Edge state |psi|^2 across the 28 lattice sites for middle state n = sites/2
        const rx = w * 0.74;
        const rw = w - rx - 12;
        const midCol = Math.floor(sites / 2);
        for (let site = 0; site < sites; site++) {
          const amp1 = eigenvectors[site * sites + midCol - 1];
          const amp2 = eigenvectors[site * sites + midCol];
          const p = 0.5 * (amp1 * amp1 + amp2 * amp2);
          const bh = Math.min(h - 36, p * (h - 24) * 2.2);
          ctx.fillStyle = site % 2 === 0 ? '#CC66A8' : SEMANTIC_COLOURS.secondary;
          ctx.fillRect(rx + (site / sites) * rw, h - 18 - bh, Math.max(2, rw / sites - 1), bh);
        }

        setReadout(`Winding ν = ${nu} (${nu === 1 ? 'TOPOLOGICAL: 2 Zero-Energy Edge Modes!' : 'Trivial Insulator'})  |  Bulk Gap = ${(2 * Math.abs(v - wHop)).toFixed(2)} t₀`);
        setSrDescription(`SSH model with v=${v.toFixed(2)}, w=${wHop.toFixed(2)}, winding number ${nu}.`);
      } else if (simId === 'standard-model-lab') {
        const mode = Math.round(params.mode ?? 0);
        if (mode === 0 && higgsRef.current) {
          const hg = higgsRef.current;
          const nSub = Math.round(advanceSteps * 4 * speed);
          for (let k = 0; k < nSub; k++) {
            hg.y = rk4Step(
              hg.y,
              (_t, y, out) => {
                const r2 = y[0] * y[0] + y[1] * y[1];
                // V = -1/2 r^2 + 1/4 r^4 -> -grad V = (1 - r^2) (x, y)
                const factor = 2.4 * (1 - r2);
                out[0] = y[2];
                out[1] = y[3];
                out[2] = factor * y[0];
                out[3] = factor * y[1];
              },
              0,
              0.015
            );
            hg.trail.push([hg.y[0], hg.y[1]]);
            if (hg.trail.length > 260) hg.trail.shift();
          }

          const cx = w * 0.5;
          const cy = h * 0.5;
          const R = Math.min(w, h) * 0.34;
          // Vacuum circle |phi| = v = 1
          ctx.strokeStyle = 'rgba(204, 102, 168, 0.55)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, R, 0, Math.PI * 2);
          ctx.stroke();

          if (hg.trail.length > 1) {
            ctx.strokeStyle = SEMANTIC_COLOURS.secondary;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            hg.trail.forEach(([tx, ty], i) => {
              if (i === 0) ctx.moveTo(cx + tx * R, cy - ty * R);
              else ctx.lineTo(cx + tx * R, cy - ty * R);
            });
            ctx.stroke();
          }
          ctx.fillStyle = SEMANTIC_COLOURS.highlight;
          ctx.beginPath();
          ctx.arc(cx + hg.y[0] * R, cy - hg.y[1] * R, 5, 0, Math.PI * 2);
          ctx.fill();

          const rNow = Math.hypot(hg.y[0], hg.y[1]);
          setReadout(`|Φ|/v = ${rNow.toFixed(3)}  |  Radial = Massive Higgs h(125 GeV), Angular = Massless Goldstone`);
          setSrDescription(`Mexican hat Higgs potential dynamics at radius ${rNow.toFixed(2)} v.`);
        } else {
          // Mode 1: Two-flavour neutrino oscillation P(nu_alpha -> nu_beta) vs L/E
          const theta = ((params.thetaDeg ?? 34) * Math.PI) / 180;
          const dm2 = (params.dm2 ?? 2.5) * 1e-3;
          const padX = 36;
          const padY = 18;
          const pw = w - padX - 18;
          const ph = h - 2 * padY;
          ctx.strokeStyle = muted;
          ctx.strokeRect(padX, padY, pw, ph);

          ctx.strokeStyle = SEMANTIC_COLOURS.positive;
          ctx.lineWidth = 2.3;
          ctx.beginPath();
          for (let i = 0; i <= 200; i++) {
            const lOverE = (i / 200) * 1800; // km / GeV
            const pApp = neutrinoOscillationAppearanceProb(theta, dm2, lOverE, 1);
            const px = padX + (i / 200) * pw;
            const py = padY + ph - pApp * (ph - 8);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          const amp = Math.pow(Math.sin(2 * theta), 2);
          const firstMax = Math.PI / (2 * 1.26693 * dm2);
          setReadout(`Amplitude sin²(2θ) = ${amp.toFixed(3)}  |  1st Oscillation Max L/E = ${firstMax.toFixed(0)} km/GeV`);
          setSrDescription(`Neutrino oscillation probability with mixing amplitude ${amp.toFixed(2)} and first maximum at ${firstMax.toFixed(0)} km per GeV.`);
        }
      }
    },
    [simId, meta, params, dark, speed]
  );

  // Animation loop when playing & visible
  useEffect(() => {
    stepAndDraw(0);
    if (!playing || !visible) return;
    let raf = 0;
    const loop = () => {
      stepAndDraw(1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, visible, stepAndDraw]);

  // Interactive canvas clicks (Chirikov orbit seeding & Fourier Optics custom aperture painting)
  const handleCanvasPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (simId === 'chirikov-chaos' && e.type === 'pointerdown') {
      const th = Math.max(0, Math.min(2 * Math.PI, ((x - 28) / (rect.width - 56)) * 2 * Math.PI));
      const I = Math.PI - Math.max(0, Math.min(1, (y - 14) / (rect.height - 28))) * 2 * Math.PI;
      chirikovSeedsRef.current = [...chirikovSeedsRef.current.slice(-28), [th, I]];
      stepAndDraw(0);
    } else if (simId === 'fourier-optics' && (e.buttons === 1 || e.type === 'pointerdown')) {
      const box = Math.min(rect.height - 24, rect.width * 0.42);
      const leftX = rect.width * 0.06;
      const topY = (rect.height - box) * 0.5;
      const gx = Math.floor(((x - leftX) / box) * 64);
      const gy = Math.floor(((y - topY) / box) * 64);
      if (gx >= 1 && gx < 63 && gy >= 1 && gy < 63 && customMaskRef.current) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            customMaskRef.current[(gy + dy) * 64 + (gx + dx)] = 1;
          }
        }
        setParams((p) => ({ ...p, preset: 4 }));
        stepAndDraw(0);
      }
    }
  };

  if (!meta) {
    return (
      <div className="rounded border border-red-500/40 p-3 text-xs text-red-500">
        Missing simulation module: {simId}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`my-3 rounded-lg border p-3 font-sans-ui ${
        dark
          ? 'border-stone-700/90 bg-stone-900/90 text-stone-100'
          : 'border-stone-300 bg-white/95 text-stone-900'
      }`}
    >
      {/* Header bar */}
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold tracking-wide uppercase opacity-80">
          Interactive Simulation · {meta.title}
        </span>
        <div className="flex items-center gap-1">
          {simId === 'hard-sphere-gas' && (
            <button
              type="button"
              onClick={() => {
                if (gasRef.current) {
                  reverseHardDiskVelocities(gasRef.current);
                  stepAndDraw(0);
                }
              }}
              className="rounded bg-amber-600 px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-amber-500"
            >
              Reverse Velocities (v → −v)
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowInfo((v) => !v)}
            aria-label="Numerical method and accuracy details"
            className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] ${
              showInfo ? 'bg-amber-500/20 text-amber-500' : 'opacity-75 hover:opacity-100'
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            Method
          </button>
        </div>
      </div>

      {showInfo && (
        <div
          className={`mb-2 rounded border px-2.5 py-1.5 text-[11px] leading-snug ${
            dark
              ? 'border-amber-500/30 bg-stone-950/90 text-stone-300'
              : 'border-amber-600/30 bg-amber-50/90 text-stone-800'
          }`}
        >
          <div>
            <strong>Integrator:</strong> {meta.method}
          </div>
          <div className="mt-0.5 opacity-85">
            <strong>Notes:</strong> {meta.caveats}
          </div>
        </div>
      )}

      {/* Simulation canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={handleCanvasPointer}
        onPointerMove={handleCanvasPointer}
        className={`h-[196px] w-full rounded ${
          dark ? 'bg-stone-950' : 'bg-stone-100'
        } cursor-crosshair`}
      />

      {/* Screen-reader live region */}
      <div className="sr-only" aria-live="polite">
        {srDescription}
      </div>

      {/* Live observable telemetry */}
      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 font-mono-code text-[10.5px] opacity-85">
        <span>{readout}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause simulation' : 'Play simulation'}
            className="inline-flex h-6 w-6 items-center justify-center rounded bg-amber-600 text-white hover:bg-amber-500"
          >
            {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              stepAndDraw(1);
            }}
            aria-label="Single step simulation"
            className="inline-flex h-6 w-6 items-center justify-center rounded border border-current/20"
            title="Step forward"
          >
            <StepForward className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => setResetCounter((c) => c + 1)}
            aria-label="Reset simulation to exact initial seed"
            className="inline-flex h-6 w-6 items-center justify-center rounded border border-current/20"
            title="Deterministic Reset"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
            className="rounded border border-current/20 px-1.5 py-0.5 text-[10px]"
            title="Simulation speed"
          >
            {speed}×
          </button>
        </div>
      </div>

      {/* Auto-generated parameter sliders */}
      <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-1.5 sm:grid-cols-2">
        {meta.controls.map((ctrl) => {
          const val = params[ctrl.key] ?? ctrl.defaultValue;
          return (
            <label key={ctrl.key} className="flex flex-col text-[11px]">
              <span className="flex justify-between opacity-85">
                <span>{ctrl.label}</span>
                <span className="font-mono-code">
                  {val}
                  {ctrl.unit ? ` ${ctrl.unit}` : ''}
                </span>
              </span>
              <input
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                value={val}
                onChange={(e) => {
                  const num = parseFloat(e.target.value);
                  setParams((prev) => ({ ...prev, [ctrl.key]: num }));
                }}
                className="h-1.5 w-full cursor-pointer accent-amber-600"
              />
            </label>
          );
        })}
      </div>

      {/* What to notice pedagogical guide */}
      <div
        className={`mt-2 rounded px-2.5 py-1.5 text-[11.5px] leading-snug ${
          dark ? 'bg-amber-500/10 text-amber-200/95' : 'bg-amber-100/75 text-amber-950'
        }`}
      >
        <strong>What to notice:</strong> {notice}
      </div>

      <div className="mt-1 text-[11px] italic opacity-70">{caption}</div>
    </div>
  );
};
