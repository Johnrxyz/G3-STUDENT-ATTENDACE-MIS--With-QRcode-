import React, { useState, useEffect } from 'react';
import { Search, Shield, GraduationCap, BookOpen, Trash2, Edit2, Plus, X, Check } from 'lucide-react';
import { getAllUsers } from '../../api/users';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './UserList.css';

const UserList = () => {
    const axiosPrivate = useAxiosPrivate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllUsers(axiosPrivate);
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch users", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [axiosPrivate]);

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = filterRole === 'all' || user.role === filterRole;

        return matchesSearch && matchesRole;
    });

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield size={16} className="icon-red" />;
            case 'teacher': return <BookOpen size={16} className="icon-blue" />;
            case 'student': return <GraduationCap size={16} className="icon-green" />;
            default: return null;
        }
    };

    if (loading) return <div className="loading-state">Loading users...</div>;

    return (
        <div className="user-list-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">User Management</h1>
                    <p className="admin-welcome">View and manage system users.</p>
                </div>
            </div>

            <div className="content-card">
                <div className="controls-bar">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="search-icon" size={20} />
                    </div>

                    <select
                        className="role-filter"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="teacher">Teachers</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>

                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Status</th>
                                {/* <th>Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar">
                                                    {user.firstname?.[0] || user.username?.[0]}
                                                </div>
                                                <div className="user-info">
                                                    <div className="user-name">
                                                        {user.firstname} {user.lastname}
                                                    </div>
                                                    <div className="user-username">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="role-badge">
                                                {getRoleIcon(user.role)}
                                                {user.role}
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        {/* <td>
                                            <button className="action-btn">
                                                <Trash2 size={18} />
                                            </button>
                                        </td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-state">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;
