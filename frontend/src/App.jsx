// src/App.jsx

import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import RoleRoute from './components/RoleRoute.jsx';
import Navbar from './components/Navbar.jsx';
import './App.css';

// Lazy Load Components
const DashboardPage = React.lazy(() => import('./pages/DashboardPage.jsx'));
const BookAppointmentPage = React.lazy(() => import('./pages/BookAppointmentPage.jsx'));
const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboardPage.jsx'));
const AboutPage = React.lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = React.lazy(() => import('./pages/ContactPage.jsx'));
const TestMenuPage = React.lazy(() => import('./pages/TestMenuPage.jsx'));

// This layout is for PRIVATE pages (dashboard, settings, etc.)
import Sidebar from './components/Sidebar.jsx';
import BottomNav from './components/BottomNav.jsx';

const AppLayout = ({ children }) => {
  return (
    <div className="app-shell">
      {/* Desktop Sidebar (Column 1) */}
      <aside className="desktop-sidebar">
        <Sidebar />
      </aside>
      {/* Main Content Area (Column 2) */}
      <div className="main-area">
        <Navbar /> {/* Now sits inside the grid column, not on top */}
        <main className="main-content">
          <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
      {/* Mobile Nav (Bottom) */}
      <nav className="mobile-bottom-nav">
        <BottomNav />
      </nav>
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<Suspense fallback={<div>Loading...</div>}><AboutPage /></Suspense>} />
      <Route path="/contact" element={<Suspense fallback={<div>Loading...</div>}><ContactPage /></Suspense>} />
      <Route path="/menu" element={<Suspense fallback={<div>Loading...</div>}><TestMenuPage /></Suspense>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* --- USER PROTECTED ROUTES --- */}
      <Route element={<RoleRoute roleRequired="USER" />}>
        <Route
          path="/dashboard"
          element={<AppLayout><DashboardPage /></AppLayout>}
        />
        <Route
          path="/book-test"
          element={<AppLayout><BookAppointmentPage /></AppLayout>}
        />
        <Route
          path="/my-appointments"
          element={<AppLayout><DashboardPage /></AppLayout>}
        />
        <Route
          path="/profile"
          element={<AppLayout><div>Profile Page (Coming Soon)</div></AppLayout>}
        />
      </Route>

      {/* --- ADMIN PROTECTED ROUTES --- */}
      <Route element={<RoleRoute roleRequired="ADMIN" />}>
        <Route
          path="/admin/dashboard"
          element={<AppLayout><AdminDashboardPage /></AppLayout>}
        />
        <Route
          path="/admin/appointments"
          element={<AppLayout><AdminDashboardPage /></AppLayout>} // Reusing for now, logic handles tabs
        />
        <Route
          path="/admin/tests"
          element={<AppLayout><div>Manage Tests (Coming Soon)</div></AppLayout>}
        />
      </Route>

      {/* Fallback to the public home page */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;