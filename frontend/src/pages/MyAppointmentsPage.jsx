import React from 'react';
import { labApi } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import './Dashboard.css';

const MyAppointmentsPage = () => {
    const {
        data: appointments = [],
        isLoading,
        isError
    } = useQuery({
        queryKey: ['myAppointments'], // Matches Dashboard fetch for shared cache
        queryFn: async () => {
            const res = await labApi.getMyAppointments();
            return res.data;
        }
    });

    const sortedAppointments = [...appointments].sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime));

    if (isLoading) return <div className="loading-state"><Loader2 className="animate-spin" /> Loading your history...</div>;
    if (isError) return <div className="error-state">Failed to load history.</div>;

    return (
        <div className="my-appointments-page">
            <h1 className="page-title">My Appointments</h1>

            {sortedAppointments.length === 0 ? (
                <div className="empty-state">
                    <p>No appointment history found.</p>
                </div>
            ) : (
                <div className="appointments-list-view">
                    {sortedAppointments.map(apt => (
                        <div key={apt.id} className="appointment-card history-card">
                            <div className="history-header">
                                <span className="history-id">#{apt.id}</span>
                                <span className={`status-badge ${apt.status.toLowerCase()}`}>{apt.status}</span>
                            </div>

                            <div className="history-details">
                                <p><strong>Date:</strong> {new Date(apt.appointmentTime).toLocaleDateString()} at {new Date(apt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p><strong>Patient:</strong> {apt.patientName || 'Self'}</p>
                                <p><strong>Tests:</strong> {apt.tests.map(t => t.testName).join(', ')}</p>
                                <p><strong>Type:</strong> {(apt.homeVisit || apt.isHomeVisit) ? 'Home Collection' : 'Lab Visit'}</p>
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
