import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherNav from './layouts/TeacherNav';
import GenerateQR from './pages/teacher/GenerateQR';
import LiveAttendance from './pages/teacher/LiveAttendance';
import ClassList from './pages/teacher/ClassList';
import StudentList from './pages/teacher/StudentList';
import Dashboard from './pages/teacher/Dashboard';
import AttendanceHistory from './pages/teacher/AttendanceHistory';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentNav from './layouts/StudentNav';
import StudentDashboard from './pages/student/StudentDashboard';
import ScanQR from './pages/student/ScanQR';
import ClassSchedule from './pages/student/ClassSchedule';
import StudentAttendanceHistory from './pages/student/AttendanceHistory';
import StudentProfile from './pages/student/StudentProfile';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/teacher" element={<TeacherNav />}>
          <Route index element={<Navigate to="generate-qr" replace />} />
          <Route path="generate-qr" element={<GenerateQR />} />
          <Route path="generate-qr/:id" element={<GenerateQR />} />
          <Route path="live-attendance" element={<LiveAttendance />} />
          <Route path="classes" element={<ClassList />} />
          <Route path="classes/:id" element={<StudentList />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="history" element={<AttendanceHistory />} />
        </Route>
        <Route path="/student" element={<StudentNav />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="scan-qr" element={<ScanQR />} />
          <Route path="schedule" element={<ClassSchedule />} />
          <Route path="history" element={<StudentAttendanceHistory />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
