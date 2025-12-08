import React, { useState } from 'react';
import QRScanner from '../../components/scanner/QRScanner';
import { CheckCircle, XCircle, QrCode, Camera } from 'lucide-react';
import { scanAttendance } from '../../api/attendance';
import './ScanQR.css';

const ScanQR = () => {
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);

    const handleScan = async (text) => {
        if (!text) return;

        setScanning(false);
        try {
            // Call API
            const response = await scanAttendance(text);
            setScanResult({
                success: true,
                data: response.data,
                text: text
            });
        } catch (err) {
            setScanning(false);
            console.error("Scan error:", err);
            setScanResult({
                success: false,
                error: err.response?.data?.error || "Scanning failed"
            });
        }
    };

    const handleStartScan = () => {
        setScanning(true);
        setScanResult(null);
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
                            <div className="scanner-frame-wrapper">
                                <QRScanner onScan={handleScan} />
                            </div>
                            <button className="reset-button" onClick={() => setScanning(false)}>Cancel</button>
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
                                    <p className="success-msg">{scanResult.data?.status}</p>
                                    <p className="timestamp">{new Date().toLocaleString()}</p>
                                </div>
                            )}

                            {!scanResult.success && (
                                <p className="error-msg">{scanResult.error}</p>
                            )}

                            <button className="reset-button" onClick={handleReset}>
                                Scan Another
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScanQR;
