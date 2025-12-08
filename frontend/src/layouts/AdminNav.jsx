import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, ShieldCheck, Book } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import './TeacherNav.css'; // Reusing TeacherNav styles as base

const AdminNav = () => {
    const navItems = [
        { path: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: 'requests', icon: FileText, label: 'Requests' },
        { path: 'users', icon: Users, label: 'User Management' },
        { path: 'academic', icon: Book, label: 'Academic' }, // New Link
        // { path: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="teacher-layout">
            <div className="layout-body">
                <aside className="sidebar">
                    <div className="logo">
                        <ShieldCheck size={32} color="#5465FF" strokeWidth={2.5} />
                        <div>
                            <h2 className="logo-text">
                                AttendEase
                                <span className="logo-subtitle">Admin Portal</span>
                            </h2>
                        </div>
                    </div>

                    <nav className="nav-menu">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                </aside>

                <main className="main-content">
                    <Header />
                    <div className="content-wrapper">
                        <Outlet />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AdminNav;
