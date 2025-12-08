import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { QrCode, Calendar, History, LayoutDashboard, User, ScanLine, Menu, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './StudentNav.css';

const StudentNav = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="student-layout">
            <button className="menu-toggle" onClick={toggleSidebar}>
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`overlay ${isSidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

            <div className="layout-body">
                <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="logo">
                        <ScanLine size={32} color="#5465FF" strokeWidth={2.5} />
                        <div>
                            <h2 className="logo-text">
                                AttendEase
                            </h2>
                        </div>
                    </div>
                    <nav className="nav-menu">
                        <NavLink to="/student/dashboard" onClick={closeSidebar} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/student/scan-qr" onClick={closeSidebar} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <QrCode size={20} />
                            <span>Scan QR</span>
                        </NavLink>
                        <NavLink to="/student/schedule" onClick={closeSidebar} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <Calendar size={20} />
                            <span>My Schedule</span>
                        </NavLink>
                        <NavLink to="/student/history" onClick={closeSidebar} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                            <History size={20} />
                            <span>Attendance History</span>
                        </NavLink>
                        <NavLink to="/student/profile" onClick={closeSidebar} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
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
