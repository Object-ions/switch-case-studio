# Pricing package board (pilot: Brand Identity)

Owner brief, 2026-09-26: a regular visitor reading `/pricing/design-branding` cannot picture what a tier buys. Show it, on the studio's own brand.

Round one (a cream "what you walk away with" band of big tiles on top of each stacked tier card) was built and rejected on sight: "I love it BUT it's very not clear, too much going on, we need a different way to compare the packages." The art stayed; the structure became a comparison board.

## What ships

One cream brand-book sheet per service, replacing the three stacked tier cards:

- **Rows** are the deliverables: a thumbnail of the tile art (72 px, ink rule, hard shadow) and a short name.
- **Columns** are the packages: name, price, one line for whom (in the tier description's own words). The `badge` tier ("Best value") gets a lavender column tint and chip.
- **Cells** carry a terra dot when the package includes the row. Rows are grouped by the package that introduces them, in package order, so the dots form a staircase. Where the data grades a deliverable, the cell carries the grade ("Basic / Expanded / Custom", "5–7 posts and stories", "Basic, PDF / 15+ pages").
- **Foot rows:** "How we get there" (the process steps per package, which are not deliverables) and "In full", a native `<details>` "Full list" per package holding that tier's `includes` verbatim. `pricingData.json` stays the source of truth; nothing is deleted.
- **Caption on every board:** "Shown on our own brand. Yours is built from scratch."
- **Proof** appears once under the board (`RotatingProof`, extracted from `SinglePricingCard`), then the page's existing outro and CTAs. No CTA row on the board: three identical buttons were noise, and the outro already has them.

Tile art: `src/components/pricing/spreads/brandIdentity.js`, 400×300 SVGs in the brand-book language (cream page, ink lines, site palette, wordmark image, star mark, sticker shapes).

### Brand Identity rows

| Group | Rows |
| --- | --- |
| In every package | Logo files (AI, SVG, PNG, JPG), Colour palette, Type, 1-page brand sheet |
| From Brand Starter Kit | Mood board, Social templates, Business card, Brand guide |
| From Brand System & Launch | Logo system, Design patterns, Presentation template, Homepage direction |

## Structure

- `src/components/pricing/PackageBoard.js`: `<PackageBoard serviceId tiers formatPrice />`, a real `<table>` named by the page's h2 (`aria-labelledby`; the tier cards' h2 titles left with the cards, so the board carries the page's h2), `scope` on every header, `<tbody>` per group, `<tfoot>` for the text rows. `hasPackageBoard(serviceId)` gates it; services without a board keep the stacked cards.
- `src/components/pricing/spreads/brandIdentity.js`: `TILES` (id, label, Art) and `TIERS` keyed by tier name (`tiles`, `inherits`, `notes`, `for`, `process`).
- `src/components/ui/RotatingProof.js` + `rotatingProof.scss`: the rotating quote, used by the board page and by `SinglePricingCard`.
- `src/styles/components/packageBoard.scss`: table styles, the `.is-best` column tint, the `tsp-f-*` extra fills, phone sizes (≤720 px: the matrix stays a matrix, one notch smaller).
- `PricingGuide` renders the board + one proof when `hasPackageBoard`, else the cards.

## Deep links and proof (added the same day, after "should each package have its own page?": no)

- Each column head carries `id` = the package name slugified (`#logo-style-guide`, `#brand-starter-kit`, `#brand-system-launch`). The static HTML has the id, so the browser lands on it without JS; `ScrollToTop` handles hash navigation in-app. After hydration the column's cells take `is-target` (stronger lavender) and that package's full list opens.
- A "Seen in" foot row links a shipped case study whose brand scope matches the package (`example` in `TIERS`). Brand System & Launch → My Challah Dealer; the other two have none yet (owner's call). The row renders only when at least one package has an example.
- Per-package pages are not built: thin near-duplicates, 17 of them to keep in sync, and the visitor's next step is a call. Revisit when a tier has 2+ shipped examples.

## Rules honoured

- Static HTML is the finished picture: no JS, no hidden state, no motion. `<details>` is native.
- One heading on the board, the page's h2; the page keeps h1 → h2 → h3.
- SCS Display appears only as a type specimen inside tiles.
- No em dashes; every number on the board repeats a tier's own copy.
- Every asset referenced is ours.

## Verification

- `npm run build`; 48 routes; the em-dash gate returns the one known hit; `__SCS_LANDING_PATHNAME__` in the entry chunk.
- Shots of `/pricing/design-branding` at 1440 and 390: 12 rows, 3 `<details>`, one `.rp` quote; no horizontal scroll at 390.
- `/pricing/web-development` still renders its quote inside each card (the RotatingProof extraction changed no pixels).
- `python3 scripts/ai-writing-scan.py`: site zeros hold.

## Out of scope

Boards for Web Development, AI & Automation, SEO & AI Search: same component, their own tile art and `TIERS`, a later pass once this one is approved live.
