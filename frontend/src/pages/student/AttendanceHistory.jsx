import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getCalendarHistory } from '../../api/attendance';
import CalendarTile from '../../components/CalendarTile';
import './AttendanceHistory.css';

const StudentAttendanceHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await getCalendarHistory();
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
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        return {
            daysInMonth: lastDay.getDate(),
            startingDayOfWeek: firstDay.getDay()
        };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Group history by date (YYYY-MM-DD), but we need to map to day number of current month
    // Events for current month:
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth(); // 0-indexed

    const eventsByDay = {};
    history.forEach(item => {
        const d = new Date(item.date); // 'date' from API
        if (d.getFullYear() === year && d.getMonth() === month) {
            const dayNum = d.getDate();
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

    if (loading) return <div className="p-8 text-center">Loading...</div>;

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
        </div>
    );
};

export default StudentAttendanceHistory;

