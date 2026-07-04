import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/components/faq.scss";


/* ------------------------------------------------------------------ *
 * FAQ content
 * ------------------------------------------------------------------ */
const faqs = [
  {
    question: "What services does Switch Case Studio offer?",
    answer:
      "Switch Case Studio offers web design and development, SEO, web hosting, email marketing, content writing, branding, graphic design, automation, and digital marketing support.",
  },
  {
    question: "Do you build custom websites or only use templates?",
    answer:
      "Most projects are custom-built around the client\u2019s brand, goals, and budget. Depending on the project, we can build with React, Next.js, WordPress, WooCommerce, Shopify, or other tools that make sense for the business.",
  },
  {
    question: "Can you help with both design and development?",
    answer:
      "Yes. We handle the visual side and the technical side, including layout, branding, user experience, responsive design, development, deployment, hosting setup, and basic technical maintenance.",
  },
  {
    question: "Do you offer ongoing support after the website is live?",
    answer:
      "Yes. We can help with updates, hosting, performance checks, SEO improvements, content changes, landing pages, email setup, and ongoing marketing needs after launch.",
  },
  {
    question: "How long does a website project usually take?",
    answer:
      "A simple landing page can often be completed faster, while a full business website or e-commerce project takes longer. Timeline depends on the number of pages, content, design complexity, integrations, and revision rounds.",
  },
  {
    question: "Can you help with SEO and marketing after launch?",
    answer:
      "Yes. We can help with technical SEO, on-page SEO, blog content, Google Ads, Meta Ads, email marketing, landing pages, and campaign assets so the website can actually support business growth.",
  },
];

/* ------------------------------------------------------------------ *
 * Individual FAQ row — open/close state is local to the row.
 * ------------------------------------------------------------------ */
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq__item${isOpen ? " is-open" : ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="faq__button"
        aria-expanded={isOpen}
      >
        <span className="faq__question">{question}</span>

        <span className="faq__icon" aria-hidden="true">
          <span className="faq__icon-line faq__icon-line--horizontal" />
          <span className="faq__icon-line faq__icon-line--vertical" />
        </span>
      </button>

      <div className="faq__answer-wrap">
        <div className="faq__answer-inner">
          <p className="faq__answer">{answer}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * FAQ section
 *
 * Consolidated to ONE GSAP context with two scrub timelines —
 * one for the title, one staggered across the items. Matches the
 * pattern used in Footer.jsx (single context, single ScrollTrigger
 * batch) and avoids 7 separate trigger instances.
 * ------------------------------------------------------------------ */
const Faq = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // House safe-reveal (DESIGN_AUDIT P1-7): both timelines were scrub:1 —
    // stop scrolling mid-window and the title/items sat stranded at partial
    // opacity. Play-once onEnter + safety net now; reduced-motion leaves
    // the SSG-visible content untouched.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const title = titleRef.current;
      const items = gsap.utils.toArray(".faq__item");

      gsap.set(title, { autoAlpha: 0, y: 60 });
      gsap.set(items, { autoAlpha: 0, y: 40 });

      const revealTitle = () =>
        gsap.to(title, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          overwrite: "auto",
        });
      const revealItems = () =>
        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          overwrite: "auto",
        });

      const stTitle = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: revealTitle,
      });
      const stItems = ScrollTrigger.create({
        trigger: ".faq__list",
        start: "top 85%",
        once: true,
        onEnter: revealItems,
      });
      if (stTitle.progress > 0) revealTitle();
      if (stItems.progress > 0) revealItems();

      // Whatever happens, the FAQ ends fully visible.
      gsap.delayedCall(3, () => {
        gsap.set(title, { autoAlpha: 1, y: 0 });
        gsap.set(items, { autoAlpha: 1, y: 0 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="faq">
      <div className="faq__container">
        <h2 ref={titleRef} className="faq__title">
          Frequently Asked
          <br />
          Questions
        </h2>

        <div className="faq__list">
          {faqs.map((faq) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
