import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
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

/**
 * Layout route element — renders MainLayout once and lets nested
 * routes plug into <Outlet />.
 */
const Layout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />

      <Suspense fallback={null}>
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
      </Suspense>
    </HelmetProvider>
  );
}

export default App;
