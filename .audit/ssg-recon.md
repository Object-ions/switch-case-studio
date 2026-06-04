# SSG Recon — Phase 0 findings (read-only)

Date: 2026-06-04 · Branch: `ssg/phase-0-recon` · Work order: `~/Downloads/CC-handoff-ssg-migration.md`

## Stack (package.json)

- React 18.3.1 / react-dom 18.3.1, **react-router-dom 6.30.1**, react-router-hash-link 2.4.3
- Vite **5.4.11** + @vitejs/plugin-react 4.3.4 — only build tooling; no other Vite plugins
- Head manager: **react-helmet-async 3.0.0**
- Animation: gsap 3.13, three 0.180 + @react-three/fiber 8.18 + drei 9.122, motion 12.35, typed.js 2.1
- Forms: @emailjs/browser 4.4.1 · UI: @radix-ui/react-hover-card
- Scripts: `dev`/`start` = `vite`, **`prebuild` = `node scripts/generate-sitemap.mjs`**, `build` = `vite build`, plus a `postinstall` shim that fabricates a missing @mediapipe sourcemap (keep — it silences a drei dep warning)
- ~~Version pairing worry~~ **resolved by Moses (Phase 0 review): pin `vite-react-ssg@0.9.0`** — supports React 18 + RR 6 + Vite 5 exactly. No Vite upgrade, no RR7 migration.

## vite.config.js

