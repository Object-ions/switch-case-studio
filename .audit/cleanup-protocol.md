# Legacy Cleanup Protocol — branch `chore/legacy-cleanup`

Started 2026-06-10. Goal: remove traces of removed components, CRA→Vite leftovers,
dead SCSS/assets/deps — accumulated over years of modifications.

**Method:** evidence before deletion. Nothing is removed on filename suspicion;
every removal is backed by an import-graph or reference check, and every phase is
verified (build byte-diff, rendered pixels where relevant) and committed separately
so any single phase can be reverted alone. Every finding + fix is logged here;
generalizable lessons go to `CLAUDE.md` (Rule: instructions that learn).

## Phases

| # | Phase | Status |
|---|-------|--------|
| 0 | Branch + protocol setup | done |
| 1 | Dead SCSS files (unimported → emit no CSS) | in progress |
| 2 | Imported-but-unrendered JS (components/hooks/utils/exports) | pending |
| 3 | Dead selectors inside live SCSS (class ↔ JSX cross-ref) | pending |
| 4 | Unreferenced assets (public/, src/assets, fonts, models) | pending |
| 5 | Unused npm dependencies | pending |
| 6 | Final verification (build diff, route-by-route pixels) + summary | pending |

## Evidence base

- JS reachability: BFS over `import`/`require`/dynamic-`import` specifiers from
  `src/index.js` + `src/routes.js` (script: walk + resolve `.js/.jsx/index.js`).
  Result: **65/65 JS files reachable** — no dead JS *files*; Phase 2 must instead
  check for dead *symbols* (imported but never rendered/called).
- SCSS usage: union of (a) `import '….scss'` from JS, (b) `@import`/`@use` between
  SCSS files. `vite.config.js` has no `additionalData`/auto-injection, so an
  unimported SCSS file provably contributes 0 bytes to the build.

## Findings log

### F1 — 17 dead SCSS files (Phase 1)
Not imported by any JS or SCSS file. Most map to components that no longer exist
anywhere in `src` (the user-reported symptom):

`about.scss`, `animatedHeading.scss`, `animatedParagraph.scss`, `arrow.scss`,
`asci.scss`, `development.scss`, `floatingSquares.scss`, `gradientText.scss`,
`intro.scss`, `LightRays.scss`, `postcardFrame.scss`, `projectDetails.scss`,
`scrollingText.scss`, `valueProp.scss`, `waveShader.scss`, `welcomeTyped.scss`,
`_projects-modal.scss` (only `projects.scss` imports `_projects-*`; modal isn't in it).

Notable: `gradientText.scss` and `welcomeTyped.scss` are dead while
`GradientText.js` / `WelcomeTyped.js` still exist and are reachable → flagged for
Phase 2: either the components style themselves another way, or they're
imported-but-unrendered.

- Verification: `npm run build` before/after → emitted CSS byte-identical
  (content-hashed filenames unchanged). **PASS.** Committed `34cf546`.

### F2 — Phase 2 result: zero dead components, hooks, utils, or deps
Every suspect (incl. `GradientText`, `WelcomeTyped` from F1) is genuinely
rendered; their orphan stylesheets were superseded (GradientText styles inline,
WelcomeTyped styled via `hero.scss`). All `package.json` deps have import sites.
Phase 5 (deps) closes with Phase 2: nothing to remove.

### F3 — CRA fossils + dead assets (Phase 4)
- `public/manifest.json` — the stock CRA sample manifest ("Create React App
  Sample", icons point at a `logo512.png` that doesn't exist). The real manifest
  is `/images/favicon/site.webmanifest`, linked from index.html. Removed.
- `.unimportedrc.json` — config for the `unimported` tool, ignore-listing
  `react-scripts`/`web-vitals`/`@testing-library/*`, none of which are deps
  anymore. Removed.
- `public/fonts/NeueMachina-Ultrabold.woff2` (11KB) — replaced by SCS Display;
  survives only in code comments (kept: they document decisions). Removed.
- `src/assets/videos/glitch-effect.mp4` (**2.8MB**) — zero references. Removed.
- `public/fonts/SCS-heading-font-Regular.otf` — the SOURCE otf for the display
  face, used only by `scripts/fix_font.py`, but it lived in `public/` so every
  deploy shipped the unsubsetted source font publicly. Moved to `fonts-src/`,
  `fix_font.py` IN/OUT paths updated.
- False positives correctly kept: `-256/-512.webp` srcset derivatives (paths
  built dynamically via `.replace()` in `CaseStudyTiles.js`/`ClientStrip.js`),
  `Inter-*.woff2` (Sass `#{$w}` interpolation), `robots.txt`/`sitemap.xml`
  (fetched by convention, never imported).
- Verification: build green; CSS identical; removed files absent from `build/`;
  no string in emitted JS/HTML references them. **PASS.**

## Lessons → CLAUDE.md

(added as phases complete)
