import { useLayoutEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../../hooks/useReducedMotion';
import testimonialsData from '../../data/testimonials.json';
import '../../styles/components/testimonialsPage.scss';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsPage = () => {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.tp-reveal', rootRef.current).forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <>
      <Helmet>
        <title>Client Reviews — Switch Case Studio</title>
        <meta
          name="description"
          content="See what clients say about Switch Case Studio — real results from real businesses we've helped grow."
        />
        <link rel="canonical" href="https://switchcasestudio.com/testimonials" />
        <meta property="og:title" content="Client Reviews — Switch Case Studio" />
        <meta
          property="og:description"
          content="Real words from real clients. See how Switch Case Studio has helped businesses grow with design, development, and marketing."
        />
      </Helmet>

      <article className="testimonials-page" ref={rootRef} aria-label="Client reviews">
        {/* ── Header ── */}
        <header className="testimonials-page__header">
          <p className="testimonials-page__kicker tp-reveal">What clients say</p>
          <h1 className="testimonials-page__title tp-reveal">
            Real words.
            <br />
            <span className="testimonials-page__title--accent">Real results.</span>
          </h1>
          <p className="testimonials-page__lede tp-reveal">
            Every project is built around one goal — making our clients' businesses
            grow. Here's what they had to say.
          </p>
        </header>

        {/* ── Review grid ── */}
        <section className="testimonials-page__grid" aria-label="Client testimonials">
          {testimonialsData.map((review) => (
            <article
              key={review.id}
              className="testimonials-page__card tp-reveal"
              aria-label={`Review by ${review.name}`}
            >
              <div className="testimonials-page__card-top">
                <img
                  src={review.image}
                  alt={review.name}
                  className="testimonials-page__card-img"
                  loading="lazy"
                  width="56"
                  height="56"
                />
                <div className="testimonials-page__card-meta">
                  <p className="testimonials-page__card-name">{review.name}</p>
                  <p className="testimonials-page__card-title">{review.title}</p>
                </div>
              </div>

              <blockquote className="testimonials-page__card-highlight">
                &ldquo;{review.highlight}&rdquo;
              </blockquote>

              <p className="testimonials-page__card-body">{review.testimonial}</p>
            </article>
          ))}
        </section>

        {/* ── Bottom CTA ── */}
        <div className="testimonials-page__bottom tp-reveal">
          <h2 className="testimonials-page__bottom-heading">
            Ready to be next?
          </h2>
          <p className="testimonials-page__bottom-body">
            Book a free call and let's talk about your project.
          </p>
          <a
            href="https://calendar.app.google/83UCJjis2FHUrr1s6"
            target="_blank"
            rel="noopener noreferrer"
            className="testimonials-page__bottom-btn"
          >
            Book a Free Call
          </a>
        </div>
      </article>
    </>
  );
};

export default TestimonialsPage;
