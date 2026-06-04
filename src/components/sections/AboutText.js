import { useRef } from "react";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutText = () => {
  const rootRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    // scope all selectors to this component
    const ctx = gsap.context(() => {
      const paragraphs = gsap.utils.toArray(".work-text p");

      // start hidden to avoid flash
      gsap.set(paragraphs, { y: 30, autoAlpha: 0 });

      // create a trigger for each <p>
      paragraphs.forEach((p) => {
        gsap.to(p, {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: p,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, rootRef);

    return () => ctx.revert(); // clean up
  }, []);

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
