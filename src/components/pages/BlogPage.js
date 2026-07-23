import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../util/Seo';
import { motion, useReducedMotion } from 'motion/react';
import postsData from '../../data/posts.json';
import usePageHeaderReveal from '../../hooks/usePageHeaderReveal';
import {
  containerVariants,
  cardVariants,
} from '../../utils/motionVariants';
import BookCallCta from '../ui/BookCallCta';
import '../../styles/components/blogPage.scss';

const MotionLink = motion.create(Link);

/* Newest first — the data file is author-ordered, but the page is date-ordered
   so an automation (Beau via n8n) can append a post anywhere and it still
   lands in the right slot. */
const posts = [...postsData].sort((a, b) => (a.date < b.date ? 1 : -1));

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const BlogPage = () => {
  const reduced = useReducedMotion();
  const v = (variant) => (reduced ? undefined : variant);
  /* LC-26d: header is GSAP-revealed (static HTML ships visible) — see
   * usePageHeaderReveal. motion still owns the grid + CTA below. */
  const headerRef = useRef(null);
  usePageHeaderReveal(headerRef);

  return (
    <>
      <Seo
        title="Blog — Switch Case Studio"
        description="Field notes on web design, development, branding, and growth from Switch Case Studio — practical thinking from the team that builds sites from scratch."
        path="/blog"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Switch Case Studio Blog',
          url: 'https://switchcasestudio.com/blog',
          description:
            'Field notes on web design, development, branding, and growth.',
          publisher: {
            '@type': 'Organization',
            name: 'Switch Case Studio',
            url: 'https://switchcasestudio.com',
          },
          blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `https://switchcasestudio.com/blog/${p.slug}`,
            datePublished: p.date,
            author: { '@type': 'Person', name: p.author || 'Switch Case Studio' },
          })),
        }}
      />

      <article className="blog-page" aria-label="Blog">
        {/* ── Header ── */}
        <header className="blog-page__header" ref={headerRef}>
          <p className="blog-page__kicker page-head-animate">
            Field Notes
          </p>
          <h1 className="blog-page__title page-head-animate">
            The Studio Journal
          </h1>
          <p className="blog-page__lede page-head-animate">
            Practical thinking on design, development, branding, and growth —
            from the team that builds from scratch.
          </p>
        </header>

        {/* ── Grid ── */}
        <motion.section
          className="blog-page__grid"
          aria-label="Blog posts"
          variants={v(containerVariants)}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <MotionLink
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="blog-page__card"
              aria-label={`Read: ${post.title}`}
              variants={v(cardVariants)}
              whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.25 } }}
              whileTap={reduced ? undefined : { scale: 0.97, transition: { duration: 0.15 } }}
            >
              <div className="blog-page__card-img">
                {post.category && (
                  <span className="blog-page__card-badge">{post.category}</span>
                )}
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.imageAlt || post.title}
                    loading="lazy"
                  />
                ) : (
                  /* No image? A branded gradient stands in — automation-
                     generated posts don't always ship art, and an empty box
                     reads as broken. */
                  <span
                    className="blog-page__card-fallback"
                    aria-hidden="true"
                  >
                    <span className="blog-page__card-fallback-mark">
                      {(post.category || 'SCS').charAt(0)}
                    </span>
                  </span>
                )}
              </div>
              <div className="blog-page__card-body">
                <div className="blog-page__card-meta">
                  {post.date && (
                    <span className="blog-page__card-date">
                      {formatDate(post.date)}
                    </span>
                  )}
                  {post.readingTime && (
                    <span className="blog-page__card-read">
                      {post.readingTime}
                    </span>
                  )}
                </div>
                <h2 className="blog-page__card-title">{post.title}</h2>
                {post.excerpt && (
                  <p className="blog-page__card-sub">{post.excerpt}</p>
                )}
                {post.tags?.length > 0 && (
                  <ul className="blog-page__card-tags" aria-label="Topics">
                    {post.tags.slice(0, 3).map((t) => (
                      <li key={t} className="blog-page__card-tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <span className="blog-page__card-cta" aria-hidden="true">
                  Read article →
                </span>
              </div>
            </MotionLink>
          ))}
        </motion.section>

        {/* ── Bottom CTA ── */}
        <motion.div
          className="blog-page__bottom"
          variants={v(cardVariants)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="blog-page__bottom-text">
            Like how we think? Let's build something together.
          </p>
          <BookCallCta className="blog-page__bottom-btn" />
        </motion.div>
      </article>
    </>
  );
};

export default BlogPage;
