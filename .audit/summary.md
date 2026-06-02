# SCS Website Audit — Running Summary
**Target:** switchcasestudio.com | **Deadline:** ~2026-06-01 (Matt James pitch)
**Audit file:** `/Users/moses/Desktop/website-audit.txt`

---

## PHASE 1 — DISCOVERY ✅ COMPLETE

### Stack
- **Create React App** (react-scripts 5.0.1), React 18.3.1
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

### STILL OPEN
- **C1 — real metrics:** Zahav / Crimson / Prodani still MOCK; FL Energy + Jo Marketing placeholders. Needs Moses's real numbers.
- **V2 — LP badges:** landing-page projects not visually flagged in the tile grid.
- **GA4 consent:** no cookie banner / Consent Mode v2 yet (needed if EU/UK traffic).

### DONE SINCE AUDIT
- White-flash fix on route navigation (per-route backdrop + opacity fade).
- **T4 — analytics:** GA4 fully implemented (page_view + book_call_click conversion); guides in GA4-*.md. Awaiting Measurement ID + redeploy on Moses's side.
- **Security:** `npm audit fix` — all production-runtime vulns resolved (react-router-dom 6.30.1→6.30.4, critical form-data gone). 63→28 remaining are dev/build-only, CRA-locked (svgo/nth-check/postcss/webpack-dev-server/workbox/jest); full fix needs migrating off Create React App.

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

## NEXT SESSION ENTRY POINT
**Day 7 — Mobile QA + merge to main**
Branch: `git checkout audit/pre-pitch-fixes`

Tasks for Moses (browser):
1. Open site on mobile (or DevTools → iPhone viewport)
2. Check these sections specifically:
   - ClientStrip — logos visible and marquee running?
   - LandingPageProof — 4 features collapse to 2-col then 1-col correctly?
   - Hero — headline wraps cleanly? CTAs stack correctly?
   - Projects grid — tiles readable, hover state functional?
3. Report any visual issues → fix → merge

Tasks for Claude (after QA):
1. Commit all changes on branch
2. Merge to main / push for deploy
