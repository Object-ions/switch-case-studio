# Legacy Cleanup — Phase 0 Recon (READ-ONLY)

**Date:** 2026-07-21 · **Branch audited:** `main` @ `441267c` (clean tree) · **No code changed.**
Method: fresh grep evidence for every claim (no trust of the 2026-06 sweep), full build + parse
verification, five parallel sweeps (CRA / orphans / SCSS / deps / correctness).

**Environment disclosure:** `node_modules` was absent on this machine, so the mandated
`npm run build` could not run. I ran `npm ci` (exact lockfile restore — `git diff package.json
package-lock.json` empty after; zero repo files touched) as the one environment action. The
`prebuild` sitemap regeneration dirtied `public/sitemap.xml` (lastmod only); reverted with
`git checkout -- public/sitemap.xml`. Tree is clean.

**`design-audit-refresh` status:** that branch was **merged to `main` at `9298991` and deleted**
(local + remote; `git branch -a` shows only `main`, `feat/seo-geo-sprint-package`,
`fix/heading-font-h1-only`). "Collides with design-audit-refresh" is therefore **no** for every
item below and is omitted per item. STATUS.md still describes it as an open branch (→ LC-24).

---

## Verification baseline (ran before the audit)

**`npm run build` — PASS.** vite-react-ssg build, **31 routes rendered** (28 sitemap URLs +
`/30-off`, `/partners`, `/404`). Tail of output:

```
build/assets/app-q3zBkI08.js       699.87 kB │ gzip: 237.24 kB
build/assets/Moon-Cdr-5ERC.js      989.04 kB │ gzip: 272.69 kB
(!) Some chunks are larger than 500 kB after minification.   ← pre-existing, known (Moon = 3D)
[vite-react-ssg] Rendering Pages... (31)
build/index.html  71.21 KiB ... build/404.html  36.64 KiB
[vite-react-ssg] Build finished.
```

**Sass warnings: none emitted** — but NOT because the code is clean:
`vite.config.js` sets `css.preprocessorOptions.scss.silenceDeprecations: ["legacy-js-api","import"]`
(sass 1.100.0 would otherwise warn on every `@import`). Suppressed, not resolved → LC-15.

**JSX parse check: 74/74 `.js` files under `src/` parse clean** through esbuild's JSX loader
(`esbuild --loader=jsx < file`, exit 0 for all).

**JSON parse check: 6/6 files in `src/data/` parse clean** (posts, pricingData, projects,
services, team, testimonials; `cta.js`/`navigation.js` are JS modules, covered above).

**Sitemap drift explained:** `lastmod` for site pages = `git log -1 --format=%cs -- src` =
**2026-07-21** (the latest merge touched `src` today); the tracked copy says 2026-07-18. The
generator is correct and git-derived; the tracked copy is simply stale after every src commit → LC-22.

---

## Category 1 — CRA residue

### LC-01 — Zero live CRA residue (re-verified independently; prior cleanup claim CONFIRMED)
Category: CRA residue
Files: none (live); `.audit/*.md`, `graphify-out/*`, `vite.config.js:5` (historical narration)
Evidence:
```
git grep -n "react-scripts" -- package.json README.md netlify.toml vite.config.js scripts/* index.html
  → vite.config.js:5  // (2026-06; CRA is gone — react-scripts removed …)   [comment only]
git grep -n "PUBLIC_URL" → .audit/summary.md:403 only (describes the sweep pattern)
git ls-files | grep -iE "reportWebVitals|setupTests|App\.test|serviceWorker|jsconfig" → none
git grep -n "REACT_APP_" → no matches;  git grep -n "process\.env" → no matches ANYWHERE
git grep -n "browserslist\|eslintConfig" -- package.json → no matches
git grep "ReactDOM\.render" → none; only bare react-dom import is createPortal
  (src/components/ui/CursorComponent.js:2 — correct React 18 API, portals live in react-dom)
```
All env access is `import.meta.env.VITE_*` (ga.js:17-22, Contact.js:12-15, PromoPage.js:23-26 —
all declared in `.env.example`). `scripts` block is fully Vite-native (`start`/`dev`/`prebuild`/
`build`/`preview` + a mediapipe-sourcemap `postinstall` shim, unrelated to CRA). No `.github/` CI.
Verdict: LIVE codebase clean — remaining mentions are marked historical narration
Proposed change: none — informational
Risk: safe
Blast radius: none

### LC-02 — Cosmetic `.gitignore` leftovers: CRA-template `.env.*.local` lines + `*.ai` listed twice
Category: CRA residue
Files: `.gitignore:17-20` (`.env.local`, `.env.development.local`, `.env.production.local`), `*.ai` duplicated near bottom
Evidence: `git grep -n "\.env\.development\|\.env\.production" → .gitignore:18,20` only. These are
CRA-template entries but also valid Vite conventions (Vite reads `.env.local` / `.env.[mode].local`)
— inert either way. `*.ai` appears twice (harmless duplication).
Verdict: LIVE (harmless)
Proposed change: optional — drop the duplicate `*.ai` line; KEEP the `.env.*.local` lines (Vite
uses the same convention; removing them risks committing secrets for zero gain)
Risk: safe
Blast radius: none

### LC-03 — JSX-in-`.js` convention: 57 files, deliberately configured, rename NOT required
Category: CRA residue
Files: 57 JSX-bearing `.js` files under `src/` (full list in the CRA sweep; every component); zero `.jsx` files exist
Evidence: `vite.config.js:39-48` — `esbuild: { loader: "jsx", include: /src\/.*\.js$/ }` +
`optimizeDeps.esbuildOptions.loader: { ".js": "jsx" }` + `plugins: [react({ include: /\.(js|jsx)$/ })]`
(vite.config.js:11), with a comment (lines 4-9) documenting this as a kept convention.
Verdict: LIVE, intentional, fully handled. Rename to `.jsx` is **optional forever** under this
config — it would only ever be "required" if the esbuild override were removed.
Proposed change: none — informational. Recommend AGAINST a mass rename (74-file churn, breaks
blame, zero functional gain).
Risk: don't touch
Blast radius: a rename would touch every import path and the vite config

---

## Category 2 — Dead / orphaned code

