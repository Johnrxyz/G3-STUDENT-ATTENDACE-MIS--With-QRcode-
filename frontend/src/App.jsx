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
import AdminNav from './layouts/AdminNav';
import AdminDashboard from './pages/admin/AdminDashboard';
import RequestManagement from './pages/admin/RequestManagement';
import UserList from './pages/admin/UserList';
import AcademicManagement from './pages/admin/AcademicManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
            <Route path="/teacher" element={<TeacherNav />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="generate-qr" element={<GenerateQR />} />
              <Route path="generate-qr/:id" element={<GenerateQR />} />
              <Route path="live-attendance" element={<LiveAttendance />} />
              <Route path="classes" element={<ClassList />} />
              <Route path="classes/:id" element={<StudentList />} />
              <Route path="history" element={<AttendanceHistory />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminNav />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="requests" element={<RequestManagement />} />
              <Route path="users" element={<UserList />} />
              <Route path="academic" element={<AcademicManagement />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student" element={<StudentNav />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="scan-qr" element={<ScanQR />} />
              <Route path="schedule" element={<ClassSchedule />} />
              <Route path="history" element={<StudentAttendanceHistory />} />
              <Route path="profile" element={<StudentProfile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
