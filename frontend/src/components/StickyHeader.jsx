import React from 'react';
import { Search, ListFilter, Menu } from 'lucide-react';

const StickyHeader = ({ onSearch, onFilterChange }) => {
    return (
        <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="px-4 py-3">
                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-lg font-bold text-gray-900">Chopade Clinical Lab</h1>
                    <Menu size={24} className="text-gray-500" />
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search ID or Name..." className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => onSearch(e.target.value)} />
                    </div>
                    <div className="relative">
                        <ListFilter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                        <select className="pl-9 pr-8 py-2 bg-gray-100 border-none rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer" onChange={(e) => onFilterChange(e.target.value)}>
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
