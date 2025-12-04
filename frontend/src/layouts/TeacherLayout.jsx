import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, QrCode, Radio, History, LogOut, ScanLine } from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import './TeacherLayout.css';

const TeacherLayout = () => {
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
                    <div className="logo-area">
                        <ScanLine size={32} color="#5465FF" strokeWidth={2.5} />
                        <div>
                            <h2 className="logo-text">
                                AttendEase
                            </h2>
                        </div>
                    </div>

                    <nav className="nav-menu">
                        <ul className="nav-list">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `nav-link ${isActive ? 'active' : ''}`
                                        }
                                    >
                                        <item.icon size={20} />
                                        <span>{item.label}</span>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
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

export default TeacherLayout;
