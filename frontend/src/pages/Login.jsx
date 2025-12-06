import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get users from localStorage
        let users = JSON.parse(localStorage.getItem('users') || '[]');

        // If no users exist, create a default test user
        if (users.length === 0) {
            const defaultUser = {
                name: 'Test Teacher',
                email: 'teacher@test.com',
                password: 'password123',
                role: 'teacher',
                userId: 'T001',
                jobPosition: 'Teacher',
                contactNo: '1234567890'
            };
            users.push(defaultUser);
            localStorage.setItem('users', JSON.stringify(users));
            alert('No users found. Created default test account:\n\nUsername: teacher@test.com\nPassword: password123\n\nPlease try logging in again!');
            return;
        }

        // Find user by email/username and password
        const user = users.find(u =>
            (u.email === formData.username || u.userId === formData.username) &&
            u.password === formData.password
        );

        if (user) {
            // Save current user to localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Redirect based on role
            switch (user.role) {
                case 'teacher':
                    navigate('/teacher');
                    break;
                case 'student':
                    navigate('/student');
                    break;
                case 'admin':
                    navigate('/admin');
                    break;
                default:
                    navigate('/teacher'); // Default fallback
            }
        } else {
            alert('Invalid credentials!\n\nDefault test account:\nUsername: teacher@test.com\nPassword: password123\n\nOr register a new account.');
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
