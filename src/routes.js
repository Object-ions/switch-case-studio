import { Suspense, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

// Home sections — synchronous (must be ready on first paint)
import Hero from "./components/sections/Hero";
import ClientStrip from "./components/sections/ClientStrip";
import LandingPageProof from "./components/sections/LandingPageProof";
import Services from "./components/sections/Services";
import About from "./components/sections/About";
import Reviews from "./components/sections/Reviews";
import CaseStudies from "./components/sections/CaseStudies";
import Contact from "./components/sections/Contact";
import Faq from "./components/sections/Faq";
import GradientStripe from "./components/sections/StripeSection";
import ScrollToTop from "./components/util/ScrollToTop";
import Seo from "./components/util/Seo";
import RouteAnalytics from "./analytics/RouteAnalytics";
import ConsentBanner from "./analytics/ConsentBanner";
import Orb from "./assets/images/orb.avif";
import projects from "./data/projects.json";
import services from "./data/services.json";
import "./styles/app.scss";

// Route-only pages — lazy route records: vite-react-ssg resolves them during
// the static build (full content in the HTML) and React Router code-splits
// them on the client, same chunks as the old React.lazy setup.
const page = (loader) => () =>
  loader().then((m) => ({ Component: m.default }));

const HomeContent = () => (
  <>
    <Seo
      title="Switch Case Studio — Web Design & Development Studio"
      description="Websites, branding, and SEO built from scratch and delivered in days — including white-label work for agencies."
      path="/"
    />
    <Hero />
    <ClientStrip />
    <LandingPageProof />
    <Services />
    <GradientStripe
      size="clamp(160px, 30vw, 420px)"
      duration={5.9}
      travel={60}
      orbSrc={Orb}
    />
    <CaseStudies />
    <About />
    <Reviews />
    <Contact />
    <Faq />
  </>
);

// Routes whose pages are LIGHT-themed (dark text on a light surface) and
// therefore rely on a light backdrop. Everything else is dark (#000).
// - /privacy, /terms, /accessibility  → .legal-page (dark text, no own bg)
// NOTE: /pricing/:slug is now dark (black surface, light cards), so it is
// intentionally NOT in this list.
const LIGHT_ROUTES = /^\/(privacy|terms|accessibility)(\/|$)/;

/**
 * Layout route element — renders MainLayout once and lets nested
 * routes plug into <Outlet />.
 *
 * .route-backdrop is a non-fading layer behind the page, tinted to match
 * the destination page's theme. This is what kills the white flash: each
 * page paints #000 (or light grey), but <body>/<main> are light grey, so
 * while .page-fade animates from opacity 0 the page is transparent and the
 * backdrop shows through. If the backdrop matches the page, fading in
 * changes no color — only the content appears.
 *
 * ScrollToTop / RouteAnalytics / ConsentBanner need the router context
 * (useLocation), so they live here now that the router is owned by
 * vite-react-ssg instead of an app-level <BrowserRouter>.
 *
 * Suspense stays for any nested lazy component (e.g. the Moon); page-level
 * code-splitting moved to route-record `lazy`, which React Router resolves
 * before rendering the route. The keyed wrapper re-mounts per route to
 * replay the opacity-only fade (resting opacity is 1, so content can never
 * get stuck invisible).
 */
const Layout = () => {
  const { pathname } = useLocation();
  const theme = LIGHT_ROUTES.test(pathname) ? "is-light" : "is-dark";

  // The page fade is a route-transition touch — but it animates from opacity:0,
  // and the hero (LCP element) lives inside it. Running it on first paint gates
  // LCP behind the 0.4s fade. So skip the class on the initial render (server +
  // first client render both see prevPath === null → no class → no hydration
  // mismatch, no opacity flash) and only apply it once a client navigation has
  // changed the path.
  const prevPath = useRef(null);
  const isInitial = prevPath.current === null;
  useEffect(() => {
    prevPath.current = pathname;
  }, [pathname]);

  return (
    <MainLayout>
      <ScrollToTop />
      <RouteAnalytics />
      <ConsentBanner />
      <div className={`route-backdrop ${theme}`}>
        <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
          <div key={pathname} className={isInitial ? undefined : "page-fade"}>
            <Outlet />
          </div>
        </Suspense>
      </div>
    </MainLayout>
  );
};

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      // Landing
      { index: true, element: <HomeContent /> },

      // About
      { path: "about", lazy: page(() => import("./components/pages/AboutPage")) },

      // Case studies
      { path: "projects", lazy: page(() => import("./components/pages/CaseStudiesPage")) },
      {
        path: "projects/:slug",
        lazy: page(() => import("./components/pages/CaseStudyPage")),
        getStaticPaths: () => projects.map((p) => `/projects/${p.slug}`),
      },

      // Pricing
      { path: "pricing", lazy: page(() => import("./components/pages/PricingOverviewPage")) },
      {
        path: "pricing/:serviceSlug",
        lazy: page(() => import("./components/pages/PricingPage")),
        getStaticPaths: () => services.map((s) => `/pricing/${s.slug}`),
      },

      // Promo landing — noindex (PROMO_INDEXABLE), intentionally absent from
      // the sitemap. Lazy so it never enters the other pages' bundles.
      { path: "30-off", lazy: page(() => import("./components/pages/PromoPage")) },

      // Agency-partner wholesale offer — behind a password gate at /partners.
      // The pre-rendered /partners.html ships ONLY the lock screen; PartnersGate
      // SHA-256-checks the typed password in the browser and lazy-loads the
      // offer (PartnersPage) only on a match, so the offer markup never reaches
      // a visitor who hasn't unlocked. noindex,nofollow (page <Seo> + an
      // X-Robots-Tag header in netlify.toml), NOT linked anywhere, absent from
      // the sitemap. Hand partners the URL + password. Lazy so the offer never
      // enters the other pages' bundles.
      { path: "partners", lazy: page(() => import("./components/pages/PartnersGate")) },

      // Standalone section pages
      { path: "services", lazy: page(() => import("./components/pages/ServicesPage")) },
      { path: "testimonials", lazy: page(() => import("./components/pages/ReviewsPage")) },
      { path: "contact", lazy: page(() => import("./components/pages/ContactPage")) },

      // Legal
      { path: "privacy", lazy: page(() => import("./components/pages/Privacy")) },
      { path: "terms", lazy: page(() => import("./components/pages/Terms")) },
      { path: "accessibility", lazy: page(() => import("./components/pages/Accessibility")) },

      // 404 — emitted as build/404.html, which Netlify serves (with a real
      // 404 status) for any URL that has no static file. The "*" catch-all
      // below renders the same page for unknown in-app navigations (it used
      // to silently redirect home, masking broken links).
      { path: "404", lazy: page(() => import("./components/pages/NotFoundPage")) },
      { path: "*", lazy: page(() => import("./components/pages/NotFoundPage")) },
    ],
  },
];
