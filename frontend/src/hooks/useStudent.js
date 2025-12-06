import { useState, useEffect } from 'react';
import { getStudentProfile, getMyEnrolledSections } from '../api/users';
import { getStudentAttendanceHistory } from '../api/attendance';
import useAuth from './useAuth';
import useAxiosPrivate from './useAxiosPrivate';

const useStudent = () => {
    const { auth } = useAuth();
    useAxiosPrivate(); // Ensure interceptors are attached
    const [profile, setProfile] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            const [profileRes, historyRes] = await Promise.all([
                getStudentProfile(),
                getStudentAttendanceHistory()
            ]);

            // Handle profile response (list or object?)
            // Assuming ViewSet returns list based on filter
            if (Array.isArray(profileRes.data) && profileRes.data.length > 0) {
                setProfile(profileRes.data[0]);
            } else if (!Array.isArray(profileRes.data)) {
                setProfile(profileRes.data);
            } else {
                setProfile(null); // Handle empty list case safely
            }

            setHistory(historyRes.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch if role is student
        if (auth?.user?.role === 'student') {
            fetchStudentData();
        }
    }, [auth]);

    return { profile, history, loading, error, refetch: fetchStudentData };
};

export default useStudent;
