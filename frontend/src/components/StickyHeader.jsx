import React from 'react';
import { Search, ListFilter } from 'lucide-react';

const StickyHeader = ({ onSearch, onFilterChange }) => {
    return (
        <div className="bg-white/50 backdrop-blur-sm">
            <div className="px-4 py-3">
                {/* Search & Filter Bar (Slim Toolbar) */}
                <div className="flex gap-3">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by ID or Patient..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 placeholder-slate-400 transition-all"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <ListFilter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                        <select
                            className="pl-9 pr-6 py-2.5 bg-slate-100 border-transparent rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
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
