import CursorComponent from '../CursorComponent';
import Header from './Header';
import Footer from './Footer';
import ScrollTriggerRefresher from '../ScrollTriggerRefresher';

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
