import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Phone, ChevronDown, ChevronUp, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const AppointmentCard = ({ appointment, onUpdateStatus }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'cancelled':
                return { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700', icon: <XCircle size={14} /> };
            case 'completed':
                return { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700', icon: <CheckCircle size={14} /> };
            case 'confirmed':
                return { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', icon: <CheckCircle size={14} /> };
            default:
                return { border: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700', icon: <AlertCircle size={14} /> };
        }
    };

    const config = getStatusConfig(appointment.status);

    // Data Fallbacks
    const displayTests = appointment.testName || appointment.testNames || (Array.isArray(appointment.tests) ? appointment.tests.map(t => t.testName).join(', ') : 'Unknown Test');
    const displayPhone = appointment.patientMobile || appointment.mobile || appointment.phone || '';
    const isHome = appointment.isHomeVisit || appointment.homeVisit;

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-[6px] mb-3 transition-all ${config.border}`}>
            <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-gray-900">{appointment.patientName}</h3>
                            <span className="text-xs text-gray-400 font-mono">#{appointment.id}</span>
                        </div>
                        <div className="flex items-start gap-2 mt-1.5">
                            <FileText size={14} className="text-gray-400 mt-0.5 shrink-0" />
                            <p className="text-sm text-gray-600 font-medium line-clamp-1">{displayTests}</p>
                        </div>
                    </div>
                    {/* Compact Status Badge */}
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${config.bg} ${config.text}`}>
                        {config.icon}
                        <span className="uppercase tracking-wide">{appointment.status}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5"><Calendar size={14} /><span>{appointment.date}</span></div>
                        <div className="flex items-center gap-1.5"><Clock size={14} /><span>{appointment.time}</span></div>
                    </div>
                    <div className="text-gray-300">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-50/50">
                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Age</span>
                            <p className="font-semibold text-gray-900">{appointment.age} <span className="text-gray-400 font-normal text-xs">Yrs</span></p>
                        </div>
                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Sex</span>
                            <p className="font-semibold text-gray-900">{appointment.gender}</p>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3 mt-4 px-1">
                        <MapPin size={16} className={`mt-0.5 ${isHome ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Location</span>
                            <p className={`text-sm font-medium ${isHome ? 'text-gray-900' : 'text-gray-500 italic'}`}>
                                {isHome ? appointment.collectionAddress : 'Lab Visit (Walk-in)'}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-5 pt-2">
                        <a
                            href={`tel:${displayPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex items-center justify-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 font-semibold py-2.5 rounded-xl transition-all active:scale-95 text-sm"
                        >
                            <Phone size={16} /> Call
                        </a>
                        {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onUpdateStatus(appointment.id, 'COMPLETED'); }}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm"
                            >
                                <CheckCircle size={16} /> Update
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default AppointmentCard;
