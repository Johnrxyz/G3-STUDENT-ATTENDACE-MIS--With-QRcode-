import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { formatTime } from '../../utils/dateUtils';
import './SessionDetails.css';

const SessionDetails = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState(null);
    const [records, setRecords] = useState([]);
    const [stats, setStats] = useState({ present: 0, late: 0, absent: 0, total: 0 });

    useEffect(() => {
        const fetchSessionDetails = async () => {
            try {
                // 1. Fetch Session Records (which contain student info)
                // Using the specific endpoint for session monitoring/records if available or the general records filter
                // Let's use the 'monitoring' endpoint or 'records' endpoint from AttendanceSessionViewSet if possible
                // Looking at views.py, AttendanceSessionViewSet has a 'monitoring' action that returns details + records
                // Endpoint: /attendance/sessions/{id}/monitoring/

                const res = await axiosPrivate.get(`/attendance/sessions/${sessionId}/monitoring/`);
                const data = res.data;

                // Flatten records structure if needed or use as is
                // Monitoring returns { session_status, expires_at, total_present, total_late, records: [] }
                // We also need basic session info (Course name, date, etc). 
                // Monitoring endpoint might not return full Schedule info (Course name).
                // Let's check view.py again manually or make a separate call for session info.
                // The 'monitoring' endpoint uses the monitoring action which return specific dict.
                // It might lack course info.
                // Better to fetch session details first: /attendance/sessions/{id}/

                const sessionInfoRes = await axiosPrivate.get(`/attendance/sessions/${sessionId}/`);
                setSessionData(sessionInfoRes.data);

                setRecords(data.records);

                // Recalculate stats from records just to be sure or use ones from monitoring
                const present = data.records.filter(r => r.status === 'present').length;
                const late = data.records.filter(r => r.status === 'late').length;
                const absent = data.records.filter(r => r.status === 'absent').length; // Monitoring might not show absents if they are missing records?
                // Actually, monitoring action usually shows what's scanned. Absents depend on enrollment vs scans.
                // If the 'records' list only contains scans, we might miss absents unless we merge with enrollment.
                // However, AttendanceHistory view handled this via count.
                // Ideally, we want a list of ALL students and their status.
                // For now, let's display what we have. If 'absent' records aren't created until close, we might need to rely on that.
                // Assuming 'monitoring' or 'records' gives us what exists.

                setStats({
                    present,
                    late,
                    absent: data.total_students ? (data.total_students - present - late) : 0, // Approx if needed
                    total: data.total_students || 0
                });

            } catch (err) {
                console.error("Failed to fetch session details", err);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            fetchSessionDetails();
        }
    }, [sessionId, axiosPrivate]);

    if (loading) return <div className="p-8 text-center">Loading session details...</div>;
    if (!sessionData) return <div className="p-8 text-center">Session not found.</div>;

    return (
        <div className="session-details-page">
            <button
                onClick={() => navigate('/teacher/history')}
                className="back-btn"
            >
                <ArrowLeft size={18} /> Back to History
            </button>

            <div className="session-header-card">
                <div className="session-title-group">
                    <h1>{sessionData.course_name}</h1>
                    <p>{sessionData.course_code} • {sessionData.section_name}</p>
                </div>
                <div className="session-meta-grid">
                    <div className="meta-item">
                        <Calendar size={18} className="text-blue-500" />
                        <span>{new Date(sessionData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {/* Time might need to come from schedule info or created_at if not stored directly in convenient format */}
                    <div className="meta-item">
                        <Clock size={18} className="text-orange-500" />
                        <span>{formatTime(sessionData.started_at)} - {sessionData.closed_at ? formatTime(sessionData.closed_at) : 'In Progress'}</span>
                    </div>
                    {/* Room info might be in schedule_info string or need separate fetch, usually in schedule_info string in serializer */}
                    <div className="meta-item">
                        <MapPin size={18} className="text-red-500" />
                        <span>{sessionData.schedule_info?.split(' - ')?.[0] || 'Room N/A'}</span> {/* Fallback parsing */}
                    </div>
                </div>
            </div>

            <div className="session-stats-row">
                <div className="stat-card">
                    <div className="stat-icon present"><CheckCircle size={20} /></div>
                    <div>
                        <span className="stat-value">{sessionData.present_count}</span>
                        <span className="stat-label">Present</span>
                    </div>
                </div>
                <div className="stat-card late">
                    <div className="stat-icon late"><Clock size={20} /></div>
                    <div>
                        {/* We might need to calc late manually if serializer doesnt split it out, but let's assume records filtering works */}
                        <span className="stat-value">{records.filter(r => r.status === 'late').length}</span>
                        <span className="stat-label">Late</span>
                    </div>
                </div>
                <div className="stat-card absent">
                    <div className="stat-icon absent"><XCircle size={20} /></div>
                    <div>
                        <span className="stat-value">{sessionData.absent_count}</span>
                        <span className="stat-label">Absent</span>
                    </div>
                </div>
                <div className="stat-card total">
                    <div className="stat-icon"><Users size={20} /></div>
                    <div>
                        <span className="stat-value">{sessionData.total_students}</span>
                        <span className="stat-label">Total Students</span>
                    </div>
                </div>
            </div>

            <div className="attendees-list-container">
                <h2 className="section-title">Attendance Log</h2>

                {records.length > 0 ? (
                    <table className="attendees-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Student ID</th>
                                <th>Time Check-in</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="student-info-cell">
                                            <div className="avatar-placeholder">
                                                {record.student_name?.[0]}
                                            </div>
                                            <span>{record.student_name}</span>
                                        </div>
                                    </td>
                                    <td>{record.student_number}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            {formatTime(record.timestamp)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge-pill ${record.status?.toLowerCase()}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <AlertCircle size={48} color="#CBD5E1" />
                        <p>No attendance records found for this session.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionDetails;
