import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
import "./styles/app.scss";

// Route-only pages — lazy loaded (not needed on initial home visit)
const CaseStudyPage        = lazy(() => import("./components/pages/CaseStudyPage"));
const CaseStudiesPage       = lazy(() => import("./components/pages/CaseStudiesPage"));
const PricingPage        = lazy(() => import("./components/pages/PricingPage"));
const PricingOverviewPage = lazy(() => import("./components/pages/PricingOverviewPage"));
const AboutPage          = lazy(() => import("./components/pages/AboutPage"));
const ServicesPage       = lazy(() => import("./components/pages/ServicesPage"));
const ReviewsPage   = lazy(() => import("./components/pages/ReviewsPage"));
const ContactPage        = lazy(() => import("./components/pages/ContactPage"));
const Privacy            = lazy(() => import("./components/pages/Privacy"));
const Terms              = lazy(() => import("./components/pages/Terms"));
const Accessibility      = lazy(() => import("./components/pages/Accessibility"));

const HomeContent = () => (
  <>
    <Seo
      title="Switch Case Studio — Landing Pages That Convert"
      description="Conversion-focused landing pages and websites, built from scratch for paid traffic and delivered in days — including white-label work for agencies."
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
      <RouteAnalytics />
      <ConsentBanner />

      <Routes>
        <Route element={<Layout />}>
          {/* Landing */}
          <Route path="/" element={<HomeContent />} />

          {/* About */}
          <Route path="/about" element={<AboutPage />} />

          {/* Case studies */}
          <Route path="/projects" element={<CaseStudiesPage />} />
          <Route path="/projects/:slug" element={<CaseStudyPage />} />

          {/* Pricing */}
          <Route path="/pricing" element={<PricingOverviewPage />} />
          <Route path="/pricing/:serviceSlug" element={<PricingPage />} />

          {/* Standalone section pages */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/testimonials" element={<ReviewsPage />} />
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
