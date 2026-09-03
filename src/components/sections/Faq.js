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
      "Web design and development, e-commerce, web apps, branding, SEO and AI-search optimization, hosting and VPS infrastructure, email marketing, and AI development: chatbots, custom agents, and workflow automation with n8n, Zapier, Make, and GoHighLevel.",
  },
  {
    question: "What can AI and automation actually do for my business?",
    answer:
      "Concrete things: answer customer questions from your own docs 24/7, route and follow up on leads the minute they arrive, draft emails and quotes for your review, sync data between your CRM, calendar, and forms. We start by mapping where automation saves real hours, then build it and hand it over documented, and if AI isn\u2019t the right tool for a task, we\u2019ll say so.",
  },
  {
    question: "Do you build AI chatbots and custom agents?",
    answer:
      "Yes, it\u2019s core work. Assistants trained on your business content, built on Claude or OpenAI APIs, with guardrails and human handoff. For heavier lifting we build multi-step agents that handle leads, quoting, and back-office tasks, self-hosted on a VPS so your data stays yours.",
  },
  {
    question: "Do you build custom websites or only use templates?",
    answer:
      "Custom, from scratch. Depending on the project we build with React, Next.js, Node, WordPress, WooCommerce, or Shopify, whatever fits the business. We use AI to move faster where it helps; every line that ships is engineered and reviewed by us.",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer:
      "Yes. Hosting and maintenance plans, VPS and self-hosted app management (including n8n and AI agents), performance checks, SEO improvements, content changes, and ongoing automation and marketing support.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "A landing page or a first automation usually ships in days, a full site in a few weeks; e-commerce builds and custom AI agent systems take longer depending on integrations and revision rounds. You get a concrete timeline before we start.",
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
