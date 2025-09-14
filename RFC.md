# RFC: Lead Management System (lead.me)

**Document Information:**
- **Title:** Lead Management System (lead.me)
- **Version:** 1.0
- **Date:** September 14, 2025
- **Author:** Eduardo Zaqueu de Oliveira Moreno

## Overview

lead.me is a web application for managing sales leads and opportunities. Built with React, TypeScript and Tailwind CSS, it provides a clean interface for lead tracking, filtering, and conversion to opportunities.

### Key Features
- Lead tracking and management
- Advanced filtering and search with debounce
- Lead-to-opportunity conversion
- CSV import/export
- Dark/Light mode
- Cards and Table view modes
- Virtual scrolling for performance
- Local storage persistence

## Functional Requirements

### Lead Management (FR-001)
- Display leads in card grid layout or table layout
- Toggle between view modes with saved preference
- Show lead information: name, company, email, source, score, status
- Select leads to view/edit details
- Update lead status and information

### Filtering & Search (FR-002)
- Text search across name and company with 200ms debounce
- Filter by status: new, contacted, qualified, proposal, won, lost
- Filter by source: website, referral, social_media, email_campaign, trade_show, cold_call, partnership
- Sort by score, name, or company (asc/desc)
- Persist filter state and view mode

### Lead Details (FR-003)
- Side panel with detailed lead information
- Edit lead properties
- Convert leads to opportunities
- Mobile-responsive design

### Opportunity Management (FR-004)
- Convert leads with stage selection: prospecting, qualification, proposal, negotiation, closed-won, closed-lost
- Optional opportunity amount
- View opportunities in table format
- Revert opportunities back to leads

### Data Import/Export (FR-005)
- Export leads to CSV
- Import leads from CSV with duplicate detection
- Validation and error handling

## Non-Functional Requirements

### Performance
- Initial load: < 3 seconds
- Filtering: < 200ms response with debounced search
- Virtual scrolling for large datasets
- Support 1000+ leads efficiently

### Usability
- Mobile-first responsive design
- Touch-friendly interface
- Keyboard navigation
- Dark/light mode toggle

### Data Management
- Browser localStorage persistence
- CSV backup/restore
- Input validation
- Error handling with user feedback

## Data Model

### Lead Interface
```typescript
export interface Lead {
    id: string;
    name: string;
    company: string;
    email: string;
    source: string;
    score: number;
    status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
}
```

### Opportunity Interface
```typescript
export interface Opportunity {
    id: string;
    name: string;
    stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
    amount?: number;
    accountName: string;
    leadId: string;
}
```

### Filters Interface
```typescript
export interface LeadFilters {
    search: string;
    statuses: string[];
    sources: string[];
    sortBy: 'score' | 'name' | 'company';
    sortOrder: 'asc' | 'desc';
    viewMode: 'cards' | 'table';
}
```

### App State
```typescript
export interface AppState {
    leads: Lead[];
    opportunities: Opportunity[];
    selectedLead: Lead | null;
    filters: LeadFilters;
    loading: boolean;
    error: string | null;
}
```

## System Architecture

### Component Structure
```
App
├── LeadsList
│   ├── FilterPanel (with ViewToggleButton)
│   ├── LeadCard[] | LeadsTable
│   └── ImportExportButtons
├── LeadDetailPanel
└── OpportunitiesTable
```

### Key Hooks
- **useLeads**: Main business logic and state management
- **useDarkMode**: Theme switching
- **useDebounce**: Search input debouncing (200ms)
- **useVirtualScrolling**: Performance optimization
- **useInfiniteScroll**: Progressive loading

### Technology Stack
- React 19.1.1 + TypeScript 5.8.3
- Tailwind CSS 3.4.17
- Vite 7.1.2 (build tool)
- Local storage for persistence

## Key Workflows

### Lead Management Flow
1. User opens app → Load persisted data
2. Display leads in grid with filters
3. User applies filters → Update display
4. User selects lead → Open detail panel
5. User edits lead → Save changes

### Lead Conversion Flow
1. User opens lead detail panel
2. Click "Convert to Opportunity"
3. Select stage and enter amount
4. Submit conversion
5. Lead removed, opportunity created
6. Update UI

### Data Import Flow
1. User selects CSV file
2. Parse and validate data
3. Check for duplicates by email
4. Import new leads
5. Show import summary

## Performance Optimizations

- Virtual scrolling for large lists
- Component memoization (React.memo)
- Debounced search (200ms)
- Lazy loading
- Efficient filtering algorithms

## Validation Rules

### Lead Validation
- Name: 2-100 characters, required
- Email: Valid format, unique, required
- Score: 0-100 integer
- Status: Valid status value
- Source: Valid source value

### Data Persistence
- localStorage for client-side persistence
- CSV export for backup
- Import with duplicate detection
- Error handling for storage failures

---

**Document Control:**
- **Last Updated:** September 14, 2025

**Revision History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-09-14 | Eduardo Zaqueu de Oliveira Moreno | Initial RFC creation |