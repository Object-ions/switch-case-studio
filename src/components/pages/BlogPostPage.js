import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Seo from '../util/Seo';
import postsData from '../../data/posts.json';
import JournalReader from '../blog/JournalReader';

const BlogPostPage = () => {
  const { slug } = useParams();

  const post = useMemo(() => postsData.find((p) => p.slug === slug) || null, [slug]);

  if (!post) return <Navigate to="/blog" replace />;

  const { title, excerpt, author, date, coverImage, imageAlt } = post;

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

      <JournalReader post={post} />
    </>
  );
};

export default BlogPostPage;
