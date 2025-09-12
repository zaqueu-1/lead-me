export interface Lead {
    id: string;
    name: string;
    company: string;
    email: string;
    source: string;
    score: number;
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
}

export interface Opportunity {
    id: string;
    name: string;
    stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
    amount?: number;
    accountName: string;
    leadId: string;
}

export interface LeadFilters {
    search: string;
    statuses: string[];
    sources: string[];
    sortBy: 'score' | 'name' | 'company';
    sortOrder: 'asc' | 'desc';
}

export interface AppState {
    leads: Lead[];
    opportunities: Opportunity[];
    selectedLead: Lead | null;
    filters: LeadFilters;
    loading: boolean;
    error: string | null;
}
