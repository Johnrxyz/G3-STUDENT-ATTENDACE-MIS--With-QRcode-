import React, { useState, useEffect } from 'react';
import { Book, Layers, GraduationCap, Users } from 'lucide-react';
import './AcademicManagement.css';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const AcademicManagement = () => {
    const axiosPrivate = useAxiosPrivate();
    const [activeTab, setActiveTab] = useState('courses');

    const renderContent = () => {
        switch (activeTab) {
            case 'courses': return <CoursesTab axiosPrivate={axiosPrivate} />;
            case 'sections': return <SectionsTab axiosPrivate={axiosPrivate} />;
            case 'programs': return <div className="p-8 text-center text-gray-500">Program Management Coming Soon</div>;
            default: return null;
        }
    };

    return (
        <div className="academic-management-page">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Academic Management</h1>
                    <p className="admin-welcome">Manage courses, sections, and programs.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="tabs-header">
                    <button
                        className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        <div className="flex items-center gap-2">
                            <Book size={18} /> Courses
                        </div>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'sections' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sections')}
                    >
                        <div className="flex items-center gap-2">
                            <Users size={18} /> Sections
                        </div>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'programs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('programs')}
                    >
                        <div className="flex items-center gap-2">
                            <GraduationCap size={18} /> Programs
                        </div>
                    </button>
                </div>

                <div className="tab-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

const CoursesTab = ({ axiosPrivate }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [formData, setFormData] = useState({ code: '', name: '', description: '', units: 3 });

    useEffect(() => {
        fetchCourses();
    }, [axiosPrivate]);

    const fetchCourses = async () => {
        try {
            const res = await axiosPrivate.get('/courses/');
            setCourses(res.data);
        } catch (err) {
            console.error("Failed to fetch courses", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (course = null) => {
        if (course) {
            setIsEditMode(true);
            setCurrentCourse(course);
            setFormData({ ...course });
        } else {
            setIsEditMode(false);
            setCurrentCourse(null);
            setFormData({ code: '', name: '', description: '', units: 3 });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this course?")) return;
        try {
            await axiosPrivate.delete(`/courses/${id}/`);
            setCourses(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert("Failed to delete course.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axiosPrivate.put(`/courses/${currentCourse.id}/`, formData);
                alert("Course updated!");
            } else {
                await axiosPrivate.post('/courses/', formData);
                alert("Course added!");
            }
            setIsModalOpen(false);
            fetchCourses();
        } catch (err) {
            alert("Failed to save course.");
        }
    };

    return (
        <div>
            <div className="section-header">
                <h3 className="section-title">All Courses</h3>
                <button onClick={() => handleOpenModal()} className="btn-add">
                    <Book size={16} /> Add Course
                </button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Units</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id}>
                                <td className="font-medium">{course.code}</td>
                                <td>{course.name}</td>
                                <td>{course.units}</td>
                                <td className="actions-cell">
                                    <button onClick={() => handleOpenModal(course)} className="btn-icon edit"><Users size={16} /></button>
                                    <button onClick={() => handleDelete(course.id)} className="btn-icon delete"><GraduationCap size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && !loading && <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>No courses found.</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">{isEditMode ? 'Edit Course' : 'Add Course'}</h2>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <input className="form-input" placeholder="Course Code (e.g., IT 101)" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} required />
                            <input className="form-input" placeholder="Course Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input className="form-input" type="number" placeholder="Units" value={formData.units} onChange={e => setFormData({ ...formData, units: e.target.value })} required />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-save">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const SectionsTab = ({ axiosPrivate }) => {
    const [sections, setSections] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', course: '', instructor: '', year_level: 1, semester: '1st' });

    useEffect(() => {
        fetchData();
    }, [axiosPrivate]);

    const fetchData = async () => {
        try {
            const [secRes, courseRes, userRes] = await Promise.all([
                axiosPrivate.get('/sections/'),
                axiosPrivate.get('/courses/'),
                axiosPrivate.get('/users/?role=teacher') // Assuming filter exists or we filter client side
            ]);
            setSections(secRes.data);
            setCourses(courseRes.data);
            setTeachers(userRes.data.filter(u => u.role === 'teacher'));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this section?")) return;
        try {
            await axiosPrivate.delete(`/sections/${id}/`);
            setSections(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            alert("Failed to delete section.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosPrivate.post('/sections/', formData);
            alert("Section created!");
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert("Failed to create section.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">All Sections</h3>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-blue-700">
                    <Users size={16} /> Create Section
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 text-gray-500 text-sm">
                            <th className="py-3 px-4">Name</th>
                            <th className="py-3 px-4">Course</th>
                            <th className="py-3 px-4">Instructor</th>
                            <th className="py-3 px-4">Level/Sem</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map(section => (
                            <tr key={section.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium text-gray-800">{section.name}</td>
                                <td className="py-3 px-4 text-gray-600">{section.course_name || section.course}</td>
                                <td className="py-3 px-4 text-gray-600">{section.instructor_name || section.instructor}</td>
                                <td className="py-3 px-4 text-gray-600">{section.year_level} - {section.semester}</td>
                                <td className="py-3 px-4 flex gap-2">
                                    <button onClick={() => handleDelete(section.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Layers size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {sections.length === 0 && <tr><td colSpan="5" className="text-center p-4 text-gray-500">No sections found.</td></tr>}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Create Section</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input className="w-full p-2 border rounded" placeholder="Section Name (e.g., A)" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <select className="w-full p-2 border rounded" value={formData.course} onChange={e => setFormData({ ...formData, course: e.target.value })} required>
                                <option value="">Select Course</option>
                                {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                            </select>
                            <select className="w-full p-2 border rounded" value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} required>
                                <option value="">Select Instructor</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.firstname} {t.lastname}</option>)}
                            </select>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="number" className="w-full p-2 border rounded" placeholder="Year Level" value={formData.year_level} onChange={e => setFormData({ ...formData, year_level: e.target.value })} required />
                                <select className="w-full p-2 border rounded" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })}>
                                    <option value="1st">1st Sem</option>
                                    <option value="2nd">2nd Sem</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AcademicManagement;
