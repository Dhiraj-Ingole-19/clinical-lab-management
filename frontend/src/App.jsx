import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BookAppointmentPage from './pages/BookAppointmentPage.jsx';
import MyAppointmentsPage from './pages/MyAppointmentsPage.jsx';
import ProfilePage from './pages/user/ProfilePage.jsx';
import RoleRoute from './components/RoleRoute.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './components/layout/MainLayout.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Shared Authenticated Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* User Routes */}
      <Route element={<RoleRoute roleRequired="USER" />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/book-test" element={<BookAppointmentPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<RoleRoute roleRequired="ADMIN" />}>
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Add other admin routes here later */}
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;