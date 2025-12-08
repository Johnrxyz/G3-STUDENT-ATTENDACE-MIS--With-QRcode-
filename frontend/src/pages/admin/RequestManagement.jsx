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
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {req.student.user.firstname} {req.student.user.lastname}
                                        </h3>
                                        <p className="text-sm text-gray-500">{req.student.student_number}</p>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock size={12} />
                                    {new Date(req.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="request-body my-4 p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Current Name</p>
                                        <p className="text-gray-700">{req.student.user.firstname} {req.student.user.lastname}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Requested Name</p>
                                        <p className="text-gray-900 font-medium">{req.new_firstname} {req.new_lastname}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase font-semibold">Reason</p>
                                    <p className="text-gray-700 italic">"{req.reason}"</p>
                                </div>
                            </div>

                            <div className="request-actions">
                                <button
                                    onClick={() => handleDeny(req.id)}
                                    disabled={actionLoading === req.id}
                                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                                >
                                    <X size={16} /> Deny
                                </button>
                                <button
                                    onClick={() => handleApprove(req.id)}
                                    disabled={actionLoading === req.id}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                >
                                    <Check size={16} /> Approve
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <User size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-800">No Pending Requests</h3>
                        <p className="text-gray-500">All student profile update requests have been processed.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestManagement;
