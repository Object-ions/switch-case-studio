# Mobile Design Audit — ticket log

Opened 2026-08-02 from Moses's on-device review (8 iPhone screenshots) + code/live investigation.
Working doc for multi-session fixes: pick a ticket, fix it, mark it, note the commit.
Register: brand ("the brand is the demo" — PRODUCT.md). Desktop pass comes later; this log is MOBILE.

**Root theme (Moses's diagnosis, confirmed in code):** the perf/SEO passes stripped or
pointer-gated most of the reactive layer. On touch there is no hover — so the cursor, logo
spin, TextPressure warp, service-row overlay wipe, and tile lifts all vanish, and the site
reads static. Perf was NOT the reason for most of these (only the Moon chunk + tile
particles are perf gates); they're `hover:hover` gates that never got a touch equivalent.

## Scorecard (impeccable audit dimensions, mobile)

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3/4 | Footer link rows < 44px touch targets; about body text 14.4px |
| 2 | Performance | 4/4 | LCP work held; no regressions found in this pass |
| 3 | Responsive design | 2/4 | Moon scroll-trap; TextPressure broken static state; footer length |
| 4 | Theming | 3/4 | Tokens used; AboutHeading colors hardcoded in JS (#e9add7/#ff8347) |
| 5 | Anti-patterns | 2/4 | Double "what we do" list; 11 identical title+copy blocks in a row; kicker grammar |
| **Total** | | **14/20** | Good bones, monotone mobile experience |

**Anti-pattern verdict:** the mobile page doesn't read AI-generated, it reads *flattened* —
distinctive desktop moves degrade to plain stacked text lists. The charm loss IS the finding.

---

## Tickets

Severity: P0 blocking / P1 major / P2 minor / P3 polish. Status: OPEN unless noted.

### M1 [P1] LPP and Services rows are the same section twice — FIXED — merged to main aa0be7c, device-passed
Direction (a) merge, implemented: feature cards + "See our work" CTA removed; LPP header
(kicker now "What we do") is the intro to the Services rows; seam padding tuned both sides;
white-label line folded into the body copy so the Agency-ready card's content survives.
**Moses's #1.** (Screens 1–4.) Home order is LPP ("One studio. Design, code & AI." + 4
bordered cards: Websites & stores / Apps & dashboards / AI & automation / Agency-ready)
immediately followed by Services rows (7 rows: AI Development / Automation & AI Workflows /
Web Development / …). On mobile that is ~11 consecutive title+grey-paragraph blocks with
near-identical semantics (LPP's "AI & automation" card vs the "AI Development" AND
"Automation & AI Workflows" rows) and identical presentation cadence. Desktop hides this
(cards are a grid, rows have the overlay-wipe hover); mobile exposes it.
**Direction (pick one, Moses decides):**
- (a) Merge: kill LPP's card list, keep its heading + body as the intro *to* the Services
  rows (one section: statement → rows). Cheapest, strongest.
- (b) Differentiate: LPP becomes proof-flavored (metrics, mini case strip, client logos)
  so one section says "what we do", the other "proof we do it".
- (c) Reorder: move Services rows below Case Studies so the two lists never touch.
**Files:** `routes.js` (order), `LandingPageProof.js`, `Services.js`, `landingPageProof.scss`.
**Effort:** S–M. **Command:** `/impeccable distill` then `layout`.

### M2 [P1] TextPressure (CASE STUDIES) ships a broken-looking static state on touch — FIXED — merged to main 13079e6
Direction (a): scroll-driven warp on touch — the virtual cursor sweeps across the title as
it travels the viewport (computed inside frame() before writes; batching + settle-stop
kept; scroll events wake the loop). Reduced-motion now paints a UNIFORM pass (wght 500 /
wdth 110 / slnt 0) instead of the frozen center-warp.
**Moses's #2.** (Screen 5.) `TextPressure.js` gates the warp loop off on `(hover: none)`
and paints ONE batched pass with the virtual cursor parked at the container center — center
letters get max wght/wdth, edge letters hairline-condensed. "CASE" renders as spread
hairlines, "STUDIES" half-thin half-heavy. It doesn't read as intentional typography, it
reads as a font failure. Desktop is untouched (works beautifully).
**Direction:** give touch a *time/scroll* input instead of a cursor:
- (a) Scroll-driven warp: map the virtual cursor x to scroll progress through the section
  so letters ripple as you scroll past. One RAF only while visible (IO gate already
  exists), reads as designed motion. Reduced-motion → uniform static pass.
- (b) Add touch-drag warp (finger = cursor while touching the headline) on top of (a).
- (c) Minimum fix: make the static pass UNIFORM (mid wght/wdth for all letters) so it
  looks like a set piece of type, not a glitch.
**Constraint:** keep the batched read/write + settle-stop rules (CLAUDE.md animation-loop
rule). **Files:** `TextPressure.js`. **Effort:** M. **Command:** `/impeccable animate`.

### M3 [P1] AboutHeading lost its display voice — FIXED — merged to main 31e2da7, device-passed
Direction (a): SCS Display restored as the third display exception (policy updated in
CLAUDE.md). A/B against Inter at 3rem with risk glyphs zoomed came back clean on the v3
metrics. line-height 1.15, text-wrap: balance; scrub colors moved to tokens
($about-scrub-from/-to → :root custom props, JS reads with sync'd fallbacks).
**Moses's #3.** (Screen 6.) `.work-heading` is `$font-text` (Inter) 2rem on mobile, weight
400, default line-height/tracking, per-word spans with trailing `&nbsp;`. It was SCS Display
before the h1-only font policy (the policy exists because the face's broken advances
collided at h2 sizes — but the v3 metrics fix has since repaired advances). Today it reads
as an unstyled paragraph with "too much air".
**Direction (Moses picks):**
- (a) Restore SCS Display here as a third deliberate display exception (wordmark + marquee
  precedent) — the metrics fix makes it viable again; verify collision glyphs (`b x u q z r`)
  in this copy at 2rem before committing, and update the CLAUDE.md policy rule with the
  exception.
- (b) Keep Inter but typeset it: weight 650–700, line-height 1.15, letter-spacing -0.02em,
  size up to ~2.4rem mobile, `text-wrap: balance`, tighter max-width (~24ch).
- Either way: move the hardcoded scrub colors (#e9add7 → #ff8347) into tokens.
**Files:** `work.scss` (.work-heading), `AboutHeading.js`, CLAUDE.md if (a).
**Effort:** S. **Command:** `/impeccable typeset`.

### M4 [P1] Moon reads as a flat grey disc + hijacks touch scroll — OPEN
**Moses's #4.** Verified live: model + HDRI both load (200s, no console errors). Two
separate defects:
1. **Flat:** lighting is ambient 0.6 + white directional + full HDRI environment — even
   wash from all directions = no terminator/shadow side, so the sphere has no depth cue;
   the lilac tint (#f0d7ff multiply) barely reads. Not a perf casualty — a lighting-design
   gap that arrived with the HDRI vendoring/speed pass.
   **Fix:** drop ambient to ~0.1, kill or heavily dim the Environment contribution
   (`environmentIntensity`), one strong off-axis key light (slightly behind-left for a
   crescent terminator), optional faint rim light or CSS radial glow behind the slot,
   retint. Slow existing rotation is fine.
2. **Scroll trap (new find, P1 on its own):** `OrbitControls` is enabled — on mobile a
   one-finger swipe over the 300px-tall full-width slot ROTATES THE MOON instead of
   scrolling the page; desktop wheel over it zooms the camera instead of scrolling.
   **Fix:** `enableZoom={false}` everywhere; on touch either `enabled={false}` (decorative
   auto-rotation only) or `touches: { ONE: null }` so one-finger scroll passes through.
**Files:** `Moon.js`, maybe `work.scss` (glow). **Effort:** M. **Command:** `/impeccable polish`.

### M5 [P1] Footer link columns: 25+ small grey links in four flat stacked lists — FIXED — merged to main cbce441
Explore column → compact inline utility strip between grid and wordmark (links survive,
height doesn't); Case Studies → top 4 + "All case studies →"; desktop grid 5→4 cols; touch
targets: link + legal rows get 0.55rem block padding under hover:none/coarse (~44px).
Wordmark + socials block untouched (the part Moses likes).
**Moses's #5.** (Screens 7–8; he likes Connect + socials + wordmark, dislikes the columns.)
On mobile the footer stacks Services (7) + Explore (6) + Case Studies (8) + Connect +
legal — a long undifferentiated grey list. Compounding problems:
- **Redundancy:** Explore duplicates the header nav wholesale; Case Studies column
  duplicates every project (nav dropdown has them too). Redundant columns are why it's long.
- **Touch targets:** 0.9rem links with 0.25rem gaps ≈ ~26px rows — under the 44px target
  (WCAG 2.5.8). Applies to legal links too.
**Direction:** cut before styling. Keep Services (it's the money nav) + Connect + legal.
Case Studies → top 3–4 + "All case studies →". Explore → fold into a single compact row or
drop (header has it). Then style what remains: 2-col link grid on mobile, ≥44px row height,
bigger type, and let the wordmark + socials block stay the hero of the footer. Optional
touch of charm: arrow-nudge or letter-fill on tap, matching the wordmark's gradient language.
**Files:** `Footer.js`, `footer.scss`. **Effort:** M. **Command:** `/impeccable distill` + `layout`.

### M6 [P2] Logo 360-spin (and the whole reactive layer) is pointer-gated — no touch equivalent — FIXED — merged to main 13079e6
Tap fires one 0.9s 360° (scsLogo-starSpinOnce keyframe, hover:none scope) via .is-spinning
set on touchstart, cleared on animationend (name-checked so the infinite hover keyframe
can't clear it). Header persists across routes, so the spin plays through navigation.
Reduced-motion: animation none, flag inert.
The spin was never deleted: `scsLogo.scss` has the 13s `scsLogo-starSpin` hover animation
gated behind `@media (hover: hover) and (pointer: fine)`. Touch never fires it. Same gate
class as: service-row overlay wipe, tile lifts, cursor, TextPressure (M2).
**Direction (Moses flagged this as "let's talk"):** a tap on the logo navigates home — a
long spin on press would fight navigation. Proposal: one-shot 360 on `touchstart` via a JS
class (`.is-spinning`, animation-iteration-count: 1, ~0.8s, removed on animationend) that
plays THROUGH the navigation (logo persists in the header across routes, so the spin
survives). The existing `:active` opacity-press rule (CLAUDE.md mobile-press pattern) covers
the rest of the site; the logo deserves the bespoke moment.
**Files:** `scsLogo.scss`, `Header.js` (or SCSLogo.js). **Effort:** S. **Command:** `/impeccable delight`.

### M7 [P2] Gradient stripe fills a full phone viewport with empty color — FIXED — merged to main aa0be7c, device-passed
Stripe min height 160→120px (desktop 30vw/420 cap unchanged); services list mobile
padding-bottom 4rem→2.5rem so the row→stripe gap stops reading as a dead half-viewport.
(Screens 4–5.) The orb/stripe divider between Services and Case Studies spans close to
100vh of pure gradient on a phone — a whole swipe of nothing between two content sections,
right where the M1 monotony already fatigues. Desktop earns it (the orb scrubs); mobile
shows a static band.
**Direction:** cap the mobile stripe height (~30–40vh), or give it one line of content
(e.g. the marquee, or a stat), or make it the section divider that absorbs the Case
Studies headline. **Files:** `StripeSection.js` / its scss. **Effort:** S.

### M8 [P2] About body text is 14.4px while its heading floats at 2rem — FIXED — merged to main 31e2da7, device-passed
Mobile .work-text p: 0.9rem→1rem, left-aligned; desktop line-height 1.5→1.6.
`work.scss` @768px sets `.work-text p` to 0.9rem (14.4px) centered — dense small
paragraphs under an oversized airy heading (M3's other half). Mobile body floor should be
1rem; left-align at this width reads better than centered 8-line paragraphs; the
highlight-block borders wrap fine (box-decoration-break already handled).
**Files:** `work.scss`. **Effort:** XS. Do together with M3.

### M9 [P2] Marquee + AboutHeading say the same sentence twice — FIXED — merged to main aa0be7c, device-passed
Marquee is now pure brand mark ("Switch Case Studio — design — code — AI — Portland,
Oregon — built from scratch"); the AboutHeading keeps the claim. aria-label corrected
("Selected Projects" → "Switch Case Studio").
"We build websites, apps, and AI systems that convert…" (heading) sits directly above
"Websites that convert — AI that does real work — automations that never sleep" (marquee).
Same promise, back to back — the M1 disease in the About section. When M3 restyles the
heading, either shorten the heading to a sharper non-overlapping claim or make the marquee
purely brand-mark ("Switch Case Studio ✳ Portland OR ✳ est. 2024"-style).
**Files:** `AboutHeading.js` or `AboutMarquee.js`. **Effort:** XS (copy).

### M10 [P3] Services rows on touch: no pressed-state feedback — FIXED — merged to main 13079e6
:active lilac flash (rgba(239,215,255,.12) bg) + 0.7 opacity on .services__link, scoped
hover:none/coarse. Opacity/background only — the overlay's translateY stays GSAP-owned.
Desktop rows have the overlay wipe + char stagger; mobile rows are inert text. The
site-wide `@media (hover:none)` opacity-press exists (CLAUDE.md rule) but these rows
deserve the overlay: fire the wipe on `:active`/touchstart as a quick press-in (no stagger,
~0.3s), giving touch a taste of the desktop charm. Same class of fix as M6.
**Files:** `services.scss` or `Services.js`. **Effort:** S.

---

## Sequencing proposal (batches ≈ sessions)

1. **Batch A — structure (M1, M7, M9):** section rhythm and redundancy; copy + layout, no
   new tech. Biggest perceived-quality jump per hour.
2. **Batch B — typography (M3, M8):** the About block as one typeset pass.
3. **Batch C — the reactive layer on touch (M2, M6, M10):** one theme — "touch gets its
   own input, not a disabled hover" — shared patterns, one review pass on a real phone.
4. **Batch D — Moon (M4):** isolated component, lighting + controls; verify on device.
5. **Batch E — footer (M5):** structure cut + restyle.

Rules for fixes (standing): every reveal keeps the never-invisible pattern; JS-owned
properties get no CSS transitions; verify on the PRODUCTION build with real pixels; mobile
verification at a true mobile width. Log each fix here (ticket → FIXED @ commit) and feed
new rules back into CLAUDE.md per Rule 2.

## Positive findings (keep, don't regress)

- Perf discipline held: IO-gated Moon/TextPressure chunks, entry-chunk pinning, LCP intact.
- Footer wordmark + socials block (screen 7) — Moses-approved, the anchor for M5's restyle.
- Hero typed-verb lockup + CursorWave still lands on mobile; case-study tiles read well.
- Data-driven nav/services (2026-08 derivation work) makes M1/M5 restructures cheap.

---

## CLOSED — 2026-08-02

All ten tickets fixed and merged to main across five batches (merge commits: A aa0be7c,
B 31e2da7 + AI caps-trim, C 13079e6, D dfa3927, E cbce441). Themes that produced rules:
touch gets its own input (scroll-drive, tap-spin, :active press) instead of disabled
hovers; the SCS Display h1-only policy gained its third exception after an A/B on the v3
metrics; the caps-trim optical size utility (0.92em) covers all-caps tokens in display
copy. Side wins: 1.5MB HDRI removed from the payload, footer touch targets to ~44px,
reduced-motion TextPressure now uniform. Remaining known work lives OUTSIDE this log:
the deferred DESKTOP design pass (not yet audited).
