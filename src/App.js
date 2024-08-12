import '../src/styles/app.scss';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Pricing from './components/pages/Pricing';
import Testimonials from './components/pages/Testimonials';
import Work from './components/pages/Work';
import Services from './components/pages/Services';

function App() {
  return (
    <div className="app">
      <Header />
      <Home />
      <About />
      <Services />
      <Pricing />
      <Work />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
