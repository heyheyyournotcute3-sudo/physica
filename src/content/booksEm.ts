import type { BookMeta } from '@/lib/schema';

export const BOOKS_EM: BookMeta[] = [
  {
    id: 'maxwells-equations-in-motion',
    title: "Maxwell's Equations in Motion",
    subtitle: 'Potentials, Gauge Freedom, Relativistic Waves, and Radiative Energy Flux',
    wing: 'electromagnetism',
    status: 'published',
    difficulty: 4,
    readingMinutes: 38,
    prerequisites: ['lagrangian-mechanics'],
    shelf: { side: 'left', bay: 1, level: 2, slot: 2, mezzanine: false },
    cover: { colour: '#1D3557', material: 'cloth', emblem: 'field-wave' },
    conventions: {
      units: 'SI',
      metricSignature: '-+++',
      notes: 'Vacuum permittivity ε₀ and permeability μ₀ satisfy ε₀μ₀ = 1/c².',
    },
    summary:
      'Unfolds classical electrodynamics as a dynamical relativistic gauge field theory: from curl-coupled Faraday–Ampère induction and Yee-grid wave propagation to gauge transformations, retarded radiation, and Poynting momentum transport.',
    plannedChapters: [
      '1. The Four Equations & Local Conservation of Charge',
      '2. Scalar & Vector Potentials and Gauge Freedom',
      '3. Electromagnetic Waves & Yee-Grid FDTD Dynamics',
      '4. Poynting Theorem & Dipole Radiation',
    ],
    references: [
      {
        authors: 'J. D. Jackson',
        title: 'Classical Electrodynamics',
        year: 1999,
        edition: '3rd ed.',
        chapters: 'Ch. 6–7, 9, 11',
      },
      {
        authors: 'D. J. Griffiths',
        title: 'Introduction to Electrodynamics',
        year: 2017,
        edition: '4th ed.',
        chapters: 'Ch. 7–11',
      },
      {
        authors: 'A. Zangwill',
        title: 'Modern Electrodynamics',
        year: 2013,
        chapters: 'Ch. 14–16, 20',
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: "Maxwell's Equations in Motion",
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'When James Clerk Maxwell added the displacement current μ₀ε₀ ∂E/∂t to Ampère’s law in 1865, electric and magnetic fields ceased to be instantaneous action-at-a-distance bookkeeping devices. They became autonomous dynamical entities carrying energy, linear momentum, and angular momentum through empty space at speed c = (ε₀μ₀)⁻¹/².',
            ],
            glossaryTerms: ['gauge-invariance', 'poynting-vector'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Declared Conventions',
            body: 'SI units throughout. Four-potential A^μ = (φ/c, A) with metric η_μν = diag(−1, +1, +1, +1); field strength tensor F_μν = ∂_μ A_ν − ∂_ν A_μ.',
            tex: 'c = \\frac{1}{\\sqrt{\\varepsilon_0 \\mu_0}} = 299\\,792\\,458\\;\\mathrm{m\\cdot s^{-1}}',
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
                title: 'Coupled Curl Dynamics',
                coreIdea: 'Divergence equations constrain initial data; curl equations propagate E and B causally.',
              },
              {
                chapter: 2,
                title: 'Potentials & Gauge Freedom',
                coreIdea: 'B = ∇×A and E = −∇φ − ∂_t A solve the homogeneous pair identically up to gauge redundancy.',
              },
              {
                chapter: 3,
                title: 'Waves & FDTD Numerics',
                coreIdea: 'Staggered Yee lattices preserve ∇·B = 0 discretely while capturing refraction and interference.',
              },
              {
                chapter: 4,
                title: 'Poynting Flux & Radiation',
                coreIdea: 'Accelerating charges detach 1/r radiation fields carrying power S = (1/μ₀) E × B to infinity.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · Fields, Sources & Charge Conservation',
        heading: 'Constraints Plus Evolution',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Microscopic Maxwell equations split cleanly into two divergence constraint equations on spatial hypersurfaces and two first-order curl evolution equations advancing (E, B) forward in time:',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-maxwell-four',
            number: '1.1',
            label: 'Microscopic Maxwell Equations in SI Units',
            tex: '\\nabla\\cdot\\mathbf{E} = \\frac{\\rho}{\\varepsilon_0}, \\quad \\nabla\\cdot\\mathbf{B} = 0, \\quad \\nabla\\times\\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t}, \\quad \\nabla\\times\\mathbf{B} = \\mu_0\\mathbf{J} + \\mu_0\\varepsilon_0\\frac{\\partial \\mathbf{E}}{\\partial t}',
            symbols: [
              { symbol: '\\mathbf{E}', meaning: 'Electric field vector', units: 'V·m⁻¹' },
              { symbol: '\\mathbf{B}', meaning: 'Magnetic flux density (magnetic field)', units: 'T' },
              { symbol: '\\rho', meaning: 'Electric charge density', units: 'C·m⁻³' },
              { symbol: '\\mathbf{J}', meaning: 'Electric current density', units: 'A·m⁻²' },
            ],
          },
          {
            kind: 'callout',
            variant: 'intuition',
            title: 'Why Displacement Current Was Necessary',
            body: 'Taking the divergence of ∇ × B = μ₀ J gives 0 = μ₀ ∇·J, contradicting charge accumulation ∂_t ρ + ∇·J = 0 on a charging capacitor! Adding μ₀ε₀ ∂_t E restores exact continuity via Gauss’s law.',
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Potentials & Gauge Freedom',
        heading: 'Redundancy as a Guiding Principle',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Because ∇·B = 0 and ∇×(E + ∂_t B) = 0, Poincaré’s lemma guarantees potentials (φ, A) such that B = ∇×A and E = −∇φ − ∂_t A. Shifting A and φ simultaneously by any smooth scalar χ(r, t) leaves E and B strictly invariant:',
            ],
            glossaryTerms: ['gauge-invariance'],
          },
          {
            kind: 'motion',
            motionId: 'gauge-invariance-morph',
            caption: 'A gauge transformation morphing scalar φ and vector A while leaving physical E and B invariant.',
          },
          {
            kind: 'eq',
            id: 'eq-lorenz-gauge',
            number: '2.1',
            label: 'Lorenz Gauge Decoupled Wave Equations',
            tex: '\\nabla\\cdot\\mathbf{A} + \\frac{1}{c^2}\\frac{\\partial\\varphi}{\\partial t} = 0 \\implies \\Box\\varphi = -\\frac{\\rho}{\\varepsilon_0}, \\quad \\Box\\mathbf{A} = -\\mu_0\\mathbf{J}',
            symbols: [
              { symbol: '\\varphi', meaning: 'Scalar electric potential', units: 'V' },
              { symbol: '\\mathbf{A}', meaning: 'Magnetic vector potential', units: 'T·m' },
              { symbol: '\\Box', meaning: 'd’Alembertian wave operator ∇² − (1/c²)∂_t²', units: 'm⁻²' },
            ],
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Electromagnetic Waves',
        heading: 'Deriving the Transverse Wave Equation',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'derivation',
            title: 'Vacuum Wave Equation from Curl-of-Curl Identity',
            steps: [
              {
                tex: '\\nabla\\times(\\nabla\\times\\mathbf{E}) = -\\frac{\\partial}{\\partial t}(\\nabla\\times\\mathbf{B})',
                why: 'Take the spatial curl of Faraday’s law and commute ∂/∂t with ∇×.',
              },
              {
                tex: '\\nabla(\\nabla\\cdot\\mathbf{E}) - \\nabla^2\\mathbf{E} = -\\mu_0\\varepsilon_0\\frac{\\partial^2\\mathbf{E}}{\\partial t^2}',
                why: 'Apply vector identity ∇×(∇×E) = ∇(∇·E) − ∇²E and substitute vacuum Ampère–Maxwell law (J = 0).',
              },
              {
                tex: '\\left(\\nabla^2 - \\frac{1}{c^2}\\frac{\\partial^2}{\\partial t^2}\\right)\\mathbf{E} = \\mathbf{0}, \\qquad \\mathbf{k}\\cdot\\mathbf{E}_0 = 0,\\; \\mathbf{B}_0 = \\frac{\\hat{\\mathbf{k}}\\times\\mathbf{E}_0}{c}',
                why: 'Set ∇·E = 0 in charge-free space; monochromatic plane waves are strictly transverse with E, B, k mutually orthogonal.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Electromagnetic Waves',
        heading: 'Interactive Laboratory: 2D Yee-Grid FDTD Sandbox',
        blocks: [
          {
            kind: 'sim',
            simId: 'fdtd-maxwell',
            caption: 'Live 2D Finite-Difference Time-Domain (TMz) solver on a staggered Yee lattice with refractive slab.',
            notice:
              'Switch between Dipole and Plane-Wave sources and vary the dielectric permittivity ε_r. Inside the dielectric slab the phase speed slows to v = c/√ε_r, compressing the wavelength λ/n and producing partial Fresnel reflections at both interfaces.',
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Electromagnetic Waves',
        heading: 'Why Kane Yee’s Staggered Lattice Works',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'In 1966 Kane Yee placed E_z at integer grid nodes (i, j) and H_x, H_y on half-integer cell edges, staggering them by Δt/2 in time. Central finite differences then become second-order accurate in space and time while preserving discrete magnetic flux ∇_h · B = 0 to machine precision!',
              'In d spatial dimensions, von Neumann stability requires the Courant–Friedrichs–Lewy condition c Δt / Δx ≤ 1/√d (so ≤ 1/√2 ≈ 0.7071 in 2D).',
            ],
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Energy, Momentum & Radiation',
        heading: 'Poynting’s Local Conservation Theorem',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'How much mechanical work do fields perform on charges per unit volume? Since magnetic forces q v × B are perpendicular to v, power transfer per volume is J · E. Eliminating J via Ampère–Maxwell yields local electromagnetic energy conservation:',
            ],
            glossaryTerms: ['poynting-vector'],
          },
          {
            kind: 'eq',
            id: 'eq-poynting-theorem',
            number: '4.1',
            label: 'Poynting Energy Continuity Equation',
            tex: '\\frac{\\partial u_{\\mathrm{EM}}}{\\partial t} + \\nabla\\cdot\\mathbf{S} = -\\mathbf{J}\\cdot\\mathbf{E}, \\qquad u_{\\mathrm{EM}} = \\tfrac{1}{2}\\!\\left(\\varepsilon_0 E^2 + \\frac{B^2}{\\mu_0}\\right), \\quad \\mathbf{S} = \\frac{\\mathbf{E}\\times\\mathbf{B}}{\\mu_0}',
            symbols: [
              { symbol: 'u_{\\mathrm{EM}}', meaning: 'Electromagnetic field energy density', units: 'J·m⁻³' },
              { symbol: '\\mathbf{S}', meaning: 'Poynting energy flux vector', units: 'W·m⁻²' },
              { symbol: '-\\mathbf{J}\\cdot\\mathbf{E}', meaning: 'Rate of energy conversion from matter into fields', units: 'W·m⁻³' },
            ],
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Energy, Momentum & Radiation',
        heading: 'Retarded Potentials & Electric Dipole Radiation',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Static and uniformly moving charges carry bound Coulomb/Biot–Savart fields decaying as 1/r², so surface integrals ∮ S·dA over a sphere of radius r vanish as r → ∞. An accelerating charge generates a radiative field proportional to 1/r evaluated at retarded time t_r = t − r/c:',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-larmor-power',
            number: '4.2',
            label: 'Oscillating Dipole Flux & Larmor Formula',
            tex: '\\langle \\mathbf{S} \\rangle = \\frac{\\mu_0 p_0^2 \\omega^4}{32\\pi^2 c}\\,\\frac{\\sin^2\\theta}{r^2}\\,\\hat{\\mathbf{r}}, \\qquad P_{\\mathrm{Larmor}} = \\frac{\\mu_0 q^2 a^2}{6\\pi c}',
            symbols: [
              { symbol: 'p_0', meaning: 'Peak electric dipole moment amplitude', units: 'C·m' },
              { symbol: '\\theta', meaning: 'Polar angle measured from dipole oscillation axis', units: 'rad' },
              { symbol: 'P_{\\mathrm{Larmor}}', meaning: 'Total radiated power of non-relativistic charge q with acceleration a', units: 'W' },
            ],
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Relativistic Synthesis',
        heading: 'Covariant Tensor Form & Light-Cone Causality',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Packing E/c and B into the antisymmetric rank-2 field tensor F^{μν} reveals that Maxwell’s equations were Lorentz-invariant forty years before Einstein’s 1905 paper: ∂_μ F^{μν} = μ₀ J^ν and ∂_[λ F_{μν]} = 0.',
            ],
          },
          {
            kind: 'motion',
            motionId: 'minkowski-light-cone',
            caption: 'Invariance of the electromagnetic wave speed c across boosted inertial frames.',
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
            id: 'ex-em-coaxial-poynting',
            title: 'Exercise 1 · Poynting Vector in a Cylindrical Resistor',
            difficulty: 3,
            prompt:
              'A steady current I flows along a uniform cylindrical wire of radius a, length L, and resistance R. Compute E and B at the wire surface r = a, evaluate S = (1/μ₀) E × B, and integrate −∮ S·dA into the wire.',
            hints: [
              'By Ohm’s law, E = (IR/L) ẑ is uniform along the wire; by Ampère’s law at r = a, B = (μ₀I / 2πa) φ̂.',
              'Compute ẑ × φ̂ = −r̂: electromagnetic energy flows radially inward from the surrounding space into the wire!',
            ],
            solution:
              'At r = a, S = (1/μ₀)(IR/L)(μ₀I / 2πa)(−r̂) = −(I²R / 2πaL) r̂. Integrating inward flux over lateral area 2πaL yields P = (I²R / 2πaL)(2πaL) = I²R, matching Joule heating identically.',
            solutionTex: '\\mathbf{S}(a) = -\\frac{I^2 R}{2\\pi a L}\\,\\hat{\\mathbf{r}}, \\qquad -\\oint \\mathbf{S}\\cdot d\\mathbf{A} = I^2 R',
          },
          {
            kind: 'exercise',
            id: 'ex-em-cfl-dispersion',
            title: 'Exercise 2 · 2D Yee-Grid Numerical Dispersion Relation',
            difficulty: 4,
            prompt:
              'Substitute a discrete plane wave exp(i(k_x iΔx + k_y jΔx − ω nΔt)) into the 2D vacuum Yee FDTD equations with Δx = Δy and obtain the numerical dispersion relation.',
            hints: [
              'Centred differences turn ∂/∂t into (2/Δt) sin(ωΔt/2) and ∂/∂x into (2/Δx) sin(k_x Δx/2).',
            ],
            solution:
              'One obtains sin²(ωΔt/2) = S² [sin²(k_x Δx/2) + sin²(k_y Δx/2)] where S = cΔt/Δx. Real ω for worst-case Nyquist mode (k_x Δx = k_y Δx = π) requires 2S² ≤ 1, i.e. S ≤ 1/√2.',
            solutionTex: '\\sin^2\\!\\left(\\frac{\\omega\\Delta t}{2}\\right) = S^2\\!\\left[\\sin^2\\!\\left(\\frac{k_x\\Delta x}{2}\\right)+\\sin^2\\!\\left(\\frac{k_y\\Delta x}{2}\\right)\\right] \\le 1 \\iff S \\le \\frac{1}{\\sqrt{2}}',
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
              'Maxwell’s equations lead directly in three directions: scalar & vector diffraction optics in the frequency domain, Lorentz symmetry and curved spacetime geometry, and canonical/path-integral quantization of U(1) and non-Abelian Yang–Mills gauge fields.',
            ],
          },
          {
            kind: 'references-list',
            leadsToBookIds: [
              'waves-interference-fourier-optics',
              'spacetime-special-to-general-relativity',
              'quantum-field-theory-fields-to-particles',
              'the-standard-model-and-beyond',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'waves-interference-fourier-optics',
    title: 'Waves, Interference and Fourier Optics',
    subtitle: 'Coherence, Huygens–Fresnel Propagation, and Spatial Frequency Synthesis',
    wing: 'electromagnetism',
    status: 'published',
    difficulty: 3,
    readingMinutes: 34,
    prerequisites: ['maxwells-equations-in-motion'],
    shelf: { side: 'right', bay: 2, level: 2, slot: 5, mezzanine: false },
    cover: { colour: '#264653', material: 'cloth', emblem: 'diffraction' },
    conventions: {
      units: 'SI',
      fourier: 'F(k_x, k_y) = ∬ f(x, y) exp(−i(k_x x + k_y y)) dx dy',
      notes: 'Monochromatic phasor convention U(r, t) = Re[U(r) exp(−iωt)]; irradiance I = ⟨|E|²⟩ ∝ |U|².',
    },
    summary:
      'Reveals optical propagation and imaging as linear spatial-frequency filtering: secondary Huygens wavelets integrate to the Fresnel convolution and, in the far field or focal plane of a lens, compute an exact physical 2D Fourier transform.',
    plannedChapters: [
      '1. Superposition, Phasors & Coherence',
      '2. Huygens–Fresnel Principle & Fresnel Number',
      '3. Fraunhofer Diffraction as a 2D Fourier Transform',
      '4. Gratings, Thin-Film Fabry–Pérot Interference & Holography',
    ],
    references: [
      {
        authors: 'J. W. Goodman',
        title: 'Introduction to Fourier Optics',
        year: 2017,
        edition: '4th ed.',
        chapters: 'Ch. 3–5, 9',
      },
      {
        authors: 'E. Hecht',
        title: 'Optics',
        year: 2017,
        edition: '5th ed.',
        chapters: 'Ch. 9–13',
      },
      {
        authors: 'M. Born, E. Wolf',
        title: 'Principles of Optics',
        year: 1999,
        edition: '7th ed.',
        chapters: 'Ch. 7–8, 10',
      },
    ],
    pages: [
      {
        pageNumber: 1,
        chapterNumber: 0,
        chapterTitle: 'Frontmatter & Conventions',
        heading: 'Waves, Interference and Fourier Optics',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'A glass converging lens performs a two-dimensional continuous Fourier transform at the speed of light with zero clock cycles. Understanding why connects Huygens’ seventeenth-century wavelet intuition to modern lithography, coronagraphy, X-ray crystallography, and holography.',
            ],
            glossaryTerms: ['fraunhofer-diffraction', 'coherence'],
          },
          {
            kind: 'callout',
            variant: 'summary',
            title: 'Conventions',
            body: 'SI units; wavenumber k = 2π/λ; spatial frequencies k_x = k x_obs / z, k_y = k y_obs / z in the paraxial far field.',
            tex: 'U(\\mathbf{r},t) = \\operatorname{Re}\\!\\left[U(\\mathbf{r})e^{-i\\omega t}\\right], \\qquad k = \\frac{2\\pi}{\\lambda}',
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
                title: 'Superposition & Coherence',
                coreIdea: 'Intensities add incoherently; complex amplitudes add coherently with cross-term 2√(I₁I₂)|γ₁₂|cos Δφ.',
              },
              {
                chapter: 2,
                title: 'Huygens–Fresnel Integral',
                coreIdea: 'Every aperture point emits a spherical wavelet scaled by −i/λ and obliquity factor K(θ).',
              },
              {
                chapter: 3,
                title: 'Fraunhofer Fourier Transform',
                coreIdea: 'Far-field amplitude is the exact 2D Fourier transform of the complex aperture transmission.',
              },
              {
                chapter: 4,
                title: 'Gratings, Thin Films & Holograms',
                coreIdea: 'Periodic arrays sharpen peaks as sin²(Nβ)/sin²β; reference beams record optical phase.',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 3,
        chapterNumber: 1,
        chapterTitle: 'Chapter 1 · Superposition & Coherence',
        heading: 'When Do Two Beams Interfere?',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Optical detectors respond to time-averaged energy flux, never to instantaneous 500 THz electric oscillations. Superposing two quasimonochromatic fields U₁ + U₂ produces fringe visibility V governed by the complex degree of mutual coherence γ₁₂(τ):',
            ],
            glossaryTerms: ['coherence'],
          },
          {
            kind: 'eq',
            id: 'eq-interference-visibility',
            number: '1.1',
            label: 'Partially Coherent Two-Beam Interference Law',
            tex: 'I = I_1 + I_2 + 2\\sqrt{I_1 I_2}\\,|\\gamma_{12}(\\tau)|\\cos(\\Delta\\phi), \\qquad \\ell_c \\approx \\frac{c}{\\Delta\\nu} \\approx \\frac{\\lambda^2}{\\Delta\\lambda}',
            symbols: [
              { symbol: 'I_1, I_2', meaning: 'Individual beam irradiances', units: 'W·m⁻²' },
              { symbol: '|\\gamma_{12}(\\tau)|', meaning: 'Modulus of complex degree of coherence ∈ [0, 1]', units: '1' },
              { symbol: '\\ell_c', meaning: 'Longitudinal coherence length set by spectral width Δλ', units: 'm' },
            ],
          },
        ],
      },
      {
        pageNumber: 4,
        chapterNumber: 2,
        chapterTitle: 'Chapter 2 · Huygens–Fresnel Propagation',
        heading: 'Wavelets Building a Diffracted Wavefront',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'Gustav Kirchhoff and Arnold Sommerfeld placed Huygens’ heuristic on rigorous Helmholtz-equation footing via Green’s theorem: each unobstructed point (ξ, η) in an aperture plane z = 0 radiates a spherical wavelet with a π/2 phase advance (−i/λ):',
            ],
          },
          {
            kind: 'motion',
            motionId: 'huygens-wavelets',
            caption: 'Secondary spherical Huygens wavelets superposing constructively on the forward envelope and diffracting around aperture edges.',
          },
          {
            kind: 'eq',
            id: 'eq-rayleigh-sommerfeld',
            number: '2.1',
            label: 'Fresnel Paraxial Diffraction Integral',
            tex: 'U(x,y,z) = \\frac{e^{ikz}}{i\\lambda z}\\iint_{\\Sigma} U(\\xi,\\eta,0)\\,\\exp\\!\\left[\\frac{ik}{2z}\\big((x-\\xi)^2+(y-\\eta)^2\\big)\\right] d\\xi\\,d\\eta',
            symbols: [
              { symbol: 'z', meaning: 'Propagation distance from aperture plane to observation plane', units: 'm' },
              { symbol: '(\\xi,\\eta)', meaning: 'Transverse coordinates in aperture Σ', units: 'm' },
              { symbol: '\\lambda', meaning: 'Optical wavelength', units: 'm' },
            ],
          },
        ],
      },
      {
        pageNumber: 5,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Fraunhofer Diffraction as a Fourier Transform',
        heading: 'Crossing into the Far Field',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'derivation',
            title: 'From Fresnel Quadratic Phase to Exact 2D Fourier Transform',
            steps: [
              {
                tex: '\\frac{k}{2z}\\big((x-\\xi)^2+(y-\\eta)^2\\big) = \\frac{k(x^2+y^2)}{2z} - \\frac{k}{z}(x\\xi+y\\eta) + \\frac{k(\\xi^2+\\eta^2)}{2z}',
                why: 'Expand the paraxial path-length quadratic phase in aperture coordinates (ξ, η).',
              },
              {
                tex: 'F \\equiv \\frac{a^2}{\\lambda z} \\ll 1 \\implies \\frac{k(\\xi^2+\\eta^2)}{2z} \\le \\pi F \\ll 1',
                why: 'In the Fraunhofer far field (or at the back focal plane z = f of an ideal lens, which cancels the quadratic phase exactly), drop the ξ² + η² phase factor.',
              },
              {
                tex: 'I(k_x,k_y) \\propto \\left|\\iint_{-\\infty}^{\\infty} A(\\xi,\\eta)\\,e^{-i(k_x\\xi + k_y\\eta)}\\,d\\xi\\,d\\eta\\right|^2, \\qquad (k_x,k_y) = \\frac{2\\pi}{\\lambda z}(x,y)',
                why: 'Recognise the remaining integral as the 2D spatial Fourier transform of the aperture function A(ξ, η).',
              },
            ],
          },
        ],
      },
      {
        pageNumber: 6,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Fraunhofer Diffraction as a Fourier Transform',
        heading: 'Interactive Laboratory: 2D FFT Diffraction & Custom Aperture Painter',
        blocks: [
          {
            kind: 'sim',
            simId: 'fourier-optics',
            caption: 'Live 2D Fast Fourier Transform far-field intensity I(k_x, k_y) with paintable aperture canvas.',
            notice:
              'Switch presets between Single Slit, Double Slit, Circular Airy Aperture, and Grating—or paint directly on the left aperture mask! Narrowing an aperture along x immediately stretches its diffraction pattern along k_x (the classical Fourier reciprocity Δx · Δk_x ≥ ½).',
          },
        ],
      },
      {
        pageNumber: 7,
        chapterNumber: 3,
        chapterTitle: 'Chapter 3 · Canonical Diffraction Benchmarks',
        heading: 'Sinc Envelopes, Airy Disks & Rayleigh Resolution',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'For a rectangular slit of width a, the Fourier transform is a sinc(k_x a / 2), giving first dark zeros at sin θ = ±λ/a. For a circular telescope pupil of diameter D, Hankel transformation yields the Airy pattern involving the Bessel function J₁:',
            ],
            glossaryTerms: ['fraunhofer-diffraction'],
          },
          {
            kind: 'eq',
            id: 'eq-airy-rayleigh',
            number: '3.1',
            label: 'Airy Pattern & Rayleigh Angular Resolution Limit',
            tex: 'I(\\theta) = I_0\\!\\left[\\frac{2 J_1(\\tfrac{1}{2}kD\\sin\\theta)}{\\tfrac{1}{2}kD\\sin\\theta}\\right]^2, \\qquad \\theta_{\\min} \\approx 1.22\\,\\frac{\\lambda}{D}',
            symbols: [
              { symbol: 'J_1', meaning: 'Bessel function of the first kind of order 1 (first zero at 3.8317)', units: '1' },
              { symbol: 'D', meaning: 'Circular pupil diameter', units: 'm' },
              { symbol: '\\theta_{\\min}', meaning: 'Rayleigh angular separation of two point sources', units: 'rad' },
            ],
          },
        ],
      },
      {
        pageNumber: 8,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Gratings, Thin Films & Holography',
        heading: 'N-Slit Gratings and Spectral Resolving Power',
        isChapterOpener: true,
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'By the convolution theorem, an array of N identical slits of width a spaced by period d is the convolution of one slit with a Dirac comb—so its Fourier transform multiplies the single-slit sinc² envelope by the N-beam interference factor:',
            ],
          },
          {
            kind: 'eq',
            id: 'eq-grating-intensity',
            number: '4.1',
            label: 'Diffraction Grating Intensity & Chromatic Resolving Power',
            tex: 'I(\\theta) = I_0\\,\\mathrm{sinc}^2\\!\\left(\\frac{\\pi a\\sin\\theta}{\\lambda}\\right)\\frac{\\sin^2(N\\pi d\\sin\\theta/\\lambda)}{\\sin^2(\\pi d\\sin\\theta/\\lambda)}, \\qquad \\mathcal{R} \\equiv \\frac{\\lambda}{\\Delta\\lambda} = mN',
            symbols: [
              { symbol: 'N', meaning: 'Total number of illuminated grating grooves', units: '1' },
              { symbol: 'd', meaning: 'Grating groove period', units: 'm' },
              { symbol: 'm', meaning: 'Diffraction spectral order (d sin θ = mλ)', units: '1' },
            ],
          },
        ],
      },
      {
        pageNumber: 9,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Gratings, Thin Films & Holography',
        heading: 'Thin-Film Structural Colour & Gabor Holography',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'In a dielectric film of refractive index n_f and thickness d on a substrate, reflection from the denser interface contributes a π phase flip, so normal-incidence constructive reflection occurs when 2 n_f d = (m + ½)λ (when only one interface flips phase). Varying d sweeps reflected hues across Newton’s colour sequence.',
              'Ordinary photography records |U_obj|², discarding phase arg U_obj. Dennis Gabor (1948) interfered U_obj with a coherent tilted reference wave U_ref = R exp(ik_r x), recording I = |U_ref|² + |U_obj|² + U_ref* U_obj + U_ref U_obj*. Illuminating the developed transparency with U_ref reconstructs the full 3D complex wavefront U_obj!',
            ],
          },
          {
            kind: 'callout',
            variant: 'intuition',
            title: 'Babinet’s Principle',
            body: 'Away from the undeviated θ = 0 forward spot, complementary screens A₁ + A₂ = 1 satisfy U₁ + U₂ = 0, hence |U₁|² = |U₂|²: an opaque human hair and a slit of the same width cast identical Fraunhofer fringe spacings!',
          },
        ],
      },
      {
        pageNumber: 10,
        chapterNumber: 4,
        chapterTitle: 'Chapter 4 · Spatial Filtering & Coherence Visibility',
        heading: 'Abbe’s 4f Processor & Partial Coherence Envelope',
        blocks: [
          {
            kind: 'prose',
            paragraphs: [
              'In a 4f two-lens optical processor, the back focal plane holds Ũ(k_x, k_y). When mutual coherence |γ₁₂| degrades, two-slit interference visibility fades continuously into an incoherent intensity sum:',
            ],
          },
          {
            kind: 'motion',
            motionId: 'decoherence-fringes',
            caption: 'Continuous transition from coherent Young fringes (|γ₁₂| = 1) to incoherent illumination (|γ₁₂| = 0).',
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
            id: 'ex-opt-sodium-doublet',
            title: 'Exercise 1 · Resolving the Sodium D Doublet',
            difficulty: 2,
            prompt:
              'The yellow sodium D lines sit at λ₁ = 588.995 nm and λ₂ = 589.592 nm. What minimum number of illuminated grating lines N is required to resolve the doublet in second order (m = 2)?',
            hints: [
              'Compute Δλ = λ₂ − λ₁ = 0.597 nm and apply Rayleigh’s grating resolving power R = λ/Δλ = mN.',
            ],
            solution:
              'Here λ̄ / Δλ = 589.3 / 0.597 ≈ 987.1. In order m = 2 we require N ≥ R / m = 987.1 / 2 ≈ 494 illuminated grooves.',
            solutionTex: 'N_{\\min} = \\left\\lceil \\frac{\\bar{\\lambda}}{m\\,\\Delta\\lambda} \\right\\rceil = \\left\\lceil \\frac{589.3}{2 \\times 0.597} \\right\\rceil = 494',
          },
          {
            kind: 'exercise',
            id: 'ex-opt-antireflection',
            title: 'Exercise 2 · Quarter-Wave Anti-Reflection Coating',
            difficulty: 3,
            prompt:
              'Determine the optimal refractive index n_f and minimum non-zero thickness d of a single dielectric coating on crown glass (n_g = 1.52) in air (n₀ = 1.00) to achieve zero normal-incidence reflectance at λ₀ = 550 nm.',
            hints: [
              'With 1 < n_f < n_g, both interfaces undergo π phase shifts, so destructive interference requires round-trip optical path 2 n_f d = λ₀/2.',
              'Equal Fresnel reflection amplitudes require (n₀ − n_f)/(n₀ + n_f) = (n_f − n_g)/(n_f + n_g).',
            ],
            solution:
              'Amplitude matching yields n_f = √(n₀ n_g) = √1.52 ≈ 1.233, and quarter-wave destructive phase cancellation gives d = λ₀ / (4 n_f) = 550 nm / (4 × 1.233) ≈ 111.5 nm.',
            solutionTex: 'n_f = \\sqrt{n_0 n_g} \\approx 1.233, \\qquad d = \\frac{\\lambda_0}{4 n_f} \\approx 111.5\\;\\mathrm{nm}',
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
              'De Broglie’s relation p = ℏk translates every theorem of Fourier optics directly into quantum wave mechanics: Fraunhofer spatial-frequency reciprocity becomes Heisenberg’s uncertainty principle Δx Δp ≥ ℏ/2, and optical coherence visibility becomes quantum purity Tr(ρ²).',
            ],
          },
          {
            kind: 'references-list',
            leadsToBookIds: [
              'wavefunction-and-its-evolution',
              'maxwells-equations-in-motion',
              'topology-in-condensed-matter',
            ],
          },
        ],
      },
    ],
  },
];
