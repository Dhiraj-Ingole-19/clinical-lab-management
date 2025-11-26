import React, { useEffect, useState } from 'react';
import { labApi } from '../services/api';
import { CheckCircle, FileText, Search } from 'lucide-react';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('TODAY'); // TODAY or ALL
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [selectedApt, setSelectedApt] = useState(null);
    const [reportUrl, setReportUrl] = useState('');

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

    const getFilteredAppointments = () => {
        let filtered = appointments;

        if (activeTab === 'TODAY') {
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter(a => a.appointmentTime.startsWith(today));
        }

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(a =>
                (a.patientName && a.patientName.toLowerCase().includes(lower)) ||
                (a.id.toString().includes(lower))
            );
        }

        // Sort by newest first
        return filtered.sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime));
    };

    const handleStatusUpdate = async (status) => {
        if (!selectedApt) return;
        try {
            await labApi.updateAppointmentStatus(selectedApt.id, status, status === 'COMPLETED' ? reportUrl : null);
            alert(`Appointment marked as ${status}`);
            setSelectedApt(null);
            setReportUrl('');
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update status");
        }
    };

    const sendWhatsApp = (apt) => {
        // Mock WhatsApp Link
        const msg = `Hello ${apt.patientName || 'User'}, your appointment at Chopade Lab is confirmed for ${new Date(apt.appointmentTime).toLocaleString()}.`;
        window.open(`https://wa.me/${apt.patientMobile}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    if (loading) return <div className="loading">Loading Admin Dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="tabs">
                    <button
                        className={activeTab === 'TODAY' ? 'active' : ''}
                        onClick={() => setActiveTab('TODAY')}
                    >
                        Today's Schedule
                    </button>
                    <button
                        className={activeTab === 'ALL' ? 'active' : ''}
                        onClick={() => setActiveTab('ALL')}
                    >
                        All History
                    </button>
                </div>
            </header>

            <div className="search-bar">
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search by Patient Name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="appointments-list">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Tests</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getFilteredAppointments().map(apt => (
                            <tr key={apt.id} onClick={() => setSelectedApt(apt)} className="clickable-row">
                                <td>#{apt.id}</td>
                                <td>{new Date(apt.appointmentTime).toLocaleDateString()}</td>
                                <td>
                                    {apt.patientName || 'Self'} <br />
                                    <small>{apt.patientMobile}</small>
                                </td>
                                <td>{apt.tests.map(t => t.testName).join(', ')}</td>
                                <td>
                                    <span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
                                </td>
                                <td>
                                    <button className="btn-sm">Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Management Modal */}
            {selectedApt && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Manage Appointment #{selectedApt.id}</h3>
                        <p><strong>Patient:</strong> {selectedApt.patientName || 'Self'}</p>
                        <p><strong>Tests:</strong> {selectedApt.tests.map(t => t.testName).join(', ')}</p>

                        <div className="modal-actions">
                            {selectedApt.status === 'PENDING' && (
                                <button
                                    className="btn-confirm"
                                    onClick={() => {
                                        handleStatusUpdate('CONFIRMED');
                                        sendWhatsApp(selectedApt);
                                    }}
                                >
                                    <CheckCircle size={16} /> Confirm & WhatsApp
                                </button>
                            )}

                            <div className="report-section">
                                <h4>Upload Report</h4>
                                <input
                                    type="text"
                                    placeholder="Paste Google Drive Link..."
                                    value={reportUrl}
                                    onChange={(e) => setReportUrl(e.target.value)}
                                />
                                <button
                                    className="btn-complete"
                                    disabled={!reportUrl}
                                    onClick={() => handleStatusUpdate('COMPLETED')}
                                >
                                    <FileText size={16} /> Mark Completed
                                </button>
                            </div>
                        </div>

                        <button className="btn-close" onClick={() => setSelectedApt(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
