import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { QrCode, Calendar, History, LayoutDashboard, User, ScanLine } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './StudentNav.css';

const StudentNav = () => {
    return (
        <div className="student-layout">
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
                        <NavLink to="/student/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/student/scan-qr" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <QrCode size={20} />
                            <span>Scan QR</span>
                        </NavLink>
                        <NavLink to="/student/schedule" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Calendar size={20} />
                            <span>My Schedule</span>
                        </NavLink>
                        <NavLink to="/student/history" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <History size={20} />
                            <span>Attendance History</span>
                        </NavLink>
                        <NavLink to="/student/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <User size={20} />
                            <span>My Profile</span>
                        </NavLink>
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

export default StudentNav;
