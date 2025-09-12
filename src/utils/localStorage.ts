import type { LeadFilters } from '../types';

const FILTERS_KEY = 'leads-console-filters';

export const saveFiltersToStorage = (filters: LeadFilters): void => {
    try {
        localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    } catch (error) {
        console.warn('Error saving filters to localStorage:', error);
    }
};

export const loadFiltersFromStorage = (): Partial<LeadFilters> | null => {
    try {
        const stored = localStorage.getItem(FILTERS_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.warn('Error loading filters from localStorage:', error);
        return null;
    }
};

export const clearFiltersFromStorage = (): void => {
    try {
        localStorage.removeItem(FILTERS_KEY);
    } catch (error) {
        console.warn('Error clearing filters from localStorage:', error);
    }
};
