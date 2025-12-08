import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, ShieldCheck, Book, Menu, X } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import './TeacherNav.css'; // Reusing TeacherNav styles as base

const AdminNav = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const navItems = [
        { path: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: 'requests', icon: FileText, label: 'Requests' },
        { path: 'users', icon: Users, label: 'User Management' },
        { path: 'academic', icon: Book, label: 'Academic' }, // New Link
        // { path: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="teacher-layout">
            <button className="menu-toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`overlay ${isSidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

            <div className="layout-body">
                <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
                                onClick={closeSidebar} // Close sidebar on nav click
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
