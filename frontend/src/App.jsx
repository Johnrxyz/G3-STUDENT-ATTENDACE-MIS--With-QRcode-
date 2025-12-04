import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherLayout from './layouts/TeacherLayout';
import GenerateQR from './pages/GenerateQR';
import LiveAttendance from './pages/LiveAttendance';
import ClassList from './pages/ClassList';
import Dashboard from './pages/Dashboard';
import AttendanceHistory from './pages/AttendanceHistory';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/teacher/generate-qr" replace />} />
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="generate-qr" replace />} />
          <Route path="generate-qr" element={<GenerateQR />} />
          <Route path="live-attendance" element={<LiveAttendance />} />
          <Route path="classes" element={<ClassList />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="history" element={<AttendanceHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
