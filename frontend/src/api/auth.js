import axios from './axios';

export const login = async (email, password) => {
    return axios.post('/auth/login/', { email, password });
};

export const logout = async (refreshToken) => {
    return axios.post('/auth/logout/', { refresh: refreshToken });
};

export const refresh = async (refreshToken) => {
    return axios.post('/auth/refresh/', { refresh: refreshToken });
};
