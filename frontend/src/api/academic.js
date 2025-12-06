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
