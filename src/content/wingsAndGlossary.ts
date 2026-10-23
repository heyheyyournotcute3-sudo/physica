import type { GlossaryEntry, WingMeta } from '@/lib/schema';

export const WINGS: WingMeta[] = [
  {
    id: 'mechanics',
    roman: 'I',
    name: 'Classical & Analytical Mechanics',
    shortName: 'Mechanics',
    angleDeg: 0,
    architectureMood: 'Warm walnut panelling, brushed brass fittings, and overhead escapement clockwork',
    landmarkTitle: 'Chaotic Double Pendulum',
    landmarkSummary:
      'Two coupled brass arms integrated symplectically, tracing sensitive dependence on initial conditions in configuration space.',
    landmarkBookId: 'lagrangian-mechanics',
  },
  {
    id: 'electromagnetism',
    roman: 'II',
    name: 'Electromagnetism & Optics',
    shortName: 'Electromagnetism',
    angleDeg: 60,
    architectureMood: 'Dark slate colonnades, collimated light shafts, and dispersive spectral caustics',
    landmarkTitle: 'Tesla Resonator & Dispersive Prism',
    landmarkSummary:
      'Procedural high-voltage dielectric breakdown arcs paired with a crown-glass prism splitting collimated white light by wavelength.',
    landmarkBookId: 'maxwells-equations-in-motion',
  },
  {
    id: 'thermal',
    roman: 'III',
    name: 'Thermodynamics & Statistical Mechanics',
    shortName: 'Statistical Physics',
    angleDeg: 120,
    architectureMood: 'Burnished copper conduits, warm amber lanterns, and kinetic brass gauges',
    landmarkTitle: 'Maxwell–Boltzmann Gas Chamber',
    landmarkSummary:
      'Elastic spheres colliding in a glass vessel, relaxing irreversibly from an ordered state toward thermal equilibrium.',
    landmarkBookId: 'entropy-and-the-arrow-of-time',
  },
  {
    id: 'relativity',
    roman: 'IV',
    name: 'Relativity & Cosmology',
    shortName: 'Relativity',
    angleDeg: 180,
    architectureMood: 'Cool silver observatory stone, astrolabe rings, and deep-sky starlight',
    landmarkTitle: 'Schwarzschild Black Hole Lensing',
    landmarkSummary:
      'Real-time null-geodesic gravitational deflection displaying the photon ring at r = 3GM/c² and the shadow of radius √27 GM/c².',
    landmarkBookId: 'spacetime-special-to-general-relativity',
  },
  {
    id: 'quantum',
    roman: 'V',
    name: 'Quantum Mechanics & Quantum Field Theory',
    shortName: 'Quantum & QFT',
    angleDeg: 240,
    architectureMood: 'Pale cerulean frosted glass, coherent phase halos, and quiet interference alcoves',
    landmarkTitle: 'Single-Quanta Double-Slit Apparatus',
    landmarkSummary:
      'Individual localized detections accumulating one particle at a time into a coherent sin²/cos² interference envelope.',
    landmarkBookId: 'wavefunction-and-its-evolution',
  },
  {
    id: 'frontiers',
    roman: 'VI',
    name: 'Condensed Matter, Particle Physics & Frontiers',
    shortName: 'Frontiers',
    angleDeg: 300,
    architectureMood: 'Iridescent Bravais lattice columns, topological ribbons, and symmetry-breaking reliefs',
    landmarkTitle: 'Bravais Crystal Lattice Phonons',
    landmarkSummary:
      'A three-dimensional atomic lattice supporting travelling acoustic and optical collective normal-mode waves.',
    landmarkBookId: 'topology-in-condensed-matter',
  },
];

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'action',
    term: 'Action Functional',
    definition:
      'A functional S[q] mapping a trajectory q(t) between fixed endpoints to a real number with dimensions of energy × time (J·s). Classical trajectories render S stationary: δS = 0.',
    owningBookId: 'lagrangian-mechanics',
    formulaTex: 'S[q] = \\int_{t_1}^{t_2} L(q, \\dot{q}, t)\\,dt',
  },
  {
    id: 'lagrangian',
    term: 'Lagrangian',
    definition:
      'For conservative mechanical systems, the difference L = T − V between kinetic and potential energy expressed in generalised coordinates and velocities.',
    owningBookId: 'lagrangian-mechanics',
    formulaTex: 'L(q, \\dot{q}, t) = T(q, \\dot{q}) - V(q, t)',
  },
  {
    id: 'noether-charge',
    term: 'Noether Conserved Charge',
    definition:
      'The quantity conserved along solutions of the equations of motion whenever the action is invariant under a continuous one-parameter family of symmetries.',
    owningBookId: 'lagrangian-mechanics',
    formulaTex: 'Q = \\sum_i \\frac{\\partial L}{\\partial \\dot{q}_i}\\,\\delta q_i - K',
  },
  {
    id: 'symplectic-form',
    term: 'Symplectic Two-Form',
    definition:
      'The closed, non-degenerate differential 2-form ω = ∑ dp_i ∧ dq_i on phase space preserved by every Hamiltonian flow, implying Liouville volume conservation.',
    owningBookId: 'hamiltonian-chaos',
    formulaTex: '\\omega = \\sum_{i=1}^{n} dp_i \\wedge dq_i',
  },
  {
    id: 'kam-torus',
    term: 'KAM Invariant Torus',
    definition:
      'An n-dimensional invariant torus in phase space with sufficiently irrational winding frequencies that survives small Hamiltonian perturbations under the Kolmogorov–Arnold–Moser theorem.',
    owningBookId: 'hamiltonian-chaos',
  },
  {
    id: 'lyapunov-exponent',
    term: 'Maximal Lyapunov Exponent',
    definition:
      'The asymptotic exponential rate λ at which infinitesimally close trajectories in phase space diverge; λ > 0 diagnoses deterministic chaos.',
    owningBookId: 'hamiltonian-chaos',
    formulaTex: '\\lambda = \\lim_{t\\to\\infty} \\frac{1}{t}\\ln\\frac{\\|\\delta \\mathbf{z}(t)\\|}{\\|\\delta \\mathbf{z}(0)\\|}',
  },
  {
    id: 'gauge-invariance',
    term: 'Gauge Invariance',
    definition:
      'Redundancy in potential descriptions (φ, A) whereby transforming A → A + ∇χ and φ → φ − ∂χ/∂t leaves physical fields E and B strictly unchanged.',
    owningBookId: 'maxwells-equations-in-motion',
    formulaTex: 'A_\\mu \\to A_\\mu + \\partial_\\mu \\chi',
  },
  {
    id: 'poynting-vector',
    term: 'Poynting Vector',
    definition:
      'The directional electromagnetic energy flux density S = (1/μ₀) E × B carrying power per unit area and momentum density S/c².',
    owningBookId: 'maxwells-equations-in-motion',
    formulaTex: '\\mathbf{S} = \\frac{1}{\\mu_0}\\,\\mathbf{E}\\times\\mathbf{B}',
  },
  {
    id: 'fraunhofer-diffraction',
    term: 'Fraunhofer Diffraction',
    definition:
      'The far-field limit (Fresnel number F = a²/(λz) ≪ 1) in which the complex optical amplitude is proportional to the 2D spatial Fourier transform of the aperture field.',
    owningBookId: 'waves-interference-fourier-optics',
    formulaTex: 'U(k_x, k_y) \\propto \\iint A(x,y)e^{-i(k_x x + k_y y)}dx\\,dy',
  },
  {
    id: 'coherence',
    term: 'Optical Coherence',
    definition:
      'The degree of phase correlation of a wavefield across time (temporal coherence, set by spectral bandwidth Δν) or space (spatial coherence, set by source angular size).',
    owningBookId: 'waves-interference-fourier-optics',
  },
  {
    id: 'boltzmann-entropy',
    term: 'Boltzmann Entropy',
    definition:
      'Logarithmic measure S = k_B ln Ω of the phase-space volume Ω of microstates compatible with fixed macroscopic observables (E, V, N).',
    owningBookId: 'entropy-and-the-arrow-of-time',
    formulaTex: 'S = k_B \\ln \\Omega',
  },
  {
    id: 'loschmidt-paradox',
    term: 'Loschmidt Reversibility Paradox',
    definition:
      'The apparent tension between time-reversal-invariant microscopic dynamics (t → −t, p → −p) and macroscopic irreversible entropy growth, resolved by low-entropy boundary conditions and typicality.',
    owningBookId: 'entropy-and-the-arrow-of-time',
  },
  {
    id: 'renormalization-group',
    term: 'Renormalization Group (RG)',
    definition:
      'Systematic coarse-graining + rescaling transformation in coupling space whose fixed points govern scale invariance and universal critical exponents.',
    owningBookId: 'phase-transitions-renormalization-group',
  },
  {
    id: 'universality',
    term: 'Universality Class',
    definition:
      'Distinct microscopic systems sharing identical critical exponents because they share spatial dimension d, order-parameter symmetry, and interaction range, flowing to the same RG fixed point.',
    owningBookId: 'phase-transitions-renormalization-group',
  },
  {
    id: 'proper-time',
    term: 'Proper Time',
    definition:
      'Lorentz-invariant time τ elapsed along a timelike worldline as measured by an ideal clock carried along that worldline.',
    owningBookId: 'spacetime-special-to-general-relativity',
    formulaTex: 'd\\tau^2 = -\\frac{1}{c^2}\\,g_{\\mu\\nu}\\,dx^\\mu dx^\\nu',
  },
  {
    id: 'geodesic',
    term: 'Geodesic',
    definition:
      'Curve of extremal proper time (or affine parameter for null rays) whose tangent vector is parallel-transported along itself: u^ν ∇_ν u^μ = 0.',
    owningBookId: 'spacetime-special-to-general-relativity',
    formulaTex: '\\frac{d^2 x^\\mu}{d\\lambda^2} + \\Gamma^\\mu_{\\alpha\\beta}\\frac{dx^\\alpha}{d\\lambda}\\frac{dx^\\beta}{d\\lambda} = 0',
  },
  {
    id: 'isco',
    term: 'Innermost Stable Circular Orbit (ISCO)',
    definition:
      'Smallest radius admitting stable circular timelike orbits around a compact object; r_ISCO = 6GM/c² for a non-rotating Schwarzschild black hole.',
    owningBookId: 'spacetime-special-to-general-relativity',
  },
  {
    id: 'comoving-distance',
    term: 'Comoving Distance',
    definition:
      'Coordinate separation χ factoring out cosmic expansion a(t); related to proper distance by d_p(t) = a(t)χ.',
    owningBookId: 'the-expanding-universe',
    formulaTex: '\\chi = c \\int_{t_e}^{t_0} \\frac{dt}{a(t)}',
  },
  {
    id: 'particle-horizon',
    term: 'Particle Horizon',
    definition:
      'Maximum comoving distance from which light could have reached an observer since t = 0, corresponding to causal contact in conformal time η = ∫ dt/a(t).',
    owningBookId: 'the-expanding-universe',
  },
  {
    id: 'unitarity',
    term: 'Unitary Evolution',
    definition:
      'Time evolution via U(t) = exp(−iHt/ℏ) satisfying U†U = I, preserving inner products and total probability ⟨ψ|ψ⟩ = 1.',
    owningBookId: 'wavefunction-and-its-evolution',
    formulaTex: 'U^\\dagger(t) U(t) = \\mathbf{1}',
  },
  {
    id: 'decoherence',
    term: 'Quantum Decoherence',
    definition:
      'Suppression of off-diagonal reduced density-matrix elements ρ_S = Tr_E(|Ψ⟩⟨Ψ|) caused by entanglement between a quantum system and an unobserved environment.',
    owningBookId: 'wavefunction-and-its-evolution',
  },
  {
    id: 'path-integral',
    term: 'Feynman Path Integral',
    definition:
      'Formulation of quantum transition amplitudes as a coherent sum over all field or trajectory histories weighted by exp(iS/ℏ).',
    owningBookId: 'quantum-field-theory-fields-to-particles',
    formulaTex: 'Z = \\int \\mathcal{D}\\phi\\, e^{\\frac{i}{\\hbar}S[\\phi]}',
  },
  {
    id: 'berry-phase',
    term: 'Berry Geometric Phase',
    definition:
      'Gauge-invariant geometric phase γ_n(C) = ∮_C A_n(R)·dR acquired by an eigenstate transported adiabatically around a closed parameter loop C.',
    owningBookId: 'topology-in-condensed-matter',
    formulaTex: '\\gamma_n = i \\oint_C \\langle u_n(\\mathbf{k}) | \\nabla_{\\mathbf{k}} u_n(\\mathbf{k}) \\rangle \\cdot d\\mathbf{k}',
  },
  {
    id: 'chern-number',
    term: 'Chern Number',
    definition:
      'Integer topological invariant C ∈ ℤ obtained by integrating the Berry curvature over a closed 2D Brillouin zone torus; quantizes Hall conductance σ_xy = C e²/h.',
    owningBookId: 'topology-in-condensed-matter',
    formulaTex: 'C = \\frac{1}{2\\pi}\\iint_{\\text{BZ}} \\Omega_{xy}(\\mathbf{k})\\,d^2k \\in \\mathbb{Z}',
  },
  {
    id: 'spontaneous-symmetry-breaking',
    term: 'Spontaneous Symmetry Breaking (SSB)',
    definition:
      'Phenomenon in which the Lagrangian possesses an exact symmetry group G, while the lowest-energy vacuum state |0⟩ is invariant only under a proper subgroup H ⊂ G.',
    owningBookId: 'the-standard-model-and-beyond',
  },
  {
    id: 'higgs-mechanism',
    term: 'Brout–Englert–Higgs Mechanism',
    definition:
      'Gauge-invariant generation of vector boson masses when a local gauge symmetry is spontaneously broken and would-be Nambu–Goldstone modes become longitudinal polarizations.',
    owningBookId: 'the-standard-model-and-beyond',
  },
];

export const GLOSSARY_BY_ID: Record<string, GlossaryEntry> = Object.fromEntries(
  GLOSSARY.map((g) => [g.id, g])
);
