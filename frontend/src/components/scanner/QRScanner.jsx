import React, { useState, useEffect, useCallback } from 'react';
import { useZxing } from 'react-zxing';
import { Loader2, Camera, AlertCircle } from 'lucide-react';
import './scanner.css';

const QRScanner = ({ onScan }) => {
    // State management
    const [lastScanTime, setLastScanTime] = useState(0);
    const [cameraAccessible, setCameraAccessible] = useState(null); // null=loading, true=yes, false=error
    const [errorMsg, setErrorMsg] = useState("");

    // Cooldown in ms to prevent accidental double-scans of the same code
    const SCAN_COOLDOWN = 2000;

    // Handle successful decode
    const handleDecode = useCallback((result) => {
        const now = Date.now();
        const text = result.getText();

        if (text && (now - lastScanTime > SCAN_COOLDOWN)) {
            setLastScanTime(now);
            onScan(text);
        }
    }, [lastScanTime, onScan]);

    // Initialize zxing hook
    const { ref } = useZxing({
        onDecodeResult: handleDecode,
        constraints: {
            video: {
                facingMode: 'environment' // Prefer rear camera
            },
            audio: false
        },
        onError: (err) => {
            // Only log logic errors, zxing might throw on frame processing which is noisy
            // We focus on permission errors mostly
            console.debug("Scanner feed info:", err);
        }
    });

    // Check camera permission status (simplistic check via media devices)
    useEffect(() => {
        const checkCamera = async () => {
            try {
                // Determine if we can access the stream
                // The useZxing hook handles the stream, but we want to know if it failed to start generally.
                // We'll trust the hook but if the video ref doesn't get a stream after a timeout, we might assume issue.
                // Actually, let's just use navigator.mediaDevices to verify permission independently if needed,
                // or just rely on the 'catch' of the hook. 
                // Since useZxing doesn't expose a simple "loading" or "error" state for the stream itself easily:

                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(d => d.kind === 'videoinput');

                if (videoDevices.length === 0) {
                    setCameraAccessible(false);
                    setErrorMsg("No camera devices found.");
                    return;
                }

                // If we are here, we likely have devices. 
                // Actual permission errors usually bubble up when the hook tries to access getUserMedia.
                // We will simulate "loading" initially.
                setCameraAccessible(true);

            } catch (err) {
                console.error("Camera permission/access error:", err);
                setCameraAccessible(false);
                setErrorMsg("Camera access denied or unavailable.");
            }
        };

        checkCamera();
    }, []);

    return (
        <div className="zx-scanner-fullscreen-container">
            {cameraAccessible === false ? (
                <div className="zx-scanner-error-display">
                    <AlertCircle size={48} className="text-red-500 mb-2" />
                    <p>{errorMsg || "Unable to access camera."}</p>
                    <p className="text-sm opacity-75 mt-2">Please ensure you have granted camera permissions.</p>
                </div>
            ) : (
                <div className="zx-scanner-video-container">
                    {/* The video element controlled by react-zxing */}
                    <video ref={ref} className="zx-scanner-video" />

                    {/* Overlay for UI feedback */}
                    <div className="zx-scanner-overlay">
                        <div className="zx-scan-guide-box">
                            <div className="zx-scan-guide-corners"></div>
                            <div className="zx-scan-line"></div>
                        </div>
                        <div className="zx-scanner-label">
                            Align QR Code within the frame
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
