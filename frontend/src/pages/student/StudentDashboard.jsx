import React, { useState, useEffect } from 'react';
import QRScanner from '../../components/scanner/QRScanner';
import { scanAttendance } from '../../api/attendance';
import useAuth from '../../hooks/useAuth';
import useStudent from '../../hooks/useStudent';
import './StudentDashboard.css';

const StudentDashboard = () => {
    const { auth } = useAuth();
    const { profile } = useStudent(); // Fetch fresh profile data
    const [scanStatus, setScanStatus] = useState('scanning'); // idle, scanning, success, error
    const [statusMessage, setStatusMessage] = useState('');
    const [lastScanned, setLastScanned] = useState(null);

    const handleScan = async (text) => {
        if (!text) return;
        if (text === lastScanned && scanStatus === 'success') return; // Prevent duplicate success triggers

        try {
            setLastScanned(text);
            setScanStatus('processing');

            // Requirement: "Silent behavior... auto-refresh... no pop-ups"
            // The dashboard shows status text, so we update that.

            const response = await scanAttendance(text);
            setScanStatus('success');
            setStatusMessage('Attendance Marked: ' + (response.data.attendance_status || "Success"));

            // Clear success message after 3 seconds and return to scanning state
            setTimeout(() => {
                setScanStatus('scanning');
                setStatusMessage('');
                setLastScanned(null); // Allow re-scan after timeout if needed? Or keep it to prevent spam? 
                // Requirement says "cooldown... automatic reactivation".
                // Clearing lastScanned allows same code to be scanned again after 3s if needed.
            }, 3000);

        } catch (err) {
            console.error(err);
            if (err.response?.status === 200 || err.response?.status === 409) {
                // 409 or 200 might mean duplicate. 
                // If the backend returns 200 for duplicate with a message, we handle it as success-ish
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
    };

    // Initial clock setup
    const [dateTime, setDateTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="student-dashboard-revised">
            <div className="dashboard-header-simple">
                <h1>Hello, {profile?.user?.firstname || auth.user?.firstname || 'Student'}</h1>
                <p className="date-time">{dateTime.toLocaleString(undefined, {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</p>
            </div>

            <div className="scanner-container">
                <div className="scanner-viewport">
                    <QRScanner onScan={handleScan} />
                </div>
                <div className={`scan-status-indicator status-${scanStatus}`}>
                    {scanStatus === 'idle' && "Initializing Camera..."}
                    {scanStatus === 'scanning' && "Ready to Scan"}
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
