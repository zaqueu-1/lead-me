import type { LeadFilters, Lead, Opportunity } from '../types';

const FILTERS_KEY = 'leads-console-filters';
const LEADS_KEY = 'leads-console-leads';
const OPPORTUNITIES_KEY = 'leads-console-opportunities';

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

export const saveLeadsToStorage = (leads: Lead[]): void => {
    try {
        localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    } catch (error) {
        console.warn('Error saving leads to localStorage:', error);
    }
};

export const loadLeadsFromStorage = (): Lead[] | null => {
    try {
        const stored = localStorage.getItem(LEADS_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.warn('Error loading leads from localStorage:', error);
        return null;
    }
};

export const saveOpportunitiesToStorage = (opportunities: Opportunity[]): void => {
    try {
        localStorage.setItem(OPPORTUNITIES_KEY, JSON.stringify(opportunities));
    } catch (error) {
        console.warn('Error saving opportunities to localStorage:', error);
    }
};

export const loadOpportunitiesFromStorage = (): Opportunity[] | null => {
    try {
        const stored = localStorage.getItem(OPPORTUNITIES_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.warn('Error loading opportunities from localStorage:', error);
        return null;
    }
};
