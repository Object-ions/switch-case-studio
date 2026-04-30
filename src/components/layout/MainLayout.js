import CursorComponent from '../CursorComponent';
import Header from './Header';
import FooterCopyrights from './FooterCopyrights';
import ScrollTriggerRefresher from '../ScrollTriggerRefresher';

const MainLayout = ({ children }) => {
  return (
    <>
      <ScrollTriggerRefresher />
      <CursorComponent />
      <Header />
      <main>{children}</main>
      <FooterCopyrights />
    </>
  );
};

export default MainLayout;
