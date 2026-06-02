# Switch Case Studio – React + Vite

Portfolio + marketing site for **Switch Case Studio**, a design-led digital
studio. React 18 with a component-driven UI, SCSS styling, and JSON-powered
content (projects, services, pricing, testimonials). Bundled with **Vite**.

---

## What’s inside

- **Marketing pages**: Home, Work/About, Services, Testimonials, Contact
- **Portfolio**: project tiles + detail pages powered by JSON + images under `public/projects/*`. Each case study leads with a frameless, auto-scrolling live-site preview.
- **UI components**: animated headings/paragraphs, marquee/scrolling text, lightbox, custom cursor, menu modal, a 3D moon (Three.js, lazy-loaded)
- **Content as data**: most copy lives in `src/data/*.json` — edit without touching components
- **Analytics**: GA4 with a Consent Mode v2 cookie banner (`src/analytics/`)
- **SEO**: per-page `<Helmet>` tags, `sitemap.xml`, structured data in `index.html`

---

## Tech stack

- **React 18** bundled with **Vite 5** (`@vitejs/plugin-react`)
- **SCSS** (global variables + mixins + per-component files)
- **Routing**: `react-router-dom` v6 + `react-router-hash-link`
- **Animation**: GSAP (+ ScrollTrigger), Three.js via `@react-three/fiber` + `@react-three/drei`, `motion`, `typed.js`
- **SEO**: `react-helmet-async`
- **Forms**: `@emailjs/browser` (contact form)
- **Icons**: Font Awesome
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
npm run dev      # (npm start is an alias)
```

- App runs at `http://localhost:3000` (opens automatically)
- Hot Module Replacement is enabled

### 3) Build for production

```bash
npm run build    # output → build/
npm run preview  # serve the production build locally to smoke-test
```

---

## Available scripts

- `npm run dev` / `npm start` – Vite dev server (port 3000)
- `npm run build` – production build to `build/`
- `npm run preview` – serve the built `build/` locally
- `postinstall` – writes a stub sourcemap for `@mediapipe/tasks-vision` (a
  transitive dependency of `@react-three/drei`) to silence a missing-sourcemap
  warning during build

There is no test runner or `eject` step (this is Vite, not Create React App).

---

## Project structure

```txt
index.html               # app entry (root-level, Vite)
vite.config.js           # Vite + React plugin + SCSS options
netlify.toml             # deploy config (SPA redirect, Node 20 pin)

public/                  # served as-is at the site root (/)
  images/                # static images
  projects/              # project images grouped by slug
  models/                # 3D assets (moon.glb)
  fonts/                 # NeueMachina-Ultrabold.otf
  manifest.json
  robots.txt
  sitemap.xml

src/
  index.js               # React root
  App.js                 # routes + layout, lazy-loaded route pages

  components/
    pages/               # route-level pages + home sections (Work, Services, ProjectPage…)
    layout/              # Header, MainLayout, Footer, menu
    ...                  # shared UI (ScrollingShot, ZoomLightbox, Moon, ClientStrip…)

  analytics/             # ga.js, RouteAnalytics.js, ConsentBanner.js
  hooks/                 # useReducedMotion, useScrollLock, useBento* 
  utils/                 # bentoEffects.js
  data/                  # navigation.js + content JSON
  styles/                # _variables.scss, _mixins.scss, app.scss, components/*
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
- `public/fonts/NeueMachina-Ultrabold.otf`

> Fonts live in `public/` on purpose: Vite does **not** rewrite `url()`
> references pulled in through a Sass `@import`, so the `@font-face` uses a
> root-absolute path (`/fonts/...`) rather than a bundled import.

### `src/assets/` assets (bundled by Vite)

Use when importing directly in a component:

- `src/assets/videos/*.mp4`, `*.webm`
- `src/assets/images/*`

---

## Performance notes

- **Three.js is lazy-loaded** — the 3D moon is split into its own chunk
  (`React.lazy`) so the ~490 KB engine stays off the critical path for every
  route and loads only when the Work section needs it.
- **`moon.glb` is texture-compressed** (1024² WebP) — keep it that way if you
  swap the model; a full-res texture balloons the asset to ~10 MB.
- Route pages are code-split via `React.lazy` + `<Suspense>` in `App.js`.
- New images: prefer `webp`/`avif`, keep cover tiles light.
- New animations: respect reduced motion (`src/hooks/useReducedMotion.js`).

---

## Deployment

Deployed on **Netlify**; config in `netlify.toml`:

- Build command `npm run build`, publish directory `build/`
- Node version pinned to **20**
- SPA fallback: all routes rewrite to `/index.html` (so deep links and refresh don’t 404)

The `build/` output is a static bundle and can be hosted on any static host
(Netlify, Vercel, Cloudflare Pages, Nginx/Apache) as long as SPA rewrites are
configured.

---

## Troubleshooting

### Blank page / 404 on deep links after deploy

- Ensure SPA rewrites to `index.html` (handled by `netlify.toml` on Netlify)
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
