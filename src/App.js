import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Existing pages
import Home from './components/pages/Home';
import Services from './components/pages/Services';
import Work from './components/pages/Work';
import Testimonials from './components/pages/Testimonials';
import ScrollToTop from './components/ScrollToTop';
import GradientStripe from './components/StripeSection';
import Projects from './components/Projects';

import Orb from './assets/images/orb.avif';

// Pricing page stubs
import PricingOverview from './components/pages/pricing/PricingOverview';
import PricingWebDev from './components/pages/pricing/PricingWebDev';
import PricingMarketingAds from './components/pages/pricing/PricingMarketingAds';
import PricingHostingMaintenance from './components/pages/pricing/PricingHostingMaintenance';
import PricingDesignBranding from './components/pages/pricing/PricingDesignBranding';
import PricingAutomationIntegrations from './components/pages/pricing/PricingAutomationIntegrations';
import PricingEmailMarketing from './components/pages/pricing/PricingEmailMarketing';

import './styles/app.scss';

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Routes>
        {/* Home */}
        <Route
          path="/"
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

        {/* Projects index + deep links to modal */}
        <Route
          path="/projects"
          element={
            <MainLayout>
              <Projects />
            </MainLayout>
          }
        />
        <Route
          path="/projects/:slug"
          element={
            <MainLayout>
              <Projects />
            </MainLayout>
          }
        />

        {/* Pricing overview */}
        <Route
          path="/pricing"
          element={
            <MainLayout>
              <PricingOverview />
            </MainLayout>
          }
        />

        {/* Pricing children */}
        <Route
          path="/pricing/web-development"
          element={
            <MainLayout>
              <PricingWebDev />
            </MainLayout>
          }
        />
        <Route
          path="/pricing/marketing-ads"
          element={
            <MainLayout>
              <PricingMarketingAds />
            </MainLayout>
          }
        />
        <Route
          path="/pricing/hosting-maintenance"
          element={
            <MainLayout>
              <PricingHostingMaintenance />
            </MainLayout>
          }
        />
        <Route
          path="/pricing/design-branding"
          element={
            <MainLayout>
              <PricingDesignBranding />
            </MainLayout>
          }
        />
        <Route
          path="/pricing/automation-integrations"
          element={
            <MainLayout>
              <PricingAutomationIntegrations />
            </MainLayout>
          }
        />
        <Route
          path="/pricing/email-marketing"
          element={
            <MainLayout>
              <PricingEmailMarketing />
            </MainLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
