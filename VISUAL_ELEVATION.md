# VISUAL ELEVATION — proposal + implementation ledger

**Branch:** `design-audit-refresh` · **Date:** 2026-07-03 · **Status:** ✅ ALL ITEMS SHIPPED (Moses approved freehand; 13 commits `47e8923`…`643afee`; verify gate in STATUS.md).

## Implementation ledger (deviations from the proposal, honesty first)

| Item | Commit | Deviation |
|---|---|---|
| F-1 | `47e8923` | Also exported as `:root` custom props — SCSS `$tokens` can't cross `@use` module scope; mixins consume `var(--dur-fast)`. |
| VE-1 | `3dc8645` | Entrance rotate-settle DROPPED: GSAP owns the reveal wrapper, CSS owns the frame tilt — animating rotation from JS would double-own the frame transform. Sticker reads via static tilt + hover straighten. |
| VE-2 | `3e24647` | As proposed. |
| VE-3 | `3f85a7a` | Gap split half-track/half-item so name→name rhythm stays 3.5rem. |
| VE-4 | `bc538d9` | As proposed (±2.5 xPercent ≈ ±30px). |
| VE-5 | `b0d0e58` | Services row SEE PRICING skipped — its overlay wipe covers the row on hover, a nudge underneath is invisible. |
| VE-6 | `aef2d79` | Contact-card grain skipped — the video covers the frame entirely. FAQ + stripe only. |
| VE-7 | `16d97fb` | As proposed. |
| VE-8 | `f959dba` | Bonus bug fix: the motion `whileInView` header baked `opacity:0` into SSG HTML — pricing h1 was invisible without JS. Now ships visible on all 6 routes. |
| VE-9 | `1ba5181` | First cut hit the CLAUDE.md percentage-transform poison (orb dropped 210px); GSAP now claims the full transform up front. |
| VE-10 | `3517d6a` | As proposed; AboutText also migrated off `toggleActions:reverse`. |
| VE-11 | `1abd59b` | Hover lift dropped (GSAP owns item transforms from the entrance — inline style beats CSS `:hover`); scope became keyboard-focus parity, which was the real gap (zero focus styles). |
| VE-12 | `643afee` | Includes the queued P2 (hide-until-mousemove) + fixed a shipped bug: the dot was corner-anchored (CSS -50% centering lost to the pixel-matrix poison on first tween). |

---

Original proposal below, kept for the record.
Walked the production build (`npm run build && npm run preview`) with real pixels at 1440×900 and 390×844, plus a full code motion-inventory. This is a menu — approve items individually; each approved item ships as its own verified commit.

## Constraints I'm holding (stated back, non-negotiable)

1. **Conversion is sacred.** Nothing below delays, distracts from, or upstages a booking beat (hero CTAs, AboutCTA "Let's bring your idea to life", "Ready to be next?"). Every motion item is either on the path *to* those beats or decorative and out of their way.
2. **Mobile is approved.** The signed-off 390px layouts (hero, contact form-first, desktop→stack) stay pixel-intact. Items add motion only; anything that would visually alter a mobile layout is flagged desktop-only.
3. **Identity, not reinvention.** Everything reuses the existing language: SCS Display + Inter, orange `$orange-color`/lilac `$g5`–`$g7`/cream `$white-color`/ink, the star mark, the hand-drawn cards. No new aesthetic, no redrawn art.
4. **Performance moat holds.** No new dependencies, no WebGL, no fonts. The only new asset proposed is a ~1–2KB inline SVG noise data-URI (VE-13, weight flagged). Nothing enters the LCP window; nothing can move layout (CLS 0 stays).
5. **House rules.** Tokens from `_variables.scss` only; every reveal uses the safe-reveal pattern (play-once `onEnter`, in-view fallback, `delayedCall` safety net, reduced-motion = static visible, `.kill()` on unmount); one transform owner per property; `useReducedMotion` everywhere; stable keys; SSG head behavior untouched.
6. **Accessibility.** Every item names its reduced-motion path. Nothing flashes, auto-scrolls without pause, or traps focus.

## Not touched in this pass
- ClientStrip real-logo upgrade (parked post-July-7; wordmarks stay).
- Redrawing/replacing any brand art (presentation only).
- Copy.

## Where the brand art actually lives (finding)

The hand-drawn cards — **EYES ON** (megaphone), **INBOX WINS** (paper plane), **BUILT TO SHIP** (browser + `</>`), etc. — are frames of the looping video `src/assets/videos/switch-case-studio-banner.webm`, rendered once on the whole site: a plain rounded rectangle in the Contact section's right rail (`Contact.js:377`, `.contact-left__media`). The most distinctive art the studio owns is presented with the least ceremony of anything on the page. That mismatch is the #1 opportunity below.

