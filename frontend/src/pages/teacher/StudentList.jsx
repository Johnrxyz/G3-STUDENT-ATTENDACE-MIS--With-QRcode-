import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getStudentsBySection } from '../../api/users';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import './StudentList.css';

const StudentList = () => {
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await getStudentsBySection(id, axiosPrivate);
                setStudents(res.data);
            } catch (err) {
                console.error("Failed to fetch students", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [id]);

    const filteredStudents = students.filter(student =>
        student.user?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.user?.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_number?.includes(searchTerm)
    );

    if (loading) return <div className="p-8">Loading students...</div>;

    return (
        <div className="student-list-page">
            <h1 className="page-title">Student List</h1>

            <div className="content-card">
                <div className="controls-bar">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search"
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
                                <th>Student name</th>
                                <th>Student ID</th>
                                <th>Section</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student, index) => (
                                    <tr key={student.id || index}>
                                        <td>
                                            <span className="student-name">
                                                {student.user?.firstname} {student.user?.lastname}
                                            </span>
                                        </td>
                                        <td>{student.student_number}</td>
                                        <td>{/* Student section info might be array or filtered section */ 'Enrolled'}</td>
                                        <td>
                                            {/* Actions */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">No students found.</td>
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
