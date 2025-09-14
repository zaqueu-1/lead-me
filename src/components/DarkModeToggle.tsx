import React from 'react';
import { HiSun, HiMoon } from 'react-icons/hi2';

interface DarkModeToggleProps {
    isDarkMode: boolean;
    onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDarkMode ? (
                <HiSun className="w-5 h-5 text-yellow-500" />
            ) : (
                <HiMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
        </button>
    );
};
