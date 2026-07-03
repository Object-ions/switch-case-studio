# STATUS — design refresh

**Branch:** `design-audit-refresh` (16 commits ahead of main; NOTHING pushed — never push without explicit instruction)
**Phase:** 2 — **Desktop contact layout (`ffd7633`) + contact reveal hardening (`ed9fe2b`) done, STOPPED at the verify gate.**

## Gate: owner verifies in-browser (authoritative signal)

```bash
npm run build && npm run preview   # http://localhost:4173
```

Desktop-contact gate — check on a screen ≥1024px wide:
1. **/contact**: ONE row — form (heading/fields/consent/Send) on the LEFT; EYES-ON graphic on top of the RIGHT column with address/email/booking link beneath it; columns top-aligned, no black void.
2. Same section on the home page (above the FAQ) — same two-column behavior.
3. Phone (or ≤1023px): EXACTLY the approved stack — form → info → graphic, unchanged.
4. Section content fades up once and stays visible (never re-hides on scroll-back).
Prior gates (P0s, pre-P1 tweaks, CTA module, AboutCTA) verified by Moses.

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
