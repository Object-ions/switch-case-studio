# Changelog — design refresh (`design-audit-refresh`)

User-facing changes only; process detail lives in `.audit/summary.md`. Newest first.

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
