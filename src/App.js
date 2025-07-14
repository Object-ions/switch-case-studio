import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Pricing from './components/pages/Pricing';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Services from './components/pages/Services';
import Work from './components/pages/Work';
import Testimonials from './components/pages/Testimonials';

import './styles/app.scss';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
              <Services />
              <About />
              <Work />
              <Testimonials />
            </MainLayout>
          }
        />
        <Route
          path="/services/pricing"
          element={
            <MainLayout>
              <Pricing />
            </MainLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
