import React, { useState, useEffect } from 'react';
import useStudent from '../../hooks/useStudent';
import './StudentProfile.css';

const StudentProfile = () => {
    const { profile, loading } = useStudent();
    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        section: '',
        age: '',
        course: '',
        address: '',
        status: '',
        gender: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.user?.get_full_name || `${profile.user?.firstname} ${profile.user?.lastname}`,
                studentId: profile.student_number || '',
                section: 'Mapped Section', // Need to map sections if available
                age: '20', // Placeholder as age not in model
                course: 'BSIT', // Placeholder
                address: 'Quezon City', // Placeholder
                status: 'Regular', // Placeholder
                gender: profile.user?.gender || ''
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Profile update not yet implemented in backend.');
    };

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;

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
                    <p className="banner-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <h1>Welcome back, {profile?.user?.firstname || 'Student'}!</h1>
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
                                disabled // Read only for now unless backend updated
                            />
                        </div>
                        <div className="form-group">
                            <label>Student ID</label>
                            <input
                                type="text"
                                name="studentId"
                                placeholder="Enter your student ID"
                                value={formData.studentId}
                                disabled
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
