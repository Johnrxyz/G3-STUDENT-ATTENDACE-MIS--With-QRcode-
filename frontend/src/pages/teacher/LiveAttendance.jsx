import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, AlertCircle, MoreVertical, Check, X, Wifi, User } from 'lucide-react';
import useTeacher from '../../hooks/useTeacher';
import { getSessionRecords } from '../../api/attendance';
import './LiveAttendance.css';

const LiveAttendance = () => {
    const { sessions, loading: sessionsLoading } = useTeacher();
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [attendanceLog, setAttendanceLog] = useState([]);
    const [latestScan, setLatestScan] = useState(null);
    const [stats, setStats] = useState({ present: 0, late: 0, invalid: 0 });

    // Auto-select first active session
    useEffect(() => {
        if (sessions && sessions.length > 0 && !selectedSessionId) {
            // Find active
            const active = sessions.find(s => s.is_active);
            if (active) setSelectedSessionId(active.id);
        }
    }, [sessions, selectedSessionId]);

    // Poll for records
    useEffect(() => {
        if (!selectedSessionId) return;

        const fetchRecords = async () => {
            try {
                const res = await getSessionRecords(selectedSessionId);
                const records = res.data; // Assuming list of records

                // Diff to find new scans for "Latest Scan"
                // For simplicity, just set log.
                // But we want to animate/highlight latest.
                // Let's just use the first one if sorted by time desc.
                // Assuming backend sort? Or sort here.
                const sorted = records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                setAttendanceLog(sorted);
                if (sorted.length > 0) {
                    setLatestScan(sorted[0]);
                }

                // Calc stats
                const present = records.filter(r => r.status === 'present').length;
                const late = records.filter(r => r.status === 'late').length;
                const invalid = records.filter(r => r.status === 'absent').length; // or invalid?
                setStats({ present, late, invalid });

            } catch (err) {
                console.error("Error polling attendance:", err);
            }
        };

        fetchRecords(); // Initial
        const interval = setInterval(fetchRecords, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [selectedSessionId]);


    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'present': return { bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9', icon: <UserCheck size={18} /> };
            case 'late': return { bg: '#FFF3E0', text: '#EF6C00', border: '#FFE0B2', icon: <Clock size={18} /> };
            case 'absent': return { bg: '#FFEBEE', text: '#C62828', border: '#FFCDD2', icon: <AlertCircle size={18} /> };
            default: return { bg: '#F5F5F5', text: '#757575', border: '#E0E0E0', icon: null };
        }
    };

    if (sessionsLoading) return <div className="p-8">Loading...</div>;
    if (!selectedSessionId) return <div className="p-8">No active session found. Start a session from "Generate QR".</div>;

    const currentSession = sessions.find(s => s.id === selectedSessionId);

    return (
        <div className="live-monitor-container">
            <div className="monitor-header">
                <div>
                    <div className="live-badge">
                        <span className="pulse-dot"></span> Live Monitor
                    </div>
                    <h1 className="monitor-title">{currentSession?.course_name || 'Class Session'}</h1>
                    <p className="monitor-subtitle">{currentSession?.section_name || 'Section'} • {currentSession?.date}</p>
                </div>
                <div className="connection-status">
                    <Wifi size={18} /> Connected
                </div>
            </div>

            <div className="monitor-grid">
                <div className="monitor-left">
                    <div className="spotlight-card">
                        <div className="spotlight-header">
                            <h3>Latest Scan</h3>
                            <span className="time-now">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        {latestScan ? (
                            <div className="spotlight-content">
                                <div className={`spotlight-status ${latestScan.status?.toLowerCase()}`}>
                                    {latestScan.status}
                                </div>
                                <div className="student-image-large">
                                    <User size={64} color="#94A3B8" />
                                </div>
                                <div className="spotlight-details">
                                    <h2 className="spotlight-name">{latestScan.student_name || 'Student'}</h2>
                                    <p className="spotlight-id">{latestScan.student_number || 'ID'}</p>
                                    <p className="spotlight-time">Scanned at {new Date(latestScan.timestamp).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="spotlight-empty">
                                <div className="radar-spinner"></div>
                                <p>Waiting for scans...</p>
                            </div>
                        )}
                    </div>

                    <div className="live-stats-grid">
                        <div className="live-stat-card present">
                            <div className="stat-icon-bg"><UserCheck size={20} /></div>
                            <div>
                                <p className="stat-label">Present</p>
                                <p className="stat-number">{stats.present}</p>
                            </div>
                        </div>
                        <div className="live-stat-card late">
                            <div className="stat-icon-bg"><Clock size={20} /></div>
                            <div>
                                <p className="stat-label">Late</p>
                                <p className="stat-number">{stats.late}</p>
                            </div>
                        </div>
                        <div className="live-stat-card absent">
                            <div className="stat-icon-bg"><AlertCircle size={20} /></div>
                            <div>
                                <p className="stat-label">Absent/Invalid</p>
                                <p className="stat-number">{stats.invalid}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="monitor-right">
                    <div className="feed-header">
                        <h3>Recent Scans</h3>
                        <span className="scan-count">{attendanceLog.length} records</span>
                    </div>
                    <div className="feed-list-container">
                        {attendanceLog.length > 0 ? (
                            <div className="feed-list">
                                {attendanceLog.map((record) => {
                                    const style = getStatusColor(record.status);
                                    return (
                                        <div key={record.id} className="feed-item">
                                            <div className="feed-avatar">
                                                <User size={20} color="#64748B" />
                                            </div>
                                            <div className="feed-info">
                                                <h4 className="feed-name">{record.student_name}</h4>
                                                <p className="feed-id">{record.student_number}</p>
                                            </div>
                                            <div className="feed-meta">
                                                <span className="feed-time">{new Date(record.timestamp).toLocaleTimeString()}</span>
                                                <span
                                                    className="feed-status"
                                                    style={{ color: style.text, backgroundColor: style.bg }}
                                                >
                                                    {record.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="feed-empty">
                                <p>No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveAttendance;
