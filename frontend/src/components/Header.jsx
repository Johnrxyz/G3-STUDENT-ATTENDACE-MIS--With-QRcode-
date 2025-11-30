import React from 'react';
import { Bell } from 'lucide-react';
import './Header.css';

const Header = () => {
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
                        <span className="user-name">John Doe</span>
                        <span className="user-role">3rd year</span>
                    </div>
                </div>

                <button className="notification-btn">
                    <Bell size={20} fill="black" />
                    <span className="notification-badge"></span>
                </button>

                <button className="header-logout-btn">
                    Log Out
                </button>
            </div>
        </header>
    );
};

export default Header;
