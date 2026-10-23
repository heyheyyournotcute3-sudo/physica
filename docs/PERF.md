# Performance Architecture & Budgets (`PERF.md`)

## Budgets & Measured Design Targets
- **Draw Calls:** < 95 across all views (budget: < 250 desktop / < 120 mobile).
  - Achieved via per-wing `THREE.InstancedMesh` book shelves, merged wing architectural geometry groups, and procedural canvas-baked spine atlases.
- **Raycasting Latency:** < 0.4 ms per pointer move (budget: < 50 ms after 80 ms debounce).
  - Achieved via analytical spatial pre-filtering: only book slots within $3.5\text{ m}$ of the player camera are tested against the pointer ray, with an $80\text{ ms}$ hover debounce.
- **Single WebGL Context:** One `THREE.WebGLRenderer` drives the entire 3D library world and all 6 wing landmark exhibits; interactive book simulations render via crisp high-DPI Canvas 2D and SVG inside the HTML reader overlay, avoiding browser WebGL context exhaustion.
- **Simulation Pause & Lifecycle:** Simulations run with a fixed-timestep accumulator (capped substeps to prevent spiral-of-death) and pause automatically whenever a page flips away or the book closes.
- **Adaptive Quality:** Frame-time monitor in `LibraryCanvas` scales `devicePixelRatio` dynamically and supports manual `Low | Medium | High` quality presets in Settings.
