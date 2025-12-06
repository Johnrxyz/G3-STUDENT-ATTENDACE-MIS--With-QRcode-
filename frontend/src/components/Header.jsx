import React from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Header.css';

const Header = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const currentUser = auth.user || {};

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="user-profile">
                <div className="user-info">
                    <img
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop"
                        alt="User Avatar"
                        className="avatar"
                    />
                    <div className="user-details">
                        <span className="user-name">{currentUser.full_name || currentUser.username || 'User'}</span>
                        <span className="user-role">
                            {currentUser.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'Student'}
                        </span>
                    </div>
                </div>

                <button className="notification-btn">
                    <Bell size={20} fill="black" />
                    <span className="notification-badge"></span>
                </button>

                <button className="header-logout-btn" onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </header>
    );
};

export default Header;
