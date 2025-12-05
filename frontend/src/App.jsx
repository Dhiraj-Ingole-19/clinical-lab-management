import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import RoleRoute from './components/RoleRoute.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User Routes */}
      <Route element={<RoleRoute roleRequired="USER" />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<RoleRoute roleRequired="ADMIN" />}>
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;