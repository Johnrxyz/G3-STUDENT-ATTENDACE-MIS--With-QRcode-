import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const { login } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(formData.username, formData.password);

            // Redirect is handled inside login? No, login returns true.
            // We need to check role to redirect.
            // But we can get auth state from hook or decoding here.
            // Since login updates context asynchronously, we might need to wait or rely on simple logic.
            // Let's decode or simply redirect to a default and let ProtectedRoute handle it?
            // Better: Get role effectively.

            const token = localStorage.getItem('access');
            // Quick decode for redirect
            if (token) {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const user = JSON.parse(jsonPayload);

                if (user.role === 'teacher' || user.role === 'admin') navigate('/teacher/dashboard');
                else if (user.role === 'student') navigate('/student/dashboard');
                else {
                    console.warn('Unknown role:', user.role);
                    navigate('/');
                }
            }
        } catch (err) {
            setError('Invalid credentials! Please try again.');
        }
    };

    return (
        <div className="login-container">
            {/* Navbar */}
            <nav className="login-navbar">
                <div className="login-nav-content">
                    <div className="login-logo">
                        <img src="/assets/attendease-logo.png" alt="AttendEase Logo" className="login-logo-image" />
                    </div>

                    <div className="login-nav-links">
                        <Link to="/" className="login-nav-link">Home</Link>
                        <a href="#" className="login-nav-link">About</a>
                    </div>

                    <div className="login-nav-actions">
                        <Link to="/login" className="login-btn-login">Log In</Link>
                        <button className="login-btn-enroll-nav">Enroll Now</button>
                    </div>
                </div>
            </nav>

            {/* Main Content - Login Form */}
            <main className="login-main">
                <div className="login-form-container">
                    <div className="login-card">
                        <h1 className="login-title">Log In</h1>

                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="login-form-group">
                                <label htmlFor="username" className="login-form-label">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="login-form-input"
                                    placeholder="Enter your email or user ID"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="login-form-group">
                                <label htmlFor="password" className="login-form-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="login-form-input"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <a href="#" className="login-forgot-password">Forgot password?</a>
                            </div>

                            <button type="submit" className="login-submit-btn">
                                Log In
                            </button>

                            <p className="login-signup-text">
                                Don't have an account? <Link to="/register" className="login-signup-link">Create one here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
