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

## DEP-1 — react-router 7 (2 moderate advisories) — BLOCKED UPSTREAM, accepted risk
**Decision 2026-08-03: stay on 6.30.4. Do not retry until the watch condition below flips.**

Open: GHSA-wrjc-x8rr-h8h6 (open redirect via backslash in `<Link>`/`useNavigate`) and
GHSA-337j-9hxr-rhxg (arbitrary constructor injection via `deserializeErrors()` in SSR
hydration). Fixed only in react-router **7.17.1+** — there is **no 6.x backport** (6.30.4 is
the end of the 6 line), so `npm audit fix` can never clear these.

**Why the upgrade is impossible today (tested, not assumed).** Installed
`react-router-dom@7.18.2` and ran a real build — it dies during SSG page rendering:

```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './server.js' is not defined
by "exports" in node_modules/react-router-dom/package.json
imported from node_modules/vite-react-ssg/dist/shared/vite-react-ssg.*.mjs
```

v7 collapsed `react-router-dom` into a thin re-export of `react-router` whose exports map is
only `"."` and `"./package.json"` — the `/server` subpath is gone. `vite-react-ssg` imports
`react-router-dom/server` for `createStaticHandler`, `createStaticRouter` and
`StaticRouterProvider`, i.e. the entire static-rendering path. And its LATEST release (0.9.2,
the only dist-tag) still declares `peerDependencies: react-router-dom ^6.14.1` — no v7 support
exists in any published version or prerelease. A Vite alias cannot patch it either: the
failing import runs in vite-react-ssg's own Node process at build time, not through Vite's
resolver. The lockfile/build were restored afterwards and verified (36 routes, identical asset
hashes, entry-chunk marker intact).

**Why the accepted risk is genuinely small here** — both advisories need an attack surface
this architecture doesn't have:
- *Open redirect*: requires navigating to an attacker-controlled path. The only `navigate()`
  call is `StaggeredMenu.js` with a `to` from `src/data/navigation.js`; every `<Link to>` is a
  literal or built from our own `projects.json`/`posts.json` slugs. No `?next=`/`?redirect=`
  parameter is read anywhere, and there is no auth flow.
- *`deserializeErrors()`*: requires a per-request SSR response an attacker can influence. This
  site is fully static — `__staticRouterHydrationData` is baked at build time from our own
  data and served as immutable files from Netlify. There is no runtime server to poison.

**Watch condition** (one command, re-check when Dependabot nags):
`npm view vite-react-ssg peerDependencies.react-router-dom` — when it accepts `^7`, do the
coordinated bump: router + SSG together, then re-verify route count, asset hashes, the
`__SCS_LANDING_PATHNAME__` entry-chunk marker, and hydration in a real browser on the
production build.

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
