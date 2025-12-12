import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Clock, Calendar, RefreshCw, CheckCircle, Users, PlayCircle } from 'lucide-react';
import useTeacher from '../../hooks/useTeacher';
import { getSessionRecords, simulateScan } from '../../api/attendance';
import { formatTime } from '../../utils/dateUtils';
import './GenerateQR.css';

const GenerateQR = () => {
    const { id } = useParams();
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [dateTime, setDateTime] = useState(new Date());
    const [isActive, setIsActive] = useState(false);
    const [timer, setTimer] = useState(120); // 2 minutes in seconds
    const [qrToken, setQrToken] = useState('');

    // Live Attendance State
    const [attendees, setAttendees] = useState([]);
    const [simulating, setSimulating] = useState(false);

    // Real data
    const { schedules, sessions, handleOpenSession, handleCloseSession } = useTeacher();

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Restore state from active sessions
    useEffect(() => {
        if (!sessions || !schedules) return;

        let targetSession = null;

        // If ID param provided, try to find active session for this schedule
        if (id) {
            targetSession = sessions.find(s => s.schedule === parseInt(id) && !s.closed_at);
            if (!targetSession && schedules.some(s => s.id === parseInt(id))) {
                setSelectedSubjectId(parseInt(id));
            }
        }

        // Auto-restore logic if manually selected or general restoration needed
        if (!targetSession && selectedSubjectId) {
            targetSession = sessions.find(s => s.schedule === selectedSubjectId && !s.closed_at);
        }

        if (targetSession) {
            setSelectedSubjectId(targetSession.schedule);
            setQrToken(targetSession.qr_token);
            setIsActive(true);

            if (targetSession.qr_expires_at) {
                const expiry = new Date(targetSession.qr_expires_at);
                const now = new Date();
                const diff = Math.floor((expiry - now) / 1000);
                setTimer(diff > 0 ? diff : 0);
            }
        }
    }, [sessions, schedules, id, selectedSubjectId]);

    // Timer logic - No auto-hide
    useEffect(() => {
        let interval;
        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, timer]);

    // Poll for Live Attendance
    useEffect(() => {
        let pollInterval;
        if (isActive && selectedSubjectId) {
            const session = sessions?.find(s => s.schedule === selectedSubjectId && !s.closed_at);
            if (session) {
                // Initial fetch
                fetchAttendees(session.id);
                // Poll every 3 seconds
                pollInterval = setInterval(() => fetchAttendees(session.id), 3000);
            }
        }
        return () => clearInterval(pollInterval);
    }, [isActive, selectedSubjectId, sessions]);

    const fetchAttendees = async (sessionId) => {
        try {
            const res = await getSessionRecords(sessionId);
            setAttendees(res.data);
        } catch (err) {
            console.error("Failed to fetch attendees", err);
        }
    };

    const handleSubjectClick = async (schedule) => {
        setSelectedSubjectId(schedule.id);

        // Check if session already active locally first
        const existingSession = sessions?.find(s => s.schedule === schedule.id && !s.closed_at);
        if (existingSession) {
            setQrToken(existingSession.qr_token);
            setIsActive(true);
            if (existingSession.qr_expires_at) {
                const expiry = new Date(existingSession.qr_expires_at);
                const now = new Date();
                const diff = Math.floor((expiry - now) / 1000);
                setTimer(diff > 0 ? diff : 0);
            }
            return;
        }

        if (!window.confirm("Are you sure you want to start a new attendance session for this class?")) return;

        try {
            const response = await handleOpenSession(schedule.id);
            setQrToken(response.qr_token || response.id);
            setIsActive(true);
            setTimer(30 * 60);
            setAttendees([]); // Reset attendees
        } catch (err) {
            console.error(err);
            alert('Failed to open session: ' + (err.response?.data?.error || err.message));
        }
    };

    const handleEndSession = async () => {
        if (!selectedSubjectId) return;

        const session = sessions?.find(s => s.schedule === selectedSubjectId && !s.closed_at);
        if (session) {
            try {
                await handleCloseSession(session.id);
            } catch (err) {
                console.error(err);
                alert("Failed to close session");
                return;
            }
        }
        setIsActive(false);
        setQrToken('');
        setTimer(0);
        setSelectedSubjectId(null);
        setAttendees([]);
    };

    const handleSimulateScan = async () => {
        const session = sessions?.find(s => s.schedule === selectedSubjectId && !s.closed_at);
        if (!session) return;

        setSimulating(true);
        try {
            const res = await simulateScan(session.id);
            if (res.data.student) {
                // Toast or just let polling update
                // console.log("Simulated scan for", res.data.student);
                fetchAttendees(session.id); // Immediate refresh
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Simulation failed: " + (err.response?.data?.error || err.message));
        } finally {
            setSimulating(false);
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // formatTimeString removed in favor of imported formatTime

    return (
        <div className="qr-page">
            <h1 className="page-title">Generate QR Code</h1>

            <div className="qr-grid">
                <div className="controls-section">
                    <div className="datetime-display">
                        <div className="datetime-item">
                            <Calendar size={24} />
                            <span className="datetime-text">{formatDate(dateTime)}</span>
                        </div>
                        <div className="datetime-item">
                            <Clock size={24} />
                            <span className="datetime-text">{formatTime(dateTime)}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="section-label">Select a Class to Generate QR</h3>
                        <div className="subject-list">
                            {schedules && schedules.length > 0 ? (
                                schedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className={`subject-card ${selectedSubjectId === schedule.id ? 'active' : ''}`}
                                        onClick={() => handleSubjectClick(schedule)}
                                    >
                                        <span className="subject-code">{schedule.course_code || schedule.section_name} - {schedule.section_name}</span>
                                        <h4 className="subject-name">{schedule.course_name || 'Class ' + schedule.id}</h4>
                                        <div className="subject-meta">
                                            {schedule.day_names?.join(', ')} {formatTime(schedule.start_time)}-{formatTime(schedule.end_time)}
                                        </div>
                                        {selectedSubjectId === schedule.id && <CheckCircle size={20} color="#5465FF" style={{ marginLeft: 'auto' }} />}
                                    </div>
                                ))
                            ) : (
                                <p className="subject-meta">No classes found.</p>
                            )}
                        </div>
                    </div>

                    {/* Live Attendees List */}
                    {isActive && (
                        <div className="attendees-section">
                            <div className="attendees-header">
                                <h3 className="section-label flex items-center gap-2" style={{ margin: 0 }}>
                                    <Users size={18} /> Live Attendees ({attendees.length})
                                </h3>
                                <button
                                    onClick={handleSimulateScan}
                                    disabled={simulating}
                                    className="demo-btn"
                                    title="Demo Mode: Simulate a student scan"
                                >
                                    <PlayCircle size={14} /> {simulating ? '...' : 'Demo Scan'}
                                </button>
                            </div>
                            <div className="attendees-list">
                                {attendees.length > 0 ? (
                                    attendees.map(record => (
                                        <div key={record.id} className="attendee-item">
                                            <div>
                                                <p className="attendee-name">{record.student_name}</p>
                                                <p className="attendee-id">{record.student_number}</p>
                                            </div>
                                            <span className="attendee-time">
                                                {formatTime(new Date(record.timestamp))}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="placeholder-text" style={{ fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>Waiting for students to scan...</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="display-section">
                    {isActive && qrToken ? (
                        <>
                            <div className="qr-container">
                                <QRCodeCanvas value={qrToken} size={330} level={"H"} />
                            </div>

                            <div className={`timer-display ${timer < 30 ? 'urgent' : ''}`}>
                                <p className="timer-label">{timer === 0 ? 'Session Expired' : 'Expires in'}</p>
                                <p className="timer-value">
                                    {formatDuration(timer)}
                                </p>
                            </div>

                            <button
                                className="end-session-btn"
                                onClick={handleEndSession}
                            >
                                End Session
                            </button>
                        </>
                    ) : (
                        <div className="placeholder-display">
                            <div className="placeholder-icon">
                                <RefreshCw size={64} color="#D1D5DB" />
                            </div>
                            <p className="placeholder-text">Click a class card to generate a QR code</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateQR;
