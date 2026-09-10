import { useEffect, useRef } from "react";
import { HashLink } from "react-router-hash-link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BookCallCta from "../ui/BookCallCta";
import useReducedMotion from "../../hooks/useReducedMotion";
import {
  DUR_SLOW,
  EASE_OUT_SOFT,
  REVEAL_STAGGER,
  REVEAL_SAFETY_DELAY,
} from "../../animation/motionTokens";

gsap.registerPlugin(ScrollTrigger);

import "../../styles/components/hero.scss";

/* The studio ident: 4.5s of hard-cut plates that settle on the wordmark.
   Rendered from ~/Desktop/scs-ident (Remotion, private: licensed fonts);
   only the encoded video ships here (public/ident/, limited-range BT.709:
   full-range VP9 fails in Chrome's decoder mid-stream). The poster IS the
   final frame, so a paused or blocked video shows what the video ends on.
   It loops: 2s on the wordmark, then the plates run again. */

const Hero = () => {
  const reducedMotion = useReducedMotion();
  const identRef = useRef(null);
  const rootRef = useRef(null);

  /* Copy motion. Static HTML ships visible; the hide happens at runtime only
     (never-invisible rule), then the four corner blocks rise in a stagger
     half a second after mount so the ident's first plates lead. On scroll-out
     the blocks drift apart, scrubbed. The entrance owns `yPercent`, the
     scrub owns `y`: separate transform components, so one tween per
     property holds. The video is never touched. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const items = gsap.utils.toArray(
      ".hero-top, .hero-say, .hero-note, .hero-scroll",
      root,
    );
    if (reducedMotion) {
      gsap.set(items, { clearProps: "all" });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.set(items, { autoAlpha: 0, yPercent: 6 });
      gsap.to(items, {
        autoAlpha: 1,
        yPercent: 0,
        duration: DUR_SLOW,
        stagger: REVEAL_STAGGER,
        ease: EASE_OUT_SOFT,
        delay: 0.5,
        overwrite: "auto",
      });
      const safety = gsap.delayedCall(REVEAL_SAFETY_DELAY, () => {
        if (
          !items.some((el) => gsap.isTweening(el)) &&
          items.some((el) => gsap.getProperty(el, "opacity") < 1)
        ) {
          gsap.set(items, { autoAlpha: 1, yPercent: 0 });
        }
      });

      const scrub = { trigger: root, start: "top top", end: "bottom top", scrub: true };
      gsap.to(root.querySelector(".hero-top"), { y: -60, ease: "none", scrollTrigger: scrub });
      gsap.to(gsap.utils.toArray(".hero-note, .hero-scroll", root), {
        y: 60,
        ease: "none",
        scrollTrigger: { ...scrub },
      });

      return () => safety.kill();
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    const video = identRef.current?.querySelector("video");
    if (!video) return undefined;
    video.muted = true;
    if (reducedMotion) {
      // No motion: park on the end card (the wordmark) instead of playing.
      const toEnd = () => {
        video.pause();
        if (Number.isFinite(video.duration)) {
          video.currentTime = Math.max(0, video.duration - 0.05);
        }
      };
      if (video.readyState >= 1) toEnd();
      else video.addEventListener("loadedmetadata", toEnd, { once: true });
      return () => video.removeEventListener("loadedmetadata", toEnd);
    }
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    return undefined;
  }, [reducedMotion]);

  return (
    <section id="hero" aria-label="Switch Case Studio introduction" ref={rootRef}>
      <div className="hero-frame">
        <div className="hero-top">
          {/* One h1, two reading directions: the verb runs up the left edge,
              the object runs along the top. display:contents lets the grid
              place the spans while the h1 stays a single heading. */}
          <h1 className="hero-headline">
            <span className="hero-headline__vert">we build</span>
            <span className="hero-headline__horiz">
              websites, stores, apps &amp;{" "}
              <span className="caps-trim">AI</span>
            </span>
          </h1>
          <p className="hero-intro">
            An <span className="caps-trim">AI</span>-first design and
            engineering studio in Portland, Oregon. We write the code, ship
            the store, wire the assistant, and publish numbers you can check.
          </p>
        </div>

        <BookCallCta className="hero-say">
          <span className="hero-say__arrow" aria-hidden="true">
            &rarr;
          </span>
        </BookCallCta>

        <div className="hero-ident" ref={identRef}>
          {/* Static HTML must carry autoplay+muted+playsinline so phones start
              the ident before hydration; the effect above only re-asserts
              muted and handles reduced motion. */}
          <video
            className="hero-ident__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/ident/ident-16x9-poster.webp"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/ident/ident-1x1.webm" type="video/webm" media="(max-width: 768px)" />
            <source src="/ident/ident-1x1.mp4" type="video/mp4" media="(max-width: 768px)" />
            <source src="/ident/ident-16x9.webm" type="video/webm" />
            <source src="/ident/ident-16x9.mp4" type="video/mp4" />
          </video>
        </div>

        <p className="hero-note hero-note--left">
          Design, code and <span className="caps-trim">AI</span> in one room,
          so the site, the store and the assistant are built by the people
          who keep them running.
        </p>

        <HashLink to="/#projects" smooth className="hero-scroll">
          Scroll
          <span className="hero-scroll__arrow" aria-hidden="true">
            &darr;
          </span>
        </HashLink>

        <p className="hero-note hero-note--right">
          Every case study here ships its own before and after: page weight
          and load time, measured on the live site and dated.
        </p>
      </div>
    </section>
  );
};

export default Hero;
