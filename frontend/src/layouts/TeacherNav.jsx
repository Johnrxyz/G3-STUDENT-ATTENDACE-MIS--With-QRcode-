import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, QrCode, Radio, History, LogOut, ScanLine } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import './TeacherNav.css';

const TeacherNav = () => {
    const navItems = [
        { path: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: 'classes', icon: Users, label: 'Class List' },
        { path: 'generate-qr', icon: QrCode, label: 'Generate QR' },
        { path: 'live-attendance', icon: Radio, label: 'Live Attendance' },
        { path: 'history', icon: History, label: 'Attendance History' },
    ];

    return (
        <div className="teacher-layout">
            <div className="layout-body">
                <aside className="sidebar">
                    <div className="logo">
                        <ScanLine size={32} color="#5465FF" strokeWidth={2.5} />
                        <div>
                            <h2 className="logo-text">
                                AttendEase
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

export default TeacherNav;
