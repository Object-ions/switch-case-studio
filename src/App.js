import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './components/layout/MainLayout';

// Pages & Sections
import Services from './components/pages/Services';
import Work from './components/pages/Work';
import Testimonials from './components/pages/Testimonials';
import Projects from './components/Projects';
import ProjectPage from './components/pages/ProjectPage';
import Contact from './components/pages/Contact';
import PricingPage from './components/PricingPage';
import Hero from './components/Hero';

// Utilities & Components
import ScrollToTop from './components/ScrollToTop';
import GradientStripe from './components/StripeSection';

// Assets & Styles
import Orb from './assets/images/orb.avif';

// Legal Pages
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import Accessibility from './components/Accessibility';

import './styles/app.scss';

/**
 * Core landing-page tree. Defined outside App so it isn't recreated
 * on every render.
 */
const HomeContent = () => (
  <>
    <Hero />
    <Services />
    <GradientStripe
      size="clamp(160px, 30vw, 420px)"
      duration={5.9}
      travel={60}
      orbSrc={Orb}
    />
    <Work />
    <Contact />
    <Projects />
    <Testimonials />
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

      <Routes>
        <Route element={<Layout />}>
          {/* Landing */}
          <Route path="/" element={<HomeContent />} />

          {/* Standalone case-study pages (replaces modal pattern) */}
          <Route path="/projects/:slug" element={<ProjectPage />} />

          {/* Pricing */}
          <Route path="/pricing/:serviceSlug" element={<PricingPage />} />

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
