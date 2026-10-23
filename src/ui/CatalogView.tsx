import React, { useMemo, useState } from 'react';
import { Bookmark, BookOpen, Clock, Sparkles } from 'lucide-react';
import { ALL_BOOKS, WINGS } from '@/content';
import { WING_PALETTES } from '@/lib/colour';
import type { WingId } from '@/lib/schema';
import { usePhysicaStore } from '@/state/store';

export const CatalogView: React.FC = () => {
  const { selectBook, bookmarks, readingProgress } = usePhysicaStore();
  const [wingFilter, setWingFilter] = useState<WingId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'stub'>('all');
  const [filterText, setFilterText] = useState('');

  const filteredBooks = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    return ALL_BOOKS.filter((b) => {
      if (wingFilter !== 'all' && b.wing !== wingFilter) return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q)
      );
    });
  }, [wingFilter, statusFilter, filterText]);

  return (
    <main
      aria-label="Physica 2D Library Catalog"
      className="custom-scroll h-screen w-screen overflow-y-auto bg-stone-950 px-4 pt-20 pb-16 text-stone-100 sm:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Hero Header */}
        <section className="rounded-2xl border border-stone-800 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 p-6 shadow-xl">
          <h1 className="font-serif-book text-2xl font-bold sm:text-3xl">
            Physica — Complete Six-Wing Catalog
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm text-stone-300">
            Browse all 60 volumes directly in accessible 2D mode. Twelve flagship monographs
            feature complete graduate-level derivations, typeset equations with symbol units,
            scrubbable motion graphics, and live numerical simulations.
          </p>

          {/* Filter controls */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter catalog by topic, method, or title..."
              aria-label="Filter catalog volumes"
              className="w-full rounded-xl border border-stone-700 bg-stone-950 px-3.5 py-2 text-xs text-stone-100 outline-none focus:border-amber-500 sm:w-72"
            />

            <div className="flex rounded-xl border border-stone-700 bg-stone-950 p-0.5 text-xs">
              {(
                [
                  ['all', 'All (60)'],
                  ['published', 'Flagships (12)'],
                  ['stub', 'Coming Soon (48)'],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStatusFilter(val)}
                  className={`rounded-lg px-2.5 py-1 font-medium transition ${
                    statusFilter === val
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Wing filter pills */}
          <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setWingFilter('all')}
              className={`rounded-full px-3 py-1 font-medium ${
                wingFilter === 'all'
                  ? 'bg-stone-100 text-stone-900'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              All Six Wings
            </button>
            {WINGS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWingFilter(w.id)}
                className={`rounded-full px-3 py-1 font-medium ${
                  wingFilter === w.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                Wing {w.roman} · {w.shortName}
              </button>
            ))}
          </div>
        </section>

        {/* Cards Grid */}
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => {
            const palette = WING_PALETTES[book.wing];
            const prog = readingProgress[book.id] ?? 0;
            const totalP = book.pages?.length ?? 1;
            const bmCount = (bookmarks[book.id] ?? []).length;

            return (
              <article
                key={book.id}
                className="flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900/90 p-4 shadow-lg transition hover:border-amber-500/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span
                      style={{ color: palette.accent }}
                      className="font-bold tracking-wider uppercase"
                    >
                      {book.wing}
                    </span>
                    {book.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-300">
                        <Sparkles className="h-3 w-3" /> {totalP} Pages · Interactive
                      </span>
                    ) : (
                      <span className="rounded-full bg-stone-800 px-2 py-0.5 text-[10.5px] text-stone-300">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2 font-serif-book text-lg font-bold leading-snug text-stone-100">
                    {book.title}
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-amber-200/85">{book.subtitle}</p>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-stone-300">
                    {book.summary}
                  </p>
                </div>

                <div className="mt-4 border-t border-stone-800 pt-3">
                  <div className="mb-2.5 flex items-center justify-between text-[11px] text-stone-400">
                    <span>
                      Difficulty:{' '}
                      <strong className="text-amber-400">
                        {'★'.repeat(book.difficulty)}
                        {'☆'.repeat(5 - book.difficulty)}
                      </strong>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {book.readingMinutes} min
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => selectBook(book.id, Math.max(1, prog || 1), true)}
                      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                        book.status === 'published'
                          ? 'bg-amber-600 text-white hover:bg-amber-500'
                          : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
                      }`}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>
                        {book.status === 'published'
                          ? prog > 1
                            ? `Continue (p.${prog}/${totalP})`
                            : 'Open Monograph'
                          : 'View Syllabus'}
                      </span>
                    </button>

                    {bmCount > 0 && (
                      <span
                        title={`${bmCount} ribbon bookmark(s)`}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-900/50 px-2 py-2 text-[11px] text-amber-200"
                      >
                        <Bookmark className="h-3 w-3 fill-current" />
                        {bmCount}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
};
