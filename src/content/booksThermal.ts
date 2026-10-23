import type { BookMeta } from '@/lib/schema';

export const BOOKS_THERMAL: BookMeta[] = [
  {
    id: 'entropy-and-the-arrow-of-time',
    title: 'Entropy and the Arrow of Time',
    subtitle: 'Microstates, Boltzmann’s H-Theorem, Loschmidt Reversibility, and Landauer’s Cost',
    wing: 'thermal',
    status: 'published',
    difficulty: 3,
    readingMinutes: 36,
    prerequisites: ['lagrangian-mechanics'],
    shelf: { side: 'left', bay: 1, level: 2, slot: 3, mezzanine: false },
    cover: { colour: '#7C2D12', material: 'leather', emblem: 'entropy-gas' },
    conventions: {
      units: 'SI',
      notes: 'Boltzmann constant k_B = 1.380649 × 10⁻²³ J·K⁻¹; phase-space cell unit h^{dN}.',
    },
    summary:
      'Confronts the deepest puzzle in statistical mechanics: how strictly time-reversible Hamiltonian collisions generate an unmistakable thermodynamic arrow of time, Maxwell–Boltzmann relaxation, and an energetic price for erasing information.',
    plannedChapters: [
      '1. Microstates, Macrostates & Boltzmann–Gibbs Entropy',
      '2. Kinetic Relaxation & Boltzmann’s H-Theorem',
      '3. Loschmidt’s Reversibility Paradox & Typicality',
      '4. Maxwell’s Demon & Landauer’s Principle',
    ],
    references: [
      {
        authors: 'M. Kardar',
        title: 'Statistical Physics of Particles',
        year: 2007,
        chapters: 'Ch. 1, 3–4',
      },
      {
        authors: 'J. P. Sethna',
        title: 'Statistical Mechanics: Entropy, Order Parameters, and Complexity',
        year: 2021,
        edition: '2nd ed.',
        chapters: 'Ch. 3, 5, 7',
      },
      {
        authors: 'F. Reif',
        title: 'Fundamentals of Statistical and Thermal Physics',
        year: 1965,
        chapters: 'Ch. 2–3, 7',
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: 'Entropy and the Arrow of Time',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Film two billiard balls colliding and play the reel backwards: nothing looks amiss. Film cream dispersing in hot coffee or a gas expanding into an evacuated bulb and reverse the reel: every observer laughs. Yet the cream and gas obey the very same time-reversal-symmetric Hamiltonian equations!',
            ],
            glossaryTerms: ['boltzmann-entropy', 'loschmidt-paradox'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Declared Conventions',
            body: 'SI units; Boltzmann constant k_B = 1.380649 × 10⁻²³ J·K⁻¹ (exact 2019 SI definition). Boltzmann H-functional H[f] = ∫ f(v) ln f(v) d^d v.',
            tex: 'S_{\\mathrm{B}} = k_B \\ln \\Omega, \\qquad S_{\\mathrm{G}}[\\rho] = -k_B \\int \\rho \\ln \\rho\\, d\\Gamma',
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
                title: 'Counting Microstates',
                coreIdea: 'Equilibrium macrostates dominate 6N-dimensional phase space by overwhelming factors of exp(10²³).',
              },
              {
                chapter: 2,
                title: 'Kinetic Theory & H-Theorem',
                coreIdea: 'Molecular chaos drives velocity distributions monotonically toward the Gaussian Maxwellian.',
              },
              {
                chapter: 3,
                title: 'Loschmidt’s Paradox',
                coreIdea: 'Flipping all velocities reverses relaxation—revealing low initial entropy and extreme Lyapunov fragility.',
              },
              {
                chapter: 4,
                title: 'Demon & Landauer Bound',
                coreIdea: 'Memory erasure dissipates at least k_B T ln 2 of heat per bit, rescuing the Second Law.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · Microstates, Macrostates & Entropy',
        heading: 'The Geometry of Overwhelming Multiplicity',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'A microstate specifies all 3N positions and 3N momenta; a macrostate specifies only coarse observables (E, V, N). Watch how phase-space trajectories wander almost exclusively into the macrostate cell of largest volume Ω:',
            ],
            glossaryTerms: ['boltzmann-entropy'],
          },
          {
            kind: 'motion',
            motionId: 'boltzmann-phase-cells',
            caption: 'Coarse-grained phase-space partitions showing why typical trajectories enter cells of exponentially larger volume Ω.',
          },
          {
            kind: 'eq',
            id: 'eq-boltzmann-gibbs',
            number: '1.1',
            label: 'Boltzmann Epitaph & Thermodynamic Temperature',
            tex: 'S(E,V,N) = k_B \\ln \\Omega(E,V,N), \\qquad \\frac{1}{T} = \\left(\\frac{\\partial S}{\\partial E}\\right)_{V,N}',
            symbols: [
              { symbol: 'S', meaning: 'Thermodynamic entropy', units: 'J·K⁻¹' },
              { symbol: '\\Omega', meaning: 'Dimensionless multiplicity of accessible microstates', units: '1' },
              { symbol: 'k_B', meaning: 'Boltzmann constant', units: 'J·K⁻¹' },
              { symbol: 'T', meaning: 'Absolute temperature', units: 'K' },
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Kinetic Relaxation & The H-Theorem',
        heading: 'From Elastic Collisions to the Maxwell–Boltzmann Law',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Assuming uncorrelated pre-collisional velocities (Stosszahlansatz / molecular chaos), Ludwig Boltzmann derived in 1872 his transport equation for the single-particle distribution f(r, v, t) and proved dH/dt ≤ 0, with equality iff ln f is a linear combination of the collisional invariants (1, m v, ½mv²):',
            ],
          },
          {
            kind: 'derivation',
            title: 'Stationarity Condition of Boltzmann’s H-Functional',
            steps: [
              {
                tex: 'H(t) \\equiv \\int f(\\mathbf{v},t)\\ln f(\\mathbf{v},t)\\,d^d v, \\qquad \\frac{dH}{dt} = -\\frac{1}{4}\\int W(1,2\\leftrightarrow 1\',2\')(f_1\'f_2\' - f_1 f_2)\\ln\\!\\left(\\frac{f_1\'f_2\'}{f_1 f_2}\\right) \\le 0',
                why: 'Symmetrise binary collision integrand using microscopic reversibility W; note (x − y) ln(x/y) ≥ 0 for all x, y > 0.',
              },
              {
                tex: '\\frac{dH}{dt} = 0 \\iff f(\\mathbf{v}_1\')f(\\mathbf{v}_2\') = f(\\mathbf{v}_1)f(\\mathbf{v}_2) \\iff \\ln f(\\mathbf{v}) = A + \\mathbf{B}\\cdot\\mathbf{v} - \\frac{m v^2}{2 k_B T}',
                why: 'Additivity in elastic collisions forces ln f(v) to span only mass, momentum, and kinetic energy.',
              },
              {
                tex: 'P_{2\\mathrm{D}}(v) = \\frac{m v}{k_B T}\\exp\\!\\left(-\\frac{m v^2}{2 k_B T}\\right), \\qquad P_{3\\mathrm{D}}(v) = 4\\pi\\!\\left(\\frac{m}{2\\pi k_B T}\\right)^{3/2} v^2 \\exp\\!\\left(-\\frac{m v^2}{2 k_B T}\\right)',
                why: 'Integrate Gaussian over angular shells (2πv dv in 2D, 4πv² dv in 3D) in the rest frame.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Loschmidt’s Paradox in Action',
        heading: 'Interactive Laboratory: Event-Driven Gas & Velocity Reversal',
        blocks: [
          {
            kind: 'sim',
            simId: 'hard-sphere-gas',
            caption: 'Exact event-driven elastic disk gas with live speed histogram, Boltzmann H(t), and Loschmidt v → −v button.',
            notice:
              'Watch the initially bimodal speed distribution relax rapidly onto the smooth Maxwell–Boltzmann curve as H(t) drops. Then press "Reverse Velocities (v → −v)": exact event-driven kinematics briefly retraces collisions backward, spiking H(t) back toward its non-equilibrium origin!',
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Resolving Loschmidt & Zermelo',
        heading: 'Where Irreversibility Actually Enters',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Josef Loschmidt objected in 1876: for every entropy-increasing trajectory, flipping v_i → −v_i produces an equally valid mechanical trajectory along which H increases! Where did time-asymmetry sneak into Boltzmann’s proof?',
              'Answer: the Stosszahlansatz assumes velocities are uncorrelated BEFORE each collision, not AFTER. After a collision, outgoing velocities carry subtle many-body correlations. Flipping v_i → −v_i converts outgoing correlations into finely tuned incoming correlations that temporarily anti-relax—until tiny perturbations δv ~ 10⁻¹⁶ amplified by Lyapunov instability destroy those correlations within a few mean free times!',
            ],
            glossaryTerms: ['loschmidt-paradox'],
          },
          {
            kind: 'callout',
            variant: 'intuition',
            title: 'Zermelo’s Poincaré Recurrence Objection',
            body: 'Poincaré’s recurrence theorem guarantees a bounded Hamiltonian gas eventually returns arbitrarily close to its initial state—but for N = 10²³ molecules the recurrence time ~ exp(10²³) exceeds the age of the universe by unimaginably many orders of magnitude.',
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Fine-Grained vs Coarse-Grained Entropy',
        heading: 'Why Gibbs Entropy Rises Under Coarse-Grained Filamentation',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'By Liouville’s theorem dρ/dt = 0 along trajectories, fine-grained phase-space area stays strictly constant! Yet nonlinear shear stretches ρ(q, p, t) into thin filaments whose coarse-grained envelope fills the energy shell:',
            ],
          },
          {
            kind: 'motion',
            motionId: 'liouville-phase-area',
            caption: 'Constant fine-grained Gibbs volume versus expanding coarse-grained phase-space hull.',
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Information & Thermodynamics',
        heading: 'Maxwell’s Demon, Szilard’s Engine & Landauer’s Bound',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'In 1867 Maxwell imagined a nimble observer opening a frictionless trapdoor between two chambers to let fast molecules pass right and slow molecules pass left, creating a temperature difference without doing work. Leo Szilard (1929), Rolf Landauer (1961), and Charles Bennett (1982) pinpointed the demon’s hidden thermodynamic ledger: its finite memory!',
              'Reversible measurement need not dissipate heat, but resetting a 1-bit memory from an unknown state (0 or 1) back to a standard reference state 0 compresses logical phase space by a factor of 2—which by Liouville’s theorem must dump entropy ΔS_env ≥ k_B ln 2 into the thermal bath:',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-landauer-bound',
            number: '4.1',
            label: 'Landauer’s Minimum Heat of Bit Erasure',
            tex: 'Q_{\\mathrm{erase}} \\ge k_B T \\ln 2 \\approx 2.87 \\times 10^{-21}\\;\\mathrm{J} \\quad (T = 300\\;\\mathrm{K})',
            symbols: [
              { symbol: 'Q_{\\mathrm{erase}}', meaning: 'Minimum heat dissipated into bath at temperature T per erased bit', units: 'J' },
              { symbol: 'k_B T \\ln 2', meaning: 'Thermodynamic cost of 2-to-1 phase-space compression', units: 'J' },
            ],
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Cosmological Boundary Condition',
        heading: 'The Past Hypothesis',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Statistical mechanics explains why entropy increases forward in time from a low-entropy state—and by time symmetry would ALSO increase backward in time if we conditioned solely on today’s macrostate! Why weren’t yesterday’s eggs even more scrambled? Because our universe began 13.8 billion years ago in an extraordinarily smooth, low-gravitational-entropy hot plasma (the Past Hypothesis).',
            ],
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Ehrenfest Dog-Flea Model',
        heading: 'Equilibrium as Dynamic Fluctuation',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Paul and Tatiana Ehrenfest illustrated Boltzmann’s statistical view with N numbered balls split between two urns: at each step pick one ball uniformly at random and move it to the other urn. Starting at n = N, the mean Excess ⟨2n − N⟩_k = N(1 − 2/N)^k decays exponentially to zero while microscopic steps remain reversible.',
            ],
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
            id: 'ex-therm-free-expansion',
            title: 'Exercise 1 · Entropy Change in Adiabatic Free Expansion',
            difficulty: 2,
            prompt:
              'One mole of a monatomic ideal gas expands adiabatically into an evacuated rigid chamber from V₁ to 2V₁. Compute ΔS from microstate counting Ω ∝ V^N E^{3N/2} and explain why ΔQ = 0 does not imply ΔS = 0.',
            hints: [
              'Internal energy E is unchanged because walls are rigid and insulated (W = 0, Q = 0).',
              'Recall Clausius’s equality dS = δQ_rev / T holds only along reversible paths!',
            ],
            solution:
              'Since E is constant, Ω(E, 2V₁, N) / Ω(E, V₁, N) = 2^N. Therefore ΔS = k_B ln(2^N) = N k_B ln 2 = R ln 2 ≈ 5.76 J·K⁻¹. Clausius’s inequality gives ΔS > ∫ δQ/T = 0 because free expansion is irreversible.',
            solutionTex: '\\Delta S = k_B \\ln\\!\\left(\\frac{(2V_1)^N}{V_1^N}\\right) = N k_B \\ln 2 = R\\ln 2',
          },
          {
            kind: 'exercise',
            id: 'ex-therm-2d-mb-moments',
            title: 'Exercise 2 · Speed Ratios in the 2D Maxwell–Boltzmann Gas',
            difficulty: 3,
            prompt:
              'For our 2D hard-disk gas with equilibrium speed distribution P(v) = (mv / k_BT) exp(−mv² / 2k_BT), compute the most probable speed v_mp, mean speed ⟨v⟩, and root-mean-square speed v_rms.',
            hints: [
              'Maximise v exp(−mv²/2k_BT) for v_mp; use Gaussian integrals ∫₀^∞ v² exp(−av²) dv = ¼√(π/a³) and ∫₀^∞ v³ exp(−av²) dv = 1/(2a²).',
            ],
            solution:
              'Setting dP/dv = 0 gives v_mp = √(k_BT/m). Integrating ⟨v⟩ gives √(π k_BT / 2m) ≈ 1.253 v_mp, and equipartition ½m⟨v²⟩ = k_BT (two translational degrees of freedom) gives v_rms = √(2k_BT/m) ≈ 1.414 v_mp.',
            solutionTex: 'v_{\\mathrm{mp}} = \\sqrt{\\frac{k_B T}{m}}, \\quad \\langle v\\rangle = \\sqrt{\\frac{\\pi k_B T}{2m}}, \\quad v_{\\mathrm{rms}} = \\sqrt{\\frac{2 k_B T}{m}}',
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
              'When interactions among N → ∞ degrees of freedom compete with thermal entropy, smooth analyticity breaks down at critical points—leading to collective phase transitions, scale invariance, and Wilson’s renormalization group.',
            ],
          },
          {
            kind: 'references-list',
            leadsToBookIds: [
              'phase-transitions-renormalization-group',
              'hamiltonian-chaos',
              'the-expanding-universe',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'phase-transitions-renormalization-group',
    title: 'Phase Transitions and the Renormalization Group',
    subtitle: 'Order Parameters, Onsager’s Ising Criticality, Block Spins, and Universality',
    wing: 'thermal',
    status: 'published',
    difficulty: 5,
    readingMinutes: 45,
    prerequisites: ['entropy-and-the-arrow-of-time'],
    shelf: { side: 'right', bay: 2, level: 2, slot: 3, mezzanine: false },
    cover: { colour: '#9A3412', material: 'leather', emblem: 'ising-lattice' },
    conventions: {
      units: 'natural',
      notes: 'Dimensionless thermal energy measured in units of coupling J (k_B = 1, J = 1 unless explicitly written).',
    },
    summary:
      'Explains how boiling water, uniaxial ferromagnets, and binary alloys share identical critical exponents to five decimal places—tracing Landau mean-field breakdown, Onsager’s 2D Ising criticality, Kadanoff block-spin scaling, and Kenneth Wilson’s RG fixed points.',
    plannedChapters: [
      '1. Order Parameters, Spontaneous Symmetry Breaking & Ising Model',
      '2. Landau Mean-Field Theory & Why Fluctuations Win Below d = 4',
      '3. Critical Exponents, Scaling & Kadanoff Block Spins',
      '4. Renormalization Group Flows, Fixed Points & Universality',
    ],
    references: [
      {
        authors: 'M. Kardar',
        title: 'Statistical Physics of Fields',
        year: 2007,
        chapters: 'Ch. 1–5',
      },
      {
        authors: 'N. Goldenfeld',
        title: 'Lectures on Phase Transitions and the Renormalization Group',
        year: 1992,
        chapters: 'Ch. 5, 7, 9',
      },
      {
        authors: 'J. Cardy',
        title: 'Scaling and Renormalization in Statistical Physics',
        year: 1996,
        chapters: 'Ch. 1–3',
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: 'Phase Transitions and the Renormalization Group',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'For any finite number of spins N, the partition function Z = ∑ exp(−βH) is a finite sum of positive analytic exponentials—incapable of kinks or divergences. Yet in the thermodynamic limit N → ∞, correlation lengths diverge to infinity, microscopic lattice details wash away, and power laws become universal.',
            ],
            glossaryTerms: ['renormalization-group', 'universality'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Declared Conventions',
            body: 'Ferromagnetic coupling J > 0; reduced temperature t ≡ (T − T_c)/T_c. Exact 2D square-lattice critical point k_B T_c / J = 2 / ln(1 + √2) ≈ 2.269185.',
            tex: 'H = -J\\sum_{\\langle i,j\\rangle} s_i s_j - h\\sum_i s_i, \\qquad s_i \\in \\{-1, +1\\}',
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
                title: 'Ising Ferromagnetism',
                coreIdea: 'Discrete Z₂ spin-flip symmetry breaks spontaneously below T_c in d ≥ 2.',
              },
              {
                chapter: 2,
                title: 'Landau Mean-Field Theory',
                coreIdea: 'Self-consistent field predicts β = ½, γ = 1—exact above upper critical dimension d_u = 4, wrong in d = 2, 3.',
              },
              {
                chapter: 3,
                title: 'Scaling & Block Spins',
                coreIdea: 'Diverging correlation length ξ ~ |t|^{−ν} locks all six critical exponents to just two.',
              },
              {
                chapter: 4,
                title: 'RG Flows & Universality',
                coreIdea: 'Relevant vs irrelevant operators around Wilson–Fisher fixed points classify macroscopic universality.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · The 2D Ising Laboratory',
        heading: 'Critical Opalescence of Spin Domains',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'On a 2D square lattice, Lars Onsager solved the zero-field partition function exactly in 1944, locating criticality via Kramers–Wannier self-duality sinh(2J / k_B T_c) = 1. Explore the ordered, critical, and paramagnetic regimes directly:',
            ],
          },
          {
            kind: 'sim',
            simId: 'ising-rg',
            caption: '2D Ising Lattice with switchable Metropolis & Wolff Cluster updates around T_c ≈ 2.269 J/k_B.',
            notice:
              'Set T = 2.27 (criticality): fractal spin islands span every length scale simultaneously! Notice how single-spin Metropolis suffers critical slowing down (τ ~ L^z with z ≈ 2.17), whereas the Wolff cluster algorithm flips entire correlated domains in a single move.',
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Landau Mean-Field Theory',
        heading: 'Symmetry Dictates the Free-Energy Expansion',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Lev Landau proposed expanding the coarse-grained free energy density f(m) analytically in powers of the Z₂-odd magnetisation order parameter m = ⟨s_i⟩:',
            ],
          },
          {
            kind: 'derivation',
            title: 'Landau Critical Exponents β = ½ and γ = 1',
            steps: [
              {
                tex: 'f(m; t, h) = f_0 + \\tfrac{1}{2}a_0 t\\, m^2 + \\tfrac{1}{4}u\\, m^4 - h m \\qquad (a_0 > 0,\\; u > 0)',
                why: 'Z₂ symmetry m → −m at h = 0 forbids odd powers m, m³; stability at large |m| requires u > 0.',
              },
              {
                tex: '\\frac{\\partial f}{\\partial m} = a_0 t\\, m + u\\, m^3 - h = 0 \\implies m(t < 0, h=0) = \\pm\\sqrt{\\frac{a_0 |t|}{u}} \\propto (-t)^{1/2}',
                why: 'Minimising f for t < 0 reveals spontaneous Z₂ breaking with order-parameter exponent β_MF = 1/2.',
              },
              {
                tex: '\\chi^{-1} = \\left.\\frac{\\partial h}{\\partial m}\\right|_{h=0} = a_0 t + 3u m^2 = \\begin{cases} a_0 t & (t > 0) \\\\ 2 a_0 |t| & (t < 0) \\end{cases} \\implies \\chi \\propto |t|^{-1}',
                why: 'Zero-field magnetic susceptibility diverges symmetrically as |t|^{−γ} with γ_MF = 1.',
              },
            ],
          },
          {
            kind: 'callout',
            variant: 'warning',
            title: 'Onsager’s Shock to Mean-Field Theory',
            body: 'In d = 2, Onsager proved the true spontaneous magnetisation vanishes as (−t)^{1/8}, so β = 1/8 = 0.125 (not 0.5!) and γ = 7/4 = 1.75 (not 1!). Below upper critical dimension d_u = 4, Ginzburg’s criterion shows long-wavelength fluctuations overwhelm the mean value.',
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Kadanoff Block Spins & Scaling',
        heading: 'Zooming Out on a Scale-Invariant Lattice',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Leo Kadanoff (1966) asked: what happens if we group spins into b × b blocks, assign each block a majority spin s′_I, and rescale lengths by x′ = x / b? Away from T_c the correlation length shrinks via ξ′ = ξ / b; right at T_c where ξ = ∞, the coarse-grained system looks statistically identical to the original!',
            ],
            glossaryTerms: ['renormalization-group'],
          },
          {
            kind: 'motion',
            motionId: 'kadanoff-block-spin',
            caption: 'Kadanoff majority-rule block-spin coarse-graining and induced RG trajectories in coupling space.',
          },
          {
            kind: 'eq',
            id: 'eq-widom-hyperscaling',
            number: '3.1',
            label: 'Widom Homogeneous Free-Energy Scaling & Exponent Identities',
            tex: 'f_s(t,h) = b^{-d} f_s\\!\\left(b^{y_t}t, b^{y_h}h\\right) \\implies \\alpha + 2\\beta + \\gamma = 2, \\quad \\beta(\\delta - 1) = \\gamma, \\quad d\\nu = 2 - \\alpha',
            symbols: [
              { symbol: 'b', meaning: 'Spatial coarse-graining rescaling factor (> 1)', units: '1' },
              { symbol: 'y_t, y_h', meaning: 'Thermal and magnetic RG scaling eigenvalues (> 0)', units: '1' },
              { symbol: '\\alpha, \\beta, \\gamma, \\delta, \\nu', meaning: 'Heat-capacity, magnetisation, susceptibility, isotherm, and correlation-length exponents', units: '1' },
            ],
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Wilson’s Renormalization Group',
        heading: 'Fixed Points, Linearised Eigenoperators & Universality',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Kenneth Wilson turned Kadanoff’s picture into an exact calculus on the infinite-dimensional space of dimensionless Hamiltonians K = (K₁, K₂, …). Integrating out short-wavelength modes (b⁻¹Λ < |q| < Λ) defines an RG map K′ = R_b(K) whose fixed points K* = R_b(K*) represent scale-invariant theories:',
            ],
            glossaryTerms: ['universality'],
          },
          {
            kind: 'eq',
            id: 'eq-rg-linearised',
            number: '4.1',
            label: 'Linearised RG Matrix & Correlation-Length Exponent',
            tex: '\\delta K\'_a = \\sum_c T_{ac}(b)\\,\\delta K_c, \\qquad \\lambda_i = b^{y_i} \\implies \\nu = \\frac{1}{y_t}',
            symbols: [
              { symbol: 'T_{ac}(b)', meaning: 'Jacobian ∂R_b / ∂K evaluated at critical fixed point K*', units: '1' },
              { symbol: 'y_i > 0', meaning: 'Relevant RG eigenvalue (grows under coarse-graining; must be tuned to 0)', units: '1' },
              { symbol: 'y_i < 0', meaning: 'Irrelevant RG eigenvalue (decays as b^{−|y_i|} at long wavelengths)', units: '1' },
            ],
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Why Universality Emerges',
        heading: 'Two Relevant Directions Explain Everything',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Around a critical fixed point K*, typically ONLY TWO eigenvalues have y_i > 0: the Z₂-even thermal eigenvalue y_t and the Z₂-odd magnetic-field eigenvalue y_h. All infinitely many other microscopic couplings—next-nearest-neighbour bonds, plaquette terms, lattice anisotropy—carry negative eigenvalues y_i < 0!',
              'As we zoom out to macroscopic scales (b → ∞), every irrelevant coupling decays to zero, funneling disparate physical systems (liquid-vapour CO₂ at its critical point and a 3D uniaxial Ising magnet) along the critical manifold into the exact same Wilson–Fisher fixed point.',
            ],
          },
          {
            kind: 'callout',
            variant: 'intuition',
            title: 'Topology of RG Fixed Points in 2D Ising',
            body: 'T = 0 (K = ∞, completely ordered) and T = ∞ (K = 0, completely uncorrelated) are trivial stable sinks with ξ = 0. The critical fixed point K* separates their basins of attraction; tuning T = T_c places the system on the stable codimension-1 critical surface.',
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Exact 1D Decimation Showcase',
        heading: 'Why 1D Short-Range Ising Has No Finite-T Phase Transition',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'In d = 1 with H = −J ∑ s_i s_{i+1}, summing over every even spin s_{2k} = ±1 exactly produces a b = 2 renormalized 1D Ising chain with coupling K′ = ½ ln cosh(2K) < K for all finite K > 0! Repeated decimation drives K^{(n)} → 0 (the T = ∞ paramagnetic sink), proving T_c = 0 in 1D.',
            ],
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Finite-Size Scaling & Binder Cumulant',
        heading: 'Pinpointing T_c on Finite Lattices',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'In numerical Monte Carlo on an L × L torus, singularities round off when ξ ~ L. Kurt Binder introduced the dimensionless fourth-order magnetisation cumulant U₄, whose prefactor L^{2β/ν} cancels out right at T = T_c—so curves U₄(T) for different system sizes L cross at a single point!',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-binder-cumulant',
            number: '4.2',
            label: 'Binder Fourth-Order Cumulant',
            tex: 'U_4(T, L) = 1 - \\frac{\\langle m^4 \\rangle}{3\\langle m^2 \\rangle^2} = \\tilde{U}_4\\!\\left(t\\, L^{1/\\nu}\\right)',
            symbols: [
              { symbol: 'U_4', meaning: 'Dimensionless kurtosis measure (→ 2/3 for T ≪ T_c, → 0 for T ≫ T_c)', units: '1' },
              { symbol: 'L', meaning: 'Linear lattice dimension', units: 'lattice spacings' },
            ],
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Bridge to Continuum Field Theory',
        heading: 'Continuum Limit = Critical Point',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Taking the lattice spacing a → 0 at fixed physical correlation length ξ_phys = m_phys⁻¹ maps discrete lattice variables onto a relativistic continuum field:',
            ],
          },
          {
            kind: 'motion',
            motionId: 'oscillator-chain-to-field',
            caption: 'Emergence of a smooth continuum field as lattice spacing shrinks relative to correlation length ξ.',
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
            id: 'ex-rg-1d-decimation',
            title: 'Exercise 1 · Exact b = 2 RG Recursion for the 1D Ising Chain',
            difficulty: 4,
            prompt:
              'Sum over the middle spin s₂ = ±1 in exp(K s₁ s₂ + K s₂ s₃) (where K = J/k_BT) to derive tanh K′ = tanh² K, and find the correlation-length exponent ν near T → 0.',
            hints: [
              'Write exp(K s₂(s₁ + s₃)) = A exp(K′ s₁ s₃) for both s₁ = s₃ (s₁s₃ = +1) and s₁ = −s₃ (s₁s₃ = −1).',
              'Divide the two cases to get exp(2K′) = cosh(2K), then rewrite in terms of tanh K = exp(−2K) near K → ∞.',
            ],
            solution:
              'Setting s₁ = s₃ = 1 gives 2 cosh(2K) = A exp(K′); setting s₁ = −s₃ gives 2 = A exp(−K′). Dividing yields exp(2K′) = cosh(2K), equivalent to tanh K′ = (tanh K)². Near T → 0 (u ≡ e^{−2K} ≪ 1), u′ ≈ 2u² or ξ ~ e^{2K}.',
            solutionTex: 'e^{2K\'} = \\cosh(2K) \\iff \\tanh K\' = (\\tanh K)^2',
          },
          {
            kind: 'exercise',
            id: 'ex-rg-2d-exponents',
            title: 'Exercise 2 · Verifying Rushbrooke & Widom Scaling on Exact 2D Ising Exponents',
            difficulty: 3,
            prompt:
              'Given the exact 2D Ising RG eigenvalues y_t = 1 and y_h = 15/8 in d = 2, compute ν, α, β, γ, and δ and check α + 2β + γ = 2.',
            hints: [
              'Use ν = 1/y_t, α = 2 − dν, β = (d − y_h)/y_t, γ = (2y_h − d)/y_t, and δ = y_h/(d − y_h).',
            ],
            solution:
              'With d = 2, y_t = 1, y_h = 15/8: ν = 1, α = 2 − 2(1) = 0 (logarithmic C_V), β = (2 − 15/8)/1 = 1/8, γ = (15/4 − 2)/1 = 7/4, δ = (15/8)/(1/8) = 15. Indeed 0 + 2(1/8) + 7/4 = 2.',
            solutionTex: '\\nu = 1,\\; \\alpha = 0,\\; \\beta = \\tfrac{1}{8},\\; \\gamma = \\tfrac{7}{4},\\; \\delta = 15 \\implies \\alpha + 2\\beta + \\gamma = 2',
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
              'Wilson’s RG transformed both condensed matter and high-energy physics: asymptotic freedom in QCD, running couplings in the Standard Model, and topological phases that defy Landau’s local order-parameter paradigm altogether.',
            ],
          },
          {
            kind: 'references-list',
            leadsToBookIds: [
              'quantum-field-theory-fields-to-particles',
              'topology-in-condensed-matter',
              'the-standard-model-and-beyond',
            ],
          },
        ],
      },
    ],
  },
];
