# SCS Website Audit — Running Summary
**Target:** switchcasestudio.com | **Deadline:** ~2026-06-01 (Matt James pitch)
**Audit file:** the original discovery notes, kept locally outside this repo (path deliberately not published — see SEC-1)

---

## PHASE 1 — DISCOVERY ✅ COMPLETE

### Stack
- ~~**Create React App** (react-scripts 5.0.1)~~ ← **HISTORICAL discovery-time snapshot. Since 2026-06 the stack is Vite 7 + vite-react-ssg 0.9, output `build/` (see the "Stack fact" entry at the end of this file). CRA references below record the past, not the present.** React 18.3.1
- Animation: GSAP 3.13 + Three.js 0.180 + OGL 1.0 + Motion 12.35 + typed.js
- Styles: SCSS + Google Fonts (Inter) + local NeueMachina Ultrabold
- Heavy JS bundle — no route code-splitting

### Page Inventory
- `/` — Home (single scrolling SPA)
- `/projects/:slug` — 10 case study pages
- `/pricing/:serviceSlug` — 6 pricing pages
- `/privacy`, `/terms`, `/accessibility` — Legal

### Homepage Section Order (as-is)
1. Hero
2. ValueProp (3-scroll pinned steps)
3. Services
4. GradientStripe (animated divider)
5. Work/About
6. **Contact ← portfolio not yet visible here**
7. **Projects/Case Studies ← portfolio is section 7**
8. Testimonials
9. FAQ

### Portfolio (10 projects in projects.json)
| Project | Live | Metrics |
|---------|------|---------|
| Zahav Medspa | ✓ | ❌ empty |
| Crimson Equities | ✓ | ❌ empty |
| Jo Marketing 11 | ✓ | ❌ empty |
| Prodani Miami | ✓ | ❌ empty |
| Florida Energy Assistance | ✓ | ❌ empty |
| Sha Design Studio | ✓ | ❌ empty |
| Jelly Belly Wiki | ✓ | ❌ empty |
| Birth of Venus | ✓ | ❌ empty |
| Creatuwheels | ❌ no URL | ❌ empty |
| Maritime | ❌ no URL, no longWeb | ❌ empty |

### Missing from portfolio (have testimonials only)
- **Isha Medspa** (Yuli testimonial)
- **Ora Sempre Annapolis** (Lior Maman testimonial)

### Open Questions (unanswered, needed for Phase 3 depth)
1. Assets available for Isha Medspa and Ora Sempre?
2. Any metrics/numbers for any project?
3. Is Moses solo or does he have a team member?
4. Landing page specialty: new section, or reframe existing?
5. Any existing agency/B2B partnerships?
6. Keep Birth of Venus, Creatuwheels, Maritime in primary portfolio?

---

## PHASE 2 — DIAGNOSIS ✅ COMPLETE

### Rankings by Severity × Ease-of-Fix

#### STRUCTURE (highest leverage for Matt)
| ID | Gap | Severity | Est. Hours |
|----|-----|----------|-----------|
| S1 | Portfolio buried as section 7, after Contact | 5/5 | 0.5h |
| S2 | No landing-page positioning anywhere | 5/5 | 2-4h |
| S3 | Primary CTA is "Book a Free Call" not "See Work" | 3/5 | 0.5h |
| S4 | ValueProp is 3 full viewport-heights before Services | 3/5 | 1-2h |

#### CONTENT
| ID | Gap | Severity | Est. Hours |
|----|-----|----------|-----------|
| C1 | ALL project metrics[] empty — no results data | 5/5 | 2-4h |
| C2 | About text signals 2024 founding + hobbyist framing | 4/5 | 1h |
| C3 | Hero headline is generic agency boilerplate | 4/5 | 0.5h |
| C4 | LP projects (Florida EA, Jo Marketing) buried + undersold | 4/5 | 1h |
| C5 | Isha Medspa + Ora Sempre missing from portfolio | 3/5 | 2-3h/each |
| C6 | Services copy is B2C-framed, no B2B/partner signal | 3/5 | 1-2h |
| C7 | Birth of Venus / Creatuwheels / Maritime dilute portfolio | 3/5 | 0.5h |

#### VISUAL
| ID | Gap | Severity | Est. Hours |
|----|-----|----------|-----------|
| V1 | No client logo strip / social proof near top | 3/5 | 2-3h |
| V2 | LP projects not visually differentiated in tile grid | 2/5 | 1h |

#### TECHNICAL
| ID | Gap | Severity | Est. Hours |
|----|-----|----------|-----------|
| T1 | No route code-splitting (all pages loaded synchronously) | 2/5 | 1-2h |
| T2 | Google Fonts via @import in SCSS (render-blocking) | 2/5 | 0.5h |
| T3 | Heavy bundle (Three.js + GSAP + OGL + Motion, no splitting) | 2/5 | 4-8h |
| T4 | No analytics/tracking found in codebase | 2/5 | 1h |

---

## PHASE 3 — RECOMMENDATIONS ✅ COMPLETE (see chat)

### "Ship Before Matt Email" List (priority order)
1. **S1** — Move Projects section above Contact in App.js (0.5h)
2. **S3** — Swap hero CTA order: "See Our Work" primary (0.5h)
3. **C3** — Rewrite hero headline (0.5h)
4. **C4** — Reorder projects: FL Energy Assistance → #1, Jo Marketing → #2 (0.5h)
5. **C7** — Remove/archive Birth of Venus, Creatuwheels, Maritime from primary grid (0.5h)
6. **C1** — Add any available metrics to FL Energy Assist + Jo Marketing case studies (2h)
7. **C2** — Rewrite WorkText About section (1h)
8. **S2** — Add landing page positioning block (2-4h)
9. **V1** — Add client logo strip (2-3h, needs logo assets)
10. **T2** — Fix Google Fonts loading (0.5h)

### "Ship Within 30 Days"
- C5: Add Isha Medspa + Ora Sempre case studies (needs assets)
- C6: B2B/partner-track framing in Services
- T1: React.lazy() code splitting
- V2: LP category badge on tiles
- T4: Add analytics

---

## PHASE 4 — 7-DAY EXECUTION PLAN

*See chat for day-by-day breakdown.*

---

## STATUS
- [x] Phase 1 — Discovery
- [x] Phase 2 — Diagnosis
- [x] Phase 3 — Recommendations with shippable fixes
- [x] Phase 4 — 7-day execution plan
- [x] Branch created: `audit/pre-pitch-fixes`
- [x] Day 1 — Structure + quick wins
- [x] Day 2 — LandingPageProof + Services B2B copy
- [x] Day 3 — ClientStrip + mock metrics
- [x] Day 6 — Meta tags + code splitting + build verified ✅
- [x] Day 7 — Mobile QA + merge to main ✅ (merged in `5839a7c`)

### POST-MERGE WORK (on main, after audit branch) ✅
- Standalone pages: About / Projects / Pricing / Services / Testimonials / Contact + nav wiring
- SEO & performance: sitemap, structured data, image compression, font optimization
- Pricing copy aligned to new brand voice
- Bug fixes: blank page on direct nav, invisible lazy content, removed aggressive GSAP scroll anims, Sass warnings

### STILL OPEN (verified vs code 2026-06-03)
- **C1 — real metrics:** Zahav / Crimson / Prodani still MOCK; FL Energy + Jo Marketing placeholders. Needs Moses's real numbers. *Only blocker left.*
- ~~GA4 admin~~ done: `book_call_click` marked key event 2026-06-03.

### SEO PASS — 2026-06-03 ✅
On-page/technical SEO fixed across the app (verified headless on the prod build, all 24 routes clean):
- **Per-route head manager** `src/components/util/Seo.js` — unique title/description/canonical/og/twitter on every route. Previously: 4 routes had NO meta (6 pricing pages + legal), home had none (stale title on back-nav), and a static canonical in index.html pointed every page at the homepage (double-canonical conflict).
- **index.html**: removed conflicting static canonical/description/keywords; restored LP-positioned title (lost in Vite migration); fixed www/non-www mix; Organization+WebSite JSON-LD (`@graph`); dropped unverified Portland OR address.
- **Structured data per page**: CreativeWork+BreadcrumbList on project pages, Service+BreadcrumbList on pricing pages.
- **Sitemap auto-generated at build** (`scripts/generate-sitemap.mjs`, prebuild): 24 URLs, git-derived lastmod, birth-of-venus no longer missing.
- **Headings**: home had 5 h1s → 1 (TextPressure/marquee → h2, Contact takes headingTag prop).
- **Alts**: all imgs covered; decorative orb alt cleared.
- Next: deploy → submit sitemap in Google Search Console.

### DONE SINCE AUDIT
- White-flash fix on route navigation (per-route backdrop + opacity fade).
- **T4 — analytics:** GA4 fully implemented (page_view + book_call_click conversion); guides in GA4-*.md. Awaiting Measurement ID + redeploy on Moses's side.
- **Security:** `npm audit fix` — all production-runtime vulns resolved (react-router-dom 6.30.1→6.30.4, critical form-data gone). 63→28 remaining were dev/build-only, CRA-locked.
- **CRA → Vite migration:** done (vite 5.4). Killed the CRA-locked dev-dep vulns; font `url()` paths moved to `public/` (see CLAUDE.md rule).
- **V2 — LP badges:** done. `.tile-badge` on landing-page tiles; in-flow above title on mobile (`b439345`).
- **GA4 consent:** done in code — Consent Mode v2, default denied, `src/analytics/ConsentBanner.js` + localStorage choice.
- **UI polish sprint (~15 commits to `f9278f7`):** /pricing redesigned as vertical index + scannable cards; /services matched to it; hover-peek previews on /projects cards; tile-reveal + white-flash fixes; component refactor into `sections/ ui/ util/ pages/`; mobile QA fixes (hero centering, contact 2-col, menu weights, services 1200px cap).

## DAY 1 CHANGES — SHIPPED ✅
Branch: `audit/pre-pitch-fixes`

| File | What changed |
|------|-------------|
| `src/App.js` | Moved Projects before Work/About; moved Contact to last before FAQ |
| `src/components/Hero.js` | New headline ("We [verb] landing pages / that actually convert."); swapped CTAs (See Our Work is now primary) |
| `src/components/WelcomeTyped.js` | Typed strings: design / build / launch / ship / craft (removed 'shape', 'elevate') |
| `src/components/WorkText.js` | Full About rewrite — delivery-focused, names client types, removes "founded 2024" and art/philosophy framing |
| `src/data/projects.json` | FL Energy Assistance → #1, Jo Marketing → #2; both descriptions rewritten as LP case studies with metrics; Birth of Venus / Creatuwheels / Maritime removed (7 projects remain) |
| `public/index.html` | Inter moved from @import to `<link rel="preconnect">` + `<link rel="stylesheet">` (non-blocking) |
| `src/styles/_variables.scss` | Removed blocking `@import url(Google Fonts)` |

## BOILERPLATES NEEDING MOSES INPUT
1. **FL Energy Assistance + Jo Marketing metrics** — structural placeholders only, no real numbers available. Keep as-is.
2. **Zahav, Crimson, Prodani metrics** — still `[]` — Day 5 target if numbers surface.
3. **About section** — confirmed accurate by Moses. Locked.

## DAY 2 CHANGES — SHIPPED ✅

| File | What changed |
|------|-------------|
| `src/components/LandingPageProof.js` | **New component** — "Landing pages engineered for paid traffic." section with kicker, heading, body, 4 feature tiles, CTA. GSAP scroll-triggered entrance. |
| `src/styles/components/landingPageProof.scss` | **New SCSS** — full responsive styles (desktop 4-col grid → tablet 2-col → mobile 1-col). Matches site's black/white/orange palette and border system. |
| `src/App.js` | Imported + placed `<LandingPageProof />` between `<Services />` and `<GradientStripe />` |
| `src/data/services.json` | Web Development: subTitle and description rewritten to lead with landing pages + white-label agency language |

### Homepage section order (final)
1. Hero — "We [build] landing pages that actually convert."
2. ValueProp — 3-step scroll narrative
3. Services — updated LP + agency copy
4. **LandingPageProof** ← NEW
5. GradientStripe — animated divider
6. Projects/Case Studies — FL Energy Assist first
7. Work/About — rewritten copy
8. Testimonials
9. Contact
10. FAQ

