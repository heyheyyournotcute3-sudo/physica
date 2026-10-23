import React, { useState } from 'react';
import katex from 'katex';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Compass,
  HelpCircle,
  History,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { BOOKS_BY_ID, GLOSSARY_BY_ID } from '@/content';
import type { BookMeta, PageBlock } from '@/lib/schema';
import { MotionGraphicPlayer } from '@/motion/MotionGraphicPlayer';
import { SimRunner } from '@/sims/SimRunner';
import { usePhysicaStore } from '@/state/store';

function renderTex(tex: string, displayMode = false): string {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: false,
    output: 'htmlAndMathml',
  });
}

const EquationBlockView: React.FC<{
  block: Extract<PageBlock, { kind: 'eq' }>;
  dark: boolean;
}> = ({ block, dark }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const html = renderTex(block.tex, true);

  return (
    <div
      id={block.id}
      className={`my-3 rounded-lg border px-3.5 py-2.5 ${
        dark
          ? 'border-stone-700/80 bg-stone-900/65'
          : 'border-stone-300/80 bg-amber-50/45'
      }`}
    >
      {block.label && (
        <div className="mb-1 flex items-center justify-between font-sans-ui text-[10.5px] font-semibold tracking-wide uppercase opacity-70">
          <span>{block.label}</span>
          <span>({block.number})</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div
          className="min-w-0 flex-1 overflow-x-auto text-sm"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!block.label && (
          <span className="shrink-0 font-sans-ui text-xs font-medium opacity-70">
            ({block.number})
          </span>
        )}
      </div>

      {/* Interactive symbol legend chips */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-current/10 pt-2 font-sans-ui">
        <span className="text-[10px] tracking-wide uppercase opacity-55">Symbols:</span>
        {block.symbols.map((sym, idx) => {
          const symHtml = renderTex(sym.symbol, false);
          const isAct = hoveredIdx === idx;
          return (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onFocus={() => setHoveredIdx(idx)}
              onBlur={() => setHoveredIdx(null)}
              onClick={() => setHoveredIdx(isAct ? null : idx)}
              className={`rounded px-1.5 py-0.5 text-[11px] transition ${
                isAct
                  ? 'bg-amber-600 text-white'
                  : dark
                    ? 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                    : 'bg-stone-200/80 text-stone-800 hover:bg-stone-300/80'
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: symHtml }} />
            </button>
          );
        })}
      </div>

      {hoveredIdx !== null && block.symbols[hoveredIdx] && (
        <div
          className={`mt-1.5 rounded px-2.5 py-1.5 font-sans-ui text-xs ${
            dark ? 'bg-stone-950 text-amber-200' : 'bg-white text-stone-800 shadow-xs'
          }`}
        >
          <strong>Meaning:</strong> {block.symbols[hoveredIdx].meaning}{' '}
          <span className="ml-2 rounded bg-amber-500/20 px-1.5 py-0.5 font-mono-code text-[10.5px]">
            Units: {block.symbols[hoveredIdx].units}
          </span>
        </div>
      )}
    </div>
  );
};

const DerivationBlockView: React.FC<{
  block: Extract<PageBlock, { kind: 'derivation' }>;
  dark: boolean;
}> = ({ block, dark }) => {
  const [visibleSteps, setVisibleSteps] = useState(1);

  return (
    <div
      className={`my-3 rounded-lg border p-3.5 ${
        dark
          ? 'border-amber-500/30 bg-stone-900/75'
          : 'border-amber-700/25 bg-amber-50/55'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2 font-sans-ui">
        <span className="text-xs font-semibold tracking-wide uppercase opacity-85">
          Step-by-Step Derivation · {block.title}
        </span>
        <span className="font-mono-code text-[11px] opacity-70">
          {visibleSteps} / {block.steps.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {block.steps.slice(0, visibleSteps).map((step, idx) => (
          <div
            key={idx}
            className={`rounded border-l-2 border-amber-500 pl-3 transition-all duration-300 ${
              idx === visibleSteps - 1 ? 'opacity-100' : 'opacity-85'
            }`}
          >
            <div
              className="overflow-x-auto text-sm"
              dangerouslySetInnerHTML={{ __html: renderTex(step.tex, true) }}
            />
            <p className="font-sans-ui text-[11.5px] leading-snug opacity-80">
              <strong className="text-amber-600 dark:text-amber-400">Step {idx + 1}:</strong>{' '}
              {step.why}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 font-sans-ui text-xs">
        {visibleSteps < block.steps.length ? (
          <>
            <button
              type="button"
              onClick={() => setVisibleSteps((s) => s + 1)}
              className="inline-flex items-center gap-1 rounded bg-amber-600 px-2.5 py-1 font-medium text-white hover:bg-amber-500"
            >
              Next step <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setVisibleSteps(block.steps.length)}
              className="rounded border border-current/20 px-2.5 py-1 opacity-80 hover:opacity-100"
            >
              Reveal all ({block.steps.length})
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setVisibleSteps(1)}
            className="rounded border border-current/20 px-2.5 py-1 opacity-75 hover:opacity-100"
          >
            Fold back to Step 1
          </button>
        )}
      </div>
    </div>
  );
};

const ExerciseBlockView: React.FC<{
  block: Extract<PageBlock, { kind: 'exercise' }>;
  dark: boolean;
}> = ({ block, dark }) => {
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div
      className={`my-3 rounded-lg border p-3.5 ${
        dark ? 'border-stone-700 bg-stone-900/70' : 'border-stone-300 bg-white/80'
      }`}
    >
      <div className="flex items-center justify-between gap-2 font-sans-ui">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold">
          <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
          {block.title}
        </span>
        <span className="font-mono-code text-[10.5px] opacity-70">
          Difficulty {'★'.repeat(block.difficulty)}
          {'☆'.repeat(5 - block.difficulty)}
        </span>
      </div>

      <p className="mt-1.5 text-[14.5px] leading-relaxed">{block.prompt}</p>
      {block.promptTex && (
        <div
          className="my-1.5 overflow-x-auto text-sm"
          dangerouslySetInnerHTML={{ __html: renderTex(block.promptTex, true) }}
        />
      )}

      {hintsShown > 0 && (
        <ul className="mt-2 space-y-1 rounded bg-amber-500/10 p-2 font-sans-ui text-xs">
          {block.hints.slice(0, hintsShown).map((hint, i) => (
            <li key={i}>
              <strong>Hint {i + 1}:</strong> {hint}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2.5 flex flex-wrap items-center gap-2 font-sans-ui text-xs">
        {hintsShown < block.hints.length && (
          <button
            type="button"
            onClick={() => setHintsShown((h) => h + 1)}
            className="rounded border border-amber-500/40 px-2.5 py-1 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400"
          >
            Reveal Hint ({hintsShown + 1}/{block.hints.length})
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowSolution((s) => !s)}
          className="inline-flex items-center gap-1 rounded bg-stone-800 px-2.5 py-1 text-stone-100 hover:bg-stone-700 dark:bg-stone-700"
        >
          {showSolution ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          {showSolution ? 'Hide Worked Solution' : 'Worked Solution'}
        </button>
      </div>

      {showSolution && (
        <div
          className={`mt-2.5 rounded border-t pt-2.5 text-[14px] leading-relaxed ${
            dark ? 'border-stone-700 text-stone-200' : 'border-stone-200 text-stone-800'
          }`}
        >
          <p>{block.solution}</p>
          {block.solutionTex && (
            <div
              className="mt-1.5 overflow-x-auto text-sm"
              dangerouslySetInnerHTML={{ __html: renderTex(block.solutionTex, true) }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export const PageBlockRenderer: React.FC<{
  block: PageBlock;
  book: BookMeta;
  dark: boolean;
  onJumpToBook: (targetBookId: string) => void;
}> = ({ block, book, dark, onJumpToBook }) => {
  const { setActiveGlossaryTermId } = usePhysicaStore();

  switch (block.kind) {
    case 'prose':
      return (
        <div className="space-y-2.5">
          {block.paragraphs.map((p, idx) => (
            <p key={idx} className="leading-[1.64] tracking-[0.004em]">
              {p}
            </p>
          ))}
          {block.glossaryTerms && block.glossaryTerms.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 font-sans-ui">
              <span className="text-[10.5px] tracking-wide uppercase opacity-60">Glossary:</span>
              {block.glossaryTerms.map((termId) => {
                const entry = GLOSSARY_BY_ID[termId];
                if (!entry) return null;
                return (
                  <button
                    key={termId}
                    type="button"
                    onClick={() => setActiveGlossaryTermId(termId)}
                    className="rounded border-b border-dashed border-amber-500 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 hover:bg-amber-500/15 dark:text-amber-300"
                  >
                    {entry.term}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      );

    case 'eq':
      return <EquationBlockView block={block} dark={dark} />;

    case 'derivation':
      return <DerivationBlockView block={block} dark={dark} />;

    case 'sim':
      return (
        <SimRunner
          simId={block.simId}
          caption={block.caption}
          notice={block.notice}
          presetParams={block.presetParams}
        />
      );

    case 'motion':
      return <MotionGraphicPlayer motionId={block.motionId} caption={block.caption} />;

    case 'callout': {
      const Icon =
        block.variant === 'intuition'
          ? Lightbulb
          : block.variant === 'warning'
            ? AlertTriangle
            : block.variant === 'history'
              ? History
              : Sparkles;
      return (
        <aside
          className={`my-3 rounded-lg border-l-4 p-3 ${
            block.variant === 'warning'
              ? 'border-orange-500 bg-orange-500/10'
              : block.variant === 'history'
                ? 'border-sky-500 bg-sky-500/10'
                : 'border-amber-500 bg-amber-500/10'
          }`}
        >
          <div className="flex items-center gap-1.5 font-sans-ui text-xs font-bold tracking-wide uppercase">
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{block.title}</span>
          </div>
          <p className="mt-1 text-[14px] leading-relaxed">{block.body}</p>
          {block.tex && (
            <div
              className="mt-1.5 overflow-x-auto text-xs"
              dangerouslySetInnerHTML={{ __html: renderTex(block.tex, true) }}
            />
          )}
        </aside>
      );
    }

    case 'exercise':
      return <ExerciseBlockView block={block} dark={dark} />;

    case 'concept-map':
      return (
        <div className="my-3 space-y-2 font-sans-ui">
          {block.nodes.map((node, idx) => (
            <div
              key={node.chapter}
              className={`relative flex items-start gap-3 rounded-lg border p-2.5 ${
                dark ? 'border-stone-700 bg-stone-900/75' : 'border-stone-300 bg-white/80'
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                {node.chapter}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold">{node.title}</div>
                <p className="mt-0.5 text-[11.5px] leading-snug opacity-80">{node.coreIdea}</p>
              </div>
              {idx < block.nodes.length - 1 && (
                <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 opacity-40" />
              )}
            </div>
          ))}
        </div>
      );

    case 'references-list':
      return (
        <div className="my-3 space-y-3 font-sans-ui">
          <div>
            <h4 className="mb-1.5 text-xs font-bold tracking-wide uppercase opacity-75">
              Where This Leads — Connected Volumes
            </h4>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {block.leadsToBookIds.map((targetId) => {
                const target = BOOKS_BY_ID[targetId];
                if (!target) return null;
                return (
                  <button
                    key={targetId}
                    type="button"
                    onClick={() => onJumpToBook(targetId)}
                    className={`flex items-center justify-between gap-2 rounded border p-2 text-left text-xs transition ${
                      dark
                        ? 'border-stone-700 bg-stone-900 hover:border-amber-500'
                        : 'border-stone-300 bg-white hover:border-amber-600'
                    }`}
                  >
                    <span className="font-semibold">{target.title}</span>
                    <Compass className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="mb-1.5 text-xs font-bold tracking-wide uppercase opacity-75">
              Canonical References
            </h4>
            <ul className="space-y-1 text-xs opacity-85">
              {book.references.map((ref, idx) => (
                <li key={idx} className="flex items-baseline gap-1.5">
                  <BookOpen className="h-3 w-3 shrink-0 opacity-60" />
                  <span>
                    {ref.authors}, <em>{ref.title}</em> ({ref.year}
                    {ref.edition ? `, ${ref.edition}` : ''})
                    {ref.chapters ? `, ${ref.chapters}` : ''}.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
  }
};
