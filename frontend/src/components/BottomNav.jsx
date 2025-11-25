import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ArrowRightLeft, MessageSquare, Settings, Users, FileText } from 'lucide-react';
import './BottomNav.css';

const BottomNav = ({ className }) => {
    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    return (
        <nav className={`bottom-nav ${className}`}>
            {isAdmin ? (
                // Admin Navigation
                <>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/dashboard?tab=users" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                        <Users />
                        <span>Users</span>
                    </NavLink>
                    <NavLink to="/admin/dashboard?tab=queue" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                        <FileText />
                        <span>Requests</span>
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                        <Settings />
                        <span>Profile</span>
                    </NavLink>
                </>
            ) : (
                // User Navigation
                <>
                    <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard />
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/transactions" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                        <ArrowRightLeft />
                        <span>Transact</span>
                    </NavLink>
                    <NavLink to="/my-requests" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                        <MessageSquare />
                        <span>Requests</span>
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                        <Settings />
                        <span>Profile</span>
                    </NavLink>
                </>
            )}
        </nav>
    );
};

export default BottomNav;
