# GA4 — status & operations

Property: `G-DWY90CQY6P` (baked into the build from Netlify env var `VITE_GA_MEASUREMENT_ID`; changing it requires a redeploy).

## 2026-08-03 — "No data received" was a CSP block (fixed)
The tag was installed correctly the whole time; `netlify.toml`'s `connect-src` allowed
`https://*.analytics.google.com` but NOT the apex `https://analytics.google.com`, which is
where gtag sends every hit once consent is granted on this Ads-linked property. 100% of
post-consent hits were dropped by the browser before hitting the network (no console watcher,
no resource-timing entry → looked exactly like "tag never fired"). Fix: apex host +
`stats.g.doubleclick.net` added to `connect-src`/`img-src`. Requires a redeploy to take effect.
Proof: the same init snippet run on a CSP-free origin (example.com) registered in Realtime
within seconds while prod registered nothing.

## Verified live (2026-06-03, headless browser against production)
- Pre-consent: cookieless ping only (`gcs=G100`) — Consent Mode v2, default denied. Correct.
- Banner Accept → choice persisted (`localStorage: scs-analytics-consent`).
- Returning granted visitor: full `page_view` with `gcs=G111`, no banner re-prompt. Correct.

## Implementation
- `src/analytics/ga.js` — init, consent, `page_view` per route, delegated click tracking:
  `book_call_click` (links to calendar.app.google), `email_click` (mailto:), `phone_click` (tel:).
- `src/analytics/ConsentBanner.js` — the banner.
- Off in dev builds unless `VITE_GA_DEBUG=true`.

## Admin setup (GA4 admin, not code)
1. ~~Toggle `book_call_click` as a key event~~ — **DONE** (verified 2026-08-03, Admin → Data
   display → Events → Key events: `book_call_click` and `ads_conversion_Contact_Us_1` starred;
   `purchase` intentionally off). The "Streams active in the last 28 days" column reads "No
   stream data detected" only because the CSP block starved the property — expect it to fill in.
2. `generate_lead` — **DONE 2026-08-04** (starred from Recent events once the ≤24h processing
   lag cleared). Key events are now `ads_conversion_Contact_Us_1`, `book_call_click`,
   `generate_lead`; `purchase` intentionally off.
3. Optional, still open: `email_click` / `phone_click`. **Cannot be starred yet** — neither name
   appears in Recent events at all, i.e. no PROCESSED hit exists (probably swallowed by the
   internal-traffic filter while it was Active). GA4 has no create-key-event-by-name, so this
   needs: filter → Inactive, click a mailto: and a tel: on prod, filter → Active, wait ≤24h.

## 2026-08-04 — "No data received" cleared
Standard reports populated (Active users 4, Event count 32, Key events 3 over 7 days; pages,
countries and traffic acquisition all filled). `Example Domain` / `diag` rows are the 08-03
CSP diagnostic hits, expected. The CSP fix is confirmed in processed data, not just Realtime.

## How to check it's working
GA4 → **Reports → Realtime**, open switchcasestudio.com in another tab, accept cookies, click a "Book a Free Call" CTA — you should see `page_view` and `book_call_click` within seconds.
