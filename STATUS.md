# STATUS — design refresh

**Branch:** `design-audit-refresh` (9 commits ahead of main; NOTHING pushed — never push without explicit instruction)
**Phase:** 2 — **P0s + Moses's 3 pre-P1 tweaks implemented, STOPPED at the owner-verification gate** (P1 batch NOT started)

## Gate: owner verifies in-browser (authoritative signal)

```bash
npm run build && npm run preview   # http://localhost:4173
```

Check, desktop AND a real phone (or devtools device mode):
1. **/** hero — "Book a Free Strategy Call" solid primary, ONE line even on small phones; pills ~80% width, centered, not full-bleed; whole headline + both CTAs above the fold; no text under the header.
2. **/contact** — FORM is the first thing on the page (info + orange banner below it); labels on all 4 fields; phone optional; no iOS zoom on tap; "Send message" alive; clicking it unticked → orange explanation + focus moves to the checkbox.
3. Booking CTA label reads "Book a Free Strategy Call" in: header pill, mobile menu, hero, Reviews, footer Connect, /pricing/:slug guide, /about, /projects, /testimonials, /services bottom CTAs. (Promo + partners pages intentionally keep their own funnel labels.)
4. Home page Contact section (shared component) — confirm the form-first order reads well there too, above the FAQ.
   [resolved] the old "/contact dark gap at desktop" = intentional vertical centering in contactPage.scss; only visible in extra-tall capture windows.

## Verification evidence so far (agent-side)
- Headless screenshots 1440×900 + 390×844 before/after; live-DOM measurement (`centerOffset: 0` — centered, no overflow-shift); consent-error flow + 16px inputs verified in live browser. Build green (27 routes).
- **Audit corrections logged during implementation** (honesty pass, now in DESIGN_AUDIT.md):
  - P0-2's real mechanism = headline size/container pair overflow (NOT "two empty viewports" — that was a 565×1568 window artifact; typed slot was already SSG-seeded, the hole is the backspace phase).
  - The "content shifted right on mobile" and "white square at 0,0" in screenshots = headless-capture artifact and the custom cursor parked at 0,0 respectively (cursor-hide-until-mousemove is queued as P2).

## Next (on owner go-ahead)
1. **P1s (10)** — order: AboutCTA promotion → CTA copy/URL centralization (`src/data/cta.js`) → ClientStrip → onEnter reveals replacing opacity scrubs → FAQ orange contrast → labels/focus/reduced-motion wiring → h1s → mobile type/tap floors → image resizing.
2. **P2s (11)** — incl. cursor-at-origin hide, GradientText swap, marquee clipping, video poster, pricing "from $X", token/z-index/breakpoint debt (opportunistic).

## Standing constraints
- Tokens from `_variables.scss` only; single transform owner per property; `useReducedMotion` on new motion; ScrollTrigger cleanup on unmount; protect proof density, perf moat (LCP/CLS budget), FAQ-orange + footer-star moments, "Ready to be next?" beat.
- Canonical worklog `.audit/summary.md`; user-facing log `CHANGELOG.md`.
