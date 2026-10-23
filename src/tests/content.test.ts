import { describe, expect, it } from 'vitest';
import katex from 'katex';
import {
  ALL_BOOKS,
  BOOKS_BY_ID,
  GLOSSARY,
  GLOSSARY_BY_ID,
  validateCatalogSchemas,
  WINGS,
} from '../content';
import { MOTION_SCENES } from '../motion/MotionGraphicPlayer';
import { SIM_REGISTRY } from '../sims/SimRunner';

describe('Physica Catalog, KaTeX Strict Rendering & Reference Integrity', () => {
  it('ships at least 60 books across 6 wings with exactly 12 complete flagship monographs', () => {
    validateCatalogSchemas();
    expect(WINGS.length).toBe(6);
    expect(ALL_BOOKS.length).toBeGreaterThanOrEqual(60);

    const published = ALL_BOOKS.filter((b) => b.status === 'published');
    expect(published.length).toBe(12);

    for (const book of published) {
      expect(book.pages).toBeDefined();
      expect(book.pages!.length).toBeGreaterThanOrEqual(12);
    }
  });

  it('renders every single TeX equation in books, derivations, exercises, glossary, and motion graphics in KaTeX strict mode', () => {
    const checkTex = (tex: string, ctx: string) => {
      expect(() =>
        katex.renderToString(tex, {
          throwOnError: true,
          strict: 'error',
        })
      ).not.toThrowError(ctx);
    };

    for (const g of GLOSSARY) {
      if (g.formulaTex) checkTex(g.formulaTex, `glossary:${g.id}`);
    }

    for (const scene of Object.values(MOTION_SCENES)) {
      for (const beat of scene.beats) {
        checkTex(beat.tex, `motion:${scene.id}`);
      }
    }

    for (const book of ALL_BOOKS) {
      for (const page of book.pages ?? []) {
        for (const blk of page.blocks) {
          if (blk.kind === 'eq') {
            checkTex(blk.tex, `${book.id}:p${page.pageNumber}:${blk.id}`);
            for (const sym of blk.symbols) {
              checkTex(sym.symbol, `${book.id}:${blk.id}:sym`);
            }
          } else if (blk.kind === 'derivation') {
            for (const step of blk.steps) {
              checkTex(step.tex, `${book.id}:p${page.pageNumber}:deriv`);
            }
          } else if (blk.kind === 'callout' && blk.tex) {
            checkTex(blk.tex, `${book.id}:p${page.pageNumber}:callout`);
          } else if (blk.kind === 'exercise') {
            if (blk.promptTex) checkTex(blk.promptTex, `${book.id}:${blk.id}:prompt`);
            if (blk.solutionTex) checkTex(blk.solutionTex, `${book.id}:${blk.id}:sol`);
          }
        }
      }
    }
  });

  it('resolves every <Sim>, <Motion>, glossary <Term>, cross-reference, and prerequisite with zero cycles', () => {
    for (const wing of WINGS) {
      expect(BOOKS_BY_ID[wing.landmarkBookId]).toBeDefined();
    }

    for (const g of GLOSSARY) {
      expect(BOOKS_BY_ID[g.owningBookId]).toBeDefined();
    }

    for (const book of ALL_BOOKS) {
      // Check no lorem ipsum or TODO-VERIFY in published books
      const jsonText = JSON.stringify(book);
      expect(jsonText.toLowerCase()).not.toContain('lorem ipsum');
      if (book.status === 'published') {
        expect(jsonText).not.toContain('TODO-VERIFY');
      }

      for (const preId of book.prerequisites) {
        expect(BOOKS_BY_ID[preId], `${book.id} missing prerequisite ${preId}`).toBeDefined();
      }

      if (book.status === 'published') {
        let movingCount = 0;
        for (const page of book.pages ?? []) {
          for (const blk of page.blocks) {
            if (blk.kind === 'sim') {
              expect(SIM_REGISTRY[blk.simId], `Missing sim ${blk.simId}`).toBeDefined();
              movingCount++;
            } else if (blk.kind === 'motion') {
              expect(MOTION_SCENES[blk.motionId], `Missing motion ${blk.motionId}`).toBeDefined();
              movingCount++;
            } else if (blk.kind === 'prose' && blk.glossaryTerms) {
              for (const tId of blk.glossaryTerms) {
                expect(GLOSSARY_BY_ID[tId], `Missing glossary ${tId}`).toBeDefined();
              }
            } else if (blk.kind === 'references-list') {
              for (const leadId of blk.leadsToBookIds) {
                expect(BOOKS_BY_ID[leadId], `Missing lead book ${leadId}`).toBeDefined();
              }
            }
          }
        }
        expect(movingCount, `${book.id} needs >= 3 sims/motions`).toBeGreaterThanOrEqual(3);
      }
    }

    // Verify prerequisite graph is a strict DAG (no cycles)
    const visiting = new Set<string>();
    const visited = new Set<string>();
    const dfs = (id: string) => {
      expect(visiting.has(id), `Cycle detected at ${id}`).toBe(false);
      if (visited.has(id)) return;
      visiting.add(id);
      for (const pre of BOOKS_BY_ID[id].prerequisites) {
        dfs(pre);
      }
      visiting.delete(id);
      visited.add(id);
    };
    for (const b of ALL_BOOKS) dfs(b.id);
  });
});
