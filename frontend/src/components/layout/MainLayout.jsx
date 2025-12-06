import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Navbar from '../Navbar'; // Assuming Navbar is in src/components/Navbar.jsx
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div className="main-layout">

            {/* Main Content Area */}
            <div className="layout-wrapper">
                {/* Top Navbar */}
                <header className="layout-header">
                    <Navbar />
                </header>

                <main className="layout-content">
                    <div className="content-container">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <nav className="layout-bottom-nav">
                <BottomNav />
            </nav>
        </div>
    );
};

export default MainLayout;
