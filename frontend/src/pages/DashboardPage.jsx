import React from 'react';
import { useAuth } from '../context/AuthContext';
import { labApi } from '../services/api';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, FileText, PlusCircle, Clock, Loader2 } from 'lucide-react';
import './Dashboard.css';

const DashboardPage = () => {
    const { user } = useAuth();

    const {
        data: appointments = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ['myAppointments'],
        queryFn: async () => {
            const res = await labApi.getMyAppointments();
            return res.data;
        },
        enabled: !!user // Only fetch if user is logged in
    });

    // Get upcoming vs past
    const upcoming = appointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED');
    // Sort by recent first for display
    const recent = [...appointments]
        .sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime))
        .slice(0, 3);

    return (
        <div className="dashboard-page">
            {/* Welcome Banner */}
            <header className="dashboard-header">
                <div>
                    <h1>Hello, {user?.username} 👋</h1>
                    <p>Welcome back to Chopade Clinical Lab.</p>
                </div>
                <Link to="/book-test" className="btn btn-primary">
                    <PlusCircle size={20} />
                    <span>New Appointment</span>
                </Link>
            </header>

            {/* Quick Stats/Actions */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-icon blue">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{upcoming.length}</h3>
                        <p>Upcoming Appointments</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon teal">
                        <FileText size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{appointments.length}</h3>
                        <p>Total Visits</p>
                    </div>
                </div>
            </div>

            {/* Recent Appointments Section */}
            <section className="recent-section">
                <div className="section-header">
                    <h2>Recent Activity</h2>
                    <Link to="/my-appointments" className="text-link">View All</Link>
                </div>

                {isLoading ? (
                    <div className="loading-state"><Loader2 className="animate-spin" /> Loading history...</div>
                ) : isError ? (
                    <div className="error-state">Failed to load appointments.</div>
                ) : appointments.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't booked any tests yet.</p>
                        <Link to="/book-test" className="btn btn-secondary mt-2">Book Now</Link>
                    </div>
                ) : (
                    <div className="appointments-grid">
                        {recent.map(apt => (
                            <div key={apt.id} className="appointment-card">
                                <div className="apt-header">
                                    <span className="apt-date">
                                        {new Date(apt.appointmentTime).toLocaleDateString()}
                                    </span>
                                    <span className={`status-badge ${apt.status.toLowerCase()}`}>
                                        {apt.status}
                                    </span>
                                </div>
                                <div className="apt-body">
                                    <h4>{apt.tests.map(t => t.testName).join(', ')}</h4>
                                    <p className="apt-time">
                                        <Clock size={16} />
                                        {new Date(apt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                {apt.reportUrl && (
                                    <a href={apt.reportUrl} target="_blank" rel="noopener noreferrer" className="btn-sm btn-outline">
                                        View Report
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardPage;
