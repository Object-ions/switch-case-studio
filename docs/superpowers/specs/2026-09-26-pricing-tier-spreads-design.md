# Pricing tier spreads (pilot: Brand Identity)

Owner brief, 2026-09-26: a regular visitor reading `/pricing/design-branding` cannot picture what a tier buys. Show it, on the studio's own brand.

## What ships

Each tier card on a pricing page gets a **full-width band at the top**, above the offer and included columns: a cream "brand-book page" with labelled tiles, one tile per deliverable. Language is the studio's own brand-book (My Challah Dealer pages: cream sheet, hard-shadow tiles, diamond labels), drawn with the site tokens.

Tiles show Switch Case Studio's real brand: the lavender wordmark (`/brand/switch-case-studio-logo-square-lilac.svg`), the star mark (`SCSLogo`), the site palette (cream, lilac, terra, mint, ink), the type pairing (SCS Display + Inter), sticker shapes drawn in the same vocabulary. Caption on every band: "Shown on our own brand. Yours is built from scratch."

Tiles are deliverables, never process steps (no "discovery call" tile).

### Brand Identity tiers

| Tier | Tiles |
| --- | --- |
| Logo & Style Guide | Logo (with AI SVG PNG JPG chips), Colour palette (5 swatches + hex), Type pairing, 1-page brand sheet |
| Brand Starter Kit | "Everything in Logo & Style Guide" contact sheet (the four tiles above, small), Mood board, Social templates (3 phone frames), Business card, Brand guide PDF (page stack) |
| Brand System & Launch | "Everything in Brand Starter Kit" contact sheet, Logo system (wordmark / mark / lockup), Design patterns (grid, grain, stickers), Guidelines 15+ pages (fanned stack), Presentation template, Homepage direction (browser frame) |

The contact-sheet tile is how "this tier includes the one below" is shown: the same idea as the home pan's end card, so it reads as one family.

## Structure

- `src/components/pricing/TierSpread.js`: `<TierSpread serviceId tierName />`. Looks up `SPREADS[serviceId][tierName]`; renders `<figure class="tsp">` with the tile grid and the caption, or `null` when no spread exists (the other three services, until they get theirs).
- `src/components/pricing/spreads/brandIdentity.js`: the tile art for `design-branding` (`TILES` map: id, label, `Art` SVG) and the per-tier tile lists.
- `SinglePricingCard` gains a `spread` prop, rendered as `.spc__spread` before `.spc__inner`.
- `PricingGuide` passes `<TierSpread serviceId={serviceId} tierName={tier.name} />`.
- Styles: `src/styles/components/tierSpread.scss`. Tile grid `repeat(auto-fit, minmax(150px, 1fr))`, 4:3 tiles, label under each; ≤480px two columns.

## Rules honoured

- Static HTML is the finished picture: no JS, no hidden state, no motion (the card's existing hover lift stays).
- No headings inside the band (figure + figcaption + spans), so the page keeps h1 → h2 → h3.
- SCS Display appears only as a type *specimen* inside tiles, never as a heading.
- No em dashes; no unsourced numbers (the "15+ pages" label repeats the tier's own copy).
- Every asset referenced is ours: the wordmark SVG, the star mark component, the tokens. Sticker shapes are redrawn, not the 13–46 KB font-embedding SVGs in `public/stickers/`.

## Verification

- `npm run build`; route count still 48; em-dash grep returns the one known hit; `__SCS_LANDING_PATHNAME__` in the entry chunk.
- Headless shots of `/pricing/design-branding` at 1440 and 390: every tile visible, band width equals card width, no horizontal page scroll at 390.
- `python3 scripts/ai-writing-scan.py` unchanged on the zero counters.

## Out of scope

Spreads for Web Development, AI & Automation, SEO & AI Search: same component, their own tile art, a later pass once the pilot is approved live.
