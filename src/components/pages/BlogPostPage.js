import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Seo from '../util/Seo';
import postsData from '../../data/posts.json';
import '../../styles/components/blogPostPage.scss';

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

/* Turn a YouTube watch/share/embed URL into an embeddable /embed/<id> URL.
   Returns null if it isn't a YouTube URL we recognize. */
const youTubeEmbed = (url) => {
  if (!url) return null;
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
};

/* Render one body block. The block vocabulary is intentionally small so an
   automation (Beau via n8n) can emit posts as plain JSON:
   { type: 'paragraph' | 'heading' | 'list' | 'quote' | 'video', ... }.
   Unknown types are ignored rather than crashing the page. */
const Block = ({ block }) => {
  switch (block.type) {
    case 'heading':
      return <h2 className="blog-post__h2">{block.text}</h2>;
    case 'video': {
      const embed = youTubeEmbed(block.url);
      if (!embed) return null;
      return (
        <figure className="blog-post__video">
          <div className="blog-post__video-frame">
            <iframe
              src={embed}
              title={block.title || 'Embedded video'}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          {block.caption && (
            <figcaption className="blog-post__video-caption">{block.caption}</figcaption>
          )}
        </figure>
      );
    }
    case 'paragraph':
      return <p className="blog-post__p">{block.text}</p>;
    case 'list':
      return (
        <ul className="blog-post__list">
          {(block.items || []).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case 'download': {
      if (!block.url || !block.label) return null;
      // Root-absolute path to a file in public/. The download attribute is what
      // ga.js's delegated listener matches on to fire file_download, so it is
      // load-bearing, not cosmetic.
      return (
        <a className="blog-post__download" href={block.url} download>
          <span className="blog-post__download-label">{block.label}</span>
          {block.note && <span className="blog-post__download-note">{block.note}</span>}
        </a>
      );
    }
    case 'quote':
      return (
        <blockquote className="blog-post__quote">
          <p>{block.text}</p>
          {block.cite && <cite>{block.cite}</cite>}
        </blockquote>
      );
    default:
      return null;
  }
};

const BlogPostPage = () => {
  const { slug } = useParams();

  const { post, nextPost } = useMemo(() => {
    // Match the list order (newest first) so "next" is chronological.
    const sorted = [...postsData].sort((a, b) => (a.date < b.date ? 1 : -1));
    const idx = sorted.findIndex((p) => p.slug === slug);
    if (idx === -1) return { post: null, nextPost: null };
    return {
      post: sorted[idx],
      nextPost: sorted[(idx + 1) % sorted.length],
    };
  }, [slug]);

  if (!post) return <Navigate to="/blog" replace />;

  const {
    title,
    excerpt,
    category,
    author,
    authorRole,
    date,
    readingTime,
    coverImage,
    imageAlt,
    tags = [],
    body = [],
  } = post;

  const metaDescription =
    excerpt || `${title}, from the Switch Case Studio blog.`;

  return (
    <>
      <Seo
        title={`${title} | Switch Case Studio`}
        description={metaDescription}
        path={`/blog/${slug}`}
        ogType="article"
        image={coverImage || undefined}
        imageAlt={imageAlt || title}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            url: `https://switchcasestudio.com/blog/${slug}`,
            description: metaDescription,
            ...(date ? { datePublished: date, dateModified: date } : {}),
            ...(coverImage
              ? { image: `https://switchcasestudio.com${coverImage}` }
              : {}),
            author: {
              '@type': 'Person',
              name: author || 'Switch Case Studio',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Switch Case Studio',
              url: 'https://switchcasestudio.com',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://switchcasestudio.com/blog/${slug}`,
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Blog',
                item: 'https://switchcasestudio.com/blog',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: title,
                item: `https://switchcasestudio.com/blog/${slug}`,
              },
            ],
          },
        ]}
      />

      <article className="blog-post" aria-labelledby="blog-post-title">
        {/* ── Top bar ── */}
        <nav className="blog-post__topbar" aria-label="Blog navigation">
          <Link to="/blog" className="blog-post__back" aria-label="Back to blog">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            <span>Back to Journal</span>
          </Link>
        </nav>

        {/* ── Header ── */}
        <header className="blog-post__header">
          {category && <p className="blog-post__kicker">{category}</p>}
          <h1 id="blog-post-title" className="blog-post__title">
            {title}
          </h1>
          {excerpt && <p className="blog-post__lede">{excerpt}</p>}

          <div className="blog-post__byline">
            {author && (
              <span className="blog-post__author">
                By {author}
                {authorRole && (
                  <span className="blog-post__author-role"> · {authorRole}</span>
                )}
              </span>
            )}
            <span className="blog-post__byline-meta">
              {date && <span>{formatDate(date)}</span>}
              {readingTime && <span>{readingTime}</span>}
            </span>
          </div>
        </header>

        {/* ── Cover (optional) ── */}
        {coverImage && (
          <figure className="blog-post__cover">
            <img src={coverImage} alt={imageAlt || title} />
          </figure>
        )}

        {/* ── Body ── */}
        <div className="blog-post__body">
          {body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        {/* ── Tags ── */}
        {tags.length > 0 && (
          <ul className="blog-post__tags" aria-label="Topics">
            {tags.map((t) => (
              <li key={t} className="blog-post__tag">
                {t}
              </li>
            ))}
          </ul>
        )}

        {/* ── Next post ── */}
        {nextPost && nextPost.slug !== slug && (
          <nav className="blog-post__next" aria-label="Next article">
            <Link to={`/blog/${nextPost.slug}`} className="blog-post__next-link">
              <span className="blog-post__next-label">Next article</span>
              <span className="blog-post__next-title">
                {nextPost.title}
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </span>
            </Link>
          </nav>
        )}
      </article>
    </>
  );
};

export default BlogPostPage;
