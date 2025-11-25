// src/components/AdminRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // 1. Wait until the app is done loading the user's session
  if (isLoading) {
    return <div>Loading session...</div>;
  }

  // 2. If they aren't logged in, send them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If they are logged in but ARE NOT an admin, send them to the user dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. If they are logged in AND are an admin, show the admin page
  return <Outlet />;
};

export default AdminRoute;