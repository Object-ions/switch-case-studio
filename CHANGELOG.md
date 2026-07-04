# Changelog — design refresh (`design-audit-refresh`)

User-facing changes only; process detail lives in `.audit/summary.md`. Newest first.

## 2026-07-03 — Visual-elevation pass (13 commits, freehand-approved; awaiting Moses's visible-window verify)

Proposal menu: `VISUAL_ELEVATION.md` (committed first, then Moses approved freehand). All 13 items shipped, one commit each, build green (27 routes) at every step.

- **The hand-drawn brand card is now a sticker** (`3dc8645`): the contact-section video card (EYES ON / INBOX WINS / BUILT TO SHIP) gets a cream frame, −2° tilt, lilac offset shadow; hover straightens + lifts. Desktop-only — the approved mobile card is byte-identical.
- **Booking pills are magnetic** (`3e24647`): hero, AboutCTA, and "Ready to be next?" CTAs pull toward the cursor (existing MagneticButton, subtle 0.35). Inert on touch/reduced-motion; calendar link verified intact.
- **"Trusted by" strip** (`3f85a7a`): orange eight-point stars between client names (rhythm unchanged — gap split in half); marquee pauses on hover/focus.
- **Footer wordmark drifts with scroll** (`bc538d9`): the giant outline "switch case" slides ±30px as the footer scrolls — position-only scrub.
- **One link grammar** (`b0d0e58`): arrow-links nudge +4px, text links get an underline sweep — viewall pill, tile CTAs, header CTA, footer nav — with focus-visible parity everywhere.
- **Print grain on the color moments** (`aef2d79`): 5.5% static SVG noise on the FAQ orange + gradient stripe (masks banding); ~1KB, no JS.
- **"Ready to be next?" gets an entrance** (`16d97fb`): house safe-reveal, strand-proof.
- **Pricing pages join the motion system** (`f959dba`): header/cards/outro/footer stagger in + card hover lift — and this FIXED a real bug: the old `whileInView` header baked `opacity:0` into the static HTML, so pricing h1s were invisible without JS. All 6 routes now ship visible.
- **Stripe orb parallax** (`1ba5181`): the orb floats ±7% as the band scrolls past (plus a transform-ownership fix that kept it correctly centered).
- **Reduced-motion complete** (`3517d6a`): the last 4 unguarded animations (About heading scrub, About paragraphs, gradient heading, Squares canvas) now rest static; About paragraphs also migrated off the reverse-on-scroll-out pattern.
- **FAQ keyboard parity** (`1abd59b`): focused questions read like hovered ones + ink focus ring (there was none).
- **Cursor: press feedback + no phantom square** (`643afee`): dot tightens on click; hidden until the first mousemove (kills the white square at 0,0 — the queued P2) and now correctly centered (fixed a shipped corner-anchor offset).
- **Foundation** (`47e8923`): motion tokens (durations/eases) in `_variables.scss` + JS mirror; new motion consumes them.

Verify-gate notes for Moses: transitions/tweens can't be watched to completion agent-side (occluded-window RAF freeze — known limitation); every END state was proven via DOM probes + settled screenshots. Your visible-window pass is the authoritative check for the glides.

## 2026-07-03 — P1 batch complete (awaiting visual verify)

- **ClientStrip → text wordmarks** (`d91dfa5`, option B, logo-ready for A): 7 client names as cream Inter marks in the same "Trusted by" marquee; first set now in the accessibility tree (only the loop-duplicates are aria-hidden); no more invisible dark tiles.
- **Container tokens** (`0ae7028`): faq + footer carried contact's 1400px bug → `$max-width`; 17 more literals tokenized (zero visual change); deliberate 1100px prose columns left + documented.
- **Reveals safe everywhere** (`a0b11aa`, P1-7 complete): Services rows + FAQ (were scrub-tied) and LandingPageProof (fromTo+once trap) → play-once onEnter + safety nets. AboutHeading's cleanup no longer kills every trigger app-wide. Left as-is: AboutHeading color sweep + AboutMarquee drift (non-opacity scrubs, always readable).
- **Case-study screenshots −86%** (`1859c08`): the 2×-oversampled trio resized to 1318w/q80 — 4.64MB → 0.67MB (birth-of-venus 2.10→0.26, jo-marketing 1.59→0.27, florida 0.95→0.14); five already-right-sized files untouched.

## 2026-07-03 — P1 batch resumed (FAQ contrast shipped; h1 finding corrected; ClientStrip decision: option B)

- **FAQ passes AA on orange** (`2f56ea9`): all text tiers + the +/− icon moved from white (2.44:1 — fail) to `$black-color` ink (5.83:1 — AA at every tier), the promo-proven ink-on-orange recipe; brand moment intact.
- **h1 audit finding was FALSE** — all 26 built routes already have exactly one h1 (the sweep missed `motion.h1`). DESIGN_AUDIT.md corrected; no code change.
- **ClientStrip**: reported + proposals delivered; awaiting Moses's pick (see STATUS.md).

## 2026-07-03 — Desktop contact layout (verified by Moses)

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
