import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import MainLayout from "./components/layout/MainLayout";

// Home sections — synchronous (must be ready on first paint)
import Hero from "./components/Hero";
import ClientStrip from "./components/ClientStrip";
import LandingPageProof from "./components/LandingPageProof";
import Services from "./components/pages/Services";
import Work from "./components/pages/Work";
import Testimonials from "./components/pages/Testimonials";
import Projects from "./components/Projects";
import Contact from "./components/pages/Contact";
import Faq from "./components/Faq";
import GradientStripe from "./components/StripeSection";
import ScrollToTop from "./components/ScrollToTop";
import Orb from "./assets/images/orb.avif";
import "./styles/app.scss";

// Route-only pages — lazy loaded (not needed on initial home visit)
const ProjectPage        = lazy(() => import("./components/pages/ProjectPage"));
const ProjectsPage       = lazy(() => import("./components/pages/ProjectsPage"));
const PricingPage        = lazy(() => import("./components/PricingPage"));
const PricingOverviewPage = lazy(() => import("./components/pages/PricingOverviewPage"));
const AboutPage          = lazy(() => import("./components/pages/AboutPage"));
const ServicesPage       = lazy(() => import("./components/pages/ServicesPage"));
const TestimonialsPage   = lazy(() => import("./components/pages/TestimonialsPage"));
const ContactPage        = lazy(() => import("./components/pages/ContactPage"));
const Privacy            = lazy(() => import("./components/Privacy"));
const Terms              = lazy(() => import("./components/Terms"));
const Accessibility      = lazy(() => import("./components/Accessibility"));

const HomeContent = () => (
  <>
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
    <Projects />
    <Work />
    <Testimonials />
    <Contact />
    <Faq />
  </>
);

// Routes whose pages are LIGHT-themed (dark text on a light surface) and
// therefore rely on a light backdrop. Everything else is dark (#000).
// - /privacy, /terms, /accessibility  → .legal-page (dark text, no own bg)
// - /pricing/:serviceSlug             → PricingGuide ($grey-color surface)
// NOTE: /pricing (overview) is dark, so only /pricing/<slug> matches.
const LIGHT_ROUTES = /^\/(privacy|terms|accessibility)(\/|$)|^\/pricing\/[^/]+/;

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
 * Suspense lives HERE (not around the whole app) so header/footer stay
 * mounted during a lazy chunk load; its fallback is transparent and simply
 * shows the matching .route-backdrop. The keyed wrapper re-mounts per route
 * to replay the opacity-only fade (resting opacity is 1, so content can
 * never get stuck invisible).
 */
const Layout = () => {
  const { pathname } = useLocation();
  const theme = LIGHT_ROUTES.test(pathname) ? "is-light" : "is-dark";
  return (
    <MainLayout>
      <div className={`route-backdrop ${theme}`}>
        <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
          <div key={pathname} className="page-fade">
            <Outlet />
          </div>
        </Suspense>
      </div>
    </MainLayout>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />

      <Routes>
        <Route element={<Layout />}>
          {/* Landing */}
          <Route path="/" element={<HomeContent />} />

          {/* About */}
          <Route path="/about" element={<AboutPage />} />

          {/* Case studies */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />

          {/* Pricing */}
          <Route path="/pricing" element={<PricingOverviewPage />} />
          <Route path="/pricing/:serviceSlug" element={<PricingPage />} />

          {/* Standalone section pages */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Legal */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/accessibility" element={<Accessibility />} />
        </Route>

        {/* Catch-all → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
