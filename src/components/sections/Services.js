import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import servicesData from "../../data/services.json";
import "../../styles/components/services.scss";


function ServiceItem({ service, index }) {
  const itemRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayInnerRef = useRef(null);
  const charsRef = useRef([]);

  const animationDefaults = { duration: 0.6, ease: "expo" };

  useEffect(() => {
    if (!itemRef.current) return undefined;

    // House safe-reveal (DESIGN_AUDIT P1-7): the old scrub:1 tied row
    // opacity to scroll position — stop scrolling mid-window and the row
    // sat stranded half-transparent. Play-once onEnter + safety net now;
    // reduced-motion leaves the SSG-visible row untouched.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const el = itemRef.current;
      gsap.set(el, { autoAlpha: 0, x: -60 });

      const reveal = () =>
        gsap.to(el, {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          overwrite: "auto",
        });

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: reveal,
      });
      if (st.progress > 0) reveal();

      gsap.delayedCall(3, () => gsap.set(el, { autoAlpha: 1, x: 0 }));
    }, itemRef);

    return () => ctx.revert();
  }, [index]);

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
        <span className="services__item-main">
          <span className="services__item-title">{service.title}</span>
          <span className="services__item-subtitle">{service.subTitle}</span>
        </span>

        <span className="services__item-cta">{service.cta}</span>
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
  return (
    <section id="services" className="services">
      <div id="services-menu" className="services__menu">
        <div className="services__list">
          {servicesData.map((service, index) => (
            <ServiceItem key={service.slug} service={service} index={index} />
          ))}

          <div className="services__list-bottom" />
        </div>
      </div>
    </section>
  );
};

export default Services;
