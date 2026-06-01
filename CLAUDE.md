# Switch Case Studio (SCS) — Working Instructions

Living instructions for AI work on this project. **Every fix from a review goes back into this file** — that's how it improves as it goes (Rule 5).

## Thumb rules (always on)

1. **Write sharp, not more.** AI made words cheap; substance is the scarce thing. Attention is the currency — pack the most information into the fewest words. Applies to site copy *and* to anything I write here.
2. **Build instructions that learn.** When a review surfaces a fix, the fix lands in the code *and* the rule lands here, so the same mistake isn't repeated. Add to "Review fixes → rules" below.

(Full set of general working rules: `~/Downloads/ai-rules-of-thumb.md`.)

## Status

Running audit + status doc: `.audit/summary.md` — keep it current with git, not behind it.

## Review fixes → rules
<!-- One line per fix: what broke in review → the rule it becomes. Newest on top. -->
- **Verify UI rendering with real pixels, not computed styles.** A `getComputedStyle`/`elementFromPoint` probe reported "no white flash" while the user saw one — because a page's `background` reads `#000` regardless of an ancestor's animated opacity. Only a CDP screencast (actual composited frames) caught it. For paint/flash/animation bugs, capture pixels.
- **On a mixed light/dark SPA, a page that fades in must sit on a backdrop matching its own theme.** `<body>`/`<main>` are light grey but most pages paint `#000`; fading a page from opacity 0 let the light parent flash through. Fix = per-route `.route-backdrop` (`.is-dark` default, `.is-light` for legal + `/pricing/:slug`). See `src/App.js` `LIGHT_ROUTES`.
