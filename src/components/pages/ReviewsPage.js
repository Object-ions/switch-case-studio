import Seo from '../util/Seo';
import { motion, useReducedMotion } from 'motion/react';
import testimonialsData from '../../data/testimonials.json';
import {
  headerVariants,
  lineVariant,
  containerVariants,
  cardVariants,
} from '../../utils/motionVariants';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/testimonialsPage.scss';

const ReviewsPage = () => {
  const reducedMotion = useReducedMotion();

  /* LC-34: variants must be nulled per element under reduced motion — the
   * parent's initial/whileInView labels still propagate to children, so an
   * unwrapped child variant animates regardless of the parent's variants. */
  const v = (variant) => (reducedMotion ? undefined : variant);

  return (
    <>
      <Seo
        title="Client Reviews — Switch Case Studio"
        description="See what clients say about Switch Case Studio — real results from real businesses we've helped grow."
        path="/testimonials"
      />

      <article className="testimonials-page" aria-label="Client reviews">
        <motion.header
          className="testimonials-page__header"
          variants={v(headerVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.p className="testimonials-page__kicker" variants={v(lineVariant)}>
            What clients say
          </motion.p>
          <motion.h1 className="testimonials-page__title" variants={v(lineVariant)}>
            Real words.
            <br />
            <span className="testimonials-page__title--accent">Real results.</span>
          </motion.h1>
          <motion.p className="testimonials-page__lede" variants={v(lineVariant)}>
            Every project is built around one goal — making our clients' businesses
            grow. Here's what they had to say.
          </motion.p>
        </motion.header>

        {/* Reveal on MOUNT — the grid is the primary content in the first
            viewport under a short header; a scroll `amount` threshold on this
            tall (single-column on mobile) section is never met on load and
            strands every card at opacity:0 until you scroll. See
            CaseStudiesPage grid for the full note. */}
        <motion.section
          className="testimonials-page__grid"
          aria-label="Client testimonials"
          variants={reducedMotion ? undefined : containerVariants}
          initial="hidden"
          animate="visible"
        >
          {testimonialsData.map((review) => (
            <motion.article
              key={review.id}
              className="testimonials-page__card"
              variants={reducedMotion ? undefined : cardVariants}
              whileHover={reducedMotion ? undefined : { y: -4, transition: { duration: 0.25 } }}
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
            </motion.article>
          ))}
        </motion.section>

        <motion.div
          className="testimonials-page__bottom"
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="testimonials-page__bottom-heading">
            Ready to be next?
          </h2>
          <p className="testimonials-page__bottom-body">
            Book a free call and let's talk about your project.
          </p>
          <BookCallCta className="testimonials-page__bottom-btn" />
        </motion.div>
      </article>
    </>
  );
};

export default ReviewsPage;
