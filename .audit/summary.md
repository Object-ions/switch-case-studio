# SCS Website Audit — Running Summary
**Target:** switchcasestudio.com | **Deadline:** ~2026-06-01 (Matt James pitch)
**Audit file:** `/Users/moses/Desktop/website-audit.txt`

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
