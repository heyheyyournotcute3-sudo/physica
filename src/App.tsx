import React, { useEffect, useState } from 'react';
import { ReaderOverlay } from '@/reader/ReaderOverlay';
import { usePhysicaStore } from '@/state/store';
import { CatalogView } from '@/ui/CatalogView';
import { HudAndModals } from '@/ui/HudAndModals';
import { WorldErrorBoundary } from '@/ui/WorldErrorBoundary';
import { LibraryCanvas } from '@/world/LibraryCanvas';

function detectWebGL2(): boolean {
  if (typeof document === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

export function App(): React.ReactElement {
  const { viewMode, setViewMode, syncFromUrl } = usePhysicaStore();
  const [webglSupported] = useState<boolean>(() => detectWebGL2());

  useEffect(() => {
    if (!webglSupported) {
      setViewMode('catalog');
    }
    syncFromUrl();
    const onHashChange = () => syncFromUrl();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [webglSupported, setViewMode, syncFromUrl]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-stone-950 text-stone-100">
      {!webglSupported && (
        <div
          role="status"
          className="fixed top-16 left-1/2 z-40 -translate-x-1/2 rounded-full border border-amber-500/40 bg-stone-900/95 px-4 py-1 text-xs text-amber-200 shadow-lg"
        >
          WebGL2 unavailable on this device — opened in full 2D Scholarly Catalog Mode.
        </div>
      )}

      <HudAndModals />

      {viewMode === '3d' && webglSupported ? (
        <WorldErrorBoundary>
          <LibraryCanvas />
        </WorldErrorBoundary>
      ) : (
        <CatalogView />
      )}

      <ReaderOverlay />
    </div>
  );
}

export default App;