## What already sings — protected, no changes proposed

Hero (CursorWave shape-field + typed verb + staggered CSS entrance — and the H1 has *deliberately* no entrance; it's the LCP element, leave it), Services hover (edge-aware overlay wipe + per-char lift), case-tile hover system (lift/particles/spotlight), Reviews carousel (spring cursor pill, progress bars, full reduced-motion coverage), StaggeredMenu, `/services` ServiceRow (blur-in words, glow), SCS logo hover spin, FAQ orange moment, footer stencil wordmark concept.

---

## THE MENU — in priority order

Impact = how much more crafted/distinctive the site feels. Effort = S (<1h), M (1–3h), L (3h+).

| # | Item | Category | Impact | Effort | Risk |
|---|------|----------|--------|--------|------|
| F-1 | Motion tokens (foundation) | — | med | S | none |
| VE-1 | Brand-art card → sticker treatment | brand art | **high** | S | none |
| VE-2 | Magnetic booking CTAs (reuse MagneticButton) | micro | **high** | S | low |
| VE-3 | ClientStrip: star separators + pause-on-hover | micro/brand | med | S | none |
| VE-4 | Footer wordmark scroll drift | motion | med | S | none |
| VE-5 | Unified link hover grammar (arrow nudge + sweep) | micro | med | S–M | none |
| VE-6 | Grain on the color moments | texture | med | S | low (flagged) |
| VE-7 | "Ready to be next?" entrance ceremony | motion | med | S | watch |
| VE-8 | Pricing pages: house entrance reveals | motion | med | M | watch |
| VE-9 | GradientStripe scroll parallax | motion | med | S | none |
| VE-10 | Reduced-motion gap closure (4 components) | hygiene | low* | S–M | none |
| VE-11 | FAQ item hover/focus polish | micro | low | S | none |
| VE-12 | Cursor press state | micro | low | S | none |

*low visual impact, but it's an a11y/house-rule debt the new work shouldn't sit on.

---

### F-1 — Motion tokens (do first if any batch is approved)
**Files:** `src/styles/_variables.scss`, new `src/animation/motionTokens.js`
**Move:** The inventory found zero easing/duration tokens — every one of the site's ~30 durations and ~10 eases is hardcoded inline (JS and SCSS). Add a minimal set: `$dur-fast: 0.2s / $dur-med: 0.4s / $dur-slow: 0.7s`, `$ease-brand` (the existing `cubic-bezier(0.34,1.56,0.64,1)` overshoot from the logo), `$ease-out` — mirrored as JS constants for GSAP. All NEW work below consumes them; existing code migrates opportunistically, never as a churn pass.
**Why:** it's the house rule ("tokens only") applied to motion; guarantees the items below feel like one system, not twelve.
**Risk:** none (additive).

### VE-1 — The hand-drawn card gets a sticker's presentation ⭐ the headline item
**Files:** `src/components/sections/Contact.js` (media block ~:342–390), `src/styles/components/contact.scss`
**Move (CSS-only, art untouched):**
- Frame it like the physical object it draws: thick cream (`$white-color`) border, slight rotation (−2°), offset hard shadow in ink — poster-on-a-wall, not screenshot-in-a-box.
- Hover: straightens to 0° and lifts ~4px (`$ease-brand`).
- Entrance: the existing `.contact-animate` reveal gains a small rotate-settle (e.g. −4°→−2°) — same play-once safe-reveal that's already there, just a richer `to`.
- **Transform ownership:** GSAP already owns `y`/`autoAlpha` on `.contact-animate`; the rotation lives on a new inner wrapper so no property has two owners (StaggeredMenu lesson).
**Why:** this is the only place the studio's most distinctive art appears, and it currently reads as an afterthought. Presentation ceremony here directly feeds the "crafted" impression at the exact moment a visitor is deciding whether to submit the form — proximity to conversion is a feature: it's proof of taste beside the ask, not an obstacle in front of it.
**Impact high / effort S.** **Risk:** none — right rail only, form untouched, zero new bytes. **Mobile:** the card sits below the form (approved layout); the rotation changes its rendering slightly, so this ships **desktop-only** unless Moses approves the tilt at 390 too. **Reduced motion:** static framed card, no tilt-settle, video already pauses (`Contact.js:152–157`).
**Related, already queued as P2:** `poster` attribute on this video — would pair naturally with this commit.

### VE-2 — Magnetic booking CTAs
**Files:** `src/components/sections/Hero.js`, `AboutCTA.js`, `Reviews.js` (the "Ready to be next?" button) + `src/components/ui/MagneticButton.js` (exists, unused outside CaseStudyPage)
**Move:** wrap the three primary "Book a Free Strategy Call" pills in the existing `MagneticButton` (subtle `distance` ~0.35 — less than the case-study usage). Header CTA deliberately excluded (magnetism in fixed chrome feels gimmicky).
**Why:** the highest-leverage micro-interaction in the codebase is already built, reduced-motion-safe, and sitting idle. Magnetism on the booking buttons makes the *conversion elements* the most alive objects on the page — flair that literally pulls the cursor toward booking.
**Impact high / effort S.** **Risk:** low — magnetism eases pointing at the target; verify the wrapper adds no layout shift and the `book_call_click` GA event still fires (wrapper must not swallow the anchor). **Mobile:** inert (no fine pointer) — zero change. **Reduced motion:** MagneticButton already renders static.

### VE-3 — ClientStrip: brand-star separators + pause on hover
**Files:** `src/components/sections/ClientStrip.js`, `src/styles/components/clientStrip.scss`
**Move:** (a) an orange star/asterisk glyph (the logo's inner-star motif, `aria-hidden`, fixed-size span) between wordmarks — the plain text run becomes a rhythm of name ✳ name ✳ name; (b) `animation-play-state: paused` on `:hover`/`:focus-within` — readable on demand, and a WCAG 2.2.2-friendly pause affordance.
**Why:** the strip earns its place ("Trusted by") but is the flattest brand surface on the home page; the star is the cheapest possible injection of identity into it.
**Impact med / effort S.** **Risk:** none — fixed-size glyphs, no layout shift; screen readers still hear only the 7 names once. **Reduced motion:** already paused (kept).

### VE-4 — Footer wordmark drifts with scroll
**Files:** `src/components/layout/Footer.js`, `src/styles/components/footer.scss` (`.footer-wordmark`, :253–282)
**Move:** scrub-tied horizontal drift (xPercent ~0→−6) on the giant outline "switch case" stencil as the footer scrolls into view. Position-only scrub — content starts fully visible, so the "no scrub-tied opacity" rule isn't in play. ScrollTrigger killed on unmount.
**Why:** the last thing every visitor sees currently just sits there; a slow parallax slide gives the page a cinematic sign-off for one transform's worth of work.
**Impact med / effort S.** **Risk:** none (decorative, below every CTA). **Mobile:** works as-is, layout untouched. **Reduced motion:** static (skip the trigger).

### VE-5 — One hover grammar for every text link
**Files:** `src/styles/components/services.scss` (SEE PRICING), `_projects-tiles.scss` (VIEW CASE STUDY), projects layout scss (`.projects-viewall__link`), footer/contact link rules
**Move:** the hero already owns the site's link gesture — arrow nudges +4px on hover. Apply it everywhere an arrow-link exists, plus a 1px underline sweep (left→right, `$dur-fast`) on text links, and matching `:focus-visible` treatment. Pure CSS, tokenized via F-1.
**Why:** the site's links currently respond four different ways (or not at all — several have no hover rule). Coherence here is what separates "designed" from "assembled"; it's also a keyboard-focus upgrade.
**Impact med / effort S–M** (touch count, not difficulty). **Risk:** none. **Reduced motion:** transitions collapse to instant color/underline state change.

### VE-6 — Grain on the color moments
**Files:** `src/styles/_variables.scss` (define once), `faq.scss`, `stripeSection.scss`, `contact.scss` (the VE-1 card)
**Move:** a static SVG `feTurbulence` noise data-URI (~1–2KB, defined once as an SCSS variable) overlaid at 4–6% opacity on exactly three surfaces: the FAQ orange block, the gradient stripe, and the orange brand-art card. Not site-wide, not animated, no JS.
**Why:** the brand's hand-drawn language implies print texture; dead-flat orange fills read digital. Grain also masks gradient banding on the stripe (visible on the walk). Scoping it to the color moments strengthens them as *moments* instead of wallpapering the site.
**Impact med / effort S.** **Risk (flagged per constraints):** +~2KB CSS weight; one extra composite layer per surface — verify scroll performance on the stripe at 390 and confirm CLS/LCP untouched (all three surfaces are below the fold). **Reduced motion:** n/a (static texture).

### VE-7 — "Ready to be next?" gets an entrance
**Files:** `src/components/sections/Reviews.js` (:238 area), `testimonials.scss`
**Move:** the conversion beat currently just exists when you arrive. Give the text + pill the house safe-reveal (fade-up, ≤0.5s, play-once, safety net) with a slight scale-settle on the pill, so arrival at the beat feels like a beat.
**Why:** it's the payoff line of the testimonial section; ceremony here *serves* booking.
**Impact med / effort S.** **Risk — watch:** this is a primary CTA, so the reveal must be short and strand-proof: safe-reveal with `delayedCall` net + in-view fallback, content SSG-visible pre-JS by default. Anything flakier than the AboutCTA pattern (already proven, same shape) doesn't ship. **Reduced motion:** static visible.

### VE-8 — Pricing pages join the motion system
**Files:** `src/components/pages/PricingPage.js`, `src/components/ui/SinglePricingCard.js`
**Move:** the inventory's starkest finding: pricing pages have *zero* motion — no entrance, no GSAP, no `motion` import — while every other money page breathes. Add the house safe-reveal to header + cards (stagger 0.08) and a hover lift on cards consistent with case tiles.
**Why:** pricing is where the "crafted studio" argument has to survive closest scrutiny; today it's the least crafted-feeling surface on the site.
**Impact med / effort M.** **Risk — watch:** conversion path. Same discipline as VE-7: play-once, fallbacks, safety net, SSG-visible without JS, reduced-motion static. Verify all 6 pricing routes + `/pricing` index after. **Mobile:** motion only, layout untouched.

### VE-9 — GradientStripe parallax
**Files:** `src/components/sections/StripeSection.js`, `stripeSection.scss`
**Move:** keep the orb's yoyo drift (it's charming) and add a scrub-tied vertical parallax (orb translateY ~±30px across the band's scroll traversal) so the divider reacts to the visitor instead of ignoring them. Position-only scrub; transform owner stays GSAP (orb already GSAP-owned — compose x-drift + y-scrub on the same tween target carefully, or parallax the band background instead if they fight).
**Impact med / effort S.** **Risk:** none (decorative divider). **Reduced motion:** existing static center (kept).

### VE-10 — Close the reduced-motion gaps
**Files:** `AboutHeading.js` (scrub word-color), `AboutText.js` (also migrate its `toggleActions:'play none none reverse'` to the play-once house pattern — it's the last reverse-on-scroll-out reveal), `GradientText.js` (RAF gradient loop), `Squares.js` (continuous canvas in About)
**Move:** each gets `useReducedMotion`: static end-state colors, visible text, static gradient, static grid frame.
**Why:** four components still animate for users who asked them not to; house rule says zero.
**Impact low visually / effort S–M.** **Risk:** none. (Squares/GradientText replacement-with-solid is separately queued as P2 — this item is only the guard, no removal.)

### VE-11 — FAQ item hover/focus polish
**Files:** `src/styles/components/faq.scss`
**Move:** hover: ink border + −2px lift on question cards (`$dur-fast`); matching ink `:focus-visible` ring. Accordion motion itself already good (grid-rows + icon rotate).
**Impact low / effort S.** **Risk:** none. **Reduced motion:** no lift, state colors only.

### VE-12 — Cursor press feedback
**Files:** `src/components/ui/CursorComponent.js`, `cursorComponent.scss`
**Move:** scale the custom cursor dot to ~0.7 on `mousedown`, back on release — clicks get a physical tick. Fine-pointer only (component already gates).
**Impact low / effort S.** **Risk:** none. **Related queued P2:** hide-until-first-mousemove (the "white square at 0,0") — natural same-commit pairing if approved.

---

## Considered and rejected (so they don't come back)

- **Section-divider ornaments / marquee dividers between black sections** — the hard cuts are the grid; the color moments (stripe, FAQ) already do the dividing. More seams = less poster.
- **Hero headline entrance** — the H1 is the LCP element; any entrance re-opens the 16.9s→2.9s war. Never.
- **Scroll-pinned choreography** — ValueProp was removed for exactly this; time-poor visitors win.
- **Echoing the hand-drawn cards elsewhere (e.g. as tile art)** — needs stills extracted from the video = new asset decisions; parked with the ClientStrip logo task unless Moses wants it scoped.
- **Animated grain / animated gradients site-wide** — RAF cost + the GradientText detector lesson; static only, scoped only.
- **Any WebGL/Three.js addition** — moat.

## Verification plan (applies to every approved item)

Per commit: build green (26 routes) → real-pixel screenshots 1440×900 + 390×844 of the touched moment (before/after) → reduced-motion pass (`prefers-reduced-motion: reduce` — content visible and static) → hard-reload ×3 with throttled network on any reveal (strand check) → for VE-2/VE-7/VE-8: confirm `book_call_click`/CTA reachability and that no reveal can leave a CTA invisible → CLS spot-check on any item touching layout-adjacent transforms. Mobile layout diff must be pixel-null except where an item explicitly says otherwise (VE-1 is desktop-only by default).

**Suggested first slice if approving in batches:** F-1 + VE-1 + VE-2 + VE-3 (one afternoon, the whole top of the impact table, all S-effort).
