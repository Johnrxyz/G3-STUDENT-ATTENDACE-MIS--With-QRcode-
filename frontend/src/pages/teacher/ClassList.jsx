import React from 'react';
import { Clock, MapPin, Users, QrCode, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import useTeacher from '../../hooks/useTeacher';
import './ClassList.css';

const ClassList = () => {
    const { schedules, loading } = useTeacher();

    if (loading) return <div className="p-8 text-center">Loading classes...</div>;

    const classes = schedules.map(sch => ({
        id: sch.id,
        code: sch.course_code || 'N/A', // Added field
        name: sch.course_name || 'Unknown Course',
        schedule: `${sch.day_names.join(', ')} ${sch.start_time}-${sch.end_time}`,
        room: sch.room,
        students: sch.student_count || 0, // Added field
        section: sch.section_name
    }));

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
                            <Link to={`/teacher/generate-qr/${cls.id}`} className="btn-outline">
                                <QrCode size={18} />
                                QR Code
                            </Link>
                            <Link to={`/teacher/classes/${cls.id}`} className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                View Class
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassList;
