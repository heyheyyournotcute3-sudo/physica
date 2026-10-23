import type { BookMeta } from '@/lib/schema';

export const BOOKS_FRONTIERS: BookMeta[] = [
  {
    id: 'topology-in-condensed-matter',
    title: 'Topology in Condensed Matter',
    subtitle: 'Bloch Bands, Berry Curvature, SSH Winding Numbers, and Quantized Edge Modes',
    wing: 'frontiers',
    status: 'published',
    difficulty: 5,
    readingMinutes: 44,
    prerequisites: ['wavefunction-and-its-evolution', 'phase-transitions-renormalization-group'],
    shelf: { side: 'left', bay: 1, level: 2, slot: 3, mezzanine: false },
    cover: { colour: '#4A1D3F', material: 'cloth', emblem: 'trefoil-band' },
    conventions: {
      units: 'SI',
      fourier: '|ψ_{n,k}⟩ = e^{ik·r}|u_{n,k}⟩ with cell-periodic |u_{n,k}(r + R)⟩ = |u_{n,k}(r)⟩',
      notes: 'Lattice constant set to a = 1 in tight-binding Brillouin zones k ∈ [−π, π].',
    },
    summary:
      'Explores phases of quantum matter invisible to Landau’s local symmetry-breaking paradigm—where global integer twists (winding and Chern numbers) of Bloch eigenstates over the Brillouin torus force robust gapless states at every boundary.',
    plannedChapters: [
      '1. Bloch’s Theorem & Two-Band Tight-Binding Hamiltonians',
      '2. Adiabatic Transport, Berry Connection & Berry Curvature',
      '3. The SSH Chain, Winding Numbers & Soliton Zero Modes',
      '4. Integer Quantum Hall Effect, Chern Numbers & Bulk-Boundary Correspondence',
    ],
    references: [
      {
        authors: 'J. K. Asbóth, L. Oroszlány, A. Pályi',
        title: 'A Short Course on Topological Insulators',
        year: 2016,
        chapters: 'Ch. 1–2, 5–6',
      },
      {
        authors: 'B. A. Bernevig, T. L. Hughes',
        title: 'Topological Insulators and Topological Superconductors',
        year: 2013,
        chapters: 'Ch. 1–4, 8',
      },
      {
        authors: 'N. W. Ashcroft, N. D. Mermin',
        title: 'Solid State Physics',
        year: 1976,
        chapters: 'Ch. 8, 10',
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: 'Topology in Condensed Matter',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'For half a century condensed matter phases were classified exclusively by broken symmetries: crystals break translation, magnets break rotation. Then in 1980 Klaus von Klitzing measured a Hall resistance quantized to R_H = h/(ν e²) with nine-digit precision in dirty semiconductor samples—heralding topological quantum matter!',
            ],
            glossaryTerms: ['berry-phase', 'chern-number'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Declared Conventions',
            body: 'Brillouin zone k ∈ [−π/a, π/a] is topologically a circle T¹ in 1D and a torus T² in 2D! Berry connection A_n(k) = i⟨u_n(k)|∇_k u_n(k)⟩ is real.',
            tex: 'H(\\mathbf{k}) = d_0(\\mathbf{k})\\mathbf{1} + \\mathbf{d}(\\mathbf{k})\\cdot\\boldsymbol{\\sigma}, \\qquad E_\\pm(\\mathbf{k}) = d_0(\\mathbf{k}) \\pm |\\mathbf{d}(\\mathbf{k})|',
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
                title: 'Bloch Bands on a Torus',
                coreIdea: 'Crystal periodicity compactifies crystal momentum k onto a closed manifold T^d.',
              },
              {
                chapter: 2,
                title: 'Berry Phase & Curvature',
                coreIdea: 'Parallel transport of |u_n(k)⟩ defines a U(1) gauge field in momentum space.',
              },
              {
                chapter: 3,
                title: 'SSH Topological Insulator',
                coreIdea: 'Winding number ν ∈ {0, 1} of d(k) around the origin predicts localized mid-gap E = 0 edge modes.',
              },
              {
                chapter: 4,
                title: 'Chern Insulators & TKNN',
                coreIdea: 'Integrating Berry curvature over T² yields C ∈ ℤ and unidirectional chiral edge channels.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · Bloch’s Theorem & Two-Band Geometry',
        heading: 'Momentum Space as a Closed Compact Manifold',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Discrete translation invariance T_R H = H T_R diagonalises crystal Hamiltonians into blocks H(k) = e^{−ik·r} H e^{ik·r} acting on cell-periodic Bloch functions |u_{n,k}⟩. Because k and k + G label the same physical translation eigenvalue, the Brillouin zone has no boundary—it is a closed d-torus T^d!',
              'For any gapped two-band insulator H(k) = d(k)·σ (with |d(k)| > 0 everywhere on T^d), the unit vector d̂(k) = d(k)/|d(k)| defines a smooth map T^d → S² whose homotopy class cannot change continuously without closing the bulk energy gap |d(k)| = 0.',
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Berry Phase & Momentum-Space Gauge Fields',
        heading: 'Geometric Phase From Parallel Transport',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Michael Berry discovered in 1984 that transporting a non-degenerate eigenstate |n(R)⟩ adiabatically around a closed parameter loop C accumulates—in addition to the dynamical phase −∫ E_n dt / ℏ—a purely geometric phase γ_n(C) equal to the flux of Berry curvature Ω_n:',
            ],
            glossaryTerms: ['berry-phase'],
          },
          {
            kind: 'motion',
            motionId: 'berry-bloch-loop',
            caption: 'Adiabatic loop C on the Bloch sphere sweeping solid angle Ω(C) and accumulating geometric Berry phase γ_− = +½Ω(C).',
          },
          {
            kind: 'eq',
            id: 'eq-berry-conn-curv',
            number: '2.1',
            label: 'Berry Connection, Berry Curvature & Gauge Invariance',
            tex: '\\mathbf{A}_n(\\mathbf{k}) = i\\langle u_n(\\mathbf{k})|\\nabla_{\\mathbf{k}} u_n(\\mathbf{k})\\rangle, \\qquad \\boldsymbol{\\Omega}_n(\\mathbf{k}) = \\nabla_{\\mathbf{k}}\\times\\mathbf{A}_n(\\mathbf{k}), \\qquad \\gamma_n(C) = \\oint_C \\mathbf{A}_n\\cdot d\\mathbf{k}',
            symbols: [
              { symbol: '\\mathbf{A}_n(\\mathbf{k})', meaning: 'Momentum-space Berry vector potential (shifts by −∇_k χ under |u_n⟩ → e^{iχ}|u_n⟩)', units: 'm' },
              { symbol: '\\boldsymbol{\\Omega}_n(\\mathbf{k})', meaning: 'Gauge-invariant Berry curvature ("magnetic field in k-space")', units: 'm²' },
            ],
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · The Su–Schrieffer–Heeger (SSH) Chain',
        heading: 'Dimerized Polyacetylene & Chiral Winding Number',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'derivation',
            title: 'Bulk Bloch Hamiltonian & Topological Winding Number of the SSH Model',
            steps: [
              {
                tex: '\\hat{H} = v\\sum_{m=1}^{N}\\big(|m,A\\rangle\\langle m,B| + \\mathrm{h.c.}\\big) + w\\sum_{m=1}^{N-1}\\big(|m+1,A\\rangle\\langle m,B| + \\mathrm{h.c.}\\big)',
                why: '1D bipartite chain with intracell hopping v (A–B) and intercell hopping w (B–A); sublattice chiral symmetry σ_z H(k) σ_z = −H(k) forbids d_z σ_z!',
              },
              {
                tex: 'H(k) = \\begin{pmatrix} 0 & v + w e^{-ik} \\\\ v + w e^{ik} & 0 \\end{pmatrix} = (v + w\\cos k)\\sigma_x + (w\\sin k)\\sigma_y, \\qquad E_\\pm(k) = \\pm\\sqrt{v^2 + w^2 + 2vw\\cos k}',
                why: 'Fourier-transform periodic bulk: Notice E_±(k) looks IDENTICAL if we swap v ↔ w, with gap 2|v − w| closing at k = π when v = w!',
              },
              {
                tex: '\\nu = \\frac{1}{2\\pi i}\\int_{-\\pi}^{\\pi} dk\\,\\frac{d}{dk}\\ln(v + w e^{-ik}) = \\begin{cases} 0 & (v > w,\\text{ trivial}) \\\\ 1 & (w > v,\\text{ topological}) \\end{cases}',
                why: 'As k sweeps [−π, π], d(k) traces a circle of radius w centred at (v, 0): it encircles the origin iff w > v (Zak phase γ = πν)!',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · The Su–Schrieffer–Heeger (SSH) Chain',
        heading: 'Interactive Laboratory: SSH Winding Curve & Mid-Gap Edge Modes',
        blocks: [
          {
            kind: 'sim',
            simId: 'ssh-topology',
            caption: 'Live SSH open-chain diagonaliser showing (d_x, d_y) winding loop, bulk bands, and localized E = 0 edge modes.',
            notice:
              'Drag w from 0.5 past v = 1.0 up to w = 1.8! At v = w the circle passes right through the origin (gap closes). For w > v (ν = 1), TWO mid-gap states appear pinned at E = 0, exponentially localized on the left A₁ and right B_N chain ends!',
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Chern Numbers & Quantum Hall Conductance',
        heading: 'The TKNN Formula & Haldane’s Zero-Field Model',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Thouless, Kohmoto, Nightingale, and den Nijs (TKNN, 1982) evaluated the Kubo linear-response Hall conductivity σ_xy of a filled 2D band insulator and discovered it equals e²/h times the first Chern number C ∈ ℤ of the U(1) Berry bundle over the 2D Brillouin torus:',
            ],
            glossaryTerms: ['chern-number'],
          },
          {
            kind: 'eq',
            id: 'eq-tknn-chern',
            number: '4.1',
            label: 'TKNN Quantized Hall Conductance & First Chern Number',
            tex: '\\sigma_{xy} = \\frac{e^2}{h}\\sum_{n\\in\\mathrm{occ}} C_n, \\qquad C_n = \\frac{1}{2\\pi}\\iint_{\\mathrm{BZ}} \\Omega_n^{xy}(k_x,k_y)\\,dk_x\\,dk_y \\in \\mathbb{Z}',
            symbols: [
              { symbol: '\\sigma_{xy}', meaning: 'Transverse Hall sheet conductance', units: 'e²/h (Ω⁻¹)' },
              { symbol: 'C_n', meaning: 'Integer Chern invariant (degree of map T² → S²; non-zero requires broken time reversal)', units: '1' },
              { symbol: 'h/e^2', meaning: 'von Klitzing resistance quantum 25,812.80745… Ω (exact SI)', units: 'Ω' },
            ],
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Bulk-Boundary Correspondence',
        heading: 'Why Edge Electrons Cannot Backscatter',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Place a topological insulator (C = 1) next to vacuum (trivial insulator, C = 0). Because an integer cannot jump from 1 to 0 without the energy gap vanishing somewhere, the spatial interface MUST host |ΔC| = 1 chiral gapless edge mode moving strictly one way around the sample perimeter!',
              'When an edge electron encounters a lattice vacancy or impurity, there are literally NO backward-moving states at that energy on that edge to scatter into—it simply flows around the defect dissipationlessly.',
            ],
          },
          {
            kind: 'callout',
            variant: 'history',
            title: 'From Haldane (1988) to Time-Reversal Z₂ Topological Insulators (2005)',
            body: 'Duncan Haldane showed in 1988 that complex next-nearest-neighbour hoppings on honeycomb graphene yield C = ±1 with zero net magnetic flux. Kane & Mele (2005) combined two spin copies via spin-orbit coupling to preserve time reversal, discovering Z₂ quantum spin Hall insulators!',
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Comparing Trivial vs Topological Band Gaps',
        heading: 'Identical Bulk Dispersions, Opposite Boundary Physics',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Compare the trivial dimerization v = 1.45, w = 0.75 (ν = 0) directly against our earlier topological chain v = 0.75, w = 1.45 (ν = 1): the bulk gap 2|v − w| = 1.40 t₀ is identical, yet the zero-energy boundary modes vanish!',
            ],
          },
          {
            kind: 'sim',
            simId: 'ssh-topology',
            presetParams: { v: 1.45, w: 0.75 },
            caption: 'Trivial SSH phase (v > w, ν = 0): loop misses origin and spectrum has no mid-gap edge modes.',
            notice: 'Sweep w upward past 1.45 to witness the bulk gap close at w = v and reopen with two E = 0 edge states.',
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Fractionalization & Majorana Horizons',
        heading: 'Soliton Half-Charges & Topological Quantum Computation',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'In the SSH / Jackiw–Rebbi mechanism, a domain wall between ν = 0 and ν = 1 binds an isolated mid-gap mode carrying fractional fermion number ±e/2! In topological superconductors (1D Kitaev chain), the analogous end modes are self-adjoint Majorana zero modes γ† = γ whose non-Abelian braiding is topologically protected against local decoherence.',
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
            id: 'ex-topo-ssh-edge-wavefn',
            title: 'Exercise 1 · Exact Localization Length of the SSH Zero-Energy Edge State',
            difficulty: 3,
            prompt:
              'On a semi-infinite SSH chain (m = 1, 2, 3, …) in the topological phase w > v, solve H|ψ₀⟩ = 0 explicitly for the left edge mode |ψ_L⟩ = ∑_m a_m |m, A⟩ and determine its localization length ξ.',
            hints: [
              'Project ⟨m, B|H|ψ_L⟩ = v a_m + w a_{m+1} = 0 for every unit cell m ≥ 1.',
            ],
            solution:
              'From v a_m + w a_{m+1} = 0 we obtain a_m = (−v/w)^{m−1} a₁ (with zero amplitude b_m = 0 on sublattice B!). Normalizability ∑ |a_m|² < ∞ holds iff |v/w| < 1 (i.e. w > v!), decaying as exp(−m / ξ) with ξ = 1 / ln(w/v). As w → v⁺, ξ diverges and hybridises across finite chains.',
            solutionTex: 'a_m = \\left(-\\frac{v}{w}\\right)^{m-1} a_1 \\quad (w > v), \\qquad \\xi = \\frac{1}{\\ln(w/v)}',
          },
          {
            kind: 'exercise',
            id: 'ex-topo-two-band-chern',
            title: 'Exercise 2 · Skyrmion Formula for Two-Band Berry Curvature',
            difficulty: 4,
            prompt:
              'State the expression for the lower-band Berry curvature Ω_−^{xy}(k) of H(k) = d(k)·σ in terms of unit vector d̂(k) = d/|d| and interpret C_− geometrically.',
            hints: [
              'Recall on S² the area 2-form is ½ d̂ · (∂_{k_x} d̂ × ∂_{k_y} d̂) dk_x ∧ dk_y.',
            ],
            solution:
              'Direct differentiation gives Ω_−^{xy}(k) = +½ d̂ · (∂_{k_x} d̂ × ∂_{k_y} d̂), so C_− = (1/4π) ∬ d̂ · (∂_x d̂ × ∂_y d̂) d²k counts the integer number of times (skyrmion wrapping number) d̂(k) wraps the Bloch sphere S² as k covers T²!',
            solutionTex: 'C_- = \\frac{1}{4\\pi}\\iint_{\\mathrm{BZ}} \\hat{\\mathbf{d}}\\cdot\\left(\\frac{\\partial\\hat{\\mathbf{d}}}{\\partial k_x}\\times\\frac{\\partial\\hat{\\mathbf{d}}}{\\partial k_y}\\right) dk_x\\,dk_y \\in \\mathbb{Z}',
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
              'Momentum-space Berry gauge fields mirror real-space Yang–Mills gauge fields; chiral edge fermions mirror Standard Model Weyl fermions and anomaly inflow.',
            ],
          },
          {
            kind: 'references-list',
            leadsToBookIds: [
              'the-standard-model-and-beyond',
              'quantum-field-theory-fields-to-particles',
              'phase-transitions-renormalization-group',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'the-standard-model-and-beyond',
    title: 'The Standard Model and Beyond',
    subtitle: 'Gauge Symmetries, Brout–Englert–Higgs Vacuum Breaking, and Neutrino Mixing',
    wing: 'frontiers',
    status: 'published',
    difficulty: 4,
    readingMinutes: 42,
    prerequisites: ['quantum-field-theory-fields-to-particles', 'maxwells-equations-in-motion'],
    shelf: { side: 'right', bay: 2, level: 2, slot: 4, mezzanine: false },
    cover: { colour: '#581C4F', material: 'leather', emblem: 'higgs-potential' },
    conventions: {
      units: 'natural',
      metricSignature: '+---',
      notes: 'Natural units ℏ = c = 1; electric charge Q = T³ + Y/2 (Gell-Mann–Nishijima weak hypercharge convention).',
    },
    summary:
      'Synthesizes humanity’s most tested quantum field theory—SU(3)_C × SU(2)_L × U(1)_Y—explaining chiral matter representations, why explicit gauge-boson masses violate gauge symmetry, how the Higgs condensate generates W±, Z⁰ and fermion masses, and how neutrino oscillations point beyond.',
    plannedChapters: [
      '1. Local Gauge Principle & Standard Model Matter Content',
      '2. Spontaneous Symmetry Breaking & The Brout–Englert–Higgs Mechanism',
      '3. Electroweak Unification: W±, Z⁰, Weinberg Angle & Yukawa Masses',
      '4. Neutrino Oscillations & Open Frontiers Beyond the SM',
    ],
    references: [
      {
        authors: 'M. Thomson',
        title: 'Modern Particle Physics',
        year: 2013,
        chapters: 'Ch. 11, 13, 15–17',
      },
      {
        authors: 'D. J. Griffiths',
        title: 'Introduction to Elementary Particles',
        year: 2008,
        edition: '2nd ed.',
        chapters: 'Ch. 8–11',
      },
      {
        authors: 'Particle Data Group (S. Navas et al.)',
        title: 'Review of Particle Physics (Phys. Rev. D 110, 030001)',
        year: 2024,
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: 'The Standard Model and Beyond',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Every known non-gravitational interaction in nature arises from promoting global internal symmetries to LOCAL spacetime-dependent gauge symmetries SU(3)_C × SU(2)_L × U(1)_Y. Yet unbroken gauge invariance demands strictly massless spin-1 bosons and massless chiral fermions! Nature resolves this tension by hiding the symmetry in the vacuum.',
            ],
            glossaryTerms: ['spontaneous-symmetry-breaking', 'higgs-mechanism'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Declared Conventions',
            body: 'ℏ = c = 1; energies/masses in GeV or eV. Electroweak vacuum expectation value v = (√2 G_F)⁻¹/² ≈ 246.22 GeV; Higgs boson mass m_H ≈ 125.20 GeV.',
            tex: 'G_{\\mathrm{SM}} = SU(3)_C \\times SU(2)_L \\times U(1)_Y \\xrightarrow{\\langle\\Phi\\rangle \\neq 0} SU(3)_C \\times U(1)_{\\mathrm{EM}}',
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
                title: 'Yang–Mills Gauge Principle',
                coreIdea: 'Covariant derivatives D_μ = ∂_μ − ig T^a A^a_μ dictate 8 gluons, 3 W^i, and 1 hypercharge B_μ.',
              },
              {
                chapter: 2,
                title: 'Mexican-Hat Condensate',
                coreIdea: 'μ² < 0 destabilises φ = 0; gauge fields eat would-be Goldstone modes to gain longitudinal polarization.',
              },
              {
                chapter: 3,
                title: 'Electroweak Mixing',
                coreIdea: 'Neutral W³_μ and B_μ rotate by Weinberg angle θ_W into massless photon A_μ and heavy Z_μ (80.4 & 91.2 GeV).',
              },
              {
                chapter: 4,
                title: 'Neutrino Oscillations & BSM',
                coreIdea: 'Flavour states |ν_α⟩ are coherent superpositions of mass eigenstates |ν_i⟩ beating with sin²(1.267 Δm² L/E).',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · Non-Abelian Gauge Fields & Chiral Matter',
        heading: 'Covariant Derivatives and Self-Interacting Gluons',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Requiring ψ(x) → U(x)ψ(x) = exp(ig α^a(x) T^a)ψ(x) with non-commuting generators [T^a, T^b] = i f^{abc} T^c forces the field-strength tensor F^a_{μν} to carry a quadratic commutator term g f^{abc} A^b_μ A^c_ν: unlike photons, gluons and weak W bosons carry gauge charge and interact directly with themselves!',
            ],
            glossaryTerms: ['gauge-invariance'],
          },
          {
            kind: 'eq',
            id: 'eq-yang-mills-cov',
            number: '1.1',
            label: 'Yang–Mills Covariant Derivative & Field-Strength Tensor',
            tex: 'D_\\mu = \\partial_\\mu - i g T^a A^a_\\mu, \\qquad F^a_{\\mu\\nu} = \\partial_\\mu A^a_\\nu - \\partial_\\nu A^a_\\mu + g f^{abc} A^b_\\mu A^c_\\nu',
            symbols: [
              { symbol: 'T^a', meaning: 'Hermitian Lie-algebra generators (3 Pauli σ^a/2 for SU(2); 8 Gell-Mann λ^a/2 for SU(3))', units: '1' },
              { symbol: 'f^{abc}', meaning: 'Totally antisymmetric Lie structure constants', units: '1' },
              { symbol: 'g', meaning: 'Dimensionless gauge coupling constant', units: '1' },
            ],
          },
          {
            kind: 'callout',
            variant: 'warning',
            title: 'Why Explicit Mass Terms Are Forbidden',
            body: 'A Proca vector mass ½ M² A_μ A^μ breaks gauge invariance A_μ → A_μ + ∂_μχ, and a Dirac fermion mass −m(ψ̄_L ψ_R + ψ̄_R ψ_L) breaks SU(2)_L because left-handed fermions ψ_L are SU(2)_L doublets whereas right-handed ψ_R are SU(2)_L singlets!',
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Spontaneous Symmetry Breaking & Higgs',
        heading: 'Choosing a Vacuum Around the Mexican Hat',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Introduce a complex SU(2)_L doublet scalar Φ with hypercharge Y = +1 and potential V(Φ) = −μ² Φ†Φ + λ(Φ†Φ)² (μ² > 0, λ > 0). The potential minimum sits on a 3-sphere Φ†Φ = v²/2 with v = √(μ²/λ) ≈ 246 GeV:',
            ],
            glossaryTerms: ['spontaneous-symmetry-breaking', 'higgs-mechanism'],
          },
          {
            kind: 'motion',
            motionId: 'electroweak-symmetry-breaking',
            caption: 'Spontaneous symmetry breaking on V(Φ): three Goldstone directions absorbed into W±, Z⁰ longitudinal modes while radial h(x) becomes the 125 GeV Higgs boson.',
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Electroweak Unification (Glashow–Weinberg–Salam)',
        heading: 'How Photon Remains Massless While W± and Z⁰ Become Heavy',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'derivation',
            title: 'Gauge Boson Mass Matrix from |D_μ ⟨Φ⟩|²',
            steps: [
              {
                tex: '\\langle\\Phi\\rangle = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 0 \\\\ v \\end{pmatrix}, \\qquad D_\\mu\\Phi = \\left(\\partial_\\mu - i g \\frac{\\sigma^a}{2}W^a_\\mu - i\\frac{g\'}{2}B_\\mu\\right)\\Phi',
                why: 'Choose unitary gauge around neutral lower component (Q = T³ + Y/2 = −½ + ½ = 0 leaves U(1)_EM unbroken!).',
              },
              {
                tex: '|D_\\mu\\langle\\Phi\\rangle|^2 = \\frac{v^2}{8}\\left[g^2\\big((W^1_\\mu)^2 + (W^2_\\mu)^2\\big) + \\big(g W^3_\\mu - g\' B_\\mu\\big)^2\\right]',
                why: 'Evaluate matrix product explicitly; notice only ONE linear combination of W³_μ and B_μ acquires mass!',
              },
              {
                tex: 'M_W = \\tfrac{1}{2}g v, \\qquad M_Z = \\tfrac{1}{2}\\sqrt{g^2+g\'^2}\\,v = \\frac{M_W}{\\cos\\theta_W}, \\qquad M_\\gamma = 0 \\quad (\\tan\\theta_W = g\'/g)',
                why: 'Diagonalise neutral (W³, B) by Weinberg angle θ_W: orthogonal combination A_μ = cos θ_W B_μ + sin θ_W W³_μ stays strictly massless!',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Interactive Laboratory: Higgs Vacuum & Neutrino Oscillations',
        heading: 'Probing Symmetry Breaking and Quantum Flavour Beats',
        blocks: [
          {
            kind: 'sim',
            simId: 'standard-model-lab',
            caption: 'Dual Laboratory: Mexican-Hat Higgs/Goldstone Dynamics & Exact Two-Flavour Neutrino Oscillation Explorer.',
            notice:
              'In Mode 1 (Higgs Potential), launch the scalar field near φ = 0 and watch radial oscillations at m_H = √(2λ)v vs zero-restoring-force angular Goldstone motion! Switch to Mode 2 (Neutrino Oscillations) to vary mixing angle θ and Δm² and track P(ν_μ → ν_e) vs L/E.',
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Neutrino Oscillations & Non-Zero Masses',
        heading: 'Quantum Interference Over Hundreds of Kilometres',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Weak W± vertices create flavour eigenstates |ν_α⟩ (α = e, μ, τ) related to propagation mass eigenstates |ν_i⟩ of mass m_i by the unitary Pontecorvo–Maki–Nakagawa–Sakata (PMNS) matrix U_{αi}. Because ultrarelativistic energy E_i = √(p² + m_i²) ≈ E + m_i²/(2E), distinct mass components accumulate relative phase Δφ = (Δm² / 2E) L over baseline L:',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-neutrino-osc',
            number: '4.1',
            label: 'Two-Flavour Neutrino Appearance Probability (Practical Units)',
            tex: 'P(\\nu_\\alpha \\to \\nu_\\beta) = \\sin^2(2\\theta)\\,\\sin^2\\!\\left(\\frac{\\Delta m^2 L}{4\\hbar c E}\\right) = \\sin^2(2\\theta)\\,\\sin^2\\!\\left(1.267\\,\\frac{\\Delta m^2\\,[\\mathrm{eV}^2]\\;L\\,[\\mathrm{km}]}{E\\,[\\mathrm{GeV}]}\\right)',
            symbols: [
              { symbol: '\\theta', meaning: 'Vacuum mixing angle between flavour and mass bases', units: 'rad' },
              { symbol: '\\Delta m^2', meaning: 'Mass-squared splitting m₂² − m₁²', units: 'eV²' },
              { symbol: 'L / E', meaning: 'Propagation baseline over neutrino energy', units: 'km·GeV⁻¹' },
            ],
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Atmospheric & Accelerator Neutrino Beats',
        heading: 'Interactive L/E Oscillation Spectrum',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Explore how maximal atmospheric mixing (θ₂₃ ≈ 45°, Δm² ≈ 2.5 × 10⁻³ eV²) produces full flavour conversion at L/E ≈ 496 km/GeV:',
            ],
          },
          {
            kind: 'sim',
            simId: 'standard-model-lab',
            presetParams: { mode: 1, thetaDeg: 45, dm2: 2.5 },
            caption: 'Two-flavour PMNS oscillation probability P(ν_μ → ν_τ) versus baseline-over-energy L/E.',
            notice: 'Vary θ away from 45° to see sin²(2θ) cap peak oscillation amplitude, while Δm² compresses the oscillation wavelength.',
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Anomaly Cancellation Miracle',
        heading: 'Why Quarks and Leptons Must Come in Complete Generations',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Chiral triangle loops can spoil local gauge invariance unless Tr[T^a {T^b, T^c}]_L − R = 0. Within EVERY single Standard Model generation, the hypercharge sum ∑ Y = 3_colours × [2(1/6) − 2/3 − (−1/3)]_quarks + [2(−1/2) − (−1)]_leptons = 0 cancels ONLY because quarks come in exactly N_c = 3 colours with fractional charges +2/3 and −1/3!',
            ],
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Open Problems at the Frontier',
        heading: 'Six Cracks in the Monument',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Despite flawless collider agreement, the minimal Standard Model leaves unsolved: (1) Dirac vs Majorana seesaw origin of neutrino masses, (2) Cold Dark Matter (Ω_c ≈ 0.26), (3) Matter–antimatter baryon asymmetry η_B ≈ 6 × 10⁻¹⁰ (requiring Sakharov CP violation beyond CKM), (4) Strong CP problem θ_QCD < 10⁻¹⁰ (axions?), (5) Electroweak hierarchy m_H ≪ M_Planck, and (6) Quantum gravity.',
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
            id: 'ex-sm-weinberg-rho',
            title: 'Exercise 1 · Electroweak Unified Coupling e = g sin θ_W & Tree-Level ρ Parameter',
            difficulty: 3,
            prompt:
              'Given M_W = 80.37 GeV and M_Z = 91.19 GeV, compute sin²θ_W = 1 − M_W²/M_Z² at tree level, and verify that any number of Higgs SU(2)_L doublets preserves ρ ≡ M_W² / (M_Z² cos²θ_W) = 1.',
            hints: [
              'Compute (80.37 / 91.19)² ≈ 0.7768.',
              'From M_W = ½gv and M_Z = ½√(g² + g′²)v with cos θ_W = g / √(g² + g′²), substitute directly into ρ.',
            ],
            solution:
              'Tree-level sin²θ_W = 1 − (80.37/91.19)² ≈ 0.223 (close to MS-bar 0.2312 after radiative top/Higgs loops). Custodial SU(2) symmetry of doublet VEVs enforces M_W / M_Z = g / √(g² + g′²) = cos θ_W identically, so ρ = 1.',
            solutionTex: '\\sin^2\\theta_W = 1 - \\frac{M_W^2}{M_Z^2} \\approx 0.223, \\qquad \\rho \\equiv \\frac{M_W^2}{M_Z^2\\cos^2\\theta_W} = 1',
          },
          {
            kind: 'exercise',
            id: 'ex-sm-atmospheric-nu',
            title: 'Exercise 2 · Atmospheric Neutrino First Oscillation Minimum',
            difficulty: 3,
            prompt:
              'For atmospheric splitting |Δm²_32| = 2.50 × 10⁻³ eV² and maximal mixing θ₂₃ = 45°, at what baseline L (km) does a 1.0 GeV muon neutrino first reach 100% disappearance P(ν_μ → ν_τ) = 1?',
            hints: [
              'Set 1.267 Δm² L / E = π/2 in Eq. (4.1).',
            ],
            solution:
              'Solving 1.267 × (2.50 × 10⁻³) × L / 1.0 = π/2 = 1.5708 gives L ≈ 496 km—right between overhead atmospheric production (~15 km, unoscillated) and upward Earth-crossing neutrinos (~12,700 km, strongly oscillated), as discovered by Super-Kamiokande in 1998!',
            solutionTex: 'L_{\\mathrm{max}} = \\frac{\\pi / 2}{1.267\\,\\Delta m^2 / E} = \\frac{1.5708}{1.267 \\times 2.50\\times 10^{-3}} \\approx 496\\;\\mathrm{km}',
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
              'Every road at the frontier loops back through the six wings of Physica: dark energy & inflation meet general relativity, symmetry breaking meets statistical renormalization, and gauge anomalies meet topological condensed matter.',
            ],
          },
          {
            kind: 'references-list',
            leadsToBookIds: [
              'quantum-field-theory-fields-to-particles',
              'the-expanding-universe',
              'topology-in-condensed-matter',
              'spacetime-special-to-general-relativity',
            ],
          },
        ],
      },
    ],
  },
];
