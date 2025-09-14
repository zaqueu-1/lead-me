import React from 'react';

export const LeadCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm animate-pulse">
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                        <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
            </div>
        </div>
    );
};
