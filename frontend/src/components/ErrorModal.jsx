import React from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';
import './ErrorModal.css';

const ErrorModal = ({ isOpen, onClose, title, message, type = 'error' }) => {
    if (!isOpen) return null;

    return (
        <div className="error-modal-overlay" onClick={onClose}>
            <div className="error-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="error-modal-icon">
                    {type === 'error' ? (
                        <XCircle size={32} />
                    ) : (
                        <AlertTriangle size={32} />
                    )}
                </div>
                <h3 className="error-modal-title">{title}</h3>
                <p className="error-modal-message">{message}</p>
                <button className="error-modal-btn" onClick={onClose}>
                    Dismiss
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;
