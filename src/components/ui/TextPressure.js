// Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Roboto Flex',
  // Self-hosted OFL-1.1 variable font (latin subset, full axes: wght/wdth/slnt)
  // — replaces the hotlinked, separately-licensed Compressa from Cloudinary.
  fontUrl = '/fonts/RobotoFlex.woff2',

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  className = '',

  minFontSize = 24,
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  // Last settings WE wrote, per span. Never compare against
  // span.style.fontVariationSettings: CSSOM normalizes the string (quote
  // style, number formatting), so a read-back !== comparison is always true
  // — which made `changed` permanently true and the settle-stop impossible.
  const lastWrittenRef = useRef([]);

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e) => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } =
      containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);
    debouncedSetSize();
    window.addEventListener('resize', debouncedSetSize);
    return () => window.removeEventListener('resize', debouncedSetSize);
  }, [setSize]);

  /* The pressure loop — rewritten for the JS critical path (this was the
     forced-reflow source PSI traced through app-*.js: 109/78/62ms entries
     inflating the hero's 2,890ms render delay):
     1. BATCHED frames: ALL rect reads happen first, then ALL style writes —
        the original interleaved read→write→read per span forced a synchronous
        layout for every character, every frame. One layout flush max now.
        (Cross-frame rect caching is deliberately NOT done: the 'wdth' writes
        move glyphs, so frame-stale rects would misplace the effect.)
     2. SETTLE-STOP: the loop ends when the smoothed virtual mouse converges
        onto the cursor (<0.5px) — output is static by construction from
        there; pointer movement wakes it.
     3. IntersectionObserver gate: no loop while the title is offscreen.
     4. Touch (mobile audit M2): the warp runs SCROLL-DRIVEN — the virtual
        cursor sweeps across the title as it travels through the viewport,
        so letters ripple on scroll instead of freezing in the old
        center-cursor static frame (which read as a font failure). Scroll
        events wake the loop; the settle-stop still parks it when scrolling
        stops. Same batched read/write discipline.
     5. Reduced-motion: no loop ever. One UNIFORM pass (same axis values on
        every span) — a set headline, not a frozen warp. */
  useEffect(() => {
    let rafId = 0;
    let running = false;
    let visible = false;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const touchMode =
      !reduced && window.matchMedia('(hover: none)').matches;

    /* Reduced-motion static state: one deliberate mid-axis setting for all
       spans. Mirrors the loop's write mechanism (incl. lastWrittenRef). */
    const uniformPass = () => {
      const fvs = `'wght' 500, 'wdth' 110, 'slnt' 0`;
      spansRef.current.filter(Boolean).forEach((span, i) => {
        const last = lastWrittenRef.current[i];
        if (!last || last.fvs !== fvs) {
          span.style.fontVariationSettings = fvs;
        }
        if (alpha) span.style.opacity = 1;
        lastWrittenRef.current[i] = { fvs, alpha: '1' };
      });
    };

    const frame = () => {
      rafId = 0;

      /* Touch: derive the cursor from scroll progress BEFORE the smoothing
         step (read precedes all writes — batching discipline holds). The
         cursor sweeps left→right across the title as it crosses the
         viewport; the /15 smoothing below turns that into a trailing
         ripple. */
      if (touchMode && titleRef.current) {
        const r = titleRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
        cursorRef.current.x = r.left + p * r.width;
        cursorRef.current.y = r.top + r.height / 2;
      }

      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      /* Settle = the smoothing has converged (virtual mouse reached the
         cursor) — NOT "no styles changed": distant spans clamp at their min
         while the mouse is still traveling, which reads as a false calm and
         stopped the loop mid-flight. Once mouse == cursor, output is static
         by construction. Snap to kill float residue. */
      const settled =
        Math.abs(cursorRef.current.x - mouseRef.current.x) < 0.5 &&
        Math.abs(cursorRef.current.y - mouseRef.current.y) < 0.5;
      if (settled) {
        mouseRef.current.x = cursorRef.current.x;
        mouseRef.current.y = cursorRef.current.y;
      }

      if (titleRef.current) {
        /* -- read phase: every rect, no writes in between -- */
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;
        const spans = spansRef.current.filter(Boolean);
        const rects = spans.map((span) => span.getBoundingClientRect());

        /* -- write phase -- */
        spans.forEach((span, i) => {
          const rect = rects[i];
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };

          const d = dist(mouseRef.current, charCenter);

          // Axes mapped to Roboto Flex's registered ranges (OFL variable font):
          //   wght 100–1000, wdth 25–151, slnt 0→-10 (no 'ital' axis — Roboto
          // Flex uses 'slnt'). Using the extremes so the warp reads as strongly
          // as it did on Compressa.
          const wdth = width ? Math.floor(getAttr(d, maxDist, 25, 151)) : 100;
          // Weight floor 300 (not 100): the resting/far-from-cursor state read
          // too thin. +200 gives the static wordmark presence; the warp still
          // peaks at the 1000 max near the cursor.
          const wght = weight ? Math.floor(getAttr(d, maxDist, 300, 1000)) : 400;
          // getAttr peaks near the cursor; slant leans negative toward it.
          const slnt = italic ? -getAttr(d, maxDist, 0, 10).toFixed(1) : 0;
          const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;

          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'slnt' ${slnt}`;

          const last = lastWrittenRef.current[i];
          if (!last || last.fvs !== newFontVariationSettings) {
            span.style.fontVariationSettings = newFontVariationSettings;
          }
          if (alpha && (!last || last.alpha !== alphaVal)) {
            span.style.opacity = alphaVal;
          }
          lastWrittenRef.current[i] = { fvs: newFontVariationSettings, alpha: alphaVal };
        });
      }

      if (running && visible && !settled) {
        rafId = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (reduced || running || !visible) return;
      running = true;
      if (!rafId) rafId = requestAnimationFrame(frame);
    };

    const onPointerMove = () => wake();
    window.addEventListener('mousemove', onPointerMove, { passive: true });

    // Touch: scroll is the input (M2) — every scroll tick wakes the loop;
    // frame() reads the new title position and the settle-stop parks it
    // once the smoothed cursor catches up after scrolling stops.
    const onScroll = touchMode ? () => wake() : null;
    if (onScroll) window.addEventListener('scroll', onScroll, { passive: true });

    // Resize/orientation moves the glyphs — recompute (the old always-on
    // loop self-corrected; the gated one must do it explicitly).
    const onResize = () => {
      if (!visible) return;
      if (reduced) uniformPass();
      else wake();
    };
    window.addEventListener('resize', onResize);

    let io;
    if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
      io = new IntersectionObserver((entries) => {
        visible = entries.some((e) => e.isIntersecting);
        if (visible) {
          if (reduced) {
            uniformPass();
          } else {
            wake();
          }
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
          running = false;
        }
      });
      io.observe(containerRef.current);
    } else {
      visible = true;
      if (reduced) uniformPass();
      else wake();
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onPointerMove);
      if (onScroll) window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (io) io.disconnect();
    };
  }, [width, weight, italic, alpha]);

  // dangerouslySetInnerHTML, NOT a JSX text child: the server renderer
  // HTML-escapes text children (the CSS's quotes become &#x27;) while the
  // client does not — a guaranteed hydration text mismatch that made React
  // throw away the whole server-rendered page. innerHTML bypasses escaping
  // on both sides.
  const styleElement = useMemo(() => {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
          font-display: swap;
        }

        .flex {
          display: flex;
          justify-content: space-between;
        }

        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }
      `,
        }}
      />
    );
  }, [fontFamily, fontUrl, textColor, strokeColor]);

  const dynamicClassName = [
    className,
    flex ? 'flex' : '',
    stroke ? 'stroke' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
    >
      {styleElement}
      {/* h2, not h1 — this is a decorative section heading; the page's single
          h1 belongs to the hero (home) or the page header (route pages). */}
      <h2
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100,
          width: '100%',
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            data-char={char}
            style={{
              display: 'inline-block',
              color: stroke ? undefined : textColor,
            }}
          >
            {char}
          </span>
        ))}
      </h2>
    </div>
  );
};

export default TextPressure;