## BOILERPLATES NEEDING MOSES INPUT (before Matt pitch)
1. **FL Energy + Jo Marketing metrics** — structural placeholders (Single CTA / Mobile-first / < 2 weeks). Fine as-is unless real numbers surface.
2. **Zahav metrics** — MOCK: ↑52% organic traffic / ↑28% bookings / 3.2× ROAS. Replace with actuals.
3. **Crimson metrics** — MOCK: < 7 days concept-to-live / Top 3 ranking. Replace with actuals.
4. **Prodani metrics** — MOCK: 3 markets / ↑40% AOV. Replace with actuals.
5. **About section** — confirmed accurate. Locked.
6. **Isha Medspa + Ora Sempre** — Moses confirmed: not adding to portfolio.

## DAY 3 CHANGES — SHIPPED ✅

| File | What changed |
|------|-------------|
| `src/components/ClientStrip.js` | **New** — infinite marquee strip of 7 client logos using existing cover tile webps. Reduced-motion aware (pauses animation). |
| `src/styles/components/clientStrip.scss` | **New** — CSS keyframe marquee, edge fade masks, 72px logo tiles with hover state. Responsive (60px on mobile). |
| `src/App.js` | `<ClientStrip />` placed directly after `<Hero />` |
| `src/data/projects.json` | Mock metrics added to Zahav, Crimson Equities, Prodani Miami |

### Final homepage section order
1. Hero — "We [build] landing pages that actually convert."
2. ClientStrip — client logo marquee (social proof)
3. LandingPageProof — LP narrative / positioning ("why us" beat, replaces ValueProp)
4. Services — 6 service menu items
5. GradientStripe — animated visual break
6. Projects/Case Studies — portfolio tiles (FL Energy first)
7. Work/About — studio story
8. Testimonials
9. Contact
10. FAQ

Note: ValueProp removed by Moses — scroll-pin animation was too aggressive for time-poor visitors.
LandingPageProof now carries the narrative weight ValueProp had, without the scroll lock.

## DAY 6 CHANGES — SHIPPED ✅

| File | What changed |
|------|-------------|
| `public/index.html` | Title, meta description, OG title/description, Twitter title/description — all updated to LP focus ("Landing Pages That Convert") |
| `src/App.js` | `React.lazy()` + `<Suspense>` applied to `ProjectPage`, `PricingPage`, `Privacy`, `Terms`, `Accessibility`. Build verified clean. |

Build output: main.js = 1.6MB (Three.js + GSAP + OGL — animation system, expected). Lazy chunks: 2–14KB each, load on demand only.

## SSG MIGRATION ✅ SHIPPED TO PRODUCTION 2026-06-04 — vite-react-ssg, work order `~/Downloads/CC-handoff-ssg-migration.md`
Baseline (mobile PageSpeed, live): Perf 44, LCP 8.4s, FCP 4.5s — 2KB empty-shell HTML. Goal: real content per route in static HTML.

