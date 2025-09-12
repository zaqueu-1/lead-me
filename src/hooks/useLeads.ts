import { useState, useEffect, useCallback } from 'react';
import type { Lead, Opportunity, LeadFilters } from '../types';
import { saveFiltersToStorage, loadFiltersFromStorage } from '../utils/localStorage';
import { generateId } from '../utils/validation';
import leadsData from '../data/leads.json';

const DEFAULT_FILTERS: LeadFilters = {
    search: '',
    status: '',
    sortBy: 'score',
    sortOrder: 'desc'
};

export const useLeads = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500));
                setLeads(leadsData as Lead[]);

                const savedFilters = loadFiltersFromStorage();
                if (savedFilters) {
                    setFilters(prev => ({ ...prev, ...savedFilters }));
                }

                setError(null);
            } catch (err) {
                setError('Error loading lead data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        saveFiltersToStorage(filters);
    }, [filters]);

    const filteredLeads = useCallback(() => {
        let filtered = [...leads];

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(lead =>
                lead.name.toLowerCase().includes(searchTerm) ||
                lead.company.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.status) {
            filtered = filtered.filter(lead => lead.status === filters.status);
        }

        filtered.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case 'score':
                    comparison = a.score - b.score;
                    break;
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'company':
                    comparison = a.company.localeCompare(b.company);
                    break;
            }

            return filters.sortOrder === 'desc' ? -comparison : comparison;
        });

        return filtered;
    }, [leads, filters]);

    const updateLead = useCallback(async (leadId: string, updates: Partial<Lead>) => {
        try {
            setLoading(true);

            await new Promise(resolve => setTimeout(resolve, 300));

            setLeads(prev => prev.map(lead =>
                lead.id === leadId ? { ...lead, ...updates } : lead
            ));

            if (selectedLead?.id === leadId) {
                setSelectedLead(prev => prev ? { ...prev, ...updates } : null);
            }

            setError(null);
        } catch (err) {
            setError('Error updating lead');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [selectedLead]);

    const convertToOpportunity = useCallback(async (lead: Lead, opportunityData: { stage: Opportunity['stage'], amount?: number }) => {
        try {
            setLoading(true);

            await new Promise(resolve => setTimeout(resolve, 1000));

            const newOpportunity: Opportunity = {
                id: generateId(),
                name: `${lead.name} - ${lead.company}`,
                stage: opportunityData.stage,
                amount: opportunityData.amount,
                accountName: lead.company,
                leadId: lead.id
            };

            setOpportunities(prev => [...prev, newOpportunity]);

            await updateLead(lead.id, { status: 'won' });

            setError(null);
            return newOpportunity;
        } catch (err) {
            setError('Error converting lead to opportunity');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [updateLead]);

    return {
        leads: filteredLeads(),
        opportunities,
        selectedLead,
        filters,
        loading,
        error,
        setSelectedLead,
        setFilters,
        updateLead,
        convertToOpportunity,
        setError
    };
};
