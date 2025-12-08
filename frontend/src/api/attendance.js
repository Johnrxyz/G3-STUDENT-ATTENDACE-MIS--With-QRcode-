import { axiosPrivate } from './axios';

// Teacher Endpoints
export const openSession = async (scheduleId) => {
    return axiosPrivate.post('/attendance/sessions/open/', { schedule_id: scheduleId });
};

export const closeSession = async (sessionId) => {
    return axiosPrivate.post(`/attendance/sessions/${sessionId}/close/`);
};

export const getSessionRecords = async (sessionId) => {
    return axiosPrivate.get(`/attendance/sessions/${sessionId}/records/`);
};

export const getTeacherSessions = async () => {
    // AttendanceSessionViewSet filters by teacher ownership
    return axiosPrivate.get('/attendance/sessions/');
};

export const simulateScan = async (sessionId) => {
    return await axiosPrivate.post(`/attendance/sessions/${sessionId}/simulate_scan/`);
};

// Student Endpoints
export const scanAttendance = async (qrToken) => {
    return axiosPrivate.post('/attendance/scan/scan/', { qr_token: qrToken });
};

export const getStudentAttendanceHistory = async () => {
    return axiosPrivate.get('/attendance/records/');
};

export const getCalendarHistory = async () => {
    return axiosPrivate.get('/attendance/records/calendar/');
};

export const getSessionMonitoring = async (sessionId) => {
    return axiosPrivate.get(`/attendance/sessions/${sessionId}/monitoring/`);
};

export const getAdminAnalytics = async () => {
    return axiosPrivate.get('/analytics/summary/');
};
