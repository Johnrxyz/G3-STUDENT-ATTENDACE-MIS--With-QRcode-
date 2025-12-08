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

            <div className="admin-content-grid mt-8">
                {/* Can add more detailed sections here later */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Recent System Activity</h2>
                    <div className="space-y-4">
                        {analytics?.recent_activity && analytics.recent_activity.length > 0 ? (
                            analytics.recent_activity.map(record => (
                                <div key={record.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{record.student_name}</p>
                                        <p className="text-sm text-gray-500">Marked {record.status} for Class Session</p>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(record.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No recent activity recorded.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
