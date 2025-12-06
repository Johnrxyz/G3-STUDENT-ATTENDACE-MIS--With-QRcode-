import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import for named export
import axios from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // Initial state from local storage or empty
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('access');
        const refresh = localStorage.getItem('refresh');
        if (token) {
            try {
                const user = jwtDecode(token);
                return {
                    user: {
                        username: user.username || user.email,
                        role: user.role,
                        id: user.user_id,
                        full_name: user.full_name
                    },
                    accessToken: token,
                    refreshToken: refresh
                };
            } catch (e) {
                return {};
            }
        }
        return {};
    });

    const login = async (email, password) => {
        try {
            const response = await axios.post('/auth/login/', { email, password });
            const { access, refresh } = response.data;

            const decoded = jwtDecode(access);
            const userData = {
                username: decoded.username || decoded.email,
                role: decoded.role,
                id: decoded.user_id,
                full_name: decoded.full_name // Extract full name from token
            };

            setAuth({ user: userData, accessToken: access, refreshToken: refresh });
            localStorage.setItem('access', access);
            localStorage.setItem('refresh', refresh);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        setAuth({});
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        // Optional: call backend logout to blacklist token
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
