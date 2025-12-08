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
            case 'programs': return <div className="empty-state">Program Management Coming Soon</div>;
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

            <div className="content-card">
                <div className="tabs-header">
                    <button
                        className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('courses')}
                    >
                        <Book size={18} /> Courses
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'sections' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sections')}
                    >
                        <Users size={18} /> Sections
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'programs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('programs')}
                    >
                        <GraduationCap size={18} /> Programs
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
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [formData, setFormData] = useState({ code: '', name: '', description: '', units: 3, department: '' });

    // Alert State
    const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });

    useEffect(() => {
        fetchData();
    }, [axiosPrivate]);

    const fetchData = async () => {
        try {
            const [courseRes, deptRes] = await Promise.all([
                axiosPrivate.get('/courses/'),
                axiosPrivate.get('/departments/')
            ]);
            setCourses(courseRes.data);
            setDepartments(deptRes.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const showAlert = (title, message, type = 'info', onConfirm = null) => {
        setAlertState({ isOpen: true, title, message, type, onConfirm });
    };

    const closeAlert = () => {
        setAlertState({ ...alertState, isOpen: false });
    };

    const handleOpenModal = (course = null) => {
        if (course) {
            setIsEditMode(true);
            setCurrentCourse(course);
            setFormData({ ...course });
        } else {
            setIsEditMode(false);
            setCurrentCourse(null);
            setFormData({ code: '', name: '', description: '', units: 3, department: '' });
        }
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        showAlert('Delete Course', 'Are you sure you want to delete this course?', 'confirm', () => deleteCourse(id));
    };

    const deleteCourse = async (id) => {
        try {
            await axiosPrivate.delete(`/courses/${id}/`);
            setCourses(prev => prev.filter(c => c.id !== id));
            showAlert('Success', 'Course deleted successfully.');
        } catch (err) {
            showAlert('Error', 'Failed to delete course.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axiosPrivate.put(`/courses/${currentCourse.id}/`, formData);
                showAlert('Success', 'Course updated successfully.');
            } else {
                await axiosPrivate.post('/courses/', formData);
                showAlert('Success', 'Course added successfully.');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Save course error:", err);
            const msg = err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
            showAlert('Error', 'Failed to save course: ' + msg);
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
                            <th>Department</th>
                            <th>Units</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id}>
                                <td className="font-medium">{course.code}</td>
                                <td>{course.name}</td>
                                <td>{course.department_name}</td>
                                <td>{course.units}</td>
                                <td className="actions-cell">
                                    <button onClick={() => handleOpenModal(course)} className="btn-icon edit"><Users size={16} /></button>
                                    <button onClick={() => handleDeleteClick(course.id)} className="btn-icon delete"><GraduationCap size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && !loading && <tr><td colSpan="5" className="empty-state">No courses found.</td></tr>}
                    </tbody>
                </table>
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">{isEditMode ? 'Edit Course' : 'Add Course'}</h2>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <select className="form-input" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} required>
                                <option value="">Select Department</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                            <input className="form-input" placeholder="Course Code (e.g., IT 101)" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} required />
                            <input className="form-input" placeholder="Course Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <textarea className="form-input" placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                            <input className="form-input" type="number" placeholder="Units" value={formData.units} onChange={e => setFormData({ ...formData, units: e.target.value })} required />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-save">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertState.isOpen}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                onClose={closeAlert}
                onConfirm={alertState.onConfirm}
            />
        </div>
    );
};

