import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Pages & Sections
import Home from './components/pages/Home';
import Services from './components/pages/Services';
import Work from './components/pages/Work';
import Testimonials from './components/pages/Testimonials';
import Projects from './components/Projects';
import PricingPage from './components/PricingPage';

// Utilities & Components
import ScrollToTop from './components/ScrollToTop';
import GradientStripe from './components/StripeSection';

// Assets & Styles
import Orb from './assets/images/orb.avif';
import './styles/app.scss';

/**
 * The core structure of the landing page.
 * Defined outside App to prevent re-creation on re-renders.
 */
const HomeContent = () => (
  <>
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
  </>
);

function App() {
  return (
    <div className="app">
      <ScrollToTop />

      <Routes>
        {/* 1. Main Landing Page */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomeContent />
            </MainLayout>
          }
        />

        {/* 2. Project Deep Links 
            Renders the same HomeContent background so the Modal 
            can open on top of the Projects section naturally. 
        */}
        <Route
          path="/projects/:slug"
          element={
            <MainLayout>
              <HomeContent />
            </MainLayout>
          }
        />

        {/* 3. Pricing Pages (Standalone) */}
        <Route
          path="/pricing/:serviceSlug"
          element={
            <MainLayout>
              <PricingPage />
            </MainLayout>
          }
        />

        {/* 4. Catch-all -> Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
