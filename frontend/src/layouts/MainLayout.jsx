import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div className="main-layout">
            {/* Desktop Sidebar - Hidden on Mobile via CSS */}
            <aside className="layout-sidebar">
                <Sidebar />
            </aside>

            {/* Main Content Area */}
            <main className="layout-content">
                <div className="content-container">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Nav - Hidden on Desktop via CSS */}
            <nav className="layout-bottom-nav">
                <BottomNav />
            </nav>
        </div>
    );
};

export default MainLayout;
