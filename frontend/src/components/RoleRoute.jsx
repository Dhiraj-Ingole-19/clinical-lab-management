import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// roleRequired: 'ADMIN' or 'USER'
const RoleRoute = ({ roleRequired }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    // Strict Separation Logic
    if (roleRequired === 'ADMIN' && !isAdmin) return <Navigate to="/dashboard" replace />;
    if (roleRequired === 'USER' && isAdmin) return <Navigate to="/admin/dashboard" replace />;

    return <Outlet />;
};

export default RoleRoute;
