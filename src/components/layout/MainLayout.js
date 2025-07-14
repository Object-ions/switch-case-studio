import CursorComponent from '../CursorComponent';
import Loader from '../Loader';
import Header from './Header';
import FooterCopyrights from './FooterCopyrights';
import Contact from '../pages/Contact';

const MainLayout = ({ children }) => {
  return (
    <div className="app">
      <CursorComponent />
      <Loader />
      <Header />
      {children}
      <Contact />
      <FooterCopyrights />
    </div>
  );
};

export default MainLayout;
