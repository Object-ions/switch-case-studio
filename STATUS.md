# STATUS — design refresh

**Branch:** `design-audit-refresh` (13 commits ahead of main; NOTHING pushed — never push without explicit instruction)
**Phase:** 2 — **P1 step 2 (AboutCTA promotion, `98e90d8`) done, STOPPED at the conversion-critical verify gate.**

## Gate: owner verifies in-browser (authoritative signal)

```bash
npm run build && npm run preview   # http://localhost:4173
```

AboutCTA gate (conversion-critical) — on **/** scroll to the end of the About narrative (below the moon):
1. "Let's bring your idea to life." lead + cream **BOOK A FREE STRATEGY CALL →** pill, centered, desktop AND phone.
2. It reveals once and STAYS visible (scroll past, scroll back — never re-hides); with OS reduced-motion it's simply there.
3. It visually rhymes with the "Ready to be next?" beat further down.
Prior gates (P0s, pre-P1 tweaks, CTA module) verified by Moses.

## Next (on owner go-ahead) — remaining P1s in order
FAQ white-on-orange AA contrast (report before/after ratio) → missing h1s (/about /projects /testimonials /services) → ClientStrip logos (report + propose, STOP for Moses's approach pick) → scrub-tied reveals → onEnter → case-study image weight (report per-image before/after).

## Verification evidence so far (agent-side)
- Headless screenshots 1440×900 + 390×844 before/after; live-DOM measurement (`centerOffset: 0` — centered, no overflow-shift); consent-error flow + 16px inputs verified in live browser. Build green (27 routes).
- **Audit corrections logged during implementation** (honesty pass, now in DESIGN_AUDIT.md):
  - P0-2's real mechanism = headline size/container pair overflow (NOT "two empty viewports" — that was a 565×1568 window artifact; typed slot was already SSG-seeded, the hole is the backspace phase).
  - The "content shifted right on mobile" and "white square at 0,0" in screenshots = headless-capture artifact and the custom cursor parked at 0,0 respectively (cursor-hide-until-mousemove is queued as P2).

## After the P1s: P2s (11)
Incl. cursor-at-origin hide, GradientText swap, marquee clipping, video poster, pricing "from $X", labels/focus/reduced-motion wiring, mobile type/tap floors, token/z-index/breakpoint debt (opportunistic).

## Standing constraints
- Tokens from `_variables.scss` only; single transform owner per property; `useReducedMotion` on new motion; ScrollTrigger cleanup on unmount; protect proof density, perf moat (LCP/CLS budget), FAQ-orange + footer-star moments, "Ready to be next?" beat.
- Canonical worklog `.audit/summary.md`; user-facing log `CHANGELOG.md`.
