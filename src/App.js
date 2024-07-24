import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/styles/app.scss';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Pricing from './components/pages/Pricing';
import Testimonials from './components/pages/Testimonials';
import Work from './components/pages/Work';

function App() {
  return (
    <div className="app">
      <Router>
        <div className="page">
          <Header />

          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/work" element={<Work />} />
              <Route path="/testimonials" element={<Testimonials />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
