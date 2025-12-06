import React from 'react';
import { BookOpen, Clock, CheckCircle, Calendar } from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    return (
        <div className="student-dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {currentUser.name || 'Student'}!</h1>
                <p>Track your attendance and stay updated with your classes</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#DBEAFE' }}>
                        <BookOpen size={24} color="#2563EB" />
                    </div>
                    <div className="stat-content">
                        <h3>5</h3>
                        <p>Active Classes</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#D1FAE5' }}>
                        <CheckCircle size={24} color="#10B981" />
                    </div>
                    <div className="stat-content">
                        <h3>92%</h3>
                        <p>Attendance Rate</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#FEF3C7' }}>
                        <Clock size={24} color="#F59E0B" />
                    </div>
                    <div className="stat-content">
                        <h3>3</h3>
                        <p>Classes Today</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#E0E7FF' }}>
                        <Calendar size={24} color="#6366F1" />
                    </div>
                    <div className="stat-content">
                        <h3>45</h3>
                        <p>Total Sessions</p>
                    </div>
                </div>
            </div>

            {/* Today's Schedule */}
            <div className="dashboard-section">
                <h2>Today's Schedule</h2>
                <div className="schedule-list">
                    <div className="schedule-item">
                        <div className="schedule-time">
                            <span className="time">9:00 AM</span>
                            <span className="duration">1h 30m</span>
                        </div>
                        <div className="schedule-details">
                            <h3>Mathematics 101</h3>
                            <p>Prof. John Smith • Room 204</p>
                        </div>
                        <div className="schedule-status">
                            <span className="status-badge completed">Attended</span>
                        </div>
                    </div>

                    <div className="schedule-item">
                        <div className="schedule-time">
                            <span className="time">11:00 AM</span>
                            <span className="duration">2h</span>
                        </div>
                        <div className="schedule-details">
                            <h3>Computer Science</h3>
                            <p>Prof. Sarah Johnson • Lab 3</p>
                        </div>
                        <div className="schedule-status">
                            <span className="status-badge upcoming">Upcoming</span>
                        </div>
                    </div>

                    <div className="schedule-item">
                        <div className="schedule-time">
                            <span className="time">2:00 PM</span>
                            <span className="duration">1h</span>
                        </div>
                        <div className="schedule-details">
                            <h3>Physics Lab</h3>
                            <p>Prof. Michael Brown • Lab 1</p>
                        </div>
                        <div className="schedule-status">
                            <span className="status-badge upcoming">Upcoming</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Attendance */}
            <div className="dashboard-section">
                <h2>Recent Attendance</h2>
                <div className="attendance-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Class</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Dec 5, 2025</td>
                                <td>Mathematics 101</td>
                                <td>9:00 AM</td>
                                <td><span className="status-badge completed">Present</span></td>
                            </tr>
                            <tr>
                                <td>Dec 4, 2025</td>
                                <td>Computer Science</td>
                                <td>11:00 AM</td>
                                <td><span className="status-badge completed">Present</span></td>
                            </tr>
                            <tr>
                                <td>Dec 4, 2025</td>
                                <td>Physics Lab</td>
                                <td>2:00 PM</td>
                                <td><span className="status-badge absent">Absent</span></td>
                            </tr>
                            <tr>
                                <td>Dec 3, 2025</td>
                                <td>Mathematics 101</td>
                                <td>9:00 AM</td>
                                <td><span className="status-badge completed">Present</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
