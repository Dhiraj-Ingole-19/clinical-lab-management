import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { labApi } from '../services/api';
import { CheckCircle, FileText, Users, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
    // 1. Fetch Appointments
    const {
        data: appointments = [],
        isLoading: isAptLoading
    } = useQuery({
        queryKey: ['adminAppointments'], // Matches key in AppointmentsPage for shared cache
        queryFn: async () => {
            const res = await labApi.getAllAppointments();
            return res.data;
        }
    });

    // 2. Fetch Users
    const {
        data: users = [],
        isLoading: isUserLoading
    } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: async () => {
            const res = await labApi.getAllUsers();
            return res.data;
        }
    });

    const isLoading = isAptLoading || isUserLoading;

    // Stats Logic
    const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
    const today = new Date().toISOString().split('T')[0];
    const todayCount = appointments.filter(a => a.appointmentTime && a.appointmentTime.startsWith(today)).length;
    const totalPatients = users.filter(u => u.roles && u.roles.some(r => r.name === 'ROLE_USER')).length;

    // Recent 5 (Sorted by Date Descending)
    const recentAppointments = [...appointments]
        .sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime))
        .slice(0, 5);

    if (isLoading) return <div className="loading"><Loader2 className="animate-spin" /> Loading Admin Dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p className="subtitle">Today's Overview</p>
                </div>
                <div className="date-badge">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card pending">
                    <div className="stat-top">
                        <div className="icon-box"><Clock size={24} /></div>
                        <span className="stat-value">{pendingCount}</span>
                    </div>
                    <p className="stat-label">Pending Requests</p>
                </div>

                <div className="stat-card today">
                    <div className="stat-top">
                        <div className="icon-box"><CheckCircle size={24} /></div>
                        <span className="stat-value">{todayCount}</span>
                    </div>
                    <p className="stat-label">Today's Visits</p>
                </div>

                <div className="stat-card patients">
                    <div className="stat-top">
                        <div className="icon-box"><Users size={24} /></div>
                        <span className="stat-value">{totalPatients}</span>
                    </div>
                    <p className="stat-label">Total Patients</p>
                </div>
            </div>

            {/* Recent Requests Section */}
            <section className="recent-requests">
                <div className="section-header">
                    <h2>Recent Appointment Requests</h2>
                    <Link to="/admin/appointments" className="view-all-btn">
                        View All Appointments <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Tests</th>
                                <th>Requested Date</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="empty-cell">No recent appointments found.</td>
                                </tr>
                            ) : (
                                recentAppointments.map(apt => (
                                    <tr key={apt.id}>
                                        <td>
                                            <div className="patient-info">
                                                <span className="name">{apt.patientName || 'Self'}</span>
                                            </div>
                                        </td>
                                        <td>{apt.tests.map(t => t.testName).join(', ')}</td>
                                        <td>{new Date(apt.appointmentTime).toLocaleDateString()}</td>
                                        <td>{new Date(apt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>
                                            <span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboardPage;
