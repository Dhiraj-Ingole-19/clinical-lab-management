import React from 'react';
import { LayoutDashboard, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const MobileNavbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe md:hidden">
            <div className="flex justify-around items-center h-16">
                <Link to="/dashboard" className={`flex flex-col items-center justify-center w-1/3 transition-colors ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}>
                    <LayoutDashboard size={24} />
                    <span className={`text-[10px] font-medium mt-1 ${isActive('/dashboard') ? 'font-bold' : ''}`}>Dash</span>
                </Link>
                <Link to="/appointments" className={`flex flex-col items-center justify-center w-1/3 transition-colors ${isActive('/appointments') ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}>
                    <ClipboardList size={24} />
                    <span className={`text-[10px] font-medium mt-1 ${isActive('/appointments') ? 'font-bold' : ''}`}>All Appts</span>
                </Link>
                <Link to="/profile" className={`flex flex-col items-center justify-center w-1/3 transition-colors ${isActive('/profile') ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}>
                    <User size={24} />
                    <span className={`text-[10px] font-medium mt-1 ${isActive('/profile') ? 'font-bold' : ''}`}>Profile</span>
                </Link>
            </div>
        </div>
    );
};
export default MobileNavbar;
