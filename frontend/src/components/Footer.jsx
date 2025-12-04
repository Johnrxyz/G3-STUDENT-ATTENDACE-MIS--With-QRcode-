import React from 'react';
import { ScanLine, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <ScanLine size={28} color="white" strokeWidth={2.5} />
                        <span className="footer-logo-text">AttendEase</span>
                    </div>
                    <div className="contact-info">
                        <p>+1 (7635) 547-12-97</p>
                        <p>support@personal.com</p>
                    </div>
                </div>

                <div className="footer-column">
                    <h4 className="column-title">Quick Links</h4>
                    <ul className="footer-links">
                        <li><a href="#" className="footer-link">Product</a></li>
                        <li><a href="#" className="footer-link">Information</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4 className="column-title">&nbsp;</h4>
                    <ul className="footer-links">
                        <li><a href="#" className="footer-link">Company</a></li>
                        <li><a href="#" className="footer-link">Edu Media</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                </div>
                <div className="footer-column subscribe-section">
                    <h4 className="column-title">Subscribe</h4>
                    <div className="subscribe-form">
                        <input type="email" placeholder="Get product updates" className="subscribe-input" />
                        <button className="subscribe-btn">
                            <ArrowRight size={20} color="white" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="social-icons">
                    <div className="social-icon"><Linkedin size={16} /></div>
                    <div className="social-icon"><Facebook size={16} /></div>
                    <div className="social-icon"><Twitter size={16} /></div>
                </div>

                <div className="brand-credit">
                    A product of <span style={{ fontWeight: 'bold', color: 'white' }}>AttendEase</span>
                </div>

                <div className="copyright">
                    © 2025 Edu Media. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
