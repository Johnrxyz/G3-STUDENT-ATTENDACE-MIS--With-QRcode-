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

            {msg && <div className="p-4 mb-4 text-green-600 bg-green-100 rounded">{msg}</div>}

            <div className="dashboard-card">
                <div className="flex justify-between items-center mb-4">
                    <h2>Personal Information</h2>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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

                <div className="mt-8">
                    <h3>Edit Requests Status</h3>
                    {requests.length === 0 ? <p className="text-gray-500">No pending requests.</p> : (
                        <div className="mt-2 space-y-2">
                            {requests.map(req => (
                                <div key={req.id} className="p-3 border rounded flex justify-between items-center">
                                    <div>
                                        <div className="font-semibold">{req.new_firstname} {req.new_lastname}</div>
                                        <div className="text-sm text-gray-600">Reason: {req.reason}</div>
                                        <div className="text-xs text-gray-400">{new Date(req.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-sm ${req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            req.status === 'denied' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Request Profile Edit</h3>
                        <form onSubmit={handleSubmitRequest}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">New First Name</label>
                                <input
                                    type="text"
                                    name="new_firstname"
                                    value={requestData.new_firstname}
                                    onChange={handleRequestChange}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">New Last Name</label>
                                <input
                                    type="text"
                                    name="new_lastname"
                                    value={requestData.new_lastname}
                                    onChange={handleRequestChange}
                                    className="w-full border p-2 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Reason for Change</label>
                                <textarea
                                    name="reason"
                                    value={requestData.reason}
                                    onChange={handleRequestChange}
                                    className="w-full border p-2 rounded"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
