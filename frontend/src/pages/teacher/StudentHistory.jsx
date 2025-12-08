import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { getSchedule } from '../../api/academic';
import { formatTime } from '../../utils/dateUtils';
import './StudentHistory.css';

const StudentHistory = () => {
    const { scheduleId, studentId } = useParams();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [loading, setLoading] = useState(true);
    const [schedule, setSchedule] = useState(null);
    const [student, setStudent] = useState(null);
    const [records, setRecords] = useState([]);
    const [stats, setStats] = useState({ present: 0, late: 0, absent: 0, total: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Schedule Info
                const schedRes = await getSchedule(scheduleId, axiosPrivate);
                setSchedule(schedRes.data);

                // 2. Fetch Student Info explicitly
                const studentRes = await axiosPrivate.get(`/student-profiles/${studentId}/`);
                setStudent(studentRes.data);

                // 3. Fetch Attendance Records filtered by student and schedule
                const recordsRes = await axiosPrivate.get(`/attendance/records/?schedule_id=${scheduleId}&student_id=${studentId}`);
                const data = recordsRes.data;

                // Sort by date desc
                data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setRecords(data);

                // Calc Stats
                const present = data.filter(r => r.status === 'present').length;
                const late = data.filter(r => r.status === 'late').length;
                const absent = data.filter(r => r.status === 'absent').length;
                setStats({ present, late, absent, total: data.length });

            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };

        if (scheduleId && studentId) {
            fetchData();
        }
    }, [scheduleId, studentId, axiosPrivate]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'present': return 'text-green-600 bg-green-50';
            case 'late': return 'text-orange-600 bg-orange-50';
            case 'absent': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    if (loading) return <div className="p-8 text-center">Loading history...</div>;

    return (
        <div className="student-history-page">
            <button
                onClick={() => navigate(-1)}
                className="back-btn"
            >
                <ArrowLeft size={18} /> Back to Class
            </button>

            <div className="history-header-card">
                <div className="student-profile-summary">
                    <div className="profile-icon">
                        <User size={40} color="#5465FF" />
                    </div>
                    <div>
                        <h1 className="student-history-name">
                            {student ? `${student.user?.firstname} ${student.user?.lastname}` : `Student #${studentId}`}
                        </h1>
                        <p className="student-history-id">{student?.student_number}</p>
                    </div>
                </div>

                <div className="history-class-info">
                    <h3>{schedule?.course_name}</h3>
                    <p>{schedule?.course_code} • {schedule?.section_name}</p>
                </div>
            </div>

            <div className="history-stats-row">
                <div className="stat-card">
                    <div className="stat-icon present"><CheckCircle size={20} /></div>
                    <div>
                        <span className="stat-value">{stats.present}</span>
                        <span className="stat-label">Present</span>
                    </div>
                </div>
                <div className="stat-card late">
                    <div className="stat-icon late"><Clock size={20} /></div>
                    <div>
                        <span className="stat-value">{stats.late}</span>
                        <span className="stat-label">Late</span>
                    </div>
                </div>
                <div className="stat-card absent">
                    <div className="stat-icon absent"><XCircle size={20} /></div>
                    <div>
                        <span className="stat-value">{stats.absent}</span>
                        <span className="stat-label">Absent</span>
                    </div>
                </div>
                <div className="stat-card total">
                    <div className="stat-icon"><Calendar size={20} /></div>
                    <div>
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Classes</span>
                    </div>
                </div>
            </div>

            <div className="records-list-container">
                <h2 className="records-title">Attendance Log</h2>
                {records.length > 0 ? (
                    <table className="records-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th>Session Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map(record => (
                                <tr key={record.id}>
                                    <td>
                                        {new Date(record.timestamp).toLocaleDateString(undefined, {
                                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-gray-400" />
                                            {formatTime(record.timestamp)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge-pill ${record.status.toLowerCase()}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="text-gray-500 text-sm">
                                        {record.session ? `Session #${record.session}` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-history">
                        <AlertCircle size={48} color="#CBD5E1" />
                        <p>No attendance records found for this student in this class.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentHistory;
