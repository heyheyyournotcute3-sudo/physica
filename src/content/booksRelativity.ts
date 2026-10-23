import type { BookMeta } from '@/lib/schema';

export const BOOKS_RELATIVITY: BookMeta[] = [
  {
    id: 'spacetime-special-to-general-relativity',
    title: 'Spacetime: From Special to General Relativity',
    subtitle: 'Minkowski Geometry, Equivalence, Curvature, and Schwarzschild Black Holes',
    wing: 'relativity',
    status: 'published',
    difficulty: 4,
    readingMinutes: 42,
    prerequisites: ['lagrangian-mechanics', 'maxwells-equations-in-motion'],
    shelf: { side: 'left', bay: 1, level: 2, slot: 3, mezzanine: false },
    cover: { colour: '#2B2D42', material: 'leather', emblem: 'light-cone' },
    conventions: {
      units: 'geometrized',
      metricSignature: '-+++',
      notes: 'Greek indices μ, ν ∈ {0, 1, 2, 3}; geometrized units G = c = 1 (with factors of G and c restored in key physical benchmarks).',
    },
    summary:
      'Develops Einstein’s geometric vision from Lorentz-invariant Minkowski intervals and the equivalence principle to Riemannian curvature, Einstein’s field equations, perihelion precession, ISCO orbits, and photon-sphere black-hole lensing.',
    plannedChapters: [
      '1. Minkowski Spacetime, Lorentz Boosts & Proper Time',
      '2. Equivalence Principle, Metric & Geodesic Equation',
      '3. Curvature Tensors & Einstein’s Field Equations',
      '4. Schwarzschild Geometry: Precession, ISCO & Photon Sphere',
    ],
    references: [
      {
        authors: 'S. M. Carroll',
        title: 'Spacetime and Geometry: An Introduction to General Relativity',
        year: 2019,
        chapters: 'Ch. 1, 3–5',
      },
      {
        authors: 'J. B. Hartle',
        title: 'Gravity: An Introduction to Einstein’s General Relativity',
        year: 2003,
        chapters: 'Ch. 4–9, 21',
      },
      {
        authors: 'C. W. Misner, K. S. Thorne, J. A. Wheeler',
        title: 'Gravitation',
        year: 1973,
        chapters: 'Ch. 13, 25',
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: 'Spacetime: From Special to General Relativity',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Space by itself, and time by itself, fade into mere shadows; only a kind of union of the two preserves an independent reality. Hermann Minkowski’s 1908 insight paved the road for Albert Einstein’s 1915 realization that gravity is not a force acting THROUGH spacetime—it IS the dynamical curvature OF spacetime.',
            ],
            glossaryTerms: ['proper-time', 'geodesic', 'isco'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Declared Conventions',
            body: 'Mostly-plus signature (−, +, +, +); Einstein summation over repeated upper/lower Greek indices; Schwarzschild gravitational radius r_g = GM/c², event horizon r_s = 2GM/c².',
            tex: 'ds^2 = g_{\\mu\\nu}\\,dx^\\mu dx^\\nu, \\qquad \\eta_{\\mu\\nu} = \\mathrm{diag}(-1,+1,+1,+1)',
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
                title: 'Minkowski Geometry',
                coreIdea: 'Lorentz boosts tilt space and time axes symmetrically around an invariant 45° light cone.',
              },
              {
                chapter: 2,
                title: 'Equivalence & Geodesics',
                coreIdea: 'Free-falling particles maximize proper time τ = ∫ √(−ds²)/c along curved-spacetime geodesics.',
              },
              {
                chapter: 3,
                title: 'Curvature & Einstein Tensor',
                coreIdea: 'Tidal geodesic deviation measures Riemann curvature; Bianchi identity selects G_μν = 8πG T_μν / c⁴.',
              },
              {
                chapter: 4,
                title: 'Schwarzschild Orbits & Shadow',
                coreIdea: 'A −2M L²/r³ relativistic pit creates perihelion shift, an ISCO at 6M, and a photon sphere at 3M.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · Minkowski Spacetime & Boosts',
        heading: 'Hyperbolic Rotation & Invariant Light Cones',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Whereas Euclidean rotations preserve x² + y², Lorentz boosts by velocity β = v/c = tanh φ preserve the spacetime interval ds² = −c²dt² + dx² + dy² + dz². Scrub the boost diagram to watch simultaneity planes tilt symmetrically toward the fixed 45° light cone:',
            ],
            glossaryTerms: ['proper-time'],
          },
          {
            kind: 'motion',
            motionId: 'minkowski-light-cone',
            caption: 'Lorentz boost tilting ct′ and x′ axes symmetrically while keeping the null cone ds² = 0 and invariant hyperbolae fixed.',
          },
          {
            kind: 'eq',
            id: 'eq-lorentz-proper-time',
            number: '1.1',
            label: 'Invariant Interval & Proper Time',
            tex: 'ds^2 = -c^2 dt^2 + d\\mathbf{x}^2 = -c^2 d\\tau^2, \\qquad \\begin{pmatrix} ct\' \\\\ x\' \\end{pmatrix} = \\gamma\\begin{pmatrix} 1 & -\\beta \\\\ -\\beta & 1 \\end{pmatrix}\\begin{pmatrix} ct \\\\ x \\end{pmatrix}',
            symbols: [
              { symbol: 'd\\tau', meaning: 'Infinitesimal proper time along timelike worldline', units: 's' },
              { symbol: '\\beta', meaning: 'Dimensionless boost velocity v/c ∈ (−1, 1)', units: '1' },
              { symbol: '\\gamma', meaning: 'Lorentz factor (1 − β²)⁻¹/²', units: '1' },
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Equivalence Principle & Geodesics',
        heading: 'Free Fall as Extremal Proper Time',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Because inertial mass equals gravitational passive mass to 1 part in 10¹⁵ (MICROSCOPE satellite), a sufficiently small freely falling cabin is locally indistinguishable from Minkowski space. Free test particles follow geodesics—stationarity curves δ∫ dτ = 0 of the metric g_μν(x):',
            ],
            glossaryTerms: ['geodesic'],
          },
          {
            kind: 'eq',
            id: 'eq-geodesic-christoffel',
            number: '2.1',
            label: 'Geodesic Equation & Levi-Civita Christoffel Symbols',
            tex: '\\frac{d^2 x^\\mu}{d\\tau^2} + \\Gamma^\\mu_{\\alpha\\beta}\\frac{dx^\\alpha}{d\\tau}\\frac{dx^\\beta}{d\\tau} = 0, \\qquad \\Gamma^\\mu_{\\alpha\\beta} = \\tfrac{1}{2}g^{\\mu\\sigma}\\left(\\partial_\\alpha g_{\\beta\\sigma} + \\partial_\\beta g_{\\alpha\\sigma} - \\partial_\\sigma g_{\\alpha\\beta}\\right)',
            symbols: [
              { symbol: '\\Gamma^\\mu_{\\alpha\\beta}', meaning: 'Christoffel connection coefficients (vanish in local inertial coordinates)', units: 'm⁻¹' },
              { symbol: 'g_{\\mu\\nu}', meaning: 'Spacetime metric tensor', units: '1' },
            ],
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Curvature & Einstein’s Equations',
        heading: 'Matter Tells Spacetime How to Curve',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'You can always transform g_μν to η_μν and Γ^μ_αβ to zero at a SINGLE point P, but not in a finite neighbourhood if tidal accelerations separate nearby geodesics! Commuting covariant derivatives [∇_μ, ∇_ν]V^ρ = R^ρ_{σμν} V^σ defines the Riemann curvature tensor, whose divergence-free trace combination equals the stress-energy tensor T_μν:',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-einstein-field',
            number: '3.1',
            label: 'Einstein Field Equations',
            tex: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} \\equiv R_{\\mu\\nu} - \\tfrac{1}{2}R\\,g_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}\\,T_{\\mu\\nu}',
            symbols: [
              { symbol: 'G_{\\mu\\nu}', meaning: 'Einstein curvature tensor (∇^μ G_μν = 0 identically by Bianchi identity)', units: 'm⁻²' },
              { symbol: 'R_{\\mu\\nu}, R', meaning: 'Ricci tensor and Ricci scalar curvature', units: 'm⁻²' },
              { symbol: 'T_{\\mu\\nu}', meaning: 'Energy-momentum-stress tensor of matter and radiation', units: 'J·m⁻³' },
              { symbol: '\\Lambda', meaning: 'Cosmological constant', units: 'm⁻²' },
            ],
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · The Schwarzschild Solution',
        heading: 'Exact Relativistic Effective Potential',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'derivation',
            title: 'Schwarzschild Effective Potential & Relativistic −M L²/r³ Term',
            steps: [
              {
                tex: 'ds^2 = -\\left(1 - \\frac{2M}{r}\\right)dt^2 + \\left(1 - \\frac{2M}{r}\\right)^{-1}dr^2 + r^2(d\\theta^2 + \\sin^2\\theta\\,d\\phi^2)',
                why: 'Birkhoff’s theorem: unique spherically symmetric vacuum solution (G = c = 1).',
              },
              {
                tex: 'e \\equiv \\left(1 - \\frac{2M}{r}\\right)\\frac{dt}{d\\tau}, \\qquad \\ell \\equiv r^2\\frac{d\\phi}{d\\tau}',
                why: 'Killing symmetries ∂_t and ∂_φ conserve specific energy e and angular momentum ℓ in equatorial plane θ = π/2.',
              },
              {
                tex: '\\tfrac{1}{2}\\left(\\frac{dr}{d\\tau}\\right)^2 + V_{\\mathrm{eff}}(r) = \\tfrac{1}{2}(e^2 - 1), \\qquad V_{\\mathrm{eff}}(r) = -\\frac{M}{r} + \\frac{\\ell^2}{2r^2} - \\frac{M\\ell^2}{r^3}',
                why: 'Substitute e and ℓ into g_μν u^μ u^ν = −1; note the purely relativistic attractive −Mℓ²/r³ cubic pit!',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · The Schwarzschild Solution',
        heading: 'Interactive Laboratory: Schwarzschild Orbits, ISCO & Photon Capture',
        blocks: [
          {
            kind: 'sim',
            simId: 'schwarzschild-orbits',
            caption: 'Exact relativistic geodesic orbit integrator in Schwarzschild spacetime alongside V_eff(r).',
            notice:
              'Explore presets for Precessing Rosette, Marginal ISCO (r = 6M, ℓ = √12 M), and Plunging Capture! Unlike Newtonian gravity where centrifugal barrier +ℓ²/2r² always wins at small r, here −Mℓ²/r³ pulls particles over the barrier when ℓ < 2√3 M.',
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Black Hole Shadow & Photon Sphere',
        heading: 'Null Geodesics and Event Horizon Telescope Imagery',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'For massless photons (ds² = 0), only the impact parameter b = ℓ/e matters: (dr/dλ)² / e² = b⁻² − W(r) with photon potential W(r) = (1 − 2M/r)/r². W(r) peaks sharply at the unstable photon sphere r_ph = 3GM/c², where W_max = 1/(27 M²):',
            ],
            glossaryTerms: ['isco'],
          },
          {
            kind: 'eq',
            id: 'eq-bh-shadow',
            number: '4.1',
            label: 'Photon Sphere, Critical Shadow Radius & Perihelion Advance',
            tex: 'r_{\\mathrm{ph}} = \\frac{3GM}{c^2}, \\qquad b_{\\mathrm{crit}} = \\sqrt{27}\\,\\frac{GM}{c^2} \\approx 5.196\\,\\frac{GM}{c^2}, \\qquad \\Delta\\phi = \\frac{6\\pi GM}{c^2 a(1-e^2)}',
            symbols: [
              { symbol: 'r_{\\mathrm{ph}}', meaning: 'Unstable circular null orbit (photon sphere) radius', units: 'm' },
              { symbol: 'b_{\\mathrm{crit}}', meaning: 'Apparent black hole shadow radius seen by a distant observer', units: 'm' },
              { symbol: '\\Delta\\phi', meaning: 'Perihelion precession angle per bound timelike revolution', units: 'rad' },
            ],
          },
          {
            kind: 'callout',
            variant: 'history',
            title: 'From Mercury (1915) to M87* and Sgr A* (2019–2022)',
            body: 'Substituting M_⊙, a = 5.79 × 10¹⁰ m, e = 0.2056 gives Mercury’s anomalous 42.98 arcseconds per century. A century later, the Event Horizon Telescope resolved the bright lensed ring around b_crit = √27 GM/c² in M87* and Sgr A*.',
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Crossing the ISCO & Event Horizon',
        heading: 'Plunging Geodesics Below ℓ = √12 M',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Below the critical angular momentum ℓ_ISCO = 2√3 M ≈ 3.464 M, the centrifugal barrier vanishes completely and test particles spiral across r = 2M in finite proper time:',
            ],
          },
          {
            kind: 'sim',
            simId: 'schwarzschild-orbits',
            presetParams: { ell: 3.3, r0: 7.5, vr0: -0.04 },
            caption: 'Sub-ISCO plunging trajectory spiralling directly into the r = 2M Schwarzschild horizon.',
            notice: 'Raise ℓ from 3.30 M above 3.55 M and click Reset to rescue the particle from plunging!',
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Gravitational Redshift & GPS',
        heading: 'Clocks Run Slower Deeper in Potential Wells',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Comparing stationary clocks at r_emit and r_obs along constant-coordinate-time light signals Δt_emit = Δt_obs gives dτ_obs / dτ_emit = √((1 − 2M/r_obs)/(1 − 2M/r_emit)). On GPS satellites at r ≈ 26,560 km, gravitational blueshift (+45.7 μs/day) outweighs special-relativistic orbital time dilation (−7.2 μs/day), requiring a +38.5 μs/day relativistic clock offset to prevent 11 km/day navigation drift!',
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
            id: 'ex-gr-isco-derivation',
            title: 'Exercise 1 · Proving r_ISCO = 6GM/c² and Binding Energy Efficiency',
            difficulty: 4,
            prompt:
              'Find the circular orbit conditions V′_eff(r) = 0 and V″_eff(r) = 0 for V_eff(r) = −M/r + ℓ²/(2r²) − Mℓ²/r³ (G = c = 1), locate r_ISCO, and compute the specific energy e_ISCO.',
            hints: [
              'Set dV_eff/dr = M/r² − ℓ²/r³ + 3Mℓ²/r⁴ = 0, giving ℓ² = M r² / (r − 3M) (so circular timelike orbits exist only for r > 3M!).',
              'Differentiate ℓ²(r) with respect to r: marginal stability V″_eff = 0 coincides with the minimum of ℓ²(r).',
            ],
            solution:
              'Setting d/dr [r²/(r − 3M)] = r(r − 6M)/(r − 3M)² = 0 gives r_ISCO = 6M and ℓ²_ISCO = 12M². Then e² = (1 − 2M/6M)(1 + 12M²/36M²) = (2/3)(4/3) = 8/9, so e_ISCO = √(8/9) ≈ 0.9428—releasing 1 − √(8/9) ≈ 5.72% of rest mass energy in a thin accretion disk!',
            solutionTex: 'r_{\\mathrm{ISCO}} = 6M, \\qquad \\ell_{\\mathrm{ISCO}} = 2\\sqrt{3}\\,M, \\qquad 1 - e_{\\mathrm{ISCO}} = 1 - \\frac{2\\sqrt{2}}{3} \\approx 5.72\\%',
          },
          {
            kind: 'exercise',
            id: 'ex-gr-photon-sphere',
            title: 'Exercise 2 · Photon Sphere & Critical Impact Parameter',
            difficulty: 3,
            prompt:
              'Maximise W(r) = (1 − 2M/r)/r² to obtain r_ph and compute b_crit = W_max⁻¹/².',
            hints: [
              'Compute dW/dr = −2/r³ + 6M/r⁴ = 0.',
            ],
            solution:
              'dW/dr = 0 gives r_ph = 3M. Evaluating W(3M) = (1 − 2/3)/(9M²) = 1/(27M²), hence b_crit = √27 M = 3√3 M.',
            solutionTex: 'W(3M) = \\frac{1}{27 M^2} \\implies b_{\\mathrm{crit}} = 3\\sqrt{3}\\,M',
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
              'Applying Einstein’s field equations not to an isolated star or black hole, but to the homogeneous and isotropic universe as a whole, yields the dynamic Friedmann–Lemaître–Robertson–Walker cosmos.',
            ],
          },
          {
            kind: 'references-list',
            leadsToBookIds: [
              'the-expanding-universe',
              'lagrangian-mechanics',
              'maxwells-equations-in-motion',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'the-expanding-universe',
    title: 'The Expanding Universe',
    subtitle: 'FLRW Geometry, Friedmann Dynamics, Cosmic Horizons, and Inflation',
    wing: 'relativity',
    status: 'published',
    difficulty: 4,
    readingMinutes: 38,
    prerequisites: ['spacetime-special-to-general-relativity', 'entropy-and-the-arrow-of-time'],
    shelf: { side: 'right', bay: 2, level: 2, slot: 4, mezzanine: false },
    cover: { colour: '#312E59', material: 'cloth', emblem: 'cosmos' },
    conventions: {
      units: 'SI',
      metricSignature: '-+++',
      notes: 'Present-day scale factor normalised to a(t₀) = 1; redshift 1 + z = 1/a(t_e); critical density ρ_c,0 = 3H₀²/(8πG).',
    },
    summary:
      'Traces modern physical cosmology from the FLRW metric and Friedmann fluid equations through radiation-, matter-, and dark-energy-dominated epochs, cosmological redshift, conformal light-cone horizons, the 2.725 K CMB, and primordial inflation.',
    plannedChapters: [
      '1. The Cosmological Principle & FLRW Metric',
      '2. Friedmann Equations & Cosmic Fluid Epochs',
      '3. Distances, Conformal Time & Causal Horizons',
      '4. The Cosmic Microwave Background & Inflation',
    ],
    references: [
      {
        authors: 'B. Ryden',
        title: 'Introduction to Cosmology',
        year: 2016,
        edition: '2nd ed.',
        chapters: 'Ch. 3–6, 8, 11',
      },
      {
        authors: 'S. Dodelson, F. Schmidt',
        title: 'Modern Cosmology',
        year: 2020,
        edition: '2nd ed.',
        chapters: 'Ch. 1–3, 7',
      },
      {
        authors: 'S. Weinberg',
        title: 'Cosmology',
        year: 2008,
        chapters: 'Ch. 1–2, 4',
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: 'The Expanding Universe',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Averaged over scales larger than ~100 Mpc, the universe exhibits astonishing spatial homogeneity and isotropy—confirmed to 1 part in 10⁵ by the Cosmic Microwave Background. Plugging maximally symmetric spatial slices into Einstein’s equations leaves a single dynamical function of cosmic time: the scale factor a(t).',
            ],
            glossaryTerms: ['comoving-distance', 'particle-horizon'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Declared Conventions',
            body: 'a(t₀) ≡ 1 today; Hubble parameter H(t) ≡ ȧ/a; density parameters Ω_i ≡ ρ_{i,0} / ρ_{c,0} with curvature parameter Ω_k = 1 − Ω_r − Ω_m − Ω_Λ.',
            tex: '1 + z = \\frac{\\lambda_{\\mathrm{obs}}}{\\lambda_{\\mathrm{emit}}} = \\frac{1}{a(t_{\\mathrm{emit}})}, \\qquad \\rho_{c,0} = \\frac{3 H_0^2}{8\\pi G}',
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
                title: 'FLRW Metric & Redshift',
                coreIdea: 'Galaxies sit at fixed comoving χ while metric stretching expands proper distances d_p = a(t)χ.',
              },
              {
                chapter: 2,
                title: 'Friedmann & Fluid Equations',
                coreIdea: 'Equation of state P = wε sets dilution ε ∝ a^{−3(1+w)} for radiation (a⁻⁴), matter (a⁻³), and Λ (a⁰).',
              },
              {
                chapter: 3,
                title: 'Conformal Light Cones',
                coreIdea: 'Conformal time dη = dt/a flattens radial null rays to ±45°, exposing the CMB horizon puzzle.',
              },
              {
                chapter: 4,
                title: 'CMB & Inflation',
                coreIdea: 'Accelerated early expansion ä > 0 pushes η_init → −∞, making the entire observable sky causally connected.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · FLRW Geometry & Comoving Coordinates',
        heading: 'Comoving vs Proper Distance on an Expanding Grid',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Spatial slices of constant curvature k ∈ {−1, 0, +1} combine with cosmic proper time t into the Robertson–Walker line element. Watch how comoving coordinates remain fixed while proper separations and photon wavelengths stretch with a(t):',
            ],
            glossaryTerms: ['comoving-distance'],
          },
          {
            kind: 'motion',
            motionId: 'comoving-expanding-grid',
            caption: 'Comoving grid coordinates versus proper physical separation d_p(t) = a(t)χ and conformal horizon cones.',
          },
          {
            kind: 'eq',
            id: 'eq-flrw-metric',
            number: '1.1',
            label: 'Friedmann–Lemaître–Robertson–Walker Metric',
            tex: 'ds^2 = -c^2 dt^2 + a(t)^2\\left[d\\chi^2 + S_k(\\chi)^2\\,(d\\theta^2 + \\sin^2\\theta\\,d\\phi^2)\\right]',
            symbols: [
              { symbol: 'a(t)', meaning: 'Dimensionless cosmic scale factor (a(t₀) = 1)', units: '1' },
              { symbol: '\\chi', meaning: 'Comoving radial coordinate', units: 'm (or Mpc)' },
              { symbol: 'S_k(\\chi)', meaning: 'R sin(χ/R) (closed), χ (flat), or R sinh(χ/R) (open)', units: 'm' },
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · The Friedmann Equations',
        heading: 'Expansion Rate, Acceleration & Cosmic Fluids',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Inserting the FLRW metric and a perfect-fluid stress-energy tensor T^μ_ν = diag(−ε, P, P, P) into Einstein’s field equations yields the two Friedmann equations plus covariant fluid energy conservation ∇_μ T^{μ0} = 0:',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-friedmann-pair',
            number: '2.1',
            label: 'First & Second Friedmann Equations',
            tex: 'H^2 \\equiv \\left(\\frac{\\dot{a}}{a}\\right)^2 = H_0^2\\left(\\Omega_r a^{-4} + \\Omega_m a^{-3} + \\Omega_k a^{-2} + \\Omega_\\Lambda\\right), \\qquad \\frac{\\ddot{a}}{a} = -\\frac{4\\pi G}{3c^2}(\\varepsilon + 3P)',
            symbols: [
              { symbol: 'H(t)', meaning: 'Hubble expansion rate ȧ/a', units: 's⁻¹ (or km·s⁻¹·Mpc⁻¹)' },
              { symbol: '\\Omega_r, \\Omega_m, \\Omega_\\Lambda', meaning: 'Present-day radiation, matter, and dark-energy fractions', units: '1' },
              { symbol: '\\varepsilon, P', meaning: 'Energy density ρc² and isotropic pressure (P = wε)', units: 'J·m⁻³' },
            ],
          },
          {
            kind: 'callout',
            variant: 'intuition',
            title: 'Why Photons Dilute as a⁻⁴ and Dark Energy Accelerates Expansion',
            body: 'Number density of photons dilutes with volume as a⁻³, AND each photon’s wavelength stretches as λ ∝ a (energy hc/λ ∝ a⁻¹), giving ε_r ∝ a⁻⁴! Meanwhile vacuum energy has P = −ε (w = −1), making ε + 3P = −2ε < 0 so ä/a > 0!',
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · The Friedmann Equations',
        heading: 'Interactive Laboratory: Designing Model Universes',
        blocks: [
          {
            kind: 'sim',
            simId: 'friedmann-cosmos',
            caption: 'Live FLRW Friedmann trajectory solver for arbitrary (Ω_m, Ω_r, Ω_Λ) with Concordance ΛCDM comparison.',
            notice:
              'Test three benchmarks: (1) Einstein–de Sitter (Ω_m = 1, Ω_Λ = 0) grows as a(t) ∝ t^{2/3}; (2) Concordance ΛCDM (Ω_m ≈ 0.31, Ω_Λ ≈ 0.69) decelerates early then inflects to exponential acceleration around z ≈ 0.65; (3) Closed Matter (Ω_m = 2.4, Ω_Λ = 0) turns around and recollapses in a Big Crunch!',
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Distances & Causal Horizons',
        heading: 'Conformal Time Flattens the Cosmic Light Cone',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Defining conformal time dη = c dt / a(t) factors a(η)² out of the radial metric: ds² = a(η)²(−dη² + dχ²). Radial light rays obey dχ = ±dη—straight 45° lines just as in special relativity! If the Big Bang sits at a finite conformal origin η_init = 0, any observer at η has a finite comoving particle horizon:',
            ],
            glossaryTerms: ['particle-horizon'],
          },
          {
            kind: 'eq',
            id: 'eq-horizons-lumdist',
            number: '3.1',
            label: 'Particle Horizon, Luminosity & Angular-Diameter Distances',
            tex: '\\chi_{\\mathrm{p}}(t) = c\\int_0^t \\frac{dt\'}{a(t\')}, \\qquad d_L(z) = (1+z)\\,S_k(\\chi(z)), \\qquad d_A(z) = \\frac{S_k(\\chi(z))}{1+z}',
            symbols: [
              { symbol: '\\chi_{\\mathrm{p}}', meaning: 'Comoving particle horizon radius', units: 'Mpc' },
              { symbol: 'd_L(z)', meaning: 'Luminosity distance (F = L / 4π d_L²)', units: 'Mpc' },
              { symbol: 'd_A(z)', meaning: 'Angular-diameter distance (can decrease at high z!)', units: 'Mpc' },
            ],
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · The CMB & The Horizon Problem',
        heading: '40,000 Causally Disconnected Patches at Recombination',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'At z_* ≈ 1090 (t_* ≈ 380,000 yr, T_* ≈ 3000 K), electrons and protons recombined into neutral hydrogen, decoupling cosmic microwave background photons that reach us today cooled by 1 + z_* to T₀ = 2.7255 K.',
              'Under standard radiation + matter deceleration (ä < 0), the particle horizon at recombination subtends only ~1.7° on today’s sky—yet patches 180° apart have identical black-body temperatures to ΔT/T ~ 10⁻⁵! Why were causally disconnected regions in thermal equilibrium?',
            ],
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Cosmic Inflation',
        heading: 'Shrinking the Comoving Hubble Sphere',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Alan Guth, Andrei Linde, Alexei Starobinsky, Albrecht & Steinhardt realized that an early epoch of accelerated expansion ä > 0 (equivalently shrinking comoving Hubble radius d/dt (aH)⁻¹ < 0, driven by a slow-rolling scalar inflaton φ with V(φ) ≫ ½φ̇²) pushes conformal origin η_init → −∞:',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-inflation-efolds',
            number: '4.1',
            label: 'Comoving Hubble Radius & Flatness Evolution',
            tex: '\\frac{d}{dt}\\!\\left(\\frac{1}{aH}\\right) = -\\frac{\\ddot{a}}{\\dot{a}^2} < 0, \\qquad |\\Omega(t) - 1| = \\frac{|k|c^2}{a^2 H^2} = \\frac{|k|c^2}{\\dot{a}^2}',
            symbols: [
              { symbol: '(aH)^{-1}', meaning: 'Comoving Hubble horizon scale', units: 'Mpc' },
              { symbol: '|\\Omega(t)-1|', meaning: 'Departure from spatial flatness (driven exponentially to 0 during inflation)', units: '1' },
            ],
          },
          {
            kind: 'callout',
            variant: 'intuition',
            title: 'Quantum Zero-Point Fluctuations Stretched to Galaxy Clusters',
            body: 'Even better than solving the horizon and flatness puzzles, inflation stretches sub-atomic vacuum zero-point fluctuations δφ_k across the Hubble horizon, seeding the nearly scale-invariant (n_s ≈ 0.965) acoustic peaks measured by Planck!',
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Thermal History Milestones',
        heading: 'From Big Bang Nucleosynthesis to Accelerated Expansion',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'At t ~ 1–180 s (T ~ 1–0.07 MeV), weak freeze-out and deuterium synthesis forged ~75% ¹H and ~25% ⁴He by mass plus trace D, ³He, and ⁷Li. At z_eq ≈ 3400 matter overtook radiation, allowing cold dark matter potential wells to grow logarithmically then linearly δ ∝ a.',
            ],
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Closed Recollapsing vs Runaway Universes',
        heading: 'Destiny Set by Spatial Curvature & Vacuum Energy',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Compare a closed overdense matter universe (Ω_m > 1, Ω_Λ = 0) reaching maximum expansion and recollapsing to a Big Crunch against flat Concordance ΛCDM:',
            ],
          },
          {
            kind: 'sim',
            simId: 'friedmann-cosmos',
            presetParams: { omegaM: 2.35, omegaL: 0.0, omegaR: 0.0 },
            caption: 'Closed k = +1 matter-only Friedmann universe turning around into a Big Crunch.',
            notice: 'Add just Ω_Λ = 0.35 of dark energy to overcome gravitational turnaround and trigger eternal expansion!',
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
            id: 'ex-cosmo-single-component',
            title: 'Exercise 1 · Exact Scale Factor a(t) for General Equation of State w',
            difficulty: 3,
            prompt:
              'Solve covariant fluid conservation ε̇ + 3(ȧ/a)(ε + P) = 0 for constant w = P/ε ≠ −1 in a spatially flat (k = 0) universe, then integrate H² ∝ ε to find a(t) and verify w = 0 (matter) and w = 1/3 (radiation).',
            hints: [
              'Separate variables dε/ε = −3(1 + w) da/a to get ε(a) = ε₀ a^{−3(1+w)}.',
              'Substitute into ȧ/a = H₀ a^{−3(1+w)/2} and integrate a^{3(1+w)/2 − 1} da = H₀ dt.',
            ],
            solution:
              'Integrating gives a(t) = (t / t₀)^{2/[3(1+w)]} with H₀ t₀ = 2/[3(1+w)]. For dust matter (w = 0), a(t) = (t/t₀)^{2/3} and t₀ = 2/(3H₀); for radiation (w = 1/3), a(t) = (t/t₀)^{1/2} and t₀ = 1/(2H₀). For w = −1 (Λ), ε = const gives exponential de Sitter expansion a(t) ∝ exp(H_Λ t).',
            solutionTex: '\\varepsilon \\propto a^{-3(1+w)} \\implies a(t) = \\left(\\frac{t}{t_0}\\right)^{\\frac{2}{3(1+w)}} \\quad (w \\neq -1)',
          },
          {
            kind: 'exercise',
            id: 'ex-cosmo-angular-turnover',
            title: 'Exercise 2 · Why Distant Galaxies Look Larger Beyond z ≈ 1.25',
            difficulty: 4,
            prompt:
              'In a flat Einstein–de Sitter universe (Ω_m = 1, Ω_Λ = 0), compute χ(z) = (2c/H₀)[1 − (1+z)⁻¹/²], form d_A(z) = χ(z)/(1+z), and find the redshift z_* where angular-diameter distance reaches its maximum!',
            hints: [
              'Differentiate f(u) = u⁻²(1 − u⁻¹) with u = √(1+z) with respect to u.',
            ],
            solution:
              'Setting df/du = −2u⁻³ + 3u⁻⁴ = 0 gives u = 3/2, hence 1 + z_* = 9/4 or z_* = 5/4 = 1.25! Light from z > 1.25 was emitted when the universe was much smaller, so a fixed physical ruler subtended a LARGER angle on the sky.',
            solutionTex: 'd_A(z) = \\frac{2c}{H_0}\\,\\frac{(1+z)^{1/2} - 1}{(1+z)^{3/2}} \\implies z_* = \\frac{5}{4} = 1.25',
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
              'Cosmology’s deepest open questions—the microscopic nature of dark matter, the 120-order-of-magnitude cosmological constant problem, and inflationary quantum fluctuations—unite general relativity directly with quantum field theory and the Standard Model.',
            ],
          },
          {
            kind: 'references-list',
            leadsToBookIds: [
              'spacetime-special-to-general-relativity',
              'the-standard-model-and-beyond',
              'quantum-field-theory-fields-to-particles',
            ],
          },
        ],
      },
    ],
  },
];
