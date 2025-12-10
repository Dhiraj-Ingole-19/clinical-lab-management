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

    return (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-100 border-l-4 mb-4 transition-all ${config.border}`}>
            <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">{appointment.patientName}</h3>
                            <span className="text-xs text-gray-400">#{appointment.id}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <FileText size={14} className="text-gray-400" />
                            <p className="text-sm text-gray-600">{appointment.testName}</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}>
                        {config.icon}
                        <span className="uppercase">{appointment.status}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5"><Calendar size={16} /><span>{appointment.date}</span></div>
                        <div className="flex items-center gap-1.5"><Clock size={16} /><span>{appointment.time}</span></div>
                    </div>
                    <button className="text-gray-400">{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>
                </div>
            </div>
            {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t border-gray-100 mt-2">
                    <div className="flex justify-between items-center text-sm mt-4 gap-3">
                        <div className="bg-blue-50 px-3 py-2 rounded-lg flex-1"><span className="text-xs text-blue-500 font-bold uppercase">Age</span><p className="font-medium text-gray-900">{appointment.age} <span className="text-gray-500 font-normal">Years</span></p></div>
                        <div className="bg-pink-50 px-3 py-2 rounded-lg flex-1"><span className="text-xs text-pink-500 font-bold uppercase">Sex</span><p className="font-medium text-gray-900">{appointment.gender}</p></div>
                    </div>
                    <div className="flex items-start gap-3 mt-4">
                        <MapPin size={18} className="text-gray-400 mt-0.5" />
                        <div>
                            <span className="text-xs text-gray-400 font-bold uppercase">Location</span>
                            <p className="font-medium text-gray-700">
                                {(appointment.isHomeVisit || appointment.homeVisit) ? appointment.collectionAddress : 'Lab Visit (Walk-in)'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-50">
                        <a href={`tel:${appointment.patientMobile || appointment.mobile || appointment.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-2 text-blue-600 font-medium w-1/2 py-2 rounded-lg hover:bg-blue-50 transition-colors"><Phone size={18} /> Call</a>
                        {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                            <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(appointment.id, 'COMPLETED'); }} className="flex items-center justify-center gap-2 bg-blue-600 text-white font-medium w-1/2 py-2 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"><CheckCircle size={18} /> Update</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default AppointmentCard;
