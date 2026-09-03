import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import '../../styles/components/cursorWave.scss';

/* ------------------------------------------------------------------ */
/*  Defaults                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_COLORS = [
  '#dab8ff',
  '#ff834a',
  '#d99cff',
  '#ff8f63',
  '#f0d7ff',
  '#FEF7ED',
];
const DEFAULT_SHAPES = ['square', 'star', 'asterisk', 'circle'];

const TAU = Math.PI * 2;

/* Touch / no-hover detection — client-only, queried where needed (inside
   effects / post-mount state), never at module scope: the SSG render has no
   real matchMedia, and module-time answers can't react to environment. The
   canvas stays mounted either way so taps can still trigger bursts and an
   auto-burst gives mobile users immediate motion. */
const isTouchDevice = () =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: none)').matches;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function uniform(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function smoothstep01(t) {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
}

function settleFactor(seconds) {
  if (seconds <= 0) return 1;
  return 1 - Math.pow(0.05, 1 / (60 * seconds));
}

/* ------------------------------------------------------------------ */
/*  Shape paths                                                       */
/*                                                                    */
/*  Drawn natively as canvas paths — no SVG loading, no DOM nodes.    */
/*  Each shape is centered on (0,0) so the existing translate/rotate/ */
/*  scale transform stack works without changes.                      */
/* ------------------------------------------------------------------ */

/* SCS brand star — taken from Asset_12.svg (viewBox 1116.06 × 1059.42).
   The raw path's bounding box is roughly 1148 × 1085, centered around
   (571.19, 541.77). We render via Path2D once and reuse it: every cell
   gets the same Path2D, transformed in place by the existing translate/
   rotate/scale stack. */
const SCS_STAR_PATH_DATA =
  'M691,319.23c-28.1-2.98-56.47-4.28-84.66-6.68,42.11-31.36,88.38-60.24,118.57-99.05-1.04-5.03-28-35.66-33.26-37.98-13.09-5.76-54.79,9.76-71.77,13.19-5.23,1.06-10.48,2.05-15.75,2.99,15.2-31.23,31.81-62.69,42.83-90.22,8.17-76.4-64.04-13.75-93.48,4.06-15.03,9.76-30.08,20.72-45.1,31.95,3.49-45.51,7.5-91.74-4.39-133.27-7.12-7.7-27.47-1.01-35.85.76-10.51,4.4-39.4,53.7-48.86,66.73-5.93,6.92-12.15,14.98-18.49,23.47C392.42,61.31,382.88,28.24,366.66.05c-5.05-.94-43.6,12.44-47.73,16.44-10.28,9.94-11.67,54.41-14.91,71.43-.44,2.32-.9,4.64-1.36,6.96-.44-.53-.88-1.06-1.31-1.6-12.07-14.98-47.75-71.12-64.03-74.63-5.79-1.25-29.12,9.9-33.19,13.72-2.19,2.05-3.9,11.19-3.59,14.23,4.22,45.9,23.84,90.51,35.29,135.75-47.8-23.07-95.96-51.35-146.41-56.86-9.82,3.68-11.31,25.05-12.85,33.47.08,9.35,23.44,41.53,36.53,60.36-26.49-.73-52.79-.01-78.48,4.33-28.13,5.16-10.42,19.61-15.12,37.37,24.84,32.82,69.56,52.38,110.3,74.37-11.47,4.03-22.98,7.92-34.54,11.38-18.43,5.52-83.89,17.33-93.3,31.07-3.35,4.89-1.84,30.7.16,35.91,1.07,2.8,8.88,7.84,11.82,8.7,37.92,11.56,79.27,12.2,119.5,16.29-31.69,25.1-74.08,49.37-85.98,87.06-1.94,35.9,61.07,17.32,113.1.72-18.4,37.92-36.39,76.19-45.4,116.45-5.85,27.99,14.22,17.06,28.89,28.12,40.69-10.84,76.38-46.17,113-76.02-4.7,40-9.12,80.59-9.39,118.24-5.36,27.46,24.22,18.96,38.12,9.86,27.45-43.04,47.41-76.35,62.49-101.26,13.64,40.21,18.19,95.68,51.5,123.36,37.03,17.5,40.45-69.75,45.14-126.29,21.1,27.7,52.44,63.43,102.7,102.82,48.88,10.17,7.47-64.63,4.39-87.39-6.14-21.21-13.29-42.18-20.16-63.22,38.85,21.5,78.72,43.59,117.2,59.62,23.4,15.34,26.71-15.26,23.54-31.57-29.05-41.09-52.1-71.85-69.38-95.11,44.54,1.22,94.26,7.5,133.75,7.22,73.82-21.31-11.47-64.49-39.09-85.01-10.86-7.54-22.32-14.85-34.04-22.04,29.38-9.67,64.96-24.31,106.45-47.99,27.88-41.41-57.02-31.34-79.25-37.09Z';

