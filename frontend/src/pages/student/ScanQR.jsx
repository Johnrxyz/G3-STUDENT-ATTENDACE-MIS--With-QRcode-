import React, { useState } from 'react';
import { Camera, CheckCircle, XCircle, QrCode } from 'lucide-react';
import './ScanQR.css';

const ScanQR = () => {
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const handleStartScan = () => {
        setScanning(true);
        setScanResult(null);

        // Simulate QR scan after 2 seconds
        setTimeout(() => {
            // Simulate successful scan
            setScanResult({
                success: true,
                className: 'Mathematics 101',
                teacher: 'Prof. John Smith',
                time: new Date().toLocaleTimeString(),
                date: new Date().toLocaleDateString()
            });
            setScanning(false);
        }, 2000);
    };

    const handleReset = () => {
        setScanResult(null);
        setScanning(false);
    };

    return (
        <div className="scan-qr-page">
            <div className="page-header">
                <h1>Scan QR Code</h1>
                <p>Scan the QR code displayed by your teacher to mark your attendance</p>
            </div>

            <div className="scan-container">
                <div className="scan-card">
                    {!scanning && !scanResult && (
                        <div className="scan-initial">
                            <div className="qr-icon-wrapper">
                                <QrCode size={80} color="#2563EB" />
                            </div>
                            <h2>Ready to Scan</h2>
                            <p>Position the QR code within the camera frame</p>
                            <button className="scan-button" onClick={handleStartScan}>
                                <Camera size={20} />
                                Start Scanning
                            </button>
                        </div>
                    )}

                    {scanning && (
                        <div className="scan-active">
                            <div className="scanner-frame">
                                <div className="scanner-overlay">
                                    <div className="scanner-line"></div>
                                    <div className="corner top-left"></div>
                                    <div className="corner top-right"></div>
                                    <div className="corner bottom-left"></div>
                                    <div className="corner bottom-right"></div>
                                </div>
                            </div>
                            <p className="scanning-text">Scanning...</p>
                        </div>
                    )}

                    {scanResult && (
                        <div className={`scan-result ${scanResult.success ? 'success' : 'error'}`}>
                            <div className="result-icon">
                                {scanResult.success ? (
                                    <CheckCircle size={60} color="#10B981" />
                                ) : (
                                    <XCircle size={60} color="#EF4444" />
                                )}
                            </div>
                            <h2>{scanResult.success ? 'Attendance Marked!' : 'Scan Failed'}</h2>

                            {scanResult.success && (
                                <div className="result-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Class:</span>
                                        <span className="detail-value">{scanResult.className}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Teacher:</span>
                                        <span className="detail-value">{scanResult.teacher}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Time:</span>
                                        <span className="detail-value">{scanResult.time}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Date:</span>
                                        <span className="detail-value">{scanResult.date}</span>
                                    </div>
                                </div>
                            )}

                            <button className="reset-button" onClick={handleReset}>
                                Scan Another
                            </button>
                        </div>
                    )}
                </div>

                {/* Recent Scans */}
                <div className="recent-scans">
                    <h3>Recent Attendance</h3>
                    <div className="scans-list">
                        <div className="scan-item">
                            <div className="scan-info">
                                <h4>Mathematics 101</h4>
                                <p>Prof. John Smith</p>
                            </div>
                            <div className="scan-meta">
                                <span className="scan-time">9:00 AM</span>
                                <span className="scan-status success">Present</span>
                            </div>
                        </div>
                        <div className="scan-item">
                            <div className="scan-info">
                                <h4>Computer Science</h4>
                                <p>Prof. Sarah Johnson</p>
                            </div>
                            <div className="scan-meta">
                                <span className="scan-time">11:00 AM</span>
                                <span className="scan-status success">Present</span>
                            </div>
                        </div>
                        <div className="scan-item">
                            <div className="scan-info">
                                <h4>Physics Lab</h4>
                                <p>Prof. Michael Brown</p>
                            </div>
                            <div className="scan-meta">
                                <span className="scan-time">2:00 PM</span>
                                <span className="scan-status pending">Pending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanQR;