### LC-04 — Every suspected component is LIVE (all 16 candidates + bento system re-verified with import chains)
Category: Orphan
Files: `src/components/ui/{Moon,TextPressure,GradientText,Squares,CursorWave,HoverPeek,ScrollingShot,ZoomLightbox,MagneticButton}.js`; `src/components/sections/{WelcomeTyped,AboutMarquee,AboutText,AboutHeading,AboutCTA,StripeSection,TestimonialHeading}.js`; `src/utils/bentoEffects.js`, `src/hooks/useBentoParticles.js`, `src/hooks/useBentoSpotlight.js`
Evidence (importer:line → routed page; every one a real JSX render, none commented-out):
```
Moon.js          ← About.js:16  const Moon = lazy(() => import('../ui/Moon')), rendered :48 (MoonSlot, IO-gated) → HomeContent
TextPressure.js  ← CaseStudies.js:5, rendered :54,:67 → routes.js:12 HomeContent
GradientText.js  ← TestimonialHeading.js:1, rendered :11 → Reviews → home + /testimonials
Squares.js       ← About.js:7, rendered :60
CursorWave.js    ← Hero.js:4, rendered :53
HoverPeek.js     ← CaseStudiesPage.js:5, rendered :64 (/projects)
ScrollingShot.js ← CaseStudyPage.js:16, rendered :342 (/projects/:slug)
ZoomLightbox.js  ← CaseStudyPage.js:17, rendered :443
MagneticButton.js← Reviews.js:15, Hero.js:6, AboutCTA.js:5, CaseStudyPage.js:18 (4 importers)
WelcomeTyped.js  ← Hero.js:3 :71 · AboutMarquee ← About.js:5 :71 · AboutText ← About.js:3 :74
AboutHeading     ← About.js:2 :70 · AboutCTA ← About.js:4 :78
StripeSection.js ← routes.js:15 (imported as GradientStripe), rendered :38
TestimonialHeading ← Reviews.js:13, rendered :148
Bento: bentoEffects ← useBentoParticles.js:3 + useBentoSpotlight.js:8 + CaseStudyTiles.js:10;
  both hooks ← CaseStudyTiles.js:8-9 (:18,:122); CaseStudyTiles ← CaseStudies.js:4, rendered :87 → home
```
Full import-graph BFS from `src/index.js` + `src/routes.js`: **74/74 js files reachable, 0 orphans.**
ValueProp residue: `grep -rin "valueprop" src public index.html scripts` → **0 matches** (fully gone).
Verdict: LIVE (all)
Proposed change: none — informational; the removal-candidate list in the Phase 0 brief is stale
Risk: don't touch
Blast radius: n/a

### LC-05 — Two dead data fields in `projects.json`: `backLabel`, `productName` (0 readers)
Category: Orphan
Files: `src/data/projects.json` (8 entries × 2 fields, all constant: `"Back to Projects"` / `"Our Work"`)
Evidence:
```
grep -rn "backLabel"    src public scripts → only the 8 definition lines in projects.json
grep -rn "productName"  src public scripts → only the 8 definition lines in projects.json
```
`CaseStudyPage.js:93-114` destructures `project` with explicit named fields — no `...rest`, no
bracket access, and neither name appears; the back-button label is hardcoded in JSX. All OTHER
fields have verified readers (incl. low-frequency ones: coverTile 3, panelClass 1, tileVersion 2,
longWeb 3). The optional bento fields (`mediaMobile`/`mediaCopy`/`mediaCta` + `*Alt`) are read at
CaseStudyPage.js:108-113 — absent-by-design in most entries, NOT dead.
Verdict: ORPHAN (data fields)
Proposed change: delete `backLabel` and `productName` from all 8 project entries
Risk: safe (pure data; zero render paths). Verify: build + one case-study page renders identically.
Blast radius: none — no code references to update

### LC-06 — Moon 3D assets are LIVE; the 1.5MB HDR is a size problem, not dead weight
Category: Orphan (verdict: not orphaned)
Files: `public/models/moon.glb` (**221 KB**), `public/models/potsdamer_platz_1k.hdr` (**1,540,678 B = 1.5 MB**)
Evidence: `Moon.js:17 useGLTF("/models/moon.glb")` + `:53 useGLTF.preload(...)`;
`Moon.js:76 <Environment files="/models/potsdamer_platz_1k.hdr" />`. Moon.js is LIVE (LC-04).
Only two files exist in `public/models/`.
Verdict: LIVE
Proposed change: none this phase. Optional future task (separate from cleanup): replace the HDR
with a drei `<Environment preset>` or a 1k→256px downsampled HDR — it's the heaviest single asset
in `public/`, fetched whenever the Moon IO-gate fires.
Risk: don't touch (in this cleanup)
Blast radius: Moon lighting appearance if swapped

### LC-07 — `/30-off` and `/partners`: unlinked-but-routable BY DESIGN — not orphans
Category: Orphan (verdict: intentional)
Files: `src/routes.js` (both routes), `src/components/pages/PromoPage.js`, `PartnersGate.js` → lazy `PartnersPage.js:38,99`
Evidence: no internal `<Link>` to either (grep across nav/footer/pages: only `Seo path` self-refs +
scss comments). `scripts/generate-sitemap.mjs:47-49` comment: "hidden routes are deliberately NOT
listed here — /30-off (promo) … noindex and linked only from emails/ads." `/partners` is
password-gated (SHA-256 check in PartnersGate) + `netlify.toml` X-Robots noindex header. Every
other route in routes.js is linked from navigation.js / Footer / in-page links AND sitemapped.
Verdict: LIVE, intentionally unlinked
Proposed change: none — informational
Risk: don't touch
Blast radius: n/a

### LC-08 — `motionTokens.js` vs `motionVariants.js`: complementary, not duplicative — keep both
Category: Orphan (verdict: not overlapping)
Files: `src/animation/motionTokens.js` (918 B), `src/utils/motionVariants.js` (1,016 B)
Evidence: motionTokens = GSAP scalar constants (`DUR_FAST/MED/SLOW`, `EASE_OUT*`, `REVEAL_Y/
STAGGER/SAFETY_DELAY`), imported by Reviews.js:22, AboutText.js:11, PricingGuide.js:22, mirrored
in `_variables.scss:45`. motionVariants = motion/react variant objects (`headerVariants`,
`lineVariant`, `containerVariants`, `cardVariants`), imported by BlogPage.js:10,
ServiceIndexPage.js:11, AboutPage.js:9, CaseStudiesPage.js:11, ReviewsPage.js:9. Different
animation systems, different consumers, zero shared exports.
Verdict: LIVE (both)
Proposed change: none — informational. (Note: motionVariants is implicated in the LC-25 bug —
the fix belongs there, not in consolidation.)
Risk: don't touch
Blast radius: n/a

---

## Category 3 — SCSS token discipline

(Environment: sass 1.100.0, modern API, no `additionalData`; tokens in `_variables.scss`;
`:root` exports in `app.scss:96-102` are motion-only — no color custom properties exist.)

