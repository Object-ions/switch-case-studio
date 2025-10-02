import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Existing pages
import Home from './components/pages/Home';
import Services from './components/pages/Services';
import Work from './components/pages/Work';
import Testimonials from './components/pages/Testimonials';
import ScrollToTop from './components/ScrollToTop';
import GradientStripe from './components/StripeSection';
import Projects from './components/Projects';
import PricingPage from './components/PricingPage';

import Orb from './assets/images/orb.avif';

import './styles/app.scss';

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Routes>
        {/* Home page (contains Projects as a section) */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
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
            </MainLayout>
          }
        />

        {/* Deep links: open modal on top of Projects section */}
        <Route
          path="/projects/:slug"
          element={
            <MainLayout>
              <Home />
              <Services />
              <GradientStripe
                height={420}
                duration={5.9}
                travel={60}
                orbSrc={Orb}
              />
              <Work />
              <Projects />
              <Testimonials />
            </MainLayout>
          }
        />

        {/* Pricing (single renderer) */}
        <Route
          path="/pricing"
          element={
            <MainLayout>
              <PricingPage />
            </MainLayout>
          }
        />
        <Route
          path="/pricing/:serviceSlug"
          element={
            <MainLayout>
              <PricingPage />
            </MainLayout>
          }
        />

        {/* Catch-all → Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
