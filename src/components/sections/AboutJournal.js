import { Link } from 'react-router-dom';
import posts from '../../data/posts.json';

/* The About block's second column (owner, 2026-09-12): the newest journal
   post, a piece of it, and a way into the blog. posts.json is kept
   newest-first by scripts/add-post.mjs, so [0] is the latest post and
   this column updates itself with every publish. Static on purpose: it
   renders in the SSG HTML and has no reveal that could leave it hidden. */
const AboutJournal = () => {
  const post = posts[0];
  if (!post) return null;

  return (
    <aside className="work-journal" aria-labelledby="work-journal-title">
      <p className="work-journal__kicker">From the journal</p>
      <h3 id="work-journal-title" className="work-journal__title">
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="work-journal__excerpt">{post.excerpt}</p>
      <div className="work-journal__links">
        <Link to={`/blog/${post.slug}`} className="work-journal__read">
          Read the post →
        </Link>
        <Link to="/blog" className="work-journal__all">
          All posts
        </Link>
      </div>
    </aside>
  );
};

export default AboutJournal;
