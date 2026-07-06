import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// This project MIGRATED from Create React App to Vite + vite-react-ssg
// (2026-06; CRA is gone — react-scripts removed, no CRA config remains).
// One CRA-era convention was kept on purpose: JSX lives inside `.js` files
// (not `.jsx`), which esbuild does not treat as JSX by default. The esbuild
// loader override (for source) + optimizeDeps loader (for any dep shipping
// JSX in .js) handle that without renaming every component file.
export default defineConfig({
  plugins: [react({ include: /\.(js|jsx)$/ })],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // "build" (CRA's old dir), NOT Vite's default "dist" — kept deliberately so
    // Netlify's `publish = "build"` and all docs/scripts stay valid.
    outDir: "build",
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Modern Sass API (silences the legacy-js-api deprecation).
        api: "modern",
        // The stylesheets use @import everywhere. Migrating every file to
        // @use/@forward is a large, risk-only-no-benefit refactor, so quiet the
        // @import deprecation instead.
        silenceDeprecations: ["legacy-js-api", "import"],
      },
    },
  },
  ssr: {
    // gsap ships CJS; if left external, the SSG's Node render hits
    // "Named export 'ScrollTrigger' not found" (Node ESM can't named-import
    // CJS). Bundling it through Vite's SSR transform fixes the interop.
    noExternal: ["gsap"],
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { ".js": "jsx" },
    },
  },
});
