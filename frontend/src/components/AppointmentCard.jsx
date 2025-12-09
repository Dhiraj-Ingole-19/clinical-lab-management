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
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${isExpanded ? 'ring-2 ring-blue-50 shadow-md' : 'hover:shadow-md'}`}>

            {/* State A: Collapsed View (The Summary) - Tapping header toggles state */}
            <div
                onClick={toggleExpand}
                className="p-4 cursor-pointer active:bg-gray-50 flex flex-col gap-3"
            >
                {/* Top Row: Patient Name (Bold) + Patient ID (Small/Grey) ... Status Badge (Pill) */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight text-base">
                            {appointment.patientName || 'Self'}
                        </h3>
                        <span className="text-xs text-gray-500 font-mono">#{appointment.id}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${statusColors[appointment.status] || 'bg-gray-100 text-gray-800'}`}>
                        <StatusIcon size={12} strokeWidth={2.5} />
                        {appointment.status}
                    </span>
                </div>

                {/* Middle Row: Test Name (Icon + Text) */}
                <div className="flex items-start gap-2 text-sm text-gray-700">
                    <FileText size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-1 font-medium">
                        {appointment.tests?.map(t => t.testName).join(', ') || 'No tests specified'}
                    </span>
                </div>

                {/* Bottom Row: Date & Time (Icon + Text) */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>{formattedTime}</span>
                    </div>
                </div>

                {/* Centered Chevron Toggle */}
                <div className="flex justify-center mt-1">
                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown size={20} className="text-gray-400" />
                    </div>
                </div>
            </div>

            {/* State B: Expanded View (The Details) */}
            {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 animate-in slide-in-from-top-2 duration-200">

                    {/* Patient Demographics: Age and Gender */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                <User size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Age</p>
                                <p className="font-semibold text-gray-900 text-sm">{appointment.patientAge || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                <User size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Gender</p>
                                <p className="font-semibold text-gray-900 capitalize text-sm">{appointment.patientGender || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Location Details: Address with Map Pin + Copy Button */}
                    <div className="mb-6">
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className={`shrink-0 mt-0.5 ${hasAddress ? 'text-red-500' : 'text-gray-400'}`} />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Collection Address</p>
                                    {hasAddress && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyAddress(fullAddress); }}
                                            className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-blue-50 transition-colors"
                                        >
                                            <Copy size={12} /> Copy
                                        </button>
                                    )}
                                </div>
                                {hasAddress ? (
                                    <p className="text-sm text-gray-800 leading-relaxed break-words">{fullAddress}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">📍 Lab Visit (Walk-in)</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        {/* Button 1: "Call Patient" */}
                        {appointment.patientMobile ? (
                            <a
                                href={`tel:${appointment.patientMobile}`}
                                className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-semibold border border-green-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Phone size={16} />
                                Call
                            </a>
                        ) : (
                            <div className="py-3 bg-gray-50 text-gray-300 rounded-lg flex justify-center items-center border border-gray-100 cursor-not-allowed">
                                <Phone size={16} />
                            </div>
                        )}

                        {/* Button 2: "Update Status" */}
                        {nextAction ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); onStatusUpdate(appointment.id, nextAction.status); }}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm font-semibold transition-colors active:scale-[0.98]"
                            >
                                {nextAction.label === 'Confirm Appointment' ? 'Confirm' : 'Complete'}
                            </button>
                        ) : (
                            <button disabled className="w-full py-3 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed">
                                {appointment.status === 'CANCELLED' ? 'Cancelled' : 'Completed'}
                            </button>
                        )}
                    </div>

                    {/* Button 3: "Cancel" (Centered Text Link) */}
                    {appointment.status === 'PENDING' && (
                        <div className="text-center">
                            <button
                                onClick={(e) => { e.stopPropagation(); onStatusUpdate(appointment.id, 'CANCELLED'); }}
                                className="px-4 py-2 text-red-600 hover:text-red-700 text-sm font-medium hover:underline hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Cancel Appointment
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppointmentCard;
