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
**Scope extension (batch-2 recon, owner-promoted 2026-07-21):** same defect class found twice
more — `.projects-page__card` (projectsPage.scss:69-72) and `.blog-page__card`
(blogPage.scss:70-73) declare `transition: … transform 0.3s ease …` on the same nodes where
motion `cardVariants` (and /projects `whileTap`) write inline transforms. Two instances is a
pattern: batch 3 fixes all three together (narrow each transition's property list so the
library-owned property isn't CSS-transitioned).

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

#### LC-26 — Batch 2 recon (2026-07-21, RECON ONLY — no branch, no src edits)

**Freshness verdict: LC-26 is CURRENT on `main` @ `522fe94`.** PR #6 (`e6170e0`, merged
`441267c`) is SCSS-only — 16 scss files + 1 CLAUDE.md line, all `font-family: $font-special →
$font-text` swaps on card titles / stat values / CTA headings. Zero JS files touched; the five
page components, `motionVariants.js`, and the `__title` h1 classes' hide mechanism are untouched
(scoped diff verified — the swapped selectors are `&-title`/`&-heading`/`&-name` card-level
elements, not the page `__title` h1s). Fresh build from current `main` (post-batch-1) re-greps
identically on all five routes:

```
about         <h1 class="about-page__title"        style="opacity:0;clip-path:inset(0 0 100% 0);transform:translateY(24px)">
testimonials  <h1 class="testimonials-page__title" style="opacity:0;clip-path:inset(0 0 100% 0);transform:translateY(24px)">
projects      <h1 class="projects-page__title"     style="opacity:0;clip-path:inset(0 0 100% 0);transform:translateY(24px)">
blog          <h1 class="blog-page__title"         style="opacity:0;clip-path:inset(0 0 100% 0);transform:translateY(24px)">
services      <h1 class="service-index__title"     style="opacity:0;clip-path:inset(0 0 100% 0);transform:translateY(24px)">
pricing ref   <h1 id="pg-title" class="pg-h1 pg-animate">                        ← visible, unchanged
```

**Scope correction: the defect is the whole header block, not just the h1.** On every route the
kicker `<p>`, `<h1>`, and lede `<p>` are all `lineVariant` children of a `headerVariants`
stagger parent — all three ship the same hidden inline style. The fix unit is the header block.

**Per-route table** (all five: `initial="hidden" whileInView="visible"
viewport={{once:true, amount:0.3}}` on the `motion.header`, `lineVariant` on the three children;
serialized style identical: `opacity:0;clip-path:inset(0 0 100% 0);transform:translateY(24px)`):

| Route | Component (h1 line) | Reduced-motion mechanism | RM correct today? | CSS conflict on header props | CLS surface |
|---|---|---|---|---|---|
| /about | `AboutPage.js:93` (header :83-103) | `v()` nulls variants on parent+children (`:70`) | yes (client) | none | paint-only |
| /testimonials | `ReviewsPage.js:37` (header :27-46) | **DIVERGENT+BROKEN**: parent `variants={reducedMotion ? undefined : headerVariants}` but children keep UNWRAPPED `lineVariant` and the `{...animate}` spread is a no-op both branches (`const animate = reducedMotion ? {} : undefined` — spreading `{}` or `undefined` does nothing, `ReviewsPage.js:16`). Reduced-motion users still get the full hidden→wipe animation on the header children | **no — latent RM defect** | none | paint-only |
| /projects | `CaseStudiesPage.js:41` (header :31-47) | `v()` (`:19`) | yes (client) | none | paint-only |
| /blog | `BlogPage.js:76` (header :66-83) | `v()` (`:34`) | yes (client) | none | paint-only |
| /services | `ServiceIndexPage.js:88` (header :78-96) | `v()` (`:69`) | yes (client) | none | paint-only |

Notes on the table:
- "RM correct today (client)" refers to hydrated behavior only — during SSG, `useReducedMotion()`
  returns `false` in Node, so `v()` passes real variants and the hidden state serializes for
  EVERY visitor regardless of their OS setting. That is the LC-26 defect itself.
- **CSS conflict check (header elements): CLEAN on all five.** Every `transition:` in the five
  page stylesheets targets cards/links/CTA buttons (aboutPage.scss:168,208,266,295,355;
  testimonialsPage.scss:72,176; projectsPage.scss:69,99,186,221; blogPage.scss:70,95,201,236;
  serviceIndexPage.scss:110) — none touch `__kicker`/`__title`/`__lede`. Option A introduces no
  double-owner on the header.
