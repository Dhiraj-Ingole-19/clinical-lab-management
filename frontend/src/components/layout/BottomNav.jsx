import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNavItems } from '../../config/navigation';
import './BottomNav.css';

const BottomNav = () => {
    const { user } = useAuth();

    // Get items relevant to current user and filtered for Mobile view
    const navItems = getNavItems(user).filter(item => item.mobile);

    if (navItems.length === 0) return null;

    return (
        <div className="bottom-nav">
            {navItems.map((item) => (
                <NavLink
                    key={item.path + item.label}
                    to={item.path}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <item.icon size={24} />
                    <span>{item.label === 'My Appts' ? 'Appts' : item.label}</span>
                </NavLink>
            ))}
        </div>
    );
};

export default BottomNav;
