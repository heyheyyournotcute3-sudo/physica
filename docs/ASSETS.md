# Asset Provenance & Licensing (`ASSETS.md`)

All visual, geometric, shader, texture, and audio assets in **Physica** are procedurally generated in code or sourced under permissive open licenses.

| Asset Category | Source / Generation Method | License |
| --- | --- | --- |
| Rotunda, 6 Wings, Arches, Mezzanines, Spiral Ramps, Shelves, Reading Tables | Procedural `THREE.BufferGeometry` & analytical constructors (`src/world/architecture/`) | Original code (MIT) |
| Book Spines, Emblems, Wood/Slate/Copper/Marble Materials | Procedural Canvas2D high-DPI baked texture atlases (`src/world/shelves/spineAtlas.ts`) | Original code (MIT) |
| Star Dome Oculus, Black Hole Lensing, God Rays, Page Curl | Custom GLSL vertex & fragment shaders (`src/world/`) | Original code (MIT) |
| Room Tone, Hover Tick, Book Pull, Page Rustle Audio | Procedural Web Audio API synthesis with filtered pink/brown noise & resonant chimes (`src/world/audio/soundEngine.ts`) | Original code (MIT) |
| Mathematical Typesetting (`KaTeX`) | `katex` npm package + KaTeX stylesheet | MIT License |
| UI Icons (`lucide-react`) | `lucide-react` npm package | ISC License |
| Body & Display Typography | System scholarly serif (`Source Serif 4`, `Charter`, `Georgia`) & clean UI sans (`Inter`, `system-ui`) | SIL OFL / System |
