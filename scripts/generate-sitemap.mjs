/**
 * Regenerates public/sitemap.xml from the same data files that define the
 * routes (src/data/projects.json, src/data/services.json), so the sitemap can
 * never drift from what's actually routable. Runs automatically before
 * `npm run build` (see package.json "prebuild").
 *
 * lastmod = the data/source's last git commit date when available, else today.
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://switchcasestudio.com';

const projects = JSON.parse(
  readFileSync(resolve(root, 'src/data/projects.json'), 'utf8'),
);
const services = JSON.parse(
  readFileSync(resolve(root, 'src/data/services.json'), 'utf8'),
);
const posts = JSON.parse(
  readFileSync(resolve(root, 'src/data/posts.json'), 'utf8'),
);

/** Last commit date (YYYY-MM-DD) of a file, falling back to today. */
const lastmodOf = (file) => {
  try {
    const out = execSync(`git log -1 --format=%cs -- "${file}"`, {
      cwd: root,
      encoding: 'utf8',
    }).trim();
    if (out) return out;
  } catch {
    /* not a git checkout (e.g. CI tarball) — fall through */
  }
  return new Date().toISOString().slice(0, 10);
};

const projectsMod = lastmodOf('src/data/projects.json');
const postsMod = lastmodOf('src/data/posts.json');
const servicesMod = lastmodOf('src/data/pricingData.json');
const siteMod = lastmodOf('src'); // any source change touches the static pages

// NOTE: hidden routes are deliberately NOT listed here — /30-off (promo) and
// the agency-wholesale page (served from an unguessable /p/wm-… slug) are
// noindex and linked only from emails/ads, so they must stay out of the
// sitemap. Adding a PUBLIC page? Add its loc below.
const urls = [
  { loc: '/', lastmod: siteMod, priority: '1.0' },
  { loc: '/about', lastmod: siteMod, priority: '0.8' },
  { loc: '/services', lastmod: siteMod, priority: '0.8' },
  { loc: '/agents', lastmod: lastmodOf('src/data/agents.json'), priority: '0.8' },
  { loc: '/projects', lastmod: projectsMod, priority: '0.8' },
  { loc: '/pricing', lastmod: servicesMod, priority: '0.8' },
  { loc: '/testimonials', lastmod: siteMod, priority: '0.7' },
  { loc: '/contact', lastmod: siteMod, priority: '0.7' },
  { loc: '/blog', lastmod: postsMod, priority: '0.7' },
  ...posts.map((p) => ({
    loc: `/blog/${p.slug}`,
    lastmod: p.date || postsMod,
    priority: '0.6',
  })),
  ...services.map((s) => ({
    loc: `/pricing/${s.slug}`,
    lastmod: servicesMod,
    priority: '0.6',
  })),
  ...projects.map((p) => ({
    loc: `/projects/${p.slug}`,
    lastmod: projectsMod,
    priority: '0.6',
  })),
  { loc: '/privacy', lastmod: siteMod, priority: '0.3' },
  { loc: '/terms', lastmod: siteMod, priority: '0.3' },
  { loc: '/accessibility', lastmod: siteMod, priority: '0.3' },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
console.log(`sitemap.xml: ${urls.length} URLs written`);
