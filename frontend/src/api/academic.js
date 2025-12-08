import { axiosPrivate } from './axios';

export const getClasses = async (axiosInstance = axiosPrivate) => {
    // ClassScheduleViewSet
    return axiosInstance.get('/schedules/');
};

export const getSections = async (axiosInstance = axiosPrivate) => {
    // SectionViewSet
    return axiosInstance.get('/sections/');
};

export const getPublicSections = async (axiosInstance = axiosPrivate) => {
    return axiosInstance.get('/sections/public/');
};

export const getCourses = async (axiosInstance = axiosPrivate) => {
    return axiosInstance.get('/courses/');
};

export const createSection = async (data, axiosInstance = axiosPrivate) => {
    return axiosInstance.post('/sections/', data);
};

export const getPrograms = async (axiosInstance = axiosPrivate) => {
    return axiosInstance.get('/programs/');
};

export const getDays = async (axiosInstance = axiosPrivate) => {
    return axiosInstance.get('/days/');
};

export const createSchedule = async (data, axiosInstance = axiosPrivate) => {
    return axiosInstance.post('/schedules/', data);
};

export const getSchedule = async (id, axiosInstance = axiosPrivate) => {
    return axiosInstance.get(`/schedules/${id}/`);
};
