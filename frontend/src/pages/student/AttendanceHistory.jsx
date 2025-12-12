import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCalendarHistory } from '../../api/attendance';
import CalendarTile from '../../components/CalendarTile';
import './AttendanceHistory.css';

const StudentAttendanceHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth(); // 0-indexed

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch all history. Optimally, we should filter by month on backend, 
                // but currently the API returns all. 
                const res = await getCalendarHistory();
                console.log("Attendance History Data:", res.data); // Debug log
                setHistory(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch history", err);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const getDaysInMonth = (date) => {
        const y = date.getFullYear();
        const m = date.getMonth();
        const firstDay = new Date(y, m, 1);
        const lastDay = new Date(y, m + 1, 0);
        return {
            daysInMonth: lastDay.getDate(),
            startingDayOfWeek: firstDay.getDay()
        };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Group history by day_number for the current month
    // The backend returns 'date' (YYYY-MM-DD) and 'day_number'.
    const eventsByDay = {};

    history.forEach(item => {
        // Parse the item date string to check if it belongs to current displayed month
        // We can just check the string prefix "YYYY-MM" to avoid timezone issues entirely
        const itemDateStr = item.date; // "YYYY-MM-DD"
        const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

        if (itemDateStr && itemDateStr.startsWith(currentMonthPrefix)) {
            // Use day_number from backend if reliable, or parse from string
            const dayNum = item.day_number || parseInt(itemDateStr.split('-')[2], 10);

            if (!eventsByDay[dayNum]) eventsByDay[dayNum] = [];

            eventsByDay[dayNum].push({
                status: item.status,
                subject_code: item.subject_code,
                subject_name: item.subject_name
            });
        }
    });

    const handlePrevMonth = () => setCurrentMonth(new Date(year, month - 1));
    const handleNextMonth = () => setCurrentMonth(new Date(year, month + 1));

    if (loading) return <div className="p-8 text-center">Loading attendance history...</div>;

    return (
        <div className="student-attendance-history">
            <div className="attendance-header">
                <h1>Attendance Calendar</h1>
            </div>

            <div className="calendar-controls">
                <button onClick={handlePrevMonth}><ChevronLeft /></button>
                <h2>{monthName}</h2>
                <button onClick={handleNextMonth}><ChevronRight /></button>
            </div>

            <div className="calendar-grid-revised">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="calendar-day-label">{d}</div>
                ))}

                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="calendar-cell empty"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const events = eventsByDay[day] || [];
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                    return (
                        <div key={day} className="calendar-cell">
                            {events.length > 0 ? (
                                <CalendarTile day={day} events={events} date={dateStr} />
                            ) : (
                                <div className="calendar-tile-empty">{day}</div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Optional: Summary or Legend */}
            <div className="calendar-legend">
                <div className="legend-item">
                    <div className="status-dot present"></div> Present
                </div>
                <div className="legend-item">
                    <div className="status-dot late"></div> Late
                </div>
                <div className="legend-item">
                    <div className="status-dot absent"></div> Absent
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceHistory;

