import React, { useState, useEffect } from 'react';
import { UserCheck, Clock, AlertCircle, MoreVertical, Check, X, Wifi, User } from 'lucide-react';
import './LiveAttendance.css';

const LiveAttendance = () => {
    const [attendanceLog, setAttendanceLog] = useState([]);
    const [latestScan, setLatestScan] = useState(null);
    const [stats, setStats] = useState({ present: 0, late: 0, invalid: 0 });

    const mockStudents = [
        { id: '1234-5678', name: 'Charles Deo', section: '4A', img: null },
        { id: '8765-4321', name: 'Jane Smith', section: '4A', img: null },
        { id: '1122-3344', name: 'John Doe', section: '4A', img: null },
        { id: '5566-7788', name: 'Sarah Connor', section: '4A', img: null },
        { id: '9988-7766', name: 'Mike Ross', section: '4A', img: null },
    ];

    useEffect(() => {
        let scanCount = 0;
        const maxScans = 15;

        const interval = setInterval(() => {
            if (scanCount >= maxScans) {
                clearInterval(interval);
                return;
            }

            const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
            const status = Math.random() > 0.8 ? 'Late' : (Math.random() > 0.9 ? 'Invalid' : 'Present');

            const newRecord = {
                ...randomStudent,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                status: status,
                scanId: Date.now()
            };

            setLatestScan(newRecord);
            setAttendanceLog(prev => [newRecord, ...prev]);

            setStats(prev => ({
                ...prev,
                [status.toLowerCase()]: prev[status.toLowerCase()] + 1
            }));

            scanCount++;

        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present': return { bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9', icon: <UserCheck size={18} /> };
            case 'Late': return { bg: '#FFF3E0', text: '#EF6C00', border: '#FFE0B2', icon: <Clock size={18} /> };
            case 'Invalid': return { bg: '#FFEBEE', text: '#C62828', border: '#FFCDD2', icon: <AlertCircle size={18} /> };
            default: return { bg: '#F5F5F5', text: '#757575', border: '#E0E0E0', icon: null };
        }
    };

    return (
        <div className="live-monitor-container">
            <div className="monitor-header">
                <div>
                    <div className="live-badge">
                        <span className="pulse-dot"></span> Live Monitor
                    </div>
                    <h1 className="monitor-title">IT101 - Introduction to Programming</h1>
                    <p className="monitor-subtitle">Section 4A • Room 302</p>
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
                                <div className={`spotlight-status ${latestScan.status.toLowerCase()}`}>
                                    {latestScan.status}
                                </div>
                                <div className="student-image-large">
                                    <User size={64} color="#94A3B8" />
                                </div>
                                <div className="spotlight-details">
                                    <h2 className="spotlight-name">{latestScan.name}</h2>
                                    <p className="spotlight-id">{latestScan.id}</p>
                                    <p className="spotlight-time">Scanned at {latestScan.time}</p>
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
                                <p className="stat-label">Invalid</p>
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
                                        <div key={record.scanId} className="feed-item">
                                            <div className="feed-avatar">
                                                <User size={20} color="#64748B" />
                                            </div>
                                            <div className="feed-info">
                                                <h4 className="feed-name">{record.name}</h4>
                                                <p className="feed-id">{record.id}</p>
                                            </div>
                                            <div className="feed-meta">
                                                <span className="feed-time">{record.time}</span>
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
