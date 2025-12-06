import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, Filter, Download, ChevronLeft, ChevronRight, Search, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import './AttendanceHistory.css';

import useTeacher from '../../hooks/useTeacher';

const AttendanceHistory = () => {
    const { sessions, loading } = useTeacher();
    const [viewMode, setViewMode] = useState('list');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    if (loading) return <div className="p-8">Loading history...</div>;

    if (loading) return <div className="p-8">Loading history...</div>;

    const attendanceLogs = sessions.map(session => ({
        id: session.id,
        date: session.created_at || session.date, // 'YYYY-MM-DD'
        subject: session.course_name || 'Class',
        code: session.course_code || 'CODE',
        time: new Date(session.created_at || session.started_at || session.date).toLocaleTimeString(),
        total: session.total_students || 0,
        present: session.present_count || 0,
        absent: session.absent_count || 0,
        status: session.closed_at ? 'Completed' : 'In Progress' // Check closed_at instead of is_active
    }));

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);
    const daysArray = [...Array(days + firstDay).keys()].map(i => {
        if (i < firstDay) return null;
        return i - firstDay + 1;
    });

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    const isSameDay = (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const getClassesForDate = (day) => {
        if (!day) return [];
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return attendanceLogs.filter(log => log.date === dateStr);
    };

    return (
        <div className="history-container">
            <div className="history-header">
                <div>
                    <h1 className="page-title">Attendance History</h1>
                    <p className="page-subtitle">View and manage past attendance records</p>
                </div>
                <div className="header-actions">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} /> List
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                            onClick={() => setViewMode('calendar')}
                        >
                            <CalendarIcon size={18} /> Calendar
                        </button>
                    </div>
                    <button className="export-btn">
                        <Download size={18} /> Export Report
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="list-view">
                    <div className="filters-bar">
                        <div className="search-wrapper">
                            <Search size={20} className="search-icon" />
                            <input type="text" placeholder="Search subject or class code..." className="search-input" />
                        </div>
                        <div className="filter-group">
                            <button className="filter-btn">
                                <Filter size={18} /> Filter by Date
                            </button>
                            <button className="filter-btn">
                                <Filter size={18} /> Filter by Class
                            </button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Class / Subject</th>
                                    <th>Time</th>
                                    <th>Attendance</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td className="date-cell">
                                            {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td>
                                            <div className="subject-info">
                                                <span className="subject-name">{log.subject}</span>
                                                <span className="subject-code">{log.code}</span>
                                            </div>
                                        </td>
                                        <td className="time-cell">
                                            <Clock size={14} /> {log.time}
                                        </td>
                                        <td>
                                            <div className="attendance-stats">
                                                <div className="stat-pill present">
                                                    <CheckCircle size={12} /> {log.present}
                                                </div>
                                                <div className="stat-pill absent">
                                                    <XCircle size={12} /> {log.absent}
                                                </div>
                                                <span className="total-count">/ {log.total}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${log.status.toLowerCase().replace(' ', '-')}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="view-details-btn">View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="calendar-view">
                    <div className="calendar-container">
                        <div className="calendar-header">
                            <button className="month-nav-btn" onClick={() => changeMonth(-1)}>
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="current-month">
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button className="month-nav-btn" onClick={() => changeMonth(1)}>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <div className="calendar-grid">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="calendar-day-header">{day}</div>
                            ))}
                            {daysArray.map((day, index) => {
                                if (!day) return <div key={`empty-${index}`} className="calendar-day empty"></div>;
                                const classes = getClassesForDate(day);
                                const isSelected = isSameDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), selectedDate);
                                return (
                                    <div
                                        key={day}
                                        className={`calendar-day ${isSelected ? 'selected' : ''}`}
                                        onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                    >
                                        <span className="day-number">{day}</span>
                                        <div className="day-indicators">
                                            {classes.map((cls, idx) => (
                                                <div key={idx} className="class-dot" title={cls.subject}></div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="day-details-panel">
                        <h3 className="panel-title">
                            Classes on {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                        </h3>
                        <div className="day-classes-list">
                            {getClassesForDate(selectedDate.getDate()).length > 0 ? (
                                getClassesForDate(selectedDate.getDate()).map(cls => (
                                    <div key={cls.id} className="day-class-card">
                                        <div className="class-card-header">
                                            <h4>{cls.subject}</h4>
                                            <span className="class-code">{cls.code}</span>
                                        </div>
                                        <div className="class-card-time">
                                            <Clock size={14} /> {cls.time}
                                        </div>
                                        <div className="class-card-stats">
                                            <div className="stat-item">
                                                <Users size={14} />
                                                <span>{cls.present}/{cls.total} Present</span>
                                            </div>
                                            <span className={`status-text ${cls.status.toLowerCase().replace(' ', '-')}`}>
                                                {cls.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-classes">
                                    <p>No classes recorded for this date.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceHistory;