### LC-09 — Five dead tokens + one redundant token in `_variables.scss`
Category: SCSS token
Files: `src/styles/_variables.scss`
Evidence (0 references across all of `src/styles` + src JS, per-token grep):
`$blue-color #1748ef` → 0 · `$light-blue-color #e4f0fe` → 0 · `$grey-light-color #f5f6fa` → 0 ·
`$g-top #dbe3e6` → 0 · `$g-mid #c3cdd3` → 0. Plus `$g3: #ff834a` ≡ `$g1` ≡ `$orange-color`
(triple-identical value; `$g3` has 1 use). Low-use-but-live (keep): `$g-bot` 1, `$dur-slow` 1,
`$ease-out` 1 (via the `:root` export), `$g2` 1, `$g4` 2.
Verdict: ORPHAN (5 tokens), redundant (`$g3`)
Proposed change: delete `$blue-color`, `$light-blue-color`, `$grey-light-color`, `$g-mid`; for
`$g-top` decide LC-18 first (a `#dbe3e7` literal in `_mixins.scss` is one-off-by-one from it —
either retarget that literal to `$g-top` or delete the token). Replace the one `$g3` use with
`$g1`, delete `$g3`.
Risk: safe (compile-time only; verify emitted CSS content-hash unchanged)
Blast radius: none if greps hold; Sass errors loudly on any missed reference

### LC-10 — Mechanical token swaps: literals that EXACTLY equal existing tokens
Category: SCSS token
Files: various under `src/styles/components/` + `app.scss`
Evidence (exact-value matches, from the full 426-line literal census):
- `#fef7ed` × 5 → `$white-color` (exact dup)
- `#ff834a` × 3 → `$orange-color` (exact dup)
- `#ff8f63` × 1 → `$g2` (exact dup)
- `rgba(217,156,255,x)` × 4 → `rgba($g6, x)` (literal spelling of `$g6 #d99cff`; the codebase
  already writes `rgba($g6,…)` 84× elsewhere — these are stragglers)
- `color: white` × 2 (`app.scss:167,172`, `::selection`) → see LC-11 (`$pure-white`)
Verdict: token-discipline violations, zero-ambiguity fixes
Proposed change: swap the 13 exact-dup occurrences to their tokens
Risk: safe (identical computed values; verify emitted CSS byte-identical modulo nothing —
values compile to the same output, so content hash should be UNCHANGED)
Blast radius: none

