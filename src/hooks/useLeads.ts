import { useState, useEffect, useCallback } from 'react';
import type { Lead, Opportunity, LeadFilters } from '../types';
import {
    saveFiltersToStorage,
    loadFiltersFromStorage,
    saveLeadsToStorage,
    loadLeadsFromStorage,
    saveOpportunitiesToStorage,
    loadOpportunitiesFromStorage
} from '../utils/localStorage';
import { generateId } from '../utils/validation';
import leadsData from '../data/leads.json';

const DEFAULT_FILTERS: LeadFilters = {
    search: '',
    statuses: [],
    sources: [],
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
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500));

                const savedOpportunities = loadOpportunitiesFromStorage();
                const loadedOpportunities = (savedOpportunities && Array.isArray(savedOpportunities)) ? savedOpportunities : [];
                const savedLeads = loadLeadsFromStorage();
                let loadedLeads: Lead[];

                if (savedLeads) {
                    loadedLeads = savedLeads;
                } else {
                    loadedLeads = leadsData as Lead[];
                }

                const opportunityLeadIds = loadedOpportunities.map(opp => opp.leadId);
                const existingLeadIds = loadedLeads.map(lead => lead.id);
                const missingLeadIds = opportunityLeadIds.filter(id => existingLeadIds.includes(id));

                if (missingLeadIds.length > 0) {
                    loadedLeads = loadedLeads.filter(lead => !opportunityLeadIds.includes(lead.id));
                }

                setLeads(loadedLeads);
                setOpportunities(loadedOpportunities);

                const savedFilters = loadFiltersFromStorage();
                if (savedFilters) {
                    setFilters(prev => ({ ...prev, ...savedFilters }));
                }

                setError(null);
            } catch (err) {
                setError('Error loading lead data');
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        saveFiltersToStorage(filters);
    }, [filters]);

    useEffect(() => {
        if (isInitialized) {
            const opportunityLeadIds = opportunities.map(opp => opp.leadId);
            const validLeads = leads.filter(lead => !opportunityLeadIds.includes(lead.id));
            saveLeadsToStorage(validLeads);
        }
    }, [leads, opportunities, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            saveOpportunitiesToStorage(opportunities);
        }
    }, [opportunities, isInitialized]);

    const filteredLeads = useCallback(() => {
        let filtered = [...leads];

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(lead =>
                lead.name.toLowerCase().includes(searchTerm) ||
                lead.company.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.statuses.length > 0) {
            filtered = filtered.filter(lead => filters.statuses.includes(lead.status));
        }

        if (filters.sources.length > 0) {
            filtered = filtered.filter(lead => filters.sources.includes(lead.source));
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

            setLeads(prev => prev.filter(l => l.id !== lead.id));

            if (selectedLead?.id === lead.id) {
                setSelectedLead(null);
            }

            setError(null);
            return newOpportunity;
        } catch (err) {
            setError('Error converting lead to opportunity');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [updateLead]);

    const revertToLead = useCallback(async (opportunity: Opportunity) => {
        try {
            setLoading(true);

            await new Promise(resolve => setTimeout(resolve, 500));

            const revertedLead: Lead = {
                id: opportunity.leadId,
                name: opportunity.name.split(' - ')[0] || opportunity.name,
                company: opportunity.accountName,
                email: `${opportunity.name.toLowerCase().replace(/\s+/g, '.')}@${opportunity.accountName.toLowerCase().replace(/\s+/g, '')}.com`,
                source: 'converted_back',
                score: 75,
                status: 'qualified'
            };

            setLeads(prev => [...prev, revertedLead]);
            setOpportunities(prev => prev.filter(o => o.id !== opportunity.id));

            setError(null);
        } catch (error) {
            setError('Error reverting opportunity to lead');
        } finally {
            setLoading(false);
        }
    }, []);

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
        revertToLead,
        setError
    };
};
