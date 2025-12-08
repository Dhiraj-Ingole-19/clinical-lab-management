import React, { useEffect, useState } from 'react';
import { labApi } from '../services/api';
import { Search, Filter, FileText } from 'lucide-react';
import './AdminDashboardPage.css'; // Reuse styles

const AdminAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await labApi.getAllAppointments();
            setAppointments(res.data);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        if (!window.confirm(`Are you sure you want to mark this as ${status}?`)) return;
        try {
            await labApi.updateAppointmentStatus(id, status, null); // Report URL handled separately if needed
            fetchAppointments();
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update status");
        }
    };

    // Filter and Sort
    const filteredAppointments = appointments
        .filter(apt => {
            const matchesSearch = (apt.patientName && apt.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (apt.id.toString().includes(searchTerm));
            const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            // Sort by Date Ascending, then Time Ascending
            return new Date(a.appointmentTime) - new Date(b.appointmentTime);
        });

    if (loading) return <div className="loading">Loading Appointments...</div>;

    return (
        <div className="admin-page-container">
            <header className="page-header">
                <h1>All Appointments</h1>
                <p>Manage all patient bookings</p>
            </header>

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID or Patient Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <Filter size={18} />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date & Time</th>
                            <th>Patient Details</th>
                            <th>Test(s)</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map(apt => (
                            <tr key={apt.id}>
                                <td>#{apt.id}</td>
                                <td>
                                    <div className="datetime">
                                        <span className="date">{new Date(apt.appointmentTime).toLocaleDateString()}</span>
                                        <span className="time">{new Date(apt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="patient-meta">
                                        <strong>{apt.patientName || 'Self'}</strong>
                                        <span>{apt.patientAge} Years / {apt.patientGender}</span>
                                        <span>{apt.patientMobile}</span>
                                    </div>
                                </td>
                                <td>{apt.tests.map(t => t.testName).join(', ')}</td>
                                <td>{(apt.homeVisit || apt.isHomeVisit) ? <span className="badge-home">Home</span> : 'Lab'}</td>
                                <td><span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span></td>
                                <td>
                                    <div className="actions">
                                        {apt.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => handleStatusUpdate(apt.id, 'CONFIRMED')} className="btn-icon confirm" title="Confirm">✓</button>
                                                <button onClick={() => handleStatusUpdate(apt.id, 'CANCELLED')} className="btn-icon cancel" title="Cancel">✕</button>
                                            </>
                                        )}
                                        {apt.status === 'CONFIRMED' && (
                                            <button onClick={() => handleStatusUpdate(apt.id, 'COMPLETED')} className="btn-icon complete" title="Mark Completed">
                                                <FileText size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAppointmentsPage;