- Pre-existing, OUT OF SCOPE (informational, do not fold into batch 2):
  `.projects-page__card` and `.blog-page__card` declare `transition: … transform 0.3s ease …`
  (projectsPage.scss:69-72, blogPage.scss:70-73) on the same nodes where motion `cardVariants`
  writes inline transforms — same conflict class as LC-16. Queue with LC-16's batch if desired.
- **ScrollTrigger cleanup:** none of the five pages currently create any GSAP/ScrollTrigger
  (motion-only pages — no gsap import). The fix ADDS one; it must carry the full PricingGuide
  cleanup (`trigger.kill() + safety.kill()` in the context cleanup + `ctx.revert()` on unmount —
  reference `PricingGuide.js:96-116`).

**Option A mechanism — CONFIRMED, with two revisions:**
1. (unchanged) Strip `motion.*`/variants from the header block on each route; plain
   `<header>/<p>/<h1>/<p>` ships in static HTML with zero inline style. Client-side `useEffect`
   applies the PricingGuide safe-reveal to a `.page-head-animate` (name TBD) class: reduced →
   `gsap.set(items, {clearProps:'all'})` early-return; else `gsap.set(autoAlpha:0, y:REVEAL_Y)` →
   `ScrollTrigger.create({once, onEnter:reveal})` + immediate reveal when already in view +
   `delayedCall` safety net; cleanup kills trigger+safety, `ctx.revert()` on unmount. GSAP is
   sole owner of `autoAlpha`/`y` on header nodes (CSS conflict check above: clean); `clip-path`
   is dropped entirely (paint flourish not worth a second contested property; PricingGuide
   doesn't use it either).
2. (revision) **ReviewsPage additionally sheds its broken RM mechanism** — the no-op
   `{...animate}` spread and unwrapped child variants go away WITH the motion header, fixing the
   latent reduced-motion defect as a side effect of the same edit, not as an extra scope item.
3. (revision) The five effects are near-identical — implement as one shared hook (e.g.
   `src/hooks/usePageHeaderReveal.js`, consuming `motionTokens.js` constants like PricingGuide
   does) with five one-line consumers, rather than five pasted copies. Approvable as its own
   pre-item below; if rejected, the fallback is five per-page copies of the PricingGuide effect.

**CLS risk surface:** identical on all five routes — the hidden state is `opacity` (paint),
`clip-path` (paint), `translateY(24px)` (transform; composited, displaces nothing in flow), so
the header's box geometry in today's broken HTML is already final; shipping it visible changes
pixels, not layout, and nothing below the header (lede, grids) can reflow from the change. The
replacement reveal (`autoAlpha`+`y`) is equally flow-inert. Prediction stands at ≈0 — and per
the carry-forward note above, the prediction does not waive the gate: **median-of-3 PSI,
desktop, prod, branch vs `main` (owner's captured `main` baseline as reference), before merge.**
Local Lighthouse directional only.

**Exact pass condition (against built output, not a browser):**
```
grep -o '<h1[^>]*>' build/about.html build/testimonials.html build/projects.html build/blog.html build/services.html
! grep -E '<(h1|p)[^>]*style="[^"]*opacity: ?0' build/about.html build/testimonials.html build/projects.html build/blog.html build/services.html
grep -o '<h1[^>]*>' build/pricing/web-development.html   # invariant: still visible
```
Pass per route = the `<h1>` (and the kicker/lede `<p>`s — hence the second grep covering both
tags) carries NO inline `style` containing `opacity:0`/`clip-path`/`translateY`; expected form
`<h1 class="…__title page-head-animate">`. All five paths verified to exist first (BSD grep
exit-2 rule). Pricing invariant unchanged.

**Proposed change list — one approvable item per route (STATUSES per owner sign-off 2026-07-21):**
- **LC-26-pre — APPROVED** — shared `usePageHeaderReveal` hook (PricingGuide pattern,
  motionTokens constants, full cleanup). **Recorded tradeoff: a shared hook means all five
  routes fail together if it's wrong — which is why it gets verified on ONE route (LC-26a
  pilot) before the rest adopt it.** No route behavior until consumed.
- **LC-26a — /about — APPROVED (pilot)**: AboutPage.js:83-103 header → plain elements + hook.
  Ships with the pre-item; PSI reconciliation runs on /about ALONE (median-of-3, desktop, prod,
  branch vs the owner's captured `main` baseline) and must match the ≈0 CLS prediction before
  b–e adopt.
- **LC-26b — /testimonials — HELD** (approved in principle, released after 26a verifies green):
  ReviewsPage.js:27-46 header → plain elements + hook. Includes the LC-34 reduced-motion fix —
  which does NOT ride silently: own line in the commit body, own doc entry (LC-34 below).
- **LC-26c — /projects — HELD**: CaseStudiesPage.js:31-47 header → plain elements + hook.
- **LC-26d — /blog — HELD**: BlogPage.js:66-83 header → plain elements + hook.
- **LC-26e — /services — HELD**: ServiceIndexPage.js:78-96 header → plain elements + hook.
- **clip-path dropped from the reveal — APPROVED.**
- Sequencing: one branch off current `main`; pre+26a first; b–e land as ONE follow-up commit on
  the same branch after the 26a gate. Pass condition covers all three header elements (kicker,
  h1, lede), not the h1 alone, plus the pricing invariant.
- The `.projects-page__card`/`.blog-page__card` transform conflict is NOT informational —
  **promoted to batch 3 with LC-16** (owner: two instances is a pattern; see LC-16 scope
  extension).

#### LC-26a — pre-commit verification round (2026-07-21, owner conditions 1-5)

**Hook corrections applied before commit:**
- **Double-reveal fixed (owner condition 1) — adjudicated by instrumented test, not reasoning.**
  Manual already-in-view fallback REMOVED; ScrollTrigger's creation-time evaluation fires
  `onEnter` itself. Instrumented `reveal()` on cold loads of /about (production build, local
  preview): `revealCount: 1` at **588ms**, **353ms**, **1035ms** across three cold loads (all ≪
  the 3000ms safety window, so trigger-fired, not net-fired; the old code would have counted 2).
  **This contradicts the CLAUDE.md CaseStudyTiles clause "an already-past `once` trigger won't
  fire `onEnter`"** — empirically false for a trigger created at hydration on a top-of-route
  element in this GSAP version; scope note to be added to CLAUDE.md at commit.
- **Safety net guarded (condition 2):** fires only when `!items.some(gsap.isTweening)` AND
  something is still hidden — an in-flight reveal no longer restarts.
- **ScrollTrigger registration (condition 3) confirmed:** `src/index.js:18`
  `gsap.registerPlugin(ScrollTrigger)` inside the `ViteReactSSG(({isClient}) => …)` bootstrap —
  executes at app startup before any route effect; same path PricingGuide already relies on.

**Browser verification (production build via `vite preview`, Chrome):**
- Console: **zero messages** on full load of /about — no hydration errors (#418/#422/#425 absent).
- Flash-of-visible-then-hidden (condition 5): at local speed the reveal fires BEFORE first paint
  (reveal 353ms < FCP 464ms) — **zero visible flash**; the first painted frame is already the
  entrance. The artifact only materializes when JS lags paint (throttled/slow devices): header
  visible for (JS-delay − FCP), then blinks out and re-animates ~0.55s — same accepted profile
  as PricingGuide, bigger element. **Environment limits disclosed:** CPU/network throttling and
  true 390px width are not drivable through the extension (window manager ignored sub-500px
  resizes); verified at 500px (mobile breakpoint active): reveal 1×@1035ms, all elements
  opacity 1, layout correct. The throttled-flash pixel judgement at true 390 remains for the
  owner's device pass.
- LCP note (condition 4): local run reports the LCP element as `footer-wordmark__text`, not the
  h1 — local-window artifact; the h1-as-LCP question is answered by the PSI comparison.

**PSI BASELINE — captured 2026-07-21 via pagespeed.web.dev UI (API anon quota 429'd), desktop,
production https://switchcasestudio.com/about (= pre-change `main`), 3 runs:**

| Run | Perf | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| 1 (`exvg2cbp9o`) | 43 | 0.7s | 0.7s | 2,080ms | 0.609 | 2.1s |
| 2 (`r7odllwbd2`) | 78 | 0.5s | 0.5s | 30ms | 0.609 | 0.7s |
| 3 (`72fd8gwuts`) | 88 | 0.5s | 0.5s | 20ms | 0.608 | 0.8s |
| **median** | **78** | **0.5s** | **0.5s** | **30ms** | **0.609** | **0.8s** |

(Mobile run 1 for reference: Perf 88. Run-1 desktop TBT 2,080ms is an outlier — runs 2-3 say
20-30ms.)
**Baseline finding — desktop CLS 0.609 is deterministic (×3) and PRE-EXISTING, dominated by the
very header LC-26a rewrites:** PSI layout-shift culprits attribute **0.449 to
`<header class="about-page__hero">`** with Inter web-font rows (`Inter-800.woff2`,
`Inter-300.woff2`) cited — i.e. **font-swap reflow of the header text**, NOT the hide/reveal
mechanism (paint-only) — plus **0.150 to `<main>`** (consent-banner insertion), and unsized-flag
noise on team photos. Neither cause is touched by this branch, so the gate comparison expects
branch CLS ≈ 0.609 (unchanged); any IMPROVEMENT would be incidental. The 0.609 itself is a new
standalone finding for the ledger (worst known desktop CLS on the site; home was ~0.107) —
candidates: size-adjusted fallback audit for the about header faces + banner slot reservation.
Owner to run the BRANCH side of the median-of-3 after push (I cannot deploy).

**Push + preview attempt (2026-07-21, post-approval):** branch pushed
(`origin/fix/ssg-visible-headers` @ `4608036`). **No Netlify build exists for it** — the
predictable branch-deploy URL (`fix-ssg-visible-headers--switchcasestudio.netlify.app`) 404'd
for 5+ minutes (site slug verified: `switchcasestudio.netlify.app` → 200), no PR exists (none
opened — owner gate), commit status API shows `pending` with zero attached statuses → Netlify
only builds this repo's production branch and PR deploy previews; ad-hoc branch deploys are not
enabled. Netlify CLI present but not logged in. **Set B blocked pending one of:** (1) enable
branch deploys for this branch in the Netlify UI, (2) authorize a PR (auto deploy-preview), or
(3) `netlify login` for a CLI draft deploy (builds with site env — faithful to prod per house
note). Set A NOT pre-run in full — the A/B control requires same-session back-to-back runs.
**Banked meanwhile (single drift spot-check + LCP element identification, PSI desktop prod
/about, run `tbtahye033`):** Perf 87, FCP 0.5s, LCP 0.5s, TBT 10ms, **CLS 0.608** (baseline
holds today), LCP breakdown TTFB 30ms + render delay 600ms, and **LCP element =
`span.footer-wordmark__text`** — the giant sticky-footer outline wordmark, matching the local
report exactly. The earlier "window-size artifact" hypothesis is RETRACTED: the footer wordmark
genuinely is the desktop LCP element on /about (the h1 cannot be — prod ships it hidden until
hydration). Implication for Set B: h1 becoming visible-at-paint should not displace a 186K-px
candidate; expectation stays LCP element/time unchanged — verify per run, don't assume.

#### LC-26a — POST-MERGE PSI RECONCILIATION ✅ PASS (2026-07-21, prod, merge `1b570b3`)

Owner merged the branch to `main` (PR #9, merge `1b570b33e1…`), obsoleting the preview-vs-prod
environment mismatch — prod /about is now directly comparable to the captured baseline. Note:
the measured artifact also includes PR #8 (dependabot, `vite ^7.3.5→^7.3.6` — build-tool patch,
no runtime bundle change expected) which merged just before.

**Live-artifact pass conditions (production, path-guarded curl):** /about serves
`<h1 class="about-page__title page-head-animate">` + kicker + lede with NO inline hidden state
(PASS); pricing invariant `<h1 id="pg-title" class="pg-h1 pg-animate">` unchanged; **31/31
routes → 200** on production.

**Same-session control (pre-merge prod, run `tbtahye033`, ~30min before deploy):** Perf 87 /
FCP 0.5s / LCP 0.5s / TBT 10ms / **CLS 0.608** / SI 0.7s / LCP el `span.footer-wordmark__text`
— baseline held on the day; no drift.

**Post-merge production, desktop, median-of-3:**

| Run (report id) | Perf | FCP | LCP | LCP element | TBT | CLS | SI |
|---|---|---|---|---|---|---|---|
| 1 `rjbabfpgmr` | 77 | 0.3s | 0.3s | span.footer-wordmark__text | 80ms | 0.609 | 0.7s |
| 2 `jdijfgvtyq` | 78 | 0.4s | 0.4s | span.footer-wordmark__text | 20ms | 0.609 | 0.6s |
| 3 `2din2gph5a` | 78 | 0.5s | 0.5s | span.footer-wordmark__text | 10ms | 0.609 | 0.7s |
| **median** | **78** | **0.4s** | **0.4s** | — | **20ms** | **0.609** | **0.7s** |

**Delta vs baseline (median | baseline → post-merge):** Perf 78 → 78 (0) · FCP 0.5 → 0.4s
(−0.1, run noise) · LCP 0.5 → 0.4s (−0.1, run noise — no regression) · TBT 30 → 20ms (noise) ·
**CLS 0.609 → 0.609 (0.000) — explicit PASS against the ≈0.609 expectation** · SI 0.8 → 0.7s.
**LCP element verdict: unchanged** — `span.footer-wordmark__text` on every run, both sides; the
newly-visible h1 did NOT register a later LCP candidate (LCP actually ticked down within
noise). CLS culprit decomposition post-merge is byte-identical to baseline
(`about-page__hero → 0.449`, `main → 0.150`) — confirming LC-35's causes are untouched, as
predicted. Perf-gauge caveat: the DOM score extraction is unreliable (grabs the hidden panel's
gauge); scores above read from the visible desktop gauge in screenshots.

**Rollback path (recorded for findability under pressure):**
`git revert -m 1 1b570b33e1225e4a56964c3b3faa76c9093dbcf1` on `main`.
What that RESTORES (the explicit tradeoff): the five... four held routes are unaffected either
way, but /about goes back to shipping its h1/kicker/lede `opacity:0` in static HTML (the LC-26
SEO/no-JS defect returns), the `usePageHeaderReveal` hook is deleted, and LC-34's broken
reduced-motion guard returns on /testimonials (RM users get the header animation again). CLS
would stay 0.609 either way (LC-35's causes are independent). Revert only makes sense if the
reveal itself misbehaves on real devices — the throttled true-390 pass is the open judgement.

**Batch-1 verification closure status (LC-19/LC-20): CLOSED 2026-07-21 — not answerable via
deploy log.** Owner read the Netlify log for `56288a0`: `npm ci` prints `added N packages in
Ns` WITHOUT enumerating names — `prop-types` appears nowhere (expected), and every
`vite-react-ssg` hit is a build-command invocation (`> vite-react-ssg build`,
`[vite-react-ssg] Build for client...`), not an install line. The log cannot distinguish
dependency classification; no amount of access closes this strand by that route. **Binding
evidence is and remains the batch-1 local clean-install simulation** (`rm -rf node_modules &&
npm ci && npm run build`, 31 routes, asset hashes unchanged) — stronger than a log line would
have been. Recorded so nobody reopens this looking for the log. Confirmed from the log while
there: Vite 7.3.6, 31 pages rendered, build green in 13.4s, flat path shape
(`build/about.html` etc.).

### LC-35 — Prod /about desktop CLS 0.609: deterministic, pre-existing, worst known on the site
Category: Correctness (performance) — OPENED 2026-07-21, DO NOT ACT (owner-directed record only)
Files: `src/styles/components/aboutPage.scss` (header text faces), `src/analytics/ConsentBanner.js` + `src/routes.js:105` (sitewide mount), fonts in `public/fonts/`
Evidence — PSI desktop, production https://switchcasestudio.com/about, 3 runs 2026-07-21
(pagespeed.web.dev UI; run IDs exvg2cbp9o / r7odllwbd2 / 72fd8gwuts):

| Run | Perf | FCP | LCP | TBT | CLS | SI |
|---|---|---|---|---|---|---|
| 1 | 43 | 0.7s | 0.7s | 2,080ms | 0.609 | 2.1s |
| 2 | 78 | 0.5s | 0.5s | 30ms | 0.609 | 0.7s |
| 3 | 88 | 0.5s | 0.5s | 20ms | 0.608 | 0.8s |
| **median** | **78** | **0.5s** | **0.5s** | **30ms** | **0.609** | **0.8s** |

CLS 0.609 is deterministic (±0.001 across three runs) and exceeds the Core Web Vitals "poor"
threshold (0.25) by ~2.4×. PSI's layout-shift culprits:
- **0.449 — `<header class="about-page__hero">`**, with Inter web-font rows cited
  (`Inter-800.woff2`, `Inter-300.woff2`) → **font-swap reflow of the header text**. The
  paint-only hide/reveal (old motion or new GSAP alike) is NOT the cause — opacity/clip-path/
  transform shift nothing.
- **0.150 — consent banner insertion shifting `<main>`**.
- Noise: team photos flagged despite explicit width/height attributes.
Neither cause is touched by branch `fix/ssg-visible-headers`; **the LC-26a gate expectation is
branch CLS ≈ 0.609 unchanged** — any improvement would be incidental.
**Failure-class note:** the font-swap component is the same class the SCS Display size-adjust /
metric-fallback work addressed — fallback metrics not matching the real face, text reflowing at
swap. The 'Inter Fallback' size-adjusted face exists (font-critical-path, 2026-06-08) yet PSI
still attributes shift to Inter loads here — whether the fallback isn't covering these
weights/elements, or the `$font-special` h1 (which has NO metric fallback) is the real mover
with Inter co-cited, is UNESTABLISHED. The empirical in-browser size-adjust method applies. Do
not start this work.
**Cross-page check (grep-level, per owner — no PSI run):** the 0.609 pattern is structurally
expected on ALL five standalone pages, not singular to /about — identical header anatomy
(`$font-special` `__title` + `$font-text`/Inter `__kicker`/`__lede` on all five, verified in
each page's scss) and the consent banner mounts sitewide (`routes.js:105`, every route).
Per-page PSI confirmation pending, deliberately not run yet.
Verdict: LIVE bug (pre-existing; independent of batch 2)
Proposed change: none yet — future item: size-adjust audit for the header faces (incl. whether
SCS Display needs its own metric fallback) + consent-banner slot reservation. Its own branch,
its own PSI verification.
Risk: don't touch (this batch)
Blast radius: header text rendering on 5+ routes; banner layout sitewide

### LC-36 — Prod /about LCP: 600ms element render delay against 30ms TTFB
Category: Correctness (performance) — OPENED 2026-07-21 (owner-directed; originally dropped
from the batch-2 PR-workflow message when the merge reordered the flow). DO NOT ACT, record only.
Element: `span.footer-wordmark__text` (sticky footer outline wordmark, ~186K px)
Evidence: PSI desktop prod LCP breakdown — TTFB 30ms + **element render delay 600ms** (run
`tbtahye033`; post-merge run `rjbabfpgmr` shows the same shape, 30ms + 630ms). LCP element
confirmed unchanged across all six runs (three baseline, three post-merge).
Finding: a 600ms render delay against a 30ms TTFB is not a network problem — the element is
waiting on something: font load (the wordmark renders in a display face), JS/hydration, or
paint order. **Candidate causes only; nothing established.** Also unexamined: why a
bottom-of-page sticky footer element is the desktop LCP candidate at all (viewport-visibility
at initial paint is implied but unverified).
Note: same category as LC-35 — a production performance finding this audit surfaced
incidentally, not batch-2 work.
Verdict: LIVE (pre-existing behavior; unmoved by LC-26a — verified)
Proposed change: none — record only. Any investigation is its own item.
Risk: don't touch
Blast radius: n/a (observation)

### LC-37 — esbuild 0.27.7 → 0.28.1: residual advisories now clearable by routine update
Category: Dependency — OPENED 2026-07-21, APPROVAL-GATED, NOT EXECUTED
Files: `package-lock.json` only
Evidence: vite 7.3.6 (PR #8) widened its esbuild range to `^0.27.0 || ^0.28.0` — the 0.28.1
fix version for GHSA-gv7w-rqvm-qjhr (high, Deno module) and GHSA-g7r4-m6w7-qqqr (low, Windows
dev server) is now in-range; the lockfile still resolves 0.27.7. The 2026-06-15 acceptance
rationale was never severity — it was that the fix was unreachable without a Vite major; that
rationale is now obsolete (see summary.md status update, same date).
Proposed change (scope, exact):
- `npm update esbuild` — lockfile-only. **`npm audit fix` and `--force` remain banned.**
- Target 0.28.1+; confirm BOTH advisories clear (`npm audit` shows 0 for these two).
- Verification: clean-install sim (`rm -rf node_modules && npm ci && npm run build`), 31
  routes by filesystem count, and **asset content-hash comparison against current `main`** —
  esbuild is pre-1.0, so 0.27→0.28 is a minor bump that can still carry breaking output
  changes even inside Vite's declared range. **The hash comparison is the real check, not the
  build exit code.** Any hash drift = inspect the diff before concluding anything.
Verdict: actionable, queued
Risk: safe-if-hashes-hold; needs the hash gate precisely because pre-1.0 minors can break
Blast radius: every built asset (esbuild transforms all src); dev server; SSG render

### LC-38 — Sitemap 28 URLs vs 31 rendered routes: all three exclusions DELIBERATE — no SEO defect
Category: Correctness (SEO) — investigated 2026-07-21, NO FIX (record only, per owner)
Files: `scripts/generate-sitemap.mjs`, `public/sitemap.xml` (generated)
Evidence: deploy log `sitemap.xml: 28 URLs written` vs `Rendering Pages... (31)`. Route-set
diff (rendered build/ HTML basenames vs live sitemap `<loc>`s): exactly **`/30-off`,
`/partners`, `/404`**. Live cross-check: `switchcasestudio.com/sitemap.xml` serves 28 URLs;
all three absent (verified individually). Exclusion logic: the generator builds its URL list
from explicit entries + data files only (`generate-sitemap.mjs:50-77`); hidden routes are
deliberately not listed — documented in the script comment (`:47-49`).
Per-route verdict:
- **`/404` — correct by definition.** Error page; never sitemapped.
- **`/30-off` — deliberate and documented.** Promo funnel, `noindex`, linked only from
  emails/ads; the script comment names it.
- **`/partners` — deliberate, and MORE than a judgement call in practice:** it is
  `noindex,nofollow` at the HTTP layer (`netlify.toml` X-Robots-Tag) + page `<Seo>` robots.
  Sitemapping a noindex URL would be a contradiction crawlers flag, so exclusion is the
  consistent choice. If the owner ever wants /partners discoverable, that's a
  positioning decision first, sitemap second.
**No route is excluded by accident — no live SEO defect; nothing promoted.**
Cosmetic doc-rot found in passing: the script comment (`generate-sitemap.mjs:47`) still
describes partners as "served from an unguessable `/p/wm-…` slug" — that link-gate was
replaced by the password gate at `/partners` (`feat/partners-password`). Comment-only fix,
queue with batch-4 housekeeping.
Verdict: LIVE and correct
Proposed change: none (comment fix queued to docs/housekeeping batch)
Risk: n/a
Blast radius: n/a

### LC-39 — Build chunk-size warning: two CLIENT chunks over 500 kB (record only)
Category: Correctness (performance) — record only, NO manualChunks work
Files: build output (vite chunking)
Evidence (current `main` build + deploy log line 103 agree):
- `build/assets/Moon-Cdr-5ERC.js` — **989.04 kB** (gzip 272.69 kB) — CLIENT chunk, over the
  limit; ships to users but ONLY via the IO-gated lazy import when the About moon slot
  approaches the viewport (never in the initial load — the documented MoonSlot pattern).
- `build/assets/app-q3zBkI08.js` — **699.87 kB** (gzip 237.24 kB) — CLIENT chunk, over the
  limit, ships to EVERY visitor in the initial load. This is the known "~3MB JS / mobile LCP
  is JS-bound" carry-forward from the perf plan (summary.md), not news — recorded here so the
  warning line has a ledger home.
- `index.mjs` ~480 kB — SSR server bundle, never ships to users, and under the limit anyway.
Verdict: known debt, tracked elsewhere (perf plan step: trim bundle / defer hero WebGL)
Proposed change: none — no manualChunks work in this audit
Risk: don't touch
Blast radius: n/a

#### LC-26a — Production timing capture: paint-vs-hide gap (2026-07-21)

**Environment constraint, disclosed up front:** the automation Chrome window was OCCLUDED for
these runs (`document.visibilityState: "hidden"`, rAF verified frozen) — the exact CLAUDE.md
occluded-window condition. Consequences observed live and worth their own record:
- With no frames, the page NEVER paints (paint entries empty; FCP fired at 53.9s = the moment
  a screenshot forced the first frame) and the GSAP ticker is frozen, so the run-1 probe found
  the header at `opacity:0` 6s after load — **a false stranding**: forcing frames resumed the
  ticker and the reveal played correctly (caught mid-stagger: kicker 0.59 → title 0.17 → lede
  queued). NOT a production bug; mechanism proven end-to-end.
- **New rule-refinement candidate:** `gsap.delayedCall` safety nets are ALSO ticker-driven —
  on a background-tab load the net cannot fire until the tab becomes visible. Acceptable
  (invisibility without frames is unobservable, and the reveal completes on tab-switch), but
  "the safety net guarantees visibility by T+3s" is only true on a foreground tab.

**What IS measurable occluded (JS timeline is rAF-independent), 3 cold loads, ms from nav:**

| Run | app chunk fetch (start→respEnd) | hydration long task (start+dur → end) | ≈hide executes |
|---|---|---|---|
| 1 (cold cache) | 395 → 901 | 1215+325 → 1540 | ~1540 |
| 2 (semi-warm) | 300 → 603 | 893+393 → 1286 | ~1286 |
| 3 (warm) | 69 → 190 | 310+179 → 489 | ~489 |

("≈hide" = end of the hydration long task; `usePageHeaderReveal`'s effect runs in the effects
flush of that commit and `gsap.set` is synchronous inside it — a derivation, not a direct
timestamp; labeled as such.)

**The derived number, honestly constructed (cross-source, caveated):** FCP on a VISIBLE load
of this page is 0.3–0.5s (PSI prod desktop, median 0.4s; local visible-tab run measured 464ms).
Hide lands at ≈0.5–1.5s depending on cache (median cold-ish ≈1.3s). So on production:
**the hide happens ≈ +0.1s (warm) to +1.1s (cold), ≈ +0.9s typical, AFTER first paint — N is
POSITIVE on prod.** This REVERSES the local-preview finding (reveal before paint): that was a
same-origin instant-network artifact; on the real network the app chunk fetch pushes hydration
past paint. Answering the owner's threshold question in its real form: **JS does not need to
be "slower" for the artifact to appear — it already appears on every prod cold load** (header
visible ~0.1–1.1s, blink, ~0.56s staggered re-entrance). The artifact only DISAPPEARS when
hydration beats paint (warm cache + instant network, e.g. local preview). The device-pass
judgement is therefore not "does it happen" but "how does a ~1s-visible → blink → re-enter
sequence read" — and throttling lengthens only the visible phase, not the blink.
**The one number this capture could not produce single-environment: same-run FCP+hide. A
visible-window rerun (owner keeps Chrome frontmost ~2 min) upgrades N from estimate band to
measurement — optional.**

**Narrow-viewport reveal sequence — ACTUAL WIDTH 500px (window manager floor; NOT 390 — floor
confirmed twice: resize accepted, `innerWidth` stayed 500):** forced-frame progression under
the frozen ticker (each screenshot advances the tween — house rule applied deliberately as the
capture mechanism, since 150ms wall-clock intervals are impossible at ~1s/screenshot):
frame 1 = kicker fully in, h1 mid-rise dim, lede absent → frame 2 = h1 ~in, lede rising →
frame 3-4 = settled. Final probed state: kicker/title/lede opacity 0.99+/0.99/0.91→1,
transforms → 0, all `visibility: visible` — nothing stuck. **Stagger verdict at 500px: reads
as an intentional top-down cascade (kicker → h1 → lede), not a glitch** — with the standing
caveat that motion FEEL is the owner's visible-window judgement per house rule; frame-stepped
capture verifies order and end-state, not tempo.

### LC-33 — motion/react consumer census (batch 2 recon)
Category: Dependency
Files: 12 import sites (all `motion/react`; no `framer-motion` imports — only two comments
citing snippet provenance: HoverPeek.js:10, MagneticButton.js:13, SinglePricingCard.js:18):
```
pages:    AboutPage.js:3, BlogPage.js:3, CaseStudiesPage.js:3, ReviewsPage.js:2, ServiceIndexPage.js:2
sections: Reviews.js:8
ui:       GradientText.js:8, HoverPeek.js:3, MagneticButton.js:7, ServiceRow.js:2, SinglePricingCard.js:3
```
Evidence: the five page headers are NOT the last consumers — even after LC-26 strips motion from
the headers, the same five pages keep motion on their grids/CTAs, and six other components
(Reviews, GradientText, HoverPeek, MagneticButton, ServiceRow, SinglePricingCard) use it
independently. `motion` (^12.35.0) remains a live dependency.
Verdict: UNCERTAIN (removability is a distant question contingent on migrating 11 remaining
consumers — its own item, its own bundle-size story, its own branch; NOT part of batch 2)
Proposed change: none — informational
Risk: don't touch
Blast radius: n/a (census only)

### LC-34 — ReviewsPage reduced-motion guard is a no-op: reduced-motion users get the full header animation
Category: Correctness (accessibility)
Files: `src/components/pages/ReviewsPage.js:16` (`const animate = reducedMotion ? {} : undefined;`),
`:34,:37,:42` (`{...animate}` spreads), `:29` (parent `variants={reducedMotion ? undefined : headerVariants}`)
Evidence: spreading `{}` or `undefined` are BOTH no-ops, so `{...animate}` never does anything;
and while the parent's variants are nulled under reduced motion, its `initial="hidden"
whileInView="visible"` labels still propagate to the children, whose `variants={lineVariant}`
are UNWRAPPED — so the kicker/h1/lede run the full hidden→wipe entrance for reduced-motion users
in production today. The other four pages' `v()` wrapper nulls variants on parent AND children,
which is why they behave. Independent of LC-26 (this is who-gets-animated; LC-26 is
what-ships-in-HTML) — found during batch-2 recon, owner-directed to stand on its own terms.
Verdict: LIVE bug (a11y — violates the house zero-gap reduced-motion rule)
Proposed change: ~~ships WITH LC-26b~~ **SPLIT OUT — ships in the 26a batch as its OWN commit**
(owner offered the choice 2026-07-21; decided deliberately). Reason: a live accessibility defect
had been gated behind LC-26b's pilot verification, a dependency it doesn't have. The minimal fix
(delete the no-op `animate` spread; wrap the three child variants in a `v()` null-guard matching
the other four pages) changes only reduced-motion conditional wiring — SSG renders with
`reducedMotion=false`, so serialized HTML is byte-identical and the fix cannot contaminate the
/about PSI pilot. LC-26b later deletes the whole patched block wholesale and supersedes this.
Own commit = findable in history on its own terms.
Risk: safe (strictly less animation for RM users; zero static-HTML change — verified by
testimonials.html hidden-state invariant in the batch build)
Blast radius: /testimonials header for reduced-motion users

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
