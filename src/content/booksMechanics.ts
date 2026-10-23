import type { BookMeta } from '@/lib/schema';

export const BOOKS_MECHANICS: BookMeta[] = [
  {
    id: 'lagrangian-mechanics',
    title: 'Lagrangians and the Principle of Least Action',
    subtitle: 'Variational Calculus, Generalised Coordinates, and Noether Symmetries',
    wing: 'mechanics',
    status: 'published',
    difficulty: 3,
    readingMinutes: 35,
    prerequisites: [],
    shelf: { side: 'left', bay: 1, level: 2, slot: 3, mezzanine: false },
    cover: { colour: '#6E3B23', material: 'leather', emblem: 'pendulum' },
    conventions: {
      units: 'SI',
      notes: 'Generalised coordinates q_i (i = 1..n); overdots denote total time derivatives d/dt.',
    },
    summary:
      'Replaces vectorial constraint forces with a single scalar functional—the action S[q]—from whose stationarity emerge the Euler–Lagrange equations, conservation laws via Noether’s theorem, and the Legendre passage to Hamiltonian phase space.',
    plannedChapters: [
      '1. The Action Functional & Stationary Paths',
      '2. Calculus of Variations & Euler–Lagrange Equations',
      '3. Constraints, Generalised Coordinates & Coupled Pendulums',
      '4. Noether’s Theorem & Passage to the Hamiltonian',
    ],
    references: [
      {
        authors: 'H. Goldstein, C. Poole, J. Safko',
        title: 'Classical Mechanics',
        year: 2002,
        edition: '3rd ed.',
        chapters: 'Ch. 1–2, 8',
      },
      {
        authors: 'L. D. Landau, E. M. Lifshitz',
        title: 'Mechanics (Course of Theoretical Physics, Vol. 1)',
        year: 1976,
        edition: '3rd ed.',
        chapters: '§§1–9, §40',
      },
      {
        authors: 'V. I. Arnold',
        title: 'Mathematical Methods of Classical Mechanics',
        year: 1989,
        edition: '2nd ed.',
        chapters: 'Ch. 3–4',
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: 'Lagrangians and the Principle of Least Action',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Newtonian mechanics asks what happens at the next instant: given positions and velocities now, net force determines acceleration. Analytical mechanics asks a global geometric question instead: among all conceivable histories connecting configuration q(t₁) to q(t₂), which trajectory does nature select?',
              'Remarkably, conservative dynamics is encoded in a single scalar function L(q, q̇, t)—the Lagrangian—integrated along each trial path to form the action S[q]. True physical trajectories are stationary points of S.',
            ],
            glossaryTerms: ['action', 'lagrangian'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Declared Conventions',
            body: 'SI units throughout (action in J·s, energy in J). Generalised coordinates q = (q₁, …, qₙ) parameterise the configuration manifold Q; velocities q̇ = dq/dt lie in the tangent bundle TQ.',
            tex: '[S] = \\mathrm{J\\cdot s}, \\qquad L(q,\\dot{q},t) = T(q,\\dot{q}) - V(q,t)',
          },
        ],
      },
      {
        pageNumber: 2,
        chapterNumber: 0,
        chapterTitle: 'Architecture of the Monograph',
        heading: 'Map of the Book',
        blocks: [
          {
            kind: 'concept-map',
            nodes: [
              {
                chapter: 1,
                title: 'The Action Functional',
                coreIdea: 'Every path q(t) carries an action S[q]; classical motion sits at δS = 0.',
              },
              {
                chapter: 2,
                title: 'Euler–Lagrange Equations',
                coreIdea: 'Integration by parts turns global stationarity δS = 0 into local differential equations.',
              },
              {
                chapter: 3,
                title: 'Generalised Coordinates & Chaos',
                coreIdea: 'Holonomic constraints vanish automatically; coupled pendulums reveal nonlinear dynamics.',
              },
              {
                chapter: 4,
                title: 'Noether’s Theorem & Hamiltonians',
                coreIdea: 'Continuous symmetries generate conserved charges; Legendre transform opens phase space.',
              },
            ],
          },
          {
            kind: 'callout',
            variant: 'intuition',
            title: 'Why "Stationary" Rather Than Strictly "Least"?',
            body: 'For short time intervals S[q] is typically a genuine minimum, but past a conjugate focal point (such as half an oscillation of a harmonic oscillator) the classical trajectory becomes a saddle point of S. Hamilton’s principle requires only first-order stationarity δS = 0.',
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · The Action Functional',
        heading: 'Weighing Every Conceivable Trajectory',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Consider a particle of mass m moving in potential V(q) between fixed endpoints q(t₁) = q₁ and q(t₂) = q₂. Watch how deforming the classical trajectory by a smooth variation η(t) vanishing at both endpoints alters the integrated difference T − V:',
            ],
            glossaryTerms: ['action'],
          },
          {
            kind: 'motion',
            motionId: 'least-action-variation',
            caption: 'Stationarity of the action functional S[q + εη] around the classical parabolic trajectory.',
          },
          {
            kind: 'eq',
            id: 'eq-action-def',
            number: '1.1',
            label: 'Hamilton’s Principal Action',
            tex: 'S[q] = \\int_{t_1}^{t_2} L\\!\\left(q(t), \\dot{q}(t), t\\right) dt, \\qquad \\delta S = 0',
            symbols: [
              { symbol: 'S[q]', meaning: 'Action functional evaluated on path q(t)', units: 'J·s' },
              { symbol: 'L', meaning: 'Lagrangian function T − V', units: 'J' },
              { symbol: 'q(t)', meaning: 'Generalised coordinate trajectory', units: 'm or rad' },
              { symbol: '\\dot{q}(t)', meaning: 'Generalised velocity dq/dt', units: 'm·s⁻¹ or rad·s⁻¹' },
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · The Action Functional',
        heading: 'Interactive Laboratory: Deforming Trial Paths',
        blocks: [
          {
            kind: 'sim',
            simId: 'action-paths',
            caption: 'Live Action Integral over Perturbed Paths q(t) = q_cl(t) + α sin(nπt/T).',
            notice:
              'Drag the perturbation amplitude α across zero. Notice that S(α) has zero slope dS/dα = 0 precisely at α = 0—linear changes in path produce only quadratic O(α²) changes in S.',
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Euler–Lagrange Equations',
        heading: 'From Functional Stationarity to Differential Equations',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Let q(t) be a stationary path and consider a one-parameter family Q(t, ε) = q(t) + εη(t) with η(t₁) = η(t₂) = 0. Requiring dS/dε|_{ε=0} = 0 for arbitrary smooth η(t) yields the Euler–Lagrange equations without ever invoking constraint forces.',
            ],
          },
          {
            kind: 'derivation',
            title: 'Derivation of the Euler–Lagrange Equation',
            steps: [
              {
                tex: '\\delta S = \\int_{t_1}^{t_2} \\left( \\frac{\\partial L}{\\partial q}\\,\\eta(t) + \\frac{\\partial L}{\\partial \\dot{q}}\\,\\dot{\\eta}(t) \\right) dt = 0',
                why: 'Expand S[q + εη] to first order in ε using the multivariable chain rule.',
              },
              {
                tex: '\\int_{t_1}^{t_2} \\frac{\\partial L}{\\partial \\dot{q}}\\,\\dot{\\eta}\\,dt = \\left[ \\frac{\\partial L}{\\partial \\dot{q}}\\,\\eta \\right]_{t_1}^{t_2} - \\int_{t_1}^{t_2} \\frac{d}{dt}\\!\\left(\\frac{\\partial L}{\\partial \\dot{q}}\\right)\\eta\\,dt',
                why: 'Integrate the velocity-variation term by parts to isolate η(t).',
              },
              {
                tex: '\\int_{t_1}^{t_2} \\left[ \\frac{\\partial L}{\\partial q} - \\frac{d}{dt}\\!\\left(\\frac{\\partial L}{\\partial \\dot{q}}\\right) \\right] \\eta(t)\\,dt = 0',
                why: 'Boundary term vanishes identically because fixed endpoints enforce η(t₁) = η(t₂) = 0.',
              },
              {
                tex: '\\frac{d}{dt}\\!\\left(\\frac{\\partial L}{\\partial \\dot{q}_i}\\right) - \\frac{\\partial L}{\\partial q_i} = 0 \\quad (i = 1,\\dots,n)',
                why: 'By the fundamental lemma of the calculus of variations, the bracketed integrand must vanish at every t.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Euler–Lagrange Equations',
        heading: 'Canonical Momentum & Covariance Under Point Transformations',
        blocks: [
          {
            kind: 'eq',
            id: 'eq-canonical-momentum',
            number: '2.1',
            label: 'Conjugate Momentum & Cyclic Coordinates',
            tex: 'p_i \\equiv \\frac{\\partial L}{\\partial \\dot{q}_i}, \\qquad \\frac{\\partial L}{\\partial q_k} = 0 \\implies \\frac{dp_k}{dt} = 0',
            symbols: [
              { symbol: 'p_i', meaning: 'Canonical momentum conjugate to coordinate q_i', units: 'kg·m·s⁻¹ or J·s' },
              { symbol: 'q_k', meaning: 'Cyclic (ignorable) generalised coordinate absent from L', units: 'm or rad' },
            ],
          },
          {
            kind: 'prose',
            paragraphs: [
              'Because Hamilton’s principle δ∫L dt = 0 is a coordinate-free statement on paths in Q, the Euler–Lagrange equations take the exact same form in Cartesian, spherical, rotating, or curvilinear coordinates. Any holonomic constraint f(r₁, …, r_N, t) = 0 is solved once at the kinematic level by choosing n independent coordinates.',
            ],
          },
          {
            kind: 'callout',
            variant: 'warning',
            title: 'Canonical vs Mechanical Momentum',
            body: 'In an electromagnetic vector potential A(r), L = ½m ṙ² + q ṙ·A − qφ gives canonical momentum p = m ṙ + qA. When A depends only on y, p_x is conserved even while mechanical velocity ẋ bends under the Lorentz force!',
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Constraints & Coupled Pendulums',
        heading: 'The Planar Double Pendulum from Pure Scalar Energy',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Writing Newton’s equations for two bobs joined by rigid massless rods requires eliminating two time-dependent rod tensions. In Lagrangian mechanics we simply write x₁ = L₁ sin θ₁, y₁ = −L₁ cos θ₁ and x₂ = x₁ + L₂ sin θ₂, y₂ = y₁ − L₂ cos θ₂, differentiate, and form L = T − V:',
            ],
            glossaryTerms: ['lagrangian'],
          },
          {
            kind: 'eq',
            id: 'eq-double-pend-lagrangian',
            number: '3.1',
            label: 'Double Pendulum Lagrangian',
            tex: 'L = \\tfrac{1}{2}(m_1+m_2)L_1^2\\dot{\\theta}_1^2 + \\tfrac{1}{2}m_2 L_2^2\\dot{\\theta}_2^2 + m_2 L_1 L_2\\dot{\\theta}_1\\dot{\\theta}_2\\cos(\\theta_1-\\theta_2) + (m_1+m_2)gL_1\\cos\\theta_1 + m_2 g L_2\\cos\\theta_2',
            symbols: [
              { symbol: '\\theta_1, \\theta_2', meaning: 'Angles of upper and lower rods from downward vertical', units: 'rad' },
              { symbol: 'm_1, m_2', meaning: 'Point masses of upper and lower bobs', units: 'kg' },
              { symbol: 'L_1, L_2', meaning: 'Lengths of upper and lower rigid rods', units: 'm' },
              { symbol: 'g', meaning: 'Gravitational acceleration', units: 'm·s⁻²' },
            ],
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Constraints & Coupled Pendulums',
        heading: 'Interactive Laboratory: Lagrangian Double Pendulum',
        blocks: [
          {
            kind: 'sim',
            simId: 'double-pendulum',
            caption: 'Coupled Euler–Lagrange ODEs integrated via 4th-order Runge–Kutta with live total energy E(t).',
            notice:
              'At low initial angles (θ₁, θ₂ < 0.35 rad) observe quasi-periodic normal-mode beating. Raise θ₁ above 2.0 rad to trigger chaotic flips while total energy E = T + V remains flat.',
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Noether’s Theorem & Hamiltonians',
        heading: 'Continuous Symmetries & Conserved Charges',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Emmy Noether proved in 1918 that every continuous one-parameter family of transformations q_i → q_i + ε δq_i leaving the action invariant (δL = ε dK/dt) yields an exact conservation law along physical solutions.',
            ],
            glossaryTerms: ['noether-charge'],
          },
          {
            kind: 'motion',
            motionId: 'noether-symmetry-flow',
            caption: 'Continuous rotational & time-translation symmetries generating conserved angular momentum L_z and energy H.',
          },
          {
            kind: 'eq',
            id: 'eq-noether-charge',
            number: '4.1',
            label: 'Noether Conserved Charge',
            tex: 'Q = \\sum_{i=1}^{n} \\frac{\\partial L}{\\partial \\dot{q}_i}\\,\\delta q_i - K, \\qquad \\frac{dQ}{dt} = 0',
            symbols: [
              { symbol: 'Q', meaning: 'Conserved Noether charge along Euler–Lagrange trajectories', units: 'varies by symmetry' },
              { symbol: '\\delta q_i', meaning: 'Infinitesimal symmetry generator on configuration space', units: 'coord units' },
              { symbol: 'K', meaning: 'Boundary gauge function when L changes by a total time derivative', units: 'J·s' },
            ],
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Noether’s Theorem & Hamiltonians',
        heading: 'The Legendre Transform to Phase Space',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Time-translation invariance (∂L/∂t = 0) conserves the energy function h = ∑ p_i q̇_i − L. Performing a Legendre transformation from velocities (q, q̇) to canonical momenta (q, p) defines the Hamiltonian H(q, p, t) and yields Hamilton’s first-order canonical equations:',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-hamilton-eqs',
            number: '4.2',
            label: 'Legendre Transform & Hamilton’s Equations',
            tex: 'H(q,p,t) = \\sum_{i=1}^{n} p_i\\dot{q}_i - L(q,\\dot{q},t), \\qquad \\dot{q}_i = \\frac{\\partial H}{\\partial p_i}, \\quad \\dot{p}_i = -\\frac{\\partial H}{\\partial q_i}',
            symbols: [
              { symbol: 'H', meaning: 'Hamiltonian generator of time evolution on phase space', units: 'J' },
              { symbol: 'p_i', meaning: 'Canonical momentum conjugate to q_i', units: 'kg·m·s⁻¹' },
            ],
          },
          {
            kind: 'callout',
            variant: 'history',
            title: 'From Maupertuis & Euler to Feynman',
            body: 'William Rowan Hamilton unified geometric optics and mechanics in 1834; a century later Paul Dirac and Richard Feynman recognised exp(iS/ℏ) as the exact quantum phase amplitude governing all paths.',
          },
        ],
      },
      {
        pageNumber: 11,
        chapterNumber: 4,
        chapterTitle: 'Synthesis & Problems',
        heading: 'Summary & Graduate Exercises',
        blocks: [
          {
            kind: 'exercise',
            id: 'ex-lag-bead-hoop',
            title: 'Exercise 1 · Bead on a Rotating Circular Hoop',
            difficulty: 3,
            prompt:
              'A bead of mass m slides frictionlessly on a vertical circular wire hoop of radius R forced to rotate at constant angular speed ω about its vertical diameter. Derive L(θ, θ̇) and find the critical angular speed ω_c above which the bottom equilibrium θ = 0 bifurcates.',
            promptTex: 'L(\\theta,\\dot{\\theta}) = \\tfrac{1}{2}mR^2(\\dot{\\theta}^2 + \\omega^2\\sin^2\\theta) + mgR\\cos\\theta',
            hints: [
              'Write spherical coordinates with fixed r = R and φ̇ = ω so kinetic energy splits into polar R²θ̇² and azimuthal (R sin θ)²ω² pieces.',
              'Notice ∂L/∂t = 0 even though the hoop is externally driven; examine the effective potential V_eff(θ) = −mgR cos θ − ½mR²ω² sin²θ.',
            ],
            solution:
              'Differentiating V_eff(θ) gives dV_eff/dθ = mR sin θ (g − Rω² cos θ) = 0. For ω ≤ √(g/R), θ = 0 is stable. Above ω_c = √(g/R), θ = 0 becomes unstable and two symmetric equilibria appear at cos θ_* = g/(Rω²).Note that the conserved Jacobi integral h = ½mR²θ̇² + V_eff(θ) differs from total mechanical energy because external torque maintains ω.',
            solutionTex: '\\omega_c = \\sqrt{\\frac{g}{R}}, \\qquad \\cos\\theta_* = \\frac{g}{R\\omega^2} \\quad (\\omega > \\omega_c)',
          },
          {
            kind: 'exercise',
            id: 'ex-lag-galilean-noether',
            title: 'Exercise 2 · Galilean Boosts and Total Derivative Symmetries',
            difficulty: 4,
            prompt:
              'For a free particle L = ½m ẋ², apply an infinitesimal Galilean boost δx = t, δẋ = 1 and identify the conserved Noether charge.',
            hints: [
              'Compute δL = m ẋ δẋ = m ẋ = d(mx)/dt, so K(x) = mx is non-zero!',
              'Substitute δq = t and K = mx into Q = (∂L/∂ẋ)δx − K.',
            ],
            solution:
              'Here ∂L/∂ẋ = m ẋ, δx = t, and K = mx. Thus Q = m ẋ t − m x, whose conservation dQ/dt = 0 states x(t) − ẋ t = −Q/m = x(0): the centre-of-mass moves at uniform velocity.',
            solutionTex: 'Q = m\\dot{x}t - mx = -mx(0)',
          },
        ],
      },
      {
        pageNumber: 12,
        chapterNumber: 4,
        chapterTitle: 'Where This Leads & References',
        heading: 'Further Exploration Across the Library',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'The variational language developed here unlocks three pillars of modern physics: symplectic geometry and KAM chaos in classical phase space, relativistic worldline and Einstein–Hilbert actions in curved spacetime, and Feynman’s sum over histories in quantum mechanics and quantum field theory.',
            ],
          },
          {
            kind: 'references-list',
            leadsToBookIds: [
              'hamiltonian-chaos',
              'wavefunction-and-its-evolution',
              'quantum-field-theory-fields-to-particles',
              'spacetime-special-to-general-relativity',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hamiltonian-chaos',
    title: 'Hamiltonian Chaos',
    subtitle: 'Symplectic Flows, KAM Tori, Poincaré Sections, and Lyapunov Divergence',
    wing: 'mechanics',
    status: 'published',
    difficulty: 4,
    readingMinutes: 40,
    prerequisites: ['lagrangian-mechanics'],
    shelf: { side: 'right', bay: 2, level: 2, slot: 4, mezzanine: false },
    cover: { colour: '#513426', material: 'leather', emblem: 'phase-torus' },
    conventions: {
      units: 'SI',
      notes: 'Phase space coordinates z = (q_1..q_n, p_1..p_n); Poisson bracket {f,g} = ∑ (∂f/∂q_i ∂g/∂p_i − ∂f/∂p_i ∂g/∂q_i).',
    },
    summary:
      'Investigates why deterministic Hamiltonian systems—forbidden by Liouville’s theorem from having attractors—nevertheless transition from integrable action-angle tori to homoclinic tangles and ergodic chaotic seas.',
    plannedChapters: [
      '1. Symplectic Geometry & Liouville’s Theorem',
      '2. Integrability, Action-Angle Tori & Poincaré Sections',
      '3. The KAM Theorem & Chirikov Standard Map',
      '4. Lyapunov Exponents & Symplectic Numerics',
    ],
    references: [
      {
        authors: 'J. V. José, E. J. Saletan',
        title: 'Classical Dynamics: A Contemporary Approach',
        year: 1998,
        chapters: 'Ch. 5–7',
      },
      {
        authors: 'A. J. Lichtenberg, M. A. Lieberman',
        title: 'Regular and Chaotic Dynamics',
        year: 1992,
        edition: '2nd ed.',
        chapters: 'Ch. 1–4',
      },
      {
        authors: 'S. H. Strogatz',
        title: 'Nonlinear Dynamics and Chaos',
        year: 2015,
        edition: '2nd ed.',
        chapters: 'Ch. 6, 9, 12',
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: 'Hamiltonian Chaos',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Dissipative chaos shrinks phase-space volumes onto fractal strange attractors. Conservative Hamiltonian systems obey a stricter rule: phase-space volume is conserved identically, so neither point attractors nor limit cycles can exist. Instead, regular islands and chaotic seas coexist in an intricate self-similar mosaic.',
            ],
            glossaryTerms: ['symplectic-form', 'kam-torus'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Conventions & Symplectic Structure',
            body: 'Dimensionless canonical variables (θ, I) on the cylinder S¹ × ℝ for area-preserving maps; standard canonical 2-form ω = ∑ dp_i ∧ dq_i.',
            tex: '\\dot{\\mathbf{z}} = J\\,\\nabla H(\\mathbf{z}), \\qquad J = \\begin{pmatrix} 0 & I_n \\\\ -I_n & 0 \\end{pmatrix}',
          },
        ],
      },
      {
        pageNumber: 2,
        chapterNumber: 0,
        chapterTitle: 'Architecture of the Monograph',
        heading: 'Map of the Book',
        blocks: [
          {
            kind: 'concept-map',
            nodes: [
              {
                chapter: 1,
                title: 'Liouville’s Theorem',
                coreIdea: 'Hamiltonian vector fields are divergence-free: phase-space blobs stretch and fold at constant volume.',
              },
              {
                chapter: 2,
                title: 'Integrability & Tori',
                coreIdea: 'n Poisson-commuting invariants foliate 2n-dimensional phase space into invariant n-tori.',
              },
              {
                chapter: 3,
                title: 'KAM & Standard Map',
                coreIdea: 'Resonant tori shatter into island chains; golden-mean irrational tori survive up to K_c ≈ 0.9716.',
              },
              {
                chapter: 4,
                title: 'Lyapunov & Symplectic Integrators',
                coreIdea: 'Positive Lyapunov exponents coexist with zero divergence; non-symplectic solvers corrupt long-time orbits.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · Liouville’s Theorem',
        heading: 'Incompressible Flow in Phase Space',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Follow an ensemble of nearby initial conditions evolving under Hamilton’s equations. Even as nonlinear shear stretches the cloud into thin filaments, its phase-space area ∫ dq dp never changes:',
            ],
            glossaryTerms: ['symplectic-form'],
          },
          {
            kind: 'motion',
            motionId: 'liouville-phase-area',
            caption: 'Stretching and filamentation of a phase-space ensemble at strictly constant symplectic area.',
          },
          {
            kind: 'derivation',
            title: 'Proof of Liouville Incompressibility',
            steps: [
              {
                tex: '\\mathbf{v}(\\mathbf{z}) = (\\dot{q}_1,\\dots,\\dot{q}_n,\\dot{p}_1,\\dots,\\dot{p}_n) = \\left(\\frac{\\partial H}{\\partial p_i}, -\\frac{\\partial H}{\\partial q_i}\\right)',
                why: 'Express Hamilton’s canonical equations as a velocity field v on 2n-dimensional phase space.',
              },
              {
                tex: '\\nabla_{\\mathbf{z}}\\cdot \\mathbf{v} = \\sum_{i=1}^{n}\\left(\\frac{\\partial^2 H}{\\partial q_i \\partial p_i} - \\frac{\\partial^2 H}{\\partial p_i \\partial q_i}\\right) = 0',
                why: 'Mixed partial derivatives of smooth H(q,p) commute by Schwarz’s theorem.',
              },
              {
                tex: '\\frac{d}{dt}\\int_{\\mathcal{D}(t)} d^n q\\,d^n p = \\int_{\\mathcal{D}(t)} (\\nabla_{\\mathbf{z}}\\cdot \\mathbf{v})\\,d^n q\\,d^n p = 0',
                why: 'Apply Reynolds’ transport theorem to any co-moving phase-space domain D(t).',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Integrability & Poincaré Sections',
        heading: 'Liouville–Arnold Integrability and Action-Angle Coordinates',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'A system with n degrees of freedom is Liouville integrable if it possesses n independent conserved quantities F₁ = H, F₂, …, Fₙ in involution: {F_i, F_j} = 0. Compact level sets are diffeomorphic to n-dimensional tori Tⁿ parameterized by conserved actions I_k and linearly advancing angles θ_k(t) = θ_k(0) + ω_k(I)t.',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-action-angle',
            number: '2.1',
            label: 'Action Variables & Torus Frequencies',
            tex: 'I_k = \\frac{1}{2\\pi}\\oint_{\\gamma_k} p_i\\,dq_i, \\qquad \\omega_k(\\mathbf{I}) = \\frac{\\partial H(\\mathbf{I})}{\\partial I_k}',
            symbols: [
              { symbol: 'I_k', meaning: 'Adiabatic action variable around fundamental cycle γ_k', units: 'J·s' },
              { symbol: '\\omega_k', meaning: 'Angular frequency on invariant torus', units: 'rad·s⁻¹' },
            ],
          },
          {
            kind: 'callout',
            variant: 'intuition',
            title: 'Poincaré Surface of Section',
            body: 'Slicing a 4D phase space (q₁, p₁, q₂, p₂) at fixed energy E and recording crossings where q₂ = 0 with p₂ > 0 reduces continuous trajectories to a 2D area-preserving map. Integrable tori appear as smooth closed curves; chaos appears as a scattered sea of points.',
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · KAM Theory & The Standard Map',
        heading: 'Small Denominators and the Survival of Irrational Tori',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Perturb an integrable Hamiltonian: H(I, θ) = H₀(I) + ε H₁(I, θ). Classical perturbation series divide by m·ω(I), blowing up densely wherever frequency ratios are rational! Yet Kolmogorov, Arnold, and Moser proved that non-degenerate tori whose frequencies obey a Diophantine irrationality condition survive for small ε, deformed but unbroken.',
              'The canonical prototype is the Chirikov–Taylor kicked rotor (Standard Map), obtained by kicking a free rotor periodically with strength K:',
            ],
            glossaryTerms: ['kam-torus'],
          },
          {
            kind: 'eq',
            id: 'eq-standard-map',
            number: '3.1',
            label: 'Chirikov–Taylor Area-Preserving Standard Map',
            tex: 'I_{n+1} = I_n + K\\sin\\theta_n, \\qquad \\theta_{n+1} = (\\theta_n + I_{n+1}) \\bmod 2\\pi',
            symbols: [
              { symbol: 'I_n', meaning: 'Dimensionless angular momentum just before kick n', units: '1' },
              { symbol: '\\theta_n', meaning: 'Rotor angle modulo 2π', units: 'rad' },
              { symbol: 'K', meaning: 'Dimensionless stochasticity (kick) parameter', units: '1' },
            ],
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · KAM Theory & The Standard Map',
        heading: 'Interactive Laboratory: KAM Torus Breakup',
        blocks: [
          {
            kind: 'sim',
            simId: 'chirikov-chaos',
            caption: 'Chirikov Standard Map phase portrait (θ, I). Click anywhere on the canvas to launch new orbits!',
            notice:
              'At K = 0.45 smooth horizontal KAM curves separate resonant island chains, forbidding global momentum diffusion. Slide K past Greene’s critical value K_c ≈ 0.9716: the last golden-mean rotational torus ruptures into a cantorus, connecting the chaotic sea vertically.',
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · KAM Theory & The Standard Map',
        heading: 'Poincaré–Birkhoff Islands & Homoclinic Tangles',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'What happens to the rational tori with winding number ω₁/ω₂ = r/s? By the Poincaré–Birkhoff theorem, a resonant torus does not simply vanish: it breaks into an alternating necklace of s elliptic (stable) and s hyperbolic (unstable) periodic points.',
              'Around each elliptic point miniature secondary KAM tori form—repeating the same hierarchy down to arbitrarily fine scales—while the stable and unstable manifolds of the hyperbolic saddles intersect transversely infinitely often, weaving Poincaré’s homoclinic tangle.',
            ],
          },
          {
            kind: 'callout',
            variant: 'history',
            title: 'Poincaré’s 1889 Prize Memoir Error and Discovery',
            body: 'While competing for King Oscar II’s prize on the stability of the Solar System, Henri Poincaré discovered an error in his proof that invariant surfaces matched smoothly—uncovering homoclinic intersections and founding modern dynamical systems theory.',
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Lyapunov Exponents & Symplectic Numerics',
        heading: 'Measuring Exponential Sensitivity',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Along a chaotic trajectory, linearized tangent vectors δz(t) stretch exponentially at rate λ > 0 in unstable directions. Because the symplectic matrix M(t) satisfies Mᵀ J M = J, eigenvalues come in reciprocal pairs (e^{λt}, e^{−λt}), so Lyapunov exponents satisfy ∑ λ_i = 0:',
            ],
            glossaryTerms: ['lyapunov-exponent'],
          },
          {
            kind: 'eq',
            id: 'eq-lyapunov-pairing',
            number: '4.1',
            label: 'Symplectic Lyapunov Pairing Rule',
            tex: '\\lambda_i = -\\lambda_{2n+1-i}, \\qquad t_{\\mathrm{predict}} \\sim \\frac{1}{\\lambda_1}\\ln\\!\\left(\\frac{\\Delta_{\\mathrm{tol}}}{\\|\\delta\\mathbf{z}(0)\\|}\\right)',
            symbols: [
              { symbol: '\\lambda_1', meaning: 'Maximal Lyapunov exponent', units: 's⁻¹' },
              { symbol: 't_{\\mathrm{predict}}', meaning: 'Predictability horizon for initial uncertainty δz(0)', units: 's' },
              { symbol: '\\Delta_{\\mathrm{tol}}', meaning: 'Acceptable macroscopic error tolerance', units: 'phase-space units' },
            ],
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Lyapunov Exponents & Symplectic Numerics',
        heading: 'Why Symplectic Integrators Beat Non-Symplectic Methods',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Forward Euler maps (q, p) → (q + Δt p/m, p − Δt V′(q)) with Jacobian determinant 1 + Δt² ω² > 1: phase-space area spirals outward exponentially, injecting fake energy! A symplectic integrator such as Velocity Verlet or Yoshida splits H = T(p) + V(q) into exact shear maps, each with determinant 1.',
              'By backward error analysis, a symplectic step of size Δt follows the exact flow of a nearby shadow Hamiltonian H̃ = H + O(Δtᵖ), keeping energy error bounded without secular drift over millions of orbits.',
            ],
          },
          {
            kind: 'callout',
            variant: 'warning',
            title: 'Shadow Trajectories vs Exact Trajectories',
            body: 'When λ₁ > 0, no fixed-precision numerical orbit follows the exact true trajectory far past t_predict; however, a symplectic integrator stays on the true invariant manifold and samples exact ergodic statistics.',
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Solar System Resonances',
        heading: 'Kirkwood Gaps, Arnold Diffusion & Continuous-Time Chaos',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'In two degrees of freedom (4D phase space), 2D KAM tori divide the 3D constant-energy hypersurface into disconnected compartments. Compare continuous-time high-energy chaos in the double pendulum against our discrete Chirikov map:',
            ],
          },
          {
            kind: 'sim',
            simId: 'double-pendulum',
            presetParams: { theta1: 2.55, theta2: 2.35, massRatio: 1.2 },
            caption: 'High-energy continuous-time Hamiltonian chaos with live phase-portrait projection (θ₂, ω₂).',
            notice: 'Observe how the phase point wanders ergodically across the accessible energy shell while relative energy error stays bounded.',
          },
        ],
      },
      {
        pageNumber: 11,
        chapterNumber: 4,
        chapterTitle: 'Synthesis & Problems',
        heading: 'Summary & Graduate Exercises',
        blocks: [
          {
            kind: 'exercise',
            id: 'ex-chaos-standard-jacobian',
            title: 'Exercise 1 · Exact Area Preservation & Linear Stability in the Standard Map',
            difficulty: 3,
            prompt:
              'Compute the 2 × 2 Jacobian matrix ∂(I_{n+1}, θ_{n+1})/∂(I_n, θ_n) of the Chirikov Standard Map, verify det M = 1 for all K, and determine the range of K > 0 for which the period-1 fixed point (I, θ) = (0, π) is linearly stable.',
            hints: [
              'Remember θ_{n+1} uses the updated momentum I_{n+1} = I_n + K sin θ_n, so ∂θ_{n+1}/∂θ_n = 1 + K cos θ_n.',
              'An area-preserving 2 × 2 matrix has eigenvalues on the unit circle (elliptic stability) iff |Tr M| < 2.',
            ],
            solution:
              'M = [[1, K cos θ_n], [1, 1 + K cos θ_n]], giving det M = (1 + K cos θ_n) − K cos θ_n = 1 identically. At (0, π), cos π = −1 so Tr M = 2 − K. Stability requires |2 − K| < 2, hence 0 < K < 4; at K = 4 the elliptic center undergoes a period-doubling bifurcation.',
            solutionTex: '\\det\\begin{pmatrix} 1 & K\\cos\\theta_n \\\\ 1 & 1+K\\cos\\theta_n \\end{pmatrix} = 1, \\qquad |2 - K| < 2 \\iff 0 < K < 4',
          },
          {
            kind: 'exercise',
            id: 'ex-chaos-verlet-symplectic',
            title: 'Exercise 2 · Shadow Hamiltonian of Leapfrog / Velocity Verlet',
            difficulty: 4,
            prompt:
              'For a harmonic oscillator H = ½p² + ½ω²q², find the stability threshold Δt_max of Velocity Verlet.',
            hints: [
              'Write one Velocity Verlet step as a 2 × 2 matrix acting on (q_n, p_n)ᵀ and compute its trace.',
            ],
            solution:
              'One Verlet step yields Tr M = 2 − ω²Δt². Bounded oscillatory solutions require |2 − ω²Δt²| < 2, giving 0 < ωΔt < 2.',
            solutionTex: '|2 - \\omega^2\\Delta t^2| < 2 \\implies \\Delta t_{\\max} = \\frac{2}{\\omega}',
          },
        ],
      },
      {
        pageNumber: 12,
        chapterNumber: 4,
        chapterTitle: 'Where This Leads & References',
        heading: 'Further Exploration Across the Library',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Phase-space volume conservation and ergodicity bridge mechanics directly to statistical thermodynamics (Boltzmann’s H-theorem and Loschmidt’s paradox), while semiclassical quantization of integrable vs chaotic systems connects torus actions I_k = (n_k + ¼)ℏ to quantum wavepacket scars.',
            ],
          },
          {
            kind: 'references-list',
            leadsToBookIds: [
              'entropy-and-the-arrow-of-time',
              'lagrangian-mechanics',
              'wavefunction-and-its-evolution',
            ],
          },
        ],
      },
    ],
  },
];
