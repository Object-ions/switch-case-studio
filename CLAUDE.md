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
- **Data-driven tiles render conditionally — never ship an empty placeholder box.** The bento `ProjectPage` supports 5 media slots (desktop/mobile/hero-detail/copy-block/CTA-form) + variable metrics, but most projects only have 2 images. Each tile is built from data and filtered out when its field is absent (`[...].filter(Boolean)`), and section wrappers gate on `hasResults`/`hasSummary`/`galleryTiles.length`. The gallery uses `data-count` so it reflows (1 tile = full width, 2–3 = lead + stack) instead of leaving holes. Add optional fields (`mediaMobile`, `mediaCopy`, `mediaCta` + `*Alt`) to `projects.json` and the slot lights up; omit it and it stays hidden.
- **Vite does NOT rewrite `url()` asset refs pulled in through a Sass `@import`.** Post-CRA, the `@font-face` in `src/styles/_variables.scss` kept `url('../assets/fonts/…')`; the build emitted a hashed font but left the CSS path unrewritten ("didn't resolve at build time" warning), so it 404'd → Netlify's SPA `/*→/index.html` fallback served HTML with `Content-Type: text/html` → NeueMachina silently fell back to sans-serif. A 200 status hid it; only content-type exposed it. Fix = serve such fonts from `public/` with a root-absolute path (`url('/fonts/…')`), like images/models already are. Verify font/asset paths by content-type, not status code.
- **Verify UI rendering with real pixels, not computed styles.** A `getComputedStyle`/`elementFromPoint` probe reported "no white flash" while the user saw one — because a page's `background` reads `#000` regardless of an ancestor's animated opacity. Only a CDP screencast (actual composited frames) caught it. For paint/flash/animation bugs, capture pixels.
- **On a mixed light/dark SPA, a page that fades in must sit on a backdrop matching its own theme.** `<body>`/`<main>` are light grey but most pages paint `#000`; fading a page from opacity 0 let the light parent flash through. Fix = per-route `.route-backdrop` (`.is-dark` default, `.is-light` for legal + `/pricing/:slug`). See `src/App.js` `LIGHT_ROUTES`.
