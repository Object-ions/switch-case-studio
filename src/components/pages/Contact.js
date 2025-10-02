import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedHeading from '../AnimatedHeading';
import ContactForm from '../ContactForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import '../../styles/components/contact.scss';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const formRef = useRef();

  // Left column refs
  const leftColRef = useRef(null);
  const ctaRef = useRef(null);
  const iconRef = useRef(null);
  const addressRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: leftColRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out', immediateRender: false },
      });

      // CTA
      tl.from(ctaRef.current, { autoAlpha: 0, y: 24, duration: 0.6 });
      tl.from(
        iconRef.current,
        { autoAlpha: 0, y: 8, rotate: -10, duration: 0.35 },
        '<0.05'
      );

      // Address lines
      const addressLines = gsap.utils.toArray(
        addressRef.current?.querySelectorAll('.line') || []
      );
      if (addressLines.length) {
        tl.from(
          addressLines,
          { autoAlpha: 0, x: -20, duration: 0.45, stagger: 0.1 },
          '-=0.15'
        );
      }

      // Email lines
      const emailLines = gsap.utils.toArray(
        emailRef.current?.querySelectorAll('.line') || []
      );
      if (emailLines.length) {
        tl.from(
          emailLines,
          { autoAlpha: 0, x: 20, duration: 0.45, stagger: 0.1 },
          '-=0.25'
        );
      }

      // Phone
      tl.from(
        phoneRef.current,
        { autoAlpha: 0, y: 14, duration: 0.45 },
        '-=0.2'
      );

      // Small bounce on the CTA icon once
      if (!prefersReduced && iconRef.current) {
        gsap.to(iconRef.current, {
          y: -2,
          repeat: 1,
          yoyo: true,
          duration: 0.6,
          ease: 'sine.inOut',
          delay: 0.2,
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top bottom',
            once: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div id="contact">
      <div className="contact-wrapper">
        {/* Left */}
        <div className="contact-left" ref={leftColRef}>
          <AnimatedHeading />

          <div className="contact-text">
            <a
              ref={ctaRef}
              className="contact-cta"
              href="https://link.foreverbooked.com/widget/booking/ec8dal2CrxqAOd9QwKc2"
              target="_blank"
              rel="noreferrer"
            >
              Book Your Free Strategy Session Now{' '}
              <FontAwesomeIcon
                ref={iconRef}
                className="contact-cta_icon"
                icon={faArrowUpRightFromSquare}
                style={{ fontSize: '10px' }}
              />
            </a>
          </div>

          <div className="contact-details">
            <div>
              <p ref={addressRef} className="contact-address">
                <span className="line">Phoenix, AZ</span>
                <span className="line">85003</span>
              </p>
            </div>

            <div>
              <a
                ref={emailRef}
                className="contact-email"
                href="mailto:hello@switchcasestudio.com"
              >
                <span className="line">hello</span>
                <span className="line">@switchcasestudio.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="contact-form">
          <ContactForm formRef={formRef} />
        </div>
      </div>
    </div>
  );
};

export default Contact;
