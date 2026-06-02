# Switch Case Studio – React Web App

Portfolio + marketing site for **Switch Case Studio**. This is a Create React App project with a component-driven UI, SCSS styling, and JSON-powered content (projects, services, pricing, testimonials).

---

## What’s inside

- **Marketing pages**: Home, Work, Services, About, Testimonials, Contact
- **Portfolio/projects**: tiles + detail views powered by JSON + images under `public/projects/*`
- **UI components**: animated headings/paragraphs, marquee/scrolling text, loader, lightbox, custom cursor, menu modal
- **Content as data**: update most copy/content in `src/data/*.json` without touching components
- **Media**: videos, lottie animations, fonts, images, and a 3D model (`moon.glb`)

---

## Tech stack

- **React (Create React App)**
- **SCSS** (global variables + mixins + component SCSS files)
- **JSON data layer** for content (`src/data`)
- **Static assets** served from `public/` and bundled assets from `src/assets/`

> Note: This repo includes `package-lock.json`, so the default package manager is **npm**.

---

## Getting started

### 1) Install dependencies

```bash
npm install
```

### 2) Run the dev server

```bash
npm start
```

- App runs at `http://localhost:3000`
- Hot reload is enabled

### 3) Build for production

```bash
npm run build
```

Build output is generated in `build/`.

---

## Available scripts

These are the standard CRA scripts (plus anything you may have added in `package.json`):

- `npm start` – run locally in development
- `npm run build` – production build
- `npm test` – run tests in watch mode
- `npm run eject` – eject CRA config (one-way)

---

## Project structure

High-level layout (based on the repo tree you shared):

```txt
public/
  index.html
  images/                 # static images (e.g., dani, sean, ori)
  projects/               # project images grouped by project
  models/                 # 3D assets (moon.glb)
  manifest.json
  robots.txt

src/
  index.js
  App.js
  reportWebVitals.js
  setupTests.js

  components/
    pages/                # route-level pages (Home, Work, Services, etc.)
    layout/               # Header, MainLayout, Footer, CTAs
    ...                   # shared UI components

  data/
    navigation.js
    projects.json
    services.json
    testimonials.json
    pricingData.json

  styles/
    _variables.scss
    _mixins.scss
    app.scss
    components/           # per-component scss files

  assets/
    images/
    videos/
    lottie/
    fonts/
    mockups/
```

---

## Content editing

Most site content is intentionally stored as JSON so you can update the site quickly.

### Projects

- **Data**: `src/data/projects.json`
- **Images**: `public/projects/<project-slug>/...`  
  Includes cover tiles and long/hero images like:
  - `public/projects/zahav/zahav-cover-tile.webp`
  - `public/projects/zahav/long.webp`

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

### Services

- `src/data/services.json`

### Testimonials

- `src/data/testimonials.json`

### Pricing

- `src/data/pricingData.json`

### Navigation

- `src/data/navigation.js`

---

## Styling

Styling is SCSS-based:

- Global tokens:
  - `src/styles/_variables.scss`
  - `src/styles/_mixins.scss`
- App-level stylesheet:
  - `src/styles/app.scss`
- Component styles:
  - `src/styles/components/*.scss`

Best practice in this repo:

- Put global variables/mixins in the shared files
- Keep component-specific styling inside its matching SCSS file
- Prefer consistent naming between component file and SCSS file (many are already aligned)

---

## Assets

There are two main asset patterns here:

### `public/` assets (served as-is)

Use when you want stable URLs and don’t need bundling:

- `public/projects/...`
- `public/images/...`
- `public/models/moon.glb`

### `src/assets/` assets (bundled by build)

Use when importing directly in React:

- `src/assets/videos/new_hero_video_SCS.mp4`
- `src/assets/lottie/*.json`
- `src/assets/fonts/NeueMachina-Ultrabold.otf`

---

## Performance + quality notes

- Consider running Lighthouse on production builds for best signal.
- If you add large images:
  - prefer `webp` or `avif`
  - keep “cover tiles” lightweight
- If you add new animations:
  - respect reduced motion (there is a `useReducedMotion` hook in `src/hooks/`)

---

## Deployment

This is a static build once you run:

```bash
npm run build
```

You can deploy the `build/` directory to any static host:

- Netlify / Vercel (static)
- Cloudflare Pages
- Hostinger (static hosting)
- Any Nginx/Apache static server

If your host supports SPA routing, make sure it rewrites all routes to `index.html`.

---

## Troubleshooting

### Blank page after deploy

Most common causes:

- Missing SPA rewrite rules (routes not pointing to `index.html`)
- Wrong asset paths if you changed homepage/base path

### SCSS not updating / styles weird

- Confirm the component SCSS file is imported (directly or via `app.scss`)
- Check for name mismatches like `ProjectsHeader.scss` vs `ProjectsHeader.js` (case sensitivity matters on some hosts)

### Images not loading

- Anything under `public/` should be referenced with a leading `/`  
  Example: `/projects/zahav/1.avif`
- Double-check folder and filename casing (macOS can hide issues that Linux servers won’t)

---

## Contributing

This is a studio site codebase. If you’re collaborating:

1. Create a branch from `main`
2. Keep changes small and scoped (one feature/fix per PR)
3. Prefer editing JSON content in `src/data/` when possible

---

## License

All rights reserved, unless you explicitly add an open-source license.

---

## Credits

Built and maintained by Moses Atia Poston at **Switch Case Studio**.
