import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        userId: '',
        jobPosition: '',
        contactNo: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Save user data to localStorage (in a real app, this would be an API call)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            userId: formData.userId,
            jobPosition: formData.jobPosition,
            contactNo: formData.contactNo
        });
        localStorage.setItem('users', JSON.stringify(users));

        // Redirect to login page
        alert('Registration successful! Please log in.');
        navigate('/login');
    };

    return (
        <div className="register-container">
            {/* Navbar */}
            <nav className="register-navbar">
                <div className="register-nav-content">
                    <div className="register-logo">
                        <img src="/assets/attendease-logo.png" alt="AttendEase Logo" className="register-logo-image" />
                    </div>

                    <div className="register-nav-links">
                        <Link to="/" className="register-nav-link">Home</Link>
                        <a href="#" className="register-nav-link">About</a>
                    </div>

                    <div className="register-nav-actions">
                        <Link to="/login" className="register-btn-login">Log In</Link>
                        <button className="register-btn-enroll-nav">Enroll Now</button>
                    </div>
                </div>
            </nav>

            {/* Main Content - Register Form */}
            <main className="register-main">
                <div className="register-form-container">
                    <div className="register-card">
                        <h1 className="register-title">Create New Account</h1>

                        <form className="register-form" onSubmit={handleSubmit}>
                            <div className="register-form-group">
                                <label htmlFor="name" className="register-form-label">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="register-form-input"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="email" className="register-form-label">Email address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="register-form-input"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="password" className="register-form-label">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="register-form-input"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="confirmPassword" className="register-form-label">Re-enter Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="register-form-input"
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="register-form-row">
                                <div className="register-form-group">
                                    <label htmlFor="role" className="register-form-label">Select Role</label>
                                    <div className='register-select-container'>
                                        <select
                                            id="role"
                                            name="role"
                                            className="register-form-select"
                                            value={formData.role}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select your role</option>
                                            <option value="student">Student</option>
                                            <option value="teacher">Teacher</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                </div>

                                <div className="register-form-group">
                                    <label htmlFor="userId" className="register-form-label">User ID</label>
                                    <input
                                        type="text"
                                        id="userId"
                                        name="userId"
                                        className="register-form-input"
                                        placeholder="Enter your user ID"
                                        value={formData.userId}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="register-form-row">
                                <div className="register-form-group">
                                    <label htmlFor="jobPosition" className="register-form-label">Position</label>
                                    <input
                                        type="text"
                                        id="jobPosition"
                                        name="jobPosition"
                                        className="register-form-input"
                                        placeholder="Enter your job position"
                                        value={formData.jobPosition}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="register-form-group">
                                    <label htmlFor="contactNo" className="register-form-label">Contact No.</label>
                                    <input
                                        type="tel"
                                        id="contactNo"
                                        name="contactNo"
                                        className="register-form-input"
                                        placeholder="Enter your number"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="register-submit-btn">
                                Register
                            </button>

                            <p className="register-signin-text">
                                Already have an Account? <Link to="/login" className="register-signin-link">Sign in</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
