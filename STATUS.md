# STATUS — design refresh

**Branch:** `design-audit-refresh` (2 + 3 commits ahead of main; NOTHING pushed — never push without explicit instruction)
**Phase:** 2, step 1 of 4 — **P0s implemented, STOPPED at the owner-verification gate**

## Gate: owner verifies in-browser (authoritative signal)

```bash
npm run build && npm run preview   # http://localhost:4173
```

Check, desktop AND a real phone (or devtools device mode):
1. **/** hero — "Book a Free Call" solid primary; whole headline + both CTAs above the fold; no text under the header; headline never bleeds off a phone screen.
2. **/contact** — labels visible on all 4 fields; phone marked optional; tapping inputs on iPhone does NOT zoom; "Send message" looks alive; clicking it unticked shows the orange explanation and focuses the checkbox.
3. While there: check /contact top spacing at desktop ~1440 wide (an old headless capture suggested a large dark gap above the content — believed to be a capture artifact; one human look settles it).

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
