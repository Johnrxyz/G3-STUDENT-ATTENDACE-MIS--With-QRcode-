import React, { useState, useEffect } from 'react';
import useStudent from '../../hooks/useStudent';
import { createProfileEditRequest, getMyProfileRequests } from '../../api/users';
import './StudentProfile.css';

const StudentProfile = () => {
    const { profile, loading } = useStudent();
    const [showEditModal, setShowEditModal] = useState(false);
    const [requestData, setRequestData] = useState({
        new_firstname: '',
        new_lastname: '',
        reason: ''
    });
    const [requests, setRequests] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (profile) {
            setRequestData(prev => ({
                ...prev,
                new_firstname: profile.user?.firstname || '',
                new_lastname: profile.user?.lastname || ''
            }));
            fetchRequests();
        }
    }, [profile]);

    const fetchRequests = async () => {
        try {
            const res = await getMyProfileRequests();
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRequestChange = (e) => {
        setRequestData({ ...requestData, [e.target.name]: e.target.value });
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        try {
            await createProfileEditRequest(requestData);
            setMsg('Request submitted successfully.');
            setShowEditModal(false);
            fetchRequests();
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Failed to submit request.');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;

    const fullName = profile?.user?.firstname && profile?.user?.lastname
        ? `${profile.user.firstname} ${profile.user.lastname}`
        : profile?.user?.username || 'Student';

    return (
        <div className="student-profile-page">
            <div className="welcome-banner">
                <div className="banner-content">
                    <h1>{fullName}</h1>
                    <p>{profile?.student_number}</p>
                </div>
            </div>

            {msg && <div className="alert-success">{msg}</div>}

            <div className="dashboard-card">
                <div className="profile-section-header">
                    <h2>Personal Information</h2>
                    <button
                        className="btn-primary"
                        onClick={() => setShowEditModal(true)}
                    >
                        Request Edit
                    </button>
                </div>

                <div className="profile-details-grid">
                    <div className="detail-item">
                        <label>First Name</label>
                        <p>{profile?.user?.firstname}</p>
                    </div>
                    <div className="detail-item">
                        <label>Last Name</label>
                        <p>{profile?.user?.lastname}</p>
                    </div>
                    <div className="detail-item">
                        <label>Email</label>
                        <p>{profile?.user?.email}</p>
                    </div>
                    <div className="detail-item">
                        <label>Student Number</label>
                        <p>{profile?.student_number}</p>
                    </div>
                </div>

                <div className="edit-requests-section">
                    <h3>Edit Requests Status</h3>
                    {requests.length === 0 ? <p className="empty-state">No pending requests.</p> : (
                        <div className="request-list">
                            {requests.map(req => (
                                <div key={req.id} className="request-item">
                                    <div>
                                        <div className="request-info-name">{req.new_firstname} {req.new_lastname}</div>
                                        <div className="request-info-reason">Reason: {req.reason}</div>
                                        <div className="request-info-date">{new Date(req.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <span className={`request-status ${req.status}`}>
                                        {req.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h3 className="modal-title">Request Profile Edit</h3>
                        <form onSubmit={handleSubmitRequest}>
                            <div className="form-group">
                                <label className="form-label">New First Name</label>
                                <input
                                    type="text"
                                    name="new_firstname"
                                    value={requestData.new_firstname}
                                    onChange={handleRequestChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">New Last Name</label>
                                <input
                                    type="text"
                                    name="new_lastname"
                                    value={requestData.new_lastname}
                                    onChange={handleRequestChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Reason for Change</label>
                                <textarea
                                    name="reason"
                                    value={requestData.reason}
                                    onChange={handleRequestChange}
                                    className="form-textarea"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-submit"
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProfile;
