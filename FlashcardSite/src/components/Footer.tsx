import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer"> {/* Use <footer> tag instead of <div> for better SEO/Accessibility */}
      <p>© {currentYear} Your Website Name. All rights reserved.</p>
      <div className="social-icons">
        <i className="fa-brands fa-instagram"></i>
        <i className="fa-brands fa-twitter"></i>
        <i className="fa-brands fa-facebook"></i>
      </div>
    </footer>
  );
}

export default Footer;