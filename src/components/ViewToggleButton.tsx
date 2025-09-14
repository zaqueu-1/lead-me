import React from 'react';
import { HiViewColumns, HiRectangleGroup } from 'react-icons/hi2';
import type { LeadFilters } from '../types';

interface ViewToggleButtonProps {
    viewMode: LeadFilters['viewMode'];
    onToggle: () => void;
}

export const ViewToggleButton: React.FC<ViewToggleButtonProps> = ({
    viewMode,
    onToggle
}) => {
    const isCardsView = viewMode === 'cards';

    return (
        <button
            onClick={onToggle}
            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            title={`Switch to ${isCardsView ? 'table' : 'cards'} view`}
        >
            {isCardsView ? (
                <HiViewColumns className="w-5 h-5" />
            ) : (
                <HiRectangleGroup className="w-5 h-5" />
            )}
        </button>
    );
};
