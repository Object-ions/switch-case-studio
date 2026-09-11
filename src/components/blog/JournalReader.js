import { Link } from 'react-router-dom';
import postsData from '../../data/posts.json';
import BookCallCta from '../ui/BookCallCta';
import { Block, formatDate } from './blogBlocks';
import '../../styles/components/journal.scss';

/* The Studio Journal as a split reader (owner, 2026-09-11, after a
   "selected works" index reference): the left third is the post list
   (title + date, the open post highlighted) with the open post's details
   under it; the right two-thirds is the article itself. /blog opens the
   newest post; /blog/:slug opens that post. Each post keeps its own URL.

   Heading levels: on /blog the journal title is the page h1 and the article
   title an h2; on a post page the article title is the h1. Body headings
   are h2 either way, so no level is ever skipped. */

// Newest first: the data file is author-ordered, the journal is date-ordered.
export const sortedPosts = [...postsData].sort((a, b) => (a.date < b.date ? 1 : -1));

const shortDate = (iso) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const JournalReader = ({ post, isIndex = false }) => {
  const idx = sortedPosts.findIndex((p) => p.slug === post.slug);
  const nextPost = sortedPosts[(idx + 1) % sortedPosts.length];
  const TitleTag = isIndex ? 'h2' : 'h1';
  const JournalTag = isIndex ? 'h1' : 'p';
  const {
    title,
    excerpt,
    category,
    author,
    authorRole,
    date,
    readingTime,
    tags = [],
    body = [],
  } = post;

  return (
    <div className="journal">
      <aside className="journal__side" aria-label="The Studio Journal">
        <JournalTag className="journal__name">
          <Link to="/blog">The Studio Journal</Link>
        </JournalTag>

        <ol className="journal__list" aria-label="All articles">
          {sortedPosts.map((p) => {
            const active = p.slug === post.slug;
            return (
              <li key={p.slug}>
                <Link
                  to={`/blog/${p.slug}`}
                  className={`journal__item${active ? ' is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="journal__item-title">{p.title}</span>
                  <span className="journal__item-date">{shortDate(p.date)}</span>
                </Link>
              </li>
            );
          })}
        </ol>

        <dl className="journal__details" aria-label="About this article">
          {category && (
            <div>
              <dt>Category</dt>
              <dd>{category}</dd>
            </div>
          )}
          {date && (
            <div>
              <dt>Published</dt>
              <dd>{formatDate(date)}</dd>
            </div>
          )}
          {readingTime && (
            <div>
              <dt>Reading</dt>
              <dd>{readingTime}</dd>
            </div>
          )}
          {author && (
            <div>
              <dt>Author</dt>
              <dd>
                {author}
                {authorRole ? `, ${authorRole}` : ''}
              </dd>
            </div>
          )}
          {tags.length > 0 && (
            <div>
              <dt>Topics</dt>
              <dd>{tags.join(', ')}</dd>
            </div>
          )}
        </dl>
      </aside>

      <article className="journal__article" aria-labelledby="journal-article-title">
        <header className="journal__head">
          <TitleTag id="journal-article-title" className="journal__title">
            {title}
          </TitleTag>
          {excerpt && <p className="journal__lede">{excerpt}</p>}
        </header>

        <div className="journal__body">
          {body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <footer className="journal__foot">
          <p className="journal__cta-line">Like how we think? Let's build something together.</p>
          <BookCallCta className="journal__cta" />
          {nextPost && nextPost.slug !== post.slug && (
            <Link to={`/blog/${nextPost.slug}`} className="journal__next">
              <span className="journal__next-label">Next article</span>
              <span className="journal__next-title">{nextPost.title} &rarr;</span>
            </Link>
          )}
        </footer>
      </article>
    </div>
  );
};

export default JournalReader;
