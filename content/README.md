# Blog content queue

- `scheduled/YYYY-MM-DD-slug.json`: published automatically on that date (07:00 Pacific) by `.github/workflows/scheduled-posts.yml`, using `scripts/add-post.mjs`. Netlify deploys the resulting push.
- `held/`: waits for an outside event (for example WordPress.org approval). Move it into `scheduled/` with a dated filename when it is ready.
- `published/`: posts the scheduler has already inserted into `src/data/posts.json`. Kept as a record.
- `SOCIAL-KIT.md`: the social copy for each post, for Beau.

Post files follow the contract at the top of `scripts/add-post.mjs`. Check one with `node scripts/add-post.mjs <file> --dry-run`.
