# SCS Design, Responsiveness & Conversion Audit

**Date:** 2026-07-03 · **Branch:** `design-audit-refresh` · **Phase:** 1 (audit only, no code changed)
**Goal:** every qualified visitor who wants one of these services books the discovery call.
**Method:** live browser walkthrough at ~565px (mobile) + 1440px headless captures of `/`, `/projects`, `/pricing`, `/services`, `/contact`; full code sweep of `src/` with file:line evidence; deterministic anti-pattern detector (`impeccable`); CRO + SEO frameworks applied. Findings marked **[verify]** were seen once and need a second look before fixing.

## Ground-truth corrections to the brief

The audit request described a system that isn't what ships. Recording here so Phase 2 builds on facts (doc-rot rule, CLAUDE.md):

| Brief said | Codebase reality |
|---|---|
| Create React App | **Vite 7 + vite-react-ssg** (static HTML per route, hydrated) |
| Bricolage Grotesque / Instrument Serif / JetBrains Mono | **SCS Display** (custom, hero/headings) + **Inter** (everything else). Monospace appears only via raw `monospace` fallbacks in the contact form/footer meta — no JetBrains Mono file exists |
| orange / pink / teal / ink / cream | Tokens: `$orange-color #ff834a`, `$white-color #fef7ed` (cream), `$black-color #303334`, promo-only `$promo-lilac/-mint/-ink/-terra` (`_variables.scss`). Pink/teal exist **only** as promo tokens + the `$g1–$g7` gradient stops — the main site is orange/lilac/cream on #000 |

Phase 2 will elevate the real system. No font or palette swaps unless you ask for them.

---

## Scorecards

**Nielsen heuristics (0–4 each):** Status 3 · Real-world language 4 · User control 3 · **Consistency 2** · Error prevention 3 · Recognition 3 · Flexibility 3 · Aesthetic/minimal 3 · Error recovery 3 · Help/FAQ 3 → **30/40 — Good** (solid foundation; consistency is the weak axis).

**Technical dimensions (0–4 each):** Accessibility **2** · Performance **2** · Responsive **2** · Theming **2** · Anti-patterns **3** → **11/20 — Acceptable** (systemic debt, itemized below).

**AI-slop verdict: PASS.** Custom face, hand-drawn mark, committed ink/orange palette — this reads as a designed brand, not a template. One deterministic tell found (gradient text, P2-14). One grammar tell (eyebrow labels on most sections, P2-17).

---

## P0 — Blocking conversion

### P0-1 · CTA hierarchy is inverted at the moment of highest intent
**Where:** `Hero.js:94–111`, `hero.scss`.
**Finding:** The visually primary button (solid white pill) is **"See Our Work"** — a scroll anchor. **"Book a Free Call"** — the business goal — is the ghost/outline secondary. Every downstream surface repeats the pattern (Reviews, pricing) or weakens it further (P1-4).
**Why it matters:** the page's strongest visual affordance points away from revenue. Visitors do what the biggest button says.
**Fix:** swap treatments: `Book a Free Call` = solid (orange or cream) primary; `See Our Work` = ghost. Keep both. Repeat the solid treatment for every booking CTA site-wide (see P1-5 for the copy system).

