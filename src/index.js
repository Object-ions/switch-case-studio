import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';

// vite-react-ssg owns the root: it renders each route to static HTML at build
// time (Node) and hydrates on the client. It also provides the router and the
// HelmetProvider — the app must NOT mount its own (a second provider would
// register head tags in a context the SSG collector never reads).
export const createRoot = ViteReactSSG(
  { routes },
  ({ isClient }) => {
    // client-only setup (e.g. GSAP plugin registration) lands here in Phase 2,
    // guarded by isClient.
  },
);
