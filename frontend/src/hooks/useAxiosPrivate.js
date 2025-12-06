import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "./useAuth";
import axios from "../api/axios";

const useAxiosPrivate = () => {
    const { auth, setAuth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    try {
                        const response = await axios.post('/auth/refresh/', {
                            refresh: auth?.refreshToken
                        });
                        const newAccessToken = response.data.access;

                        setAuth(prev => {
                            // Update local storage as well
                            localStorage.setItem('access', newAccessToken);
                            return { ...prev, accessToken: newAccessToken };
                        });

                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);
                    } catch (err) {
                        // Refresh failed, user needs to login again
                        setAuth({});
                        localStorage.removeItem('access');
                        localStorage.removeItem('refresh');
                        return Promise.reject(error); // Or redirect to login
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, setAuth]);

    return axiosPrivate;
}

export default useAxiosPrivate;
