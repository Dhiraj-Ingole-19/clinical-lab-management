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

    // Helper for Initials
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    if (isLoading) return <div className="loading"><Loader2 className="animate-spin" /> Loading Admin Dashboard...</div>;

    const todayDate = new Date();
    const formattedDate = todayDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 space-y-8">
            {/* 1. Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview for {new Date().toLocaleDateString()}</p>
                </div>
                <div className="px-5 py-2 bg-gray-100 text-slate-600 rounded-full text-sm font-semibold shadow-sm">
                    {formattedDate}
                </div>
            </header>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Requests */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <Clock size={28} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900">{pendingCount}</h3>
                        <p className="text-sm font-medium text-slate-500">Pending Requests</p>
                    </div>
                </div>

                {/* Today's Visits */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <CheckCircle size={28} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900">{todayCount}</h3>
                        <p className="text-sm font-medium text-slate-500">Today's Visits</p>
                    </div>
                </div>

                {/* Total Patients */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <Users size={28} strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-slate-900">{totalPatients}</h3>
                        <p className="text-sm font-medium text-slate-500">Total Patients</p>
                    </div>
                </div>
            </div>

            {/* 3. Today's Appointments Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Today's Appointments</h2>
                    <Link to="/admin/appointments" className="flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors">
                        View All History <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="overflow-hidden">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <div className="col-span-4">Patient Name</div>
                        <div className="col-span-4">Test(s)</div>
                        <div className="col-span-2">Scheduled Time</div>
                        <div className="col-span-2 text-right">Status</div>
                    </div>

                    {/* Data Rows */}
                    <div className="space-y-3">
                        {todaysAppointments.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-500">
                                No appointments scheduled for today.
                            </div>
                        ) : (
                            todaysAppointments.map(apt => (
                                <div key={apt.id} className="grid grid-cols-12 items-center bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-bold">
                                            {getInitials(apt.patientName || 'Self')}
                                        </div>
                                        <span className="font-semibold text-slate-900">{apt.patientName || 'Self'}</span>
                                    </div>
                                    <div className="col-span-4 text-slate-600 font-medium text-sm line-clamp-1">
                                        {Array.isArray(apt.tests) ? apt.tests.map(t => t.testName).join(', ') : (apt.testName || apt.testNames)}
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2 text-slate-500 text-sm font-medium">
                                        <Clock size={16} />
                                        {new Date(apt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                            apt.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
                                            apt.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200' :
                                            apt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                            'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboardPage;
