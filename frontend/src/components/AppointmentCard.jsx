import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, ChevronDown, ChevronUp, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AppointmentCard = ({ appointment, onClick, onUpdateStatus }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // --- 🔧 Data Mapping Logic (Backend Entity -> Frontend Display) ---

    // 1. Parse Date & Time from 'appointmentTime' (ISO String: "2023-10-25T14:30:00")
    let displayDate = 'Date Pending';
    let displayTime = '--:--';

    if (appointment.appointmentTime) {
        try {
            const dateObj = new Date(appointment.appointmentTime);
            // Date: "Mon, 15 Dec 2025"
            displayDate = dateObj.toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            // Time: "14:30"
            displayTime = dateObj.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false // 24h format matches medical standard
            });
        } catch (e) {
            console.error("Date parsing error", e);
        }
    }

    // 2. Patient Details
    // Backend uses 'patientAge', 'patientGender', 'patientMobile'
    const displayAge = appointment.patientAge || appointment.age || '--';
    const displayGender = appointment.patientGender || appointment.gender || 'Not Specified';
    const rawMobile = appointment.patientMobile || appointment.mobile || appointment.phone;
    const displayPhone = rawMobile || '';

    // 3. Test Names
    // Checks 'testName' (single), 'testNames' (string csv), or 'tests' (array of objects)
    const displayTests = appointment.testName
        || appointment.testNames
        || (Array.isArray(appointment.tests) && appointment.tests.length > 0
            ? appointment.tests.map(t => t.testName).join(', ')
            : 'Pending Test Selection');

    // 4. Visit Type Logic
    // Robust check: True if 'isHomeVisit' flag is true OR if there is a long address string
    const isHome = appointment.isHomeVisit
        || (appointment.collectionAddress && appointment.collectionAddress.length > 5);

    // --- 🖱️ Interaction Handler (Hybrid UX) ---
    const handleCardClick = (e) => {
        // Prevent trigger if clicking buttons/links
        if (e.target.closest('button') || e.target.closest('a')) return;

        const isDesktop = window.matchMedia('(min-width: 768px)').matches;
        if (isDesktop) {
            // Desktop: Open Modal
            onClick(appointment);
        } else {
            // Mobile: Toggle Accordion
            setIsExpanded(!isExpanded);
        }
    };

    // --- 🎨 UI Styles ---
    // --- 🎨 UI Styles (Left Border + Badges) ---
    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed': return {
                borderClass: 'border-l-green-500',
                badgeClass: 'bg-green-100 text-green-700',
                icon: <CheckCircle size={14} className="stroke-[2.5px]" />,
                text: 'Completed'
            };
            case 'cancelled': return {
                borderClass: 'border-l-red-500',
                badgeClass: 'bg-red-100 text-red-700',
                icon: <XCircle size={14} className="stroke-[2.5px]" />,
                text: 'Cancelled'
            };
            case 'confirmed': return {
                borderClass: 'border-l-blue-500',
                badgeClass: 'bg-blue-100 text-blue-700',
                icon: <CheckCircle size={14} className="stroke-[2.5px]" />,
                text: 'Confirmed'
            };
            default: return {
                borderClass: 'border-l-indigo-500',
                badgeClass: 'bg-indigo-50 text-indigo-700',
                icon: <Clock size={14} className="stroke-[2.5px]" />,
                text: 'Pending'
            };
        }
    };
    const style = getStatusStyles(appointment.status);

    return (
        <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 border-l-[6px] ${style.borderClass} flex flex-col h-full`}>
            {/* Main Clickable Area */}
            <div className="p-5 cursor-pointer flex-grow" onClick={handleCardClick}>

                {/* Header Row: ID & Status */}
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">#{appointment.id}</span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${style.badgeClass}`}>
                        {style.icon}
                        <span>{style.text}</span>
                    </div>
                </div>

                {/* Patient Name */}
                <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{appointment.patientName || 'Unknown Patient'}</h3>

                {/* Test Name */}
                <div className="flex items-start gap-2 mb-4">
                    <FileText size={16} className="text-slate-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-600 font-medium line-clamp-2">{displayTests}</p>
                </div>

                {/* Date & Time Pills */}
                <div className="flex items-center gap-2 mt-auto">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 text-xs font-semibold text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{displayDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 text-xs font-semibold text-slate-600">
                        <Clock size={14} className="text-slate-400" />
                        <span>{displayTime}</span>
                    </div>
                </div>
            </div>

            {/* Expanded Content (Mobile Accordion / Desktop Modal Logic remains) */}
            {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-slate-50 mt-2 bg-gray-50/30">
                    {/* ... Existing Action Buttons & Details Logic ... */}
                    <div className="pt-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin size={18} className={`mt-0.5 ${isHome ? 'text-blue-500' : 'text-slate-400'}`} />
                            <div>
                                <span className="text-xs text-slate-400 font-bold uppercase block">Location</span>
                                <p className={`text-sm font-medium ${isHome ? 'text-slate-800' : 'text-slate-600'}`}>
                                    {isHome ? (appointment.collectionAddress || 'Home Visit') : 'Lab Visit (Walk-in)'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-2">
                            {displayPhone ? (
                                <a href={`tel:${displayPhone}`} className="flex-1 flex items-center justify-center gap-2 text-blue-600 text-sm font-bold bg-blue-50 py-2.5 rounded-lg hover:bg-blue-100 transition-colors">
                                    <Phone size={16} /> Call
                                </a>
                            ) : null}
                            <button
                                onClick={(e) => { e.stopPropagation(); onUpdateStatus(appointment.id, 'COMPLETED'); }}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Details <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AppointmentCard;
