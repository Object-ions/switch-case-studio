# GA4 — status & operations

Property: `G-DWY90CQY6P` (baked into the build from Netlify env var `VITE_GA_MEASUREMENT_ID`; changing it requires a redeploy).

## Verified live (2026-06-03, headless browser against production)
- Pre-consent: cookieless ping only (`gcs=G100`) — Consent Mode v2, default denied. Correct.
- Banner Accept → choice persisted (`localStorage: scs-analytics-consent`).
- Returning granted visitor: full `page_view` with `gcs=G111`, no banner re-prompt. Correct.

## Implementation
- `src/analytics/ga.js` — init, consent, `page_view` per route, delegated click tracking:
  `book_call_click` (links to calendar.app.google), `email_click` (mailto:), `phone_click` (tel:).
- `src/analytics/ConsentBanner.js` — the banner.
- Off in dev builds unless `VITE_GA_DEBUG=true`.

## Remaining one-time setup (GA4 admin, not code)
1. **Admin → Events** → toggle `book_call_click` as a *key event* (conversion).
2. Optional: same for `email_click` / `phone_click`.

## How to check it's working
GA4 → **Reports → Realtime**, open switchcasestudio.com in another tab, accept cookies, click a "Book a Free Call" CTA — you should see `page_view` and `book_call_click` within seconds.
