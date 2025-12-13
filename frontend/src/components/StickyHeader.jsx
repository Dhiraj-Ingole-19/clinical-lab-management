import React from 'react';
import { Search, ListFilter } from 'lucide-react';

const StickyHeader = ({ onSearch, onFilterChange }) => {
    return (
        <div className="bg-white border-b border-gray-100 sticky top-[64px] z-20">
            <div className="max-w-7xl mx-auto px-4 py-4 md:px-8">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                        <input
                            type="text"
                            placeholder="Search by ID or Patient Name..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none text-slate-800 placeholder-slate-400 transition-all font-medium"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative md:w-64">
                        <ListFilter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                        <select
                            className="w-full pl-11 pr-8 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-semibold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none appearance-none cursor-pointer transition-all"
                            onChange={(e) => onFilterChange(e.target.value)}
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StickyHeader;
