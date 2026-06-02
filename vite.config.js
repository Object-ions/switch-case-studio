import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// CRA-style migration: this project keeps JSX inside `.js` files (not `.jsx`),
// which esbuild does not treat as JSX by default. The esbuild loader override
// (for source) + optimizeDeps loader (for any dep shipping JSX in .js) handle
// that without renaming every component file.
export default defineConfig({
  plugins: [react({ include: /\.(js|jsx)$/ })],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build", // keep CRA's output dir so existing deploy config still works
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
