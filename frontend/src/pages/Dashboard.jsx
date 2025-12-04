import React from 'react';
import { Users, BookOpen, Calendar, TrendingUp, Clock, ArrowRight, MoreVertical } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const stats = [
        { title: 'Total Students', value: '156', icon: Users, color: '#5465FF', trend: '+12%' },
        { title: 'Total Classes', value: '8', icon: BookOpen, color: '#FFB020', trend: 'Active' },
        { title: 'Avg. Attendance', value: '92%', icon: TrendingUp, color: '#00E096', trend: '+5%' },
        { title: 'Scheduled Today', value: '3', icon: Calendar, color: '#FF5252', trend: 'Classes' },
    ];

    const recentActivity = [
        { id: 1, class: 'Web Development', time: '10:30 AM', status: 'Completed', students: 42 },
        { id: 2, class: 'Database Systems', time: '02:00 PM', status: 'In Progress', students: 38 },
        { id: 3, class: 'Data Structures', time: 'Yesterday', status: 'Completed', students: 45 },
    ];

    const upcomingClasses = [
        { id: 1, subject: 'Operating Systems', code: 'IT105', time: '09:00 AM - 10:30 AM', room: 'Lab 3' },
        { id: 2, subject: 'Networking 1', code: 'IT106', time: '11:00 AM - 12:30 PM', room: 'Room 402' },
        { id: 3, subject: 'Web Development', code: 'IT103', time: '02:00 PM - 03:30 PM', room: 'Lab 1' },
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back, Professor! Here's what's happening today.</p>
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
                        <h2 className="card-title">Recent Activity</h2>
                        <button className="icon-btn"><MoreVertical size={20} /></button>
                    </div>
                    <div className="activity-list">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className="activity-icon">
                                    <Clock size={18} />
                                </div>
                                <div className="activity-details">
                                    <h4>{activity.class}</h4>
                                    <p>{activity.time} • {activity.students} Students</p>
                                </div>
                                <span className={`status-badge ${activity.status.toLowerCase().replace(' ', '-')}`}>
                                    {activity.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="card-footer">
                        <button className="view-all-btn">View All History <ArrowRight size={16} /></button>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Upcoming Classes</h2>
                        <button className="icon-btn"><Calendar size={20} /></button>
                    </div>
                    <div className="classes-list">
                        {upcomingClasses.map((cls) => (
                            <div key={cls.id} className="class-item">
                                <div className="class-time">
                                    <span>{cls.time.split(' - ')[0]}</span>
                                </div>
                                <div className="class-info">
                                    <h4>{cls.subject}</h4>
                                    <p>{cls.code} • {cls.room}</p>
                                </div>
                                <button className="action-btn">Start</button>
                            </div>
                        ))}
                    </div>
                    <div className="card-footer">
                        <button className="view-all-btn">View Schedule <ArrowRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
