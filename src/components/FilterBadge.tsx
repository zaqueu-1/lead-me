import React from 'react';

interface FilterBadgeProps {
    label: string;
    value: string;
    onRemove: () => void;
    type: 'status' | 'source';
}

export const FilterBadge: React.FC<FilterBadgeProps> = ({ label, onRemove, type }) => {
    const getTypeColor = () => {
        switch (type) {
            case 'status':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'source':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getTypeColor()} transition-colors`}
        >
            {label}
            <button
                onClick={onRemove}
                className="flex-shrink-0 ml-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label={`Remove ${label} filter`}
            >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </span>
    );
};
