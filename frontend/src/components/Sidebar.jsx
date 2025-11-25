import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ArrowRightLeft, MessageSquare, Settings, LogOut, Wallet, Users, FileText } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ className }) => {
    const { user, logout } = useAuth();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    return (
        <aside className={`sidebar glass-panel ${className}`}>
            <div className="sidebar-brand">
                <Wallet size={28} />
                <span>DigiBank</span>
            </div>

            <nav className="sidebar-nav">
                {isAdmin ? (
                    // Admin Navigation
                    <>
                        <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/admin/dashboard?tab=users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Users />
                            <span>User Management</span>
                        </NavLink>
                        <NavLink to="/admin/dashboard?tab=queue" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <FileText />
                            <span>Rollback Queue</span>
                        </NavLink>
                        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Settings />
                            <span>Settings</span>
                        </NavLink>
                    </>
                ) : (
                    // User Navigation
                    <>
                        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard />
                            <span>Dashboard</span>
                        </NavLink>
                        <NavLink to="/transactions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <ArrowRightLeft />
                            <span>Transactions</span>
                        </NavLink>
                        <NavLink to="/my-requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <MessageSquare />
                            <span>My Requests</span>
                        </NavLink>
                        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <Settings />
                            <span>Settings</span>
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