- JSX-in-`.js` handling: `react({ include: /\.(js|jsx)$/ })` + `esbuild.loader: 'jsx'` for `src/**/*.js` + optimizeDeps loader. **The SSG build renders in Node via Vite SSR transform — confirm the esbuild jsx loader also applies there** (likely yes; verify in Phase 1's first build).
- `build.outDir: "build"` (CRA legacy) — **not `dist`**. Work order says "publish dir stays dist"; in this repo it's `build` and netlify.toml matches. Keep `build` or change both together.
- No build hooks in config; the sitemap runs via npm `prebuild`, which **still fires when `build` becomes `vite-react-ssg build`** (npm pre-script keys on the script name). ✓
- SCSS via modern API, `@import` deprecations silenced.

## Entry (`src/index.js`)

```js
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>);
```
Classic client-only `createRoot`, **no hydration**. Replaced wholesale in Phase 1 by `ViteReactSSG({ routes }, …)`. Note: StrictMode + the `BrowserRouter` wrapper both go away (vite-react-ssg owns the router).

## Routes (`src/App.js`) — React Router 6, JSX `<Routes>` (NOT route records)

24 prerenderable URLs = 7 static + 6 `/pricing/:slug` + 8 `/projects/:slug` + 3 legal (matches sitemap.xml's 24):

| Route | Component | Loading |
|---|---|---|
| `/` | inline `HomeContent` (10 sections) | sync |
| `/about` `/projects` `/projects/:slug` `/pricing` `/pricing/:serviceSlug` `/services` `/testimonials` `/contact` `/privacy` `/terms` `/accessibility` | pages/* | **all `React.lazy`** |
| `*` | `<Navigate to="/" replace />` | — no 404 page exists (Phase 4 needs one) |

Migration notes:
- Must convert JSX tree → route-record format (`path` + `Component`/`lazy` + `children`). Keep lazy via route-record `lazy:`.
- `Layout` wraps everything (MainLayout + `.route-backdrop` theme via `LIGHT_ROUTES` regex + Suspense + keyed `.page-fade`). Becomes the root route element.
- `ScrollToTop`, `RouteAnalytics`, `ConsentBanner` render **outside `<Routes>` but inside the router** (use `useLocation`) — they must move into the root layout route.
- Dynamic params: vite-react-ssg needs the concrete paths for `:slug` routes — supply via its `getStaticPaths`/`includedRoutes` option from `projects.json` (8) + `services.json` (6), the same data the sitemap derives from.
- `HelmetProvider` wraps the app in App.js (see Heads below).

## Head manager (`src/components/util/Seo.js`) — the Phase 3 risk, confirmed

Mechanism: **react-helmet-async `<Helmet>` rendered declaratively in JSX** (quoted: `return (<Helmet><title>{title}</title>…`). It is *not* `useEffect`/`document.title` — but helmet-async still **applies tags via DOM side effects on the client**; static emission only happens if the SSG layer collects `helmetContext` server-side.

**Corrected by Moses (Phase 0 review)** — my unhead claim was wrong: **vite-react-ssg uses react-helmet-async itself**, but bundles **helmet-async 1.x** while the repo runs **3.0.0**. Two copies → two React contexts → vite-react-ssg's server-side collector sees *its* provider while our `<Helmet>` tags register against *ours* — tags silently missing from static HTML (exactly the feared SEO regression). Phase 3 = route `Seo.js` (and drop App.js's own `HelmetProvider`) through **vite-react-ssg's shared helmet provider/import** and resolve the version dedupe. **Verify the actual dependency tree in `node_modules` after install — don't assume.** All 12 consumers pass data props and don't change. Content stays identical per the work order.

- JSON-LD: same component — `jsonLd` prop → `<script type="application/ld+json">{JSON.stringify(...)}</script>` inside `<Helmet>`. Producers: `CaseStudyPage.js` (CreativeWork+Breadcrumb), `PricingPage.js` (Service+Breadcrumb). Goes through the same swap.
- Site-wide Org/WebSite JSON-LD + OG fallback block live **statically in `index.html`** — untouched by SSG; survives as-is. CLAUDE.md rule (no route-variable tags in index.html) still holds after migration.
- One-h1 rule: per-page, already enforced; SSG doesn't change markup. ✓

## Analytics / consent (all SSR-safe ✓)

- `src/analytics/ga.js` — all `window`/`document`/`localStorage` access is **inside functions** (`initGA` even guards `typeof window === "undefined"`). Nothing at module top level except env reads (`import.meta.env` — Node-safe).
- `RouteAnalytics.js` — everything in `useEffect`. ✓ (its MutationObserver watches `<title>` — verify post-migration that unhead still mutates the title node the same way so page_views keep firing).
- `ConsentBanner.js` — `getStoredConsent()` called only inside `useEffect`. ✓ Renders `null` until effect → no hydration mismatch.
- EmailJS — invoked only in the submit handler (`Contact.js` `handleSubmit`). ✓

## SSR-unsafe spots (the Phase 2 worklist)

### Will crash the Node render
1. **`src/components/ui/CursorComponent.js:69`** — `return createPortal(<div…/>, document.body)` in the **render body**. `document` doesn't exist in Node → build crash. (Mounted globally via MainLayout → every route.) Fix: return `null` until mounted (effect-set state), then portal.
2. **`src/components/ui/Moon.js:46`** — `useGLTF.preload("/models/moon.glb")` at **module level**: fires a loader fetch at import time in Node. Moon is `lazy()`-loaded (About section), but SSG resolves lazy components, so it *will* be imported during build. Fix (per Moses, Phase 0 review): **client-gate the entire R3F `<Canvas>`** (mounted-state guard), not just the preload — don't rely on R3F's reconciler being inert under SSR.

### Module-level browser-global constants (guarded — won't crash, but evaluate to a fixed "server" value at import; check for hydration divergence)
3. `src/components/ui/CursorComponent.js:8-10` — `isPointerDevice` = guarded `window.matchMedia('(hover: hover)…')`. Only gates effects → benign, but fold into the mounted-state fix.
4. `src/components/ui/CursorWave.js:31-34` — `IS_TOUCH` = guarded `matchMedia('(hover: none)')`. Used to pick listeners; canvas mounts either way → likely benign; verify no render-path branching.

### Module-level GSAP plugin registration (9 files — gsap tolerates Node import, but per work order move registration client-side)
`gsap.registerPlugin(ScrollTrigger)` at top level in: `sections/AboutText.js`, `AboutMarquee.js`, `AboutHeading.js`, `AboutCTA.js`, `Contact.js`, `Services.js`, `CaseStudyTiles.js`, `LandingPageProof.js`, `Faq.js`, `layout/Footer.js`. Centralize in the entry's `isClient` callback (or leave if the build proves clean — decide in Phase 2 with evidence).

### Render-path browser reads that are already safe (verified, no action)
- `ScrollingShot.js:30-36` — `prefersReduced` in `useMemo` **with `typeof window` guard** → SSR false. Could differ client-side; only affects animation, but watch for a mismatch warning.
- All other hits (`Header`, `StaggeredMenu`, `TextPressure`, `Squares`, `MagneticButton`, `ZoomLightbox`, `Reviews`, `Footer`, `StripeSection`, `CaseStudyTiles`, `Contact`, `ScrollToTop`, `useReducedMotion`, `useScrollLock`, `useBentoSpotlight`, `useBentoParticles`, `bentoEffects.createParticle`) are inside `useEffect`/handlers/callbacks. ✓

### Content gap — decided (Moses, Phase 0 review)
- **`WelcomeTyped.js`**: the hero's animated verb renders an **empty span** until typed.js starts (effect). **SSR-render "build"** (the brand verb, matching the OG copy "built for paid traffic") as initial content; typed.js takes over post-hydration. Same pattern the component already uses for reduced-motion.

### Hydration rule for Phase 2 (Moses, Phase 0 review)
- **Never branch on `window`/`matchMedia` in above-the-fold first-paint render paths.** A server/client divergence there triggers a hydration mismatch → React throws away the server HTML and re-renders — which destroys the LCP win this whole migration exists for. Media-query behavior goes in effects/CSS; render output must be environment-independent.

## Netlify (`netlify.toml` — no `public/_redirects`)

```toml
[build]  command = "npm run build"  publish = "build"
[[redirects]]  from = "/*"  to = "/index.html"  status = 200   # SPA catch-all
```
- Phase 4: drop the catch-all (static files then resolve directly), add a 404 (no 404 route exists today — `*` redirects to `/`), keep `publish = "build"` consistent with `build.outDir`.
- Canonicals are extensionless, no trailing slash (`https://switchcasestudio.com/about`). vite-react-ssg's output style (`/about.html` vs `/about/index.html`) must be set so Netlify serves the canonical URL without a redirect hop — check its `dirStyle`/format option in Phase 4.

## Sitemap (`scripts/generate-sitemap.mjs`)

Pure Node (fs + git), runs on `prebuild`, derives the same 24 URLs from `projects.json` (8) / `services.json` (6). No browser deps → unaffected by SSG. ✓ (Minor pre-existing quirk, not ours to fix now: `servicesMod` reads git history of `src/data/pricingData.json`, which doesn't exist → falls back to today's date.)

## Risk ranking

1. **Phase 3 heads** — the helmet-async **version dedupe** (repo 3.0.0 vs vite-react-ssg's bundled 1.x): two providers = tags silently missing from static HTML. Settle immediately after install (first Phase 1 task), then *physically verify tags in `build/*.html`*.
2. **CursorComponent portal crash** — first build will die here; fix is small and contained.
3. **Route-records migration** — most code motion (App.js restructure + dynamic-path enumeration); mechanical but touches routing for all 24 URLs.
4. **Moon/R3F under Node render** — client-gate the whole Canvas; guard, don't gut.
5. **Hydration mismatches above the fold** — any `window`-branching first-paint render kills the server HTML and the LCP win; sweep in Phase 2, verify zero mismatch warnings.
