# STATUS — design refresh

**Branch:** `design-audit-refresh` (41 commits ahead of main; NOTHING pushed — never push without explicit instruction)
**Phase:** 3 — **visual-elevation pass COMPLETE** (13 commits, `47e8923`…`643afee`, freehand-approved by Moses after the `VISUAL_ELEVATION.md` proposal). P1 batch also still awaiting its verify pass — both gates below. ClientStrip option A (real logos) remains open pending assets from Moses.

## Elevation gate — Moses verifies (visible window; agent can't watch transitions under occlusion)

```bash
npm run build && npm run preview   # http://localhost:4173
```

1. **/#contact** (desktop ≥1024): the hand-drawn video card sits tilted −2° in a cream frame with a lilac offset shadow; hover straightens + lifts it. At 390 the card is exactly as before (no frame, no tilt).
2. **Hero / About CTA / "Ready to be next?"** booking pills pull gently toward the cursor on hover and the calendar still opens on click.
3. **"Trusted by"**: orange ✳ between names; strip pauses while you hover it.
4. **Footer**: the outline "switch case" slides slowly sideways as you scroll it into view; footer links get an underline sweep on hover.
5. **Gradient stripe + FAQ orange**: faint print grain (very subtle — compare banding on the stripe); orb floats slightly up/down with scroll and stays vertically centered.
6. **/pricing/web-development** (and any other pricing page): header, cards, outro stagger in; cards lift on hover; **with JS disabled the h1 is still visible** (it wasn't before this pass).
7. **Arrow links** (View all case studies, tile "View Case Study", header CTA): arrow nudges right on hover.
8. **Cursor**: no white square at top-left on load; dot appears on first mouse move, tightens while clicking.
9. **Reduced motion** (System Settings → Accessibility → Display → Reduce motion): everything readable and static — About heading rests orange, About paragraphs visible, gradient heading static, About grid static, no marquee/typed/motion anywhere.
10. **Scroll the whole home page slowly, stop mid-section** — nothing ever strands dim (same discipline as the P1 gate).

## P1-batch gate — still open (from the previous session)
1. **/** "Trusted by": wordmarks readable, screen reader hears the 7 names once.
2. Services rows / "Built to perform" block / FAQ: settle at full opacity mid-scroll, nothing re-hides.
3. FAQ ink-on-orange readable at every size.
4. FAQ + footer same width as other sections.
5. The three re-compressed case-study screenshots look sharp.

## Verification evidence (agent-side, this pass)
- Every item: build green (27 routes) → live-DOM probe of the END state (transforms, opacity, computed backgrounds) + settled screenshots at 1440 + 390. Two real bugs found & fixed mid-pass: stripe orb lost its -50% centering to the percentage-transform poison (VE-9 hardened), pricing h1 shipped `opacity:0` in static HTML (VE-8 fixed).
- Known limitation: with the automation window occluded, CSS transitions AND the GSAP ticker freeze — in-flight animation can't be observed, only end states. Documented in CLAUDE.md.

## After this: remaining P2s
Marquee clipping, raw "Loading..." Moon fallback, video poster (needs an encoded poster frame — no ffmpeg on this machine), pricing "from $X" index anchors, eyebrow grammar diet, mobile type/tap floors, z-index/breakpoint debt (opportunistic). GradientText swap (P2-14) softened: it now has a reduced-motion guard; full swap still optional.

## Standing constraints
- Tokens from `_variables.scss` only (motion tokens now exist: `$dur-*`/`$ease-*` + `src/animation/motionTokens.js` + `:root` custom props); single transform owner per property; `useReducedMotion` on new motion; ScrollTrigger cleanup on unmount; protect proof density, perf moat (LCP/CLS budget), FAQ-orange + footer-star moments, "Ready to be next?" beat.
- Canonical worklog `.audit/summary.md`; user-facing log `CHANGELOG.md`.
