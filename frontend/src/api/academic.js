import { axiosPrivate } from './axios';

export const getClasses = async () => {
    // ClassScheduleViewSet
    return axiosPrivate.get('/schedules/');
};

export const getSections = async () => {
    // SectionViewSet
    return axiosPrivate.get('/sections/');
};

export const getCourses = async () => {
    return axiosPrivate.get('/courses/');
};

export const createSection = async (data) => {
    return axiosPrivate.post('/sections/', data);
};

export const getPrograms = async () => {
    return axiosPrivate.get('/programs/');
};

export const getDays = async () => {
    return axiosPrivate.get('/days/');
};

export const createSchedule = async (data) => {
    return axiosPrivate.post('/schedules/', data);
};

export const getSchedule = async (id) => {
    return axiosPrivate.get(`/schedules/${id}/`);
};
