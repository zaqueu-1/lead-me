import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { exportLeadsToCSV, parseCSVToLeads, readCSVFile } from '../utils/csvUtils';
import leadsData from '../data/leads.json';

const DEFAULT_FILTERS: LeadFilters = {
    search: '',
    statuses: [],
    sources: [],
    sortBy: 'score',
    sortOrder: 'desc'
};

export const useLeads = () => {
    const getInitialFilters = (): LeadFilters => {
        const savedFilters = loadFiltersFromStorage();
        return savedFilters ? { ...DEFAULT_FILTERS, ...savedFilters } : DEFAULT_FILTERS;
    };

    const [leads, setLeads] = useState<Lead[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [filters, setFilters] = useState<LeadFilters>(getInitialFilters);
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
        if (isInitialized) {
            saveFiltersToStorage(filters);
        }
    }, [filters, isInitialized]);

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

    const filteredLeads = useMemo(() => {
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

    const exportLeads = useCallback(() => {
        try {
            const currentLeads = filteredLeads.length > 0 ? filteredLeads : leads;
            exportLeadsToCSV(currentLeads);
        } catch (err) {
            setError('Error exporting leads');
        }
    }, [filteredLeads, leads]);

    const importLeads = useCallback(async (file: File) => {
        try {
            setLoading(true);
            setError(null);

            const csvContent = await readCSVFile(file);
            const importedLeads = parseCSVToLeads(csvContent);

            if (importedLeads.length === 0) {
                throw new Error('No valid leads found in the CSV file');
            }

            const existingEmails = new Set(leads.map(lead => lead.email.toLowerCase()));
            const newLeads = importedLeads.filter(lead =>
                !existingEmails.has(lead.email.toLowerCase())
            );

            if (newLeads.length === 0) {
                throw new Error('All leads in the CSV already exist (checked by email)');
            }

            setLeads(prev => [...prev, ...newLeads]);

            const duplicateCount = importedLeads.length - newLeads.length;
            let message = `Successfully imported ${newLeads.length} leads`;
            if (duplicateCount > 0) {
                message += ` (${duplicateCount} duplicates skipped)`;
            }

            return { success: true, message, imported: newLeads.length, duplicates: duplicateCount };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error importing leads';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [leads]);

    return {
        leads: filteredLeads,
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
        exportLeads,
        importLeads,
        setError
    };
};
