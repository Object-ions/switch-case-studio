import Header from './components/layout/Header';
import FooterCopyrights from './components/layout/FooterCopyrights';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Pricing from './components/pages/Pricing';
import Testimonials from './components/pages/Testimonials';
import Work from './components/pages/Work';
import Services from './components/pages/Services';
import CursorComponent from './components/CursorComponent';
import Loader from './components/Loader';

import '../src/styles/app.scss';

function App() {
  return (
    <div className="app">
      <CursorComponent />
      <Loader />
      <Header />
      <Home />
      <Services />
      <About />
      <Pricing />
      <Work />
      <Testimonials />
      <Contact />
      <FooterCopyrights />
    </div>
  );
}

export default App;
