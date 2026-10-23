import { z } from 'zod';

export const WingIdSchema = z.enum([
  'mechanics',
  'electromagnetism',
  'thermal',
  'relativity',
  'quantum',
  'frontiers',
]);

export type WingId = z.infer<typeof WingIdSchema>;

export const WingMetaSchema = z.object({
  id: WingIdSchema,
  roman: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  angleDeg: z.number(), // 0, 60, 120, 180, 240, 300
  architectureMood: z.string().min(1),
  landmarkTitle: z.string().min(1),
  landmarkSummary: z.string().min(1),
  landmarkBookId: z.string().min(1),
});

export type WingMeta = z.infer<typeof WingMetaSchema>;

export const GlossaryEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  term: z.string().min(1),
  definition: z.string().min(10),
  owningBookId: z.string().min(1),
  formulaTex: z.string().optional(),
});

export type GlossaryEntry = z.infer<typeof GlossaryEntrySchema>;

export const EquationSymbolSchema = z.object({
  symbol: z.string().min(1),
  meaning: z.string().min(1),
  units: z.string().min(1),
});

export type EquationSymbol = z.infer<typeof EquationSymbolSchema>;

export const DerivationStepSchema = z.object({
  tex: z.string().min(1),
  why: z.string().min(3),
  highlightTerm: z.string().optional(),
});

export type DerivationStep = z.infer<typeof DerivationStepSchema>;

export const PageBlockSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('prose'),
    paragraphs: z.array(z.string().min(1)).min(1),
    glossaryTerms: z.array(z.string()).optional(),
  }),
  z.object({
    kind: z.literal('eq'),
    id: z.string().min(1),
    number: z.string().min(1),
    label: z.string().optional(),
    tex: z.string().min(1),
    symbols: z.array(EquationSymbolSchema).min(1),
  }),
  z.object({
    kind: z.literal('derivation'),
    title: z.string().min(1),
    steps: z.array(DerivationStepSchema).min(2),
  }),
  z.object({
    kind: z.literal('sim'),
    simId: z.string().min(1),
    caption: z.string().min(1),
    notice: z.string().min(10),
    presetParams: z.record(z.string(), z.number()).optional(),
  }),
  z.object({
    kind: z.literal('motion'),
    motionId: z.string().min(1),
    caption: z.string().min(1),
  }),
  z.object({
    kind: z.literal('callout'),
    variant: z.enum(['intuition', 'warning', 'history', 'summary']),
    title: z.string().min(1),
    body: z.string().min(5),
    tex: z.string().optional(),
  }),
  z.object({
    kind: z.literal('exercise'),
    id: z.string().min(1),
    title: z.string().min(1),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
    prompt: z.string().min(10),
    promptTex: z.string().optional(),
    hints: z.array(z.string().min(3)).min(1),
    solution: z.string().min(10),
    solutionTex: z.string().optional(),
  }),
  z.object({
    kind: z.literal('concept-map'),
    nodes: z.array(
      z.object({
        chapter: z.number(),
        title: z.string(),
        coreIdea: z.string(),
      })
    ),
  }),
  z.object({
    kind: z.literal('references-list'),
    leadsToBookIds: z.array(z.string()),
  }),
]);

export type PageBlock = z.infer<typeof PageBlockSchema>;

export const BookPageSchema = z.object({
  pageNumber: z.number().int().positive(),
  chapterNumber: z.number().int().nonnegative(),
  chapterTitle: z.string().min(1),
  heading: z.string().min(1),
  isChapterOpener: z.boolean().optional(),
  blocks: z.array(PageBlockSchema).min(1),
});

export type BookPage = z.infer<typeof BookPageSchema>;

export const BookMetaSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  wing: WingIdSchema,
  status: z.enum(['published', 'stub']),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  readingMinutes: z.number().int().positive(),
  prerequisites: z.array(z.string()),
  shelf: z.object({
    side: z.enum(['left', 'right']),
    bay: z.number().int().min(0).max(5),
    level: z.number().int().min(0).max(4),
    slot: z.number().int().min(0).max(11),
    mezzanine: z.boolean(),
  }),
  cover: z.object({
    colour: z.string().min(4),
    material: z.enum(['leather', 'cloth', 'vellum']),
    emblem: z.enum([
      'pendulum',
      'phase-torus',
      'field-wave',
      'diffraction',
      'entropy-gas',
      'ising-lattice',
      'light-cone',
      'cosmos',
      'wavepacket',
      'feynman-vertex',
      'trefoil-band',
      'higgs-potential',
      'monograph',
    ]),
  }),
  conventions: z.object({
    units: z.enum(['SI', 'natural', 'gaussian', 'geometrized']),
    metricSignature: z.enum(['-+++', '+---']).optional(),
    fourier: z.string().optional(),
    notes: z.string().optional(),
  }),
  summary: z.string().min(20),
  plannedChapters: z.array(z.string().min(2)).min(3),
  references: z.array(
    z.object({
      authors: z.string().min(2),
      title: z.string().min(2),
      year: z.number().int().min(1687).max(2026),
      edition: z.string().optional(),
      chapters: z.string().optional(),
    })
  ),
  pages: z.array(BookPageSchema).optional(),
});

export type BookMeta = z.infer<typeof BookMetaSchema>;

/**
 * Explicit typed book interaction state machine (never scattered booleans).
 */
export type BookMachinePhase =
  | { phase: 'idle' }
  | { phase: 'hovered'; bookId: string }
  | { phase: 'pulling'; bookId: string; targetPage: number }
  | { phase: 'opening'; bookId: string; targetPage: number }
  | { phase: 'reading'; bookId: string; page: number }
  | { phase: 'closing'; bookId: string };
