import { ViteReactSSG } from 'vite-react-ssg';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { routes } from './routes';

// vite-react-ssg owns the root: it renders each route to static HTML at build
// time (Node) and hydrates on the client. It also provides the router and the
// HelmetProvider — the app must NOT mount its own (a second provider would
// register head tags in a context the SSG collector never reads).
export const createRoot = ViteReactSSG(
  { routes },
  ({ isClient }) => {
    if (isClient) {
      // Registered once here, before hydration — never at module scope in
      // components (the SSG imports every component in Node, where plugin
      // registration has no DOM to bind to). Components only USE ScrollTrigger
      // inside effects, which don't run during SSG.
      gsap.registerPlugin(ScrollTrigger);
    }
  },
);
