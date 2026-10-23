import type { BookMeta } from '@/lib/schema';

export const BOOKS_QUANTUM: BookMeta[] = [
  {
    id: 'wavefunction-and-its-evolution',
    title: 'The Wavefunction and Its Evolution',
    subtitle: 'Hilbert Space, Unitary Dynamics, Barrier Tunnelling, and Decoherence',
    wing: 'quantum',
    status: 'published',
    difficulty: 3,
    readingMinutes: 38,
    prerequisites: ['lagrangian-mechanics', 'waves-interference-fourier-optics'],
    shelf: { side: 'left', bay: 1, level: 2, slot: 3, mezzanine: false },
    cover: { colour: '#134E4A', material: 'cloth', emblem: 'wavepacket' },
    conventions: {
      units: 'natural',
      fourier: 'ψ̃(k) = (2π)⁻¹/² ∫ ψ(x) e^{−ikx} dx',
      notes: 'Natural wave units ℏ = 1, m = 1 in numerical solvers; explicit ℏ and m retained in physical equations.',
    },
    summary:
      'Develops non-relativistic quantum mechanics from complex Hilbert spaces and unitary Schrödinger time evolution to evanescent barrier tunnelling, coherent harmonic states, spin-½ Bloch precession, and environmental decoherence.',
    plannedChapters: [
      '1. Hilbert Space, Observables & Unitary Schrödinger Evolution',
      '2. Dispersion, Stationary States & Quantum Barrier Tunnelling',
      '3. Harmonic Ladder Operators, Coherent States & Bloch Sphere',
      '4. Entanglement, Reduced Density Matrices & Decoherence',
    ],
    references: [
      {
        authors: 'J. J. Sakurai, J. Napolitano',
        title: 'Modern Quantum Mechanics',
        year: 2020,
        edition: '3rd ed.',
        chapters: 'Ch. 1–2',
      },
      {
        authors: 'D. J. Griffiths, D. F. Schroeter',
        title: 'Introduction to Quantum Mechanics',
        year: 2018,
        edition: '3rd ed.',
        chapters: 'Ch. 1–3',
      },
      {
        authors: 'R. Shankar',
        title: 'Principles of Quantum Mechanics',
        year: 1994,
        edition: '2nd ed.',
        chapters: 'Ch. 4–5, 7',
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: 'The Wavefunction and Its Evolution',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Quantum mechanics replaces a particle’s point (q, p) in classical phase space with a ray |ψ⟩ in a complex Hilbert space ℋ. Interference happens in complex amplitude ψ(x, t) = |ψ| e^{iφ}; probabilities |ψ(x, t)|² appear only when quantum correlations become entangled with a macroscopic apparatus.',
            ],
            glossaryTerms: ['unitarity', 'decoherence'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Declared Conventions & Phase-Wheel Encoding',
            body: 'Dirac bra-ket inner product ⟨φ|ψ⟩ = ∫ φ*(x) ψ(x) dx; Born normalisation ⟨ψ|ψ⟩ = 1. Throughout Physica, complex wavefunctions map |ψ|² to brightness and quantum phase arg ψ ∈ [−π, π] to colour-wheel hue.',
            tex: 'i\\hbar\\frac{\\partial}{\\partial t}|\\psi(t)\\rangle = \\hat{H}|\\psi(t)\\rangle, \\qquad \\langle \\psi(t)|\\psi(t)\\rangle = 1',
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
                title: 'Hilbert Space & Unitarity',
                coreIdea: 'Self-adjoint Hamiltonians H = H† generate norm-preserving unitary evolution U(t) = exp(−iHt/ℏ).',
              },
              {
                chapter: 2,
                title: 'Dispersion & Tunnelling',
                coreIdea: 'Imaginary wavevectors κ = √(2m(V₀ − E))/ℏ stitch oscillatory waves across classically forbidden barriers.',
              },
              {
                chapter: 3,
                title: 'Coherent States & Spin-½',
                coreIdea: 'Eigenstates |α⟩ of annihilation operator â follow classical harmonic trajectories without spreading.',
              },
              {
                chapter: 4,
                title: 'Measurement & Decoherence',
                coreIdea: 'Which-path entanglement suppresses off-diagonal coherences ρ_12 → ρ_12 ⟨E₁|E₂⟩ without non-unitary collapse.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · Unitary Schrödinger Dynamics',
        heading: 'Probability Continuity & Robertson Uncertainty',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'In the position basis ⟨x|p̂|ψ⟩ = −iℏ ∂_x ψ(x), canonical commutation [x̂, p̂] = iℏ enforces Robertson’s uncertainty inequality σ_A σ_B ≥ ½|⟨[Â, B̂]⟩| and drives local probability conservation ∂_t ρ + ∂_x j = 0:',
            ],
            glossaryTerms: ['unitarity'],
          },
          {
            kind: 'eq',
            id: 'eq-tdse-current',
            number: '1.1',
            label: 'Time-Dependent Schrödinger Equation & Probability Current',
            tex: 'i\\hbar\\frac{\\partial\\psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\frac{\\partial^2\\psi}{\\partial x^2} + V(x)\\psi, \\qquad j(x,t) = \\frac{\\hbar}{m}\\,\\operatorname{Im}\\!\\left(\\psi^*\\frac{\\partial\\psi}{\\partial x}\\right)',
            symbols: [
              { symbol: '\\psi(x,t)', meaning: 'Complex position-space probability amplitude', units: 'm⁻¹/²' },
              { symbol: '\\hbar', meaning: 'Reduced Planck constant h/(2π)', units: 'J·s' },
              { symbol: 'j(x,t)', meaning: 'Quantum probability flux density (proportional to phase gradient ∂_x φ!)', units: 's⁻¹' },
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Quantum Tunnelling & Split-Step Dynamics',
        heading: 'Penetrating Classically Forbidden Barriers',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'derivation',
            title: 'Exact Square-Barrier Transmission Coefficient (E < V₀)',
            steps: [
              {
                tex: '\\psi_{\\mathrm{I}}(x) = e^{ikx} + r\\,e^{-ikx}, \\quad \\psi_{\\mathrm{II}}(x) = A e^{\\kappa x} + B e^{-\\kappa x}, \\quad \\psi_{\\mathrm{III}}(x) = t\\,e^{ikx}',
                why: 'Solve −(ℏ²/2m)ψ″ + V(x)ψ = Eψ in regions x < 0, 0 ≤ x ≤ a, and x > a with k = √(2mE)/ℏ and κ = √(2m(V₀ − E))/ℏ.',
              },
              {
                tex: '\\psi \\text{ and } \\frac{d\\psi}{dx} \\text{ continuous at } x = 0 \\text{ and } x = a',
                why: 'Finite potential jump V₀ implies ψ″ is bounded, so both ψ and ψ′ match smoothly across boundaries.',
              },
              {
                tex: 'T(E) \\equiv |t|^2 = \\left[1 + \\frac{V_0^2 \\sinh^2(\\kappa a)}{4 E (V_0 - E)}\\right]^{-1} \\underset{\\kappa a \\gg 1}{\\approx} \\frac{16 E (V_0 - E)}{V_0^2}\\,e^{-2\\kappa a}',
                why: 'Eliminate A, B, r algebraically; exponential Gamow factor exp(−2κa) governs α-decay and scanning tunnelling microscopy!',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Quantum Tunnelling & Split-Step Dynamics',
        heading: 'Interactive Laboratory: 1D Split-Step Fourier Schrödinger Sandbox',
        blocks: [
          {
            kind: 'sim',
            simId: 'schrodinger-1d',
            caption: 'Exact unitary Strang Split-Step FFT evolution with phase-wheel colouring and barrier/harmonic modes.',
            notice:
              'Colour encodes quantum phase arg ψ: rapid rainbow stripes mean high momentum k₀! Tune V₀ above packet energy E₀ = ½k₀² to watch partial reflection interference fringes on the left and an attenuated transmitted packet on the right, while total norm ∫|ψ|²dx stays 1.000000.',
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Why Strang Split-Step Conserves Unitarity Exactly',
        heading: 'Factoring Non-Commuting Kinetic and Potential Operators',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Because [T̂, V̂] ≠ 0, exp(−i(T̂ + V̂)Δt/ℏ) ≠ exp(−iT̂Δt/ℏ) exp(−iV̂Δt/ℏ). However, symmetric Strang splitting sandwiches a full k-space kinetic step between two half-steps of x-space potential phase:',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-strang-split',
            number: '2.1',
            label: 'Unitary Symmetric Strang Splitting',
            tex: 'e^{-i(\\hat{T}+\\hat{V})\\Delta t/\\hbar} = e^{-i\\hat{V}\\Delta t/(2\\hbar)}\\,\\mathcal{F}^{-1}\\!\\left[e^{-i\\hbar k^2\\Delta t/(2m)}\\,\\mathcal{F}\\right]e^{-i\\hat{V}\\Delta t/(2\\hbar)} + \\mathcal{O}(\\Delta t^3)',
            symbols: [
              { symbol: '\\mathcal{F}, \\mathcal{F}^{-1}', meaning: 'Unitary discrete Fourier and inverse Fourier transforms', units: '1' },
              { symbol: '\\Delta t', meaning: 'Time step (each factor is strictly unitary so ‖ψ‖₂ is exact for ANY Δt!)', units: 's' },
            ],
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Harmonic Oscillator, Coherent States & Spin-½',
        heading: 'Algebraic Quantization and Minimum-Uncertainty Packets',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Factoring the harmonic oscillator Hamiltonian via non-Hermitian ladder operators â = √(mω/2ℏ)(x̂ + ip̂/(mω)) with [â, â†] = 1 yields discrete spectrum E_n = ℏω(n + ½). Right eigenstates â|α⟩ = α|α⟩ (Glauber coherent states) saturate Δx Δp = ℏ/2 and oscillate classically without dispersing! Switch the Schrödinger lab on p. 5 to "Harmonic Coherent State" to see this live.',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-ho-bloch',
            number: '3.1',
            label: 'Harmonic Spectrum & Spin-½ Bloch Sphere Representation',
            tex: '\\hat{H} = \\hbar\\omega\\!\\left(\\hat{a}^\\dagger\\hat{a} + \\tfrac{1}{2}\\right), \\qquad |\\chi\\rangle = \\cos\\tfrac{\\theta}{2}|\\!\\uparrow\\rangle + e^{i\\phi}\\sin\\tfrac{\\theta}{2}|\\!\\downarrow\\rangle, \\quad \\frac{d\\langle\\boldsymbol{\\sigma}\\rangle}{dt} = \\gamma\\,\\langle\\boldsymbol{\\sigma}\\rangle\\times\\mathbf{B}',
            symbols: [
              { symbol: '\\hat{a}, \\hat{a}^\\dagger', meaning: 'Bosonic lowering and raising ladder operators', units: '1' },
              { symbol: '(\\theta, \\phi)', meaning: 'Polar and azimuthal angles on the S² Bloch sphere', units: 'rad' },
              { symbol: '\\boldsymbol{\\sigma}', meaning: 'Vector of Pauli spin matrices (σ_x, σ_y, σ_z)', units: '1' },
            ],
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Measurement, Entanglement & Decoherence',
        heading: 'How Which-Path Information Erases Interference',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Send a particle through slits 1 and 2 while coupling its path weakly to an environmental detector initialized in |E₀⟩: |Ψ⟩ = (|ψ₁⟩|E₁⟩ + |ψ₂⟩|E₂⟩)/√2. Tracing out the unobserved environment multiplies the interference cross-term by the environmental overlap ⟨E₂|E₁⟩:',
            ],
            glossaryTerms: ['decoherence'],
          },
          {
            kind: 'motion',
            motionId: 'decoherence-fringes',
            caption: 'Environmental entanglement ⟨E₂|E₁⟩ → 0 continuously suppressing double-slit fringes into a classical two-hump sum.',
          },
          {
            kind: 'eq',
            id: 'eq-decoherence-visibility',
            number: '4.1',
            label: 'Reduced Density Matrix & Entanglement Fringe Visibility',
            tex: '\\rho_S = \\operatorname{Tr}_E(|\\Psi\\rangle\\langle\\Psi|) \\implies P(x) = \\tfrac{1}{2}|\\psi_1(x)|^2 + \\tfrac{1}{2}|\\psi_2(x)|^2 + \\operatorname{Re}\\!\\left[\\psi_1^*(x)\\psi_2(x)\\langle E_2|E_1\\rangle\\right]',
            symbols: [
              { symbol: '\\rho_S', meaning: 'Reduced density operator of the particle alone', units: '1' },
              { symbol: '|\\langle E_2|E_1\\rangle|', meaning: 'Environmental state overlap (= 1 coherent, = 0 full which-path distinguishability)', units: '1' },
            ],
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Why Macroscopic Cats Do Not Interfere',
        heading: 'Decoherence Timescales in Ambient Photons & Air',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Even a 1 μm dust grain in a room-temperature vacuum chamber scatters thermal infrared photons and residual gas molecules whose scattered states |E(x₁)⟩ and |E(x₂)⟩ become orthogonal over Δx ~ 1 nm in less than 10⁻¹⁸ s—selecting quasi-classical pointer states without modifying the linear Schrödinger equation!',
            ],
          },
          {
            kind: 'callout',
            variant: 'warning',
            title: 'Decoherence vs the Measurement Problem',
            body: 'Decoherence explains dynamically why interference vanishes and why ρ_S becomes diagonal in the pointer basis—converting a coherent superposition into an improper statistical mixture—while interpretations (Everett, Bohm, objective collapse) differ on how a single outcome is experienced.',
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Non-Spreading Glauber Coherent Wavepackets',
        heading: 'Classical Oscillation Inside a Quantum Quadratic Trap',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Unlike free Gaussian packets that disperse in width, a displaced ground state |α⟩ in V(x) = ½mω²x² oscillates rigidly at frequency ω while preserving minimum uncertainty Δx Δp = ℏ/2:',
            ],
          },
          {
            kind: 'sim',
            simId: 'schrodinger-1d',
            presetParams: { harmonic: 1, V0: 0, width: 0.8, k0: 3.5 },
            caption: 'Coherent state oscillating without dispersion inside a harmonic trap (Strang Split-Step FFT).',
            notice: 'Watch the rainbow phase stripes tilt rightward at the bottom of the well (peak momentum) and flatten at the turning points (zero momentum)!',
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
            id: 'ex-qm-ehrenfest',
            title: 'Exercise 1 · Ehrenfest’s Theorem & When ⟨x⟩ Obeys Classical Mechanics',
            difficulty: 3,
            prompt:
              'Using d⟨Â⟩/dt = (i/ℏ)⟨[Ĥ, Â]⟩ for Ĥ = p̂²/(2m) + V(x̂), compute d⟨x̂⟩/dt and d⟨p̂⟩/dt, and determine for which potentials V(x) the centroid ⟨x̂⟩ follows Newton’s law exactly.',
            hints: [
              'Evaluate [x̂, p̂²] = 2iℏ p̂ and [V(x̂), p̂] = iℏ V′(x̂).',
              'Compare ⟨−V′(x̂)⟩ against −V′(⟨x̂⟩) via Taylor expansion around ⟨x̂⟩.',
            ],
            solution:
              'We obtain d⟨x̂⟩/dt = ⟨p̂⟩/m and d⟨p̂⟩/dt = −⟨V′(x̂)⟩. Expanding V′(x) = V′(⟨x⟩) + (x − ⟨x⟩)V″(⟨x⟩) + ½(x − ⟨x⟩)² V‴(⟨x⟩) + … shows ⟨V′(x̂)⟩ = V′(⟨x̂⟩) identically whenever V‴(x) = 0—i.e., free particles, linear fields, and harmonic oscillators (at most quadratic potentials)!',
            solutionTex: 'm\\frac{d^2\\langle\\hat{x}\\rangle}{dt^2} = -\\langle V\'(\\hat{x})\\rangle = -V\'(\\langle\\hat{x}\\rangle) \\quad \\text{iff } \\deg V \\le 2',
          },
          {
            kind: 'exercise',
            id: 'ex-qm-spin-half-2pi',
            title: 'Exercise 2 · Spinor Minus Sign Under a 2π Rotation',
            difficulty: 3,
            prompt:
              'Act with the SU(2) rotation operator U_z(φ) = exp(−i φ σ_z / 2) on a general spin-½ state at φ = 2π and φ = 4π, and explain how neutron interferometry observes this phase.',
            hints: [
              'Since σ_z² = I, expand exp(−i φ σ_z / 2) = cos(φ/2) I − i sin(φ/2) σ_z.',
            ],
            solution:
              'At φ = 2π, cos π = −1 and sin π = 0, so U_z(2π)|χ⟩ = −|χ⟩; full identity returns at φ = 4π. Although a global −1 cancels in ⟨χ|Ô|χ⟩, splitting a neutron beam coherently and rotating ONLY ONE arm by 2π in a magnetic field flips interference fringes from maxima to minima!',
            solutionTex: 'U_{\\hat{\\mathbf{n}}}(2\\pi) = \\cos\\pi\\,\\mathbf{1} - i\\sin\\pi\\,(\\hat{\\mathbf{n}}\\cdot\\boldsymbol{\\sigma}) = -\\mathbf{1}',
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
              'Single-particle wavefunctions ψ(x, t) treat space x as an operator and time t as a parameter—breaking manifest Lorentz symmetry and forbidding particle creation E = mc². Promoting fields φ(x, t) themselves to quantum operators opens Quantum Field Theory.',
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
  {
    id: 'quantum-field-theory-fields-to-particles',
    title: 'Quantum Field Theory: From Fields to Particles',
    subtitle: 'Normal-Mode Quanta, Path Integrals, Feynman Diagrams, and Running Couplings',
    wing: 'quantum',
    status: 'published',
    difficulty: 5,
    readingMinutes: 46,
    prerequisites: ['lagrangian-mechanics', 'maxwells-equations-in-motion', 'wavefunction-and-its-evolution'],
    shelf: { side: 'right', bay: 2, level: 2, slot: 4, mezzanine: false },
    cover: { colour: '#164E63', material: 'leather', emblem: 'feynman-vertex' },
    conventions: {
      units: 'natural',
      metricSignature: '+---',
      fourier: 'φ(x) = ∫ d³p/(2π)³ (2E_p)⁻¹/² [a_p e^{−ip·x} + a†_p e^{ip·x}]',
      notes: 'Natural units ℏ = c = 1; Peskin & Schroeder (+, −, −, −) relativistic particle convention p² = E² − |p|² = m².',
    },
    summary:
      'Answers why every electron in the universe is strictly identical: particles are quantized normal-mode excitations of underlying relativistic fields, interacting via local Lorentz-invariant vertices summed through Feynman’s path integral.',
    plannedChapters: [
      '1. Coupled Oscillators to Relativistic Fields & Fock Quanta',
      '2. Feynman’s Path Integral & Stationary-Phase Interference',
      '3. Perturbation Theory, Propagators & Feynman Diagrams',
      '4. Loops, UV Divergences & Running Couplings',
    ],
    references: [
      {
        authors: 'M. E. Peskin, D. V. Schroeder',
        title: 'An Introduction to Quantum Field Theory',
        year: 1995,
        chapters: 'Ch. 2–4, 9–10',
      },
      {
        authors: 'M. D. Schwartz',
        title: 'Quantum Field Theory and the Standard Model',
        year: 2014,
        chapters: 'Ch. 2, 6–8, 14–16',
      },
      {
        authors: 'A. Zee',
        title: 'Quantum Field Theory in a Nutshell',
        year: 2010,
        edition: '2nd ed.',
        chapters: 'Part I & III',
      },
      {
        authors: 'R. P. Feynman',
        title: 'QED: The Strange Theory of Light and Matter',
        year: 1985,
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: 'Quantum Field Theory: From Fields to Particles',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Combine quantum uncertainty Δx ~ ℏ/(mc) with relativistic pair threshold E ≥ 2mc²: localising a particle within its Compton wavelength inevitably excites particle–antiparticle pairs! Single-particle quantum mechanics must give way to quantum fields whose discrete excitation quanta ARE particles.',
            ],
            glossaryTerms: ['path-integral', 'unitarity'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Declared Conventions',
            body: 'Natural units ℏ = c = 1 (so [E] = [m] = [p] = Mass¹, [x] = [t] = Mass⁻¹); mostly-minus metric η_μν = diag(+1, −1, −1, −1); p·x = E t − p·x.',
            tex: '[\\mathcal{L}] = M^4, \\qquad [\\phi] = M^1, \\qquad [\\psi_{\\mathrm{Dirac}}] = M^{3/2}',
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
                title: 'Oscillator Chain → Field',
                coreIdea: 'Each Fourier mode k of a continuum field is a harmonic oscillator; its n_kth level is n_k indistinguishable bosons.',
              },
              {
                chapter: 2,
                title: 'Sum Over Histories',
                coreIdea: 'Every path contributes e^{iS/ℏ}; rapid phase cancellation away from δS = 0 recovers classical physics.',
              },
              {
                chapter: 3,
                title: 'Propagators & Vertices',
                coreIdea: 'Wick contractions organise interaction expansions into causal Feynman diagrams conserving 4-momentum.',
              },
              {
                chapter: 4,
                title: 'Loops & Renormalization',
                coreIdea: 'Virtual vacuum polarisation makes couplings α(μ) run logarithmically with momentum scale μ.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · Canonical Quantization of Fields',
        heading: 'From a Harmonic Lattice to Relativistic Quanta',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Start with a chain of coupled masses u_n(t) separated by lattice spacing a. Taking the continuum limit a → 0 yields the Klein–Gordon Lagrangian density, whose Fourier modes decouple into independent harmonic oscillators of frequency ω_p = √(|p|² + m²):',
            ],
          },
          {
            kind: 'motion',
            motionId: 'oscillator-chain-to-field',
            caption: 'Continuum limit of coupled oscillators becoming a relativistic scalar field φ(x, t) and discrete momentum quanta a†_p|0⟩.',
          },
          {
            kind: 'eq',
            id: 'eq-klein-gordon-quant',
            number: '1.1',
            label: 'Klein–Gordon Lagrangian & Canonical Fock Hamiltonian',
            tex: '\\mathcal{L} = \\tfrac{1}{2}(\\partial_\\mu\\phi)(\\partial^\\mu\\phi) - \\tfrac{1}{2}m^2\\phi^2, \\qquad [\\hat{\\phi}(\\mathbf{x},t),\\hat{\\pi}(\\mathbf{y},t)] = i\\delta^{(3)}(\\mathbf{x}-\\mathbf{y}), \\qquad \\hat{H} = \\int \\frac{d^3p}{(2\\pi)^3}\\,\\omega_{\\mathbf{p}}\\,\\hat{a}_{\\mathbf{p}}^\\dagger \\hat{a}_{\\mathbf{p}} + E_{\\mathrm{vac}}',
            symbols: [
              { symbol: '\\hat{\\phi}(\\mathbf{x},t)', meaning: 'Real scalar quantum field operator', units: 'GeV' },
              { symbol: '\\hat{\\pi} = \\dot{\\hat{\\phi}}', meaning: 'Canonical conjugate momentum field density', units: 'GeV²' },
              { symbol: '\\omega_{\\mathbf{p}}', meaning: 'Relativistic single-particle energy √(|p|² + m²)', units: 'GeV' },
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · Why Particles Are Identical & Causality Holds',
        heading: 'Spin-Statistics & Microcausality Outside the Light Cone',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Because [a†_p, a†_q] = 0, the two-particle state a†_p a†_q|0⟩ = a†_q a†_p|0⟩ is automatically Bose-symmetric! There is no "electron #1" vs "electron #2"—there is one universal electron Dirac field ψ(x) carrying two excitations.',
              'Furthermore, although a single positive-energy propagator ⟨0|φ(x)φ(y)|0⟩ leaks exponentially outside the light cone, the causal commutator [φ̂(x), φ̂(y)] vanishes IDENTICALLY for all spacelike separations (x − y)² < 0 because particle and antiparticle propagation amplitudes cancel!',
            ],
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Feynman’s Path Integral',
        heading: 'Rotating Phase Phasors & The Classical Limit',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Inserting completeness resolutions of identity into ⟨q_f, t_f | e^{−iĤT/ℏ} | q_i, t_i⟩ expresses quantum mechanics and QFT as a democratic sum over ALL histories weighted by unit-modulus complex phasors exp(iS/ℏ):',
            ],
            glossaryTerms: ['path-integral'],
          },
          {
            kind: 'eq',
            id: 'eq-path-integral-gen',
            number: '2.1',
            label: 'Path-Integral Generating Functional',
            tex: 'Z[J] = \\int \\mathcal{D}\\phi\\,\\exp\\!\\left[\\frac{i}{\\hbar}\\int d^4x\\,\\big(\\mathcal{L}[\\phi] + J(x)\\phi(x)\\big)\\right]',
            symbols: [
              { symbol: 'Z[J]', meaning: 'Vacuum-to-vacuum generating functional in external source J(x)', units: '1' },
              { symbol: '\\mathcal{D}\\phi', meaning: 'Functional measure over spacetime field configurations', units: 'formal' },
            ],
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Feynman’s Path Integral',
        heading: 'Interactive Laboratory: Path-Integral Phasors & QED Vertex Builder',
        blocks: [
          {
            kind: 'sim',
            simId: 'feynman-paths',
            caption: 'Feynman "little arrows" phasor sum ∑ exp(iS[γ]/ℏ) plus interactive QED vertex & coupling order explorer.',
            notice:
              'Lower ℏ toward the semiclassical regime: paths far from α = 0 spin wildly in phase and curl into tight destructive spirals (Cornu spiral), while paths immediately flanking the classical extremum δS = 0 align head-to-tail constructively! Switch tab/mode to build valid QED diagrams.',
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Perturbation Theory & Feynman Diagrams',
        heading: 'Propagators, QED Vertices & Scattering Amplitudes',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Adding an interaction such as the QED gauge coupling −e ψ̄ γ^μ ψ A_μ expands exp(i ∫ ℒ_int d⁴x) in powers of e. Each internal line represents a Feynman propagator carrying off-shell 4-momentum q^μ (q² ≠ m²), and each QED vertex contributes −ie γ^μ while enforcing exact 4-momentum conservation (2π)⁴ δ⁽⁴⁾(∑ p):',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-feynman-propagator',
            number: '3.1',
            label: 'Feynman Scalar & Fermion Propagators + QED Fine-Structure Constant',
            tex: 'D_F(p) = \\frac{i}{p^2 - m^2 + i\\epsilon}, \\qquad S_F(p) = \\frac{i(\\not{p} + m)}{p^2 - m^2 + i\\epsilon}, \\qquad \\alpha \\equiv \\frac{e^2}{4\\pi} \\approx \\frac{1}{137.036}',
            symbols: [
              { symbol: 'D_F(p), S_F(p)', meaning: 'Momentum-space time-ordered Feynman propagators', units: 'GeV⁻², GeV⁻¹' },
              { symbol: '+i\\epsilon', meaning: 'Infinitesimal contour prescription sending positive frequencies forward in t', units: 'GeV²' },
              { symbol: '\\alpha', meaning: 'Dimensionless QED fine-structure coupling constant at q² → 0', units: '1' },
            ],
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Loops, Renormalization & Effective Field Theory',
        heading: 'Why Couplings Run with Momentum Scale',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Tree diagrams fix all internal momenta; closed loop diagrams leave an unconstrained 4-momentum ∫ d⁴k/(2π)⁴ that diverges logarithmically or quadratically as |k| → ∞! Far from signalling inconsistency, Kenneth Wilson showed UV divergences simply parameterise our ignorance of physics above cutoff Λ.',
              'Expressing scattering amplitudes in terms of a physical measurement at energy scale μ cancels Λ completely and reveals logarithmic running dα/d ln μ = β(α):',
            ],
            glossaryTerms: ['renormalization-group'],
          },
          {
            kind: 'eq',
            id: 'eq-qed-beta',
            number: '4.1',
            label: 'One-Loop QED Beta Function & Running Fine-Structure Constant',
            tex: '\\mu\\frac{d\\alpha}{d\\mu} = \\beta(\\alpha) = \\frac{2\\alpha^2}{3\\pi} + \\mathcal{O}(\\alpha^3) \\implies \\alpha(Q^2) = \\frac{\\alpha(\\mu_0^2)}{1 - \\frac{\\alpha(\\mu_0^2)}{3\\pi}\\ln(Q^2/\\mu_0^2)}',
            symbols: [
              { symbol: '\\beta(\\alpha)', meaning: 'Callan–Symanzik RG beta function (> 0 screening in QED; < 0 antiscreening in QCD!)', units: '1' },
              { symbol: '\\alpha(Q^2)', meaning: 'Effective QED coupling (~1/137 at low Q, rising to ~1/128 at M_Z = 91.2 GeV!)', units: '1' },
            ],
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Precision Triumph of QFT',
        heading: 'Schwinger’s Anomalous Magnetic Moment a_e = (g − 2)/2',
        blocks: [
          {
            kind: 'callout',
            variant: 'history',
            title: 'Twelve Significant Figures Between Theory and Experiment',
            body: 'Dirac’s tree-level equation predicts g = 2. Julian Schwinger’s 1948 one-loop vertex correction gave (g − 2)/2 = α/(2π) ≈ 0.0011614—inscribed on his headstone. Five-loop QED calculations today agree with Penning-trap single-electron measurements to 1 part in 10¹²!',
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Interactive QED Diagram & Loop Order Builder',
        heading: 'Tree Exchange, Compton Scattering & Vacuum Polarisation',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Inspect how QED vertices combine into tree-level scattering (𝓜 ∝ e²) and one-loop vacuum polarisation driving the running coupling α(Q²):',
            ],
          },
          {
            kind: 'sim',
            simId: 'feynman-paths',
            presetParams: { mode: 1, loops: 2, hbar: 0.24 },
            caption: 'QED Diagram Explorer comparing Møller scattering, Compton scattering, and 1-loop e⁺e⁻ vacuum polarisation.',
            notice: 'Slide "QED diagram" across 0, 1, and 2 to inspect how fermion loops dress the bare photon propagator.',
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
            id: 'ex-qft-operator-dim',
            title: 'Exercise 1 · Mass Dimension of Fermi’s Four-Fermion Coupling G_F',
            difficulty: 3,
            prompt:
              'In natural units ℏ = c = 1 in 3 + 1 dimensions, determine the mass dimension of the Dirac field ψ from ℒ = ψ̄(iγ^μ ∂_μ − m)ψ, find [G_F] in ℒ_Fermi = G_F (ψ̄γ^μψ)(ψ̄γ_μψ), and deduce how the weak cross-section σ(νe → νe) scales with centre-of-mass energy E ≪ M_W.',
            hints: [
              'Action S = ∫ d⁴x ℒ is dimensionless, so [d⁴x] = M⁻⁴ implies [ℒ] = M⁴ and [∂_μ] = M¹.',
              'Cross-section σ has units of area = length² = M⁻² and is proportional to G_F².',
            ],
            solution:
              'From [ψ̄ ∂ ψ] = M⁴ with [∂] = M¹, we get 2[ψ] + 1 = 4 ⇒ [ψ] = M^{3/2}. Then [(ψ̄ψ)²] = M⁶, forcing [G_F] = M⁻² (experimentally G_F ≈ 1.166 × 10⁻⁵ GeV⁻²). Since [σ] = M⁻² and σ ∝ G_F² ([G_F²] = M⁻⁴), dimensional analysis requires σ ∝ G_F² E²—growing quadratically until W-boson propagation tames it around E ~ M_W ≈ 80.4 GeV!',
            solutionTex: '[\\psi] = M^{3/2} \\implies [G_F] = M^{-2} \\implies \\sigma(E) \\sim G_F^2 E^2 \\quad (E \\ll M_W)',
          },
          {
            kind: 'exercise',
            id: 'ex-qft-wick-rotation',
            title: 'Exercise 2 · Stationary Phase Gaussian Integral & Semiclassical Prefactor',
            difficulty: 4,
            prompt:
              'Evaluate I(ℏ) = ∫_{−∞}^∞ dx exp(i S(x)/ℏ) in the limit ℏ → 0 around an isolated non-degenerate stationary point x_* where S′(x_*) = 0 and S″(x_*) > 0.',
            hints: [
              'Expand S(x) ≈ S(x_*) + ½ S″(x_*)(x − x_*)² and use Fresnel’s integral ∫ exp(i a u²/2) du = √(2πi / a).',
            ],
            solution:
              'Factoring out exp(i S(x_*)/ℏ) leaves the Fresnel Gaussian integral √(2πiℏ / S″(x_*)) = √(2πℏ / S″(x_*)) exp(iπ/4)—the exact 1D prototype of the Van Vleck–Morette path-integral determinant!',
            solutionTex: 'I(\\hbar) \\sim \\sqrt{\\frac{2\\pi\\hbar}{S\'\'(x_*)}}\\,e^{i\\pi/4}\\,e^{i S(x_*)/\\hbar}',
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
              'Promoting Abelian U(1) QED to chiral non-Abelian SU(3)_C × SU(2)_L × U(1)_Y gauge fields plus Higgs symmetry breaking builds the Standard Model—while emergent Dirac and Chern–Simons fields in crystalline lattices drive topological condensed matter.',
            ],
          },
          {
            kind: 'references-list',
            leadsToBookIds: [
              'the-standard-model-and-beyond',
              'phase-transitions-renormalization-group',
              'topology-in-condensed-matter',
            ],
          },
        ],
      },
    ],
  },
];
