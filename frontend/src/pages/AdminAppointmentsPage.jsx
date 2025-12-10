import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labApi } from '../services/api';
import StickyHeader from '../components/StickyHeader';
import AppointmentCard from '../components/AppointmentCard';
import MobileNavbar from '../components/MobileNavbar';
import './AdminDashboardPage.css';

const AdminAppointmentsPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // 1. Fetch Appointments using useQuery (PRESERVED)
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

    // 2. Update Status using useMutation (PRESERVED)
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
        // If status is passed (from my hardcoded card), use it. 
        // Or if generic update, we could prompt. 
        // For now, adhering to the signature used in AppointmentCard: onUpdateStatus(id, 'COMPLETED')
        if (!status) return;

        if (!window.confirm(`Are you sure you want to mark this as ${status}?`)) return;
        updateStatusMutation.mutate({ id, status, reportUrl: null });
    };

    // Filter Logic
    const filteredAppointments = appointments
        .filter(apt => {
            const matchesSearch = (apt.patientName && apt.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (apt.id.toString().includes(searchTerm));
            const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter; // StickyHeader passes 'ALL' or specific status
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime)); // Newest first

    if (isError) return (
        <div className="flex flex-col items-center justify-center h-screen text-red-500 bg-gray-50">
            <h2 className="text-xl font-semibold">Failed to load appointments</h2>
            <p className="text-sm">Please try refreshing the page.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            {/* 1. Header (Slim) */}
            <StickyHeader onSearch={setSearchTerm} onFilterChange={setStatusFilter} />

            {/* 2. Content Grid */}
            <div className="p-4 max-w-7xl mx-auto">
                {/* Page Title - Now below the Sticky Header */}
                <div className="mb-5 mt-2 px-1">
                    <h2 className="text-xl font-bold text-gray-900">All Appointments</h2>
                    <p className="text-gray-500 text-xs mt-0.5">Manage patient requests</p>
                </div>

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

            {/* 3. Bottom Nav */}
            <MobileNavbar />
        </div>
    );
};

export default AdminAppointmentsPage;
