import React, { useEffect, useState } from 'react';
import { labApi } from '../services/api';
import './Dashboard.css'; // Reusing dashboard styles for table/cards

const MyAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await labApi.getMyAppointments();
                // Sort by newest first
                const sorted = res.data.sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime));
                setAppointments(sorted);
            } catch (err) {
                console.error("Failed to fetch history", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="loading-state">Loading your history...</div>;

    return (
        <div className="my-appointments-page">
            <h1 className="page-title">My Appointments</h1>

            {appointments.length === 0 ? (
                <div className="empty-state">
                    <p>No appointment history found.</p>
                </div>
            ) : (
                <div className="appointments-list-view">
                    {appointments.map(apt => (
                        <div key={apt.id} className="appointment-card history-card">
                            <div className="history-header">
                                <span className="history-id">#{apt.id}</span>
                                <span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
                            </div>

                            <div className="history-details">
                                <p><strong>Date:</strong> {new Date(apt.appointmentTime).toLocaleDateString()} at {new Date(apt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p><strong>Patient:</strong> {apt.patientName || 'Self'}</p>
                                <p><strong>Tests:</strong> {apt.tests.map(t => t.testName).join(', ')}</p>
                                <p><strong>Type:</strong> {apt.isHomeVisit ? 'Home Collection' : 'Lab Visit'}</p>
                            </div>

                            {apt.reportUrl && (
                                <div className="history-actions">
                                    <a href={apt.reportUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                                        Download Report
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsPage;
