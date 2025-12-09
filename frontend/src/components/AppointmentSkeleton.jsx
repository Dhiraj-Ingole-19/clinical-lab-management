import React from 'react';

const AppointmentSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse flex flex-col gap-4 h-[140px]">
            {/* Header: Name + Badge */}
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <div className="h-5 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>

            {/* Middle: Test Name */}
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>

            {/* Bottom: Date/Time + Chevron Placeholder */}
            <div className="mt-auto flex justify-between items-center">
                <div className="flex gap-4">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );
};

export default AppointmentSkeleton;
