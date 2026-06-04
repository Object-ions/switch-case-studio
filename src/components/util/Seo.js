import { Helmet } from 'react-helmet-async';

const SITE = 'https://switchcasestudio.com';
const DEFAULT_IMAGE = `${SITE}/images/og/og.png`;

/**
 * Per-route head tags — one of these must render on EVERY route.
 *
 * Why: index.html can't vary per route in a SPA, and react-helmet-async only
 * manages tags it creates. So route-variable tags (title, description,
 * canonical, og:*) live here exclusively; index.html keeps only site-wide
 * constants. A route without <Seo> would leak the previous route's title and
 * ship no canonical at all.
 *
 * `path` is the route path ("/about"), used for both canonical and og:url —
 * always the bare non-www domain, matching the sitemap.
 */
const Seo = ({
  title,
  description,
  path,
  ogType = 'website',
  image,
  imageAlt,
  jsonLd,
}) => {
  const url = `${SITE}${path}`;
  const img = image
    ? image.startsWith('http')
      ? image
      : `${SITE}${image}`
    : DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
