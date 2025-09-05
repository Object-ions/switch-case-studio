import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Development from './components/pages/Development';
import Home from './components/pages/Home';
import Services from './components/pages/Services';
import Work from './components/pages/Work';
import Testimonials from './components/pages/Testimonials';
import ScrollToTop from './components/ScrollToTop';
import GradientStripe from './components/StripeSection';

import Orb from './assets/images/orb.avif';
import './styles/app.scss';
import Projects from './components/Projects';

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Routes>
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
              <Testimonials />
              <Projects />
            </MainLayout>
          }
        />
        <Route
          path="/services/development"
          element={
            <MainLayout>
              <Development />
            </MainLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
