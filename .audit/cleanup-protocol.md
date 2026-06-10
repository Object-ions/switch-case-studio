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
| 1 | Dead SCSS files (unimported → emit no CSS) | done — F1, `34cf546` |
| 2 | Imported-but-unrendered JS (components/hooks/utils/exports) | done — F2, nothing to remove |
| 3 | Dead selectors inside live SCSS (class ↔ JSX cross-ref) | done — F4/F5, see below |
| 4 | Unreferenced assets (public/, src/assets, fonts, models) | done — F3, `ea91541` |
| 5 | Unused npm dependencies | done — F2, all deps used |
| 6 | Final verification + instructions feedback (Rule 5) | done — F6 |

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

### F4 — 19 dead selectors inside live SCSS (Phase 3)
Method: extract every class from the COMPILED css (459 unique; nesting like
`&__heading` already resolved), string-check each against all JS + index.html,
then manually review survivors for dynamic construction before removal.

Removed (each verified: no JS renders/toggles the name, none dynamically built,
none library-injected):
- `pricingGuide.scss` — the entire pre-card pricing layout: `pg-packages`,
  `pg-package` (+hover cascade), `pg-row`/`__leader`/`__name`/`__price`,
  `pg-list`, `pg-book`, `pg-phone`, `pg-blob`. Current markup uses `pg-cards`
  + SinglePricingCard (`spc-*`).
- `_projects-layout.scss` — old projects info row: `row-info` (whole block incl.
  nested `.panel` overrides), `panel-tagline`, `panel-link`, + media-query copies.
- `_projects-tiles.scss` — `is-blurred` tile state (no JS applies it).
- `header.scss` — `brand_logotype` (old image logotype; logo is inline-SVG
  SCSLogo now), both breakpoints.
- `footer.scss` — `footer-divider`. `contact.scss` — `contact-left__heading`.
- `services.scss` — `services__overlay-cta` (both the rule and a hide-on-mobile
  selector — compiled-CSS check caught the second one after source grep missed it).
- `app.scss` — `background-video`.
- Verification: compiled class set lost exactly the 19 flagged names, gained 0;
  removed selectors matched no DOM node, so rendered output is provably
  unchanged. **PASS.** Committed (chore(styles): remove 19 dead selectors).

### F5 — Process error caught: a broken sweep flagged all 459 classes dead
First sweep passed `src/App.js` to grep — that file no longer exists (renamed
to `routes.js`), and BSD grep exits 2 on any missing path arg EVEN when other
paths match → `! grep -q` read every class as dead. A ~100%-positive result is
a broken detector, not a dead codebase. Root cause of the bad path: CLAUDE.md
itself still cited `src/App.js` and `src/components/ProjectsTiles.js` (→ now
`sections/CaseStudyTiles.js`) — instruction doc rot. Both references fixed.

### F6 — Final state
- 4 commits on `chore/legacy-cleanup`; every phase independently revertable.
- Removed: 17 SCSS files, 19 selectors, 2 CRA fossils, ~2.8MB dead video, 11KB
  dead font; source OTF un-deployed; `fix_font.py` paths updated; CLAUDE.md
  references corrected; 2 new rules added to CLAUDE.md.
- Every build along the way green (`vite-react-ssg build`, all routes emitted);
  CSS verified by content hash (P1) and class-set diff (P3); removed assets
  verified absent from `build/` with no dangling references in emitted JS/HTML.

## Lessons → CLAUDE.md (Rule 5 — applied)

1. Dead-code sweeps: prove death (compiled-CSS class extraction, import graphs,
   no Sass additionalData), then prove the removal changed nothing (content-hash
   / class-set diff). Dynamic construction review is mandatory before trusting
   "no grep hit". CRA fossils live outside src; `public/` ships everything.
2. A `! grep -q` sweep with one nonexistent path flags everything dead (BSD
   grep exit 2). Sanity-check sweep output rates; keep file references in
   CLAUDE.md current across renames.
