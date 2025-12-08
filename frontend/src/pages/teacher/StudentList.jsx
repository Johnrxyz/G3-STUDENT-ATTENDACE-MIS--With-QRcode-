import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, QrCode } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentsBySection } from '../../api/users';
import { getSchedule } from '../../api/academic';
import './StudentList.css';

const StudentList = () => {
    const { id } = useParams(); // This is Schedule ID
    const navigate = useNavigate();

    const [schedule, setSchedule] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Schedule Details
                const schedRes = await getSchedule(id);
                const schedData = schedRes.data;
                setSchedule(schedData);

                // 2. Fetch Students for this Section
                // Section object or ID is in schedData.section
                // If the serializer returns object, use id. If id, use it.
                // Standard serializer often returns ID or minimal object. 
                // Assuming ID for now. If it fails, I'll log and check.
                const sectionId = typeof schedData.section === 'object' ? schedData.section.id : schedData.section;

                const stuRes = await getStudentsBySection(sectionId);
                setStudents(stuRes.data);
            } catch (err) {
                console.error("Failed to fetch class info", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const filteredStudents = students.filter(student =>
        student.user?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.user?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_number?.includes(searchTerm)
    );

    if (loading) return <div className="p-8 text-center">Loading class details...</div>;

    if (!schedule) return <div className="p-8 text-center">Class not found.</div>;

    return (
        <div className="student-list-page">
            <button onClick={() => navigate('/teacher/dashboard')} className="back-btn mb-4 flex items-center gap-2 text-gray-500 hover:text-blue-600">
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="class-header mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{schedule.course_name || 'Course Name'}</h1>
                    <p className="text-gray-600">{schedule.course_code} • {schedule.section_name}</p>
                    <div className="mt-2 text-sm text-blue-600 font-medium">
                        {schedule.day_names?.join(', ')} • {schedule.start_time} - {schedule.end_time}
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/teacher/generate-qr/${schedule.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                    <QrCode size={18} /> Generate QR
                </button>
            </div>

            <div className="content-card">
                <div className="controls-bar mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Enrolled Students ({filteredStudents.length})</h2>
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search student..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="search-icon" size={20} />
                    </div>
                </div>

                <div className="students-table-container">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Student ID</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <tr key={student.id || index}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold">
                                                    {student.user?.firstname?.[0]}{student.user?.lastname?.[0]}
                                                </div>
                                                <span className="student-name font-medium">
                                                    {student.user?.firstname} {student.user?.lastname}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{student.student_number}</td>
                                        <td>
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Active</span>
                                        </td>
                                        <td>
                                            <button className="text-sm text-blue-600 hover:text-blue-800">View History</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-8 text-gray-500">
                                        No students found in this section.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentList;
