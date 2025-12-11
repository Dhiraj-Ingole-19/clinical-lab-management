import React from 'react';
import { X, Calendar, Clock, MapPin, Phone, CheckCircle, XCircle, FileText, User, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentDetailsModal = ({ appointment, isOpen, onClose, onUpdateStatus }) => {
    if (!isOpen || !appointment) return null;

    // --- Data Mapping (Copied from Card Logic) ---
    // 1. Parse Date & Time
    let displayDate = 'Date Pending';
    let displayTime = '--:--';
    if (appointment.appointmentTime) {
        try {
            const dateObj = new Date(appointment.appointmentTime);
            displayDate = dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
            displayTime = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
        } catch (e) { console.error(e); }
    }

    // 2. Patient Details
    const displayAge = appointment.patientAge || appointment.age || '--';
    const displayGender = appointment.patientGender || appointment.gender || 'Not Specified';
    const rawMobile = appointment.patientMobile || appointment.mobile || appointment.phone;
    const displayPhone = rawMobile || '';

    // 3. Test Names
    const displayTests = appointment.testName || appointment.testNames || (Array.isArray(appointment.tests) ? appointment.tests.map(t => t.testName).join(', ') : 'Pending');

    // 4. Visit Type
    const isHome = appointment.isHomeVisit || (appointment.collectionAddress && appointment.collectionAddress.length > 5);

    // Helper for Status Styles
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-gray-900">{appointment.patientName}</h2>
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-200 text-gray-600">#{appointment.id}</span>
                            </div>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(appointment.status)}`}>
                                {appointment.status}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="p-6 overflow-y-auto space-y-6">

                        {/* 1. Test Details */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prescribed Tests</span>
                                    <p className="text-slate-700 font-medium text-base mt-0.5">{displayTests}</p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Demographics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                                <span className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1.5 mb-1.5">
                                    <User size={14} /> Age
                                </span>
                                <p className="text-lg font-semibold text-gray-900">{displayAge} <span className="text-sm font-normal text-gray-500">Years</span></p>
                            </div>
                            <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                                <span className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1.5 mb-1.5">
                                    <User size={14} /> Gender
                                </span>
                                <p className="text-lg font-semibold text-gray-900">{displayGender}</p>
                            </div>
                        </div>

                        {/* 3. Logistics */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2 min-w-[120px]">
                                    <Calendar size={18} className="text-blue-500" />
                                    <span>{displayDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-purple-500" />
                                    <span>{displayTime}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin size={20} className={`mt-0.5 ${isHome ? 'text-orange-500' : 'text-gray-400'}`} />
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Location</span>
                                    <p className="text-gray-800 font-medium">
                                        {isHome ? (appointment.collectionAddress || 'Home Visit') : 'Lab Visit (Walk-in)'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
                        {displayPhone && (
                            <a
                                href={`tel:${displayPhone}`}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                <Phone size={18} /> Call Patient
                            </a>
                        )}

                        {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                            <button
                                onClick={() => { onUpdateStatus(appointment.id, 'COMPLETED'); onClose(); }}
                                className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                            >
                                <CheckCircle size={18} /> Mark Complete
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AppointmentDetailsModal;
