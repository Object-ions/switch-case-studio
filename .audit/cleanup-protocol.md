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

- Verification: `npm run build` before/after → emitted CSS must be byte-identical.
- Status: pending verification.

## Lessons → CLAUDE.md

(added as phases complete)
