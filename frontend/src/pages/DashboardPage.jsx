import React, { useEffect, useState } from 'react';
import { labApi } from '../services/api';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Download } from 'lucide-react';
import './Dashboard.css';

const DashboardPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await labApi.getMyAppointments();
                // Sort by date descending
                const sorted = res.data.sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime));
                setAppointments(sorted);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="loading">Loading Dashboard...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>My Dashboard</h1>
                <Link to="/book-test" className="btn-primary">
                    <Calendar size={18} style={{ marginRight: '8px' }} />
                    Book New Test
                </Link>
            </header>

            <section className="appointments-section">
                <h2>Appointment History</h2>

                {appointments.length === 0 ? (
                    <div className="empty-state">
                        <p>No appointments found.</p>
                        <Link to="/book-test">Book your first test now!</Link>
                    </div>
                ) : (
                    <div className="appointments-grid">
                        {appointments.map(apt => (
                            <div key={apt.id} className="appointment-card">
                                <div className="card-header">
                                    <span className="date">
                                        {new Date(apt.appointmentTime).toLocaleDateString()}
                                    </span>
                                    <span className={`status-badge ${apt.status.toLowerCase()}`}>
                                        {apt.status}
                                    </span>
                                </div>

                                <div className="card-body">
                                    <p><strong>Patient:</strong> {apt.patientName || 'Self'}</p>
                                    <p><strong>Tests:</strong> {apt.tests.map(t => t.testName).join(', ')}</p>
                                    <p><strong>Total:</strong> ₹{apt.totalAmount}</p>
                                </div>

                                <div className="card-footer">
                                    {apt.status === 'COMPLETED' && apt.reportUrl ? (
                                        <a href={apt.reportUrl} target="_blank" rel="noreferrer" className="btn-outline">
                                            <Download size={16} /> Download Report
                                        </a>
                                    ) : (
                                        <span className="info-text">
                                            {apt.status === 'PENDING' ? 'Waiting for confirmation' : 'Processing...'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardPage;
