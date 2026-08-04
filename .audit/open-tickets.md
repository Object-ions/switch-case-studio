# Open tickets

Live list. Close a ticket by deleting its block and logging the outcome in `summary.md`.
Last reviewed: 2026-08-03.

## GA-1 — Star `generate_lead`, `email_click`, `phone_click` as key events
**Blocked until 2026-08-04 (GA processing lag), then ~3 clicks.**

GA4 only lets you star an event that appears in **Admin → Data display → Events → Recent
events**, and that list is built from PROCESSED data — new event names take up to 24h to
appear even though Realtime shows them instantly. All three were fired against production on
2026-08-03 and confirmed arriving in Realtime; they were still absent from the Recent events
list the same evening.

- Do it: Admin → Data display → Events → **Recent events** tab → click the ☆ on each of
  `generate_lead`, `email_click`, `phone_click`. Filled star = key event.
- Not urgent, because lead conversions are ALREADY counted: `ads_conversion_Contact_Us_1`
  (an existing key event, minted by a Google Ads event-create rule in the container) fires on
  the same contact-form submit. Starring `generate_lead` adds the GA-native metric.
- Cannot be automated unattended — the GA session lives in the owner's Chrome profile, so a
  cloud/cron agent has no way to authenticate.

## GA-2 — Confirm standard reports populate
**Check 2026-08-04/05.**

Realtime is proven end-to-end. Confirm the Home "No data received" card clears and standard
reports fill in (24–48h lag). If reports are still empty by 08-05, something beyond the CSP
block is wrong — start from the stream's "Data collection is active" state, not the tag.

## DEP-1 — react-router 7 upgrade (2 moderate advisories)
**Real upgrade project, not an `npm audit fix`.**

Open: GHSA-wrjc-x8rr-h8h6 (open redirect via backslash in `<Link>`/`useNavigate`) and
GHSA-337j-9hxr-rhxg (arbitrary constructor injection via `deserializeErrors()` in SSR
hydration). Fixed in react-router **7.17.1+**; we're on **6.30.4**, and `vite-react-ssg@0.9.0`
pins the v6 line — so this is a coordinated router+SSG major bump touching `routes.js`,
`getStaticPaths`, and every `Seo`/helmet path. Scope it deliberately; the 2026-08-03
`npm audit fix` cleared everything else (both highs + the low).

## Notes that will bite the next person
- **The internal-traffic data filter is ACTIVE and its "Testing" state is gone for good.**
  Once a GA4 data filter has been Active, GA offers only Active/Inactive — reverting to
  Testing is not possible. To make owner-side test hits visible again you must flip the
  filter to **Inactive**, fire the hits, then flip it back to **Active** (each activation
  re-shows the "destructive and irreversible" confirm). Done twice on 2026-08-03.
- The filter matches the owner's public IP as `/32` CIDR. Residential IPs rotate: if it
  changes, owner visits start counting again AND the old IP (if reassigned) silently excludes
  a stranger's visits. Re-check the rule if the numbers ever look odd.
- Verifying the contact form without emailing anyone: stub `XMLHttpRequest.prototype.send` +
  `window.fetch` for `api.emailjs.com` to fake a 200, then fill and submit. `trackEvent` fires
  synchronously in the submit gesture stack BEFORE EmailJS, so the GA path is unaffected by
  the stub. Used on 2026-08-03; the form's consent control is a `<button
  class="contact-form__checkbox">`, NOT an `input[type=checkbox]`.
