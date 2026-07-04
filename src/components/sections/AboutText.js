import { useRef } from "react";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useReducedMotion from "../../hooks/useReducedMotion";
import {
  DUR_SLOW,
  EASE_OUT_SOFT,
  REVEAL_Y,
  REVEAL_SAFETY_DELAY,
} from "../../animation/motionTokens";

const AboutText = () => {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();

  /* VE-10: migrated off toggleActions:'play none none reverse' (the last
   * reverse-on-scroll-out reveal — the pattern P1-7 removed everywhere
   * else) onto the house safe-reveal: play-once onEnter per paragraph +
   * in-view fallback + safety net + reduced-motion static. */
  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return undefined;

    const ctx = gsap.context(() => {
      const paragraphs = gsap.utils.toArray(".work-text p");

      gsap.set(paragraphs, { y: REVEAL_Y, autoAlpha: 0 });

      const reveal = (p) =>
        gsap.to(p, {
          y: 0,
          autoAlpha: 1,
          duration: DUR_SLOW,
          ease: EASE_OUT_SOFT,
          overwrite: "auto",
        });

      paragraphs.forEach((p) => {
        ScrollTrigger.create({
          trigger: p,
          start: "top 80%",
          once: true,
          onEnter: () => reveal(p),
        });

        if (p.getBoundingClientRect().top < window.innerHeight * 0.8) {
          reveal(p);
        }
      });

      gsap.delayedCall(REVEAL_SAFETY_DELAY, () => {
        paragraphs.forEach((p) => {
          if (gsap.getProperty(p, "opacity") < 1) reveal(p);
        });
      });
    }, rootRef);

    return () => ctx.revert(); // clean up
  }, [reducedMotion]);

  return (
    <div className="work-text" ref={rootRef}>
      <p>
        Switch Case Studio delivers
        <span className="highlight-block">
          websites, landing pages, and brand systems
        </span>
        for businesses that take their digital presence seriously. Every project
        — from a single campaign page to a full brand launch — is
        <span className="highlight-block">
          built from scratch, not from templates.
        </span>
      </p>
      <br />
      <p>
        Our clients include medical spas, real estate firms, e-commerce brands,
        and marketing companies across the US. We move
        <span className="highlight-block">fast without cutting corners</span>—
        most sites ship in under two weeks, with a design-to-launch process that
        keeps you in the loop without drowning you in it.
      </p>
      <br />
      <p>
        We’re a small, focused studio — which means you work directly with the
        people building your project, not an account manager.
        <span className="highlight-block">
          Every detail gets personal attention.
        </span>
        That’s not a pitch. It’s just how we operate.
      </p>
    </div>
  );
};

export default AboutText;
