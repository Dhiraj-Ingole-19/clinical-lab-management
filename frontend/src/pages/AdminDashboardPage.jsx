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

    // Today's Appointments (Filtered & Sorted Ascending)
    const todaysAppointments = appointments
        .filter(a => a.appointmentTime && a.appointmentTime.startsWith(today))
        .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));

    if (isLoading) return <div className="loading"><Loader2 className="animate-spin" /> Loading Admin Dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p className="subtitle">Overview for {new Date().toLocaleDateString()}</p>
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

            {/* Today's Appointments Section */}
            <section className="recent-requests">
                <div className="section-header">
                    <h2>Today's Appointments</h2>
                    <Link to="/admin/appointments" className="view-all-btn">
                        View All History <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Test(s)</th>
                                <th>Scheduled Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todaysAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="empty-cell">No appointments scheduled for today.</td>
                                </tr>
                            ) : (
                                todaysAppointments.map(apt => (
                                    <tr key={apt.id}>
                                        <td>
                                            <div className="patient-info">
                                                <span className="name">{apt.patientName || 'Self'}</span>
                                            </div>
                                        </td>
                                        <td>{Array.isArray(apt.tests) ? apt.tests.map(t => t.testName).join(', ') : (apt.testName || apt.testNames)}</td>
                                        <td>
                                            <div className="flex items-center gap-2 font-mono font-medium text-slate-600">
                                                <Clock size={14} />
                                                {new Date(apt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
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
