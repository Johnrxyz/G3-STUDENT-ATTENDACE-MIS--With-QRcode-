import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { scanAttendance } from '../../api/attendance';
import useAuth from '../../hooks/useAuth';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const { auth } = useAuth();
    const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, success, error
    const [statusMessage, setStatusMessage] = useState('');
    const [lastScanned, setLastScanned] = useState(null);

    const handleResult = async (result, error) => {
        if (!!result) {
            const text = result?.text;
            if (text === lastScanned) return; // Prevent duplicate rapid scans locally

            try {
                // Determine if we should process this scan
                // Basic debounce or check if we just scanned this
                setLastScanned(text);
                setScanStatus('processing');

                const response = await scanAttendance(text);
                setScanStatus('success');
                setStatusMessage('Attendance Marked: ' + response.data.attendance_status);

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setScanStatus('scanning');
                    setStatusMessage('');
                }, 3000);

            } catch (err) {
                // Silent fail or small indicator? Requirement: "Only returns status to backend silently"
                // But user needs to know if it worked?
                // "Silent recording... Only returns status to backend silently" might mean no blocking UI.
                console.error(err);
                if (err.response?.status === 200) {
                    // 200 OK means duplicate/already recorded, which is fine
                    setScanStatus('success');
                    setStatusMessage('Already recorded');
                } else {
                    setScanStatus('error');
                    setStatusMessage(err.response?.data?.error || "Scan failed");
                }

                setTimeout(() => {
                    setScanStatus('scanning');
                    setStatusMessage('');
                }, 3000);
            }
        }
    };

    // Auto-start scanning? Requirement: "Main Scanner (priority)"
    // So yes, it should probably be active or easily activatable.
    // "Scanner always visible" - implies active.

    const [dateTime, setDateTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="student-dashboard-revised">
            <div className="dashboard-header-simple">
                <h1>Hello, {auth.user?.firstname || 'Student'}</h1>
                <p className="date-time">{dateTime.toLocaleString(undefined, {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</p>
            </div>

            <div className="scanner-container">
                <div className="scanner-viewport">
                    <QrReader
                        onResult={handleResult}
                        constraints={{ facingMode: 'environment' }}
                        className="qr-reader-component"
                        scanDelay={500}
                    />
                    <div className="scanner-overlay">
                        <div className="scan-line"></div>
                    </div>
                </div>
                <div className={`scan-status-indicator status-${scanStatus}`}>
                    {scanStatus === 'idle' && "Ready to Scan"}
                    {scanStatus === 'scanning' && "Looking for QR Code..."}
                    {scanStatus === 'processing' && "Verifying..."}
                    {scanStatus === 'success' && statusMessage}
                    {scanStatus === 'error' && statusMessage}
                </div>
            </div>

            <div className="dashboard-footer-hint">
                <p>Point your camera at the teacher's QR code to mark attendance.</p>
            </div>
        </div>
    );
};

export default StudentDashboard;
