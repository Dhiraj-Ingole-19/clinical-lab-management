import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labApi } from '../services/api';
import StickyHeader from '../components/StickyHeader';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentCard from '../components/AppointmentCard';
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
            queryClient.invalidateQueries(['adminAppointments']);
        },
        onError: (error) => {
            console.error("Update failed", error);
            alert("Failed to update status. Please try again.");
        }
    });

    const handleStatusUpdate = (id, status) => {
        if (!status) return;
        if (!window.confirm(`Are you sure you want to mark this as ${status}?`)) return;
        updateStatusMutation.mutate({ id, status, reportUrl: null });
    };

    // Filter Logic
    const filteredAppointments = appointments
        .filter(apt => {
            const matchesSearch = (apt.patientName && apt.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (apt.id.toString().includes(searchTerm));
            const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime)); // Ascending (Oldest first)

    if (isError) return (
        <div className="flex flex-col items-center justify-center h-screen text-red-500 bg-gray-50">
            <h2 className="text-xl font-semibold">Failed to load appointments</h2>
            <p className="text-sm">Please try refreshing the page.</p>
        </div>
    );

    return (
        // Negative margins to counteract MainLayout padding (p-4 mobile, p-8 desktop) to ensure full-bleed
        <div className="min-h-screen bg-gray-50 pb-32 -mt-4 -mx-4 md:-mt-8 md:-mx-8">
            {/* MASTER STICKY CONTAINER (Title + Search) */}
            {/* Top-0 because it lives inside the scrolling .layout-content, which starts below the Navbar */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">

                {/* 1. Fixed Heading */}
                <div className="px-4 py-3 bg-white border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">All Appointments</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Manage all patient bookings</p>
                </div>

                {/* 2. Fixed Search Bar (Imported Component) */}
                <StickyHeader onSearch={setSearchTerm} onFilterChange={setStatusFilter} />
            </div>

            {/* 3. Scrollable Content Stream */}
            <div className="p-4 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Loading appointments...</div>
                ) : (
                    /* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((appt) => (
                                <AppointmentCard
                                    key={appt.id}
                                    appointment={appt}
                                    onUpdateStatus={handleStatusUpdate}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                No appointments found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Nav provided by MainLayout */}
        </div>
    );
};

export default AdminAppointmentsPage;
