# Open tickets

Live list. Close a ticket by deleting its block and logging the outcome in `summary.md`.
Last reviewed: 2026-08-04.

## GA-1 — CLOSED 2026-08-04 (outcome in summary.md)
`generate_lead` starred. `email_click` / `phone_click` deliberately left unstarred by the owner:
they never landed a processed hit (absent from Recent events entirely, not merely unstarred), and
the two lead paths that matter — contact form and book-a-call — are already key events. They
still record as regular events. Reopen only if a conversion metric on mailto:/tel: is wanted;
that needs a hit from outside the filtered IP, then ≤24h before the star is available.

## DEP-1 — react-router 7 (3 moderate advisories) — BLOCKED UPSTREAM, accepted risk
**Decision 2026-08-03: stay on 6.30.4. Do not retry until the watch condition below flips.**

Open: GHSA-wrjc-x8rr-h8h6 (open redirect via backslash in `<Link>`/`useNavigate`),
GHSA-337j-9hxr-rhxg (arbitrary constructor injection via `deserializeErrors()` in SSR
hydration), and a third on `react-router-dom` — "open redirect leading to XSS" (same
open-redirect class, same mitigation reasoning below).

**Count note (2026-08-04):** GitHub's push warning says **3 vulnerabilities**, `npm audit`
says **2** — they count different things. npm counts affected PACKAGES (`react-router`,
`react-router-dom`); GitHub counts ADVISORIES. Neither number is wrong; this ticket previously
recorded only 2 advisories and was incomplete. Don't "reconcile" them again — check
`npm audit --json` and read the `via` arrays. Fixed only in react-router **7.17.1+** — there is **no 6.x backport** (6.30.4 is
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

## SCS-1 — Add Scout to the projects page
**Logged 2026-08-04 at Moses's request. Blocked on product details, not on build work.**

Scout is a web-app service Moses plans to sell as a **monthly retainer** to clients. Details to
come from him; nothing is written yet and nothing should be invented.

What is already verifiable (checked on the VPS 2026-08-04): it runs today as three containers —
`scout-web` (bound 127.0.0.1:3000), `scout-worker`, and `scout-db` (postgres:16-alpine). No
Traefik route, so it is NOT publicly reachable — there is no live URL a visitor could click.

**Business model (Moses, 2026-08-04):** Scout ships as a **paid** product with a public
**"preview" playground** — a sandboxed environment, NOT the real version. The playground is a
public abusable surface: it needs a spend cap, rate limiting, no real client data, and isolation
from the production Postgres before it goes live. Sibling decision: **Studio** (the video-gen app
at studio.switchcasestudio.com, repo currently PRIVATE with no LICENSE) is going **open source** —
that needs a full-history secret sweep and a licence first, per the zahav-audit lesson.

Before it can ship as a case study / project tile, Moses needs to supply: what it does for a
client, who it's for, the retainer framing, and whether there'll be a public URL or a demo. The
projects page is data-driven (`src/data/projects.json`), so once that exists it's a data edit
plus art — see the Jelly Belly entry for the shape (`repos`, `links`, `diagram`, `metrics` are
all optional and render only when present).

Note it is a PRODUCT, not client work — the "Studio Project" labelling question from dropped
action-plan item 1.4 applies to it too.

## Decisions — do NOT re-raise
- **The two Éclore repos stay public (Moses, 2026-08-04).** The 2026-08-04 sweep flagged
  `eclore-new-swiss-theme` ("Private design prototype" in its own README) and
  `eclore-before-after` ("for partner review", carries the clinic's interior photos +
  floor plan) as the same intent-private/visibility-public pattern as `zahav-audit`. Moses
  reviewed the actual contents and confirmed there is nothing sensitive in either. Closed. The
  README wording is what triggered the flag, so a future sweep will hit them again — this note
  is the answer.
- **Action-plan 1.4 is DROPPED, permanently, with the reason recorded (Moses, 2026-08-04).**
  The partner disclosure under Ori Argaman and Yuli is not happening: "nobody needs to know that
  they are now my business partners." This is the reason the ticket had been missing for four
  sessions. Do not re-open it, do not re-ask. The OTHER half of 1.4 (labelling Jelly Belly Wiki
  and Birth of Venus "Studio project") shipped 2026-08-04 and is unaffected.

## Notes that will bite the next person
- **Canonical personal name is "Moses Atia Poston"** (decided 2026-08-04). It is the byline on
  every blog post (`posts.json` + the `add-post.mjs` default), the rule in Beau's
  `JOURNAL-QUEST.md` on the VPS, and the GitHub profile README. Three spellings were in public at
  once ("Moses Atia", "Moses Poston", "Moses Atia Poston"), which splits the one entity the
  findability plan depends on. Any NEW surface that names him uses the full form.
- **Client footer backlinks (action-plan 1.3) are MOSES'S to finish — do not re-raise.** Verified
  2026-08-04: zahavmedspa, crimsonequities, prodanimiami and sha-design all carry a followed
  link (sha-design's is JS-rendered); jomarketing11 and floridaenergyassistance do not. He is
  handling the two.
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
