import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Clock,
  Compass,
  Crosshair,
  LayoutList,
  Map as MapIcon,
  MousePointer,
  Search,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { ALL_BOOKS, BOOKS_BY_ID, librarySearch, WINGS } from '@/content';
import { WING_PALETTES } from '@/lib/colour';
import { usePhysicaStore } from '@/state/store';

export const HudAndModals: React.FC = () => {
  const {
    viewMode,
    navMode,
    currentLocation,
    bookMachine,
    hoveredScreenPos,
    fps,
    settings,
    isMapOpen,
    isSearchOpen,
    isSettingsOpen,
    setViewMode,
    setNavMode,
    selectBook,
    requestFastTravel,
    updateSettings,
    setMapOpen,
    setSearchOpen,
    setSettingsOpen,
  } = usePhysicaStore();

  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 30);
    }
  }, [isSearchOpen]);

  const searchResults = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return ALL_BOOKS.filter((b) => b.status === 'published').map((b) => ({
        id: `${b.id}::1`,
        bookId: b.id,
        pageNumber: 1,
        wing: b.wing,
        status: b.status,
        title: b.title,
        subtitle: b.subtitle,
      }));
    }
    return librarySearch.search(trimmed).slice(0, 18) as unknown as Array<{
      id: string;
      bookId: string;
      pageNumber: number;
      wing: keyof typeof WING_PALETTES;
      status: 'published' | 'stub';
      title: string;
      subtitle: string;
    }>;
  }, [query]);

  const activeWingMeta =
    currentLocation === 'rotunda'
      ? null
      : WINGS.find((w) => w.id === currentLocation) ?? null;

  const hoveredBook =
    bookMachine.phase === 'hovered' ? BOOKS_BY_ID[bookMachine.bookId] : null;

  const isReading = bookMachine.phase === 'reading';

  return (
    <>
      {/* Accessible Skip Link */}
      <button
        type="button"
        onClick={() => setViewMode('catalog')}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-amber-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip 3D World — Browse Accessible 2D Catalog
      </button>

      {/* Top Floating HUD */}
      {!isReading && (
        <header className="pointer-events-none fixed top-3 right-3 left-3 z-30 flex flex-wrap items-center justify-between gap-2">
          {/* Brand + Current Location */}
          <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-stone-700/80 bg-stone-950/88 px-3.5 py-2 shadow-xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                if (viewMode === 'catalog') setViewMode('3d');
                else requestFastTravel({ kind: 'rotunda' });
              }}
              className="flex items-center gap-2 text-left"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600 font-serif-book text-base font-bold text-white">
                Φ
              </span>
              <div>
                <div className="font-serif-book text-sm font-bold tracking-wide text-stone-100">
                  PHYSICA
                </div>
                <div className="text-[10.5px] text-amber-300/90">
                  {viewMode === 'catalog'
                    ? '2D Scholarly Catalog · 60 Volumes'
                    : activeWingMeta
                      ? `Wing ${activeWingMeta.roman} · ${activeWingMeta.shortName}`
                      : 'Central Rotunda · Foucault Hall'}
                </div>
              </div>
            </button>
          </div>

          {/* Primary Action Controls */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-xl border border-stone-700/80 bg-stone-950/88 p-1.5 text-xs text-stone-200 shadow-xl backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === '3d' ? 'catalog' : '3d')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition ${
                viewMode === 'catalog'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-800/90 hover:bg-stone-700'
              }`}
            >
              {viewMode === '3d' ? (
                <>
                  <LayoutList className="h-3.5 w-3.5 text-amber-400" />
                  <span>Browse as List</span>
                </>
              ) : (
                <>
                  <Compass className="h-3.5 w-3.5" />
                  <span>Enter 3D Library</span>
                </>
              )}
            </button>

            {viewMode === '3d' && (
              <>
                <button
                  type="button"
                  onClick={() => setMapOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800/90 px-2.5 py-1.5 hover:bg-stone-700"
                  title="Fast-travel floor plan (M)"
                >
                  <MapIcon className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Map (M)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setNavMode(navMode === 'explore' ? 'first-person' : 'explore')
                  }
                  className="hidden items-center gap-1.5 rounded-lg bg-stone-800/90 px-2.5 py-1.5 hover:bg-stone-700 md:inline-flex"
                  title="Switch between free-cursor Explore mode and Pointer-Lock First-Person mode"
                >
                  {navMode === 'explore' ? (
                    <>
                      <MousePointer className="h-3.5 w-3.5 text-amber-400" />
                      <span>Explore</span>
                    </>
                  ) : (
                    <>
                      <Crosshair className="h-3.5 w-3.5 text-amber-400" />
                      <span>First-Person</span>
                    </>
                  )}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800/90 px-2.5 py-1.5 hover:bg-stone-700"
              title="Search books, chapters, and equations (/)"
            >
              <Search className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              type="button"
              onClick={() => updateSettings({ audioMuted: !settings.audioMuted })}
              aria-label={settings.audioMuted ? 'Enable library acoustics' : 'Mute library acoustics'}
              className="inline-flex items-center justify-center rounded-lg bg-stone-800/90 p-1.5 hover:bg-stone-700"
              title={settings.audioMuted ? 'Enable subtle sound effects' : 'Mute sound'}
            >
              {settings.audioMuted ? (
                <VolumeX className="h-3.5 w-3.5 opacity-70" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-amber-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Library & comfort settings"
              className="inline-flex items-center justify-center rounded-lg bg-stone-800/90 p-1.5 hover:bg-stone-700"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>

            {viewMode === '3d' && (
              <span className="hidden rounded bg-stone-900 px-2 py-1 font-mono-code text-[10.5px] text-emerald-400 lg:inline">
                {fps} FPS
              </span>
            )}
          </div>
        </header>
      )}

      {/* Hovered 3D Spine Tooltip */}
      {viewMode === '3d' && hoveredBook && (
        <div
          style={{
            left: Math.min(
              (typeof window !== 'undefined' ? window.innerWidth : 1200) - 330,
              Math.max(16, (hoveredScreenPos?.x ?? 480) + 20)
            ),
            top: Math.min(
              (typeof window !== 'undefined' ? window.innerHeight : 800) - 230,
              Math.max(68, (hoveredScreenPos?.y ?? 300) - 40)
            ),
          }}
          className="pointer-events-none fixed z-30 w-80 rounded-xl border border-stone-600/80 bg-stone-950/95 p-3.5 text-stone-100 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center justify-between gap-2 text-[10.5px] font-semibold tracking-wider uppercase">
            <span style={{ color: WING_PALETTES[hoveredBook.wing].accent }}>
              {hoveredBook.wing}
            </span>
            {hoveredBook.status === 'published' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300">
                <Sparkles className="h-2.5 w-2.5" /> Flagship Interactive
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-300">
                Coming Soon
              </span>
            )}
          </div>

          <h3 className="mt-1 font-serif-book text-base font-bold leading-snug">
            {hoveredBook.title}
          </h3>
          <p className="mt-0.5 text-xs text-stone-300">{hoveredBook.subtitle}</p>

          <div className="mt-2.5 flex items-center gap-3 text-[11px] text-stone-300">
            <span>
              Difficulty:{' '}
              <strong className="text-amber-400">
                {'★'.repeat(hoveredBook.difficulty)}
                {'☆'.repeat(5 - hoveredBook.difficulty)}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 opacity-70" /> {hoveredBook.readingMinutes} min
            </span>
          </div>

          {hoveredBook.prerequisites.length > 0 && (
            <div className="mt-1.5 text-[11px] text-stone-400">
              Prerequisites:{' '}
              {hoveredBook.prerequisites
                .map((id) => BOOKS_BY_ID[id]?.title ?? id)
                .join(', ')}
            </div>
          )}

          <div className="mt-2.5 border-t border-stone-800 pt-1.5 text-[10.5px] font-medium text-amber-300">
            Click spine or press Enter to pull book off shelf
          </div>
        </div>
      )}

      {/* Bottom Navigation Quick Bar in 3D World */}
      {viewMode === '3d' && !isReading && (
        <div className="pointer-events-none fixed right-3 bottom-3 left-3 z-20 flex flex-col items-center gap-1.5">
          {/* Quick Wing Jump Pills */}
          <div className="pointer-events-auto hidden flex-wrap items-center justify-center gap-1 rounded-full border border-stone-700/75 bg-stone-950/85 px-2.5 py-1 text-[11px] shadow-xl backdrop-blur sm:flex">
            <button
              type="button"
              onClick={() => requestFastTravel({ kind: 'rotunda' })}
              className={`rounded-full px-2.5 py-0.5 transition ${
                currentLocation === 'rotunda'
                  ? 'bg-amber-600 font-semibold text-white'
                  : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              Rotunda
            </button>
            {WINGS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => requestFastTravel({ kind: 'wing', wingId: w.id })}
                className={`rounded-full px-2.5 py-0.5 transition ${
                  currentLocation === w.id
                    ? 'bg-amber-600 font-semibold text-white'
                    : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                {w.roman} · {w.shortName}
              </button>
            ))}
          </div>

          <div className="rounded-full bg-stone-950/75 px-3 py-1 text-[11px] text-stone-300 backdrop-blur">
            WASD / Click floor to walk · Drag to look · Scroll to step · Hover & Click book (or Tab + Enter) to read
          </div>
        </div>
      )}

      {/* Fast-Travel Architectural Floor Plan Modal (M) */}
      {isMapOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Library Floor Plan & Fast Travel"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMapOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-stone-700 bg-stone-900 p-5 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h2 className="font-serif-book text-lg font-bold">
                  Architectural Floor Plan & Fast Travel
                </h2>
                <p className="text-xs text-stone-400">
                  Select any wing or flagship monograph to glide directly to its shelf.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMapOpen(false)}
                className="rounded-lg p-1.5 hover:bg-stone-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Radial SVG Schematic of Rotunda + 6 Wings */}
            <div className="my-4 flex justify-center">
              <svg viewBox="-210 -210 420 420" className="h-68 w-68 sm:h-76 sm:w-76">
                {WINGS.map((w) => {
                  const rad = (w.angleDeg * Math.PI) / 180;
                  const x1 = Math.sin(rad) * 58;
                  const y1 = -Math.cos(rad) * 58;
                  const x2 = Math.sin(rad) * 165;
                  const y2 = -Math.cos(rad) * 165;
                  const pal = WING_PALETTES[w.id];
                  return (
                    <g
                      key={w.id}
                      onClick={() => requestFastTravel({ kind: 'wing', wingId: w.id })}
                      className="cursor-pointer opacity-90 hover:opacity-100"
                    >
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={pal.accent}
                        strokeWidth={26}
                        strokeLinecap="round"
                        strokeOpacity={0.28}
                      />
                      <circle cx={x2} cy={y2} r={22} fill="#1c1917" stroke={pal.accent} strokeWidth={2} />
                      <text
                        x={x2}
                        y={y2 - 2}
                        textAnchor="middle"
                        fill={pal.accent}
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {w.roman}
                      </text>
                      <text
                        x={x2}
                        y={y2 + 9}
                        textAnchor="middle"
                        fill="#f5f5f4"
                        fontSize="7.5"
                      >
                        {w.shortName}
                      </text>
                    </g>
                  );
                })}
                <g
                  onClick={() => requestFastTravel({ kind: 'rotunda' })}
                  className="cursor-pointer"
                >
                  <circle cx={0} cy={0} r={52} fill="#292524" stroke="#d97706" strokeWidth={2.5} />
                  <text x={0} y={-4} textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">
                    ROTUNDA
                  </text>
                  <text x={0} y={11} textAnchor="middle" fill="#d6d3d1" fontSize="8">
                    Foucault Pendulum
                  </text>
                </g>
              </svg>
            </div>

            <h3 className="mb-2 text-xs font-bold tracking-wider uppercase text-amber-400">
              Jump & Open Flagship Monographs (12)
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {ALL_BOOKS.filter((b) => b.status === 'published').map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() =>
                    requestFastTravel({
                      kind: 'book',
                      bookId: b.id,
                      openOnArrival: true,
                      targetPage: 1,
                    })
                  }
                  className="flex items-center justify-between gap-2 rounded-xl border border-stone-800 bg-stone-950/80 px-3 py-2 text-left text-xs transition hover:border-amber-500/70"
                >
                  <div>
                    <div className="font-semibold text-stone-100">{b.title}</div>
                    <div className="text-[10.5px] text-stone-400">
                      {b.wing.toUpperCase()} · {'★'.repeat(b.difficulty)}
                    </div>
                  </div>
                  <BookOpen className="h-4 w-4 shrink-0 text-amber-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instant Full-Text Search Modal (/) */}
      {isSearchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search Library"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-4 pt-16 backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-stone-700 bg-stone-900 text-stone-100 shadow-2xl">
            <div className="flex items-center gap-2.5 border-b border-stone-800 px-4 py-3">
              <Search className="h-4 w-4 text-amber-400" />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, Noether, Ising, Schwarzschild, Berry phase, equations..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-stone-500"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded p-1 hover:bg-stone-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="custom-scroll max-h-[60vh] divide-y divide-stone-800/80 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-400">
                  No matching pages or monographs found for “{query}”.
                </div>
              ) : (
                searchResults.map((hit) => (
                  <button
                    key={hit.id}
                    type="button"
                    onClick={() => {
                      selectBook(hit.bookId, hit.pageNumber, true);
                      setSearchOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-xs hover:bg-stone-800/75"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-stone-100">{hit.title}</div>
                      <div className="truncate text-[11px] text-stone-400">{hit.subtitle}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          hit.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-stone-700 text-stone-300'
                        }`}
                      >
                        {hit.status === 'published' ? `p.${hit.pageNumber}` : 'Stub'}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comfort, Accessibility & Graphics Settings Modal */}
      {isSettingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Settings"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSettingsOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl border border-stone-700 bg-stone-900 p-5 text-xs text-stone-100 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-stone-800 pb-2.5">
              <h2 className="font-serif-book text-base font-bold">
                Graphics, Comfort & Accessibility
              </h2>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="rounded p-1 hover:bg-stone-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <span className="mb-1 block font-semibold">3D Render Quality</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['low', 'medium', 'high'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => updateSettings({ quality: q })}
                      className={`rounded-lg border py-1.5 font-medium capitalize ${
                        settings.quality === q
                          ? 'border-amber-500 bg-amber-600 text-white'
                          : 'border-stone-700 bg-stone-800 text-stone-300'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="flex justify-between font-semibold">
                  <span>Field of View (FOV)</span>
                  <span className="font-mono-code">{settings.fov}°</span>
                </span>
                <input
                  type="range"
                  min={60}
                  max={90}
                  step={1}
                  value={settings.fov}
                  onChange={(e) => updateSettings({ fov: parseInt(e.target.value, 10) })}
                  className="mt-1 w-full accent-amber-500"
                />
              </label>

              <div className="flex items-center justify-between">
                <span>Oculus Sky Lighting</span>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      dayNight: settings.dayNight === 'night' ? 'day' : 'night',
                    })
                  }
                  className="rounded-lg border border-stone-700 bg-stone-800 px-3 py-1 capitalize"
                >
                  {settings.dayNight}
                </button>
              </div>

              <label className="flex items-center justify-between">
                <span>Reduced Motion (fades instead of flights/curls)</span>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                  className="h-4 w-4 accent-amber-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <span>Autoplay Motion Graphics on Page Open</span>
                <input
                  type="checkbox"
                  checked={settings.autoplayMotion}
                  onChange={(e) => updateSettings({ autoplayMotion: e.target.checked })}
                  className="h-4 w-4 accent-amber-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <span>Comfort Peripheral Vignette</span>
                <input
                  type="checkbox"
                  checked={settings.comfortVignette}
                  onChange={(e) => updateSettings({ comfortVignette: e.target.checked })}
                  className="h-4 w-4 accent-amber-500"
                />
              </label>

              <label className="block">
                <span className="flex justify-between font-semibold">
                  <span>Sound Volume</span>
                  <span className="font-mono-code">{Math.round(settings.audioVolume * 100)}%</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.audioVolume}
                  onChange={(e) =>
                    updateSettings({
                      audioVolume: parseFloat(e.target.value),
                      audioMuted: false,
                    })
                  }
                  className="mt-1 w-full accent-amber-500"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
