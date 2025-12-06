import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Camera, CheckCircle, XCircle, QrCode } from 'lucide-react';
import { scanAttendance } from '../../api/attendance';
import './ScanQR.css';

const ScanQR = () => {
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);

    const handleResult = async (result, error) => {
        if (!!result) {
            setScanning(false);
            try {
                // Call API
                const response = await scanAttendance(result?.text);
                setScanResult({
                    success: true,
                    data: response.data,
                    text: result?.text
                });
            } catch (err) {
                setScanning(false);
                setError(err.response?.data?.error || "Scanning failed");
                setScanResult({
                    success: false,
                    error: err.response?.data?.error
                });
            }
        }
        if (!!error) {
            console.info(error);
        }
    };

    const handleStartScan = () => {
        setScanning(true);
        setScanResult(null);
        setError(null);
    };

    const handleReset = () => {
        setScanResult(null);
        setScanning(false);
        setError(null);
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
                                <QrReader
                                    onResult={handleResult}
                                    constraints={{ facingMode: 'environment' }}
                                    style={{ width: '100%' }}
                                />
                                <p className="scanning-text">Scanning...</p>
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
