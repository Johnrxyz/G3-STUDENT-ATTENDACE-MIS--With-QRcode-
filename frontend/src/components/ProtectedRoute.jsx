import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ProtectedRoute = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    useAxiosPrivate(); // Set up axios interceptors

    // Check if we have an access token
    if (!auth?.accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if role matches
    if (allowedRoles && !allowedRoles.includes(auth.user?.role)) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
