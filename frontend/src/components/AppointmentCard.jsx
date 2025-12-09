import React, { useState } from 'react';
import {
    Clock,
    Calendar,
    MapPin,
    User,
    Phone,
    ChevronDown,
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
        // Toast notification would go here
    };

    // 3. Logic & Styling Rules: Status Logic
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

    // Helper to determine the "Update Status" button action/text
    const getNextStatusAction = () => {
        if (appointment.status === 'PENDING') return { label: 'Confirm Appointment', status: 'CONFIRMED' };
        if (appointment.status === 'CONFIRMED') return { label: 'Complete Visit', status: 'COMPLETED' };
        return null;
    };

    const nextAction = getNextStatusAction();

    return (
        <div
            className={`
                group bg-white rounded-2xl border transition-all duration-300 ease-out
                ${isExpanded
                    ? 'ring-2 ring-blue-100 shadow-xl border-blue-200 scale-[1.02]'
                    : 'border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-100'
                }
            `}
        >
            {/* State A: Collapsed View (The Summary) */}
            <div
                onClick={toggleExpand}
                className="p-5 cursor-pointer flex flex-col gap-4 relative overflow-hidden"
            >
                {/* Visual Touch: Subtle status indicator generic bg bar */}
                <div className={`absolute top-0 left-0 w-1 h-full ${appointment.status === 'PENDING' ? 'bg-yellow-400' :
                        appointment.status === 'CONFIRMED' ? 'bg-blue-500' :
                            appointment.status === 'COMPLETED' ? 'bg-green-500' : 'bg-red-400'
                    }`} />

                {/* Top Row: Name & Status */}
                <div className="flex justify-between items-start pl-2">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight tracking-tight">
                                {appointment.patientName || 'Self'}
                            </h3>
                            <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                #{appointment.id}
                            </span>
                        </div>
                        {/* Test Name with Icon */}
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                            <FileText size={14} className="text-blue-500" />
                            <span className="line-clamp-1">
                                {appointment.tests?.map(t => t.testName).join(', ') || 'General Visit'}
                            </span>
                        </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border shadow-sm flex items-center gap-1.5 uppercase ${statusColors[appointment.status]}`}>
                        <StatusIcon size={12} strokeWidth={3} />
                        {appointment.status}
                    </span>
                </div>

                {/* Bottom Row: Date/Time + Chevron */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 pl-2">
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-300" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-300" />
                            <span>{formattedTime}</span>
                        </div>
                    </div>

                    <button className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-300 ${isExpanded ? 'rotate-180 bg-blue-100 text-blue-600' : ''}`}>
                        <ChevronDown size={18} />
                    </button>
                </div>
            </div>

            {/* State B: Expanded View (The Details) */}
            {isExpanded && (
                <div className="bg-gray-50/80 p-5 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">

                    {/* Grid: Demographics */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                <span className="text-xs font-bold">Age</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{appointment.patientAge || 'N/A'}</p>
                                <p className="text-[10px] text-gray-400 uppercase">Years Old</p>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                                <span className="text-xs font-bold">Sex</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 capitalize">{appointment.patientGender || 'N/A'}</p>
                                <p className="text-[10px] text-gray-400 uppercase">Gender</p>
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="mb-6 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${hasAddress ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
                                <MapPin size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Location</span>
                                    {hasAddress && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyAddress(fullAddress); }}
                                            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md transition-colors"
                                        >
                                            <Copy size={12} /> Copy
                                        </button>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                    {hasAddress ? fullAddress : '📍 Lab Visit (Walk-in)'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            {appointment.patientMobile ? (
                                <a
                                    href={`tel:${appointment.patientMobile}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-white border border-green-200 text-green-700 rounded-xl hover:bg-green-50 shadow-sm font-semibold text-sm transition-all active:scale-95"
                                >
                                    <Phone size={16} /> Call
                                </a>
                            ) : (
                                <div className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-400 rounded-xl border border-gray-200 cursor-not-allowed text-sm font-medium">
                                    <Phone size={16} /> No Phone
                                </div>
                            )}

                            {nextAction ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onStatusUpdate(appointment.id, nextAction.status); }}
                                    className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 font-semibold text-sm transition-all active:scale-95"
                                >
                                    <CheckCircle size={16} /> {nextAction.label === 'Confirm Appointment' ? 'Confirm' : 'Complete'}
                                </button>
                            ) : (
                                <div className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-500 rounded-xl border border-gray-200 font-medium text-sm">
                                    <CheckCircle size={16} /> {appointment.status}
                                </div>
                            )}
                        </div>

                        {appointment.status === 'PENDING' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onStatusUpdate(appointment.id, 'CANCELLED'); }}
                                className="w-full text-center py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                                Cancel Appointment
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentCard;
