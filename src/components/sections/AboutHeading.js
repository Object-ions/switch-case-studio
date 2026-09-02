import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import useReducedMotion from '../../hooks/useReducedMotion';

const AboutHeading = () => {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const words = gsap.utils.toArray('.word');

    // M3: colors come from the design tokens (:root exports in app.scss);
    // literals are the sync'd fallbacks per the token-mirror convention.
    const rootStyles = getComputedStyle(document.documentElement);
    const scrubFrom =
      rootStyles.getPropertyValue('--about-scrub-from').trim() || '#e9add7';
    const scrubTo =
      rootStyles.getPropertyValue('--about-scrub-to').trim() || '#ff8347';

    // VE-10: reduced motion skips the scrub — words rest at the END color
    // (the highlighted state), never animating.
    if (reducedMotion) {
      gsap.set(words, { color: scrubTo });
      return undefined;
    }

    gsap.set(words, { color: scrubFrom }); // initial color

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.work-heading',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: true,
      },
    });

    words.forEach((word, i) => {
      tl.to(word, { color: scrubTo }, i * 0.05); // highlight one by one
    });

    return () => {
      // Scoped kill (was ScrollTrigger.getAll().forEach(kill) — that nuked
      // EVERY component's triggers app-wide on unmount, e.g. on route
      // change). Only this timeline's own trigger dies with it.
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reducedMotion]);

  const text = `We build websites, apps, and AI systems that convert: designed from scratch, engineered by people who ship real code, and automated so your business runs while you sleep`;

  const wrappedWords = text.split(' ').map((word, idx) => (
    <span
      key={idx}
      // caps-trim: optical size reduction for the all-caps "AI" token
      // (see app.scss) — scrub still targets .word.
      className={word === 'AI' ? 'word caps-trim' : 'word'}
    >
      {word}&nbsp;
    </span>
  ));

  return (
    <div className="work-heading">
      <p>{wrappedWords}</p>
    </div>
  );
};

export default AboutHeading;
