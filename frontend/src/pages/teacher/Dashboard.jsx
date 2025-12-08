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
        end_time: ''
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
                end_time: scheduleData.end_time
            });

            onClassAdded();
            onClose();
            // Reset
            setStep(1);
            setSelectedSectionId('');
            setNewSectionData({ program: '', year_level: '' });
            setScheduleData({ course: '', days: [], start_time: '', end_time: '' });

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Add New Class</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleCreateClass}>
                    {/* Section Selection */}
                    <div className="mb-6 space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">Section</label>
                        <select
                            className="w-full p-2 border rounded-lg"
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
                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Program</label>
                                    <select
                                        className="w-full p-2 border rounded"
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
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Year Level</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border rounded"
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
                    <div className="mb-6 space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">Class Details</label>

                        <div>
                            <select
                                className="w-full p-2 border rounded-lg"
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

                        <div>
                            <label className="text-xs text-gray-500 mb-2 block">Schedule Days</label>
                            <div className="flex flex-wrap gap-2">
                                {days.map(day => (
                                    <button
                                        key={day.id}
                                        type="button"
                                        onClick={() => toggleDay(day.id)}
                                        className={`px-3 py-1 text-sm rounded-full border ${scheduleData.days.includes(day.id)
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {day.name.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">Start Time</label>
                                <input
                                    type="time"
                                    className="w-full p-2 border rounded"
                                    value={scheduleData.start_time}
                                    onChange={(e) => setScheduleData({ ...scheduleData, start_time: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1">End Time</label>
                                <input
                                    type="time"
                                    className="w-full p-2 border rounded"
                                    value={scheduleData.end_time}
                                    onChange={(e) => setScheduleData({ ...scheduleData, end_time: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

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
            <div className="quick-actions-grid mb-8">
                <button
                    className="action-card bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setShowAddClass(true)}
                >
                    <div className="action-icon"><Plus size={24} /></div>
                    <span>Add New Class</span>
                </button>
                <button
                    className="action-card bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 from-purple-500 to-indigo-600"
                    onClick={() => navigate('/teacher/generate-qr')}
                >
                    <div className="action-icon text-purple-600"><QrCode size={24} /></div>
                    <span>Generate QR</span>
                </button>
                <button
                    className="action-card bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
                    onClick={() => navigate('/teacher/live-attendance')}
                >
                    <div className="action-icon text-green-600"><Activity size={24} /></div>
                    <span>Live Monitor</span>
                </button>
            </div>

            <div className="stats-grid mb-8">
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
                            <p className="p-4 text-gray-500">No recent sessions found.</p>
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
                            <div key={schedule.id} className="class-item group hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/teacher/classes/${schedule.id}`)}>
                                <div className="class-info">
                                    <h4 className="group-hover:text-blue-600">{schedule.course_name}</h4>
                                    <p>{schedule.course_code} • {schedule.section_name}</p>
                                </div>
                                <div className="class-meta">
                                    <span className="text-xs text-gray-500">{schedule.day_names?.join(', ')}</span>
                                </div>
                            </div>
                        ))}
                        {(!schedules || schedules.length === 0) && (
                            <p className="p-4 text-gray-500 text-sm">No classes assigned. Click "Add New Class" to get started.</p>
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
