import { create } from 'zustand';
import { BOOKS_BY_ID } from '@/content';
import type { BookMachinePhase, WingId } from '@/lib/schema';
import { soundEngine } from '@/world/audio/soundEngine';

export interface ReaderSettings {
  textSize: 'sm' | 'md' | 'lg';
  readerTheme: 'paper' | 'dark';
  reducedMotion: boolean;
  autoplayMotion: boolean;
  quality: 'low' | 'medium' | 'high';
  fov: number; // 60..90
  dayNight: 'night' | 'day';
  audioMuted: boolean;
  audioVolume: number;
  comfortVignette: boolean;
}

export interface FastTravelRequest {
  kind: 'rotunda' | 'wing' | 'book';
  wingId?: WingId;
  bookId?: string;
  openOnArrival?: boolean;
  targetPage?: number;
  nonce: number;
}

export interface ScreenRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface PersistedData {
  bookmarks: Record<string, number[]>;
  readingProgress: Record<string, number>;
  settings: Partial<ReaderSettings>;
  tableBooks: Partial<Record<WingId, string>>;
}

const STORAGE_KEY = 'physica_v1_state';

function loadPersisted(): PersistedData {
  if (typeof window === 'undefined') {
    return { bookmarks: {}, readingProgress: {}, settings: {}, tableBooks: {} };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { bookmarks: {}, readingProgress: {}, settings: {}, tableBooks: {} };
    return JSON.parse(raw) as PersistedData;
  } catch {
    return { bookmarks: {}, readingProgress: {}, settings: {}, tableBooks: {} };
  }
}

function savePersisted(data: PersistedData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota issues
  }
}

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const initialPersisted = loadPersisted();

export interface PhysicaStore {
  viewMode: '3d' | 'catalog';
  navMode: 'explore' | 'first-person';
  currentLocation: WingId | 'rotunda';
  bookMachine: BookMachinePhase;
  hoveredScreenPos: { x: number; y: number } | null;
  projectedBookRect: ScreenRect | null;
  fastTravel: FastTravelRequest | null;
  bookmarks: Record<string, number[]>;
  readingProgress: Record<string, number>;
  tableBooks: Partial<Record<WingId, string>>;
  settings: ReaderSettings;
  fps: number;
  isMapOpen: boolean;
  isSearchOpen: boolean;
  isSettingsOpen: boolean;
  activeGlossaryTermId: string | null;

  // Actions
  setViewMode: (mode: '3d' | 'catalog') => void;
  setNavMode: (mode: 'explore' | 'first-person') => void;
  setCurrentLocation: (loc: WingId | 'rotunda') => void;
  hoverBook: (bookId: string | null, screenPos?: { x: number; y: number } | null) => void;
  selectBook: (bookId: string, page?: number, immediate?: boolean) => void;
  advancePullToOpen: () => void;
  completeOpenHandoff: (rect?: ScreenRect | null) => void;
  setPage: (page: number) => void;
  closeBook: (leaveOnTable?: boolean) => void;
  finishCloseBook: () => void;
  requestFastTravel: (req: Omit<FastTravelRequest, 'nonce'>) => void;
  toggleBookmark: (bookId: string, page: number) => void;
  updateSettings: (patch: Partial<ReaderSettings>) => void;
  setFps: (fps: number) => void;
  setMapOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setActiveGlossaryTermId: (termId: string | null) => void;
  syncFromUrl: () => void;
}

function writeHashRoute(route: string): void {
  if (typeof window === 'undefined') return;
  const target = `#${route}`;
  if (window.location.hash !== target) {
    window.history.replaceState(null, '', target);
  }
}

