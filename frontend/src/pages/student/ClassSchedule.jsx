import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { getClasses } from '../../api/academic';
import { formatTime } from '../../utils/dateUtils';
import './ClassSchedule.css';

const ClassSchedule = () => {
    const axiosPrivate = useAxiosPrivate();
    const [scheduleData, setScheduleData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getClasses(axiosPrivate);
                setScheduleData(res.data);
            } catch (err) {
                console.error("Failed to fetch schedule", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [axiosPrivate]);

    if (loading) return <div className="student-schedule-page">Loading...</div>;

    return (
        <div className="student-schedule-page">
            <div className="schedule-header">
                <h1>Student Schedule</h1>
            </div>

            <div className="schedule-table-container">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>Subjects</th>
                            <th>Section</th>
                            <th>Teacher</th>
                            <th>Room</th>
                            <th>Schedule</th>
                            <th>Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleData.length > 0 ? (
                            scheduleData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="font-medium">{item.course_code}</div>
                                        <div className="text-sm text-gray-500">{item.course_name}</div>
                                    </td>
                                    <td>{item.section_name}</td>
                                    <td>{item.instructor_name || '-'}</td>
                                    <td>{item.room || 'TBA'}</td>
                                    <td>
                                        {item.day_names?.join(', ')} <br />
                                        {formatTime(item.start_time)} - {formatTime(item.end_time)}
                                    </td>
                                    <td>{item.student_count}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No classes found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassSchedule;