/* Bounding box center of the raw path data above. We translate by these
   values so the shape draws centered on (0,0). */
const SCS_STAR_CENTER_X = 571.19;
const SCS_STAR_CENTER_Y = 541.77;

/* Half-extent of the path's bounding box (~1148/2). Dividing the target
   render size by this gives us the per-cell scale factor. Tuned with a
   small boost (0.85) so the SCS star reads at a similar visual weight to
   the spiky `outer = size * 0.95` star it replaces. */
const SCS_STAR_BBOX_HALF = 574;
const SCS_STAR_VISUAL_SCALE = 0.85;

/* Lazily-built Path2D cached at module scope. Path2D isn't available in
   SSR, so we defer construction until first use in the browser. */
let scsStarPath2D = null;
function getScsStarPath() {
  if (scsStarPath2D !== null) return scsStarPath2D;
  if (typeof Path2D === 'undefined') return null;
  scsStarPath2D = new Path2D(SCS_STAR_PATH_DATA);
  return scsStarPath2D;
}

function tracePath(ctx, shape, size) {
  switch (shape) {
    case 'square': {
      const half = size * 0.6;
      const r = size * 0.12;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-half, -half, half * 2, half * 2, r);
      } else {
        ctx.rect(-half, -half, half * 2, half * 2);
      }
      return null;
    }

    /* SCS brand star — the iconic Switch Case Studio mark. Built from
       the raw SVG path data once and cached as a Path2D, then drawn
       under the existing translate/rotate/scale transform stack. We
       use a nested save/translate/scale so the path data's own
       coordinate space is recentered without disturbing the caller's
       rotation. Returns the Path2D so the caller fills it directly. */
    case 'star': {
      const path = getScsStarPath();
      if (!path) return null;
      const k = (size / SCS_STAR_BBOX_HALF) * SCS_STAR_VISUAL_SCALE;
      ctx.save();
      ctx.scale(k, k);
      ctx.translate(-SCS_STAR_CENTER_X, -SCS_STAR_CENTER_Y);
      return path;
    }

    /* 6-pointed asterisk — three rounded bars rotated 0°/60°/120°.
       Built as a single path so it fills cleanly as one shape. */
    case 'asterisk': {
      const len = size * 1.15;
      const thick = size * 0.32;
      const half = len / 2;
      const hThick = thick / 2;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI) / 3;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        /* Local rect corners (before rotation): (-half,-hThick)→(half,hThick) */
        const corners = [
          [-half, -hThick],
          [half, -hThick],
          [half, hThick],
          [-half, hThick],
        ];
        const rotated = corners.map(([x, y]) => [
          x * cos - y * sin,
          x * sin + y * cos,
        ]);
        /* roundRect can't be rotated arbitrarily, so we approximate with
           a sharp-cornered polygon — the asterisk still reads correctly. */
        ctx.moveTo(rotated[0][0], rotated[0][1]);
        ctx.lineTo(rotated[1][0], rotated[1][1]);
        ctx.lineTo(rotated[2][0], rotated[2][1]);
        ctx.lineTo(rotated[3][0], rotated[3][1]);
        ctx.closePath();
      }
      return null;
    }

    case 'circle': {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.6, 0, TAU);
      return null;
    }

    /* Legacy shape — kept so existing callers can still opt in. */
    case 'triangle': {
      const r = size * 0.78;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = -Math.PI / 2 + (i * TAU) / 3;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      return null;
    }

    default: {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.6, 0, TAU);
      return null;
    }
  }
}

