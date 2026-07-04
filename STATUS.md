# STATUS — design refresh

**Branch:** `design-audit-refresh` (18 commits ahead of main; NOTHING pushed — never push without explicit instruction)
**Phase:** 2 — **Desktop contact container + balance fixes (`c860f0d`, `20b7f2e`) done, STOPPED at the verify gate.** P1 queue paused per Moses.

## Gate: owner verifies in-browser (authoritative signal)

```bash
npm run build && npm run preview   # http://localhost:4173
```

Desktop-contact gate v2 (container + balance) — on a screen ≥1024px wide:
1. **/contact** section no longer bleeds wider than other sections — same content width as Services/Reviews (1200px container; probe-verified: inner exactly 1200 at 1440).
2. ONE cohesive pair: form left (736px), 96px gap, graphic-over-info right (288px card) — card pulled ~80px in from the container edge; no dead middle, nothing stranded.
3. Home-page contact section — same behavior.
4. Phone/≤1023px: approved stack unchanged (probe-verified at 390).
5. Content fades up once, stays visible.
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
