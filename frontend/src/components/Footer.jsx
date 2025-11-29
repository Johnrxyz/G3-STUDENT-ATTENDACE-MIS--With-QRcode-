import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-left">
          <h3>Blaze Academy</h3>
          <p>+1 (065) 662 12 87</p>
          <p>support@domain.com</p>
          <div className="social-icons">
            <i className="icon">in</i>
            <i className="icon">f</i>
            <i className="icon">tw</i>
          </div>
        </div>

        <div className="footer-links">
          <div>
            <h4>Quick Links</h4>
            <p>Product</p>
            <p>Information</p>
          </div>
          <div>
            <h4>Company</h4>
            <p>Edu/Media</p>
          </div>
        </div>

        <div className="footer-subscribe">
          <h4>Subscribe</h4>
          <div className="subscribe-box">
            <input type="email" placeholder="Get product updates" />
            <button>→</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2023 Da Media. All rights reserved</p>
        <p>A product of Blaze Academy</p>
      </div>
    </footer>
  );
}
