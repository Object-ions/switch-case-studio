# JS Critical Path Recon — Phase A (read-only)

> ## ⚠ WAVE 1 OUTCOME (2026-06-04, draft PSI median) — THESIS DISPROVED, STOP-CONDITION TRIGGERED
> Wave 1 (TextPressure gate + Moon import defer) shipped to draft `6a221c8d…`. PSI median: **mobile LCP ~6.2s, TBT 430→50ms — but LCP render delay STILL 2,790ms** (was 2,890ms). Clearing the main thread did NOT release the hero paint → **render delay is NOT main-thread contention; this doc's §3 conclusion was wrong.**
> **Real cause (network dependency tree):** the hero span is render-blocked by the **font critical-path chain** — HTML → app.css → Inter-300…700 woff2 (~650ms each); the hero can't paint until its font resolves.
> **Branch state:** `perf/js-critical-path` stays pushed + UNMERGED. The Moon-defer + TextPressure fixes are good (TBT proof) and ride along with the real fix later.
> **Next session target — font delivery on the critical path:** confirm `font-display: swap` actually applies to the hero face; preload the specific hero weight(s); size-adjusted fallback so the fallback paint is metric-stable. Secondary suspect to rule out: `.page-fade` (0.4s opacity animation over the routed view — verify it isn't disqualifying the early hero paint from LCP).

Date: 2026-06-04 · Branch: `perf/js-critical-path` · Target: mobile LCP 16.9s (prod PSI), element = hero text `span.hero-line--accent`, render delay 2,890ms (main-thread bound, NOT network/preload).

## 1. Forced reflow hunt — what's inside `app-*.js` (prod `app-BOR3H2a2.js` ≡ local `app-D_HRat7c.js`)

### ☠ PRIMARY: `TextPressure.js` — per-frame interleaved read/write loop, ungated, ×2 instances
- `TextPressure.js:120-162` — an **infinite RAF loop starting at hydration**: every frame reads `titleRef.getBoundingClientRect()` (line 127) **plus `getBoundingClientRect()` on EVERY character span** (line 133), then **writes** `span.style.fontVariationSettings` (148-149) — interleaved reads/writes across spans = forced synchronous layout, every frame, forever.
- Two instances mount on home (`CaseStudies.js:19,32` — "Case" + "Studies" headers, 11 char spans total), **below the fold but NOT gated** — no IntersectionObserver, no reduced-motion check, loop runs from hydration even though nothing is visible or moving (the `/15` smoothing keeps values changing for dozens of frames from the initial centering alone).
- Also at mount: `:73-80` `getBoundingClientRect` (centering), `setSize` `:91-103` container+title rects → `setState` → re-render (second layout).
- **This matches PSI's "one chunk repeatedly reading geometric properties" (109/78/62ms entries) exactly.**

### Secondary mount-time measurement (one-shot costs, smaller entries)
| Where | What | Above fold? |
|---|---|---|
| `ScrollTriggerRefresher.js:9` | `ScrollTrigger.refresh()` in RAF after every route mount — full-page measurement pass over all triggers | n/a (global) |
| 10 GSAP home components (LandingPageProof, Services, CaseStudyTiles, Faq, Contact, About×4, Footer, StripeSection) | each `ScrollTrigger.create` measures its trigger at mount | mixed |
| `CursorWave.js` (Hero bg) | `resize()` reads container rect at mount + builds particle lattice; then canvas-only RAF (draw, no layout reads) | **YES — hero** |
| `Squares.js:24-25` (About bg) | `offsetWidth/Height` at mount; then canvas RAF loop, ungated, forever | no |
| `Services.js:56,100` | `getBoundingClientRect` in hover/leave handlers only | event-time, fine |
| `StripeSection`, `Reviews`, `Footer`, `CaseStudyTiles` | 1 read each, inside effects/ScrollTrigger callbacks | one-shot |

## 2. Main-thread / bundle (local build, ≡ prod)

| Chunk | Size | Contents | Loading behavior on home |
|---|---|---|---|
| **`Moon-*.js`** | **990KB** | three.module + @react-three/fiber + drei + Draco/GLTF loaders | **☠ fetched + parsed IMMEDIATELY on home load, no scroll** — verified with a no-scroll network capture. `React.lazy` only code-splits; rendering `<Moon/>` inside About fires the import at hydration. My Phase-2 mount-gate stops WebGL *init*, not the 990KB download/parse. Decorative, below fold. |
| **`app-*.js`** | **688KB** | react+react-dom+RR, **gsap+ScrollTrigger**, **framer-motion** (via `motion/react` — pulled eagerly because home's `Reviews.js` uses it; also MagneticButton/GradientText), **typed.js**, emailjs, fortawesome, all 10 home sections + TextPressure | initial, render-critical |
| `CaseStudiesPage` 46KB, `PricingPage` 19KB, etc. | — | route-lazy ✓ | on demand ✓ |
| `client-*.js` | 0.6KB | vite-react-ssg client | initial |

Three/Draco confirmed **NOT in the initial chunk** — isolation is done; the problem is purely *when* Moon loads.

## 3. Hero paint path (HTML parse → hero span final paint)
1. 75KB HTML parses; hero text is in the static HTML ✓; render-blocking = `app-*.css` only (10.2KB / ~220ms — minor, agreed lower priority).
2. `.page-fade` 0.4s CSS opacity animation on the routed view (`app.scss:196`) — CSS-only, runs without JS, small fixed delay; LCP ignores opacity<1 paints, so it adds ≤0.4s, not seconds.
3. NeueMachina (hero face) is preloaded ✓ — swap repaint no longer the LCP driver.
4. **The 2,890ms render delay = main thread saturated during the window**: parse+execute 688KB app chunk → hydrate ALL 10 home sections in one pass (all sync imports in `routes.js` HomeContent) → **simultaneously fetch+parse 990KB Moon** → ScrollTrigger creates + full `refresh()` → CursorWave lattice build → **TextPressure RAF reflow loop starts** → typed.js init. The hero span's paint commit waits behind all of it.

## 4. Moon/Three/Draco placement
Separate deferred chunk ✓ (990KB) — but loaded unconditionally at hydration (see §2). Needs a *visibility* gate, not a code-split.

---

## Ranked fix list (proposed targets — awaiting sign-off)

**Forced reflow first:**
1. **TextPressure: gate + batch** — (a) IntersectionObserver: no RAF loop until visible, stop when not; (b) respect `prefers-reduced-motion` / no-hover (mobile has no cursor — the effect is pointless there: skip the loop entirely on touch); (c) batch per frame: read title rect + all span rects FIRST, then write all `fontVariationSettings` (eliminates interleaved forced layout); (d) cache span rects — they only change on resize/font-load, not per frame; (e) settle-detection: stop the loop when values converge. Est. removes the 109/78/62ms entries outright; **0KB**.
2. **ScrollTriggerRefresher / ScrollTrigger init**: keep, but move the post-mount `refresh()` behind `requestIdleCallback` (or double-RAF after LCP) on initial load — one-shot measurement off the critical window. **0KB**.

**Then defer/lazy:**
3. **Moon: load on visibility** — IntersectionObserver around the About moon slot (`rootMargin` ~200px); import fires on approach, not at hydration. Placeholder div already exists from Phase 2. **−990KB off the critical path** (biggest single lever for parse/fetch contention).
4. **Squares + CursorWave: pause when offscreen / page hidden** — IO gate the RAF loops (Squares below fold; CursorWave when hero scrolled away) + `document.visibilitychange`. Main-thread relief, **0KB**.
5. **framer-motion off the initial chunk** — home's only eager consumer is `Reviews.js` (`motion.div` ×1) + MagneticButton/GradientText; replace the Reviews usage with CSS (or lazy-load Reviews section below fold) to drop framer-motion (~110KB) from `app-*.js`. Needs a check of MagneticButton/GradientText usage on home before claiming the full win.
6. *(Deferred, noted)* render-blocking CSS 10.2KB/220ms — not worth touching this round.

Expected shape: items 1–3 attack the 2,890ms render delay directly; 4–5 reduce sustained main-thread load. No visual/behavioral changes intended anywhere — gates and scheduling only.
