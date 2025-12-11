import React from 'react';
import { Search, ListFilter } from 'lucide-react';

const StickyHeader = ({ onSearch, onFilterChange }) => {
    return (
        <div className="bg-white/50 backdrop-blur-sm border-t border-gray-50">
            <div className="px-4 py-4 md:px-6">
                {/* Search & Filter Bar (Slim Toolbar) */}
                <div className="flex gap-3 md:gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        <input
                            type="text"
                            placeholder="Search by ID or Patient..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none text-slate-800 placeholder-slate-400 transition-all font-medium"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <ListFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                        <select
                            className="pl-11 pr-8 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none appearance-none cursor-pointer transition-all"
                            onChange={(e) => onFilterChange(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickyHeader;
