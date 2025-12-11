import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, ChevronDown, ChevronUp, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AppointmentCard = ({ appointment, onUpdateStatus }) => {
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

    // --- 🎨 UI Styles ---
    const getStatusClasses = (status) => {
        switch (status?.toLowerCase()) {
            case 'cancelled': return { container: 'border-red-500', badge: 'bg-red-50 text-red-600', icon: <XCircle size={14} /> };
            case 'completed': return { container: 'border-green-500', badge: 'bg-green-50 text-green-600', icon: <CheckCircle size={14} /> };
            case 'confirmed': return { container: 'border-blue-500', badge: 'bg-blue-50 text-blue-600', icon: <CheckCircle size={14} /> };
            default: return { container: 'border-yellow-400', badge: 'bg-yellow-50 text-yellow-700', icon: <AlertCircle size={14} /> };
        }
    };
    const styles = getStatusClasses(appointment.status);

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-200 border-l-[6px] mb-4 transition-all ${styles.container}`}>
            <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-800">{appointment.patientName}</h3>
                            <span className="text-sm text-slate-400">#{appointment.id}</span>
                        </div>
                        <div className="flex items-start gap-2 mt-1">
                            <FileText size={16} className="text-slate-400 mt-0.5 shrink-0" />
                            <p className="text-sm text-slate-600 font-medium line-clamp-1">{displayTests}</p>
                        </div>
                    </div>
                    {/* Status Badge */}
                    <div className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${styles.badge}`}>
                        {styles.icon}
                        <span>{appointment.status}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5"><Calendar size={16} /><span>{displayDate}</span></div>
                        <div className="flex items-center gap-1.5"><Clock size={16} /><span>{displayTime}</span></div>
                    </div>
                    <div className="text-slate-400 transform transition-transform duration-300">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-5 pt-2 border-t border-slate-100 mt-1 space-y-4">
                    {/* Age & Sex Boxes */}
                    <div className="flex justify-between items-center text-sm gap-3 mt-3">
                        <div className="bg-blue-50 px-4 py-2.5 rounded-lg flex-1 border border-blue-100">
                            <span className="text-xs text-blue-500 font-bold uppercase block mb-0.5">Age</span>
                            <p className="font-semibold text-slate-800 text-base">{displayAge} <span className="text-slate-500 font-normal text-sm">Years Old</span></p>
                        </div>
                        <div className="bg-pink-50 px-4 py-2.5 rounded-lg flex-1 border border-pink-100">
                            <span className="text-xs text-pink-500 font-bold uppercase block mb-0.5">Sex</span>
                            <p className="font-semibold text-slate-800 text-base">{displayGender}</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3 px-1">
                        <MapPin size={20} className={`mt-0.5 ${isHome ? 'text-blue-500' : 'text-slate-400'}`} />
                        <div>
                            <span className="text-xs text-slate-400 font-bold uppercase block">Location</span>
                            <p className={`text-base font-medium ${isHome ? 'text-slate-800' : 'text-slate-600'}`}>
                                {isHome ? (appointment.collectionAddress || 'Home Visit (Address Pending)') : 'Lab Visit (Walk-in)'}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        {displayPhone ? (
                            <a
                                href={`tel:${displayPhone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 text-blue-600 font-semibold px-2 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                <Phone size={18} /> Call
                            </a>
                        ) : (
                            <span className="text-slate-400 text-sm px-2">No Phone</span>
                        )}


                        {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); onUpdateStatus(appointment.id, 'COMPLETED'); }}
                                className="flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all active:scale-95"
                            >
                                <CheckCircle size={18} /> Complete
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 text-slate-400 font-medium px-4 py-2">
                                {appointment.status === 'CANCELLED' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                <span className="uppercase">{appointment.status}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default AppointmentCard;
