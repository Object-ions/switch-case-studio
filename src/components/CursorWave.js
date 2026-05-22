import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import "../styles/components/cursorWave.scss";

/* ------------------------------------------------------------------ */
/*  Defaults                                                          */
/* ------------------------------------------------------------------ */

const DEFAULT_COLORS = [
  "#dab8ff",
  "#ff834a",
  "#d99cff",
  "#ff8f63",
  "#f0d7ff",
  "#FEF7ED",
];
const DEFAULT_SHAPES = ["square", "star", "asterisk", "circle"];

const TAU = Math.PI * 2;

/* Touch / no-hover detection at module level — same pattern as the
   custom cursor. We use this to decide which listeners attach, but
   we keep the canvas mounted either way so taps can still trigger
   bursts and an auto-burst gives mobile users immediate motion. */
const IS_TOUCH =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(hover: none)").matches;

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
  "M595.94,270.83c56.16-41.57,112.93-98.74,170.44-142.58,40.42-28.83,137.34-126.52,134.65-16.78-20.86,66.83-62.51,150.75-81.53,221.29-4.06,10.79-35.93,76.32-31.38,80.74,67.12,6.3,135.09,1.25,202.56,2.8,32.83,5.57,154.36-18.75,119,43.49-313.18,211.46-402.86,16.06-112.21,357.36,6.53,22.85,5.4,66.8-30.26,47.71-89.47-28.45-185.58-77.39-272.19-112.22-21.21-10.61-15.06,46.75-20.45,61.26-13.59,44.93,19.32,270.37-54.04,243.25-52.8-36.41-65.31-118.07-91.11-173.89-12.91-29.86-30.65-58.34-43.08-88.53-88.01,37.58-153.53,154.96-244.34,186.87-22.52-14.02-50.24,3.9-45.12-36.64,13.74-97.54,64.36-190.13,93.21-283.91-85.62-18.72-179.99.17-265.86-18.16-4.35-.87-16.24-7.13-18.12-10.99-3.51-7.18-8.77-43.75-4.52-51.11,11.95-20.67,105.18-45.19,131.16-55.21,36.36-14.02,72.11-30.95,107.75-46.74-20.89-36.83-62.14-85.22-86.17-123.24-13.9-18.48-69.52-79-71.03-95.22,1.21-12.17.82-42.77,14.58-49.17,96.56,2.51,192.09,61.3,285.38,85.85,3.31-55.17,14.48-109.84,20.36-164.57,2.65-24.6-.65-88.09,13.02-103.45C422.14,22.86,476.28-.73,483.69.02c53.68,76.55,70.99,184.05,112.26,270.82Z";

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
  if (typeof Path2D === "undefined") return null;
  scsStarPath2D = new Path2D(SCS_STAR_PATH_DATA);
  return scsStarPath2D;
}

function tracePath(ctx, shape, size) {
  switch (shape) {
    case "square": {
      const half = size * 0.6;
      const r = size * 0.12;
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
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
    case "star": {
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
    case "asterisk": {
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

    case "circle": {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.6, 0, TAU);
      return null;
    }

    /* Legacy shape — kept so existing callers can still opt in. */
    case "triangle": {
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
  if (typeof color === "string") return color;
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
      width = "100%",
      height = "100%",
      className = "",
      children,
      cellSize = 40,
      influenceRadiusVmin = 30,
      attackTime = 0.5,
      releaseTime = 0.6,
      idleScale = 0.09,
      minPeakScale = 1,
      maxPeakScale = 3,
      burstSpeed = 1200,
      burstThickness = 180,
      backgroundColor = "#0a0a0a",
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

      const ctx = canvas.getContext("2d");
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
      if (autoBurstOnMount || IS_TOUCH) {
        /* Defer one frame so the lattice has size when the ripple
           seeds. */
        requestAnimationFrame(() => triggerBurst());
      }

      const tick = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
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
            "[data-cursor-wave-mask]",
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

        rt.raf = requestAnimationFrame(tick);
      };

      rt.raf = requestAnimationFrame(tick);

      let resizeObs = null;
      const target = containerRef.current;
      if (target && typeof ResizeObserver !== "undefined") {
        resizeObs = new ResizeObserver(() => resize());
        resizeObs.observe(target);
      } else {
        window.addEventListener("resize", resize);
      }

      return () => {
        cancelAnimationFrame(rt.raf);
        if (resizeObs) resizeObs.disconnect();
        else window.removeEventListener("resize", resize);
      };
    }, [resize, triggerBurst, autoBurstOnMount]);

    const structuralKey = useMemo(
      () => `${cellSize}|${shapes.join(",")}|${colors.length}`,
      [cellSize, shapes, colors],
    );
    useEffect(() => {
      buildLattice();
    }, [structuralKey, buildLattice]);

    /* Pointer handlers — move/leave only attach on hover-capable devices.
       Pointer-down (the burst trigger) attaches on every device. */
    const onPointerMove = useCallback((e) => {
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
        onPointerMove={IS_TOUCH ? undefined : onPointerMove}
        onPointerLeave={IS_TOUCH ? undefined : onPointerLeave}
        onPointerDown={onPointerDown}
      >
        <canvas ref={canvasRef} className="cursor-wave__canvas" />
        {children && <div className="cursor-wave__overlay">{children}</div>}
      </div>
    );
  },
);

CursorWave.displayName = "CursorWave";

export default CursorWave;
