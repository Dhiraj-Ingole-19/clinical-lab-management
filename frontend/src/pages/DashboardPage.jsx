import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="dashboard-container">
            <h1>Welcome, {user.username}!</h1>
            <p>Your role is: {user.roles && user.roles.join(', ')}</p>
            <button onClick={handleLogout} className="btn-primary">Logout</button>
        </div>
    );
};

export default DashboardPage;
