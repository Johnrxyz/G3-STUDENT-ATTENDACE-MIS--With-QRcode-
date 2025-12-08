import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Activity, GraduationCap } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { getAdminAnalytics } from '../../api/attendance';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await getAdminAnalytics(axiosPrivate);
                setAnalytics(res.data);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [axiosPrivate]);

    if (loading) return <div className="p-8 text-center">Loading admin dashboard...</div>;

    const stats = [
        { title: 'Total Students', value: analytics?.total_students || 0, icon: GraduationCap, color: '#5465FF' },
        { title: 'Total Teachers', value: analytics?.total_teachers || 0, icon: BookOpen, color: '#FFB020' },
        { title: 'Total Sessions', value: analytics?.total_sessions || 0, icon: Activity, color: '#00E096' },
        { title: 'System Users', value: (analytics?.total_students || 0) + (analytics?.total_teachers || 0), icon: Users, color: '#FF5252' },
    ];

    return (
        <div className="admin-dashboard-container">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Admin Dashboard</h1>
                    <p className="admin-welcome">Welcome, Administrator. System overview.</p>
                </div>
            </div>

            <div className="admin-stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="admin-stat-card">
                        <div className="admin-icon-wrapper" style={{ backgroundColor: `${stat.color}15` }}>
                            <stat.icon size={28} color={stat.color} />
                        </div>
                        <div className="admin-stat-content">
                            <h3>{stat.value}</h3>
                            <p>{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-content mt-large">
                <div className="activity-section">
                    <h2 className="section-title">Recent System Activity</h2>
                    <div className="activity-list">
                        {analytics?.recent_activity && analytics.recent_activity.length > 0 ? (
                            analytics.recent_activity.map(record => (
                                <div key={record.id} className="activity-item">
                                    <div className="activity-info">
                                        <p className="activity-student">{record.student_name}</p>
                                        <p className="activity-status">Marked {record.status} for Class Session</p>
                                    </div>
                                    <span className="activity-time">
                                        {new Date(record.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="no-activity">No recent activity recorded.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
