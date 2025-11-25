// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  // 1. Get *both* isAuthenticated and the new isLoading state
  const { isAuthenticated, isLoading } = useAuth();

  // 2. Check if the app is still on its initial load
  if (isLoading) {
    // If we're still loading, show a blank page or a spinner
    // This prevents a "flash" of the login page before we know if we're auth'd
    return <div>Loading session...</div>; // Or a spinner component
  }

  // 3. If we are DONE loading and the user is NOT authenticated, redirect
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 4. If we are DONE loading and the user IS authenticated, show the page
  return <Outlet />;
};

export default ProtectedRoute;