const SectionsTab = ({ axiosPrivate }) => {
    const [sections, setSections] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSection, setCurrentSection] = useState(null);
    const [formData, setFormData] = useState({ section_name: '', program: '', instructor: '', year_level: 1 });

    // Alert State
    const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'info', onConfirm: null });


    useEffect(() => {
        fetchData();
    }, [axiosPrivate]);

    const fetchData = async () => {
        try {
            const [secRes, userRes, progRes] = await Promise.all([
                axiosPrivate.get('/sections/'),
                axiosPrivate.get('/users/?role=teacher'),
                axiosPrivate.get('/programs/')
            ]);
            setSections(secRes.data);
            setTeachers(userRes.data.filter(u => u.role === 'teacher'));
            setPrograms(progRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const showAlert = (title, message, type = 'info', onConfirm = null) => {
        setAlertState({ isOpen: true, title, message, type, onConfirm });
    };

    const closeAlert = () => {
        setAlertState({ ...alertState, isOpen: false });
    };

    const getProgramName = (id) => {
        const prog = programs.find(p => p.id === id);
        return prog ? `${prog.code}` : id;
    };

    const handleOpenModal = (section = null) => {
        if (section) {
            setIsEditMode(true);
            setCurrentSection(section);
            setFormData({
                section_name: section.section_name,
                program: section.program,
                instructor: section.instructor,
                year_level: section.year_level
            });
        } else {
            setIsEditMode(false);
            setCurrentSection(null);
            setFormData({ section_name: '', program: '', instructor: '', year_level: 1 });
        }
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        showAlert('Delete Section', 'Are you sure you want to delete this section?', 'confirm', () => deleteSection(id));
    };

    const deleteSection = async (id) => {
        try {
            await axiosPrivate.delete(`/sections/${id}/`);
            setSections(prev => prev.filter(s => s.id !== id));
            showAlert('Success', 'Section deleted successfully.');
        } catch (err) {
            showAlert('Error', 'Failed to delete section.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await axiosPrivate.put(`/sections/${currentSection.id}/`, formData);
                showAlert('Success', 'Section updated successfully.');
            } else {
                await axiosPrivate.post('/sections/', formData);
                showAlert('Success', 'Section created successfully.');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Save section error:", err);
            const msg = err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
            showAlert('Error', 'Failed to save section: ' + msg);
        }
    };

    return (
        <div>
            <div className="section-header">
                <h3 className="section-title">All Sections</h3>
                <button onClick={() => handleOpenModal()} className="btn-add">
                    <Users size={16} /> Create Section
                </button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Section Name</th>
                            <th>Program</th>
                            <th>Instructor</th>
                            <th>Year Level</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sections.map(section => (
                            <tr key={section.id}>
                                <td className="font-medium">{section.section_name}</td>
                                <td>{getProgramName(section.program)}</td>
                                <td>{section.instructor_name || section.instructor}</td>
                                <td>{section.year_level}</td>
                                <td className="actions-cell">
                                    <button onClick={() => handleOpenModal(section)} className="btn-icon edit"><Users size={16} /></button>
                                    <button onClick={() => handleDeleteClick(section.id)} className="btn-icon delete"><Layers size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {sections.length === 0 && <tr><td colSpan="5" className="empty-state">No sections found.</td></tr>}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">{isEditMode ? 'Edit Section' : 'Create Section'}</h2>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <input
                                className="form-input"
                                placeholder="Section Name (Optional - Auto-generated)"
                                value={formData.section_name}
                                onChange={e => setFormData({ ...formData, section_name: e.target.value })}
                            />
                            <select className="form-input" value={formData.program} onChange={e => setFormData({ ...formData, program: e.target.value })} required>
                                <option value="">Select Program</option>
                                {programs.map(p => <option key={p.id} value={p.id}>{p.code} - {p.name}</option>)}
                            </select>
                            <select className="form-input" value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} required>
                                <option value="">Select Instructor</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.firstname} {t.lastname}</option>)}
                            </select>
                            <label>Year Level</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="Year Level"
                                value={formData.year_level}
                                onChange={e => setFormData({ ...formData, year_level: e.target.value })}
                                required
                                min="1"
                                max="5"
                            />
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-save">{isEditMode ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertState.isOpen}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                onClose={closeAlert}
                onConfirm={alertState.onConfirm}
            />
        </div>
    );
}

const AlertModal = ({ isOpen, title, message, type, onClose, onConfirm }) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className={`modal-content alert-modal`}>
                <h2 className="modal-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{title}</h2>
                <div className="alert-message">
                    {message}
                </div>
                <div className="modal-actions" style={{ justifyContent: 'center' }}>
                    {type === 'confirm' ? (
                        <>
                            <button onClick={onClose} className="btn-cancel">Cancel</button>
                            <button onClick={handleConfirm} className="btn-confirm">Confirm</button>
                        </>
                    ) : (
                        <button onClick={onClose} className="btn-save">OK</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AcademicManagement;
