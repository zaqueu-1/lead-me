import React from 'react';
import type { Lead, LeadFilters } from '../types';
import { LeadCard } from './LeadCard';
import { LeadCardSkeleton } from './LeadCardSkeleton';
import { FilterBadge } from './FilterBadge';
import { ImportExportButtons } from './ImportExportButtons';
import { useVirtualScrolling } from '../hooks/useVirtualScrolling';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { STATUS_LABELS, SOURCE_LABELS } from '../constants';

interface LeadsListProps {
    leads: Lead[];
    selectedLeadId: string | null;
    filters: LeadFilters;
    loading: boolean;
    onSelectLead: (lead: Lead) => void;
    onFiltersChange: (filters: LeadFilters) => void;
    onExportLeads: () => void;
    onImportLeads: (file: File) => Promise<{ success: boolean; message: string; imported: number; duplicates: number }>;
}

const LeadsListComponent: React.FC<LeadsListProps> = ({
    leads,
    selectedLeadId,
    filters,
    loading: initialLoading,
    onSelectLead,
    onFiltersChange,
    onExportLeads,
    onImportLeads
}) => {
    const { displayedLeads, isLoading, hasMore, loadMore } = useVirtualScrolling({
        leads,
        itemsPerPage: 20,
        simulateLoading: true
    });

    const sentinelRef = useInfiniteScroll({
        hasMore,
        isLoading,
        onLoadMore: loadMore,
        threshold: 200
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, search: e.target.value });
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        if (status && !filters.statuses.includes(status)) {
            onFiltersChange({
                ...filters,
                statuses: [...filters.statuses, status]
            });
        }
        e.target.value = '';
    };

    const handleSourceFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const source = e.target.value;
        if (source && !filters.sources.includes(source)) {
            onFiltersChange({
                ...filters,
                sources: [...filters.sources, source]
            });
        }
        e.target.value = '';
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [sortBy, sortOrder] = e.target.value.split('-');
        onFiltersChange({
            ...filters,
            sortBy: sortBy as LeadFilters['sortBy'],
            sortOrder: sortOrder as LeadFilters['sortOrder']
        });
    };

    const removeStatusFilter = (status: string) => {
        onFiltersChange({
            ...filters,
            statuses: filters.statuses.filter(s => s !== status)
        });
    };

    const removeSourceFilter = (source: string) => {
        onFiltersChange({
            ...filters,
            sources: filters.sources.filter(s => s !== source)
        });
    };

    const clearAllFilters = () => {
        onFiltersChange({
            search: '',
            statuses: [],
            sources: [],
            sortBy: 'score',
            sortOrder: 'desc'
        });
    };

    const hasActiveFilters = filters.search || filters.statuses.length > 0 || filters.sources.length > 0;

    if (initialLoading) {
        return (
            <div className="h-full flex flex-col">
                <div className="py-4 px-4 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <LeadCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="py-4 px-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by name or company..."
                            value={filters.search}
                            onChange={handleSearchChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <select
                            onChange={handleStatusFilterChange}
                            defaultValue=""
                            className="px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Status</option>
                            {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                <option
                                    key={value}
                                    value={value}
                                    disabled={filters.statuses.includes(value)}
                                >
                                    {label}
                                </option>
                            ))}
                        </select>
                        <select
                            onChange={handleSourceFilterChange}
                            defaultValue=""
                            className="px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Source</option>
                            {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                                <option
                                    key={value}
                                    value={value}
                                    disabled={filters.sources.includes(value)}
                                >
                                    {label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onChange={handleSortChange}
                            className="px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="score-desc">Score (highest)</option>
                            <option value="score-asc">Score (lowest)</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="company-asc">Company (A-Z)</option>
                            <option value="company-desc">Company (Z-A)</option>
                        </select>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="flex flex-wrap items-center gap-2">
                        {filters.statuses.map(status => (
                            <FilterBadge
                                key={`status-${status}`}
                                label={STATUS_LABELS[status as keyof typeof STATUS_LABELS]}
                                value={status}
                                type="status"
                                onRemove={() => removeStatusFilter(status)}
                            />
                        ))}
                        {filters.sources.map(source => (
                            <FilterBadge
                                key={`source-${source}`}
                                label={SOURCE_LABELS[source as keyof typeof SOURCE_LABELS]}
                                value={source}
                                type="source"
                                onRemove={() => removeSourceFilter(source)}
                            />
                        ))}
                        <button
                            onClick={clearAllFilters}
                            className="ml-2 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                {leads.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1m0 0V4a1 1 0 00-1-1H8a1 1 0 00-1 1v1m0 0v1h8V5" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No leads found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Try adjusting the filters to find leads.
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4" onClick={(e) => e.stopPropagation()}>
                            {displayedLeads.map((lead) => (
                                <LeadCard
                                    key={lead.id}
                                    lead={lead}
                                    isSelected={selectedLeadId === lead.id}
                                    onSelect={onSelectLead}
                                />
                            ))}

                            {isLoading && (
                                Array.from({ length: 8 }).map((_, index) => (
                                    <LeadCardSkeleton key={`skeleton-${index}`} />
                                ))
                            )}
                        </div>

                        {hasMore && <div ref={sentinelRef} className="h-1" />}
                    </>
                )}
            </div>

            <div className="p-4 mt-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {leads.length} lead{leads.length !== 1 ? 's' : ''} total
                    </div>
                    <ImportExportButtons
                        onExport={onExportLeads}
                        onImport={onImportLeads}
                        disabled={initialLoading || isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

const areEqual = (prevProps: LeadsListProps, nextProps: LeadsListProps) => {
    return (
        prevProps.leads === nextProps.leads &&
        prevProps.filters === nextProps.filters &&
        prevProps.loading === nextProps.loading &&
        prevProps.onSelectLead === nextProps.onSelectLead &&
        prevProps.onFiltersChange === nextProps.onFiltersChange &&
        prevProps.onExportLeads === nextProps.onExportLeads &&
        prevProps.onImportLeads === nextProps.onImportLeads &&
        prevProps.selectedLeadId === nextProps.selectedLeadId
    );
};

export const LeadsList = React.memo(LeadsListComponent, areEqual);