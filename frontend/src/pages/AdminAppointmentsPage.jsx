import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labApi } from '../services/api';
import { Search, Filter, FileText, Loader2 } from 'lucide-react';
import './AdminDashboardPage.css';

const AdminAppointmentsPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // 1. Fetch Appointments using useQuery
    const {
        data: appointments = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ['adminAppointments'],
        queryFn: async () => {
            const res = await labApi.getAllAppointments();
            return res.data;
        }
    });

    // 2. Update Status using useMutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status, reportUrl }) => {
            return await labApi.updateAppointmentStatus(id, status, reportUrl);
        },
        onSuccess: () => {
            // Invalidating the query triggers a background refetch
            // The UI will NOT flash "Loading..." unless we explicitly tell it to
            queryClient.invalidateQueries(['adminAppointments']);
        },
        onError: (error) => {
            console.error("Update failed", error);
            alert("Failed to update status. Please try again.");
        }
    });

    const handleStatusUpdate = (id, status) => {
        if (!window.confirm(`Are you sure you want to mark this as ${status}?`)) return;
        updateStatusMutation.mutate({ id, status, reportUrl: null });
    };

    // Filter and Sort Logic (Client-side for now)
    const filteredAppointments = appointments
        .filter(apt => {
            const matchesSearch = (apt.patientName && apt.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (apt.id.toString().includes(searchTerm));
            const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));

    if (isLoading) return <div className="loading"><Loader2 className="animate-spin" /> Loading Appointments...</div>;
    if (isError) return <div className="error-state">Failed to load appointments.</div>;

    return (
        <div className="admin-page-container">
            <header className="page-header">
                <h1>All Appointments</h1>
                <p>Manage all patient bookings</p>
                {/* Show a small spinner if background updating */}
                {queryClient.isFetching > 0 && <span className="text-sm text-gray-500 ml-2">Updating...</span>}
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
                            <tr key={apt.id} className={updateStatusMutation.isPending && updateStatusMutation.variables?.id === apt.id ? 'opacity-50' : ''}>
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
                                        {/* Show loading spinner on the specific row being updated */}
                                        {updateStatusMutation.isPending && updateStatusMutation.variables?.id === apt.id ? (
                                            <Loader2 size={16} className="animate-spin text-blue-500" />
                                        ) : (
                                            <>
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
                                            </>
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
