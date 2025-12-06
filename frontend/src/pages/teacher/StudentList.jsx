import React, { useState } from 'react';
import { Search, Plus, Edit2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import './StudentList.css';

const StudentList = () => {
    const { id } = useParams();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    // Mock Data
    const classData = {
        '1': [ // IT101
            { id: '023A-10980', name: 'John Dimayuga', section: '4A', attendance: '80%', status: 'Not FDA' },
            { id: '023A-10981', name: 'Louise Vuitton', section: '4A', attendance: '88%', status: 'Not FDA' },
            { id: '023A-10982', name: 'Jonal Carlo', section: '4A', attendance: '71%', status: 'FDA' },
            { id: '023A-10983', name: 'John Rey Nalo', section: '4A', attendance: '94%', status: 'Not FDA' },
            { id: '023A-10984', name: 'Merry Esmos', section: '4A', attendance: '96%', status: 'Not FDA' },
        ],
        '2': [ // IT102
            { id: '023A-20001', name: 'Alice Smith', section: '3B', attendance: '95%', status: 'Not FDA' },
            { id: '023A-20002', name: 'Bob Jones', section: '3B', attendance: '82%', status: 'Not FDA' },
            { id: '023A-20003', name: 'Charlie Brown', section: '3B', attendance: '65%', status: 'FDA' },
            { id: '023A-20004', name: 'David Lee', section: '3B', attendance: '90%', status: 'Not FDA' },
        ],
        '3': [ // IT103
            { id: '023A-30001', name: 'Eve Wilson', section: '4A', attendance: '88%', status: 'Not FDA' },
            { id: '023A-30002', name: 'Frank Miller', section: '4A', attendance: '75%', status: 'FDA' },
            { id: '023A-30003', name: 'Grace Taylor', section: '4A', attendance: '92%', status: 'Not FDA' },
        ],
        '4': [ // IT104
            { id: '023A-40001', name: 'Henry Davis', section: '3A', attendance: '98%', status: 'Not FDA' },
            { id: '023A-40002', name: 'Ivy Chen', section: '3A', attendance: '85%', status: 'Not FDA' },
            { id: '023A-40003', name: 'Jack White', section: '3A', attendance: '70%', status: 'FDA' },
            { id: '023A-40004', name: 'Kelly Martin', section: '3A', attendance: '91%', status: 'Not FDA' },
            { id: '023A-40005', name: 'Liam Wilson', section: '3A', attendance: '89%', status: 'Not FDA' },
        ],
        '5': [ // IT105
            { id: '023A-50001', name: 'Mike Ross', section: '3A', attendance: '93%', status: 'Not FDA' },
            { id: '023A-50002', name: 'Rachel Zane', section: '3A', attendance: '88%', status: 'Not FDA' },
            { id: '023A-50003', name: 'Louis Litt', section: '3A', attendance: '78%', status: 'FDA' },
        ],
        '6': [ // IT106
            { id: '023A-60001', name: 'Harvey Specter', section: '3B', attendance: '99%', status: 'Not FDA' },
            { id: '023A-60002', name: 'Donna Paulsen', section: '3B', attendance: '97%', status: 'Not FDA' },
            { id: '023A-60003', name: 'Jessica Pearson', section: '3B', attendance: '95%', status: 'Not FDA' },
        ]
    };

    const students = classData[id] || [];

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
                    <button className="btn-add-student">
                        Add student
                    </button>
                </div>

                <div className="students-table-container">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Student name</th>
                                <th>Student ID</th>
                                <th>Section</th>
                                <th>Attendance %</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={index}>
                                    <td>
                                        <span className="student-name">{student.name}</span>
                                    </td>
                                    <td>{student.id}</td>
                                    <td>{student.section}</td>
                                    <td>{student.attendance}</td>
                                    <td>
                                        {(
                                            <span className={`status-badge ${student.status === 'FDA' ? 'fda' : 'not-fda'}`}>
                                                {student.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentList;
