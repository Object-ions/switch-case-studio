import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import servicesData from "../../data/services.json";
import armSafetyNet from "../../animation/armSafetyNet";
import "../../styles/components/services.scss";


function ServiceItem({ service, index, delay = 0 }) {
  const itemRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayInnerRef = useRef(null);
  const charsRef = useRef([]);

  const animationDefaults = { duration: 0.6, ease: "expo" };

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    /* Typographic build (owner, 2026-09-10: the old x-slide "felt like
       nothing"). Per entry, on its own trigger so scrolling reads as a
       sequence: the hairline draws left → right, the title rises out of a
       mask, kicker + pricing link fade in, subtitle and includes follow.
       All hidden at runtime only (static HTML ships visible), one timeline
       per entry, a timed net that forces every piece visible. The entry
       itself carries no reveal transform any more: `y` on the item belongs
       to the column parallax in Services below. */
    const rule = el.querySelector(".services__item-rule");
    const meta = el.querySelectorAll(".services__item-kicker, .services__item-cta");
    const title = el.querySelector(".services__item-title");
    const body = el.querySelectorAll(".services__item-subtitle, .services__item-includes");
    const pieces = [rule, ...meta, title, ...body];

    const ctx = gsap.context(() => {
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(meta, { autoAlpha: 0, y: 8 });
      gsap.set(title, { yPercent: 110 });
      gsap.set(body, { autoAlpha: 0, y: 16 });

      let played = false;
      const reveal = () => {
        if (played) return;
        played = true;
        el.dataset.revealed = "1";
        gsap
          .timeline({ delay, defaults: { overwrite: "auto" } })
          .to(rule, { scaleX: 1, duration: 0.7, ease: "power3.out" }, 0)
          .to(title, { yPercent: 0, duration: 0.8, ease: "power4.out" }, 0.1)
          .to(meta, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.15)
          .to(body, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1 }, 0.35);
      };

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: reveal,
      });
      if (st.progress > 0) reveal();

      // Viewport-aware net: forces the end state only if the entry is on
      // screen and still hidden; entries below the fold keep their build.
      const disarm = armSafetyNet(
        el,
        () => played || pieces.some((p) => gsap.isTweening(p)),
        () => {
          played = true;
          gsap.set(rule, { scaleX: 1 });
          gsap.set(title, { yPercent: 0 });
          gsap.set([...meta, ...body], { autoAlpha: 1, y: 0 });
        },
      );
      return () => disarm();
    }, itemRef);

    return () => ctx.revert();
  }, [index, delay]);

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY, 2);
    const bottomEdgeDist =
      Math.pow(mouseX - width / 2, 2) + Math.pow(mouseY - height, 2);

    return topEdgeDist < bottomEdgeDist ? "top" : "bottom";
  };

  const handleMouseEnter = (ev) => {
    if (!itemRef.current || !overlayRef.current || !overlayInnerRef.current) {
      return;
    }

    const rect = itemRef.current.getBoundingClientRect();

    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height,
    );

    const tl = gsap.timeline({ defaults: animationDefaults });

    tl.set(overlayRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .set(overlayInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0)
      .to([overlayRef.current, overlayInnerRef.current], { y: "0%" }, 0);

    if (charsRef.current.length > 0) {
      tl.fromTo(
        charsRef.current,
        { y: 0 },
        {
          y: -32,
          duration: 0.15,
          ease: "sine.out",
          stagger: { each: 0.01, from: "start" },
        },
        0,
      ).to(
        charsRef.current,
        {
          y: 0,
          duration: 0.2,
          ease: "sine.inOut",
          stagger: { each: 0.01, from: "start" },
        },
        0.15,
      );
    }
  };

  const handleMouseLeave = (ev) => {
    if (!itemRef.current || !overlayRef.current || !overlayInnerRef.current) {
      return;
    }

    const rect = itemRef.current.getBoundingClientRect();

    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height,
    );

    gsap.set(charsRef.current, { y: 0 });

    gsap
      .timeline({ defaults: animationDefaults })
      .to(overlayRef.current, { y: edge === "top" ? "-101%" : "101%" }, 0)
      .to(overlayInnerRef.current, { y: edge === "top" ? "101%" : "-101%" }, 0);
  };

  const chars = service.title.split("").map((char, i) => (
    <span
      key={i}
      ref={(el) => {
        if (el) charsRef.current[i] = el;
      }}
      className="services__overlay-char"
      style={{ whiteSpace: char === " " ? "pre" : undefined }}
    >
      {char}
    </span>
  ));

  return (
    <div ref={itemRef} className="services__item">
      <Link
        to={`/pricing/${service.slug}`}
        className="services__link cursor-black"
        aria-label={`${service.title} pricing`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Kicker row, then the service name as the dominant element and one
            line under it. The included-items line was cut (owner, 2026-09-10:
            the services are the product; the detail lives one click away on
            each pricing page). */}
        <span className="services__item-meta">
          <span className="services__item-kicker">{service.kicker}</span>
          <span className="services__item-cta">{service.cta}</span>
          <span className="services__item-rule" aria-hidden="true" />
        </span>
        {/* Inner parallax layer (name + line). The entrance build animates
            the children; the parallax moves only this wrapper, so the two
            never write the same property on the same element. The empty
            space above it is the sticker slot. */}
        <span className="services__item-body">
          <span className="services__item-title-mask">
            <span className="services__item-title">{service.title}</span>
          </span>
          <span className="services__item-subtitle">{service.subTitle}</span>
        </span>
      </Link>

      <div
        ref={overlayRef}
        className="services__overlay"
        style={{ transform: "translateY(101%)" }}
      >
        <div
          ref={overlayInnerRef}
          className="services__overlay-inner"
          style={{ transform: "translateY(-101%)" }}
        >
          <span className="services__overlay-main">
            <span className="services__overlay-title">{chars}</span>
            <span className="services__overlay-subtitle">
              {service.description}
            </span>
          </span>

          <svg
            className="services__icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 17L17 7M17 7H7M17 7V17"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

const Services = () => {
  const listRef = useRef(null);

  /* Layered parallax (desktop only), see the matchMedia block. `y` on the
     ITEM and `y` on `.services__item-body` belong to these tweens alone; the
     entry build animates the item's other children. Reduced motion: none. */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray(".services__item", list);
      // Layered parallax (owner, 2026-09-10): every card travels upward at
      // its own speed as the section scrolls through, and its name block
      // travels a further 40% of that inside the card. Max card travel is
      // 60px either side; #services' padding must stay above that (it clips).
      const SPEEDS = [34, 60, 22, 48];
      items.forEach((item, i) => {
        const s = SPEEDS[i % SPEEDS.length];
        const scrollTrigger = { trigger: list, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(item, { y: s }, { y: -s, ease: "none", scrollTrigger: { ...scrollTrigger } });
        const body = item.querySelector(".services__item-body");
        if (body) {
          gsap.fromTo(body, { y: s * 0.4 }, { y: -s * 0.4, ease: "none", scrollTrigger: { ...scrollTrigger } });
        }
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="services" className="services">
      <div id="services-menu" className="services__menu">
        <div
          className="services__list"
          ref={listRef}
        >
          {servicesData.map((service, index) => (
            <ServiceItem
              key={service.slug}
              service={service}
              index={index}
              // One row of four: left to right, a beat apart.
              delay={index * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
