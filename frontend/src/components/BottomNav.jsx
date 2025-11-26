import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    Calendar,
    FileText,
    User,
    LayoutDashboard,
    List
} from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    if (isAdmin) {
        return (
            <div className="bottom-nav">
                <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={24} />
                    <span>Dash</span>
                </NavLink>
                <NavLink to="/admin/appointments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <List size={24} />
                    <span>All Appts</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <User size={24} />
                    <span>Profile</span>
                </NavLink>
            </div>
        );
    }

    return (
        <div className="bottom-nav">
            <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={24} />
                <span>Home</span>
            </NavLink>
            <NavLink to="/book-test" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Calendar size={24} />
                <span>Book</span>
            </NavLink>
            <NavLink to="/my-appointments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <FileText size={24} />
                <span>History</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <User size={24} />
                <span>Profile</span>
            </NavLink>
        </div>
    );
};

export default BottomNav;
