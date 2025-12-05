import React from 'react';
import './ClassSchedule.css';

const ClassSchedule = () => {
    // Sample schedule data
    const scheduleData = [
        { subject: 'ITPS301', teacher: 'Louise Vuitton', room: 'ComLab 3', attendance: '80%', status: 'Not FDA' },
        { subject: 'ITPS301', teacher: 'Jonel Ciarlo', room: 'ComLab 2', attendance: '86%', status: 'Not FDA' },
        { subject: 'ITPS303', teacher: 'John Rey Noto', room: 'ComLab 1', attendance: '77%', status: 'Not FDA' },
        { subject: 'ITPS302', teacher: 'Merry Eamas', room: 'ComLab 2', attendance: '94%', status: 'Not FDA' },
        { subject: 'ITPS304', teacher: 'Merry Eamas', room: 'ComLab 4', attendance: '95%', status: 'Not FDA' },
        { subject: 'ITPS201', teacher: 'Merry Eamas', room: 'ComLab 3', attendance: '95%', status: 'Not FDA' },
        { subject: 'ITPS202', teacher: 'Merry Eamas', room: 'ComLab 5', attendance: '95%', status: 'Not FDA' }
    ];

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
                            <th>Teacher</th>
                            <th>Room</th>
                            <th>Attendance %</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.subject}</td>
                                <td>{item.teacher}</td>
                                <td>{item.room}</td>
                                <td>{item.attendance}</td>
                                <td>{item.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassSchedule;
