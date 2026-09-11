import Seo from '../util/Seo';
import JournalReader, { sortedPosts } from '../blog/JournalReader';

/* /blog opens the journal on the newest post (split reader). The Blog
   JSON-LD still lists every post for search engines. */
const posts = sortedPosts;

const BlogPage = () => (
  <>
      <Seo
        title="Blog | Switch Case Studio"
        description="Field notes on web design, development, AI, automation, and growth from Switch Case Studio: practical thinking from the team that builds and automates it."
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
    <JournalReader post={posts[0]} isIndex />
  </>
);

export default BlogPage;
