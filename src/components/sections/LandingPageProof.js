import { useRef } from 'react';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';
import { HashLink } from 'react-router-hash-link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../../hooks/useReducedMotion';

import '../../styles/components/landingPageProof.scss';


const FEATURES = [
  {
    label: 'Websites & stores',
    desc: 'Marketing sites, landing pages, and e-commerce — built from scratch to convert. Not a template, not a theme.',
  },
  {
    label: 'Apps & dashboards',
    desc: 'Web apps, client portals, and internal tools built with React and Node — the interfaces that run your business.',
  },
  {
    label: 'AI & automation',
    desc: 'Chatbots trained on your business, agents that do real work, and n8n / Zapier workflows that kill busywork.',
  },
  {
    label: 'Agency-ready',
    desc: 'White-label and wholesale delivery available. Built to your brief, shipped on time.',
  },
];

const LandingPageProof = () => {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray('.lpp-animate', sectionRef.current);

      // House safe-reveal (DESIGN_AUDIT P1-7): the old fromTo+once carried
      // the immediateRender trap (a ScrollTrigger.refresh() during load
      // re-applies the hidden from-state — the CaseStudyTiles bug class),
      // and an already-past `once` trigger never fires onEnter. set →
      // onEnter → in-view fallback → safety net.
      gsap.set(targets, { autoAlpha: 0, y: 28 });

      const reveal = () =>
        gsap.to(targets, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.1,
          overwrite: 'auto',
        });

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 78%',
        once: true,
        onEnter: reveal,
      });
      if (st.progress > 0) reveal();

      gsap.delayedCall(3, () => gsap.set(targets, { autoAlpha: 1, y: 0 }));
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="what-we-build"
      className="lpp"
      aria-label="What we build"
    >
      <div className="lpp__inner">
        <div className="lpp__header">
          <p className="lpp__kicker lpp-animate">What we build best</p>
          <h2 className="lpp__heading lpp-animate">
            One studio.<br />Design, code &amp; AI.
          </h2>
          <p className="lpp__body lpp-animate">
            Store, marketing site, web app, or the automation behind it —
            every build starts with the same question: what needs to happen
            for a visitor to become a customer? We design it, engineer it,
            and wire in AI where it moves that number.
          </p>
        </div>

        <div className="lpp__features" role="list">
          {FEATURES.map((f) => (
            <div key={f.label} className="lpp__feature lpp-animate" role="listitem" data-cursor-morph>
              <strong className="lpp__feature-label">{f.label}</strong>
              <span className="lpp__feature-desc">{f.desc}</span>
            </div>
          ))}
        </div>

        <HashLink
          to="/#projects"
          smooth
          className="lpp__cta lpp-animate"
        >
          See our work
          <span className="lpp__cta-arrow" aria-hidden="true">&rarr;</span>
        </HashLink>
      </div>
    </section>
  );
};

export default LandingPageProof;
