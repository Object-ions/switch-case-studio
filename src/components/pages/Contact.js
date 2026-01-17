import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactForm from '../ContactForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/contact.scss';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const formRef = useRef();

  // Refs
  const leftColRef = useRef(null);
  const ctaRef = useRef(null);
  const iconRef = useRef(null);
  const addressRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: leftColRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out', immediateRender: false },
      });

      // 1. Headline rises up
      tl.from('.contact-headline span', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1
      });

      // 2. CTA & Details rise up (changed from X to Y axis)
      tl.from(ctaRef.current, { autoAlpha: 0, y: 20, duration: 0.6 }, '-=0.5');
      tl.from(addressRef.current, { autoAlpha: 0, y: 20, duration: 0.6 }, '-=0.4');
      tl.from(emailRef.current, { autoAlpha: 0, y: 20, duration: 0.6 }, '-=0.5');

      // 3. Form rises up
      tl.from('.contact-form', { autoAlpha: 0, y: 40, duration: 0.8 }, '-=0.6');

      // Icon bounce
      if (!prefersReduced && iconRef.current) {
        gsap.to(iconRef.current, {
          y: -3,
          repeat: 1,
          yoyo: true,
          duration: 0.5,
          delay: 1,
          ease: 'power1.inOut'
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div id="contact">
      <div className="contact-wrapper">
        {/* Text Section */}
        <div className="contact-left" ref={leftColRef}>

          <h2 className="contact-headline">
            <span className="block">Let's Build</span>
            <span className="block text-gradient">Something Exceptional</span>
            <span className="block">Together.</span>
          </h2>

          <div className="contact-text">
            <a
              ref={ctaRef}
              className="contact-cta"
              href="https://calendar.app.google/83UCJjis2FHUrr1s6"
              target="_blank"
              rel="noreferrer"
            >
              Book a Strategy Call
              <FontAwesomeIcon
                ref={iconRef}
                className="contact-cta_icon"
                icon={faArrowUpRightFromSquare}
                style={{ fontSize: '12px' }}
              />
            </a>

            <div className="contact-details">
              <p ref={addressRef} className="contact-address">
                Phoenix, AZ 85003
              </p>

              <a
                ref={emailRef}
                className="contact-email"
                href="mailto:hello@switchcasestudio.com"
              >
                hello@switchcasestudio.com
              </a>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="contact-form">
          <ContactForm formRef={formRef} />
        </div>
      </div>
    </div>
  );
};

export default Contact;