import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Import useAuth from context

const AuthGuard = () => {
    const { session } = useAuth();

    if (!session) {
        return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }

    return <Outlet />; // Render the child components (protected routes)
};

export default AuthGuard;