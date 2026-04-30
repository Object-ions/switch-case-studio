import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Pages & Sections
import Services from './components/pages/Services';
import Work from './components/pages/Work';
import Testimonials from './components/pages/Testimonials';
import Projects from './components/Projects';
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
    <Projects />
    <Testimonials />
  </>
);

/**
 * Layout route element — renders MainLayout once and lets nested
 * routes plug into <Outlet />. Replaces the previous pattern of
 * wrapping every route's element in <MainLayout>.
 */
const Layout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route element={<Layout />}>
          {/* Landing + project deep-link share the same tree;
              the Projects modal reads :slug from the URL. */}
          <Route path="/" element={<HomeContent />} />
          <Route path="/projects/:slug" element={<HomeContent />} />

          {/* Standalone pages */}
          <Route path="/pricing/:serviceSlug" element={<PricingPage />} />

          {/* Legal */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/accessibility" element={<Accessibility />} />
        </Route>

        {/* Catch-all → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
