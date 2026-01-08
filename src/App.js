import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
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

// 1. Define the reusable layout once
const HomeLayout = () => (
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
);

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Routes>
        {/* 2. Reuse it for both Home and Project Deep Links */}
        <Route path="/" element={<HomeLayout />} />
        <Route path="/projects/:slug" element={<HomeLayout />} />

        {/* Pricing is unique */}
        <Route
          path="/pricing/:serviceSlug"
          element={
            <MainLayout>
              <PricingPage />
            </MainLayout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
