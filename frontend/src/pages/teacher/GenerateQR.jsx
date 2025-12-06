import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { Clock, Calendar, RefreshCw, CheckCircle } from 'lucide-react';
import './GenerateQR.css';

const GenerateQR = () => {
    const { id } = useParams();
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [dateTime, setDateTime] = useState(new Date());
    const [isActive, setIsActive] = useState(false);
    const [timer, setTimer] = useState(120); // 2 minutes in seconds
    const [qrData, setQrData] = useState('');

    // Mock Subjects
    const subjects = [
        { id: 1, name: 'Introduction to Programming', code: 'IT101' },
        { id: 2, name: 'Data Structures and Algorithms', code: 'IT102' },
        { id: 3, name: 'Web Development', code: 'IT103' },
        { id: 4, name: 'Database Management Systems', code: 'IT104' },
        { id: 5, name: 'Operating Systems', code: 'IT105' },
        { id: 6, name: 'Networking 1', code: 'IT106' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let interval;
        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsActive(false);
            setTimer(120);
        }
        return () => clearInterval(interval);
    }, [isActive, timer]);

    const handleSubjectClick = (subjectId) => {
        setSelectedSubjectId(subjectId);

        const data = JSON.stringify({
            subjectId: subjectId,
            timestamp: new Date().toISOString(),
            validUntil: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
        });

        setQrData(data);
        setIsActive(true);
        setTimer(120);
    };

    useEffect(() => {
        if (id) {
            const subjectId = parseInt(id);
            const subject = subjects.find(s => s.id === subjectId);
            if (subject) {
                handleSubjectClick(subjectId);
            }
        }
    }, [id]);

    const formatTime = (seconds) => {
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

    const formatTimeString = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

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
                            <span className="datetime-text">{formatTimeString(dateTime)}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="section-label">Select a Subject to Generate QR</h3>
                        <div className="subject-list">
                            {subjects.map((sub) => (
                                <div
                                    key={sub.id}
                                    className={`subject-card ${selectedSubjectId === sub.id ? 'active' : ''}`}
                                    onClick={() => handleSubjectClick(sub.id)}
                                >
                                    <span className="subject-code">{sub.code}</span>
                                    <h4 className="subject-name">{sub.name}</h4>
                                    {selectedSubjectId === sub.id && <CheckCircle size={20} color="var(--primary-blue)" style={{ marginLeft: 'auto' }} />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="display-section">
                    {isActive ? (
                        <>
                            <div className="qr-container">
                                <QRCodeCanvas value={qrData} size={330} level={"H"} />
                            </div>

                            <div className={`timer-display ${timer < 30 ? 'urgent' : ''}`}>
                                <p className="timer-label">Expires in</p>
                                <p className="timer-value">
                                    {formatTime(timer)}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="placeholder-display">
                            <div className="placeholder-icon">
                                <RefreshCw size={64} color="#D1D5DB" />
                            </div>
                            <p className="placeholder-text">Click a subject card to generate a QR code</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateQR;
