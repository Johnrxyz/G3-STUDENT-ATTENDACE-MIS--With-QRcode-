import React, { useState } from 'react';
import './StudentProfile.css';

const StudentProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const [formData, setFormData] = useState({
        name: currentUser.name || '',
        studentId: currentUser.userId || '',
        section: '',
        age: '',
        course: '',
        address: '',
        status: '',
        gender: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save to localStorage
        const updatedUser = { ...currentUser, ...formData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        alert('Profile updated successfully!');
    };

    const enrolledCourses = [
        {
            title: 'Object oriented programming',
            icon: '💻',
            color: '#818CF8'
        },
        {
            title: 'Fundamentals of database systems',
            icon: '📊',
            color: '#A78BFA'
        }
    ];

    return (
        <div className="student-profile-page">
            {/* Welcome Banner */}
            <div className="welcome-banner">
                <div className="banner-content">
                    <p className="banner-date">September 25, 2024</p>
                    <h1>Welcome back, {currentUser.name || 'Student'}!</h1>
                    <p className="banner-subtitle">
                        {formData.section && `${formData.section} • `}
                        Always stay updated in your portal
                    </p>
                </div>
                <div className="banner-image">
                    <div className="decorative-dots">
                        <span className="dot dot-1"></span>
                        <span className="dot dot-2"></span>
                        <span className="dot dot-3"></span>
                        <span className="dot dot-4"></span>
                    </div>
                    <img
                        src="/assets/College Student.png"
                        alt="Student Avatar"
                        className="student-character"
                    />
                    <img
                        src="/assets/Scholarcap scroll.png"
                        alt="Graduation Cap"
                        className="graduation-cap"
                    />
                    <img
                        src="/assets/Backpack.png"
                        alt="Backpack"
                        className="backpack"
                    />
                </div>
            </div>

            {/* Student Dashboard Form */}
            <div className="dashboard-card">
                <h2>Student Dashboard</h2>
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Student ID</label>
                            <input
                                type="text"
                                name="studentId"
                                placeholder="Enter your student ID"
                                value={formData.studentId}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Section</label>
                            <input
                                type="text"
                                name="section"
                                placeholder="Enter your section"
                                value={formData.section}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="text"
                                name="age"
                                placeholder="Enter your age"
                                value={formData.age}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Course</label>
                            <input
                                type="text"
                                name="course"
                                placeholder="Enter your course"
                                value={formData.course}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Enter your address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <input
                                type="text"
                                name="status"
                                placeholder="Enter your status"
                                value={formData.status}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <input
                                type="text"
                                name="gender"
                                placeholder="Enter your gender"
                                value={formData.gender}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="save-btn">
                        Edit Information
                    </button>
                </form>
            </div>

            {/* Enrolled Courses */}
            <div className="enrolled-section">
                <h2>Enrolled Course</h2>
                <div className="courses-grid">
                    {enrolledCourses.map((course, index) => (
                        <div key={index} className="course-card" style={{ backgroundColor: course.color }}>
                            <div className="course-content">
                                <h3>{course.title}</h3>
                                <button className="view-btn">View</button>
                            </div>
                            <div className="course-icon">{course.icon}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
