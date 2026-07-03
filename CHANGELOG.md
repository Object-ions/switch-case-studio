# Changelog — design refresh (`design-audit-refresh`)

User-facing changes only; process detail lives in `.audit/summary.md`. Newest first.

## 2026-07-03 — Desktop contact layout (awaiting visual verify)

- **/contact desktop is one two-column row** (`ffd7633`): form left (46rem cap), EYES-ON graphic over contact-info right, top-aligned — no more stranded graphic beside a black void. ≥1024px only; approved mobile/tablet layouts render identically (geometry-probed at 1440 + 390).
- **Contact entrance hardened to the safe-reveal pattern** (`ed9fe2b`, P1-7 slice pulled forward): play-once onEnter + in-view fallback + safety net + reduced-motion no-hide + trigger cleanup. (Investigation note: the live "frozen tween" turned out to be an occluded browser window suspending RAF — code ships as robustness/pattern consistency.)

## 2026-07-03 — P1 step 2: mid-page booking moment (verified by Moses)

- **AboutCTA promoted from 13px text link to a real conversion beat** (`98e90d8`): centered SCS-Display lead + cream pill (`BookCallCta`), rhyming with the Reviews "Ready to be next?" beat. Reveal rebuilt to the safe pattern (onEnter play-once + safety net + reduced-motion static + proper ScrollTrigger cleanup — the old effect leaked its trigger). Copy: "To life" → "to life".

## 2026-07-03 — P1 step 1: centralized CTA module (verified by Moses)

- **One source of truth for the booking CTA** (`934d074`): `src/data/cta.js` (label + calendar URL) + `src/components/ui/BookCallCta.js`. All 13 callsites swapped; styling untouched (classNames stay at callsites). Changing the label or calendar is now a one-line edit. Promo + partners funnels remain deliberately separate (documented in cta.js).

## 2026-07-03 — Pre-P1 tweaks from Moses's on-device review (verified by Moses)

- **/contact is form-first** (`7f45b75`): form → contact-info → banner graphic top-to-bottom; the info|graphic pair is one closing band on desktop. Applies to the home Contact section too (shared component). Form column capped at 46rem. The "dark void above /contact at desktop" from earlier captures = `contactPage.scss`'s intentional vertical centering, visible only in 2400px+ capture windows — no real-viewport issue.
- **One booking label everywhere** (`2d82bb0`): 13 labels / 7 variants → **"Book a Free Strategy Call"**. Footer's redundant FREE badge dropped. Excluded on purpose: promo + partners pages (separate funnels). Centralized CTA module still queued as P1.
- **Hero pills no longer full-bleed on phones** (`8c7174b`): `min(80%, 20rem)` centered — measured against the hero text block (headline ink 87%, sub 52%); grow-not-wrap guarantees the longer label stays one line down to 320px.

## 2026-07-03 — Phase 2 / P0 (awaiting owner visual verification)

### Hero (`027c9df`)
- **"Book a Free Call" is now the solid primary CTA** (was ghost secondary behind "See Our Work"). Deliberate reversal of the 2026-06 pre-pitch S3 decision — the goal is now booked calls.
- **Headline no longer overflows the fold**: clamp max 7.28rem → 6rem, container `min(12em, 100%)`. Before: 6-line rewrap clipped line 1 under the header and pushed both CTAs below the 1440×900 fold; phones could see the h1 bleed off-viewport. After: full lockup + subhead + both CTAs above the fold at 1440×900 and 390×844.
- **Typed verb "hole" reduced ~13% → ~6% of each cycle** (backSpeed 35, backDelay 2400) — the headline reads "We ␣ websites…" only briefly now.

### Contact form (`a5d0845`)
- Required fields **5 → 3** (name, email, message). Last-name field removed; **phone optional**, format-checked only when provided.
- **Visible labels** above every field (were placeholder-only, vanishing on focus); placeholders demoted to examples.
- **16px input floor** on mobile (`max(1rem, 16px)`) — kills iOS auto-zoom (body shrink made 1rem = 13px).
- Submit: **"Send message"**, solid orange, only disabled while sending. Consent enforced at submit time with a visible explanation + focus move (was a permanently disabled-looking button). Consent label text now toggles the box.

## 2026-07-03 — Phase 1 (`38ad243`, `d059aa5`)
- `DESIGN_AUDIT.md` (3 P0 / 10 P1 / 11 P2) + `PRODUCT.md` committed; approved for Phase 2.
- Housekeeping: CRA residue sweep (zero live hits; historical mentions marked as such in `vite.config.js`, `CLAUDE.md`, `.audit/summary.md`), stack fact recorded (Vite 7 + vite-react-ssg, output `build/`).
- (`d059aa5` also carries the separate hidden agency-wholesale page: `/p/:token` SHA-256 gate + Netlify `/p/*` rewrite + `X-Robots-Tag`.)
