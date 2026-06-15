# Switch Case Studio – React + Vite SSG

Portfolio + marketing site for **Switch Case Studio**, a design-led digital
studio. React 18 with a component-driven UI, SCSS styling, and JSON-powered
content (projects, services, pricing, testimonials). Built with **Vite 5** and
prerendered to static HTML at build time via **vite-react-ssg** — every route
ships as a real HTML file (no empty SPA shell), then hydrates to a full SPA.

---

## What’s inside

- **Marketing pages**: Home, Work/About, Services, Testimonials, Contact
- **Portfolio**: project tiles + detail pages powered by JSON + images under `public/projects/*`. Each case study leads with a frameless, auto-scrolling live-site preview.
- **UI components**: animated headings/paragraphs, marquee/scrolling text, lightbox, custom cursor, menu modal, a 3D moon (Three.js, lazy-loaded)
- **Content as data**: most copy lives in `src/data/*.json` — edit without touching components
- **Analytics**: GA4 with a Consent Mode v2 cookie banner (`src/analytics/`)
- **SEO**: per-route head tags baked into each static HTML file via
  `src/components/util/Seo.js`, an auto-generated `sitemap.xml`, and per-page
  JSON-LD structured data (`index.html` holds only the site-wide
  Organization/WebSite JSON-LD)

---

## Tech stack

- **React 18** built with **Vite 5** (`@vitejs/plugin-react`) and prerendered by **vite-react-ssg**
- **SCSS** (global variables + mixins + per-component files)
- **Routing**: `react-router-dom` v6 + `react-router-hash-link` (route table in `src/routes.js`)
- **Animation**: GSAP (+ ScrollTrigger), Three.js via `@react-three/fiber` + `@react-three/drei`, `motion`, `typed.js`
- **SEO**: vite-react-ssg's `Head` (react-helmet-async under the hood) — see `src/components/util/Seo.js`
- **Forms**: `@emailjs/browser` (contact form)
- **Icons**: Font Awesome; hover cards via `@radix-ui/react-hover-card`
- **JSON data layer** for content (`src/data`)

> JSX lives in `.js` files (not `.jsx`). `vite.config.js` configures esbuild to
> treat `src/**/*.js` as JSX, so files don’t need renaming. The package manager
> is **npm** (`package-lock.json` is committed).

---

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Run the dev server

```bash
npm run dev      # vite-react-ssg dev — dev server with SSG-aware routing
npm start        # plain `vite` — SPA dev server (no SSG), occasionally handy
```

- App runs at `http://localhost:3000` (opens automatically)
- Hot Module Replacement is enabled
- Use `npm run dev` by default; it matches how production prerenders routes

### 3) Build for production

```bash
npm run build    # output → build/
npm run preview  # serve the production build locally to smoke-test
```

---

## Available scripts

- `npm run dev` – `vite-react-ssg dev` SSG-aware dev server (port 3000)
- `npm start` – plain `vite` SPA dev server (port 3000)
- `npm run build` – `vite-react-ssg build`: prerenders every route to a static
  HTML file in `build/`
- `prebuild` – runs `scripts/generate-sitemap.mjs` automatically before each
  build, regenerating `public/sitemap.xml` from `projects.json` / `services.json`
  (**don't hand-edit `sitemap.xml`** — it's overwritten)
- `npm run preview` – serve the built `build/` locally
- `postinstall` – writes a stub sourcemap for `@mediapipe/tasks-vision` (a
  transitive dependency of `@react-three/drei`) to silence a missing-sourcemap
  warning during build

There is no test runner or `eject` step (this is Vite, not Create React App).

---

## Project structure

```txt
index.html               # HTML template (site-wide head: favicons, fonts, Org/WebSite JSON-LD)
vite.config.js           # Vite + React plugin + SCSS options + SSR settings
netlify.toml             # deploy config (one HTML file per route, Node 20 pin — no SPA catch-all)
scripts/                 # generate-sitemap.mjs (prebuild), fix_font.py
fonts-src/               # source display OTF (build input, NOT deployed)

public/                  # served as-is at the site root (/)
  images/                # static images
  projects/              # project images grouped by slug
  models/                # 3D assets (moon.glb)
  fonts/                 # self-hosted woff2: SCS-Display-v3, Inter-300…800, RobotoFlex
  robots.txt
  sitemap.xml            # auto-generated at prebuild — do not hand-edit

src/
  index.js               # React root
  routes.js              # route table + layout (lazy-loaded route pages, getStaticPaths)

  components/
    pages/               # route-level pages (About, Services, ProjectPage, PricingPage…)
    sections/            # home-page sections (CaseStudyTiles, ClientStrip, LandingPageProof…)
    layout/              # Header, MainLayout, Footer, menu
    ui/                  # shared UI widgets (Moon, ZoomLightbox, TextPressure…)
    util/                # Seo, ScrollToTop, ScrollTriggerRefresher

  analytics/             # ga.js, RouteAnalytics.js, ConsentBanner.js
  hooks/                 # useReducedMotion, useScrollLock, useIsomorphicLayoutEffect, useBento*
  utils/                 # bentoEffects.js, motionVariants.js
  data/                  # navigation.js + content JSON (projects, services, pricing, testimonials, team)
  styles/                # _variables.scss, _mixins.scss, app.scss (incl. @font-face), components/*
  assets/                # images, videos (imported + bundled by Vite)
```

---

## Content editing

Most site content is stored as JSON so you can update the site quickly.

### Projects

- **Data**: `src/data/projects.json`
- **Images**: `public/projects/<project-slug>/...` (cover tiles, `long.webp`, detail images)

If you add a new project:

