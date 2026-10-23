import React, { useEffect, useState } from 'react';
import katex from 'katex';
import {
  Bookmark,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Compass,
  List,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { BOOKS_BY_ID, GLOSSARY_BY_ID, WINGS } from '@/content';
import { WING_PALETTES } from '@/lib/colour';
import type { BookMeta, BookPage } from '@/lib/schema';
import { usePhysicaStore } from '@/state/store';
import { PageBlockRenderer } from './PageBlocks';

const StubBookSheet: React.FC<{
  book: BookMeta;
  dark: boolean;
  onJumpToBook: (bookId: string) => void;
}> = ({ book, dark, onJumpToBook }) => {
  const wing = WINGS.find((w) => w.id === book.wing);
  return (
    <div className="space-y-4 py-2">
      <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 font-sans-ui text-xs font-semibold text-amber-600 dark:text-amber-300">
        Coming Soon · Scheduled Monograph Stub
      </div>
      <h2 className="text-2xl font-bold leading-tight">{book.title}</h2>
      <p className="text-base italic opacity-80">{book.subtitle}</p>
      <p className="leading-relaxed">{book.summary}</p>

      <div
        className={`rounded-lg border p-3.5 font-sans-ui text-xs ${
          dark ? 'border-stone-700 bg-stone-900/75' : 'border-stone-300 bg-white/80'
        }`}
      >
        <div className="font-bold tracking-wide uppercase opacity-75">
          Planned Chapters ({wing?.name})
        </div>
        <ol className="mt-2 list-decimal space-y-1 pl-4">
          {book.plannedChapters.map((ch, idx) => (
            <li key={idx}>{ch}</li>
          ))}
        </ol>
      </div>

      {book.prerequisites.length > 0 && (
        <div className="font-sans-ui text-xs">
          <div className="mb-1.5 font-bold tracking-wide uppercase opacity-75">
            Available Prerequisites You Can Read Right Now:
          </div>
          <div className="flex flex-wrap gap-2">
            {book.prerequisites.map((preId) => {
              const pre = BOOKS_BY_ID[preId];
              if (!pre) return null;
              return (
                <button
                  key={preId}
                  type="button"
                  onClick={() => onJumpToBook(preId)}
                  className="inline-flex items-center gap-1.5 rounded bg-amber-600 px-3 py-1.5 font-medium text-white hover:bg-amber-500"
                >
                  <Compass className="h-3.5 w-3.5" />
                  {pre.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="font-sans-ui text-xs opacity-80">
        <strong>Primary Reference:</strong>{' '}
        {book.references.map((r) => `${r.authors}, ${r.title} (${r.year})`).join('; ')}
      </div>
    </div>
  );
};

const SinglePageSheet: React.FC<{
  book: BookMeta;
  pageData: BookPage | null;
  dark: boolean;
  fontSizeClass: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onJumpToBook: (bookId: string) => void;
}> = ({
  book,
  pageData,
  dark,
  fontSizeClass,
  isBookmarked,
  onToggleBookmark,
  onJumpToBook,
}) => {
  const palette = WING_PALETTES[book.wing];

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-md shadow-2xl ${
        dark ? 'book-page-dark border border-stone-700/80' : 'book-page-paper border border-stone-300'
      }`}
    >
      {/* Physical ribbon bookmark tab at top edge */}
      <button
        type="button"
        onClick={onToggleBookmark}
        aria-label={isBookmarked ? 'Remove ribbon bookmark' : 'Place ribbon bookmark on this page'}
        title={isBookmarked ? 'Remove ribbon bookmark' : 'Bookmark page'}
        className={`absolute top-0 right-7 z-20 flex w-6 flex-col items-center rounded-b transition-all ${
          isBookmarked
            ? 'h-11 bg-red-700 text-amber-100 shadow-md'
            : 'h-6 bg-stone-500/20 text-stone-500 hover:h-8 hover:bg-red-700/75 hover:text-white'
        }`}
      >
        <Bookmark className="mt-1 h-3.5 w-3.5 fill-current" />
      </button>

      {/* Running header */}
      <header className="flex shrink-0 items-center justify-between border-b border-current/10 px-6 py-2.5 pr-16 font-sans-ui text-[10.5px] tracking-wider uppercase opacity-65">
        <span className="truncate">{book.title}</span>
        <span className="shrink-0 pl-2">{pageData?.chapterTitle ?? 'Syllabus'}</span>
      </header>

      {/* Scrollable crisp HTML body */}
      <div className={`custom-scroll flex-1 overflow-y-auto px-6 py-4 font-serif-book ${fontSizeClass}`}>
        {pageData ? (
          <>
            {pageData.isChapterOpener && (
              <div className="mb-3 border-b border-current/15 pb-2">
                <div
                  style={{ color: palette.accent }}
                  className="font-sans-ui text-xs font-bold tracking-widest uppercase"
                >
                  {pageData.chapterNumber === 0
                    ? `Wing · ${book.wing.toUpperCase()}`
                    : `Chapter 0${pageData.chapterNumber}`}
                </div>
                <h2 className="mt-0.5 text-xl font-bold leading-snug">{pageData.heading}</h2>
              </div>
            )}
            {!pageData.isChapterOpener && (
              <h3 className="mb-2.5 text-lg font-bold leading-snug">{pageData.heading}</h3>
            )}

            {pageData.pageNumber === 1 && book.prerequisites.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-1.5 rounded bg-amber-500/10 px-2.5 py-1.5 font-sans-ui text-[11px]">
                <span className="font-semibold opacity-80">Read first:</span>
                {book.prerequisites.map((pid) => {
                  const pre = BOOKS_BY_ID[pid];
                  if (!pre) return null;
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => onJumpToBook(pid)}
                      className="underline decoration-amber-500 underline-offset-2 hover:text-amber-600"
                    >
                      {pre.title}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="space-y-2.5">
              {pageData.blocks.map((blk, i) => (
                <PageBlockRenderer
                  key={i}
                  block={blk}
                  book={book}
                  dark={dark}
                  onJumpToBook={onJumpToBook}
                />
              ))}
            </div>
          </>
        ) : (
          <StubBookSheet book={book} dark={dark} onJumpToBook={onJumpToBook} />
        )}
      </div>

      {/* Running footer with page number */}
      <footer className="flex shrink-0 items-center justify-between border-t border-current/10 px-6 py-2 font-sans-ui text-[11px] opacity-65">
        <span>
          Conventions: {book.conventions.units}
          {book.conventions.metricSignature ? ` · (${book.conventions.metricSignature})` : ''}
        </span>
        <span className="font-mono-code font-semibold">
          Page {pageData?.pageNumber ?? 1} / {book.pages?.length ?? 1}
        </span>
      </footer>
    </article>
  );
};

export const ReaderOverlay: React.FC = () => {
  const {
    bookMachine,
    viewMode,
    bookmarks,
    settings,
    activeGlossaryTermId,
    setPage,
    closeBook,
    toggleBookmark,
    updateSettings,
    setSearchOpen,
    setActiveGlossaryTermId,
    requestFastTravel,
    selectBook,
  } = usePhysicaStore();

  const [tocOpen, setTocOpen] = useState(false);
  const [turnDirection, setTurnDirection] = useState<'next' | 'prev' | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [wideViewport, setWideViewport] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1120 : true
  );

  useEffect(() => {
    const onResize = () => setWideViewport(window.innerWidth >= 1120);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isReading = bookMachine.phase === 'reading';
  const book = isReading ? BOOKS_BY_ID[bookMachine.bookId] : null;
  const currentPage = isReading ? bookMachine.page : 1;

  const isTwoPageSpread =
    Boolean(book?.status === 'published' && wideViewport && settings.textSize !== 'lg');
  const stepSize = isTwoPageSpread ? 2 : 1;

  // Align left page to odd number in spread mode (1-2, 3-4, 5-6, ...)
  const leftPageNum = isTwoPageSpread
    ? currentPage % 2 === 1
      ? currentPage
      : currentPage - 1
    : currentPage;

  const totalPages = book?.pages?.length ?? 1;

  const goDelta = (delta: number) => {
    if (!book) return;
    const next = Math.max(1, Math.min(totalPages, leftPageNum + delta));
    if (next !== currentPage) {
      if (!settings.reducedMotion) {
        setTurnDirection(delta > 0 ? 'next' : 'prev');
      }
      setPage(next);
    }
  };

  // Keyboard navigation inside reader
  useEffect(() => {
    if (!isReading || !book) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        if (activeGlossaryTermId) setActiveGlossaryTermId(null);
        else if (tocOpen) setTocOpen(false);
        else closeBook(false);
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goDelta(stepSize);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goDelta(-stepSize);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (!isReading || !book) return null;

  const dark = settings.readerTheme === 'dark';
  const fontSizeClass =
    settings.textSize === 'sm'
      ? 'text-[14.5px]'
      : settings.textSize === 'lg'
        ? 'text-[18.5px]'
        : 'text-[16px]';

  const bookBookmarks = bookmarks[book.id] ?? [];
  const leftPageData = book.pages ? book.pages[leftPageNum - 1] ?? null : null;
  const rightPageData =
    isTwoPageSpread && book.pages && leftPageNum + 1 <= totalPages
      ? book.pages[leftPageNum] ?? null
      : null;

  const handleJumpToBook = (targetId: string) => {
    if (viewMode === 'catalog') {
      selectBook(targetId, 1, true);
    } else {
      closeBook(false);
      setTimeout(() => {
        requestFastTravel({
          kind: 'book',
          bookId: targetId,
          openOnArrival: true,
          targetPage: 1,
        });
      }, 220);
    }
  };

  const chaptersList = book.pages
    ? book.pages.filter((p, idx, arr) => idx === 0 || p.chapterTitle !== arr[idx - 1].chapterTitle)
    : [];

  const glossaryEntry = activeGlossaryTermId ? GLOSSARY_BY_ID[activeGlossaryTermId] : null;

  const curlClass =
    settings.reducedMotion || !turnDirection
      ? ''
      : turnDirection === 'next'
        ? 'page-curl-enter-next'
        : 'page-curl-enter-prev';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Reading ${book.title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBook(false);
      }}
      onTouchStart={(e) => setTouchStartX(e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (touchStartX === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
        if (Math.abs(dx) > 55) {
          goDelta(dx < 0 ? stepSize : -stepSize);
        }
        setTouchStartX(null);
      }}
      className="fixed inset-0 z-40 flex flex-col items-center justify-between bg-stone-950/72 p-2 backdrop-blur-md transition-opacity duration-200 sm:p-4"
    >
      {/* Top Reader Controls Bar */}
      <div className="flex w-full max-w-6xl items-center justify-between gap-2 rounded-xl border border-stone-700/80 bg-stone-900/95 px-3 py-2 text-xs text-stone-100 shadow-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTocOpen((o) => !o)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800 px-2.5 py-1.5 font-medium hover:bg-stone-700"
          >
            <List className="h-3.5 w-3.5 text-amber-400" />
            <span>Contents</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800 px-2.5 py-1.5 hover:bg-stone-700"
          >
            <Search className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Search</span>
          </button>

          {bookBookmarks.length > 0 && (
            <div className="hidden items-center gap-1 md:flex">
              <span className="text-[11px] opacity-65">Ribbons:</span>
              {bookBookmarks.map((bPage) => (
                <button
                  key={bPage}
                  type="button"
                  onClick={() => setPage(bPage)}
                  className="rounded bg-red-800/80 px-1.5 py-0.5 font-mono-code text-[10.5px] text-amber-100 hover:bg-red-700"
                >
                  p.{bPage}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center Typography & Theme Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center rounded-lg border border-stone-700 bg-stone-800 p-0.5">
            {(['sm', 'md', 'lg'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => updateSettings({ textSize: sz })}
                className={`rounded px-2 py-0.5 font-serif-book ${
                  settings.textSize === sz
                    ? 'bg-amber-600 text-white'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {sz === 'sm' ? 'A−' : sz === 'md' ? 'A' : 'A+'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              updateSettings({ readerTheme: dark ? 'paper' : 'dark' })
            }
            aria-label="Toggle paper or dark page theme"
            className="inline-flex items-center gap-1 rounded-lg border border-stone-700 bg-stone-800 px-2.5 py-1.5 hover:bg-stone-700"
          >
            {dark ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{dark ? 'Paper' : 'Dark'}</span>
          </button>
        </div>

        {/* Right: Leave on Table & Return to Shelf */}
        <div className="flex items-center gap-1.5">
          {viewMode === '3d' && (
            <button
              type="button"
              onClick={() => closeBook(true)}
              className="hidden rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-amber-300 hover:bg-amber-500/20 lg:inline-flex"
              title="Leave open on this wing's reading table"
            >
              Leave on Table
            </button>
          )}
          <button
            type="button"
            onClick={() => closeBook(false)}
            className="inline-flex items-center gap-1 rounded-lg bg-stone-800 px-2.5 py-1.5 font-medium hover:bg-red-900/70"
          >
            <X className="h-3.5 w-3.5" />
            <span>{viewMode === '3d' ? 'Return to Shelf' : 'Close'}</span>
          </button>
        </div>
      </div>

      {/* Main Spread Container */}
      <div className="spread-perspective relative my-2 flex min-h-0 w-full max-w-6xl flex-1 items-stretch justify-center gap-1">
        {/* Previous Page Button */}
        <button
          type="button"
          disabled={leftPageNum <= 1}
          onClick={() => goDelta(-stepSize)}
          aria-label="Previous page"
          className="z-20 my-auto flex h-14 w-9 shrink-0 items-center justify-center rounded-l-xl border border-stone-700 bg-stone-900/90 text-stone-200 transition hover:bg-amber-600 hover:text-white disabled:opacity-25"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Open Book Spread with Spine Shadow */}
        <div
          key={`${book.id}-${leftPageNum}`}
          onAnimationEnd={() => setTurnDirection(null)}
          className={`relative grid h-full min-h-0 flex-1 rounded-lg p-1.5 shadow-2xl ${
            dark ? 'bg-stone-950' : 'bg-[#3d291a]'
          } ${isTwoPageSpread ? 'grid-cols-2 gap-1.5' : 'max-w-2xl grid-cols-1'} ${curlClass}`}
        >
          <SinglePageSheet
            book={book}
            pageData={leftPageData}
            dark={dark}
            fontSizeClass={fontSizeClass}
            isBookmarked={bookBookmarks.includes(leftPageNum)}
            onToggleBookmark={() => toggleBookmark(book.id, leftPageNum)}
            onJumpToBook={handleJumpToBook}
          />

          {isTwoPageSpread && (
            <SinglePageSheet
              book={book}
              pageData={rightPageData}
              dark={dark}
              fontSizeClass={fontSizeClass}
              isBookmarked={bookBookmarks.includes(leftPageNum + 1)}
              onToggleBookmark={() => toggleBookmark(book.id, leftPageNum + 1)}
              onJumpToBook={handleJumpToBook}
            />
          )}

          {/* Center leather binding crease in two-page mode */}
          {isTwoPageSpread && (
            <div className="pointer-events-none absolute inset-y-2 left-1/2 w-5 -translate-x-1/2 bg-gradient-to-r from-black/25 via-black/45 to-black/25 opacity-60" />
          )}
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          disabled={leftPageNum + stepSize > totalPages}
          onClick={() => goDelta(stepSize)}
          aria-label="Next page"
          className="z-20 my-auto flex h-14 w-9 shrink-0 items-center justify-center rounded-r-xl border border-stone-700 bg-stone-900/90 text-stone-200 transition hover:bg-amber-600 hover:text-white disabled:opacity-25"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Slide-out Table of Contents Drawer */}
        {tocOpen && (
          <aside className="absolute inset-y-2 left-11 z-30 w-72 overflow-y-auto rounded-xl border border-stone-700 bg-stone-900/98 p-4 text-stone-100 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-amber-400">
                <BookOpen className="h-3.5 w-3.5" /> Table of Contents
              </span>
              <button
                type="button"
                onClick={() => setTocOpen(false)}
                className="rounded p-1 hover:bg-stone-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {chaptersList.length > 0 ? (
              <ul className="space-y-1.5 text-xs">
                {chaptersList.map((ch) => (
                  <li key={ch.pageNumber}>
                    <button
                      type="button"
                      onClick={() => {
                        setPage(ch.pageNumber);
                        setTocOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition ${
                        currentPage === ch.pageNumber
                          ? 'bg-amber-600 text-white'
                          : 'hover:bg-stone-800'
                      }`}
                    >
                      <span className="pr-2 font-medium">{ch.chapterTitle}</span>
                      <span className="font-mono-code opacity-75">p.{ch.pageNumber}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs opacity-75">Stub syllabus shown on Page 1.</p>
            )}
          </aside>
        )}

        {/* Glossary Term Definition Card */}
        {glossaryEntry && (
          <aside className="absolute right-12 bottom-4 z-30 w-80 rounded-xl border border-amber-500/40 bg-stone-900/98 p-4 text-xs text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">{glossaryEntry.term}</span>
              <button
                type="button"
                onClick={() => setActiveGlossaryTermId(null)}
                className="rounded p-0.5 hover:bg-stone-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1.5 leading-relaxed text-stone-300">{glossaryEntry.definition}</p>
            {glossaryEntry.formulaTex && (
              <div
                className="mt-2 overflow-x-auto rounded bg-stone-950 p-2"
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(glossaryEntry.formulaTex, {
                    throwOnError: false,
                  }),
                }}
              />
            )}
            {glossaryEntry.owningBookId !== book.id && (
              <button
                type="button"
                onClick={() => {
                  setActiveGlossaryTermId(null);
                  handleJumpToBook(glossaryEntry.owningBookId);
                }}
                className="mt-2.5 inline-flex items-center gap-1 text-amber-400 underline hover:text-amber-300"
              >
                Open primary monograph <Compass className="h-3 w-3" />
              </button>
            )}
          </aside>
        )}
      </div>

      {/* Bottom Scrub Progress Bar */}
      <div className="flex w-full max-w-6xl items-center gap-3 rounded-xl border border-stone-800 bg-stone-900/90 px-4 py-1.5 text-[11px] text-stone-300">
        <span className="shrink-0 font-mono-code">
          {isTwoPageSpread && rightPageData
            ? `Spread pp. ${leftPageNum}–${leftPageNum + 1} of ${totalPages}`
            : `Page ${leftPageNum} of ${totalPages}`}
        </span>
        <input
          type="range"
          min={1}
          max={totalPages}
          step={1}
          value={leftPageNum}
          aria-label="Jump to page"
          onChange={(e) => setPage(parseInt(e.target.value, 10))}
          className="h-1.5 flex-1 cursor-pointer accent-amber-500"
        />
        <span className="hidden opacity-70 sm:inline">
          ← / → keys or outer arrows to flip · Esc to return
        </span>
      </div>
    </div>
  );
};
