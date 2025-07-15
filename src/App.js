import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Development from './components/pages/Development';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Services from './components/pages/Services';
import Work from './components/pages/Work';
import Testimonials from './components/pages/Testimonials';
import ScrollToTop from './components/ScrollToTop';

import './styles/app.scss';

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
              <About />
              <Work />
              <Testimonials />
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
