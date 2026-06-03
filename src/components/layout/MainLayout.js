import CursorComponent from '../ui/CursorComponent';
import Header from './Header';
import Footer from './Footer';
import ScrollTriggerRefresher from '../util/ScrollTriggerRefresher';

const MainLayout = ({ children }) => {
  return (
    <>
      <ScrollTriggerRefresher />
      <CursorComponent />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
