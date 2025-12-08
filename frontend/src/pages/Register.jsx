import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPublicSections } from '../api/academic';
import { register } from '../api/auth';
import axios from '../api/axios'; // Public axios
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', // We will split this into firstname/lastname or change input to separate fields
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        userId: '', // Maps to student_number
        sectionId: '',
        contactNo: ''
    });

    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch sections for dropdown
        const fetchSections = async () => {
            try {
                const res = await getPublicSections(axios);
                setSections(res.data);
            } catch (err) {
                console.error("Failed to fetch sections", err);
            }
        };
        fetchSections();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        setLoading(true);
        try {
            await register({
                email: formData.email,
                password: formData.password,
                firstname: formData.firstname,
                lastname: formData.lastname,
                student_number: formData.userId,
                section_id: formData.sectionId,
                gender: 'Male' // Optional or add field
            });

            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.details || err.response?.data?.error || "Registration failed";
            alert('Error: ' + JSON.stringify(msg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <nav className="register-navbar">
                <div className="register-nav-content">
                    <div className="register-logo">
                        <img src="/assets/attendease-logo.png" alt="AttendEase Logo" className="register-logo-image" />
                    </div>
                    <div className="register-nav-links">
                        <Link to="/" className="register-nav-link">Home</Link>
                    </div>
                    <div className="register-nav-actions">
                        <Link to="/login" className="register-btn-login">Log In</Link>
                    </div>
                </div>
            </nav>

            <main className="register-main">
                <div className="register-form-container">
                    <div className="register-card">
                        <h1 className="register-title">Student Registration</h1>

                        <form className="register-form" onSubmit={handleSubmit}>
                            <div className="register-form-row">
                                <div className="register-form-group">
                                    <label htmlFor="firstname" className="register-form-label">First Name</label>
                                    <input
                                        type="text"
                                        id="firstname"
                                        name="firstname"
                                        className="register-form-input"
                                        placeholder="First Name"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="register-form-group">
                                    <label htmlFor="lastname" className="register-form-label">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastname"
                                        className="register-form-input"
                                        placeholder="Last Name"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
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

                            <div className="register-form-row">
                                <div className="register-form-group">
                                    <label htmlFor="password" className="register-form-label">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="register-form-input"
                                        placeholder="Min 8 chars"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="register-form-group">
                                    <label htmlFor="confirmPassword" className="register-form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="register-form-input"
                                        placeholder="Re-enter password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="register-form-row">
                                <div className="register-form-group">
                                    <label htmlFor="userId" className="register-form-label">Student ID</label>
                                    <input
                                        type="text"
                                        id="userId"
                                        name="userId"
                                        className="register-form-input"
                                        placeholder="e.g. 2023-0001"
                                        value={formData.userId}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="register-form-group">
                                    <label htmlFor="sectionId" className="register-form-label">Section</label>
                                    <div className='register-select-container'>
                                        <select
                                            id="sectionId"
                                            name="sectionId"
                                            className="register-form-select"
                                            value={formData.sectionId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Section</option>
                                            {sections.map(sec => (
                                                <option key={sec.id} value={sec.id}>
                                                    {sec.section_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="register-submit-btn" disabled={loading}>
                                {loading ? 'Registering...' : 'Register'}
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
