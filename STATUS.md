# STATUS — design refresh

**Branch:** `design-audit-refresh` (11 commits ahead of main; NOTHING pushed — never push without explicit instruction)
**Phase:** 2 — **P1 step 1 (centralized CTA module) done, STOPPED at the owner-verification gate.** Phone stays optional (Moses-confirmed). Remaining P1s queued below.

## Gate: owner verifies in-browser (authoritative signal)

```bash
npm run build && npm run preview   # http://localhost:4173
```

CTA-module gate — every booking CTA now renders through one component/constant pair. Click through each and confirm it renders, reads "Book a Free Strategy Call", and opens the calendar:
1. **/** — header pill, mobile menu (Quick Links), hero primary, About "& Book a Free Strategy Call ↗" text link, Reviews "Ready to be next?" button, contact-info link, footer Connect link.
2. **/about /projects /testimonials /services** — bottom CTA buttons.
3. **/pricing/web-development** — the pricing-card primary button + the page-footer link.
4. **/30-off** — still says "Book a call →" (own funnel/calendar — intentional).
Prior gates (P0s + pre-P1 tweaks) were verified by Moses on-device.

## Next (on owner go-ahead) — remaining P1s in order
AboutCTA mid-page booking moment (weak 13px text link → real button) → FAQ white-on-orange AA contrast → missing h1s (/about /projects /testimonials /services) → ClientStrip recycled/invisible logos → scrub-tied half-opacity reveals → onEnter → 2.2MB case-study images.

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
