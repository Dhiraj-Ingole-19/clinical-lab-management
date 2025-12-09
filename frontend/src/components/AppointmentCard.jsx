import React, { useState } from 'react';
import {
    Clock,
    Calendar,
    MapPin,
    User,
    Phone,
    ChevronDown,
    ChevronUp,
    Copy,
    CheckCircle,
    XCircle,
    FileText,
    AlertCircle
} from 'lucide-react';

const AppointmentCard = ({ appointment, onStatusUpdate }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const copyAddress = (address) => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        // Optional: toast notification could go here
    };

    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
        COMPLETED: 'bg-green-100 text-green-800 border-green-200',
        CANCELLED: 'bg-red-100 text-red-800 border-red-200'
    };

    const StatusIcon = {
        PENDING: Clock,
        CONFIRMED: CheckCircle,
        COMPLETED: FileText,
        CANCELLED: XCircle
    }[appointment.status] || AlertCircle;

    const formattedDate = new Date(appointment.appointmentTime).toLocaleDateString(undefined, {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
    const formattedTime = new Date(appointment.appointmentTime).toLocaleTimeString([], {
        hour: '2-digit', minute: '2-digit'
    });

    const hasAddress = appointment.street || appointment.city || appointment.zipCode || appointment.isHomeVisit;
    const fullAddress = `${appointment.street || ''}, ${appointment.city || ''} ${appointment.zipCode || ''}`.replace(/^, /, '').trim();

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${isExpanded ? 'ring-2 ring-blue-50' : 'hover:shadow-md'}`}>
            {/* Header / Summary View */}
            <div
                onClick={toggleExpand}
                className="p-4 cursor-pointer active:bg-gray-50 flex flex-col gap-3"
            >
                {/* Top Row: Name & Status */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">
                            {appointment.patientName || 'Self'}
                        </h3>
                        <span className="text-xs text-gray-500 font-mono">#{appointment.id}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${statusColors[appointment.status] || 'bg-gray-100 text-gray-800'}`}>
                        <StatusIcon size={12} strokeWidth={2.5} />
                        {appointment.status}
                    </span>
                </div>

                {/* Middle Row: Tests */}
                <div className="flex items-start gap-2 text-sm text-gray-700">
                    <FileText size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{appointment.tests?.map(t => t.testName).join(', ')}</span>
                </div>

                {/* Bottom Row: Date & Time + Expand Icon */}
                <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>{formattedTime}</span>
                        </div>
                    </div>
                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Expanded Details View */}
            {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Demographics */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                <User size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Age</p>
                                <p className="font-semibold text-gray-900">{appointment.patientAge || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                                <User size={16} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Gender</p>
                                <p className="font-semibold text-gray-900 capitalize">{appointment.patientGender || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="mb-4">
                        <div className="flex items-start gap-2.5 p-3 bg-white rounded-lg border border-gray-100">
                            <MapPin size={18} className={`shrink-0 mt-0.5 ${hasAddress ? 'text-red-500' : 'text-gray-400'}`} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Collection Address</p>
                                {hasAddress ? (
                                    <>
                                        <p className="text-sm text-gray-800 leading-relaxed">{fullAddress || "Home Collection"}</p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyAddress(fullAddress); }}
                                            className="text-xs text-blue-600 font-medium mt-1 hover:underline flex items-center gap-1"
                                        >
                                            <Copy size={12} /> Copy Address
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        📍 Lab Visit (Walk-in)
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        {appointment.patientMobile && (
                            <a
                                href={`tel:${appointment.patientMobile}`}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Phone size={16} />
                                Call
                            </a>
                        )}

                        {appointment.status === 'PENDING' && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onStatusUpdate(appointment.id, 'CONFIRMED'); }}
                                    className="flex-[2] py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 text-sm font-medium transition-colors"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onStatusUpdate(appointment.id, 'CANCELLED'); }}
                                    className="flex-1 py-2.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </>
                        )}

                        {appointment.status === 'CONFIRMED' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onStatusUpdate(appointment.id, 'COMPLETED'); }}
                                className="flex-[2] py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm shadow-green-200 text-sm font-medium transition-colors"
                            >
                                Complete Visit
                            </button>
                        )}

                        {['COMPLETED', 'CANCELLED'].includes(appointment.status) && (
                            <div className="flex-1 text-center py-2 text-xs text-gray-400 font-medium bg-gray-50 rounded-lg">
                                No Actions Available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentCard;