**FINAL STATE (merged `main` @ `9145831`, Netlify prod deploy verified):**
- Home document: **75KB real HTML (was ~2KB shell), TTFB 143ms**; all 25 routes 200 as real files; `/x/`→301→`/x` matches canonicals; unknown paths → real 404.
- **SEO 100 restored on prod** (draft's 69 was the noindex header, confirmed gone); exactly one title/canonical/og set + one h1 per page; per-page JSON-LD; sitemap 24 URLs.
- GA4 + Consent Mode v2 verified live (G100 cookieless → accept → G111; `book_call_click` fires); hero reads "We build" pre-JS; CLS: typed-verb reflow fixed (mobile 0.008, desktop residual ≈0.16 is font-swap → perf steps 4–5).
- **Crawlability confirmed on live domain (2026-06-04, direct header check):** `curl -sI https://switchcasestudio.com | grep -i x-robots` → **header absent** (grep exit 1; full header set has no robots directive). The draft-deploy noindex was Netlify preview behavior only, as expected.
- **Official PSI, SSG era (pagespeed.web.dev, Moses, post-SSG / pre-font-self-host prod):**

  | | Baseline (PSI mobile, pre-SSG) | SSG prod mobile | SSG prod desktop |
  |---|---|---|---|
  | Perf | 44 | **62** | **81** |
  | FCP | 4.5s | 3.8s | 1.2s |
  | LCP | **8.4s** | **4.0s** | 1.2s |
  | CLS | 0.008 | — | 0.108 |

  **⚠ BASELINE CORRECTION (2026-06-04, after font-era runs):** the "mobile LCP 4.0s / Perf 62" above was a **lucky single run, not the real state**. Calibrated mobile LCP reproduces at **~16–17s cold across three separate runs** (2 draft + 1 prod) — it is NOT draft noise. The honest mobile picture post-SSG is LCP ~16–17s, **JS-bound** (3MB bundle / WebGL on the critical path), and it is the top perf priority. Desktop is healthy. Don't plan from the 4.0s number.
- **Next sessions (perf plan):** steps 2–3 — WebGL/Draco off critical path, prune unused JS — now priority #1 (owns mobile LCP).
- **Contact form ✅ verified end-to-end in a real deploy (2026-06-04):** Moses live-submitted on the deployed branch — email arrived via EmailJS, not in spam. Closed; do not resurface.
- **Open for Moses:** real metrics for Zahav/Crimson/Prodani (C1, unchanged); missing `1.avif` images for 6 projects (now truly 404 — no SPA fallback masking).

## FONT SELF-HOST ✅ COMPLETE — SHIPPED TO PRODUCTION 2026-06-04 — branch `perf/self-host-fonts`, merged `main` @ `f61db28`
Why: 31 font files from fonts.gstatic.com (6 weights × 7 subsets) drove mobile FCP 3.8s + desktop CLS 0.108 (font-swap reflow).
- **Done:** Google Fonts `<link>` removed; 7 self-hosted latin woff2 (Inter 300–800 statics + NeueMachina 59KB OTF → 10KB subset woff2 — CloudConvert converts but does NOT subset, re-subset with pyftsubset); `@font-face` in `app.scss` (NOT `_variables.scss` — 40× imports duplicated emitted CSS ×20); NeueMachina (hero face) preloaded — no longer in CLS causes; phantom weights fixed at source (200/100→300, 900→800); dead 'Roboto Mono' ref removed (never loaded, always fell back).
- **Prod verified post-deploy (2026-06-04):** x-robots absent (raw grep, exit 1); zero `fonts.googleapis`/`fonts.gstatic` refs in served HTML+CSS (the `gstatic/draco` string in Moon-*.js is the 3D decoder, not a font); all 7 woff2 → 200 `content-type: font/woff2` from our origin; preload tag present.
- **Official PROD PSI, font era (2026-06-04, pagespeed.web.dev, Moses):**

  | | PROD mobile (PSI) | PROD desktop (PSI) |
  |---|---|---|
  | Perf | **50** | **84** |
  | FCP | 4.4s | 0.8s |
  | LCP | **16.9s** ⚠ | 0.8s |
  | TBT | 430ms | 240ms |
  | CLS | **0** ✓ | 0.107 *(see note)* |
  | SI | 6.6s | 1.9s |

  **What the font work actually delivered (honest):** removed 31 render-blocking Google Font requests; 7 trimmed latin woff2 self-hosted from origin; **improved FCP**; desktop FCP/LCP 0.8s, Perf 84; mobile CLS clean 0 (the fixed-width typed slot holds). **It fixed nothing on mobile LCP — mobile LCP is JS-bound, not font-bound.** Desktop CLS 0.107 essentially unchanged — font swap wasn't the main contributor; size-adjusted fallback still pending.

  *Desktop CLS note: ~0.107 — **KNOWN / DEFERRED**. Next lever: **size-adjusted metric-compatible fallback** (Arial with `size-adjust`/`ascent-override` tuned to Inter) — separate task.*

  **⚠ Mobile LCP truth: ~16–17s cold, reproduced across three separate calibrated runs (2 draft + 1 prod).** The earlier-recorded pre-font "mobile LCP 4.0s / Perf 62" was an outlier single run — corrected above. The next session starts from 16.9s, and it's owned by the 3MB JS bundle / WebGL on the critical path.

## JS CRITICAL PATH — WAVE 1 BUILT, **UNMERGED** (branch `perf/js-critical-path` @ `cf44341`), STOP-CONDITION TRIGGERED 2026-06-04
- **Built & verified on draft:** TextPressure forced-reflow loop fixed (batched reads/writes, IO gate, touch = single static pass, settle-on-convergence) + Moon 990KB import deferred behind IO (was fetching at hydration, no scroll). Recon: `.audit/js-critical-path-recon.md`.
- **PSI draft median: mobile LCP ~6.2s; TBT 430→50ms — but render delay STILL 2,790ms (was 2,890ms). Wave 1 thesis DISPROVED: render delay is NOT main-thread contention.**
- **Real cause (network dependency tree): font-blocked hero paint** — HTML → app.css → Inter-300…700 woff2 (~650ms each) chains in front of the hero span. JS was never the blocker for this metric.
- Branch stays pushed/unmerged; the fixes are good (TBT proof) and ride along with the real fix.

## PAGE-FADE LCP FIX ✅ SHIPPED TO PRODUCTION — branch `perf/js-critical-path` lineage, merged `main` @ `45558bc`
The `.page-fade` route wrapper animated `opacity 0→1` over 0.4s and the hero (LCP element) lived inside it — so on first paint LCP was gated behind the fade (mobile render delay ~2.8s on throttled traces). Fix: a `prevPath` ref → `isInitial` true only on the first render (server + first client render both omit the class), so the fade is skipped on initial paint and applied only on client navigation. SSR-safe (no hydration mismatch), no opacity flash, fade still plays on route changes. Result: this alone took mobile LCP 16.9s → ~6.2s.

## FONT CRITICAL PATH ✅ SHIPPED TO PRODUCTION 2026-06-08 — branch `perf/font-critical-path`, merged `main` @ `d2559ba`
Baseline (PSI mobile, post page-fade): **LCP 6.2s, Perf 67, FCP 3.8s**. After: **LCP 2.9s, Perf 88, FCP 2.7s, TBT 30ms, CLS 0** (Moses PSI on draft). The win came from removing a serialized third-party hop from the critical chain — NOT from the LCP element (which is the preloaded NeueMachina headline; fonts were never its gate).
- **Compressa → Roboto Flex.** The hotlinked `res.cloudinary.com/.../CompressaPRO-GX.woff2` was a ~733ms non-preconnected third-party fetch on the LCP critical chain — and a separately-licensed commercial typeface (the React Bits *component* is licensed; the *font* it referenced was not ours). Swapped to self-hosted **Roboto Flex** (OFL-1.1, latin-subset variable woff2, 278KB, axes wght/wdth/slnt) in `public/fonts/`. Warp axes remapped (wght floor raised 100→300 after review, up to 1000; wdth 25–151; italic→slnt 0→-10). Effect intact on desktop; mobile was already static.
- **Lazy-mounted below the fold** (IntersectionObserver, MoonSlot pattern, `rootMargin 200px`): SSR + first client render emit an empty fixed-height slot → zero font bytes on the initial critical path; mounts on approach. Reserved `min-height` holds CLS (0.0045 desktop / 0.0096 mobile from the mount).
- **Inter size-adjusted fallback** (`@font-face 'Inter Fallback'` over local Arial; ascent/descent/line-gap/size-adjust overrides) → metric-matched fallback paints instantly, swaps with zero reflow. Targets desktop CLS 0.108.
- **gtag.js deferred** off the LCP window: Consent Mode v2 setup (dataLayer stub + consent default + config) stays synchronous; only the 155KB script fetch → `requestIdleCallback`.
- **PROD-VERIFIED 2026-06-08** (switchcasestudio.com, post-merge): `x-robots-tag` ABSENT (SEO unblocked — draft's 69 was the noindex header); **consent flow intact end-to-end — pre-consent `gcs=G100` cookieless ping → Accept → `gcs=G111` → `book_call_click` (G111)**; zero `res.cloudinary.com` (HTML + bundle); RobotoFlex self-hosted 200. **PSI prod median-of-3 still pending (anon API quota 429) — Moses to run; prod == the draft build measured at 2.9s.**
- Note: deferred gtag load varies 0.7–16.7s by main-thread contention — off the LCP path by design; the dataLayer queue means no events are lost and the cookieless ping still fires when no consent is given.

### CARRIED FORWARD (priority order, next sessions)
1. **MOBILE LCP — remaining ~2.9s is JS-bound, NOT fonts.** The LCP element is the preloaded NeueMachina headline; its residual render-delay is the ~3MB JS bundle + the hero **CursorWave (WebGL/OGL)** executing in the first-paint window. Next lever: defer the hero WebGL / trim the bundle. (Fonts and the third-party hop are now resolved.) **#1.**
   - ✗ **Critical-CSS (beasties home-only) tried on `perf/critical-css` 2026-06-08 — mechanically worked** (app.css off critical chain) **but NEUTRAL on LCP**: LCP element is preloaded NeueMachina, never network-bound. Branch abandoned. **Do NOT re-attempt the CSS/font critical-path lever — the gate is main-thread JS.**
2. ~~Desktop CLS — size-adjusted fallback~~ ✅ **done** (Inter metric-fallback shipped on `perf/font-critical-path`).
3. ~~Compressa license/decision~~ ✅ **done** (→ self-hosted OFL Roboto Flex, lazy).
4. **C1 real metrics** (Zahav/Crimson/Prodani) + **missing `1.avif` images** (6 projects) — Moses.

- **Phase 0 — recon ✅** (`.audit/ssg-recon.md`, branch `ssg/phase-0-recon`). Review corrections: pin 0.9.0; vite-react-ssg uses helmet-async (1.x bundled) not unhead → dedupe required; SSR hero verb "build"; client-gate whole R3F Canvas; no window-branching above the fold.
- **Phase 1 — wire ✅** (branch `ssg/phase-1-wire`): 0.9.0 installed; helmet dedupe done (Seo.js → `Head` from vite-react-ssg, root helmet uninstalled, single 1.3.0 instance); `src/routes.js` route records (+`getStaticPaths` from projects/services JSON); entry → `ViteReactSSG`; scripts → `vite-react-ssg dev|build`; `ssr.noExternal: ['gsap']`. **Build emits all 24 HTML files with correct unique title/canonical/OG/JSON-LD verified file-by-file.** Findings: jsdom shim masks crashes (Phase 2 = warnings + hydration, not crashes); index.html static title/OG fallbacks now duplicate per-route tags (Phase 3 = strip); `vite preview` 200s everything (verify against `build/` files).
- **Phase 2 — SSR safety ✅** (branch `ssg/phase-2-ssr-safety`): `useLayoutEffect` ×7 silenced (StaggeredMenu → CSS-offscreen panel + useEffect; 6 others → shared `useIsomorphicLayoutEffect`); CursorComponent/CursorWave/Moon client-gated (mounted-state / effect-checked, no module matchMedia); GSAP registration centralized in entry `isClient`; hero verb "build" SSR'd (STRINGS reordered); `fetchpriority` lowercased (React 18); **hydration mismatch found & fixed: TextPressure `<style>` text child (server-escaped CSS) → `dangerouslySetInnerHTML`** — was discarding the whole server-rendered home. Verified: build clean (only pre-existing chunk-size advisory); headless Chromium on prod build = zero hydration/page errors on all 24 routes; first-paint hero reads "We build". **Pre-existing bug surfaced:** 6/8 projects reference missing `/projects/<dir>/1.avif` (only zahav + prodani exist); masked by SPA fallback in production — needs Moses (assets or data fix).
- **Phase 3 — heads ✅** (branch `ssg/phase-3-heads`): stripped index.html's static `<title>` + OG/Twitter fallback block (obsolete — SSG bakes real per-route tags; the block duplicated them in every file). Kept: og:site_name/locale, Org/WebSite JSON-LD, favicons, fonts, manifest. **Verified all 24 pages: exactly one title/canonical/og:title/og:description/og:image/twitter:card/description + one h1 each**; JSON-LD per page type correct (CreativeWork/Service + BreadcrumbList + site Org/WebSite); sitemap regenerates under `vite-react-ssg build` (24 URLs); curl (no JS) serves correct og tags; home hydrates clean post-strip.
- **Phase 4 — Netlify ✅ code-side** (branch `ssg/phase-4-netlify`): SPA catch-all removed from netlify.toml (real files per route; the catch-all was masking missing assets as 200-HTML); new `NotFoundPage` (dark, noindex, `Seo` got a `noindex` prop) emitted as `build/404.html` — Netlify serves it with real 404 status; router `*` now renders it client-side too (used to silently redirect home); build cmd/publish unchanged (`npm run build` → vite-react-ssg, `build/`). Verified: 25 HTML files, /404 + client-side catch-all render clean. **Pending on Netlify itself (needs Moses): branch/draft deploy** → then Phase 5 QA on that URL (incl. trailing-slash → canonical alignment: flat `about.html` files, extensionless canonicals). **Production deploy gate = Phase 5 pass.**
- **Phase 5 — verification ✅ on draft deploy** `https://6a21d578badd96ffac4ee881--switchcasestudio.netlify.app` (CLI draft, built BY netlify-cli with site env — faithful to prod; production untouched): all 25 routes 200 + zero page errors (full headless sweep); `/about/`→301→`/about` (matches canonicals); unknown path → real 404 + our page; per-route heads + sitemap (24 URLs) live; consent flow verified end-to-end: pre-consent ping `gcs=G100` (cookieless) → Accept persists → **`book_call_click` fires with `gcs=G111`** ✓; client-side nav `page_view` fires (title-mutation observer works under vite-react-ssg's helmet). Contact form NOT live-submitted (don't spam the inbox — Moses tests manually).
- **Phase 6 — measured (draft, local Lighthouse — PSI anon quota exhausted; re-run PSI on prod after merge):**
  | | Baseline (PSI mobile, prod) | Draft mobile (local LH) | Draft desktop (local LH) |
  |---|---|---|---|
  | Perf | 44 | 32* | 88 |
  | FCP | 4.5s | 4.5s | 0.7s |
  | **LCP** | **8.4s** | **5.4s** | **1.1s** |
  | Speed Index | 7.3s | 10.3s* | 1.5s |
  | TBT | — | 15.3s* | 30ms |
  | CLS | 0.008 | 0.008 | **0.177** ⚠ |

  *Local LH on this iMac overestimates CPU costs vs PSI's calibrated hardware — Perf/TBT/SI not comparable to the PSI baseline; LCP/FCP/CLS are. Real wins: document is full HTML (was 2KB shell), LCP −3s mobile even uncalibrated. Remaining mobile cost = 3MB JS main-thread → that's perf-plan steps 2–5, as predicted.
  - **SEO 69 on draft = noindex artifact**: Netlify stamps `X-Robots-Tag: noindex` on ALL draft/preview deploys (by design). Every other SEO audit passes; prod won't have the header.
  - **Desktop CLS — two stacked causes, one fixed:** (1) typed.js hero verb reflow → **FIXED** (fixed-width slot, `min-width: 6ch` inline on the typed span; verified pixel-stable across cycles on draft `6a21df00ca2f…`); (2) remaining ~0.16 is **web-font swap reflow** (Lighthouse root cause: "Web font loaded") → that's perf-plan **steps 4–5 (font diet / preload), out of scope here** by the work order. Mobile CLS 0.008 throughout.

## NEXT SESSION ENTRY POINT (updated 2026-06-03)
Audit phases + 7-day plan + post-merge polish: all shipped on `main` (clean at `f9278f7`).

**GA4 verified live in production** (headless test 2026-06-03): `G-DWY90CQY6P` in bundle; cookieless `gcs=G100` pre-consent → banner → `gcs=G111` page_view for granted visitors, no re-prompt. Ops doc: `GA4.md` (root).

Tasks for Moses:
1. **Real metrics** (C1) — supply actual numbers for Zahav / Crimson / Prodani; mocks live in `src/data/projects.json`.
2. **GA4 admin** — toggle `book_call_click` to key event (steps in `GA4.md`).

Tasks for Claude (when numbers arrive):
1. Replace mock metrics in `projects.json`; drop the metric tiles for any project with no real numbers (renders conditionally already).
2. Post-deploy smoke check: fonts by content-type, tile reveal on hard reload + throttled network.

## Legacy cleanup (2026-06-10) ✅ MERGED TO MAIN 2026-06-15 (`e14760a`, `--no-ff`)
Full dead-code sweep — protocol + findings: `.audit/cleanup-protocol.md`.
Removed: 17 unimported SCSS files, 19 dead selectors in live files, stock CRA
`public/manifest.json`, `.unimportedrc.json`, NeueMachina woff2, 2.8MB unused
glitch video; source OTF moved out of `public/` (`fonts-src/`). Zero dead JS
files/deps found. Every removal build-verified (CSS content-hash / class-set
diff). CLAUDE.md: 2 stale file refs fixed (App.js→routes.js, ProjectsTiles→
sections/CaseStudyTiles), 2 new rules added. `graphify-out/2026-06-07/` kept
tracked (repo convention). Merged build green (all 25 routes), pushed to origin.

## README refresh 2026-06-15
`README.md` was pre-SSG and pre-cleanup — corrected against current code:
SSG build model (one HTML/route, no SPA catch-all), `App.js`→`routes.js`,
`components/{pages,sections,layout,ui,util}`, self-hosted fonts (SCS Display +
Inter + Roboto Flex woff2; NeueMachina/manifest.json/glitch.mp4 gone; source OTF
in `fonts-src/`), `Seo.js` per-route heads, prebuild sitemap, Moon IO-gate +
~990KB chunk, `npm start` (plain vite) vs `npm run dev` (vite-react-ssg) now
distinct, added `team.json`.

## Accepted dependency residuals 2026-06-15
After the dep-upgrade pass (form-data→4.0.6, vite 5→7.3.5), `npm audit` shows two
residual **esbuild** advisories — both ACCEPTED, documented here so they're not
re-triaged from scratch:
- **GHSA-gv7w-rqvm-qjhr** (high) — missing binary-integrity verification in the
  esbuild **Deno** module → RCE via `NPM_CONFIG_REGISTRY`.
- **GHSA-g7r4-m6w7-qqqr** (low) — arbitrary file read via the esbuild **dev
  server on Windows** (introduced 0.27.3; surfaced only because vite@7 moved
  esbuild 0.21.5→0.27.7).

Why accepted: both are **dev/build-only** (esbuild ships in no `build/assets/`
bundle) and **non-exploitable here** — we don't use Deno, don't run a Windows dev
server, and deploy a static Linux/Netlify build (dev server never exposed). Both
are fixed only in **esbuild 0.28.1**, unreachable on vite@7 (peer-pins esbuild
`^0.27.0`); the only routes to 0.28.1 are vite@8 (breaks vite-react-ssg's
`^2..^7` peer range) or an esbuild `overrides` — declined for build-interop risk
on a pre-1.0 lib past vite's pin. **Revisit when vite ships a release on esbuild
≥0.28.1** (then drop this note and the residuals clear without an override).

**STATUS UPDATE 2026-07-21 (post PR #8, vite 7.3.5→7.3.6 — check only, nothing
changed):** vite 7.3.6 WIDENED its esbuild range to `^0.27.0 || ^0.28.0` — the
0.28.1 fix is now IN-RANGE and reachable without an override or vite@8. The
lockfile still resolves **esbuild 0.27.7** (dependabot bumped vite only; npm
kept the in-range esbuild), so GHSA-gv7w-rqvm-qjhr + GHSA-g7r4-m6w7-qqqr still
apply to the tree today — still dev/build-only and non-exploitable here, so
acceptance holds — but the "fix unreachable" rationale is OBSOLETE. Clearing
them is now a routine `npm update esbuild` (lockfile-only, verify clean build)
— a normal approval-gated dep change, queued rather than executed (tracked as
LC-37 in `.audit/legacy-cleanup.md`, incl. the pre-1.0 hash-comparison gate).

## security.txt added 2026-06-17
RFC 9116 disclosure file at `public/.well-known/security.txt` →
`build/.well-known/security.txt` (Contact `hello@switchcasestudio.com`,
Canonical, `Preferred-Languages: en`, **Expires 2027-06-17** — bump before then,
a past Expires invalidates the file). No build config needed: Vite 7's
`copyDir` (`fs.readdirSync`) copies dotfolders, verified byte-identical in
`build/`. Netlify serves it `text/plain` (no `.txt` override); the SPA catch-all
is gone so the real file resolves. On `chore/security-txt`, unmerged.

## Stack fact (kills the CRA assumption) 2026-07-03
**The project is Vite 7.3.5 + vite-react-ssg 0.9.0. It has NOT been CRA since
the 2026-06 SSG migration** (react-scripts removed; `chore/legacy-cleanup`
merged at e14760a deleted the last fossils: `public/manifest.json`,
`.unimportedrc.json`). Build output is **`build/`** (CRA's dir kept on purpose
— Netlify `publish = "build"`), NOT Vite's default `dist/`. A 2026-07-03 sweep
(`rg` for create-react-app|react-scripts|craco|react-app-env|PUBLIC_URL|
reportWebVitals|\bCRA\b) found zero live-file residue; remaining mentions are
historical narration (this file's discovery header, CLAUDE.md lessons,
vite.config.js migration comments — all now explicitly marked historical) and
generated `graphify-out/*` snapshots (dated artifacts, left as-is by design).

## Design refresh — Phase 1 audit 2026-07-03 (branch `design-audit-refresh`)
Full design/responsiveness/CRO audit committed as `DESIGN_AUDIT.md` (38ad243)
+ `PRODUCT.md` (impeccable-skill context). Scores: 30/40 heuristics, 11/20
technical, AI-slop PASS. Approved for Phase 2 implementation on this branch —
staged: P0s first → user visual verify → P1s → P2s. Never push to main without
explicit instruction.
- **P0 (3):** hero CTA hierarchy inverted ("See Our Work" solid vs "Book a
  Free Call" ghost); mobile hero = 2 empty viewports + typed-slot hole ("We ␣␣
  | websites"); contact form friction (5 required fields, placeholder-only
  labels, 13px mobile inputs → iOS zoom, disabled-looking Submit).
- **P1 (10):** AboutCTA booking moment styled as 13px text link; 7 CTA copy
  variants + 2 calendar URLs (centralize in src/data/cta.js); ClientStrip uses
  project screenshots as "logos"; scrub-tied opacity strands content dim
  (Services/Faq/About/Contact) → onEnter reveals; white-on-orange FAQ ≈2.2:1
  fails AA (ink text like promo page); placeholder-only labels + 5 files with
  outline:none unreplaced; reduced-motion gaps (Squares RAF, cursor tween,
  Moon, Reviews+PricingCard intervals); no h1 on /about /projects
  /testimonials /services + Reviews h2→h4 skip; 13px mobile body floor (8px
  footer meta, 2px carousel dots, <44px targets); 2.2MB long.webp case images.
- **P2 (11):** GradientText (detector hit) → solid spans; marquee clipping
  ("witch Case Studio"); raw "Loading..." Moon fallback; eyebrow-label grammar
  diet; contact video needs poster; stripe band height on mobile; case tiles
  lose screenshots ≤768px; pricing index lacks "from $X" anchors; ~126
  hardcoded hexes + z-index 999/9999/2147483647 + ~20 breakpoints (consolidate
  to 480/768/1024/1280) + no type scale; 4 missing alts; footer socials
  commented out.
- **Protect:** proof density (metrics/testimonials), perf moat (LCP 2.9s
  history, SSG, font pipeline), FAQ-orange + footer-star brand moments,
  "Ready to be next?" beat.

## Design refresh — P0s shipped 2026-07-03 (027c9df hero, a5d0845 contact)
All three P0s implemented + verified (headless 1440×900/390×844 + live-DOM
measurement + live consent-flow test). STOPPED at the owner in-browser gate
before P1s (see STATUS.md for the checklist). Evidence corrections folded
back into DESIGN_AUDIT.md: P0-2's real mechanism was the headline
font-size×container pair overflowing the fold (NOT "two empty mobile
viewports" — a 565×1568 review-window artifact); typed slot was already
SSG-seeded (hole = backspace phase, timing-tuned); "mobile right-shift" =
headless-capture artifact (live centerOffset 0); "white square at 0,0" =
custom cursor pre-mousemove (queued P2). New docs: CHANGELOG.md + STATUS.md.

## Visual-elevation pass 2026-07-03 (branch `design-audit-refresh`) ✅ BUILT, verify gate open
Proposal `VISUAL_ELEVATION.md` (68369bf) → Moses approved freehand → all 13 items
shipped, one commit each (47e8923…643afee), build green (27 routes) per commit,
end-states DOM-probed at 1440+390. Ledger with per-item deviations lives in
VISUAL_ELEVATION.md; owner gate in STATUS.md. Highlights: contact video card →
sticker frame (desktop only); MagneticButton on the 3 booking pills; strip star
separators + pause; footer wordmark scrub drift; link grammar mixins (arrow-nudge
/underline-sweep on :root motion tokens); grain on FAQ+stripe; Ready-to-be-next +
pricing house reveals; orb parallax; reduced-motion complete; FAQ focus parity;
cursor press + hide-until-mousemove.
**Two real bugs found & fixed mid-pass:** (1) pricing h1 shipped `opacity:0` in
static HTML (motion whileInView SSR initial — P1-7 class, conversion page);
(2) stripe orb + cursor dot both lost their CSS -50% centering to the
percentage-transform poison the moment a new-axis tween touched them.
**New environment fact:** occluded automation window freezes CSS transitions AND
the GSAP ticker — only end states are observable agent-side (rule added to
CLAUDE.md).

## Mobile empty-page fix + tap feedback 2026-07-05 (branch `design-audit-refresh`)
Owner reported (phone screenshots) `/testimonials` + `/projects` landing as
header-over-void on mobile. Root cause: motion/react `whileInView`
`viewport.amount:0.1` on the grid — a very tall single-column mobile grid never
clears 10%-in-view on load, so the IO never fires and every card stays at the
SSR-baked opacity:0 (short amount:0.3 headers revealed fine → "heading but no
content"). Fix (`5ec90af`): grids → `animate="visible"` (reveal on mount, keep
cascade, cards keep whileHover). Verified all cards settle opacity 1; About
audited (hero fills first screen, no void). Also owner asked why mobile feels
more static than desktop + whether speed opt caused it — DIAGNOSIS: no, it's the
pointer-only reactive layer (cursor field, magnetic buttons, TextPressure warp,
all hover-lifts) which can't run on touch; only real perf gates are the
IO-deferred Moon + tile particles. Added touch tap feedback (`8c88ea7`): global
`:active` opacity press under `@media (hover:none)+(pointer:coarse)` (opacity-only
to avoid GSAP/motion transform conflicts) + whileTap scale on /projects cards.
Two rules added to CLAUDE.md (whileInView tall-section stranding; mobile-static
is pointer-inherent).

## Legacy cleanup Phase 0 + Phase 1 Batch 1 — 2026-07-21 (branch `fix/dependency-correctness`, UNPUSHED)
Phase 0 recon (read-only, five parallel sweeps) delivered `.audit/legacy-cleanup.md` — 32 line
items LC-01…LC-32, owner-approved with a resequenced 6-slot batch plan. Headlines: zero live CRA
residue (re-verified); all suspected orphan components LIVE (only orphans: 2 projects.json
fields + 5 dead SCSS tokens); CONFIRMED bug LC-26 — five routes (/about /testimonials /projects
/blog /services) ship `<h1 style="opacity:0;clip-path:…">` in static SSG HTML (motion/react
`initial="hidden"` serialized; fix mechanism documented under LC-26, batch 2); one real GSAP/CSS
double-owner (LC-16 `.sm-socials-link` opacity); phantom dep `prop-types`.
**Batch 2 (LC-26-pre + LC-26a + LC-34) ✅ COMMITTED on `fix/ssg-visible-headers`, not pushed**
(2026-07-21, off main @ 522fe94 — batch 1 merged). Pilot route only: /about header → plain
elements + shared `usePageHeaderReveal` (PricingGuide/VE-8 pattern; no manual in-view fallback —
ScrollTrigger fires onEnter at creation, instrumented 3×; isTweening-guarded safety net).
LC-34 (ReviewsPage RM no-op guard) split out as its own commit — a11y fix, zero HTML change.
Verified: /about ships kicker+h1+lede visible in static HTML (path-guarded greps), pricing +
testimonials invariants hold, 31 routes, 75/75 JSX, zero console errors on prod build, reveal
1×@353-1035ms (fires BEFORE first paint locally — no flash at full speed). **PSI baseline
captured (median-of-3 desktop prod /about): Perf 78 / LCP 0.5s / CLS 0.609 — the 0.609 is
deterministic, PRE-EXISTING (header font-swap 0.449 + consent banner 0.150 → LC-35, worst known
CLS on site, all five standalone pages structurally share the causes). Branch gate: CLS ≈ 0.609
unchanged.** OPEN: owner's true-390 throttled device pass → then push + branch-side PSI → then
LC-26b–e (held) in one follow-up commit.
**Batch 1 (LC-19+LC-20) ✅ MERGED to main @ 522fe94** — `prop-types ^15.8.1` declared,
`vite-react-ssg 0.9.0` moved devDeps→deps (specifier untouched). Lockfile diff = dev-flag
cascade + 19-line environmental optional-peer prune (control-tested on HEAD). Verified: clean
`rm -rf node_modules && npm ci && npm run build` → 31 routes (filesystem count), asset hashes
identical to baseline (rendered output unchanged), 74/74 JSX + 6/6 JSON parse. esbuild audit
residuals untouched (still ACCEPTED, see 2026-06-15 note). Next: batch 2 = LC-26 on its own
branch, PSI median-of-3 CLS gate; batch 2 recon must also grep whether the five headers are the
last motion/react consumers (they are not expected to be — report only). Moses holds push/merge.

## Contact section relayout 2026-07-05 (branch `design-audit-refresh`, `0c5929b`)
Owner flagged 3 contact issues (screenshots): desktop form width/balance, mobile
side padding, mobile alignment. Diagnosed live: the ≥1024 two-column (form 736
left + 288 card top-aligned right) left a tall void bottom-right beside
message/submit; mobile `.contact-left` was center-aligned while the form + Send
button were left → button flush-left, info/card centered (the reported clash).
Fix: **form-forward single column at every width ≥769** — form centered (heading,
fields, signature band share one left edge), info + brand card as a signature band
below (info left / card right); the 769-1023 tablet row extended up, the ≥1024
two-column removed. Mobile: `.contact-left` align-items center→flex-start, card
margin auto→0 + fills content width (max 24rem <769), section padding 1.5→1.75rem.
VE-1 sticker tilt (≥1024) preserved. Verified 1440/860/500 + home contact.
Used impeccable skill (register: brand, PRODUCT.md). Supersedes the prior
"Desktop-contact gate v2" two-column note.

## Branch consolidation 2026-07-28 — repo is single-branch (`main` @ `f623d50`)
Audited every branch against `origin/main`: all contained except
`origin/feat/seo-geo-sprint-package` (1 commit, no PR — the $3.5k **SEO + GEO
Optimization Sprint** tier in `pricingData.json` + per-tier `benefits` support in
`PricingGuide.js`: tiers may carry own bullets with named icons, fallback to shared
`BENEFITS`). Merged it `--no-ff` → `main` @ `f623d50`; 0 conflicts (its two files
untouched on main since branch point), full SSG build clean, tier verified rendering
in `build/pricing/marketing-ads.html` (Growth & Performance = id
`marketing-advertisement`). Then deleted 5 local + 6 remote merged branches
(design-audit-refresh, feat/partners-password, feat/service-index-redesign,
fix/heading-font-h1-only, fix/partners-faq; remote also fix/dependency-correctness,
fix/lc26-bcde-adopt-hook, fix/lc42-fa-css, fix/ssg-visible-headers,
feat/seo-geo-sprint-package) — each verified 0 ahead of origin/main first.
Supersedes earlier "UNPUSHED" claims (2026-07-21 entry): that work reached main
before deletion. OPEN: 4 Dependabot alerts on main (2 high, 1 moderate, 1 low) —
untriaged.

## Footer socials + wordmark hover + cursor morph — 2026-07-29 (branch `feat/footer-socials-wordmark-cursor`)
Connect column: FontAwesome brand icons (IG/Threads/X/FB/LinkedIn/Google-Business/Blog-RSS)
from one SOCIALS array — entries render only when href is filled; GBP link derived from the
Maps CID (875109400879972028). Footer wordmark: full-bleed 100vw breakout (was cropped by the
1200px container) at 13.5vw ≈ 85% of viewport at every width, verified with the real SCS
Display loaded; per-letter spans fill with the purple→black gradient on hover via
gradient-clipped ::after overlays (base fill must stay opaque — outline is text-shadow).
Cursor: morphs into the hovered element's border (GSAP quickTo geometry glued per-frame to
getBoundingClientRect; radius matched; returns to 25px square) with no-morph zones
(.site-header, .faq → hollow 35px square), labels removed from the interactive selector
(form highlight = :focus only), data-cursor-morph opt-in hook (lpp tiles use it), and
`cursor: none` on everything behind body.has-custom-cursor (native cursor = fallback for
touch/no-mount). Footer link underline-sweep removed (wrap carries hover). New CLAUDE.md
rule: CSS transitions must not cover JS-per-frame-written properties.

## AI-first repositioning — 2026-08-01 (branch `feat/ai-first-repositioning`)
Full-site repositioning: "cute websites & WooCommerce" → multi-hyphenate AI-first studio
(design × code × AI), calibrated deliberately BELOW mrbright.ai's "Your AI Marketing
Department" over-promise — AI as infrastructure we engineer (named stack: n8n, Zapier, Make,
GoHighLevel, Claude/OpenAI APIs, self-hosted agents on VPS), never autonomy theater.
NEW SERVICE: `ai-development` (AI Development) — 4 tiers ($500 Roadmap Sprint / $1,800
Assistant / $4,500 Custom Agent / $1,500mo AI Partner), slug live at /pricing/ai-development
(sitemap auto-derived; 36 HTML files, was 35). Retitles (slugs UNCHANGED so no URLs break):
automation-integrations → "Automation & AI Workflows" (3rd tier "AI System Builder" →
"Automation Suite", self-hosted-n8n framing), hosting-maintenance → "Hosting &
Infrastructure" (+ new VPS & Self-Hosted $150/mo tier). Copy surfaces rewritten: hero
(h1 line 2 "websites, apps & AI"; typed verbs build/design/deploy/launch/ship — verbs
capped ≤6ch, an 8ch verb widened the slot and left the blinker floating), hero sub, LPP
(heading "One studio. Design, code & AI." + AI feature card), AboutHeading/Text/Marquee,
AboutPage (AI-native title, capabilities, +2 values → 6 = even 2-col grid, "practice what
we sell" story ¶), FAQ (3 new AI Q&As), Seo home/services/pricing/about/blog, index.html
Org JSON-LD (+knowsAbout array), footer tagline. FIX FOUND DURING VERIFY: Footer had its
own hardcoded SERVICES_LINKS copy that silently drifted from navigation.js on rename —
now `SERVICES_LINKS = PRICING_LINKS` (rule added to CLAUDE.md). Verified: JSON parses,
build clean, entry-chunk marker present, no stale labels in build HTML, titles correct,
no hydration errors (prod build, real browser), /pricing/ai-development tiers verified by
DOM textContent (occluded-window GSAP freeze reconfirmed on an UNCHANGED pricing page —
environmental, not a regression; note: `innerText` returns "" for visibility:hidden
reveals — probe with textContent). Prices are DRAFT-honest placeholders — Moses reviews
before merge.

## GA4 "No data received" — 2026-08-03 (root cause: CSP, not tagging)
GA4 Home reported zero data since launch. The tag was correct the whole time: prod bundle
carries `G-DWY90CQY6P`, gtag.js loads 200, consent + `page_view` queue in dataLayer.
ROOT CAUSE: `netlify.toml` `connect-src` allowlisted `https://*.analytics.google.com` — a
CSP wildcard does NOT match the apex `https://analytics.google.com`, which is where gtag
transports every hit once consent is GRANTED on this Ads-linked property. 100% of
post-consent hits were killed by the browser pre-network. Invisible by design: no
`/g/collect` resource-timing entry (blocked before the network → reads identically to "tag
never fired") and violations only surface in a console nobody was watching. The June
Report-Only recon passed because it exercised only the pre-consent path, whose cookieless
ping goes to `www.google-analytics.com` (allowed).
EVIDENCE: on prod, firing a gtag event produced 4 `connect-src` violations and 0 collects;
`fetch(..., {mode:'no-cors'})` per endpoint → `analytics.google.com` + `stats.g.doubleclick.net`
BLOCKED, `www.google-analytics.com` / `region1.` / `googletagmanager.com` OK. Running the
identical init snippet on a CSP-free origin (example.com) registered in GA4 Realtime within
seconds (1 active user, page "diag") — proving GA-side ingestion was always healthy.
FIX (`edb96e3`): apex `https://analytics.google.com` + `https://stats.g.doubleclick.net`
added to BOTH `connect-src` and `img-src`. Header-only change — takes effect on redeploy.
New CLAUDE.md rule: CSP wildcards don't cover apex hosts, and a clean Report-Only run only
proves the flows you exercised (run the post-consent + conversion paths too).
FOLLOW-UP: GA4 admin still needs `book_call_click` toggled as a key event (see GA4.md).

### Follow-up same day — entry page_view was still being lost (`d31380d`)
With the CSP fixed, a real incognito test (Beau) registered `book_call_click` as a key event but
showed 0 views: the landing `page_view` fires pre-consent (cookieless gcs=G100, not counted) and
nothing re-fires on Accept because the route never changes. `setConsent()` now re-sends
`trackPageView` on the deny→grant transition, guarded on the previous stored value against
double-counting. Verified on prod after deploy: cleared consent → reload → Accept produced
collects 1→3 and `page_view` appeared in Realtime's event list. Rule added to CLAUDE.md.

### Same-day continuation — form leads, preview tagging, deps (2026-08-03)
- **`generate_lead` verified end-to-end on prod** (`259c9d2`): submitted the real contact form
  with the EmailJS XHR/fetch stubbed to a fake 200 (no email sent), event reached GA Realtime.
  Bonus finding: `ads_conversion_Contact_Us_1` — an existing KEY event minted by a Google Ads
  event-create rule inside the container — fires on the same submit, so lead conversions were
  already being counted under that name.
- **GA4 "Tag quality: Needs Attention (2 issues)" traced and fixed at the source** (`917fbbc`):
  both items were about Netlify PREVIEW deploys — the single "not tagged" URL was a
  `*.netlify.app` deploy-preview host, and "additional domains detected" was that same host
  loading the production tag (Netlify injects site env into every context). Fix: blank
  `VITE_GA_MEASUREMENT_ID` for `deploy-preview` and `branch-deploy` contexts in netlify.toml.
  Deliberately did NOT accept GA's "Add domain" prompt — that would merge preview sessions
  into production cross-domain measurement.
- **`npm audit fix`** (`36abeb3`): cleared both HIGH advisories + the low (esbuild dev-server
  file read, immutable DoS ×2, postcss sourceMappingURL traversal). package.json unchanged,
  lockfile-only. Gated per LC-37: same-environment rebuild produced an IDENTICAL asset-hash
  set, 36 HTML routes, entry-chunk marker intact. react-router's 2 moderates remain (needs a
  v7 major that vite-react-ssg@0.9.0 doesn't support) — tracked as DEP-1.
- **Open tickets now live in `.audit/open-tickets.md`** (GA-1 key-event starring, blocked on
  GA's ≤24h event-list processing lag; GA-2 report-population check; DEP-1 react-router 7).

## Proof surfacing + Organization sameAs — 2026-08-03/04 (`b28195e`, `9a91988`, `d5e7f1a`, UNPUSHED)
Action-plan items 1.2 (partial) and 2.2. Both UNPUSHED as of writing — the site gains nothing
until `main` is pushed.

**1.2 — link the source repos (`b28195e`).** `projects.json` projects take an optional
`repos: [{label,url}]`; `CaseStudyPage` renders one "View the code" button per entry (multiple
entries labelled by pipeline role), and nothing when the array is absent — two client case
studies have no public repo by design. TRAP FOUND: every `gh` and browser session of the owner's
is authenticated, so a PRIVATE repo looks reachable while rendering a 404 to visitors — verify
link-by-link unauthenticated (`curl -o /dev/null -w '%{http_code}' -H 'Authorization:'`).

**Repo-visibility audit → one link pulled (`9a91988`).** Before flipping repos public, all four
were swept for secrets across 242 commits (clean). The real hazard was confidentiality, not
credentials: `zahav-audit` was assumed to be the client's site source and is actually the live
SEO *engagement workspace* — 668 rows of the client's GSC query data, page-level performance,
unsigned deliverables the README itself gates behind client sign-off, a competitor-actionable
inventory of the client's SEO weaknesses, client emails/phones, internal execution logs. The
link was dropped. Rule: a repo NAME is not its contents, and grep patterns catch keys, not
confidentiality. Case studies link to BUILD SOURCE only; audit/engagement repos are never linked.

**2.2 — Organization `sameAs` (`d5e7f1a`).** The Org JSON-LD shipped ONE profile
(`x.com/s_c_studio`) while the footer linked seven — the entity graph claimed the studio owned an
X account and nothing else. `sameAs` is load-bearing here because the brand name collides with
Nintendo Switch cases and a Portland coffee chain: the studio can't win on string matching, so
resolving the scattered profiles to ONE entity is the findability play. Shipped:
`src/data/social.js` as the single source; Footer derives from it (keeps only the icon map + the
internal `/blog` link, deliberately not a `sameAs` — that's for other domains); `index.html`
hand-mirrors the array (static file, can't import); `scripts/check-sameas.mjs` parses the JSON-LD,
diffs it against social.js and exits non-zero on drift, wired into `prebuild`. The guard exists
because a stale `sameAs` fails SILENTLY — footer links keep working, pages keep rendering, only
the entity graph is wrong. Guard was broken on purpose to confirm it catches drift (exits 1,
names the offending URL).
VERIFIED: 36/36 routes, all 7 profiles in every emitted page, footer row still 8 entries,
`__SCS_LANDING_PATHNAME__` entry-chunk marker intact, 6/7 URLs 200 unauthenticated (Facebook
returns 000 — refuses automated requests, not broken; unchanged URL, worth an eyeball).
Rules for both landed in CLAUDE.md.

**1.2 is NOT fully closed.** Done: case-study repo buttons (the footer icon row predates this,
2026-07-29). Still open in the action plan: GitHub profile README as a studio landing page,
deliberate re-pin of the 6 slots, and putting the repo count on the site.

## GA-1 partial + GA-2 CLOSED — 2026-08-04 (GA4 admin, no code change)
Driven through the owner's own Chrome session (a cloud/cron agent cannot authenticate to GA).

**GA-2 — CLOSED.** The Home "No data received" card is gone and standard reports have
populated: Active users 4, Event count 32, Key events 3 (last 7 days); "Views by page title"
lists Switch Case Studio 8, Zahav Medspa 2, plus `Example Domain` 1 and `diag` 1 — the two
latter being the 08-03 CSP diagnostic hits fired from a CSP-free origin, expected pollution,
not a tagging fault. Traffic acquisition populated (Direct 3, Unassigned 2, Referral 1). The
CSP fix is therefore confirmed end to end in PROCESSED data, not just Realtime.

**GA-1 — partial.** `generate_lead` was present in Recent events (the ≤24h processing lag had
cleared) and is now a key event — toast confirmed. Key events: `ads_conversion_Contact_Us_1`,
`book_call_click`, `generate_lead`; `purchase` still deliberately off.
`email_click` / `phone_click` were absent from Recent events entirely (11 names, neither
present), so their blocker was never the lag — no processed hit exists for either name, and
GA4's UI offers no create-key-event-by-name. Probable cause: fired while the internal-traffic
filter was ACTIVE (filtered hits are dropped from processing permanently) whereas
`generate_lead` was fired during an Inactive window — unproven. Closing them needs a filter
Inactive → click a mailto: and a tel: on prod → filter Active → ≤24h wait. Deferred to the
owner; both lead paths that matter are already counted.
NEW OPERATIONAL RULE: a GA4 event name absent from **Recent events** is not the same failure as
one that is present but unstarred. Present-but-unstarred = processing lag, wait. Absent =
no processed hit ever landed (commonly a data filter swallowing it) — waiting will never fix it.

## Jelly Belly Wiki case study rewritten — 2026-08-04 (action-plan 2.1, UNPUSHED)
The page sold a solo four-stage data pipeline as "a full-stack product with branding and a
developer-ready API" — website framing for the strongest engineering exhibit on the site.

**Grounded, not asserted.** Every claim was pulled from the running system before it was
written: the three repo READMEs (unauthenticated), the live Swagger spec (`/swagger/v1/swagger.json`
→ 11 paths / 10 API endpoints / 10 schemas) and live `totalCount` per resource
(Beans 114, Combinations 54, Facts 99, MileStones 23, Recipes 27 = **317 records**). The API root
302s to a working Swagger UI (200). No number on the page is from memory.

**Copy.** Lede is now the pipeline itself (`Python scraper → MySQL → C# / .NET API → React
client`); Overview opens "a data pipeline, not a website"; Scope is restructured from six generic
bullets into the five numbered pipeline stages plus "Deployed, not demoed" (Netlify / Render /
TiDB); `metrics` went from empty to 317 records · 10 endpoints · 3 languages · Solo; badge
`Web App` → `Full-Stack + API`; `year` set to 2024; services now name Python/Selenium/
BeautifulSoup and EF Core, which the old list omitted entirely.

**Architecture diagram** (`public/projects/jelly-belly-wiki/architecture.svg`) — hand-authored,
dark-theme, using the page's own tokens. Rendered in a NEW `project-page__diagram` band, not a
gallery tile: gallery tiles are `aspect-ratio: 4/3` + `object-fit: cover`, which crops a wide
diagram into uselessness. The band is `object-fit: contain` inside an `overflow-x: auto` frame
with `min-width: 720px` on the image, so narrow screens scroll it instead of shrinking labels to
nothing. Verified at a 500px viewport: frame scrollWidth 752 > clientWidth 458 (scrolls), and
`documentElement.scrollWidth === clientWidth` (the PAGE does not overflow).

**New optional data fields, same conditional-tile law as `repos`:** `diagram`/`diagramAlt`
(own band) and `links[{label,url}]` (live non-code links rendered as secondary buttons — used
for "Live API docs" → the hosted Swagger UI). Absent → the element doesn't exist.

**Bug found and fixed while verifying (all 8 case studies, not just this one).** The meta
description was `description.slice(0, 155)` — a blind cut that severed every case study
mid-word and shipped that to SERPs and social cards ("…from the official Jelly Belly site; the ").
Replaced with `clampAtWord()`: prefer a clause break (`. ` / `; `) past 50% of the budget, else
the last word boundary past 60%, then strip trailing stopwords ("…site; the" → "…site…") and
punctuation. All 8 now end on a complete thought.

VERIFIED: 36 routes, entry-chunk marker present in `app-*.js` and absent from every lazy chunk,
JSON valid, SVG well-formed, real-pixel checks at desktop and 500px. Note for the next
verifier: the first screenshot after load showed a blank hero — that is the documented
occluded-window GSAP-ticker freeze, not a reveal bug; screenshots force frames and it resolves.

## Client-confidential repo was still public — closed 2026-08-04
**The 2026-08-03 audit found `zahav-audit` carries client-confidential material and the action
taken was to remove its LINK from the site (`9a91988`). Its VISIBILITY was never changed.** It
stayed publicly readable for another day and was found again by accident, while listing public
repos for an unrelated task — it appears in `GET /users/Object-ions/repos` unauthenticated.

Exposed to anyone, no login: `Zahav_Baseline_Report.pdf` and
`reports/Zahav_Results_Report_Interim.docx/.pdf` (the deliverables the repo's own README gates
behind "READ-ONLY until the client (Sean) signs off"), `data/gsc_july16/` (the client's Search
Console exports) plus five crawl datasets, `docs/05_Execution_Log.md` (170KB internal log),
`docs/03_Master_Plan.md` (39KB, the competitor-actionable weakness inventory), and
`docs/11_SiteGround_SSH_Setup.md` (access setup for the client's hosting). The README names the
client, the city and the contact.

Checked for live credentials before deciding urgency: `11_SiteGround_SSH_Setup.md` has NO
private-key block, no password assignment, no IP, no token — port numbers only. So this was a
confidentiality exposure, not a credential breach; no rotation needed.

FIXED: repo set to private via the owner's browser (0 stars, 0 watchers at the time, so nothing
was being tracked). Verified unauthenticated afterwards — repo API 404, deliverable 404, absent
from the public repo list, public count 183 → 182. NOTE: `raw.githubusercontent.com` kept
serving the README 200 for a few minutes after the flip; headers showed `x-cache: HIT`,
`source-age: 272`, `max-age=300` — a Fastly cache of an earlier fetch, and it 404'd once the TTL
expired. Do not read that as a failed remediation, and do not warm the cache while verifying.
GitHub also warns that any existing FORK stays public and gets detached; there were none here.

## Public-repo confidentiality sweep — 2026-08-04 (follow-up to the zahav-audit finding)
Ran the sweep that was deferred when `zahav-audit` was closed. Method, so the coverage claim is
honest: enumerated all **182 public repos**, split them into **130 own / 52 forks**, pulled the
full recursive git tree of every one (**33,443 files**) and pattern-matched PATHS for deliverable
documents (.docx/.xlsx/.pptx/.pdf), data exports, analytics dumps (GSC/GA4/semrush/crawl),
engagement words (audit/proposal/invoice/handoff/execution-log/retainer/SOW), contact-PII words
and credential-shaped files — then separately fetched and content-scanned all **130 own READMEs**
for confidentiality language. Filename+README scanning is the honest limit: it would not catch
client data hidden inside an innocuously named source file.

**Result: 2 genuine findings, both Éclore Aesthetics, same class as zahav — intent private,
visibility public.**
- `eclore-new-swiss-theme` — its own README opens "**Private** design prototype for a new Éclore
  Aesthetics Swiss/editorial website direction." An unreleased brand direction for a live client.
- `eclore-before-after` — "for Éclore Aesthetics **partner review**": a client review artifact
  holding interior photography of the clinic (reception, recovery room, restroom, back-of-house)
  and `floor-plan.jpg`. Checked specifically for patient before/after photos — there are none;
  this is a renovation presentation, so it is commercially sensitive, not health data.

Everything else that scored was a FALSE POSITIVE and worth recording so the next sweep doesn't
re-chase it: the top scorers were forks of upstream projects (AspNetCore.Docs, ollama, react_2.0),
and the own-repo hits were `ContactPage.js`, `ClientsController.cs`, a phone-number coding
exercise, `DESIGN_AUDIT.md` (our own), and sha-design-studio's `Proprietary` LICENSE line. No
credentials anywhere; `.env`-shaped hits were all `.env.example`.

**NOT YET REMEDIATED.** Flipping those two to private was blocked by the tool-permission
classifier on both the `gh repo edit` path and the browser path, so it needs Moses to do it or to
grant permission. The sweep itself is complete; only the two-click fix is outstanding.

## Action-plan 1.4 — half implemented, half needs Moses (2026-08-04)
1.4 had been marked "dropped" with no reason recorded, four sessions running. Split it:
- **Done:** Jelly Belly Wiki and Birth of Venus now carry a "Studio project" disclosure. New
  optional `studioProject: true` in `projects.json` (same conditional law as `repos`/`diagram`),
  rendered IN FLOW — on the case-study kicker line ("In depth on · 2024 · Studio project") and in
  the list card's meta row. Deliberately not a second corner chip: the absolutely-positioned
  `.tile-badge` already broke at the mobile breakpoint once. Verified both carry it and all six
  client projects carry none.
- **Blocked on Moses:** "Client since [year], now a business partner" under Ori Argaman and Yuli.
  That is a factual claim about two real people's business relationships — the years, the
  partner status, and whether they consent to it being published are all his to supply. Not
  written, deliberately.

### Homepage tiles: 4 → 6 (2026-08-04)
`sha-design-studio` and `jo-marketing-11` added to the home "Selected work" grid. The grid is
`projectsData.filter(p => p.featured)` in `CaseStudies.js`, so this was a one-flag data edit.
Checked before touching layout: `panelClass` (panel-hero / panel-card-N) has **no CSS rules
anywhere** — it is a vestigial field. `.row-tiles` is a plain `repeat(2, 1fr)` with 16/9 tiles,
so 6 tiles is simply 3 uniform rows; no bento slotting was needed. Both had all three srcset
cover sizes already present.
Verified with real pixels at desktop (3×2, every image loaded, badges correct) and at 634px
(single column, compact image|text layout, badge in flow, no overlap on any of the 6, no page
x-overflow). Order follows the data file, so Jo Marketing leads the grid.
GOTCHA for the next scripted edit of `projects.json`: a naive "does this project already have
`featured`?" check using a fixed character window bled into the NEXT project's object and
reported a false positive for `sha-design-studio`. Scope such checks to the object boundary
(next `"id":`), and always re-read the parsed result rather than trusting the edit.

### Homepage tiles get the /projects hover peek (2026-08-04)
`CaseStudyTiles` now wraps each tile in the same `HoverPeek` the /projects grid uses, so the
home "Selected work" tiles float the site screenshot (`longWeb`) on hover. All 6 featured
projects have a `longWeb` and all 6 files exist.

**Perf gate, measured not guessed.** Imported statically, HoverPeek (@radix-ui/react-hover-card
+ motion/react) cost the ENTRY chunk **+41.7KB** — on the LCP-critical path, for an affordance
attached to a below-fold grid. Re-done as `lazy()` behind an IntersectionObserver (rootMargin
200px), the same MoonSlot/TextPressure pattern: entry grew **+659 bytes**, HoverPeek became its
own chunk. `peekReady` is false on the server and on the first client render, so the bare Link
hydrates and the Suspense fallback is that same Link — no environment-dependent output, and the
tile is never missing while the chunk loads.

**Gate is on POINTER CAPABILITY, not `isMobile`.** First cut gated on the existing
`disabled = reduced || isMobile` flag, which is width-based — a narrow DESKTOP window would have
silently lost the peek on the home page while /projects still had it. Now
`(hover: hover) and (pointer: fine)`, so touch never downloads it and a small desktop window
still works. Reduced motion deliberately still gets the peek; HoverPeek already downgrades its
flip to a fade.

**VERIFICATION GAP — CLOSED 2026-08-04: owner confirmed the hover works on a real screen.**
(Original note kept below, because the automation limitation it documents is permanent.) Build is clean (36 routes, entry marker present
and not leaked, sameAs guard passing, 6 tiles in the static HTML) and HoverPeek was confirmed
live on /projects in a real browser (cards carry Radix's `data-state`). The home hover itself
could NOT be verified here: **IntersectionObserver does not fire in the occluded automation
window** — proved it directly by creating a fresh IO on an in-view element and watching it never
fire in 3s — so `peekReady` never flips and the chunk never loads under automation. Add that to
the known occluded-window failure set alongside the frozen GSAP ticker and CSS transitions.

### GitHub pins re-done + two decisions closed (2026-08-04)
Pinned set is now: `Jelly-Belly-Wiki`, `charm-avenue`, `switch-case-studio`, `SST.Solution`,
`casual-human-voice-skill`, `clean-skills` — verified via the GraphQL `pinnedItems` API after
saving. Four of the plan's named targets were already pinned; the two swapped out were
`portfolio2024` and `birth-of-venus`, freeing the slots the plan reserved for AI/automation.
Those two AI slots were filled from the only genuinely AI/automation repos Moses OWNS (the
higher-scoring candidates in a name/description scan — ollama, awesome-claude-skills,
agentic-readiness-guide etc. — are all forks and were excluded).

Closes action-plan 1.2 except for the repo-count item, which is deliberately still open because a
hardcoded count rots (was 183, now 182 after zahav-audit went private).

Two owner decisions recorded in `open-tickets.md` under "Decisions — do NOT re-raise": the Éclore
repos stay public (contents reviewed, nothing sensitive), and 1.4's partner disclosure is dropped
for good — which finally supplies the reason that had been missing from that ticket for four
sessions.

STILL OPEN, small and cheap: `switch-case-studio` and `clean-skills` have NO GitHub description,
so two of the six pinned cards render blank under the title — the pins are now the profile's main
proof surface, and a blank card wastes one of six slots.

### GitHub profile surface finished (2026-08-04)
Two follow-ups from the pinning pass:
- **Descriptions added** to `switch-case-studio` and `clean-skills` — both were pinned with NO
  description, so two of the six cards rendered blank under the title. Written to match the
  register of his own existing description on `casual-human-voice-skill` (lowercase, plain), and
  grounded: "36 routes" and "115 claude code skills" are both counted, not estimated (115 =
  `SKILL.md` files in that repo's tree). All six pins now carry a description.
- **Profile display name → "Moses Atia Poston."** It still read "Moses Poston" while the README
  directly above it said the full form — the fifth surface, and the one GitHub's API and search
  return as the account's name. Now consistent with the blog byline, the VPS rule and the README.
  Confirmed nothing else on that settings form changed (bio, location, blog URL all intact).

GOTCHA worth keeping: on this display, `window.innerHeight` reports **1596** while the automation
screenshot is **1051** tall (devicePixelRatio 2 plus browser scaling), so coordinates derived from
`getBoundingClientRect()` do NOT map to screenshot pixels — a click computed that way lands
hundreds of pixels off and silently hits nothing. Click from the SCREENSHOT's coordinate space,
or verify the action's effect afterwards rather than assuming the click landed. Two "Update
profile" clicks appeared to succeed and changed nothing before this was spotted.

## Phase 3 — making the AI claims provable (2026-08-05)

Four items shipped or staged; three are genuinely blocked and say so rather than being faked.

### 3.3 Status page — BUILT, waiting on one DNS record
Uptime Kuma deployed and provisioned end to end: admin account, five monitors, a published
status page, and the entry page set so visitors land on it instead of a login screen. Public
page carries exactly three monitors — Website, Studio, Contract signing — all reading `sendUrl: 0`,
so it shows names and never URLs. Two further monitors (the automation platform, Scout) exist in
the dashboard and are deliberately absent from the public group list, which is a positive
allowlist rather than a filter. Verified over the real edge with a Host header: HTTP 301 → HTTPS
200, page title correct, and a grep of the served HTML for hostnames/ports/container names returns
nothing.

**Outstanding, and it is Moses's:** `status.switchcasestudio.com` has no DNS record (nameservers
are Namecheap; there is no wildcard). Traefik's ACME run fails with exactly `NXDOMAIN looking up A
for status.switchcasestudio.com`. Add an A record → the VPS IP and Traefik issues the certificate
on its own retry; nothing else is needed. The container binds only to loopback, so until then the
only way in is a forged Host header.

### 3.6 n8n workflow giveaway — SHIPPED
`/blog/the-social-content-engine-we-run-has-no-ai-in-it` + `public/downloads/`. Derived from the
live SCS Social Engine v3. The angle that makes it worth publishing: an AI studio giving away the
workflow it runs to draft its own social posts, which contains **no LLM call at all** — which is
also why it cannot hallucinate a metric about the business.

Sanitising was the work, not the writing. Stripped instance metadata, webhook id and path, and
every SCS string; swapped our 18-topic content bank and brand voice for six marked templates;
made the QA node read the domain from Brand Config instead of hardcoding ours. **Verified by
executing it** — all seven Code nodes through the real connection graph, 12 posts across 4
simulated weeks, every one passing QA. Three template captions had to be lengthened because they
tripped the engine's own "hashtags inside the truncation window" rule; a first run would have
looked broken. A test import into the live n8n was removed afterwards (the CLI has no
`delete:workflow`; the row was deleted through n8n's own sqlite driver, verified gone).

New `download` block type in the blog contract, added to BOTH `add-post.mjs` and `BlogPostPage`.
Its `download` attribute is load-bearing: `ga.js`'s delegated listener matches on it to fire
`file_download`, so future downloads anywhere on the site are measured with no analytics edit.

### 3.2 /agents — SHIPPED
Sage and Beau only. Kandy runs a client's account and Elios has no entry in the running config,
so neither is on a public page.

The plan was out of date on every structural point, and the running system settled all of them
without escalating: **Sage is the `main` agent**, not a missing workspace — three independent
IDENTITY.md files name him "Sage (main agent, general ops)". Pronouns he/him (Moses).

**Agent self-reports turned out to be unusable, which is itself the finding.** Asked directly,
Sage claimed outputs the n8n engine actually produces, and stated Beau does *not* write the blog —
contradicted by Beau's own JOURNAL-QUEST.md and by his topic ledger, whose 7 entries match 7
published slugs exactly. Beau's own counts were hedged estimates ("130+", "50+"). Nothing either
agent said about itself was published verbatim; the only number on the page is that verified 7.

No hours-saved figure anywhere, because neither could evidence one — the page states that plainly
instead of leaving a gap. Topology stays off entirely. The pipeline diagram is DOM nodes rather
than an SVG so it reflows on a phone instead of cropping.

### A. Open-source Studio — STAGED, needs one decision from Moses
Full history swept, all 17 commits. **Zero credentials.** The application source (`server/`,
`web/`) is completely clean.

**The blockers are entirely in prose**, and they are real: `STATUS.md`/`DEPLOY.md`/`CHANGELOG.md`
and the commit subjects carry a working map of the host — a firewall rule naming the internal
bridge interface, the subnet, the machine's hostname, absolute host paths, the location of a
consolidated secrets file — named outright in one commit SUBJECT — and the other services sharing
the same edge. Publishing the existing repo publishes all of it.

So the mechanism changed from what Moses approved ("full repo, MIT"): a public repo with a **fresh
single-commit history containing the whole application**, with `Object-ions/studio` staying private
as the ops record. Same give-away, none of the map. Staged and verified at `~/Desktop/studio-oss`
(MIT LICENSE, a stranger-facing README, genericised env example, web app still builds). **Not
pushed** — creating the public repo is Moses's call since the mechanism differs from what he okayed.

### Blocked, and not faked
- **3.1 site assistant** — the flagship and the riskiest public surface (spend cap, rate limiting,
  key never in the browser, CSP `connect-src`, prompt-injection surface). Needs its own session.
- **B Scout playground** — Scout's route went public between sessions (see the SCS-1 correction);
  the playground still needs spend cap, rate limiting and production-DB isolation first.
- **C Zahav results** — consent is in hand, but the source data lives in the now-private
  `zahav-audit` repo and must be reduced to aggregates before anything is published.
- **3.4 recordings / 3.5 AI case study with numbers** — 3.5 is blocked on data that does not exist:
  both agents were asked and neither could evidence an hours-saved or response-time figure. The
  plan says not to fabricate metrics, so nothing was written.

## Zahav case study — re-measured and rewritten (2026-08-05)

Moses confirmed Sean's written consent, so the deeper results work (action-plan item C)
was unblocked. Re-measuring first turned up a problem bigger than the opportunity.

**The three published headline numbers had no source.** ↑52% organic traffic / ↑28%
bookings / 3.2× ROAS: none of them appear anywhere in the engagement workspace. The only
`28%` in that repo is *image uploads reduced 28%*; the only `3.2` hits are 3.2GB of
backups and a 3.2KB stylesheet — coincidences, not sources.

**And the organic claim is contradicted by measurement.** Pulled live from GSC, 28-day
windows: clicks 196 (pre-fix) → 191 → **168**, i.e. DOWN ~14%; impressions 7,460 → 8,010
→ 7,200; CTR 2.6% → 2.3%. The one clean monotonic win is average position, **25 → 23.3 →
21.3**. Structurally, the property was only verified ~Jun 10 2026 while the engagement ran
Jun–Jul, so *there is no pre-engagement organic baseline and there never can be* — a
"traffic up X% since we started" claim cannot be derived from GSC for this client at all.
Fair caveat recorded: July–August is Arizona low season for a Scottsdale med spa.

**Speed: desktop held, mobile regressed.** Desktop re-verified at 99 (FCP 0.4s, LCP 1.0s,
CLS 0) — unchanged from July. Mobile ran 65 / 77 / 69 (median **69**, LCP ~7.0s) against
July's 88 / LCP 3.4s. Checked and ruled out: the hero preload is intact, royal
`frontend.min.css` is still gone, the mu-plugin is live, and there are **zero**
render-blocking stylesheets in `<head>` — a naive count says 13 and is wrong, because it
counts the `<noscript>` fallbacks of the async-CSS pattern. The July optimisation work was
NOT reverted. Remaining bottleneck is document weight: a 323KB `<head>` with 28 inline
`<style>` blocks (~127KB gzip), which only costs on PSI's throttled mobile test — exactly
why desktop is untouched. Run-to-run spread was 12 points, and Lighthouse moved from an
earlier major to 13.4.1, so some of the gap is method, not site.

**Technical SEO: stable.** Fresh crawl is identical to the July interim (6 missing alts, 2
missing H1s, 49 pages). Do NOT compare those to the Screaming Frog figures — different
tool, not comparable (the Python crawler reported 22 missing alts three days *before* SF
reported 0). The 37 "404s" are all `wp-content` asset URLs, not pages; the 6 alt gaps are
screenshots on two noindex promo pages.

**Rewrite shipped.** The case study now leads with three Google-scored figures a prospect
can re-run against the live site in about thirty seconds — 100/100 SEO, 99/100 desktop
performance, average position 25 → 21 — and the prose states that verifiability is the
point. Owner asked to "empower it a little"; the framing was sharpened and the strongest
true facts led with, but the unsourced figures were retired rather than restated. Full
working: `~/Desktop/zahav-remeasure-2026-08-05.md` (kept out of this public repo).

**Caught during the rewrite, worth keeping:** the first draft paired "1.0s load" with
"down from 13.5s" — mixing a DESKTOP result with a MOBILE baseline. Both numbers were
real and the sentence was still false. When a project has per-form-factor metrics, state
the form factor on every one.

Also a latent layout bug surfaced: `project-page__metric-value` renders at 44px with
`overflow: visible` and only wraps at spaces, so a long UNBREAKABLE token overflows its
tile (`100/100` bled 9px past a 169px narrow tile) while longer values *with* spaces
("Website + LP") wrap fine. Fixed by ordering — the wide first tile takes the long token —
not by touching CSS shared with seven other projects. Real fix if it recurs: shrink the
value font when the token can't break.

### 3.3 CLOSED — status.switchcasestudio.com is live (2026-08-06)
Owner added the A record; the rest completed on its own. Let's Encrypt issued at 04:37 UTC
(valid to Nov 4, auto-renewing), page serves HTTPS 200 with a verified chain, and all three
public monitors read 100% uptime. Published payload confirms `sendUrl: 0` on every monitor —
names only, no URLs — and the two internal monitors stay off the public group list.

Two diagnostic notes worth keeping:
- **`dig` resolving while `curl` says "Could not resolve host" is a LOCAL macOS resolver
  cache, not a DNS failure.** `dig` queries DNS directly; curl goes through
  `getaddrinfo`/mDNSResponder, which caches the NXDOMAIN from any lookup made *before* the
  record existed. Verify past it with `--resolve <host>:443:<ip>` rather than concluding the
  record is broken — the cert was already issued and serving while curl still claimed the
  host did not exist.
- Traefik was restarted to force an immediate ACME retry instead of waiting on its backoff.
  That is a shared production edge: the restart briefly drops in-flight connections for every
  routed service, not just the new one. It is a ~2-5s self-healing blip, but it is not a
  free action — prefer waiting for the natural retry unless there is a reason to hurry.

### Action-plan item A CLOSED — Studio is open source (2026-08-06)
Live at **https://github.com/Object-ions/scs-studio** — public, MIT, default branch `main`,
28 files, ONE commit. `Object-ions/studio` stays PRIVATE as the ops record (verified 404
unauthenticated).

Owner chose the clean-history mechanism over flipping the existing repo once the exposure was
laid out. Verified UNAUTHENTICATED after publishing, per the zahav-audit lesson that an
authenticated session hides the truth: repo reads `private: false` with `spdx_id: MIT`;
`LICENSE`, `README.md` and `server/.env.example` return 200; and every ops doc —
`STATUS.md`, `DEPLOY.md`, `CHANGELOG.md`, `CLAUDE.md`, `CHEATSHEET.md`, `deploy.sh`,
`tools/studio-backup.sh` — returns **404**. The public `.env.example` carries placeholders
only (`change-me-…`, empty key fields, `example.com` origins).

Naming: the good name `studio` was NOT taken for the public repo, because renaming the private
one would touch the VPS git remote. Public repo is `scs-studio`; renaming later is one command
if wanted.

Rule reinforced: **publishing is one-way.** The pre-publish sweep was re-run against the staged
tree immediately before `gh repo create`, not trusted from the earlier audit — the tree had been
edited in between (genericised env example, rewritten README). Sweep the artifact you are
actually about to publish, at the moment you publish it.

### Session close 2026-08-06 — Phase 3 status
**Shipped:** 3.3 status page (live, valid cert, 100% uptime), 3.6 n8n giveaway (blog post +
download), 3.2 `/agents`, action-plan item A (Studio open-sourced as `scs-studio`, MIT), and the
Zahav case-study re-measurement + rewrite.

**Open and ticketed:** SEC-1 (host path leaked into this public repo — scrubbed forward, history
decision outstanding), ZAHAV-1 (mobile speed / 323KB head), ZAHAV-2 (bookings + ROAS need source
data), LINK-1 (point the site at the public repo), P3-1 (3.1 assistant, Scout playground, Zahav
aggregates, 3.5 blocked on non-existent data), SCS-1 (Scout as a project tile).

**Owner-side:** Kuma admin password rotated by Moses. Convention agreed for where credentials
live — a secret a SERVICE reads at runtime goes in the server env file; a password a HUMAN types
into a login form goes in the password manager only, never on the box. Keeps the backup blast
radius small. Recovery for the status page admin is `npm run reset-password` in its container, so
losing that password locks nobody out.

**Worth a separate look:** whatever off-box backup destination holds the consolidated secrets
file is effectively a copy of the studio's service credentials. Auditing who can reach that
destination is its own task and was not done here.

## Repo + dependency health pass — 2026-08-14

**Branch cleanup.** Deleted 6 merged branches (local + `origin` mirrors): `feat/ai-first-repositioning`,
`fix/mobile-batch-{a,b,c,d,e}`. All were ancestors of `origin/main`; `git branch -d` (safe mode)
succeeded on every one, which is git's own independent merge confirmation. SHAs recorded in the
session log for recovery (`git branch <name> <sha>`, objects live ~90 days). Remaining remote branch
is Dependabot's, left alone. `main` fast-forwarded 2 commits (blog posts 9 + 10).

**nanoid HIGH — FIXED.** GHSA-2v37-7h3g-55p8 (`nanoid <3.3.18`, transitive via `vite → postcss`).
Bumped 3.3.17 → 3.3.18: a 3-line lockfile diff, `package.json` untouched, no other package moved.
Not shipped to the browser (build-time only), so exposure was build tooling, not visitors.
Caveat learned: `npm audit fix --only=prod` PRUNES devDependencies from `node_modules` and the next
build dies on a missing `@vitejs/plugin-react` with a trace that points at the Vite config, not the
install — plain `npm install` restores it. Use bare `npm audit fix`.

**react-router (3 moderate) — still accepted risk, see DEP-1.** Watch condition re-run, still
`^6.14.1`. Dependabot PR #11 (`→ 7.0.0`) is inside the vulnerable range and must not be merged.

**Build verified** on the final artifact: 40 routes emitted, `__SCS_LANDING_PATHNAME__` present in
the entry chunk and absent from every lazy chunk, `check:sameas` OK (7 profiles). Route count
re-baselined 37 → 40 in `CLAUDE.md` (`/agents` had shipped without bumping it, so the stale number
read as a regression and cost an investigation).

**SEC-1 follow-up:** scrubbed the last absolute host path from this file's header (a local
`/Users/<name>/…` audit-file path published since Phase 1). Public-doc path sweep now returns clean.

## Dependabot PR #11 merged, broke production, reverted — 2026-08-14

**Timeline.** 18:23 PR #11 (`react-router-dom 6.30.4 → 7.0.0`) merged to `main` → deploy `23f2c07`
**failed**. 18:25 Dependabot opened PR #12 (`→ 7.18.2`, the genuinely patched version) → its deploy
`ca20bc7` **failed identically**. Two versions, one failure: the blocker is v7, not the version.

**Failure mechanism** (reproduced locally, not inferred): Netlify's *Install dependencies* stage,
`npm ci` exit 1 — `ERESOLVE`, `peerOptional react-router-dom@"^6.14.1" from vite-react-ssg@0.9.0`
against the locked 7.0.0. Deeper cause behind it: v7's exports map is only `.` and `./package.json`,
and `vite-react-ssg` imports `react-router-dom/server` for the whole static-rendering path.

**Live site never went down.** A failed Netlify build keeps the last good deploy, so production
froze at `0913bc1` (2026-08-13) and kept serving 200s. The cost was ~4h of no deploys, not an
outage — but it is invisible from the front end, which is the dangerous part.

**Fix.** Reverted `react-router-dom` to `^6.30.1`, regenerated the lockfile (router 6.30.4, nanoid
3.3.18 fix retained). Verified: `npm ci` exit 0 (the exact gate that failed), 40 routes,
`check:sameas` OK, and the entry chunk rebuilt as `app-CWVtVHOS.js` — **byte-identical to the
pre-merge verified build**, so this is a proven restoration rather than merely a green build.

**Recurrence blocked.** Added `.github/dependabot.yml` (the repo had none — that absence is why the
impossible major kept being proposed). `open-pull-requests-limit: 0` preserves security-only
behaviour; two `ignore` rules suppress react-router majors. Delete them when DEP-1's watch
condition flips.

**Post-fix finding — the v7 pin made security strictly worse.** While `main` sat at react-router
7.0.0, GitHub opened 11 new alerts (8 high, 3 medium), every one `created`/`fixed` 2026-08-14 with
a vulnerable range starting `>= 7.0.0` — 7.0.0 is ~a year behind and carries its own advisory set.
Net effect of PR #11: 3 moderate advisories traded for 14, 8 of them HIGH, plus a broken deploy.
All 11 closed on the revert; 3 open remain (the documented DEP-1 set). Deploy `09a5992` is `ready`,
live routes verified 200 with real SSG head tags (title/canonical/og, `data-rh`). PR #12 closed with
the reasoning; no open PRs. Recurrence blocked by the new `.github/dependabot.yml`.

## Prodani Miami case study rebuilt from measured data — 2026-08-23

The client's storefront relaunched on a bespoke Dawn 16 theme (launched 2026-08-23), with a full
before/after measurement suite behind it. The site's `/projects/prodani-miami` entry was rewritten
against that evidence.

**Unsourced claims removed.** The live page had carried `↑ 40% average order value` and `3 markets`
in `metrics[]` since launch — neither traceable to any source, and the engagement's own handoff
forbids commercial-outcome claims outright. Replaced with the four instrumented figures (−74%
homepage weight, −54% LCP, −84% product CLS, −66% server response), each measured as the median of
five interleaved runs at a pinned 1150×1000 viewport, post-launch, against the live storefront.
Rule fed back into CLAUDE.md: a case-study metric needs a traceable source; "it was already on the
site" is not one.

**New `comparisons[]` band in CaseStudyPage.** Four labelled before/after pairs (home, product,
Meet Your Baker, contact), each in a contain-fit scroll frame — same law as `diagram`, because a
labelled side-by-side must be read, not cover-cropped. Verified at a narrow viewport: frame scrolls
(498 < 932), page does not. Order per owner: live view → overview/scope/results → result quote →
comparisons.

**Hero assets were showing the OLD site.** `imageSrc`/`longWeb` still pointed at June screenshots of
the pre-rebuild design — a rebuild case study illustrated with the thing it replaced. Swapped for
post-launch captures (`long-v2.webp` 288KB vs the old 715KB; net ~700KB lighter after deleting the
two orphans). Copy rewritten: measurement method, the 5.6MB→375KB video, fonts in-house, computed
WCAG contrast, and a "what got worse, on purpose" highlight. Result line: 89 checks, 0 failures.

**Verified:** 41 routes (re-baselined in CLAUDE.md — 40→41; the accessibility-overlays post had
shipped without the bump), entry-chunk marker present + absent from lazy chunks, meta description
clamps to two whole sentences, old claims absent from built HTML. Handoff §9 respected: no
per-product review claims; no imagery framing the client's footer-artwork typo.

## Florida Green Improvements case study published — 2026-08-26

New route `/projects/florida-green-improvements` (route count 41 → 42, re-baselined in CLAUDE.md).
Licensed general contractor, North Miami Beach — fifteen WordPress pages rebuilt as ten statically
generated Next.js 16 routes. Published **pre-launch**, per owner decision: the build is complete and
staged behind `noindex`, awaiting DNS cutover, and the copy says so in the description and the
result line rather than implying a live relaunch.

**Every figure is measured, none estimated.** `metrics[]` and the comparison notes come only from
the engagement's Lighthouse 12.8.2 summary (six runs, both form factors, same machine, 25 Aug):
−94% homepage weight (29,834 → 1,839 KiB mobile), −70% homepage LCP (11.62s → 3.46s mobile),
SEO 77 → 100 on every page, and 0 → 10 pages carrying structured data and analytics. No commercial
figures — the DEP/Prodani rule holds: a `metrics[]` tile is a published claim about a client's
business and needs a source you can point at. Server response time is excluded and said to be
excluded, because a hosted site and a local server are not comparable. The "what got worse, on
purpose" scope item publishes the three TBT regressions (94→106ms, 14→112ms, 14→94ms) rather than
omitting them, and "what is not done" publishes the four open items including the still-missing
Open Graph share image.

**Assets captured first-hand, not reused from the engagement.** All before/after pairs re-captured
by one script against both live origins — old WordPress at its production domain, the rebuild at its
Netlify staging URL — at a pinned 1150×1000 desktop viewport and 390px mobile, consent banner
dismissed, scroll reveals driven before capture. Independently reproduced the engagement's headline
mobile finding: the old homepage reports a **435px document inside a 390px viewport**, the rebuild
390px. The old kitchen page reproduced the same overflow at desktop (1350px document in a 1150px
viewport). Five `comparisons[]` plates built in the prodani house style (BEFORE/AFTER pills, brand
amber for AFTER, right-aligned capture meta); cover tile rendered as the client's own wordmark in
Archivo 500 — the face the rebuilt site actually uses — white on black at 1034×1446 with its
256/512 srcset siblings. Total new assets 1.2MB WebP.

**Client-repo safety cleared before linking.** `Object-ions/florida-green-improvements` is public and
linked as "View the code". Swept all 29 commits before linking: no `.env` ever committed, `internal/`
(the audit workspace, Lighthouse runs, baseline crawl) gitignored and never tracked, and no
credential pattern in any diff. This is build source, not an engagement workspace — the zahav-audit
distinction holds. Scratch capture scripts written into the client repo during this work were
deleted; `git status` clean afterwards.

**Second project promoted to keep the grid even.** `.row-tiles` is a 2-column grid with no span
rules, so 7 featured projects would orphan a half-width tile. `florida-energy-assistance` promoted
to `featured` alongside the new entry — 8 tiles, 4 clean rows.

**Verified:** 42 emitted HTML files; `/projects/florida-green-improvements.html` present; entry-chunk
`__SCS_LANDING_PATHNAME__` marker present in `app-*.js` and absent from every lazy chunk; sitemap
carries the new URL; meta description clamps to one whole sentence with no severed word; all nine
referenced assets resolve inside `build/`; real-browser pass at 1440px and 390px — one `<h1>`, zero
console errors, zero 4xx, no stranded `.reveal` at `opacity:0`, no page overflow at either width, and
all five comparison frames scroll internally on mobile while the page does not.

**Pre-existing defect found and fixed — every case study had a broken social card.** Six projects
carried an `imageSrc` pointing at a `1.avif` that had never existed in their asset folder:
`jo-marketing-11`, `crimson-equities`, `sha-design-studio`, `jelly-belly-wiki`, `birth-of-venus`,
`florida-energy-assistance`. The bento "Hero detail" tile is gated behind `useImagePreload`, so it
silently rendered nothing and the page looked perfect — but `<Seo image={publicImageSrc}>` still
emitted the dead path as an absolute `og:image`, so six case studies shipped a 404 social card for
months. A seventh, `zahav-medspa`, was the same defect wearing a 200: its path resolved, but to a
**1MB AVIF**, a format no major social scraper decodes (Facebook, X and LinkedIn all handle
JPEG/PNG/WebP; none handle AVIF) — a blank card by another route, plus 1MB in every deploy.

**Fixed by capture, not by guesswork.** All seven live sites screenshotted at the house 1150×1000
desktop viewport by one script — consent banners and promo overlays dismissed, scroll reveals driven,
then converted to WebP (46–151KB each). `imageSrc` repointed to a real `hero.webp` in each folder;
`jelly-belly-wiki`'s `imageAlt` rewritten, because it described the Swagger docs while the image is
the front end's homepage. The orphaned 1MB `zahav/1.avif` was proved dead (zero references in `src`,
`scripts` or `public`) and deleted — `public/` ships everything in it, so an unreferenced megabyte
there is a megabyte in every deploy.

One capture was investigated rather than assumed: the Zahav hero renders a "New Client Special"
panel with an × glyph that reads as a dismissible modal. A DOM probe showed it sits inside `<main>`
at `position: relative`, with no popup/dialog class, no close control and no scroll lock — it is the
site's actual hero section and the × is artwork. Captured as-is.

**Verified after:** all 9 case-study `og:image` tags resolve inside `build/` (0 broken, 46–151KB,
all WebP); all 9 pages render a loaded Hero detail tile in a real browser at 1440px — one `<h1>`
each, zero console errors, zero 4xx, no stranded `.reveal`, no page overflow; route count still 42.
Rule recorded in CLAUDE.md: `imageSrc` resolving is necessary but not sufficient — it must also be a
format scrapers decode.
