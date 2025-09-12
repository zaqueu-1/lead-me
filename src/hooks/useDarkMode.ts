import { useState, useEffect } from 'react';

const THEME_KEY = 'leads-console-theme';

export const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        try {
            const stored = localStorage.getItem(THEME_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        } catch (error) {
            console.warn('Error loading theme from localStorage:', error);
            return false;
        }
    });

    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newValue = !prev;
            try {
                localStorage.setItem(THEME_KEY, JSON.stringify(newValue));
            } catch (error) {
                console.warn('Error saving theme to localStorage:', error);
            }
            return newValue;
        });
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return {
        isDarkMode,
        toggleDarkMode
    };
};
