import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import '../src/styles/app.scss';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';

function App() {
  return (
    <div className="app">
      <Router>
        <div className="page">
          <Header />

          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
