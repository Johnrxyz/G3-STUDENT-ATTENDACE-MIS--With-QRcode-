import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CalendarTile.css'; // We will create this

const CalendarTile = ({ day, events, date }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        // Navigate to Class Details Page, passing the date or events. 
        // Using state or query param.
        navigate(`/student/history/${date}`, { state: { events, date } });
    };

    return (
        <div className="calendar-tile" onClick={handleClick}>
            <div className="tile-day-number">{day}</div>
            <div className="tile-events">
                {events.map((event, index) => (
                    <div key={index} className="tile-event-row">
                        <div className={`status-indicator status-${event.status}`}></div>
                        <div className="subject-info">
                            {event.subject_code} – {event.subject_name}
                        </div>
                    </div>
                ))}
                {events.length === 0 && <div className="no-events">-</div>}
            </div>
        </div>
    );
};

export default CalendarTile;
