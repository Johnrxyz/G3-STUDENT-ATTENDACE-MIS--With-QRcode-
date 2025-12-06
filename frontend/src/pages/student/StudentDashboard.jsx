import React from 'react';
import { BookOpen, Clock, CheckCircle, Calendar } from 'lucide-react';
import useStudent from '../../hooks/useStudent';
import useAuth from '../../hooks/useAuth';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const { auth } = useAuth();
    const { profile, history, loading, error } = useStudent();

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading data.</div>;

    // Calculate stats
    const totalSessions = history.length; // Approximate using history count? No, history is records.
    const attended = history.filter(r => r.status === 'present' || r.status === 'late').length;
    const attendanceRate = totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0;

    // Recent records
    const recentHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5);

    return (
        <div className="student-dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {auth.user?.username || 'Student'}!</h1>
                <p>Track your attendance and stay updated with your classes</p>
                {/* <p>Student ID: {profile?.student_number}</p> */}
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#DBEAFE' }}>
                        <BookOpen size={24} color="#2563EB" />
                    </div>
                    <div className="stat-content">
                        <h3>{profile?.sections?.length || 0}</h3>
                        <p>Active Sections</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#D1FAE5' }}>
                        <CheckCircle size={24} color="#10B981" />
                    </div>
                    <div className="stat-content">
                        <h3>{attendanceRate}%</h3>
                        <p>Attendance Rate</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#FEF3C7' }}>
                        <Clock size={24} color="#F59E0B" />
                    </div>
                    <div className="stat-content">
                        <h3>0</h3>
                        <p>Classes Today</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ backgroundColor: '#E0E7FF' }}>
                        <Calendar size={24} color="#6366F1" />
                    </div>
                    <div className="stat-content">
                        <h3>{totalSessions}</h3>
                        <p>Total Recorded</p>
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
                                <th>Date / Time</th>
                                <th>Status</th>
                                <th>Session ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentHistory.length > 0 ? (
                                recentHistory.map((record) => (
                                    <tr key={record.id}>
                                        <td>{new Date(record.timestamp).toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge ${record.status === 'present' ? 'completed' : 'absent'}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td>{record.session}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