export const usePhysicaStore = create<PhysicaStore>((set, get) => {
  const defaultSettings: ReaderSettings = {
    textSize: 'md',
    readerTheme: 'paper',
    reducedMotion: prefersReducedMotion,
    autoplayMotion: !prefersReducedMotion,
    quality: 'high',
    fov: 68,
    dayNight: 'night',
    audioMuted: true,
    audioVolume: 0.35,
    comfortVignette: false,
    ...initialPersisted.settings,
  };

  soundEngine.setConfig(defaultSettings.audioMuted, defaultSettings.audioVolume);

  const persistSnapshot = () => {
    const s = get();
    savePersisted({
      bookmarks: s.bookmarks,
      readingProgress: s.readingProgress,
      settings: s.settings,
      tableBooks: s.tableBooks,
    });
  };

  return {
    viewMode: '3d',
    navMode: 'explore',
    currentLocation: 'rotunda',
    bookMachine: { phase: 'idle' },
    hoveredScreenPos: null,
    projectedBookRect: null,
    fastTravel: null,
    bookmarks: initialPersisted.bookmarks ?? {},
    readingProgress: initialPersisted.readingProgress ?? {},
    tableBooks: initialPersisted.tableBooks ?? {
      mechanics: 'lagrangian-mechanics',
      quantum: 'wavefunction-and-its-evolution',
    },
    settings: defaultSettings,
    fps: 60,
    isMapOpen: false,
    isSearchOpen: false,
    isSettingsOpen: false,
    activeGlossaryTermId: null,

    setViewMode: (mode) => {
      set({ viewMode: mode });
      const bm = get().bookMachine;
      if (bm.phase === 'reading') {
        writeHashRoute(`/book/${bm.bookId}/${bm.page}`);
      } else if (mode === 'catalog') {
        writeHashRoute('/catalog');
      } else {
        writeHashRoute('/');
      }
    },

    setNavMode: (mode) => set({ navMode: mode }),

    setCurrentLocation: (loc) => set({ currentLocation: loc }),

    hoverBook: (bookId, screenPos = null) => {
      const curr = get().bookMachine;
      if (curr.phase !== 'idle' && curr.phase !== 'hovered') return;
      if (!bookId) {
        if (curr.phase === 'hovered') {
          set({ bookMachine: { phase: 'idle' }, hoveredScreenPos: null });
        }
        return;
      }
      if (curr.phase !== 'hovered' || curr.bookId !== bookId) {
        soundEngine.playHoverTick();
      }
      set({
        bookMachine: { phase: 'hovered', bookId },
        hoveredScreenPos: screenPos,
      });
    },

    selectBook: (bookId, page = 1, immediate = false) => {
      const book = BOOKS_BY_ID[bookId];
      if (!book) return;
      const totalPages = book.pages?.length ?? 1;
      const clampedPage = Math.max(1, Math.min(totalPages, page));
      const { viewMode, settings, readingProgress } = get();
      soundEngine.playBookSlide();

      const updatedProgress = {
        ...readingProgress,
        [bookId]: Math.max(readingProgress[bookId] ?? 0, clampedPage),
      };

      if (viewMode === 'catalog' || immediate || settings.reducedMotion) {
        set({
          bookMachine: { phase: 'reading', bookId, page: clampedPage },
          hoveredScreenPos: null,
          readingProgress: updatedProgress,
          isSearchOpen: false,
          isMapOpen: false,
        });
        writeHashRoute(`/book/${bookId}/${clampedPage}`);
        persistSnapshot();
        return;
      }

      set({
        bookMachine: { phase: 'pulling', bookId, targetPage: clampedPage },
        hoveredScreenPos: null,
        readingProgress: updatedProgress,
        isSearchOpen: false,
        isMapOpen: false,
      });
      writeHashRoute(`/book/${bookId}/${clampedPage}`);
      persistSnapshot();
    },

    advancePullToOpen: () => {
      const bm = get().bookMachine;
      if (bm.phase !== 'pulling') return;
      set({
        bookMachine: {
          phase: 'opening',
          bookId: bm.bookId,
          targetPage: bm.targetPage,
        },
      });
    },

    completeOpenHandoff: (rect = null) => {
      const bm = get().bookMachine;
      if (bm.phase !== 'opening' && bm.phase !== 'pulling') return;
      set({
        bookMachine: {
          phase: 'reading',
          bookId: bm.bookId,
          page: bm.targetPage,
        },
        projectedBookRect: rect,
      });
    },

    setPage: (page) => {
      const bm = get().bookMachine;
      if (bm.phase !== 'reading') return;
      const book = BOOKS_BY_ID[bm.bookId];
      const maxPage = book?.pages?.length ?? 1;
      const clamped = Math.max(1, Math.min(maxPage, page));
      if (clamped === bm.page) return;
      soundEngine.playPageRustle();
      const prevProg = get().readingProgress;
      set({
        bookMachine: { phase: 'reading', bookId: bm.bookId, page: clamped },
        readingProgress: {
          ...prevProg,
          [bm.bookId]: Math.max(prevProg[bm.bookId] ?? 0, clamped),
        },
      });
      writeHashRoute(`/book/${bm.bookId}/${clamped}`);
      persistSnapshot();
    },

    closeBook: (leaveOnTable = false) => {
      const bm = get().bookMachine;
      if (bm.phase === 'idle' || bm.phase === 'hovered') return;
      const book = BOOKS_BY_ID[bm.bookId];
      soundEngine.playBookSlide();

      if (leaveOnTable && book) {
        set((s) => ({
          tableBooks: { ...s.tableBooks, [book.wing]: book.id },
        }));
      }

      const { viewMode, settings } = get();
      if (viewMode === 'catalog' || settings.reducedMotion) {
        set({
          bookMachine: { phase: 'idle' },
          activeGlossaryTermId: null,
        });
        writeHashRoute(viewMode === 'catalog' ? '/catalog' : '/');
        persistSnapshot();
        return;
      }

      set({
        bookMachine: { phase: 'closing', bookId: bm.bookId },
        activeGlossaryTermId: null,
      });
      writeHashRoute('/');
      persistSnapshot();
    },

    finishCloseBook: () => {
      const bm = get().bookMachine;
      if (bm.phase === 'closing') {
        set({ bookMachine: { phase: 'idle' } });
      }
    },

    requestFastTravel: (req) => {
      set({
        fastTravel: { ...req, nonce: Date.now() + Math.random() },
        isMapOpen: false,
        isSearchOpen: false,
      });
    },

    toggleBookmark: (bookId, page) => {
      const existing = get().bookmarks[bookId] ?? [];
      const next = existing.includes(page)
        ? existing.filter((p) => p !== page)
        : [...existing, page].sort((a, b) => a - b);
      set((s) => ({
        bookmarks: { ...s.bookmarks, [bookId]: next },
      }));
      persistSnapshot();
    },

    updateSettings: (patch) => {
      set((s) => {
        const merged = { ...s.settings, ...patch };
        soundEngine.setConfig(merged.audioMuted, merged.audioVolume);
        return { settings: merged };
      });
      persistSnapshot();
    },

    setFps: (fps) => set({ fps }),
    setMapOpen: (open) => set({ isMapOpen: open }),
    setSearchOpen: (open) => set({ isSearchOpen: open }),
    setSettingsOpen: (open) => set({ isSettingsOpen: open }),
    setActiveGlossaryTermId: (termId) => set({ activeGlossaryTermId: termId }),

    syncFromUrl: () => {
      if (typeof window === 'undefined') return;
      const rawHash = window.location.hash.replace(/^#/, '');
      const pathSource = rawHash || window.location.pathname;

      if (pathSource.startsWith('/catalog')) {
        set({ viewMode: 'catalog', bookMachine: { phase: 'idle' } });
        return;
      }

      const match = pathSource.match(/^\/book\/([a-z0-9-]+)(?:\/(\d+))?/i);
      if (match) {
        const bookId = match[1];
        const pageNum = match[2] ? parseInt(match[2], 10) : 1;
        if (BOOKS_BY_ID[bookId]) {
          // Deep link: position camera at book shelf and open directly at target page!
          get().requestFastTravel({
            kind: 'book',
            bookId,
            openOnArrival: false,
            targetPage: pageNum,
          });
          get().selectBook(bookId, pageNum, true);
        }
      }
    },
  };
});
