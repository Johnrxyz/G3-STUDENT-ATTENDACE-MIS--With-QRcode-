import { useState, useEffect } from 'react';
import { getTeacherSessions, openSession, closeSession } from '../api/attendance';
import { getClasses } from '../api/academic';
import useAuth from './useAuth';
import useAxiosPrivate from './useAxiosPrivate';

const useTeacher = () => {
    const { auth } = useAuth();
    useAxiosPrivate(); // Ensure interceptors are attached
    const [sessions, setSessions] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTeacherData = async () => {
        try {
            setLoading(true);
            const [sessionsRes, schedulesRes] = await Promise.all([
                getTeacherSessions(),
                getClasses()
            ]);

            setSessions(sessionsRes.data);
            setSchedules(schedulesRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.user?.role === 'teacher' || auth?.user?.role === 'admin') {
            fetchTeacherData();
        }
    }, [auth]);

    const handleOpenSession = async (scheduleId) => {
        try {
            const res = await openSession(scheduleId);
            await fetchTeacherData(); // Refresh list
            return res.data;
        } catch (err) {
            throw err;
        }
    };

    const handleCloseSession = async (sessionId) => {
        try {
            await closeSession(sessionId);
            await fetchTeacherData();
        } catch (err) {
            throw err;
        }
    };

    return { sessions, schedules, loading, handleOpenSession, handleCloseSession, refreshData: fetchTeacherData };
};

export default useTeacher;
