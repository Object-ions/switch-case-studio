// src/components/ZoomLightbox.js
import { useEffect, useRef, useState } from "react";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const ZoomLightbox = ({ src, alt = "", open, onClose }) => {
  const stageRef = useRef(null);
  const imgWrapRef = useRef(null);
  const tapTimerRef = useRef(null);

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [drag, setDrag] = useState(null); // {x,y} when panning starts

  // Close on ESC, lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  // Reset transforms when closed
  useEffect(() => {
    if (!open) {
      setScale(1);
      setTx(0);
      setTy(0);
    }
  }, [open]);

  if (!open) return null;

  const zoomAtPoint = (nextScale, clientX, clientY) => {
    const wrap = imgWrapRef.current;
    if (!wrap) {
      setScale(nextScale);
      return;
    }
    const rect = wrap.getBoundingClientRect();
    const cx = clientX - (rect.left + rect.width / 2);
    const cy = clientY - (rect.top + rect.height / 2);
    setTx((prev) => prev - cx * (nextScale / scale - 1));
    setTy((prev) => prev - cy * (nextScale / scale - 1));
    setScale(nextScale);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const next = clamp(scale + (e.deltaY > 0 ? -0.15 : 0.15), 1, 6);
    zoomAtPoint(next, e.clientX, e.clientY);
  };

  const handleDouble = (clientX, clientY) => {
    const next = scale < 2 ? 2 : 1;
    zoomAtPoint(next, clientX, clientY);
  };

  const handleClick = (e) => {
    if ("touches" in e || "changedTouches" in e) return;
    handleDouble(e.clientX, e.clientY);
  };

  const handleTouchEnd = (e) => {
    if (e.touches?.length) return;
    const touch = e.changedTouches?.[0];
    if (!touch) return;
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;
      handleDouble(touch.clientX, touch.clientY);
    } else {
      tapTimerRef.current = setTimeout(() => {
        clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
      }, 250);
    }
  };

  // Pan
  const startDrag = (e) => {
    e.preventDefault();
    const p = "touches" in e ? e.touches[0] : e;
    setDrag({ x: p.clientX - tx, y: p.clientY - ty });
  };
  const moveDrag = (e) => {
    if (!drag) return;
    const p = "touches" in e ? e.touches[0] : e;
    setTx(p.clientX - drag.x);
    setTy(p.clientY - drag.y);
  };
  const endDrag = () => setDrag(null);

  const controls = {
    plus: () => setScale((s) => clamp(s + 0.25, 1, 6)),
    minus: () => setScale((s) => clamp(s - 0.25, 1, 6)),
    fit: () => {
      setScale(1);
      setTx(0);
      setTy(0);
    },
    reset: () => {
      setScale(1);
      setTx(0);
      setTy(0);
    },
  };

  return (
    <div className="zoomlightbox" role="dialog" aria-modal="true">
      <button
        type="button"
        className="zoomlightbox__backdrop"
        aria-label="Close"
        onClick={onClose}
      />

      <div
        ref={stageRef}
        className="zoomlightbox__stage"
        onWheel={handleWheel}
        onMouseDown={startDrag}
        onMouseMove={moveDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={startDrag}
        onTouchMove={moveDrag}
        onTouchEnd={(e) => {
          endDrag();
          handleTouchEnd(e);
        }}
        onDoubleClick={(e) => handleDouble(e.clientX, e.clientY)}
      >
        <div
          ref={imgWrapRef}
          className="zoomlightbox__imgwrap"
          onClick={handleClick}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="zoomlightbox__img"
            style={{
              transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            }}
          />
        </div>
      </div>

      <div className="zoomlightbox__controls" aria-label="Zoom controls">
        <button type="button" onClick={controls.minus} aria-label="Zoom out">
          −
        </button>
        <span className="zoomlightbox__scale" aria-live="polite">
          {scale.toFixed(2)}×
        </span>
        <button type="button" onClick={controls.plus} aria-label="Zoom in">
          +
        </button>
        <button type="button" onClick={controls.fit} aria-label="Fit">
          Fit
        </button>
        <button type="button" onClick={controls.reset} aria-label="Reset">
          1:1
        </button>
        <button type="button" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
    </div>
  );
};

export default ZoomLightbox;
