import React from 'react';
import { Clock, MapPin, Users, QrCode, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './ClassList.css';

const ClassList = () => {
    const classes = [
        {
            id: 1,
            code: 'IT101',
            name: 'Introduction to Programming',
            schedule: 'Mon / Wed 10:00 AM - 11:30 AM',
            room: 'Lab 3',
            students: 42,
            section: '4A'
        },
        {
            id: 2,
            code: 'IT102',
            name: 'Data Structures and Algorithms',
            schedule: 'Tue / Thu 1:00 PM - 2:30 PM',
            room: 'Lab 1',
            students: 38,
            section: '3B'
        },
        {
            id: 3,
            code: 'IT103',
            name: 'Web Development',
            schedule: 'Fri 9:00 AM - 12:00 PM',
            room: 'Lab 5',
            students: 45,
            section: '4A'
        },
        {
            id: 4,
            code: 'IT104',
            name: 'Database Management Systems',
            schedule: 'Mon / Wed 2:00 PM - 3:30 PM',
            room: 'Lecture Hall A',
            students: 50,
            section: '3A'
        }
    ];

    return (
        <div className="class-list-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Classes</h1>
                    <p className="page-subtitle">Manage your subjects and schedules</p>
                </div>
            </div>

            <div className="class-grid">
                {classes.map((cls) => (
                    <div key={cls.id} className="class-card">
                        <div className="class-header">
                            <div>
                                <span className="subject-code">{cls.code} • {cls.section}</span>
                                <h3 className="subject-name">{cls.name}</h3>
                            </div>
                        </div>

                        <div className="class-details">
                            <div className="detail-item">
                                <Clock size={18} />
                                <span className="detail-text">{cls.schedule}</span>
                            </div>
                            <div className="detail-item">
                                <MapPin size={18} />
                                <span className="detail-text">{cls.room}</span>
                            </div>
                            <div className="detail-item">
                                <Users size={18} />
                                <span className="detail-text">{cls.students} Students</span>
                            </div>
                        </div>

                        <div className="card-actions">
                            <Link to="/teacher/generate-qr" className="btn-outline">
                                <QrCode size={18} />
                                QR Code
                            </Link>
                            <button className="btn-primary">
                                View Class
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassList;