1. Create a new folder under `public/projects/<new-slug>/`
2. Add its images (`*-cover-tile.webp`, `long.webp`, etc.)
3. Add an entry in `src/data/projects.json` that references those paths
4. Set its `type` and `badge` (see **Project types** below)

#### Project types

Each project carries a `type` (canonical category) and a `badge` (the label
shown on the project card + detail page). They currently mirror each other.

| Type | What it means | Example projects |
|------|---------------|------------------|
| **Landing Page** | Single-purpose conversion page | Florida Energy Assistance |
| **E-Commerce** | Online store / checkout | Prodani Miami (Shopify) |
| **Business Website** | Multi-page company / brand site | Jo Marketing 11, Zahav Medspa, Crimson Equities |
| **Portfolio Site** | Showcase / creative studio site | Sha Design Studio |
| **Web App** | Full-stack application + API | Jelly Belly Wiki |
| **Interactive Experience** | Creative / experiential build | Birth of Venus |

Set `type` to one of the above, and `badge` to match (unless you want a
different display label on the card).

#### Optional project media (bento tiles)

The detail page renders extra media tiles only when the field is present —
missing fields are simply omitted (no empty placeholders). Optional fields:
`mediaMobile`, `mediaCopy`, `mediaCta` (each with an optional `*Alt`).

### Other content

- Services: `src/data/services.json`
- Testimonials: `src/data/testimonials.json`
- Pricing: `src/data/pricingData.json`
- Team: `src/data/team.json`
- Navigation: `src/data/navigation.js`

---

## Styling

Styling is SCSS-based:

- Global tokens: `src/styles/_variables.scss`, `src/styles/_mixins.scss`
- App-level stylesheet: `src/styles/app.scss`
- Component styles: `src/styles/components/*.scss`

Conventions:

- Put global variables/mixins in the shared files
- Keep component-specific styling in its matching SCSS file (names align with components)
- Stylesheets still use `@import`; the build silences the related Sass deprecation warnings (see `vite.config.js`)

---

## Assets

### `public/` assets (served as-is)

Stable URLs, no bundling. Reference with a leading `/`:

- `public/projects/...`, `public/images/...`
- `public/models/moon.glb`
- `public/fonts/*.woff2` (SCS Display, Inter, Roboto Flex)

> Fonts live in `public/` on purpose: Vite does **not** rewrite `url()`
> references pulled in through a Sass `@import`, so the `@font-face` (declared
> in `app.scss`) uses a root-absolute path (`/fonts/...`) rather than a bundled
> import. The unsubsetted source display OTF lives in `fonts-src/` and is a
> build input only — it is **not** shipped in `public/`.

### `src/assets/` assets (bundled by Vite)

Use when importing directly in a component:

- `src/assets/videos/*.webm`
- `src/assets/images/*`

---

## Performance notes

- **The 3D moon (~990 KB chunk) is IntersectionObserver-gated**, not just
  `React.lazy`. `React.lazy` code-splits but does **not** defer — rendering a
  lazy component fires its import at hydration. The Moon's import is gated behind
  an IO (`rootMargin ~200px`) with a fixed-size CSS slot, so the Three.js engine
  stays off the critical path until the Work section is approached. See `About.js`
  / the `MoonSlot` pattern.
- **`moon.glb` is texture-compressed** (1024² WebP) — keep it that way if you
  swap the model; a full-res texture balloons the asset to ~10 MB.
- Route pages are code-split via `React.lazy` + `<Suspense>` in `src/routes.js`.
- Below-fold heavies (Moon, TextPressure's Roboto Flex) are lazy-mounted so their
  bytes never enter the initial critical path; analytics (gtag.js) is deferred to
  idle. New decorative heavies should follow the same gate.
- New images: prefer `webp`/`avif`, keep cover tiles light.
- New animations: respect reduced motion (`src/hooks/useReducedMotion.js`).

---

## Deployment

Deployed on **Netlify**; config in `netlify.toml`:

- Build command `npm run build`, publish directory `build/`
- Node version pinned to **20**
- **No SPA catch-all.** Since the SSG migration the build emits one real HTML
  file per route (`build/about.html`, `build/projects/<slug>.html`, …), so deep
  links and refreshes resolve to real files. Unmatched paths get `build/404.html`
  with a genuine 404 status. (The old `/* → /index.html 200` rewrite was removed
  — it masked missing assets as 200-HTML.)

The `build/` output is a fully prerendered static site and can be hosted on any
static host (Netlify, Vercel, Cloudflare Pages, Nginx/Apache). Do **not** add an
SPA catch-all rewrite — it would mask real 404s.

---

## Troubleshooting

### Blank page / 404 on deep links after deploy

- Confirm the route emits its own HTML file in `build/` (`npm run build` then
  check `build/<route>.html`) — every route should be a prerendered file
- Don't add an SPA `/* → /index.html` rewrite; it hides genuinely missing pages
- Check asset paths if you changed the base path

### Styles not updating

- Confirm the component SCSS is imported (directly or via `app.scss`)
- Watch filename casing — Linux hosts are case-sensitive where macOS isn’t

### Images / fonts not loading

- Anything under `public/` is referenced with a leading `/` (e.g. `/projects/zahav/1.avif`)
- Double-check folder/filename casing

---

## Working notes for AI assistance

Living instructions and accumulated review fixes are in
[`CLAUDE.md`](./CLAUDE.md). Audit/status tracking is in `.audit/summary.md`.

---

## Contributing

This is a studio site codebase. If you’re collaborating:

1. Create a branch from `main`
2. Keep changes small and scoped (one feature/fix per PR)
3. Prefer editing JSON content in `src/data/` when possible

---

## License

All rights reserved, unless an open-source license is explicitly added.

---

## Credits

Built and maintained by Moses Atia Poston at **Switch Case Studio**.