### LC-11 — Literals with NO existing token: propose tokens, then swap (decision required on names)
Category: SCSS token
Files: 34 SCSS files (worst: aboutPage 50 color-literal lines, footer 29, blogPostPage 26, projectPage 24, blogPage 23, singlePricingCard 22, projectsPage 22, partnersPage 22)
Evidence — distinct hex census (154 hex occurrences, 21 distinct values):
| Literal | Occ. | Proposed token (no value invented — names only) |
|---|---|---|
| `#fff` | 69 | `$pure-white: #fff` — do NOT map to `$white-color` (#fef7ed cream ≠ white; mapping would visibly shift the design) |
| `#000` | 52 | `$page-black: #000` (page/backdrop black; deliberately ≠ `$black-color` #303334) |
| `#0a0a0a` 7 / `#0d0d0d` 1 / `#111` 1 / `#1a1a1a` 1 | 10 | one near-black cluster → single `$ink-900` (pick ONE value — visual-change decision, flag at approval) |
| `#222` 3 / `#333` 2 / `#666` 1 | 6 | `$ink-800` / `$ink-700` / `$ink-500` |
| `#f5f5f5` 3, `#ccc` 1 | 4 | `$scrollbar-track` / `$scrollbar-thumb` (`_mixins.scss`) |
| `#f1f5f7` 1, `#eee` 1, `#f7f4fc` 1 | 3 | `$grid-bg`, `$grey-100`, `$lilac-050` |
| `#fca5a5` 1, `#6ee7b7` 1 | 2 | `$error-200`, `$success-300` (form states) |
Verdict: token-system gap (matches DESIGN_AUDIT P2-22's "~126 hexes" — real count 154)
Proposed change: add the tokens above to `_variables.scss`, then mechanical swap. The near-black
cluster consolidation is the only item that changes rendered values — split it into its own commit.
Risk: safe for 1:1 swaps; **needs visual verification** for the near-black consolidation
Blast radius: every dark surface if the cluster value is chosen wrong

### LC-12 — 199 raw white/black rgba() overlays → `rgba($token, x)` once LC-11 lands
Category: SCSS token
Files: same set
Evidence: `rgba(255,255,255,x)` × **169** (alphas 0.02–0.9; top: 28×0.1, 21×0.08, 17×0.5, 10×0.6),
`rgba(0,0,0,x)` × **30**. Already-correct `rgba($token,x)` usage elsewhere: 71 (the target pattern).
Verdict: token-discipline violation (blocked on LC-11's `$pure-white`/`$page-black`)
Proposed change: `rgba(255,255,255,x)` → `rgba($pure-white,x)`; `rgba(0,0,0,x)` → `rgba($page-black,x)`
Risk: safe (identical output; content-hash verify)
Blast radius: none; sequenced after LC-11

### LC-13 — Breakpoint sprawl: 19 distinct values, ±1 hack clusters, mixed min/max at every seam
Category: SCSS token
Files: all component SCSS
Evidence — full `@media` px histogram:
```
1×380 5×480 1×520 4×580 6×600 1×639 20×640 1×641 6×668 1×669
1×767 55×768 6×769 3×820 4×900 3×960 36×1024 1×1280 1×1300
```
Clusters: **639/640/641** (18 min-width:640 + 4 max-width:640 + the ±1 pair, StaggeredMenu mixes
`max-width:960 and min-width:641` with `max-width:640`); **667/668/669**; **767/768/769** (768 =
44 max + 11 min — the dominant seam, both directions). 1024 = 23 max + 13 min. Also
`max-width: 1100px` ×2 and `1300px` ×1 as content-width one-offs beside `$max-width` (1200px,
correctly used 34×, zero raw `1200px` duplicates found).
Verdict: token gap + methodology mix (desktop-first and mobile-first coexist at every seam)
Proposed change: add `$bp-xs:480 / $bp-sm:640 / $bp-md:768 / $bp-lg:1024` + a `respond-to` mixin;
migrate the ±1 companions (639→640−, 767→768−, 641/669/769→min of the seam) with a per-query
direction review — NOT a blind replace (collapsing 639→640 flips which side a 640px device lands on).
DESIGN_AUDIT P2-22 proposed 480/768/1024/1280; the histogram says the real seams are
**480/640/768/1024** (1280 has 1 use) — reconcile at approval.
Risk: needs visual verification (seam-boundary devices)
Blast radius: every responsive layout at the collapsed boundaries

### LC-14 — Non-colocated top-level `@media` blocks (restyle classes defined elsewhere in the file)
Category: SCSS token
Files/lines: `services.scss:122,131,144` · `landingPageProof.scss:141,154,180` ·
`_projects-tiles.scss:194,238` · `StaggeredMenu.scss:372,380` · `_projects-layout.scss:32` ·
`stripeSection.scss:46` · `clientStrip.scss:139` · `consentBanner.scss:81` · `promoPage.scss:286`
Evidence: each is a column-0 `@media` reopening the file's root class (verified to restyle `&__`
children declared in the nested block above). NOT offenders: the top-level
`prefers-reduced-motion` resets (clientStrip:133, stripeSection:53, consentBanner:97,
_projects-tiles:187, StaggeredMenu:403, app.scss:137) and app.scss:193,199 global body font
scaling — legitimately global.
Verdict: style-organization debt
Proposed change: fold each into its parent selector (pure reorg, no value changes)
Risk: safe-to-low — watch source-order specificity where a top-level block currently wins by
coming later in the file; verify emitted CSS rule order or content hash
Blast radius: the touched components' responsive styles

### LC-15 — `@import` deprecation debt is SILENCED, not solved (removal lands in Dart Sass 3.0)
Category: SCSS token
Files: `vite.config.js` (silenceDeprecations), ~29 files on `@import`, 8 on `@use`
(`cursorWave, contact, promoPage, partnersGate, partnersPage, faq, serviceRow, footer`), `app.scss` @imports `_variables` + `_mixins`; `projects.scss` @imports the three `_projects-*` partials
Evidence: sass 1.100.0 emits import-deprecation by default; build is quiet ONLY because of
`silenceDeprecations: ["legacy-js-api","import"]`. Mixed-model safety holds today because **no
`@use` file is ever `@import`-ed** — every component partial is a leaf imported from JS.
Verdict: deferred migration debt (correct to defer, but it has an expiry: Dart Sass 3.0)
Proposed change: none this phase — informational. When migrating: `sass-migrator` for the
mechanical pass; the hazard is `as *` namespace collisions across 30+ files, and the CLAUDE.md
`:root` custom-property pattern already solves cross-module tokens.
Risk: don't touch (now); medium (later, mechanical)
Blast radius: every SCSS file when it happens

### LC-16 — ⚠ CORRECTNESS: `.sm-socials-link` has a CSS `opacity` transition on the SAME element GSAP animates every frame
Category: Correctness (found in SCSS sweep — the one real GSAP/CSS double-owner)
Files: `src/styles/components/StaggeredMenu.scss:268-270` vs `src/components/layout/StaggeredMenu.js:132,144,186-197,249`
Evidence: SCSS declares `transition: color 0.3s ease, opacity 0.3s ease;` while the open timeline
does `gsap.set(socialLinks, {y, opacity})` and `tl.to(socialLinks, {opacity:1,…})` — the CSS
transition re-interpolates toward every per-frame GSAP write (double-easing/lag on the menu-open
stagger). The JS's `onComplete: clearProps 'opacity'` (StaggeredMenu.js:201) shows the contest is
known. The transition exists for the hover-dim (`opacity:0.35`), so it can't just be deleted.
Everything else checked is clean: `.testimonials-cta`, `.tile`, `.footer-col-animate`, `.reveal`,
`.scsLogo`, `.faq__icon` all resolved to transitions on DIFFERENT elements than GSAP's targets;
the global `:active` opacity press (app.scss:137-146) is the documented deliberate exception.
Verdict: LIVE bug (subtle jank, mobile menu open)
Proposed change: remove `opacity` from the transition list and scope the hover-dim via a
`:hover`-only transition (or animate the dim with GSAP)
Risk: safe (one-line property-list change) + quick visual check of menu open/hover on mobile
Blast radius: staggered-menu social links only

### LC-17 — Clean bills: no sticky-breaking ancestors, no orphaned partials
Category: SCSS token
Files: sticky elements `header.scss:5`, `footer.scss:15`, `faq.scss:51`; all 40 partials
Evidence: ancestors of all three sticky elements (`body`/`.app`/`main`/`.faq`) carry no
`transform`/`filter`/`perspective`/`will-change` (all 11 `will-change:transform` hits + the one
`perspective` in hoverPeek.scss:6 sit on non-ancestors). Partial import graph (42 JS `import
'...scss'` statements + `projects.scss` → `_projects-{layout,tiles,bento}`): every one of the 40
files in `src/styles/components/` reachable. **0 findings.**
Verdict: clean
Proposed change: none — informational
Risk: n/a
Blast radius: n/a

### LC-18 — Value-reconciliation decisions (off-by-one twins + a resurrected dead value)
Category: SCSS token
Files: `_mixins.scss` (grid colors), one component (orange)
Evidence: literal `#dbe3e7` (2×, grid lines) vs token `$g-top #dbe3e6` (0 uses) — one bit apart;
literal `#efd7ff` (1×) vs `$g7 #f0d7ff` — near-dup; literal `#fe5721` (1×) = the commented-out
ALTERNATE `$orange-color` on `_variables.scss:9` (dead value living on as a literal).
Verdict: UNCERTAIN — each needs a which-value-wins decision, not a mechanical swap
Proposed change: per pair, either retarget the literal to the token (1-bit visual change) or
delete the dead token (LC-09) and token-ize the literal's value. `#fe5721`: decide if that accent
is intentional; if yes, name it; if no, swap to `$orange-color`.
Risk: needs visual verification (values change by 1 bit / a hue step)
Blast radius: grid backgrounds, one lilac tint, one orange accent

---

## Category 4 — Dependencies & repo hygiene

### LC-19 — `prop-types` is a PHANTOM dependency: imported by live code, not declared
Category: Dependency
Files: `src/components/ui/ScrollingShot.js:3` (`import PropTypes from 'prop-types'`); `package.json` (absent)
Evidence: ScrollingShot is LIVE (`CaseStudyPage.js:16`, rendered `:342` — every case-study page).
`grep '"prop-types"' package.json` → no match. It resolves only because npm flat-hoists a
transitive copy (`package-lock.json:3581 node_modules/prop-types`, pulled by react-router /
FontAwesome). If any of those drop it, `/projects/:slug` breaks at build.
Verdict: LIVE code, missing declaration — the only missing dep found
Proposed change: `npm install prop-types` (adds one line to dependencies; version already pinned
in the lock as a transitive) — Phase 1, after approval
Risk: safe
Blast radius: package.json + lockfile one entry
Note (batch 1 execution, 2026-07-21): the LC-19+LC-20 lockfile diff reads large (26+/199−) but is
compositionally boring — the dev:true-flag cascade across vite-react-ssg's transitive tree (the
expected shape of a devDependencies→dependencies move) plus a 19-line environmental prune of the
optional-peer `@types/node`/`undici-types` entries, control-tested to occur on a plain
`npm install` against unmodified HEAD (this machine's npm prunes them regardless). No versions or
integrity hashes changed. Judge lockfile diffs by composition, not size.
Verification-method correction (batch 1): the planned ScrollingShot built-HTML spot-check was the
wrong test — the section is gated `{liveOK && …}` with `mockupOK = useImagePreload(publicLongWeb)`,
which can only resolve client-side, so it has NEVER been in static output. The actual
no-regression proof was the content-hash-identical `CaseStudyPage-BBU_j1cU.js` chunk plus the
across-the-board asset-hash match. General rule: for client-gated components, verify via build
artifact hashes, not rendered-HTML presence.

### LC-20 — `vite-react-ssg` is runtime-imported by shipped src/ but declared in devDependencies
Category: Dependency
Files: `package.json` (devDependencies), `src/index.js:1`, `src/components/util/Seo.js:6`
Evidence: `import { ViteReactSSG } from 'vite-react-ssg'` (entry — client hydration on every
page load) + `import { Head }` (Seo — rendered by every route). It's the app's framework glue,
incl. the react-helmet-async 1.x it nests (package-lock.json:4305/4345, correctly ABSENT from
package.json per the Seo.js dedupe rule).
**Status: LATENT, not live.** `netlify.toml` evidence: `[build] command = "npm run build"`,
`publish = "build"`, `[build.environment] NODE_VERSION = "22"` — and nothing else: no
`NPM_FLAGS`, no `--omit=dev`, no `NODE_ENV=production`. Netlify's default install includes
devDependencies, so today's deploys work. Activation conditions: a Netlify env change (e.g.
setting `NODE_ENV=production` or `NPM_FLAGS`), a CI migration to another platform, or any
production-only install (`npm ci --omit=dev`).
Severity refinement (2026-07-21): this repo cannot build under `--omit=dev` REGARDLESS — `vite`
and `@vitejs/plugin-react` are themselves devDependencies, so a production-only install fails on
vite before ever reaching vite-react-ssg. The declaration move is still correct; the
justification is semantic honesty and any future consumer/SSR context, not a realistic Netlify
failure path.
Verdict: misclassification (functional today — latent)
Proposed change: move `vite-react-ssg` from devDependencies to dependencies (no version change)
Risk: safe
Blast radius: package.json only; build output identical

### LC-21 — All 18 packages USED — zero removal candidates; `ogl` and `@gsap/react` are NOT deps (brief was stale)
Category: Dependency
Files: `package.json` (15 deps + 3 devDeps)
Evidence: per-package grep verdicts — every dependency has import sites: @emailjs/browser
(Contact.js:3, PromoPage.js:2), @fortawesome/* (HeaderCTA.js:2, SinglePricingCard.js:4, +4),
@radix-ui/react-hover-card (HoverPeek.js:2), @react-three/drei + fiber + three (Moon.js:2,9,10),
gsap (src/index.js:2-3 + ~15 files + vite.config.js:37 `ssr.noExternal`), motion (as `motion/react`
×11 files — legit v12 entry), typed.js (WelcomeTyped.js:2), react-router-dom (routes.js:2, ~21
sites), react-router-hash-link (Hero.js:2, LandingPageProof.js:3), react/react-dom (pervasive);
sass / vite / @vitejs/plugin-react = build-time INDIRECT (vite.config.js:2,11,22-31). `ogl` and
`@gsap/react`: **not in package.json, 0 code hits, 0 lockfile entries** — the brief's "GSAP via
@gsap/react/useGSAP" and summary.md's "OGL 1.0" describe a past state (useGSAP grep in src → 0;
all GSAP is manual effects).
Verdict: LIVE (all) — no `npm uninstall` proposals exist
Proposed change: none — informational
Risk: n/a
Blast radius: n/a

### LC-22 — `public/sitemap.xml`: tracked copy is NEVER what prod serves → gitignore it
Category: Dependency (repo hygiene)
Files: `public/sitemap.xml` (tracked), `scripts/generate-sitemap.mjs:93`, `package.json:31` (prebuild), `netlify.toml` (`command="npm run build"`, `publish="build"`)
Evidence: every Netlify deploy runs prebuild → regenerates `public/sitemap.xml` → Vite copies it
to `build/sitemap.xml` (confirmed present, 28 URLs) → that is what serves at `/sitemap.xml`. The
tracked copy therefore only produces perpetual dirty-diff churn: reproduced this session —
`lastmod` = `git log -1 --format=%cs -- src` = 2026-07-21 vs the tracked 2026-07-18 (8-line diff
on a clean tree; reverted).
Verdict: generated file wrongly tracked
Proposed change: `git rm --cached public/sitemap.xml` + add `/public/sitemap.xml` to .gitignore.
**Gitignore is correct, not commit-updated** — the served copy is always build-fresh, and the
house rule already says "generated — never hand-edit". (Local `npm start` without a prior build
still gets a stale-dated but valid file only if generated once; acceptable — dev doesn't need
sitemap.) Cosmetic script nit to fix in passing: `generate-sitemap.mjs:43` derives `servicesMod`
from `pricingData.json` but the `/pricing/:slug` URLs from `services.json:64` — mismatched
lastmod source.
Risk: safe
Blast radius: none in prod; `git status` noise disappears

### LC-23 — README doc-rot: "Vite 5", "Node 20", missing Blog + Partners
Category: Doc
Files: `README.md:5-6,27` ("Built with **Vite 5**") · `:93,240` ("Node … pinned to 20") · `:13` (page list)
Evidence: actual `vite ^7.3.5` (package.json; node_modules/vite → 7.3.5); `netlify.toml
NODE_VERSION="22"` (with comment "Vite 7 requires … pin to 22"); `/blog` (BlogPage/BlogPostPage +
3 posts) and `/partners` exist but are absent from README's page list. Everything else in README
checked current (no-CRA note :84, SSG/404 model :241-249, helmet-async note :31).
Verdict: misleading doc-rot (version claims), incomplete (page list)
Proposed change: fix the four passages (Vite 5→7, Node 20→22 ×2, add Blog to the page list —
consider whether /partners belongs in a public README at all, it's a semi-hidden page)
Risk: safe
Blast radius: docs only

### LC-24 — STATUS.md describes `design-audit-refresh` as an open unpushed branch — it merged 2 weeks ago
Category: Doc
Files: `STATUS.md:4` ("41 commits ahead of main, nothing pushed"), `:31` ("build green (27 routes)")
Evidence: `git branch -a` → branch gone local+remote; merged at `9298991` ("Merge
design-audit-refresh…"). Route count is now 31 (this build) vs the doc's 27 (pre-blog/partners).
CHANGELOG.md, PRODUCT.md, GA4.md checked: clean/current (CHANGELOG's CRA mention is marked
historical and says Vite 7 — correct).
Verdict: stale process state (could mislead the next session into looking for a lost branch)
Proposed change: update STATUS.md's branch-state header + route count (or add a one-line "merged
at 9298991" closer). Per the CLAUDE.md doc-rot rule, this class of drift caused a broken sweep
once already.
Risk: safe
Blast radius: docs only

### LC-25 — `graphify-out/` (764 KB, 14 tracked files): unused by the build; convention says keep — flag the tension
Category: Doc (repo hygiene)
Files: `graphify-out/` — graph.html 181 KB, graph.json 169 KB, GRAPH_REPORT.md, 4 dotfiles, 2 dated snapshot dirs
Evidence: `grep -rn "graphify" src scripts vite.config.js netlify.toml package.json index.html`
→ **0 hits**; not under `public/` so never reaches `build/`. Tracked deliberately (`git ls-files
graphify-out` → 14 files; `f61db28` "restore tracked graphify output"; `.gitignore` already
excludes its volatile sub-files: manifest.json, cost.json, cache). The Phase-0 brief asked to
"propose gitignore"; repo convention (twice reaffirmed in .audit docs) is keep-tracked.
Verdict: LIVE-by-convention, build-dead
Proposed change: DECISION ITEM — (a) keep tracked (status quo, convention), or (b) gitignore
`graphify-out/` and drop the 764 KB from the working set. If (a), consider pruning the duplicate
dated snapshots (2026-06-01 vs 2026-06-07). I lean (a)+prune: the convention was affirmed
deliberately twice; overturning it is an owner call, not a cleanup default.
Risk: safe either way (zero build impact)
Blast radius: repo history size only

---

## Category 5 — Correctness sweep (report only — no fixes applied)

### LC-26 — ⚠ CONFIRMED BUG: five page `<h1>`s ship `opacity:0` in the static SSG HTML
Category: Correctness
Files: `pages/AboutPage.js:83-97` · `ReviewsPage.js:27-41` · `CaseStudiesPage.js:31-43` · `BlogPage.js:66-78` · `ServiceIndexPage.js:78-92` — all via `utils/motionVariants.js:12-20` (`lineVariant` hidden state) with `initial="hidden" whileInView="visible"`
Evidence — verified in THIS session's emitted build (not inferred from source):
```
$ grep -o '<h1[^>]*>' build/{about,testimonials,projects,blog,services}.html
build/about.html:        <h1 class="about-page__title"        style="opacity:0;clip-path:inset(0 0 100% 0);transform:translateY(24px)">
build/testimonials.html: <h1 class="testimonials-page__title" style="opacity:0;clip-path:inset(0 0 100% 0);transform:translateY(24px)">
build/projects.html:     <h1 class="projects-page__title"     style="opacity:0;…">
build/blog.html:         <h1 class="blog-page__title"         style="opacity:0;…">
build/services.html:     <h1 class="service-index__title"     style="opacity:0;…">
$ grep -o '<h1[^>]*>' build/pricing/web-development.html   ← the fixed reference (VE-8, GSAP pattern)
<h1 id="pg-title" class="pg-h1 pg-animate">                 ← ships VISIBLE
```
This is exactly the defect CLAUDE.md's motion/react rule predicted ("AboutPage/ReviewsPage …
unaudited") — now confirmed on five routes. Because the header is at the top of the viewport,
`whileInView` fires on hydration, so users WITH JS see it — but no-JS/scraper views get an
invisible h1, plus a pre-hydration flash. Not a hard strand; an SEO/no-JS defect.
Verdict: LIVE bug
Proposed change: convert the five page headers to the GSAP house safe-reveal (static HTML ships
visible, hide-at-runtime — the proven PricingGuide pattern), or at minimum verify-and-accept with
`animate="visible"`. Fix belongs in ONE commit touching the shared pattern.
Risk: needs visual verification (5 routes, entrance timing)
Blast radius: page-header entrance on 5 routes; motionVariants.js consumers

#### LC-26 — Fix mechanism proposal (Phase 1 Part C — DOCUMENT ONLY, approved sequence slot 2)

**Constraint accepted:** the fix must be "don't hide during prerender," not "animate it back."
Static HTML must ship a visible `<h1>`; any hiding happens client-side only, after hydration.

**1. Mechanism — Option A (recommended): remove motion/react from the five page headers; use the
GSAP house safe-reveal (the VE-8 / PricingGuide pattern).**
The header JSX ships plain (`<h1 className="…">`, no `variants`/`initial`/`whileInView` on the
header block or its children) → there is nothing for the server renderer to serialize; the static
HTML carries no inline style at all. Client-side, an effect (plain `useEffect` — this must NOT be
pre-paint) does the house sequence: `gsap.set(header, hidden)` → reveal via
`ScrollTrigger.create({onEnter})` or immediately if already in view → `gsap.delayedCall` safety
net forcing full visibility. `initial="hidden"` can't be serialized because motion no longer owns
the node. Trade-off: a brief visible-before-entrance frame on hydration (the house rule explicitly
accepts this: "static HTML ships visible, `gsap.set` hides at runtime only"); ~5 small page edits
instead of one variants edit.
**Option B (minimal, entrance-sacrificing):** keep motion but pass `initial={false}` on the five
header `motion.*` nodes. motion then renders the base (visible) style on server AND client — no
hidden state serialized, no hydration branch. Trade-off: the entrance animation is lost entirely
(when `whileInView` fires, the element is already at "visible" — nothing tweens). Zero-risk,
zero-ceremony; acceptable only if the owner is willing to drop the header entrance.
**Rejected on arrival:** anything that ships `opacity:0` in HTML and reveals post-hydration
(the current defect, restated); a mounted-state `initial={mounted ? "hidden" : false}` gate —
motion reads `initial` once at mount, so flipping it post-hydration is a no-op, and making it
work would require a remount (worse than either option).

**2. Single source of truth.** Option A: GSAP becomes the sole owner of `opacity`/`clip-path`/
`transform` on the header nodes; motion variants are removed from those nodes entirely. The SCSS
sweep (LC-16/LC-17) found no CSS `transition` on any of the five title classes
(`about-page__title`, `testimonials-page__title`, `projects-page__title`, `blog-page__title`,
`service-index__title`), so no CSS/GSAP double-owner is created. The reveal should use
`autoAlpha` + `y` only (drop the `clip-path` flourish, matching PricingGuide) — fewer contested
properties. The pages' GRIDS stay on motion (`animate="visible"`, LC-26 evidence 6.b) — different
nodes, no overlap. Option B: motion remains sole owner; nothing changes ownership.

**3. Reduced motion.** Option A follows PricingGuide exactly: the effect early-returns on
`useReducedMotion()` — no hide is ever applied, header stays statically visible (the hook is
already imported on all five pages for the `v()` variants wrapper, so the plumbing exists).
Option B: the existing `v()` reduced-motion wrapper keeps working; with `initial={false}` there
is no motion to reduce.

**4. Verification method (build-output grep, not browser).** After `npm run build`:
```
grep -o '<h1[^>]*>' build/about.html build/testimonials.html build/projects.html build/blog.html build/services.html
```
PASS = every emitted `<h1 …>` tag carries **no** `style=` attribute containing `opacity:0`,
`clip-path`, or `translateY` (Option A: no inline style at all). Assert the negative explicitly:
```
! grep -E '<h1[^>]*style="[^"]*opacity: ?0' build/about.html build/testimonials.html build/projects.html build/blog.html build/services.html
```
(all five paths exist — the BSD-grep missing-path exit-2 trap from CLAUDE.md doesn't apply, but
re-verify paths first anyway per that rule). Reference invariant: `build/pricing/web-development.html`
must continue to emit `<h1 id="pg-title" class="pg-h1 pg-animate">` unchanged.

**5. Reference implementation.** Pricing is correct **by design, not accident**: VE-8
(`f959dba`) deliberately replaced a motion `whileInView` header — which had exactly this bug,
caught mid-pass ("pricing h1 shipped `opacity:0` in static HTML") — with the GSAP pattern in
`PricingGuide.js` (`.pg-animate` targets, hide in effect, onEnter reveal, delayedCall net,
reduced-motion early-return). The difference today: pricing's h1 = `<h1 class="pg-h1 pg-animate">`
(no inline style, GSAP-owned at runtime) vs the five pages' `motion.h1` with `lineVariant`
serialized to `style="opacity:0;clip-path:…;transform:…"`. Option A is literally "make these
five match pricing."

**6. CLS risk.** Geometry is unchanged by the fix itself: the hidden state is
`opacity/clip-path/translateY` — none affect layout, so the h1's box is already reserved in the
current broken HTML and stays identical when it ships visible; the runtime reveal animates
compositor-only properties. Expected CLS delta ≈ 0. Per the batch-2 gate: reconcile desktop CLS
with **median-of-3 PSI on prod, branch deploy vs `main`**, before merge — local Lighthouse is
directional only (CLAUDE.md: local LH on this hardware isn't comparable to PSI).

**Carry-forward notes (recorded during batch 1, owner-directed — do not act before batch 2):**
- **The PSI gate stands regardless of the CLS reasoning above.** Identical box geometry holds
  for `opacity` and `clip-path`; for the `y` transform it holds only if the transform displaces
  nothing in flow — which it shouldn't, but "expected ≈ 0" is a prediction, and the median-of-3
  PSI desktop reconciliation (branch vs `main`) is what turns it into a measurement. The gate is
  not waivable on the strength of the reasoning.
- **Batch 2 recon must grep: are these five headers the last `motion/react` consumers?** If so,
  the dependency picture changes (`motion` ^12.35.0 is a declared dep with ~11 import sites
  today — the grids/CTAs on the same five pages, SinglePricingCard, ServiceRow, etc., so
  likely NOT the last, but verify). Report only. A `motion` removal is its own item with its
  own bundle-size story — not a free rider on an h1 fix.

### LC-27 — SinglePricingCard inner `whileInView` can strand card content on tall mobile cards
Category: Correctness
Files: `src/components/ui/SinglePricingCard.js:73-78` (card, `amount:0.2`) and `:151-158` (each feature `<li>`, `amount:0.4`)
Evidence: renders inside PricingGuide, whose GSAP reveal animates only the OUTER `.pg-card-slot` —
the inner motion.div opacity is independent and threshold-gated. On a tall single-column mobile
pricing card, `amount:0.4` per-feature is the same failure class as the documented
/projects+/testimonials mobile stranding (CLAUDE.md rule: tall sections can never clear the
threshold on load). The comment at `:20` claiming "whileInView … can't get stuck hidden"
contradicts the house rule.
Verdict: LIVE bug risk (conversion page) — needs a real-mobile-width repro to confirm severity
Proposed change: switch card+feature reveals to mount-reveal (`animate`) or drop the amount
thresholds; verify at 390px on all 6 pricing routes
Risk: needs visual verification
Blast radius: 6 pricing pages

### LC-28 — GSAP lifecycle debt: Header/StaggeredMenu tweens + a nav setTimeout never cleaned on unmount; bento particles leak infinite tweens
Category: Correctness
Files: `layout/Header.js:69,116` (spinTweenRef/textCycleAnimRef — killed on next toggle at :62,:91, never on unmount) · `layout/StaggeredMenu.js:72-73` (openTlRef/closeTweenRef; also `:314` `setTimeout(navigate, 80)` uncleared) · `hooks/useBentoParticles.js:57-73` vs `:20-35`
Evidence: Header/StaggeredMenu live in the persistent layout so unmount is rare (low severity).
useBentoParticles is real: `stopParticles` tweens scale/opacity→0 and removes the node onComplete
but never `gsap.killTweensOf(p)` — the two `repeat:-1` x/y+opacity tweens per particle keep
running in the global ticker against detached nodes; **every hover-out leaks two eternal tweens**
(desktop hover only; mobile/reduced gated off). Context: the other 19 GSAP components verified
CLEAN — `gsap.context` + `ctx.revert()` or explicit trigger kills everywhere (table in sweep);
no app-wide ScrollTrigger leaks; the old `ScrollTrigger.getAll().kill()` anti-pattern is gone.
Verdict: LIVE debt (particles leak is the real one)
Proposed change: (1) `stopParticles`: `gsap.killTweensOf(p)` before removal; (2) unmount cleanup
killing the four Header/StaggeredMenu refs + clearTimeout. Note: `useGSAP` is used NOWHERE (brief
premise stale) — all-manual effects, which is fine given the discipline shown.
Risk: safe (additive cleanup)
Blast radius: hover particles, menu open/close

### LC-29 — Reduced-motion gaps: Moon auto-rotation and cursor dot ignore `prefers-reduced-motion`
Category: Correctness
Files: `ui/Moon.js:21-23` (`useFrame` rotates every frame, no gate) · `ui/CursorComponent.js:48-53` (dot follow tween; gated only by `(hover:hover) and (pointer:fine)` at :22)
Evidence: `useReducedMotion` has 26 consumers + 6 components with equivalent inline matchMedia
checks (Faq:91, Services:25, Contact:110, StripeSection:27, Footer:141, TextPressure:149 —
inconsistent style, same effect). VE-10's four closures VERIFIED genuinely closed (AboutHeading:
14-17, Squares:138-143, GradientText:38, AboutText:22). Remaining true gaps: the two above, plus
hover-lift tweens (CaseStudyTiles:27, Services:78 — hover-only, informational).
Verdict: LIVE debt (decorative, but house rule says zero gaps)
Proposed change: pass a reduced flag into Moon's `useFrame`; short-circuit the cursor tween to
`gsap.set` when reduced
Risk: safe
Blast radius: Moon, custom cursor

### LC-30 — Clean bills + informational: SSR safety fully green; a few ungated/uncancelled loops
Category: Correctness
Files: various
Evidence: **module-scope browser globals: ZERO** (CursorWave's `isTouchDevice` is a function
declaration invoked in effects :588; bentoEffects' `document.createElement` is inside an exported
function; Contact's module-scope `import.meta.env` destructure is compile-time). **Render-output
env branching: none** (all mounted-state gates start false on server AND first client render).
**Raw `useLayoutEffect`: zero** outside the shared iso hook (StaggeredMenu comments :85-88 explain
its deliberate plain useEffect). Informational only: single-shot RAFs without cancel
(`ScrollToTop.js:16`, `ScrollTriggerRefresher.js:9` — a stale `ScrollTrigger.refresh()` could fire
after a rapid route change); always-on loops with no offscreen pause (Squares drift, CursorWave
lattice, GradientText, Reviews interval :69 / SinglePricingCard rotator :65 — all have unmount
cleanup, just burn cycles offscreen; TextPressure and ModuleGrid are the exemplary IO-gated
references).
Verdict: clean (SSR) / informational (loops)
Proposed change: none required; optional IO-pause pass on Squares/CursorWave if perf budget wants it
Risk: n/a
Blast radius: n/a

### LC-31 — Inline color literals in JS have no token mirror (separate track from LC-11)
Category: Correctness (system gap, informational)
Files: 19 JS files with hex/rgba literals (canvas/particle/SVG colors: bentoEffects, CursorWave, TextPressure, GradientText, Squares, Moon, CursorComponent, SCSLogo, routes.js backdrop, …)
Evidence: JS cannot read Sass tokens; the motion system already solved this with the mirror
pattern (`animation/motionTokens.js` ↔ `_variables.scss:45`), but no `colorTokens.js` mirror
exists. Any LC-11 retint would silently diverge from canvas-drawn colors.
Verdict: system gap
Proposed change: none this phase — note that IF LC-11's palette work proceeds, add a
`src/animation/colorTokens.js` (or extend the `:root` custom-property export and read via
`getComputedStyle`) in the same batch
Risk: don't touch (until LC-11 approved)
Blast radius: canvas/WebGL visuals if done carelessly

### LC-32 — vite.config.js silences the Sass @import deprecation warning
Category: Dependency / tech debt
Files: vite.config.js
Evidence — the exact silencing config (`vite.config.js:21-32`, silencing at `:29`):
```js
css: {
  preprocessorOptions: {
    scss: {
      // Modern Sass API (silences the legacy-js-api deprecation).
      api: "modern",
      // The stylesheets use @import everywhere. Migrating every file to
      // @use/@forward is a large, risk-only-no-benefit refactor, so quiet the
      // @import deprecation instead.
      silenceDeprecations: ["legacy-js-api", "import"],   // ← vite.config.js:29
    },
  },
},
```
Current Sass: **1.100.0 installed** (declared `sass ^1.77.8` in package.json). Suppression scope:
build-wide — every SCSS compile through Vite; both the `import` and `legacy-js-api` deprecation
classes are quieted (the latter is additionally moot under `api: "modern"`). ~29 files use
`@import`, 8 use `@use` (census in LC-15).
Verdict: LIVE — intentional suppression
Proposed change: none this phase. Tracked only.
Risk: don't touch
Blast radius: @import is slated for removal in Sass 3.0. Zero warnings currently reflect
suppression, not compliance. Migration to @use/@forward is a future standalone task; this item
exists so the deadline is visible rather than invisible — a clean build log is NOT evidence of
@import compliance while `silenceDeprecations` stands.

---

## Batching — APPROVED SEQUENCE (Phase 1, owner-resequenced 2026-07-21)

Phase 0 was approved as a document; the originally proposed 5-batch plan is superseded by the
order below. The original batch 1 (grep-proven deletions) was **demoted**: the entire orphan
yield is two JSON fields and five dead tokens — no risk reduction, no user impact, so it does
not earn the first slot.

1. **LC-19 + LC-20 — dependency correctness** (`fix/dependency-correctness`). *Four separate
   parents currently hoist `prop-types`, so it is materially resilient today — but the guarantee
   doesn't exist, so the resilience isn't ours to rely on; declaring it is free, and that's the
   reason to do it. Same logic for `vite-react-ssg`'s classification. Not "it's on fire" —
   it's that correctness here costs one line.*
2. **LC-26 — server-rendered hidden `<h1>` on five routes.** Own branch, own verification
   (mechanism proposal under LC-26 above; grep-the-built-HTML pass condition). *The only shipped
   user- and SEO-facing defect.*
3. **LC-16 — GSAP/CSS `opacity` conflict on `.sm-socials-link`.** *Correctness, tightly scoped —
   one property-list change plus a mobile menu check.*
4. **Docs + trivial deletions** — LC-23, LC-24, five dead SCSS tokens (LC-09), two
   `projects.json` fields (LC-05). *Housekeeping, batched together; each provable by build hash
   or trivially by reading.*
5. **SCSS color consolidation** — LC-10…LC-12, LC-14 (LC-13 explicitly excluded). *Staged small;
   value-changing decisions (near-black cluster, LC-18 twins) stay separate approval items.*
6. **Breakpoint consolidation (LC-13) — separate, final, standalone task.** *19 breakpoints with
   ±1 clusters around 640/768 changes layout at real device boundaries — not cosmetic, must not
   ride along with batch 5.*

Untracked/deferred (unchanged from Phase 0): LC-15 → now tracked as **LC-32** (suppression made
visible), LC-03 (.jsx rename — recommend never), LC-06 (HDR diet — perf task), LC-25 (graphify —
owner decision), LC-31 (JS color mirror — rides with batch 5 if LC-11 tokens land), LC-27…LC-30
correctness debt items queue behind batch 3 for scheduling.

---

**Status:** Phase 0 approved · Batch 1 (`fix/dependency-correctness`) in flight — recon reported,
edit gated on owner sign-off. Batches 2+ await line-item approval.
