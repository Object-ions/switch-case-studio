import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import PropTypes from "prop-types";
import "../styles/components/deviceMockup.scss";

const DeviceMockup = ({
  frameSrc,
  contentSrc,
  alt = "",
  viewport,
  speed = 35,
  hold = 0.6,
  pauseOnHover = true,
  controls = true,
  className = "",
}) => {
  const wrapRef = useRef(null);
  const viewRef = useRef(null);
  const imgRef = useRef(null);
  const tlRef = useRef(null);
  const distanceRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoplayed, setHasAutoplayed] = useState(false);

  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const killTL = () => {
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
  };

  const applyProgress = (p) => {
    const img = imgRef.current;
    const d = distanceRef.current;
    if (!img || d <= 0) return;
    const y = -d * Math.min(Math.max(p, 0), 1);
    gsap.set(img, { y });
  };

  // compute scroll distance when image & viewport are ready
  useEffect(() => {
    const content = imgRef.current;
    const viewportEl = viewRef.current;
    if (!content || !viewportEl) return;

    const calc = () => {
      const d =
        content.naturalHeight - viewportEl.getBoundingClientRect().height;
      distanceRef.current = Math.max(0, d);
      if (d <= 0) {
        killTL();
        applyProgress(0);
      }
    };

    const onLoad = () => {
      calc();
      applyProgress(0); // show top immediately

      // autoplay after 1s
      if (!prefersReduced && distanceRef.current > 0) {
        gsap.delayedCall(1.5, () => {
          killTL();
          const tl = buildOneShot();
          if (tl) {
            tl.play(0);
            tlRef.current = tl;
            setIsPlaying(true);
            setHasAutoplayed(true);
          }
        });
      }
    };

    if (content.complete) onLoad();
    else content.addEventListener("load", onLoad, { once: true });

    const ro = new ResizeObserver(calc);
    ro.observe(viewportEl);

    return () => {
      if (!content.complete) content.removeEventListener("load", onLoad);
      ro.disconnect();
      killTL();
    };
  }, []);

  const buildOneShot = () => {
    const img = imgRef.current;
    const d = distanceRef.current;
    if (!img || d <= 0) return null;

    const currentY = gsap.getProperty(img, "y");
    const traveled = Math.abs(currentY) || 0;
    const remainingDown = Math.max(d - traveled, 0);

    const tl = gsap.timeline({ paused: true });

    tl.to(img, { y: -d, duration: remainingDown / speed, ease: "none" })
      .to({}, { duration: hold }) // ✅ delay at bottom
      .to(img, { y: 0, duration: d / speed, ease: "none" })
      .add(() => {
        // ✅ end at top
        gsap.set(img, { y: 0 });
        setIsPlaying(false);
        setHasAutoplayed(true);
        killTL();
      });

    return tl;
  };

  // intersection + hover behavior + AUTOPLAY once when visible
  useEffect(() => {
    if (prefersReduced) return;
    const host = wrapRef.current;
    if (!host) return;

    const pause = () => {
      if (tlRef.current) tlRef.current.pause();
      setIsPlaying(false);
    };

    // Only pause when not in view; no autoplay trigger here
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) pause();
        }),
      { threshold: 0.55 }
    );
    io.observe(host);

    let onEnter, onLeave;
    if (pauseOnHover) {
      onEnter = () => pause();
      onLeave = () => {}; // user can hit play again
      host.addEventListener("mouseenter", onEnter);
      host.addEventListener("mouseleave", onLeave);
    }

    return () => {
      io.disconnect();
      if (pauseOnHover) {
        host.removeEventListener("mouseenter", onEnter);
        host.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [prefersReduced, pauseOnHover]);

  // Controls
  const play = () => {
    if (prefersReduced || distanceRef.current <= 0) return;
    killTL();
    const tl = buildOneShot();
    if (tl) {
      tl.play();
      tlRef.current = tl;
      setIsPlaying(true);
    }
  };
  const pause = () => {
    if (tlRef.current) tlRef.current.pause();
    setIsPlaying(false);
  };
  const nudge = (dir = 1, amt = 0.08) => {
    pause();
    const img = imgRef.current;
    if (!img) return;
    const d = distanceRef.current;
    const current = Math.abs(gsap.getProperty(img, "y"));
    const next = Math.min(Math.max(current + dir * amt * d, 0), d);
    gsap.set(img, { y: -next });
  };

  const viewStyle = {
    left: `${viewport.leftPct}%`,
    top: `${viewport.topPct}%`,
    width: `${viewport.widthPct}%`,
    height: `${viewport.heightPct}%`,
  };

  return (
    <figure className={`device-mockup ${className}`} ref={wrapRef}>
      {controls && (
        <div className="device-mockup__controls device-mockup__controls--top">
          <button
            type="button"
            className="dmk-btn"
            onClick={() => nudge(-1)}
            aria-label="Scroll up"
            title="Up"
          >
            ▲
          </button>
          <button
            type="button"
            className="dmk-btn dmk-btn--primary"
            onClick={isPlaying ? pause : play}
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            className="dmk-btn"
            onClick={() => nudge(1)}
            aria-label="Scroll down"
            title="Down"
          >
            ▼
          </button>
        </div>
      )}

      <div className="device-mockup__viewport" style={viewStyle} ref={viewRef}>
        <img
          ref={imgRef}
          src={contentSrc}
          alt={alt}
          className="device-mockup__content"
          draggable="false"
        />
      </div>

      <img
        className="device-mockup__frame"
        src={frameSrc}
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      <figcaption className="sr-only">{alt}</figcaption>
    </figure>
  );
};

DeviceMockup.propTypes = {
  frameSrc: PropTypes.string.isRequired,
  contentSrc: PropTypes.string.isRequired,
  alt: PropTypes.string,
  viewport: PropTypes.shape({
    leftPct: PropTypes.number.isRequired,
    topPct: PropTypes.number.isRequired,
    widthPct: PropTypes.number.isRequired,
    heightPct: PropTypes.number.isRequired,
  }).isRequired,
  speed: PropTypes.number,
  hold: PropTypes.number,
  pauseOnHover: PropTypes.bool,
  controls: PropTypes.bool,
  className: PropTypes.string,
};

export default DeviceMockup;
