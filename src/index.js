import { ViteReactSSG } from 'vite-react-ssg';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { config as faConfig } from '@fortawesome/fontawesome-svg-core';
// LC-42: FontAwesome's CSS must be in the BUILT stylesheet, not injected at
// hydration — the SSG HTML was shipping every FA icon unstyled-giant until
// JS ran (header arrow 271px tall → 44px on collapse; 68 icons on pricing
// = desktop CLS 0.916). The static import lands the rules in app.css, which
// every static head links, so icons are constrained at first paint; the
// config flag turns off the runtime <style> injection that caused it.
import '@fortawesome/fontawesome-svg-core/styles.css';
import { routes } from './routes';
// Entry-chunk anchor for the landing-URL capture (LC-26a-rev): importing it
// here guarantees it evaluates before any lazy route chunk can.
import './utils/landingPath';

faConfig.autoAddCss = false;

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
