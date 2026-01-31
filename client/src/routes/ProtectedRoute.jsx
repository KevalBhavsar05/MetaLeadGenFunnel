
import { useApp } from "@/contexts/useApp";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoute() {
    const { user, isAuthLoading, isAuthError } = useApp();

    if (isAuthLoading) {
        return <div>Loading...</div>;
    }

    if (isAuthError || !user || user?.role !== "admin") return <Navigate to="/" replace />;

    return <Outlet />
}

export default ProtectedRoute;
