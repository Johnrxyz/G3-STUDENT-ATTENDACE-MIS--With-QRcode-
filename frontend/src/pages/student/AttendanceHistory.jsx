import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './AttendanceHistory.css';

const StudentAttendanceHistory = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    // Sample attendance data - December 2025
    const attendanceData = {
        // November 2025
        '2025-11-03': [
            { subject: 'ITPS301', teacher: 'Louise Vuitton', room: 'ComLab 3', status: 'present' },
            { subject: 'ITPS302', teacher: 'Merry Eamas', room: 'ComLab 2', status: 'present' }
        ],
        '2025-11-04': [
            { subject: 'ITPS301', teacher: 'Jonel Ciarlo', room: 'ComLab 2', status: 'absent' },
            { subject: 'ITPS303', teacher: 'John Rey Noto', room: 'ComLab 1', status: 'present' }
        ],
        '2025-11-05': [
            { subject: 'ITPS302', teacher: 'Merry Eamas', room: 'ComLab 2', status: 'late' },
            { subject: 'ITPS304', teacher: 'Merry Eamas', room: 'ComLab 4', status: 'present' }
        ],
        // December 2025 - Current Month
        '2025-12-01': [
            { subject: 'ITPS301', teacher: 'Louise Vuitton', room: 'ComLab 3', status: 'present' },
            { subject: 'ITPS302', teacher: 'Merry Eamas', room: 'ComLab 2', status: 'present' },
            { subject: 'ITPS303', teacher: 'John Rey Noto', room: 'ComLab 1', status: 'present' }
        ],
        '2025-12-02': [
            { subject: 'ITPS301', teacher: 'Jonel Ciarlo', room: 'ComLab 2', status: 'late' },
            { subject: 'ITPS304', teacher: 'Merry Eamas', room: 'ComLab 4', status: 'present' }
        ],
        '2025-12-03': [
            { subject: 'ITPS302', teacher: 'Merry Eamas', room: 'ComLab 2', status: 'absent' },
            { subject: 'ITPS201', teacher: 'Merry Eamas', room: 'ComLab 3', status: 'present' }
        ],
        '2025-12-04': [
            { subject: 'ITPS301', teacher: 'Louise Vuitton', room: 'ComLab 3', status: 'present' },
            { subject: 'ITPS302', teacher: 'Merry Eamas', room: 'ComLab 2', status: 'present' },
            { subject: 'ITPS303', teacher: 'John Rey Noto', room: 'ComLab 1', status: 'present' }
        ],
        '2025-12-05': [
            { subject: 'ITPS304', teacher: 'Merry Eamas', room: 'ComLab 4', status: 'late' },
            { subject: 'ITPS202', teacher: 'Merry Eamas', room: 'ComLab 5', status: 'present' }
        ],
        '2025-12-06': [
            { subject: 'ITPS301', teacher: 'Louise Vuitton', room: 'ComLab 3', status: 'absent' },
            { subject: 'ITPS302', teacher: 'Merry Eamas', room: 'ComLab 2', status: 'absent' }
        ],
        '2025-12-09': [
            { subject: 'ITPS301', teacher: 'Louise Vuitton', room: 'ComLab 3', status: 'present' },
            { subject: 'ITPS303', teacher: 'John Rey Noto', room: 'ComLab 1', status: 'present' }
        ],
        '2025-12-10': [
            { subject: 'ITPS302', teacher: 'Merry Eamas', room: 'ComLab 2', status: 'late' },
            { subject: 'ITPS304', teacher: 'Merry Eamas', room: 'ComLab 4', status: 'present' }
        ],
        '2025-12-11': [
            { subject: 'ITPS301', teacher: 'Jonel Ciarlo', room: 'ComLab 2', status: 'present' },
            { subject: 'ITPS201', teacher: 'Merry Eamas', room: 'ComLab 3', status: 'present' }
        ],
        '2025-12-12': [
            { subject: 'ITPS302', teacher: 'Merry Eamas', room: 'ComLab 2', status: 'absent' },
            { subject: 'ITPS303', teacher: 'John Rey Noto', room: 'ComLab 1', status: 'present' }
        ]
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const getDateKey = (day) => {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year}-${month}-${dayStr}`;
    };

    const getDateStatus = (day) => {
        const dateKey = getDateKey(day);
        const dayData = attendanceData[dateKey];

        if (!dayData) return null;

        const hasAbsent = dayData.some(item => item.status === 'absent');
        const hasLate = dayData.some(item => item.status === 'late');
        const allPresent = dayData.every(item => item.status === 'present');

        if (hasAbsent) return 'absent';
        if (hasLate) return 'late';
        if (allPresent) return 'present';
        return null;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleDateClick = (day) => {
        const dateKey = getDateKey(day);
        if (attendanceData[dateKey]) {
            setSelectedDate({ day, data: attendanceData[dateKey] });
        }
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Calculate monthly summary
    const allDates = Object.keys(attendanceData).filter(key => {
        const date = new Date(key);
        return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
    });

    const presentCount = allDates.filter(key => getDateStatus(parseInt(key.split('-')[2])) === 'present').length;
    const absentCount = allDates.filter(key => getDateStatus(parseInt(key.split('-')[2])) === 'absent').length;
    const lateCount = allDates.filter(key => getDateStatus(parseInt(key.split('-')[2])) === 'late').length;

    return (
        <div className="student-attendance-history">
            <div className="attendance-header">
                <h1>Attendance History</h1>
            </div>

            <div className="calendar-container">
                <div className="calendar-header">
                    <button className="month-nav-btn" onClick={handlePrevMonth}>
                        <ChevronLeft size={20} />
                    </button>
                    <h2>{monthName}</h2>
                    <button className="month-nav-btn" onClick={handleNextMonth}>
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="calendar-day-header">{day}</div>
                    ))}

                    {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                        <div key={`empty-${index}`} className="calendar-day empty"></div>
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const status = getDateStatus(day);
                        return (
                            <div
                                key={day}
                                className={`calendar-day ${status || ''} ${attendanceData[getDateKey(day)] ? 'clickable' : ''}`}
                                onClick={() => handleDateClick(day)}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>

                <div className="calendar-legend">
                    <div className="legend-item">
                        <span className="legend-dot present"></span>
                        <span>Present</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot absent"></span>
                        <span>Absent</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot late"></span>
                        <span>Late</span>
                    </div>
                </div>
            </div>

            <div className="monthly-summary">
                <h3>Monthly Summary:</h3>
                <div className="summary-cards">
                    <div className="summary-card present">
                        <div className="summary-value">{presentCount}</div>
                        <div className="summary-label">Present:</div>
                    </div>
                    <div className="summary-card absent">
                        <div className="summary-value">{absentCount}</div>
                        <div className="summary-label">Absent:</div>
                    </div>
                    <div className="summary-card late">
                        <div className="summary-value">{lateCount}</div>
                        <div className="summary-label">Late:</div>
                    </div>
                </div>
            </div>

            {absentCount >= 3 && (
                <div className="alerts-banner">
                    <span className="alert-icon">⚠️</span>
                    <span>You have {absentCount} absences every subjects - FDA Warning</span>
                </div>
            )}

            {selectedDate && (
                <div className="modal-overlay" onClick={() => setSelectedDate(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Attendance for Day {selectedDate.day}</h3>
                            <button className="close-btn" onClick={() => setSelectedDate(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            {selectedDate.data.map((item, index) => (
                                <div key={index} className={`attendance-item ${item.status}`}>
                                    <div className="item-info">
                                        <h4>{item.subject}</h4>
                                        <p>{item.teacher} • {item.room}</p>
                                    </div>
                                    <div className={`status-badge ${item.status}`}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAttendanceHistory;
