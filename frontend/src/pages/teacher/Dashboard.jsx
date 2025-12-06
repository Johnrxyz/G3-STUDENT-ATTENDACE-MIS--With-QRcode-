import React from 'react';
import { Users, BookOpen, Calendar, TrendingUp, Clock, ArrowRight, MoreVertical } from 'lucide-react';
import useTeacher from '../../hooks/useTeacher';
import useAuth from '../../hooks/useAuth';
import './Dashboard.css';

const Dashboard = () => {
    const { auth } = useAuth();
    const { sessions, schedules, loading } = useTeacher();

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    // Calculate detailed stats
    const totalSections = schedules?.length || 0;
    const totalSessions = sessions?.length || 0;

    // Calculate unique students (approximate if we don't have full student list per section readily available in this hook)
    // schedules has 'student_count' from serializer
    const totalStudents = schedules?.reduce((acc, sch) => acc + (sch.student_count || 0), 0) || 0;

    const stats = [
        { title: 'Total Students', value: totalStudents.toString(), icon: Users, color: '#5465FF', trend: 'Enrolled' },
        { title: 'My Classes', value: totalSections.toString(), icon: BookOpen, color: '#FFB020', trend: 'Active' },
        { title: 'Total Sessions', value: totalSessions.toString(), icon: TrendingUp, color: '#00E096', trend: 'Recorded' },
        { title: 'Today', value: '0', icon: Calendar, color: '#FF5252', trend: 'Classes' }, // Need schedule logic for 'Today'
    ];

    const recentActivity = sessions.slice(0, 5); // Assuming sessions are sorted by date desc

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back, {auth.user?.username || 'Professor'}! Here's what's happening today.</p>
                </div>
                <div className="date-display">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15` }}>
                            <stat.icon size={24} color={stat.color} />
                        </div>
                        <div className="stat-info">
                            <h3 className="stat-value">{stat.value}</h3>
                            <p className="stat-title">{stat.title}</p>
                        </div>
                        <div className="stat-trend">
                            <span className="trend-badge">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-content-grid">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Recent Sessions</h2>
                        <button className="icon-btn"><MoreVertical size={20} /></button>
                    </div>
                    <div className="activity-list">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((session) => (
                                <div key={session.id} className="activity-item">
                                    <div className="activity-icon">
                                        <Clock size={18} />
                                    </div>
                                    <div className="activity-details">
                                        <h4>{session.course_name || 'Class Session'}</h4>
                                        <p>{new Date(session.created_at || session.date).toLocaleString()}</p>
                                    </div>
                                    <span className={`status-badge ${session.is_active ? 'in-progress' : 'completed'}`}>
                                        {session.is_active ? 'Active' : 'Ended'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-gray-500">No recent sessions found.</p>
                        )}
                    </div>
                    <div className="card-footer">
                        <button className="view-all-btn">View All History <ArrowRight size={16} /></button>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">My Classes</h2>
                        <button className="icon-btn"><Calendar size={20} /></button>
                    </div>
                    <div className="classes-list">
                        {schedules && schedules.map((schedule) => (
                            <div key={schedule.id} className="class-item">
                                <div className="class-info">
                                    <h4>{schedule.course_name}</h4>
                                    <p>{schedule.course_code} • {schedule.section_name}</p>
                                </div>
                                <div className="class-meta">
                                    <span className="text-xs text-gray-500">{schedule.day_names?.join(', ')}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card-footer">
                        {/* <button className="view-all-btn">View Schedule <ArrowRight size={16} /></button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
