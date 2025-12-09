import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { labApi } from '../services/api';
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, CalendarX } from 'lucide-react';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentSkeleton from '../components/AppointmentSkeleton';
import './AdminDashboardPage.css';

const AdminAppointmentsPage = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

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
        if (!window.confirm(`Are you sure you want to mark this as ${status}?`)) return;
        updateStatusMutation.mutate({ id, status, reportUrl: null });
    };

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Filter and Sort Logic
    const filteredAppointments = appointments
        .filter(apt => {
            const matchesSearch = (apt.patientName && apt.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (apt.id.toString().includes(searchTerm));
            const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime)); // Newest first

    // Pagination Logic
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const displayedAppointments = filteredAppointments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isError) return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <CalendarX size={48} className="mb-4 opacity-50" />
            <h2 className="text-xl font-semibold">Failed to load appointments</h2>
            <p className="text-sm">Please try refreshing the page.</p>
        </div>
    );

    return (
        <div className="admin-page-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="page-header mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Appointments</h1>
                        <p className="text-gray-500 mt-1">Manage all patient bookings</p>
                    </div>
                    {queryClient.isFetching > 0 && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                            <Loader2 size={14} className="animate-spin" />
                            Updating...
                        </div>
                    )}
                </div>
            </header>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between sticky top-20 z-10 transition-shadow hover:shadow-md">
                <div className="relative w-full md:w-96">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID or Patient Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter size={18} className="text-gray-400 shrink-0" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-48 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 bg-white"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                // Loading Skeleton
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <AppointmentSkeleton key={i} />
                    ))}
                </div>
            ) : filteredAppointments.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <CalendarX size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
                    <p className="text-gray-500 max-w-sm mt-1">
                        We couldn't find any appointments matching your current filters. Try generating a new request or adjusting your search.
                    </p>
                    <button
                        onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                        className="mt-6 text-blue-600 font-medium hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                // Appointment Grid
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedAppointments.map(apt => (
                            <AppointmentCard
                                key={apt.id}
                                appointment={apt}
                                onStatusUpdate={handleStatusUpdate}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                            <div className="text-sm text-gray-500">
                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAppointments.length)}</span> of <span className="font-medium">{filteredAppointments.length}</span> results
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 flex items-center">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminAppointmentsPage;
