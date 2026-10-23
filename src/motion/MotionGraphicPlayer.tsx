import React, { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import { Pause, Play, RotateCcw, FileText } from 'lucide-react';
import { SEMANTIC_COLOURS } from '@/lib/colour';
import { usePhysicaStore } from '@/state/store';

export interface MotionBeat {
  at: number; // [0, 1]
  narration: string;
  tex: string;
}

export interface MotionSceneSpec {
  id: string;
  title: string;
  durationSec: number;
  beats: MotionBeat[];
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, u: number, dark: boolean) => void;
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  w: number,
  h: number,
  xLabel: string,
  yLabel: string,
  dark: boolean
) {
  ctx.save();
  ctx.strokeStyle = dark ? 'rgba(220,215,205,0.35)' : 'rgba(50,45,38,0.38)';
  ctx.fillStyle = dark ? 'rgba(220,215,205,0.78)' : 'rgba(50,45,38,0.78)';
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0 + w, y0);
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0, y0 - h);
  ctx.stroke();
  ctx.font = '500 11px Inter, sans-serif';
  ctx.fillText(xLabel, x0 + w - 24, y0 + 16);
  ctx.fillText(yLabel, x0 + 6, y0 - h + 10);
  ctx.restore();
}

export const MOTION_SCENES: Record<string, MotionSceneSpec> = {
  'least-action-variation': {
    id: 'least-action-variation',
    title: 'Stationary Action & First-Order Variation',
    durationSec: 8,
    beats: [
      {
        at: 0,
        narration: 'Fix endpoints q(t₁) and q(t₂). The classical trajectory q_cl(t) arches smoothly between them.',
        tex: 'q_{\\mathrm{cl}}(t) : \\quad m\\ddot{q} = -\\frac{\\partial V}{\\partial q}',
      },
      {
        at: 0.34,
        narration: 'Add a finite deformation q(t) = q_cl(t) + ε η(t) vanishing at both endpoints: its action S is strictly larger.',
        tex: 'S[q_{\\mathrm{cl}} + \\varepsilon\\eta] > S[q_{\\mathrm{cl}}]',
      },
      {
        at: 0.68,
        narration: 'As ε → 0, the difference ΔS vanishes quadratically O(ε²), proving first-order stationarity δS = 0.',
        tex: 'S[q_{\\mathrm{cl}} + \\varepsilon\\eta] - S[q_{\\mathrm{cl}}] = \\mathcal{O}(\\varepsilon^2) \\implies \\delta S = 0',
      },
    ],
    draw(ctx, w, h, u, dark) {
      drawAxes(ctx, 42, h - 28, w - 70, h - 52, 't', 'q(t)', dark);
      const eps = u < 0.34 ? 0 : u < 0.68 ? Math.sin(((u - 0.34) / 0.34) * Math.PI) * 0.85 : (1 - (u - 0.68) / 0.32) * 0.45;
      const xStart = 55;
      const xEnd = w - 45;
      const yBase = h - 38;

      // Classical curve
      ctx.strokeStyle = SEMANTIC_COLOURS.positive;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const s = i / 80;
        const x = xStart + s * (xEnd - xStart);
        const qCl = 4 * s * (1 - s) * 0.72 + 0.15 * s;
        const y = yBase - qCl * (h - 76);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Perturbed path
      if (Math.abs(eps) > 0.01) {
        ctx.save();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const s = i / 80;
          const x = xStart + s * (xEnd - xStart);
          const qCl = 4 * s * (1 - s) * 0.72 + 0.15 * s;
          const eta = 0.28 * eps * Math.sin(2 * Math.PI * s) * Math.sin(Math.PI * s);
          const y = yBase - (qCl + eta) * (h - 76);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Endpoints
      for (const s of [0, 1]) {
        const x = xStart + s * (xEnd - xStart);
        const qCl = 0.15 * s;
        const y = yBase - qCl * (h - 76);
        ctx.fillStyle = dark ? '#f5f5f4' : '#1c1917';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },

  'noether-symmetry-flow': {
    id: 'noether-symmetry-flow',
    title: 'Continuous Symmetry Generating Conserved Noether Charge',
    durationSec: 8,
    beats: [
      {
        at: 0,
        narration: 'A central potential V(r) is invariant under continuous planar rotations φ → φ + ε.',
        tex: '\\delta\\phi = \\varepsilon, \\qquad \\frac{\\partial L}{\\partial \\phi} = 0',
      },
      {
        at: 0.45,
        narration: 'Rotating the entire orbit by angle ε maps a physical solution onto another solution of identical action S.',
        tex: 'S[r, \\phi + \\varepsilon] = S[r, \\phi]',
      },
      {
        at: 0.75,
        narration: 'Boundary cancellation along segments forces canonical angular momentum p_φ = m r² φ̇ to remain constant!',
        tex: 'Q = \\frac{\\partial L}{\\partial \\dot{\\phi}} = m r^2 \\dot{\\phi} = \\mathrm{const}',
      },
    ],
    draw(ctx, w, h, u, dark) {
      const cx = w * 0.5;
      const cy = h * 0.52;
      // Equipotential rings
      for (let r = 22; r <= 76; r += 18) {
        ctx.strokeStyle = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.09)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = SEMANTIC_COLOURS.highlight;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      const rotShift = u > 0.35 ? Math.min(1, (u - 0.35) / 0.35) * 0.55 : 0;
      for (const [shift, col, dash] of [
        [0, SEMANTIC_COLOURS.positive, false],
        [rotShift, SEMANTIC_COLOURS.secondary, true],
      ] as const) {
        if (dash && rotShift < 0.02) continue;
        ctx.save();
        if (dash) ctx.setLineDash([4, 4]);
        ctx.strokeStyle = col;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 90; i++) {
          const th = (i / 90) * Math.PI * 2;
          const r = 46 / (1 + 0.38 * Math.cos(th - shift));
          const x = cx + r * Math.cos(th);
          const y = cy + r * Math.sin(th);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }
      // Moving particle sweeping equal areas
      const pAngle = u * Math.PI * 2;
      const pr = 46 / (1 + 0.38 * Math.cos(pAngle));
      ctx.fillStyle = SEMANTIC_COLOURS.positive;
      ctx.beginPath();
      ctx.arc(cx + pr * Math.cos(pAngle), cy + pr * Math.sin(pAngle), 4.5, 0, Math.PI * 2);
      ctx.fill();
    },
  },

  'liouville-phase-area': {
    id: 'liouville-phase-area',
    title: 'Liouville Theorem: Filamentation at Constant Area',
    durationSec: 8,
    beats: [
      {
        at: 0,
        narration: 'Start with a compact circular droplet of initial states in 2D canonical phase space (q, p).',
        tex: '\\mathcal{A}(0) = \\iint_{\\mathcal{D}(0)} dq\\,dp',
      },
      {
        at: 0.45,
        narration: 'Anharmonic frequency shear ω(I) stretches outer radii faster than inner radii into a spiral.',
        tex: '\\nabla_{(q,p)}\\cdot(\\dot{q}, \\dot{p}) = \\frac{\\partial^2 H}{\\partial q\\partial p} - \\frac{\\partial^2 H}{\\partial p\\partial q} = 0',
      },
      {
        at: 0.78,
        narration: 'Fine-grained symplectic area A(t) = A(0) stays constant while coarse-grained hull volume grows!',
        tex: '\\mathcal{A}(t) \\equiv \\mathcal{A}(0) \\quad \\forall t',
      },
    ],
    draw(ctx, w, h, u, dark) {
      drawAxes(ctx, 40, h - 24, w - 70, h - 46, 'q', 'p', dark);
      const cx = w * 0.5;
      const cy = h * 0.5;
      const shear = u * 4.2;

      ctx.fillStyle = 'rgba(0, 158, 115, 0.28)';
      ctx.strokeStyle = SEMANTIC_COLOURS.positive;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const N = 120;
      for (let i = 0; i <= N; i++) {
        const ang = (i / N) * Math.PI * 2;
        let q0 = 0.65 + 0.26 * Math.cos(ang);
        let p0 = 0.22 * Math.sin(ang);
        // Exact area-preserving nonlinear twist map composition
        const r2 = q0 * q0 + p0 * p0;
        const rot = shear * (0.45 + 1.15 * r2);
        const q = q0 * Math.cos(rot) + p0 * Math.sin(rot);
        const p = -q0 * Math.sin(rot) + p0 * Math.cos(rot);
        const sx = cx + q * 62;
        const sy = cy - p * 54;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    },
  },

  'gauge-invariance-morph': {
    id: 'gauge-invariance-morph',
    title: 'Electromagnetic Gauge Transformation',
    durationSec: 7.5,
    beats: [
      {
        at: 0,
        narration: 'Potentials (φ, A) generate observable electric and magnetic fields E = −∇φ − ∂_t A and B = ∇×A.',
        tex: '\\mathbf{B} = \\nabla\\times\\mathbf{A}, \\qquad \\mathbf{E} = -\\nabla\\varphi - \\partial_t\\mathbf{A}',
      },
      {
        at: 0.45,
        narration: 'Add gradient ∇χ to A while subtracting ∂_t χ from φ: the potential arrows warp dramatically.',
        tex: '\\mathbf{A}\' = \\mathbf{A} + \\nabla\\chi, \\qquad \\varphi\' = \\varphi - \\partial_t\\chi',
      },
      {
        at: 0.78,
        narration: 'Because ∇×(∇χ) ≡ 0 and −∇(−∂_tχ) − ∂_t(∇χ) ≡ 0, physical fields E and B never move a hair!',
        tex: '\\mathbf{B}\' = \\mathbf{B}, \\qquad \\mathbf{E}\' = \\mathbf{E}',
      },
    ],
    draw(ctx, w, h, u, dark) {
      const gaugeAmp = Math.sin(u * Math.PI);
      const midX = w * 0.5;
      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillStyle = dark ? '#e7e5e4' : '#292524';
      ctx.fillText('Vector Potential A′ = A + ∇χ (warps)', 22, 22);
      ctx.fillText('Magnetic Field B = ∇×A′ (invariant)', midX + 16, 22);

      for (let gx = 0; gx < 5; gx++) {
        for (let gy = 0; gy < 4; gy++) {
          const x = 34 + gx * ((midX - 58) / 4);
          const y = 44 + gy * ((h - 68) / 3);
          const nx = (gx - 2) / 2;
          const ny = (gy - 1.5) / 1.5;
          // Base rotational A = (-y, x) + pure gradient gauge ∇(nx^2 - ny^2)
          const ax = -ny * 10 + gaugeAmp * nx * 13;
          const ay = nx * 10 - gaugeAmp * ny * 13;
          ctx.strokeStyle = SEMANTIC_COLOURS.secondary;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + ax, y + ay);
          ctx.stroke();

          // Right side: invariant B_z uniform out-of-page circles
          const rx = midX + 34 + gx * ((midX - 58) / 4);
          ctx.strokeStyle = SEMANTIC_COLOURS.positive;
          ctx.beginPath();
          ctx.arc(rx, y, 6.5, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = SEMANTIC_COLOURS.positive;
          ctx.beginPath();
          ctx.arc(rx, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  },

  'huygens-wavelets': {
    id: 'huygens-wavelets',
    title: 'Huygens–Fresnel Secondary Wavelets',
    durationSec: 7.5,
    beats: [
      {
        at: 0,
        narration: 'Collimated plane wavefronts arrive at an opaque screen pierced by a finite aperture.',
        tex: 'U_{\\mathrm{inc}}(z) = U_0 e^{ikz}',
      },
      {
        at: 0.4,
        narration: 'Every unobstructed point in the aperture emits a secondary spherical wavelet.',
        tex: 'dU(\\mathbf{r}) = \\frac{U(\\boldsymbol{\\xi})}{i\\lambda r}\\,e^{ikr}\\,d^2\\xi',
      },
      {
        at: 0.75,
        narration: 'Constructive envelope forms the forward beam while edge wavelets bend into the geometric shadow!',
        tex: '\\Delta\\theta_{\\mathrm{diff}} \\sim \\frac{\\lambda}{a}',
      },
    ],
    draw(ctx, w, h, u, dark) {
      const wallX = w * 0.34;
      const gapHalf = 30;
      const cy = h * 0.5;

      // Incoming plane waves
      ctx.strokeStyle = SEMANTIC_COLOURS.secondary;
      ctx.lineWidth = 1.6;
      for (let x = 18; x < wallX - 4; x += 22) {
        const xp = 18 + ((x - 18 + u * 44) % (wallX - 22));
        ctx.beginPath();
        ctx.moveTo(xp, 20);
        ctx.lineTo(xp, h - 20);
        ctx.stroke();
      }

      // Opaque barrier
      ctx.strokeStyle = dark ? '#f5f5f4' : '#1c1917';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(wallX, 12);
      ctx.lineTo(wallX, cy - gapHalf);
      ctx.moveTo(wallX, cy + gapHalf);
      ctx.lineTo(wallX, h - 12);
      ctx.stroke();

      // Secondary wavelets from 5 point sources in gap
      const sources = [-22, -11, 0, 11, 22];
      for (let rIdx = 1; rIdx <= 6; rIdx++) {
        const rad = ((rIdx * 28 + u * 56) % 168);
        if (rad < 4) continue;
        for (const sy of sources) {
          ctx.strokeStyle = `rgba(230, 159, 0, ${(1 - rad / 175) * 0.52})`;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.arc(wallX, cy + sy, rad, -Math.PI * 0.46, Math.PI * 0.46);
          ctx.stroke();
        }
      }
    },
  },

  'boltzmann-phase-cells': {
    id: 'boltzmann-phase-cells',
    title: 'Phase-Space Multiplicity & Equilibrium Dominance',
    durationSec: 7.5,
    beats: [
      {
        at: 0,
        narration: 'Partition constant-energy phase space into macrostate cells of wildly unequal volumes Ω_k.',
        tex: '\\Gamma(E) = \\bigsqcup_k \\Gamma_k, \\qquad \\Omega_k = \\mathrm{Vol}(\\Gamma_k)/h^{3N}',
      },
      {
        at: 0.45,
        narration: 'A microscopic trajectory launched in a tiny low-entropy corner wanders generically across boundaries.',
        tex: 'S(t) = k_B \\ln \\Omega_{\\mathrm{macro}(z(t))}',
      },
      {
        at: 0.8,
        narration: 'Because Ω_eq dwarfs all non-equilibrium cells combined, the system spends virtually all future time in equilibrium.',
        tex: '\\frac{\\Omega_{\\mathrm{eq}}}{\\Omega_{\\mathrm{non\\text{-}eq}}} \\sim e^{10^{23}}',
      },
    ],
    draw(ctx, w, h, u, dark) {
      const pad = 22;
      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(pad, pad, w - 2 * pad, h - 2 * pad);

      // Small corner cell vs giant equilibrium cell
      ctx.fillStyle = 'rgba(213, 94, 0, 0.22)';
      ctx.fillRect(pad, pad, 52, 38);
      ctx.strokeRect(pad, pad, 52, 38);

      ctx.fillStyle = 'rgba(0, 158, 115, 0.14)';
      ctx.fillRect(pad + 52, pad, w - 2 * pad - 52, h - 2 * pad);
      ctx.fillRect(pad, pad + 38, 52, h - 2 * pad - 38);

      ctx.font = '600 11px Inter, sans-serif';
      ctx.fillStyle = dark ? '#f5f5f4' : '#1c1917';
      ctx.fillText('Ω₀ (ordered)', pad + 4, pad + 22);
      ctx.fillText('Ω_eq ≫ Ω₀ (thermal equilibrium)', w * 0.42, h * 0.54);

      // Wandering trajectory
      ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      const steps = Math.floor(8 + u * 85);
      for (let i = 0; i <= steps; i++) {
        const s = i / 93;
        const x = pad + 18 + s * (w - 2 * pad - 55) + Math.sin(s * 17) * 28 * s;
        const y = pad + 16 + Math.pow(s, 0.75) * (h - 2 * pad - 44) + Math.cos(s * 23) * 20 * s;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    },
  },

  'kadanoff-block-spin': {
    id: 'kadanoff-block-spin',
    title: 'Kadanoff Block-Spin Coarse-Graining & RG Scale Invariance',
    durationSec: 8,
    beats: [
      {
        at: 0,
        narration: 'At criticality T = T_c, microscopic spins form self-similar correlated islands at all scales.',
        tex: '\\xi(T_c) = \\infty, \\qquad \\langle s_0 s_r \\rangle \\propto r^{-(d-2+\\eta)}',
      },
      {
        at: 0.42,
        narration: 'Group spins into 2 × 2 Kadanoff blocks and assign each block its majority orientation.',
        tex: 's\'_I = \\operatorname{sgn}\\!\\left(\\sum_{i\\in I} s_i\\right), \\qquad b = 2',
      },
      {
        at: 0.76,
        narration: 'Rescale lengths x′ = x/b: at the critical fixed point K*, the coarse-grained lattice is statistically invariant!',
        tex: 'K\' = \\mathcal{R}_b(K^* ) = K^*',
      },
    ],
    draw(ctx, w, h, u, dark) {
      const fineN = 12;
      const cell = Math.min((h - 36) / fineN, 12);
      const leftX = w * 0.16;
      const topY = (h - fineN * cell) * 0.5;

      // Deterministic critical-like cluster pattern
      const spinAt = (gx: number, gy: number) =>
        Math.sin(gx * 0.55 + 0.4) + Math.cos(gy * 0.5 - 0.3) + 0.45 * Math.sin((gx + gy) * 0.9) >= 0 ? 1 : -1;

      for (let y = 0; y < fineN; y++) {
        for (let x = 0; x < fineN; x++) {
          ctx.fillStyle = spinAt(x, y) > 0 ? SEMANTIC_COLOURS.positive : (dark ? '#292524' : '#d6d3d1');
          ctx.fillRect(leftX + x * cell, topY + y * cell, cell - 1, cell - 1);
        }
      }

      if (u > 0.25) {
        ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
        ctx.lineWidth = 1.4;
        for (let by = 0; by < fineN / 2; by++) {
          for (let bx = 0; bx < fineN / 2; bx++) {
            ctx.strokeRect(leftX + bx * 2 * cell, topY + by * 2 * cell, 2 * cell, 2 * cell);
          }
        }
      }

      if (u > 0.5) {
        const rightX = w * 0.6;
        const coarseCell = cell * 2;
        for (let by = 0; by < fineN / 2; by++) {
          for (let bx = 0; bx < fineN / 2; bx++) {
            const sum =
              spinAt(2 * bx, 2 * by) +
              spinAt(2 * bx + 1, 2 * by) +
              spinAt(2 * bx, 2 * by + 1) +
              spinAt(2 * bx + 1, 2 * by + 1);
            ctx.fillStyle = sum >= 0 ? SEMANTIC_COLOURS.positive : (dark ? '#292524' : '#d6d3d1');
            ctx.fillRect(rightX + bx * coarseCell, topY + by * coarseCell, coarseCell - 1.5, coarseCell - 1.5);
          }
        }
      }
    },
  },

  'minkowski-light-cone': {
    id: 'minkowski-light-cone',
    title: 'Lorentz Boosts & Invariance of the 45° Light Cone',
    durationSec: 8,
    beats: [
      {
        at: 0,
        narration: 'In rest frame S, ct and x axes are orthogonal and light rays travel along ct = ±x (45°).',
        tex: 'ds^2 = -c^2 dt^2 + dx^2 = 0 \\iff x = \\pm ct',
      },
      {
        at: 0.4,
        narration: 'Boost to frame S′ moving at velocity β = v/c: both ct′ and x′ scissor symmetrically toward the light cone!',
        tex: '\\tan\\alpha = \\beta = \\frac{v}{c}, \\qquad ct\' \\text{ and } x\' \\text{ scissor inward}',
      },
      {
        at: 0.78,
        narration: 'Events on invariant hyperbolae c²t² − x² = c²τ² map along themselves while the light cone stays fixed.',
        tex: 'c^2 t\'^2 - x\'^2 = c^2 t^2 - x^2 = c^2\\tau^2',
      },
    ],
    draw(ctx, w, h, u, dark) {
      const cx = w * 0.5;
      const cy = h * 0.52;
      const R = Math.min(w, h) * 0.42;
      const beta = 0.68 * Math.sin(u * Math.PI);
      const tilt = Math.atan(beta);

      // Rest axes
      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx - R, cy);
      ctx.lineTo(cx + R, cy);
      ctx.moveTo(cx, cy + R);
      ctx.lineTo(cx, cy - R);
      ctx.stroke();

      // 45-degree null light cone
      ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cx - R, cy + R);
      ctx.lineTo(cx + R, cy - R);
      ctx.moveTo(cx - R, cy - R);
      ctx.lineTo(cx + R, cy + R);
      ctx.stroke();

      // Boosted ct' and x' axes
      ctx.strokeStyle = SEMANTIC_COLOURS.secondary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      // x' axis: ct = beta * x
      ctx.moveTo(cx - R * Math.cos(tilt), cy + R * Math.sin(tilt));
      ctx.lineTo(cx + R * Math.cos(tilt), cy - R * Math.sin(tilt));
      // ct' axis: x = beta * ct
      ctx.moveTo(cx - R * Math.sin(tilt), cy + R * Math.cos(tilt));
      ctx.lineTo(cx + R * Math.sin(tilt), cy - R * Math.cos(tilt));
      ctx.stroke();
    },
  },

  'comoving-expanding-grid': {
    id: 'comoving-expanding-grid',
    title: 'Comoving Coordinates vs Expanding Proper Distance',
    durationSec: 8,
    beats: [
      {
        at: 0,
        narration: 'Galaxies sit at fixed comoving grid intersections (χ_x, χ_y) carried passively by cosmic expansion.',
        tex: '\\boldsymbol{\\chi} = \\mathrm{const}, \\qquad \\mathbf{r}_{\\mathrm{phys}}(t) = a(t)\\,\\boldsymbol{\\chi}',
      },
      {
        at: 0.45,
        narration: 'As a(t) grows, proper separations stretch linearly (Hubble’s law v = H d_p) and photon wavelengths redshift.',
        tex: '\\dot{d}_p = \\dot{a}\\chi = H(t)\\,d_p, \\qquad \\lambda(t) \\propto a(t)',
      },
      {
        at: 0.78,
        narration: 'In conformal time η = ∫ dt/a(t), light cones stay at ±45° across the comoving grid.',
        tex: 'ds^2 = a(\\eta)^2\\!\\left(-c^2 d\\eta^2 + d\\chi^2\\right)',
      },
    ],
    draw(ctx, w, h, u, dark) {
      const cx = w * 0.5;
      const cy = h * 0.52;
      const scale = 0.55 + 0.85 * u;
      const spacing = 26 * scale;

      ctx.strokeStyle = dark ? 'rgba(154,140,255,0.28)' : 'rgba(79,70,229,0.25)';
      ctx.lineWidth = 1.1;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * spacing, cy - 3 * spacing);
        ctx.lineTo(cx + i * spacing, cy + 3 * spacing);
        ctx.moveTo(cx - 3 * spacing, cy + i * spacing);
        ctx.lineTo(cx + 3 * spacing, cy + i * spacing);
        ctx.stroke();
      }
      for (let gx = -2; gx <= 2; gx++) {
        for (let gy = -2; gy <= 2; gy++) {
          ctx.fillStyle = gx === 0 && gy === 0 ? SEMANTIC_COLOURS.highlight : SEMANTIC_COLOURS.positive;
          ctx.beginPath();
          ctx.arc(cx + gx * spacing, cy + gy * spacing, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  },

  'decoherence-fringes': {
    id: 'decoherence-fringes',
    title: 'Which-Path Entanglement & Decoherence of Double-Slit Fringes',
    durationSec: 8,
    beats: [
      {
        at: 0,
        narration: 'Isolated double-slit superposition |E₁⟩ = |E₂⟩ gives full coherent cos² interference fringes.',
        tex: '|\\langle E_2|E_1\\rangle| = 1 \\implies I(x) \\propto |\\psi_1 + \\psi_2|^2',
      },
      {
        at: 0.45,
        narration: 'Weak environmental scattering entangles slit path with bath modes, lowering overlap |⟨E₂|E₁⟩|.',
        tex: '\\rho_{12} \\to \\rho_{12}\\,\\langle E_2|E_1\\rangle',
      },
      {
        at: 0.8,
        narration: 'Orthogonal detector states ⟨E₂|E₁⟩ = 0 erase fringes completely into the classical two-slit sum!',
        tex: '\\langle E_2|E_1\\rangle = 0 \\implies I(x) \\propto |\\psi_1|^2 + |\\psi_2|^2',
      },
    ],
    draw(ctx, w, h, u, dark) {
      drawAxes(ctx, 38, h - 22, w - 64, h - 44, 'x', 'P(x)', dark);
      const visibility = Math.max(0, 1 - u * 1.15);
      const x0 = 42;
      const plotW = w - 72;
      const y0 = h - 24;

      ctx.strokeStyle = SEMANTIC_COLOURS.secondary;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      for (let i = 0; i <= 180; i++) {
        const s = (i / 180) * 2 - 1; // [-1, 1]
        const g1 = Math.exp(-Math.pow((s + 0.25) / 0.42, 2));
        const g2 = Math.exp(-Math.pow((s - 0.25) / 0.42, 2));
        const p = 0.5 * (g1 + g2 + 2 * Math.sqrt(g1 * g2) * visibility * Math.cos(22 * s));
        const px = x0 + ((s + 1) / 2) * plotW;
        const py = y0 - (p / 2) * (h - 56);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    },
  },

  'oscillator-chain-to-field': {
    id: 'oscillator-chain-to-field',
    title: 'Harmonic Lattice Continuum Limit to Relativistic Scalar Field',
    durationSec: 8,
    beats: [
      {
        at: 0,
        narration: 'Discrete masses u_n(t) coupled by springs vibrate in collective normal modes k.',
        tex: 'L = \\sum_n a\\left[\\tfrac{1}{2}\\rho\\dot{u}_n^2 - \\tfrac{1}{2}\\tau\\left(\\frac{u_{n+1}-u_n}{a}\\right)^2 - \\tfrac{1}{2}\\kappa u_n^2\\right]',
      },
      {
        at: 0.45,
        narration: 'Send lattice spacing a → 0: discrete displacements u_n(t) merge into a smooth field φ(x, t).',
        tex: '\\mathcal{L} = \\tfrac{1}{2}(\\partial_t\\phi)^2 - \\tfrac{1}{2}c^2(\\partial_x\\phi)^2 - \\tfrac{1}{2}m^2\\phi^2',
      },
      {
        at: 0.78,
        narration: 'Quantizing each normal mode ω_p = √(p² + m²) yields discrete particle excitations a†_p|0⟩!',
        tex: '|\\mathbf{p}_1, \\mathbf{p}_2\\rangle = \\hat{a}_{\\mathbf{p}_1}^\\dagger \\hat{a}_{\\mathbf{p}_2}^\\dagger |0\\rangle',
      },
    ],
    draw(ctx, w, h, u, dark) {
      const cy = h * 0.52;
      const count = Math.round(9 + u * 36);
      const xStart = 32;
      const span = w - 64;

      ctx.strokeStyle = SEMANTIC_COLOURS.secondary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= count; i++) {
        const s = i / count;
        const x = xStart + s * span;
        const disp = 34 * Math.sin(4 * Math.PI * s - u * 4 * Math.PI) * Math.exp(-Math.pow((s - 0.5) / 0.34, 2));
        if (i === 0) ctx.moveTo(x, cy - disp);
        else ctx.lineTo(x, cy - disp);
      }
      ctx.stroke();

      if (count < 28) {
        for (let i = 0; i <= count; i++) {
          const s = i / count;
          const x = xStart + s * span;
          const disp = 34 * Math.sin(4 * Math.PI * s - u * 4 * Math.PI) * Math.exp(-Math.pow((s - 0.5) / 0.34, 2));
          ctx.fillStyle = dark ? '#fafaf9' : '#1c1917';
          ctx.beginPath();
          ctx.arc(x, cy - disp, 3.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  },

  'berry-bloch-loop': {
    id: 'berry-bloch-loop',
    title: 'Adiabatic Bloch-Sphere Loop & Solid-Angle Berry Phase',
    durationSec: 8,
    beats: [
      {
        at: 0,
        narration: 'Prepare a spin-½ eigenstate aligned with magnetic field unit vector n̂(0) on the Bloch sphere S².',
        tex: 'H(\\mathbf{R}) = -\\boldsymbol{\\mu}\\cdot\\mathbf{B}(\\mathbf{R})',
      },
      {
        at: 0.45,
        narration: 'Guide n̂(t) adiabatically around a closed spherical cap C at polar angle θ.',
        tex: '|\\psi(T)\\rangle = e^{i\\gamma_-(C)}\\,e^{-\\frac{i}{\\hbar}\\int_0^T E_- dt}\\,|\\psi(0)\\rangle',
      },
      {
        at: 0.78,
        narration: 'Upon returning to n̂(0), the state carries geometric Berry phase γ_− = ½Ω(C) = π(1 − cos θ)!',
        tex: '\\gamma_\\mp(C) = \\pm\\tfrac{1}{2}\\Omega(C) = \\pm\\pi(1 - \\cos\\theta)',
      },
    ],
    draw(ctx, w, h, u, dark) {
      const cx = w * 0.5;
      const cy = h * 0.54;
      const R = Math.min(w, h) * 0.38;

      // Sphere wireframe
      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.22)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, R, R * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Cap loop C
      const capY = cy - R * 0.58;
      const capRx = R * 0.81;
      const capRy = R * 0.2;
      ctx.fillStyle = 'rgba(204, 102, 168, 0.22)';
      ctx.beginPath();
      ctx.ellipse(cx, capY, capRx, capRy, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#CC66A8';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.ellipse(cx, capY, capRx, capRy, 0, 0, u * Math.PI * 2);
      ctx.stroke();

      // Current Bloch vector
      const ang = u * Math.PI * 2;
      const tipX = cx + capRx * Math.cos(ang);
      const tipY = capY + capRy * Math.sin(ang);
      ctx.strokeStyle = SEMANTIC_COLOURS.highlight;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
    },
  },

  'electroweak-symmetry-breaking': {
    id: 'electroweak-symmetry-breaking',
    title: 'Mexican-Hat Potential & Spontaneous Vacuum Selection',
    durationSec: 8,
    beats: [
      {
        at: 0,
        narration: 'Above the electroweak crossover (T > 160 GeV), effective mass² > 0 keeps the symmetric minimum at Φ = 0.',
        tex: 'V_{\\mathrm{eff}}(\\Phi, T > T_c) = +\\tfrac{1}{2}m_T^2|\\Phi|^2 + \\lambda|\\Phi|^4',
      },
      {
        at: 0.42,
        narration: 'Below T_c, −μ²|Φ|² + λ|Φ|⁴ develops an unstable peak at Φ = 0 and a circular trough at |Φ| = v/√2.',
        tex: 'V(\\Phi) = -\\mu^2|\\Phi|^2 + \\lambda|\\Phi|^4, \\qquad v = \\sqrt{\\mu^2/\\lambda} \\approx 246\\;\\mathrm{GeV}',
      },
      {
        at: 0.78,
        narration: 'Settling into ⟨Φ⟩ = (0, v/√2)ᵀ gives radial Higgs mass m_H = √(2λ)v while W±, Z⁰ absorb the flat Goldstone directions!',
        tex: 'm_H = \\sqrt{2\\lambda}\\,v \\approx 125.2\\;\\mathrm{GeV}, \\qquad M_W = \\tfrac{1}{2}gv',
      },
    ],
    draw(ctx, w, h, u, dark) {
      drawAxes(ctx, 42, h - 22, w - 76, h - 42, 'Re Φ', 'V(Φ)', dark);
      const cx = w * 0.5;
      const yZero = h * 0.54;
      // Morph quadratic coefficient from +1 to -1
      const muSign = u < 0.25 ? 1 - u * 4 : -Math.min(1, (u - 0.25) * 2.2);

      ctx.strokeStyle = '#CC66A8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= 140; i++) {
        const phi = ((i / 140) * 2 - 1) * 1.35;
        const V = 0.5 * muSign * phi * phi + 0.42 * Math.pow(phi, 4);
        const px = cx + phi * (w * 0.28);
        const py = yZero - V * 74;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Ball choosing right vacuum
      const ballPhi = muSign >= 0 ? 0 : Math.sqrt(-muSign / (2 * 0.42)) * Math.min(1, (u - 0.3) * 1.8);
      const ballV = 0.5 * muSign * ballPhi * ballPhi + 0.42 * Math.pow(ballPhi, 4);
      ctx.fillStyle = SEMANTIC_COLOURS.highlight;
      ctx.beginPath();
      ctx.arc(cx + ballPhi * (w * 0.28), yZero - ballV * 74 - 5, 5, 0, Math.PI * 2);
      ctx.fill();
    },
  },
};

export const MotionGraphicPlayer: React.FC<{
  motionId: string;
  caption: string;
}> = ({ motionId, caption }) => {
  const scene = MOTION_SCENES[motionId];
  const { settings } = usePhysicaStore();
  const dark = settings.readerTheme === 'dark';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(settings.reducedMotion ? 0.82 : 0);
  const [playing, setPlaying] = useState(
    Boolean(settings.autoplayMotion && !settings.reducedMotion)
  );
  const [speed, setSpeed] = useState<0.5 | 1 | 2>(1);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    if (!scene || !playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setProgress((prev) => {
        const next = prev + (dt * speed) / scene.durationSec;
        if (next >= 1) {
          setPlaying(false);
          return 1;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, scene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scene) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssW = canvas.clientWidth || 460;
    const cssH = canvas.clientHeight || 168;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    scene.draw(ctx, cssW, cssH, progress, dark);
  }, [progress, dark, scene]);

  if (!scene) {
    return (
      <div className="rounded border border-red-500/40 p-3 text-xs text-red-500">
        Missing motion graphic: {motionId}
      </div>
    );
  }

  let activeBeat = scene.beats[0];
  for (const b of scene.beats) {
    if (progress >= b.at) activeBeat = b;
  }

  const eqHtml = katex.renderToString(activeBeat.tex, {
    throwOnError: false,
    displayMode: false,
  });

  return (
    <figure
      className={`my-3 rounded-lg border p-3 font-sans-ui ${
        dark
          ? 'border-stone-700/80 bg-stone-900/80 text-stone-200'
          : 'border-stone-300/90 bg-white/85 text-stone-800'
      }`}
      aria-label={`Motion graphic: ${scene.title}`}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px]">
        <span className="font-semibold tracking-wide uppercase opacity-75">
          Motion Graphic · {scene.title}
        </span>
        <button
          type="button"
          onClick={() => setShowTranscript((v) => !v)}
          className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] opacity-75 hover:bg-amber-500/15 hover:opacity-100"
        >
          <FileText className="h-3 w-3" />
          Transcript
        </button>
      </div>

      {/* Equation morph bar */}
      <div
        className={`mb-2 flex min-h-[32px] items-center justify-center rounded px-2 py-1 text-xs transition-all duration-300 ${
          dark ? 'bg-stone-950/70' : 'bg-stone-100/90'
        }`}
        dangerouslySetInnerHTML={{ __html: eqHtml }}
      />

      <canvas
        ref={canvasRef}
        className="h-[158px] w-full rounded"
        role="img"
        aria-label={activeBeat.narration}
      />

      {/* Beat narration */}
      <p
        aria-live="polite"
        className={`mt-1.5 min-h-[32px] text-xs leading-snug ${
          dark ? 'text-amber-200/95' : 'text-amber-950'
        }`}
      >
        {activeBeat.narration}
      </p>

      {/* Scrubber & timeline controls */}
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (progress >= 0.99) setProgress(0);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? 'Pause animation' : 'Play animation'}
          className="inline-flex h-6 w-6 items-center justify-center rounded bg-amber-600 text-white hover:bg-amber-500"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => {
            setProgress(0);
            setPlaying(true);
          }}
          aria-label="Replay animation"
          className="inline-flex h-6 w-6 items-center justify-center rounded border border-current/20 opacity-80 hover:opacity-100"
        >
          <RotateCcw className="h-3 w-3" />
        </button>

        <div className="relative flex flex-1 items-center">
          <input
            type="range"
            min={0}
            max={1}
            step={0.005}
            value={progress}
            aria-label="Scrub animation timeline"
            onChange={(e) => {
              setPlaying(false);
              setProgress(parseFloat(e.target.value));
            }}
            className="h-1.5 w-full cursor-pointer accent-amber-600"
          />
          {scene.beats.map((b, idx) => (
            <span
              key={idx}
              style={{ left: `${b.at * 100}%` }}
              title={`Beat ${idx + 1}`}
              className="pointer-events-none absolute -top-1 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber-500"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
          className="rounded border border-current/20 px-1.5 py-0.5 font-mono-code text-[10px]"
          title="Playback speed"
        >
          {speed}×
        </button>
      </div>

      {showTranscript && (
        <ol className="mt-2 list-decimal space-y-1 border-t border-current/15 pt-2 pl-4 text-[11px] opacity-85">
          {scene.beats.map((b, idx) => (
            <li key={idx}>{b.narration}</li>
          ))}
        </ol>
      )}

      <figcaption className="mt-1.5 text-[11px] italic opacity-70">{caption}</figcaption>
    </figure>
  );
};
