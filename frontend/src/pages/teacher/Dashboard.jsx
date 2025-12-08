import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Calendar, TrendingUp, Clock, ArrowRight, MoreVertical, Plus, QrCode, Activity, X } from 'lucide-react';
import useTeacher from '../../hooks/useTeacher';
import useAuth from '../../hooks/useAuth';
import { getCourses, getPrograms, getDays, getSections, createSection, createSchedule } from '../../api/academic';
import './Dashboard.css';

const AddClassModal = ({ isOpen, onClose, onClassAdded }) => {
    const [step, setStep] = useState(1); // 1: Section, 2: Course & Schedule
    const [loading, setLoading] = useState(false);

    // Data Sources
    const [courses, setCourses] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [days, setDays] = useState([]);
    const [mySections, setMySections] = useState([]);

    // Form State
    const [selectedSectionId, setSelectedSectionId] = useState(''); // 'new' or ID
    const [newSectionData, setNewSectionData] = useState({ program: '', year_level: '' });
    const [scheduleData, setScheduleData] = useState({
        course: '',
        days: [], // IDs
        start_time: '',
        end_time: '',
        room: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            const [cRes, pRes, dRes, sRes] = await Promise.all([
                getCourses(), getPrograms(), getDays(), getSections()
            ]);
            setCourses(cRes.data);
            setPrograms(pRes.data);
            setDays(dRes.data);
            setMySections(sRes.data);
        } catch (err) {
            console.error("Failed to fetch form data", err);
        }
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let sectionId = selectedSectionId;

            // 1. Create Section if needed
            if (selectedSectionId === 'new') {
                const secRes = await createSection(newSectionData);
                sectionId = secRes.data.id;
            }

            // 2. Create Schedule
            await createSchedule({
                course: scheduleData.course,
                section: sectionId,
                days: scheduleData.days,
                start_time: scheduleData.start_time,
                end_time: scheduleData.end_time,
                room: scheduleData.room
            });

            onClassAdded();
            onClose();
            // Reset
            setStep(1);
            setSelectedSectionId('');
            setNewSectionData({ program: '', year_level: '' });
            setScheduleData({ course: '', days: [], start_time: '', end_time: '', room: '' });

        } catch (err) {
            console.error(err);
            alert("Failed to create class. Please checks inputs.");
        } finally {
            setLoading(false);
        }
    };

    const toggleDay = (dayId) => {
        setScheduleData(prev => {
            const newDays = prev.days.includes(dayId)
                ? prev.days.filter(d => d !== dayId)
                : [...prev.days, dayId];
            return { ...prev, days: newDays };
        });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="modal-title">Add New Class</h3>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <form onSubmit={handleCreateClass}>
                    {/* Section Selection */}
                    <div className="form-section">
                        <label className="form-label">Section</label>
                        <select
                            className="form-select"
                            value={selectedSectionId}
                            onChange={(e) => setSelectedSectionId(e.target.value)}
                            required
                        >
                            <option value="">Select a Section...</option>
                            {mySections.map(s => (
                                <option key={s.id} value={s.id}>{s.section_name}</option>
                            ))}
                            <option value="new">+ Create New Section</option>
                        </select>

                        {selectedSectionId === 'new' && (
                            <div className="subsection">
                                <div className="form-group">
                                    <label className="form-label text-sm">Program</label>
                                    <select
                                        className="form-select"
                                        value={newSectionData.program}
                                        onChange={(e) => setNewSectionData({ ...newSectionData, program: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Program</option>
                                        {programs.map(p => (
                                            <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group mt-2">
                                    <label className="form-label text-sm">Year Level</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        min="1" max="5"
                                        value={newSectionData.year_level}
                                        onChange={(e) => setNewSectionData({ ...newSectionData, year_level: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Class Details */}
                    <div className="form-section">
                        <label className="form-label">Class Details</label>

                        <div className="form-group mb-4">
                            <select
                                className="form-select"
                                value={scheduleData.course}
                                onChange={(e) => setScheduleData({ ...scheduleData, course: e.target.value })}
                                required
                            >
                                <option value="">Select Course</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label text-sm">Schedule Days</label>
                            <div className="day-selector">
                                {days.map(day => (
                                    <button
                                        key={day.id}
                                        type="button"
                                        onClick={() => toggleDay(day.id)}
                                        className={`day-pill ${scheduleData.days.includes(day.id) ? 'selected' : ''}`}
                                    >
                                        {day.name.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label text-sm">Room</label>
                            <input
                                type="text"
                                className="form-input"
                                value={scheduleData.room}
                                onChange={(e) => setScheduleData({ ...scheduleData, room: e.target.value })}
                                placeholder="e.g. Room 305"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div>
                                <label className="form-label text-sm">Start Time</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={scheduleData.start_time}
                                    onChange={(e) => setScheduleData({ ...scheduleData, start_time: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label text-sm">End Time</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={scheduleData.end_time}
                                    onChange={(e) => setScheduleData({ ...scheduleData, end_time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                        >
                            {loading ? 'Creating...' : 'Create Class'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { auth } = useAuth();
    const { sessions, schedules, loading, refreshData } = useTeacher();
    const navigate = useNavigate();
    const [showAddClass, setShowAddClass] = useState(false);

    if (loading) return <div className="loading-state">Loading dashboard...</div>;

    const totalStudents = schedules?.reduce((acc, sch) => acc + (sch.student_count || 0), 0) || 0;
    const totalClasses = schedules?.length || 0;
    const activeSessions = sessions?.filter(s => s.is_active).length || 0;

    const stats = [
        { title: 'Total Students', value: totalStudents.toString(), icon: Users, color: '#5465FF', trend: 'Enrolled' },
        { title: 'Active Classes', value: totalClasses.toString(), icon: BookOpen, color: '#FFB020', trend: 'Total' },
        { title: 'Live Sessions', value: activeSessions.toString(), icon: Activity, color: '#00E096', trend: 'Now' },
    ];

    const recentSessions = sessions?.slice(0, 5) || [];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back, {auth.user?.username || 'Professor'}!</p>
                </div>
                <div className="date-display">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-grid">
                <button
                    className="action-card primary"
                    onClick={() => setShowAddClass(true)}
                >
                    <Plus size={24} />
                    <span>Add New Class</span>
                </button>
                <button
                    className="action-card secondary"
                    onClick={() => navigate('/teacher/generate-qr')}
                >
                    <QrCode size={24} className="text-purple-600" />
                    <span>Generate QR</span>
                </button>
                <button
                    className="action-card secondary"
                    onClick={() => navigate('/teacher/live-attendance')}
                >
                    <Activity size={24} className="text-green-600" />
                    <span>Live Monitor</span>
                </button>
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
                {/* Recent Activity */}
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Recent Sessions</h2>
                    </div>
                    <div className="activity-list">
                        {recentSessions.length > 0 ? (
                            recentSessions.map((session) => (
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
                            <p className="empty-state">No recent sessions found.</p>
                        )}
                    </div>
                    <div className="card-footer">
                        <button className="view-all-btn" onClick={() => navigate('/teacher/history')}>View All History <ArrowRight size={16} /></button>
                    </div>
                </div>

                {/* My Classes */}
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">My Classes</h2>
                    </div>
                    <div className="classes-list">
                        {schedules && schedules.map((schedule) => (
                            <div key={schedule.id} className="class-item" onClick={() => navigate(`/teacher/classes/${schedule.id}`)}>
                                <div className="class-info">
                                    <h4>{schedule.course_name}</h4>
                                    <p>{schedule.course_code} • {schedule.section_name}</p>
                                </div>
                                <div className="class-meta">
                                    <span className="text-xs text-gray-500">{schedule.day_names?.join(', ')}</span>
                                </div>
                            </div>
                        ))}
                        {(!schedules || schedules.length === 0) && (
                            <p className="empty-state">No classes assigned. Click "Add New Class" to get started.</p>
                        )}
                    </div>
                </div>
            </div>

            <AddClassModal
                isOpen={showAddClass}
                onClose={() => setShowAddClass(false)}
                onClassAdded={() => {
                    refreshData(); // Refresh schedules
                }}
            />
        </div>
    );
};

export default Dashboard;
