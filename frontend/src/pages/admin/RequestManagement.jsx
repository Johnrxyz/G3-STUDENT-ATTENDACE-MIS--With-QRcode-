import React, { useState, useEffect } from 'react';
import { Check, X, Clock, User } from 'lucide-react';
import { getPendingRequests, approveRequest, denyRequest } from '../../api/users';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './RequestManagement.css';

const RequestManagement = () => {
    const axiosPrivate = useAxiosPrivate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, [axiosPrivate]);

    const fetchRequests = async () => {
        try {
            const res = await getPendingRequests(axiosPrivate);
            // Filter pending just in case API returns all
            const pending = res.data.filter(r => r.status === 'pending');
            setRequests(pending);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Approve this profile change?")) return;
        setActionLoading(id);
        try {
            await approveRequest(id, axiosPrivate);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to approve request.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeny = async (id) => {
        const reason = window.prompt("Enter reason for denial:");
        if (reason === null) return; // Cancelled

        setActionLoading(id);
        try {
            await denyRequest(id, { admin_note: reason }, axiosPrivate);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to deny request.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading requests...</div>;

    return (
        <div className="request-management-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Profile Requests</h1>
                    <p className="admin-welcome">Manage student profile update requests.</p>
                </div>
            </div>

            <div className="requests-container">
                {requests.length > 0 ? (
                    requests.map(req => (
                        <div key={req.id} className="request-card">
                            <div className="request-header">
                                <div className="request-student-info">
                                    <div className="request-icon">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="request-name">
                                            {req.student.user.firstname} {req.student.user.lastname}
                                        </h3>
                                        <p className="request-id">{req.student.student_number}</p>
                                    </div>
                                </div>
                                <div className="request-date">
                                    <Clock size={12} />
                                    {new Date(req.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="request-details">
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <p className="detail-label">Current Name</p>
                                        <p className="detail-value text-normal">{req.student.user.firstname} {req.student.user.lastname}</p>
                                    </div>
                                    <div className="detail-item">
                                        <p className="detail-label">Requested Name</p>
                                        <p className="detail-value text-highlight">{req.new_firstname} {req.new_lastname}</p>
                                    </div>
                                </div>
                                <div className="reason-section">
                                    <p className="detail-label">Reason</p>
                                    <p className="reason-text">"{req.reason}"</p>
                                </div>
                            </div>

                            <div className="request-actions">
                                <button
                                    onClick={() => handleDeny(req.id)}
                                    disabled={actionLoading === req.id}
                                    className="btn-request deny"
                                >
                                    <X size={16} /> Deny
                                </button>
                                <button
                                    onClick={() => handleApprove(req.id)}
                                    disabled={actionLoading === req.id}
                                    className="btn-request approve"
                                >
                                    <Check size={16} /> Approve
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-requests">
                        <User size={48} className="no-requests-icon" />
                        <h3 className="no-requests-title">No Pending Requests</h3>
                        <p className="no-requests-text">All student profile update requests have been processed.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestManagement;
