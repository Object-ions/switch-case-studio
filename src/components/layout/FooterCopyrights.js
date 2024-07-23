const FooterCopyrights = () => {
  const currentYear = new Date().getFullYear();
  return <p className="copyrights">Switch Case Studio &copy; {currentYear}</p>;
};

export default FooterCopyrights;