function makeFill(ctx, color, size) {
  if (typeof color === 'string') return color;
  const grad = ctx.createRadialGradient(
    0,
    -size * 0.3,
    0,
    0,
    size * 0.3,
    size * 1.5,
  );
  grad.addColorStop(0, color.stops[0]);
  grad.addColorStop(1, color.stops[1]);
  return grad;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

const CursorWave = React.forwardRef(
  (
    {
      width = '100%',
      height = '100%',
      className = '',
      children,
      cellSize = 40,
      influenceRadiusVmin = 30,
      attackTime = 0.5,
      releaseTime = 0.6,
      idleScale = 0.09,
      minPeakScale = 0.5,
      maxPeakScale = 0.5,
      burstSpeed = 1200,
      burstThickness = 180,
      backgroundColor = '#0a0a0a',
      shapes = DEFAULT_SHAPES,
      colors = DEFAULT_COLORS,
      dpr = 2,
      opacity = 1,
      autoBurstOnMount = false,
    },
    handle,
  ) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    const runtimeRef = useRef(null);
    if (runtimeRef.current === null) {
      runtimeRef.current = {
        cells: [],
        ripples: [],
        pointer: null,
        pointerEnergy: 0,
        maskRects: [],
        maskFrame: 0,
        suspendMasks: false,
        suspendMaskUntil: 0,
        width: 0,
        height: 0,
        dpr: 1,
        raf: 0,
      };
    }

    /* Mirror props into a ref so the RAF loop sees current values
       without re-binding handlers every render. */
    const propsRef = useRef({
      cellSize,
      influenceRadiusVmin,
      attackTime,
      releaseTime,
      idleScale,
      minPeakScale,
      maxPeakScale,
      burstSpeed,
      burstThickness,
      backgroundColor,
      shapes,
      colors,
      opacity,
    });
    useEffect(() => {
      propsRef.current = {
        cellSize,
        influenceRadiusVmin,
        attackTime,
        releaseTime,
        idleScale,
        minPeakScale,
        maxPeakScale,
        burstSpeed,
        burstThickness,
        backgroundColor,
        shapes,
        colors,
        opacity,
      };
    }, [
      cellSize,
      influenceRadiusVmin,
      attackTime,
      releaseTime,
      idleScale,
      minPeakScale,
      maxPeakScale,
      burstSpeed,
      burstThickness,
      backgroundColor,
      shapes,
      colors,
      opacity,
    ]);

    const buildLattice = useCallback(() => {
      const rt = runtimeRef.current;
      if (!rt) return;
      const W = rt.width;
      const H = rt.height;
      const p = propsRef.current;
      const gap = Math.max(p.cellSize, 4);
      const cols = Math.max(1, Math.floor(W / gap));
      const rows = Math.max(1, Math.floor(H / gap));
      const offsetX = (W - (cols - 1) * gap) / 2;
      const offsetY = (H - (rows - 1) * gap) / 2;

      const cells = [];
      const shapePool = p.shapes.length > 0 ? p.shapes : DEFAULT_SHAPES;
      const colorPool = p.colors.length > 0 ? p.colors : DEFAULT_COLORS;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          cells.push({
            x: offsetX + col * gap,
            y: offsetY + row * gap,
            shape: pick(shapePool),
            color: pick(colorPool),
            angle: uniform(0, TAU),
            size: gap * 0.38,
            scale: p.idleScale,
            peak: uniform(p.minPeakScale, p.maxPeakScale),
            hovered: false,
          });
        }
      }
      rt.cells = cells;
    }, []);

    const resize = useCallback(() => {
      const rt = runtimeRef.current;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!rt || !canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const ratio = Math.min(window.devicePixelRatio || 1, Math.max(dpr, 1));

      canvas.width = w * ratio;
      canvas.height = h * ratio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);
      }

      rt.width = w;
      rt.height = h;
      rt.dpr = ratio;
      buildLattice();
    }, [buildLattice, dpr]);

    const triggerBurst = useCallback((cx, cy) => {
      const rt = runtimeRef.current;
      const container = containerRef.current;
      if (!rt || !container) return;

      let lx;
      let ly;
      if (cx === undefined || cy === undefined) {
        lx = rt.width / 2;
        ly = rt.height / 2;
      } else {
        const rect = container.getBoundingClientRect();
        lx = cx - rect.left;
        ly = cy - rect.top;
      }

      rt.ripples.push({ x: lx, y: ly, start: performance.now() });

      const diag = Math.sqrt(rt.width * rt.width + rt.height * rt.height);
      const lifeMs = (diag / Math.max(propsRef.current.burstSpeed, 1)) * 1000;
      rt.suspendMasks = true;
      rt.suspendMaskUntil = performance.now() + lifeMs;
    }, []);

    useImperativeHandle(handle, () => ({ burst: triggerBurst }), [
      triggerBurst,
    ]);

    /* Main effect — RAF loop, resize observer, mount-time auto-burst */
    useEffect(() => {
      const rt = runtimeRef.current;
      if (!rt) return;

      resize();

      /* Touch devices and explicit opt-in get an auto-burst from
         center on mount, so users see motion immediately. */
      if (autoBurstOnMount || isTouchDevice()) {
        /* Defer one frame so the lattice has size when the ripple
           seeds. */
        requestAnimationFrame(() => triggerBurst());
      }

      const tick = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const p = propsRef.current;
        const W = rt.width;
        const H = rt.height;
        const radius = Math.min(W, H) * (p.influenceRadiusVmin / 100);
        const now = performance.now();

        ctx.globalAlpha = 1;
        ctx.fillStyle = p.backgroundColor;
        ctx.fillRect(0, 0, W, H);

        rt.pointerEnergy *= 0.93;

        /* Re-measure mask rects every 10 frames — cheap enough to keep
           pace with layout shifts without thrashing on every frame. */
        rt.maskFrame += 1;
        if (rt.maskFrame % 10 === 0 && containerRef.current) {
          const els = containerRef.current.querySelectorAll(
            '[data-cursor-wave-mask]',
          );
          const containerRect = containerRef.current.getBoundingClientRect();
          const rects = [];
          els.forEach((el) => {
            const r = el.getBoundingClientRect();
            rects.push({
              left: r.left - containerRect.left,
              top: r.top - containerRect.top,
              right: r.right - containerRect.left,
              bottom: r.bottom - containerRect.top,
            });
          });
          rt.maskRects = rects;
        }

        if (rt.suspendMasks && now >= rt.suspendMaskUntil) {
          rt.suspendMasks = false;
        }

        const maxDist = Math.sqrt(W * W + H * H);
        rt.ripples = rt.ripples.filter(
          (w) =>
            ((now - w.start) / 1000) * p.burstSpeed <
            maxDist + p.burstThickness,
        );

        const padding = p.cellSize * 0.5;
        const attackF = settleFactor(p.attackTime);
        const releaseF = settleFactor(p.releaseTime);

        ctx.globalAlpha = p.opacity;

        for (let i = 0; i < rt.cells.length; i++) {
          const cell = rt.cells[i];

          let masked = false;
          if (!rt.suspendMasks) {
            for (let m = 0; m < rt.maskRects.length; m++) {
              const r = rt.maskRects[m];
              if (
                cell.x >= r.left - padding &&
                cell.x <= r.right + padding &&
                cell.y >= r.top - padding &&
                cell.y <= r.bottom + padding
              ) {
                masked = true;
                break;
              }
            }
          }

          if (masked) {
            cell.scale += (0 - cell.scale) * releaseF;
            if (cell.scale < 0.005) cell.scale = 0;
            continue;
          }

          let pointerInfluence = 0;
          if (rt.pointer && rt.pointerEnergy > 0.001 && radius > 0) {
            const dx = cell.x - rt.pointer.x;
            const dy = cell.y - rt.pointer.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            pointerInfluence = smoothstep01(1 - d / radius) * rt.pointerEnergy;

            if (pointerInfluence > 0.05 && !cell.hovered) {
              cell.hovered = true;
              cell.peak = uniform(p.minPeakScale, p.maxPeakScale);
              cell.angle = uniform(0, TAU);
            } else if (pointerInfluence <= 0.05) {
              cell.hovered = false;
            }
          } else {
            cell.hovered = false;
          }

          let waveInfluence = 0;
          for (let j = 0; j < rt.ripples.length; j++) {
            const ripple = rt.ripples[j];
            const ringR = ((now - ripple.start) / 1000) * p.burstSpeed;
            const wdx = cell.x - ripple.x;
            const wdy = cell.y - ripple.y;
            const wd = Math.sqrt(wdx * wdx + wdy * wdy);
            const t = 1 - Math.abs(wd - ringR) / p.burstThickness;
            if (t > 0) {
              const v = Math.sin(Math.PI * t);
              if (v > waveInfluence) waveInfluence = v;
            }
          }

          const span = cell.peak - p.idleScale;
          const pointerTarget = p.idleScale + pointerInfluence * span;
          const waveTarget = p.idleScale + waveInfluence * span;
          const target =
            pointerTarget > waveTarget ? pointerTarget : waveTarget;

          const f = target > cell.scale ? attackF : releaseF;
          cell.scale += (target - cell.scale) * f;

          if (cell.scale < p.idleScale * 0.15) continue;

          ctx.save();
          ctx.translate(cell.x, cell.y);
          ctx.rotate(cell.angle);
          ctx.scale(cell.scale, cell.scale);
          ctx.fillStyle = makeFill(ctx, cell.color, cell.size);
          /* tracePath returns a Path2D when the shape needs one (SCS star),
             or null when it has populated the current ctx path (everything
             else). Path2D-returning shapes apply their own nested transform
             via save(), so we restore() once after fill() in that case. */
          const path2d = tracePath(ctx, cell.shape, cell.size);
          if (path2d) {
            ctx.fill(path2d);
            ctx.restore();
          } else {
            ctx.fill();
          }
          ctx.restore();
        }

        ctx.globalAlpha = 1;

        if (rt.visible) rt.raf = requestAnimationFrame(tick);
      };

      // IO-gate (REFRESH-1): the loop only runs while the lattice is on or
      // near the screen. Above the fold today, so this costs nothing — it
      // stops a second, below-fold usage from becoming the always-on RAF
      // loop this codebase already had to fix for Moon and TextPressure.
      rt.visible = true;
      let io = null;
      if (typeof IntersectionObserver !== 'undefined' && containerRef.current) {
        io = new IntersectionObserver(
          ([entry]) => {
            const was = rt.visible;
            rt.visible = entry.isIntersecting;
            if (rt.visible && !was) rt.raf = requestAnimationFrame(tick);
            if (!rt.visible) cancelAnimationFrame(rt.raf);
          },
          { rootMargin: '200px' },
        );
        io.observe(containerRef.current);
      }

      rt.raf = requestAnimationFrame(tick);

      let resizeObs = null;
      const target = containerRef.current;
      if (target && typeof ResizeObserver !== 'undefined') {
        resizeObs = new ResizeObserver(() => resize());
        resizeObs.observe(target);
      } else {
        window.addEventListener('resize', resize);
      }

      return () => {
        cancelAnimationFrame(rt.raf);
        if (io) io.disconnect();
        if (resizeObs) resizeObs.disconnect();
        else window.removeEventListener('resize', resize);
      };
    }, [resize, triggerBurst, autoBurstOnMount]);

    const structuralKey = useMemo(
      () => `${cellSize}|${shapes.join(',')}|${colors.length}`,
      [cellSize, shapes, colors],
    );
    useEffect(() => {
      buildLattice();
    }, [structuralKey, buildLattice]);

    /* Pointer handlers — move/leave bail on touch devices (checked inside,
       via a ref set on mount, so the rendered props are identical between
       the SSG render and the client — no environment branching in render).
       Pointer-down (the burst trigger) works on every device. */
    const touchRef = useRef(false);
    useEffect(() => {
      touchRef.current = isTouchDevice();
    }, []);

    const onPointerMove = useCallback((e) => {
      if (touchRef.current) return;
      const rt = runtimeRef.current;
      const container = containerRef.current;
      if (!rt || !container) return;
      const rect = container.getBoundingClientRect();
      rt.pointer = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      rt.pointerEnergy = 1;
    }, []);

    const onPointerLeave = useCallback(() => {
      if (touchRef.current) return;
      const rt = runtimeRef.current;
      if (!rt) return;
      rt.pointer = null;
    }, []);

    const onPointerDown = useCallback(
      (e) => {
        triggerBurst(e.clientX, e.clientY);
      },
      [triggerBurst],
    );

    return (
      <div
        ref={containerRef}
        className={`cursor-wave ${className}`.trim()}
        style={{ width, height, backgroundColor }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
      >
        <canvas ref={canvasRef} className="cursor-wave__canvas" />
        {children && <div className="cursor-wave__overlay">{children}</div>}
      </div>
    );
  },
);

CursorWave.displayName = 'CursorWave';

export default CursorWave;
