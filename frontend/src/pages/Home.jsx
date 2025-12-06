import React from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, QrCode, Scan, FileText } from 'lucide-react';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            {/* Navbar */}
            <nav className="hp-navbar">
                <div className="hp-nav-content">
                    <div className="hp-logo">
                        <img src="/assets/attendease-logo.png" alt="AttendEase Logo" className="hp-logo-image" />
                    </div>

                    <div className="hp-nav-links">
                        <a href="#" className="hp-nav-link active">Home</a>
                        <a href="#" className="hp-nav-link">About</a>
                    </div>

                    <div className="hp-nav-actions">
                        <Link to="/login" className="hp-btn-login">Log In</Link>
                        <button className="hp-btn-enroll-nav">Enroll Now</button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="hp-main">
                <div className="hp-hero-header">
                    <h1 className="hp-title">AttendEase</h1>
                    <p className="hp-subtitle">Smart, Simple, Instant Attendance Tracking</p>
                </div>

                <div className="hp-wave-section">
                    <div className="hp-wave-content">
                        <div className="hp-how-it-works">
                            <h2>How It Works</h2>
                            <ol className="hp-steps">
                                <li>1. Sign Up an account</li>
                                <li>2. Generate your QR</li>
                                <li>3. Scan to track attendance instantly</li>
                            </ol>
                            <button className="hp-btn-enroll-hero">Enroll now</button>
                        </div>

                        <div className="hp-visual">
                            <div className="hp-qr-glass">
                                <div className="hp-qr-corners">
                                    <div className="corner top-left"></div>
                                    <div className="corner top-right"></div>
                                    <div className="corner bottom-left"></div>
                                    <div className="corner bottom-right"></div>
                                </div>
                                <div className="hp-scan-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <section className="hp-features-section">
                    <h2 className="hp-section-title">What <span className="hp-text-blue">AttendEase</span> Offers</h2>

                    <div className="hp-features-grid">
                        <div className="hp-feature-card">
                            <div className="hp-feature-icon-wrapper">
                                <QrCode size={40} className="hp-feature-icon" />
                            </div>
                            <h3>QR Generation</h3>
                            <p>Instantly generate unique QR codes for every student or teacher, making the attendance process fast and organized.</p>
                        </div>

                        <div className="hp-feature-card">
                            <div className="hp-feature-icon-wrapper">
                                <Scan size={40} className="hp-feature-icon" />
                            </div>
                            <h3>QR Scanning</h3>
                            <p>Scan QR codes in real time using any camera-enabled device for quick and accurate attendance recording.</p>
                        </div>

                        <div className="hp-feature-card">
                            <div className="hp-feature-icon-wrapper">
                                <FileText size={40} className="hp-feature-icon" />
                            </div>
                            <h3>Attendance Logs</h3>
                            <p>Automatically store and display attendance records with timestamps, giving users a clear and reliable attendance history.</p>
                        </div>
                    </div>
                </section>

                {/* Image Section */}
                <section className="hp-image-section">
                    <div className="hp-image-overlay">
                        <p>AttendEase is a modern attendance solution designed to help schools and organizations track attendance through secure login, QR scanning, and automated logs.</p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
