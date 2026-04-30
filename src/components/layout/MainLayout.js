import CursorComponent from '../CursorComponent';
import Header from './Header';
import FooterCopyrights from './FooterCopyrights';
import Contact from '../pages/Contact';
import ScrollTriggerRefresher from '../ScrollTriggerRefresher';

const MainLayout = ({ children }) => {
  return (
    <>
      <ScrollTriggerRefresher />
      <CursorComponent />
      <Header />
      <main>{children}</main>
      <Contact />
      <FooterCopyrights />
    </>
  );
};

export default MainLayout;
