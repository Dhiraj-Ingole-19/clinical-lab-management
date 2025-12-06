import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    Calendar,
    FileText,
    User,
    LogOut,
    LayoutDashboard,
    List,
    Settings
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Chopade Lab</h2>
            </div>

            <nav className="sidebar-nav">
                {isAdmin ? (
                    // Admin Links
                    <>
                        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/admin/appointments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <List size={20} />
                            <span>All Appointments</span>
                        </NavLink>
                        <NavLink to="/admin/tests" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Settings size={20} />
                            <span>Manage Tests</span>
                        </NavLink>
                        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <User size={20} />
                            <span>Profile</span>
                        </NavLink>
                    </>
                ) : (
                    // User Links
                    <>
                        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Home size={20} />
                            <span>Home</span>
                        </NavLink>
                        <NavLink to="/book-test" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Calendar size={20} />
                            <span>Book Test</span>
                        </NavLink>
                        <NavLink to="/my-appointments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <FileText size={20} />
                            <span>My Appointments</span>
                        </NavLink>
                        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <User size={20} />
                            <span>Profile</span>
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