### P0-2 · Hero headline overflows the fold; CTAs pushed below it *(mechanism corrected during implementation)*
**Where:** `hero.scss` (`.hero-headline` font-size × max-width pair), `WelcomeTyped.js`.
**Finding (verified):** the +12% clamp bump (`7.28rem`) was never re-checked against the `6.86em` container — the intended 3-line lockup rewrapped to **6 lines**, overflowing the centered `100svh` hero: at 1440×900 line 1 clipped under the header and **both CTAs fell below the fold**; on phones the fit-content h1 could exceed the viewport width. Plus: typed.js's backspace phase empties the verb slot ~13% of each cycle ("We ␣ websites…").
**Corrections to the original write-up (evidence honesty):** the "two empty viewports on mobile" was an artifact of a 565×1568 review window inflating `svh` — at a real 390×844 the hero content fits the fold. The typed slot was **already SSG-seeded** ("build"); the hole is the backspace phase, not hydration. The screenshots' "content shifted right on mobile" = headless-Chrome capture artifact (live DOM measures `centerOffset: 0`); the "white square at 0,0" = the custom cursor parked at origin pre-mousemove (→ P2: hide until first mousemove).
**Fix (shipped `027c9df`):** clamp max → `6rem`, container → `min(12em, 100%)` (the `100%` cap stops phone-viewport bleed; `em` retained so the size-adjust fallback can't rewrap). Typed timing `backSpeed 35 / backDelay 2400` cuts the hole to ~6% of the cycle. Verified above-fold at 1440×900 + 390×844.

### P0-3 · The contact form fights the people trying to convert
**Where:** `Contact.js:203–305`, `contact.scss:208`, confirmed live on `/contact`.
**Finding:** 5 required fields (first + last name, email, **phone**, message) + a required custom consent toggle; labels are placeholder-only in dim mono (vanish on focus, low contrast on #000); inputs are `1rem` → **13px on mobile** (`app.scss:169` body shrink) → iOS auto-zoom on tap; the Submit button's resting/disabled state is dark rust-on-brown that **reads as a dead button** even when enabled; label is "Submit" (weakest possible verb).
**Why it matters:** each required field measurably cuts completion; a disabled-looking primary button suppresses attempts; iOS zoom breaks the flow mid-form.
**Fix:** required = name (one field), email, message; phone optional ("if you'd rather talk"); persistent small labels above inputs (keep mono voice if desired, lift contrast to ≥4.5:1); inputs ≥16px on mobile; enabled Submit = solid orange with dark ink text, disabled = same shape at reduced opacity + explanatory helper; label → **"Send message"** (or "Get my quote").

---

## P1 — High impact

### P1-4 · The mid-page conversion moment has the weakest treatment on the page
`AboutCTA.js:32–39`. After the About narrative — peak persuasion — the booking CTA renders as small left-aligned text: "Let's Bring Your Idea To life & Book a Free Call ↗" (~13px, inconsistent caps, external-link glyph). **Fix:** promote to the standard solid booking button + one-line lead-in; fix "To life" → "to life"; use the ↗ only for genuinely external links (it IS external here — keep, but on a real button).

### P1-5 · Seven CTA copy variants + two calendars dilute one action
Sweep found: "Book a Free Call", "Book a Call", "Book a free call", "BOOK A FREE CALL NOW", "Book a Strategy Call", "Book a 20-min intro call", "Start New Project" — plus a second calendar URL on `/30-off` (`PromoPage.js:20`) vs the main one everywhere else. **Fix:** one system: primary label **"Book a Free Call"** everywhere (footer "Start New Project" may stay as the email CTA label); centralize URL + label in one module (e.g. `src/data/cta.js`) so drift is impossible. Confirm the promo calendar split is intentional (it looks deliberate — different funnel tag); document it there if so.

### P1-6 · "Trusted by" strip undercuts the trust it should build
`ClientStrip.js:4–45`. The "logos" are recycled **project cover screenshots** in dark tiles; at mobile width at least one tile reads empty (dark logo on dark tile); images are `loading="lazy"` while the strip sits near the fold, and sources are 1034×1446 rendered at ~76–96px. **Fix:** real monochrome client wordmarks (cream at ~60% opacity) or drop the strip and let case-study tiles carry proof; eager-load if above fold; serve ≤256px sources.

### P1-7 · Scrub-tied entrances leave content half-invisible whenever scrolling stops
`Services.js`, `Faq.js:96–130`, `About*`, `Contact.js:88` — `scrub: 1` timelines animate opacity 0→1 across a scroll window, so stopping mid-window strands headings/copy at 30–60% opacity (screenshots: "Built to perform. Whatever the format." dim grey; About paragraphs dim; "Contact us" grey). CLAUDE.md already documents this bug class for tiles. **Fix:** reveal on `onEnter` (play once, 0.5–0.7s, ease-out) instead of scrub for opacity; keep scrub only for transform-based decorative motion; every reveal gets the delayedCall safety net per house rule.

### P1-8 · Contrast failures on orange surfaces (WCAG AA)
White on `$orange-color #ff834a` ≈ **2.2:1** — fails AA even for large text. Hit: FAQ heading + question rows (`faq.scss:35–46, 104–118`, white `#fff` on `$g1` orange), "SEE PRICING →" lilac-on-black links are fine, but footer `color: #000` chip on orange FREE badge is fine. Answers are already `#000` (good). **Fix:** FAQ text on orange → ink `#141414`/`$promo-ink` (matches the promo page's solved pattern) or darken the orange panel. Re-check every white-on-orange instance with a contrast tool during implementation.

### P1-9 · Placeholder-only labels + focus-style suppressions
Form fields rely on `aria-label` + placeholder (`Contact.js:203+`) — sighted users lose the label on input; several components ship `outline: none` without replacement (`contact.scss:209`, `serviceRow.scss:22`, `header.scss:118/185`, `StaggeredMenu.scss:140/221`, `testimonials.scss:52`) while the rest of the site does `:focus-visible` properly. **Fix:** persistent labels (P0-3); add `:focus-visible` outlines wherever suppressed (house token: 2px `$g6`/orange offset 2px).

### P1-10 · Reduced-motion gaps in always-on loops
No `prefers-reduced-motion` gate on: `Squares.js` RAF dot-grid (runs whenever mounted), `CursorComponent` GSAP tween, `Moon.js` auto-rotate, Reviews auto-advance `setInterval` (`Reviews.js:54`), `SinglePricingCard` rotator (`:65`). Coverage elsewhere is genuinely good (21 components use the hook). **Fix:** wire the existing `useReducedMotion` hook into these five; Squares should also pause off-screen (IO) — it's the only unconditional RAF on the site.

### P1-11 · ~~Heading/H1 gaps on four routes~~ **FALSE FINDING — corrected 2026-07-03**
The code sweep grepped `<h1` and missed `<motion.h1>`: /about, /projects, /testimonials, and /services all render proper h1 titles (`AboutPage.js:93`, `CaseStudiesPage.js:41`, `ReviewsPage.js:37`, `ServiceIndexPage.js:66`). Verified in the authoritative source: **all 26 built routes carry exactly one `<h1>` in their static HTML.** No fix needed. (Sweep lesson: framework-wrapped elements — `motion.h1`, `styled.h1` — escape naive tag greps.) Residual true sub-item: Reviews section's h2→h4 skip (`Reviews.js:195`) — P2-grade.

### P1-12 · Tiny type + sub-44px targets on mobile
Body 13px at ≤768px (`app.scss:169`) drags every rem value down: footer meta **8px** (`footer.scss:243`), FAQ answers ~11.7px, promo helpers ~10.4px, form errors ~11px. Carousel dots are ~40×2px lines (`Reviews.js:206`); header nav items `padding: 4px 2px` (`header.scss:100`). **Fix:** raise the mobile body floor to 14–15px (audit each shrink victim), give dots/nav a ≥44px hit area via padding, floor all meta text at 11px.

### P1-13 · Performance: multi-MB images on the case-study path
`long.webp` scroll screenshots: birth-of-venus **2.21MB**, jo-marketing **1.67MB**, jelly-belly **1.18MB**, florida-energy ~1MB; team avifs **932/837KB**; testimonial avifs to 517KB. These ship on the pages that close the sale, mostly on mobile connections. gsap loads at hydration app-wide (accepted trade); typed.js at hydration (small). **Fix:** resize long shots to ≤900px width + `srcset`, target ≤350KB each; team/testimonial photos ≤160KB at rendered size. Keep the LCP/CLS budget that's already won (CLAUDE.md history).

---

## P2 — Polish

- **P2-14 · Gradient text** (detector hit): `GradientText.js:10` via `TestimonialHeading.js` ("They trusted us…"). Banned pattern — replace with solid two-tone spans (pink + orange words), which is what it visually approximates anyway.
- **P2-15 · Marquee headings read as typos when static:** AboutMarquee shows "witch Case Studio" mid-slide (mobile screenshot); footer wordmark similarly clips. Fix: slow/pause-on-view variants sized so a full word set is always visible at mobile widths, or static on mobile.
- **P2-16 · Raw "Loading..." text** where the Moon lazy-loads (`About.js` Suspense fallback) — visible mid-scroll. Fix: styled skeleton in the fixed slot (it already has one for CLS; style it).
- **P2-17 · Eyebrow-label grammar on most sections** ("TRUSTED BY", "WHAT WE BUILD BEST", "PROOF, NOT PROMISES", "PRICING"…). One kicker is voice; on every section it's scaffold. Fix: keep the two strongest ("PROOF, NOT PROMISES" earns its place), vary or drop the rest.
- **P2-18 · Contact banner video has no poster** — renders as a blank orange card until playback (never played on `/contact` live). Fix: `poster` frame (the hand-drawn browser illustration) + play gating check.
- **P2-19 · Dead decorative bands cost mobile scroll:** gradient stripe ~180px with no content between Services and Case Studies; empty dot-gaps in hero (P0-2 covers those). Fix: halve stripe height on mobile.
- **P2-20 · Case-study tiles on mobile drop the website screenshots** — only logo chips remain; the visual proof (the actual sites) never appears at the width most visitors use. Fix: compact screenshot strip or tall-crop cover in the ≤768px tile grid.
- **P2-21 · Pricing index has no price anchors** (`/pricing` rows are name-only). Adding "from $800" per row sets scent and pre-qualifies clicks. (Numbers exist in `pricingData.json`.)
- **P2-22 · Token/System debt (maintainability, not user-facing):** ~126 hardcoded hex literals across component SCSS (worst: aboutPage 12, projectsPage 10, footer 10); z-index values 998/999/1000/9999/**2147483647** (`cursorComponent.scss:14`); ~20 distinct breakpoints with mixed min-/max-width methodology (639/640/641 and 667/668/669 clusters); no shared type scale — every heading its own clamp(). Fix in passing as files are touched: token the hexes, a 5-step z-scale, consolidate to the 4 real breakpoints (480/768/1024/1280), a 6-step clamp scale in `_variables.scss`.
- **P2-23 · Missing alt text (4)**: `SinglePricingCard.js:186`, `CaseStudyTiles.js:78` (project covers — meaningful, should be named), `StripeSection.js:71`, `Reviews.js:135` (avatar — name exists adjacent, `alt=""` defensible; the first two are not).
- **P2-24 · Footer socials commented out** (`Footer.js:17–60`) — zero social presence anywhere. Restore or remove the dead code.

---

## What's working (protect these in Phase 2)

1. **The brand is genuinely distinctive** — custom SCS Display face, hand-drawn star, ink/orange/lilac commitment. Zero template smell. The FAQ-on-orange block and footer star are the two best brand moments on the site.
2. **Proof density is real:** 8 case studies with actual metrics ("↑ 28% appointment bookings"), 6 named testimonials with photos and companies, transparent per-tier pricing. Most agencies fake this; SCS has it and under-displays it (P1-6, P2-20).
3. **Performance culture:** SSG per route, self-hosted subset fonts + metric-compatible fallbacks, IO-gated three.js/TextPressure, documented LCP 6.2→2.9s history. The budget in CLAUDE.md is a moat — Phase 2 must not regress it.
4. **The "Ready to be next?" beat** (testimonial → BOOK A CALL) is the best-constructed conversion moment on the site — the model for the others.
5. **A11y foundations exist:** `:focus-visible` in 12+ files, `sr-only` h1/h2 patterns, aria-complete menu/lightbox/accordion, 21 components on `useReducedMotion`. The gaps (P1-8/9/10) are edges, not absence.

## Persona red flags (summary)

- **Jordan (first-timer):** mobile hero shows an incomplete sentence and no CTA above the fold (P0-2); "Trusted by" tiles look like broken images (P1-6); Submit button looks disabled (P0-3). Abandons before understanding the offer.
- **Casey (mobile, one-handed, hurried):** ~2 viewports of decorative scroll before content; 13px inputs zoom the viewport mid-form; 8px footer text; 2px carousel dots. Each is friction at the exact moments Casey decides.
- **Sam (screen reader / keyboard / low vision):** placeholder-only labels; suppressed focus outlines in 5 components; white-on-orange FAQ below AA; native cursor hidden globally while the custom cursor ignores keyboard focus position.

## Phase 2 plan (proposed order, pending your approval)

1. **Conversion core (P0-1/2/3 + P1-4/5):** CTA hierarchy + single CTA system module, mobile hero compression + typed-slot seed, contact form rebuild. *Highest revenue impact, smallest surface.*
2. **Trust & readability (P1-6/7/8):** client strip, onEnter reveals replacing opacity scrubs, orange-surface contrast.
3. **A11y & mobile floor (P1-9/10/11/12 + P2-23):** labels, focus, reduced-motion wiring, h1s, type/tap floors.
4. **Performance pass (P1-13):** image resizing + srcset on case-study path.
5. **Polish & motion (P2 batch):** gradient-text swap, marquees, poster, skeletons, price anchors, eyebrow diet — plus tasteful new motion where sections are currently static (FAQ open/close spring, tile hover lift on desktop, CTA magnetic hover already exists via MagneticButton — extend consistently).
6. **System debt (P2-22):** opportunistic while touching files; no big-bang refactor.

Tracking: `CHANGELOG.md` + `STATUS.md` per step; every fix verified mobile + desktop with real pixels (house rule); LCP/CLS re-checked after steps 1, 4, 5.

## Verify during implementation — outcomes (2026-07-03 P0 pass)

- ~~White square artifact~~ **RESOLVED:** the custom cursor visual parked at 0,0 before any mousemove (`pointer-events:none`, so `elementsFromPoint` missed it). Benign live; queued as P2: hide cursor until first mousemove.
- ~~Mobile content shifted right~~ **RESOLVED — headless artifact:** both old and new headless Chrome render the shift; the live DOM measures `centerOffset: 0` on headline/CTAs/content. Related true finding: `100vw` sections are `scrollbar-width` wider than the client area (symmetric ~7px bleed, clipped) — P2 note.
- Desktop `/contact` ~700px black gap — **downgraded to likely capture artifact** (same virtual-time class as the black `/pricing` render; mobile live shows no gap). One human look at ~1440 during the owner gate settles it.
- White-on-orange beyond FAQ (badge chips, promo) — still open, sweep with a contrast checker during P1-8.
- Standing rule confirmed useful: verify reveal-related work in a live browser; `scrollIntoView` under smooth-scroll is a silent no-op (use `window.scrollTo({behavior:'instant'})` or instant `scrollIntoView`).
