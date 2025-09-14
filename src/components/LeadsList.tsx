import React from 'react';
import type { Lead, LeadFilters } from '../types';
import { LeadCard } from './LeadCard';
import { LeadCardSkeleton } from './LeadCardSkeleton';
import { LeadsTable } from './LeadsTable';
import { FilterPanel } from './FilterPanel';
import { ImportExportButtons } from './ImportExportButtons';
import { useVirtualScrolling } from '../hooks/useVirtualScrolling';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

interface LeadsListProps {
    leads: Lead[];
    selectedLeadId: string | null;
    filters: LeadFilters;
    loading: boolean;
    viewMode: LeadFilters['viewMode'];
    onSelectLead: (lead: Lead) => void;
    onFiltersChange: (filters: LeadFilters) => void;
    onViewModeToggle: () => void;
    onExportLeads: () => void;
    onImportLeads: (file: File) => Promise<{ success: boolean; message: string; imported: number; duplicates: number }>;
}

const LeadsListComponent: React.FC<LeadsListProps> = ({
    leads,
    selectedLeadId,
    filters,
    loading: initialLoading,
    viewMode,
    onSelectLead,
    onFiltersChange,
    onViewModeToggle,
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

    if (initialLoading) {
        return (
            <div className="h-full flex flex-col">
                <div className="py-4 px-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                        </div>
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
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
            <FilterPanel
                filters={filters}
                onFiltersChange={onFiltersChange}
                viewMode={viewMode}
                onViewModeToggle={onViewModeToggle}
            />

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
                ) : viewMode === 'cards' ? (
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
                ) : (
                    <>
                        <div className="px-4" onClick={(e) => e.stopPropagation()}>
                            <LeadsTable
                                leads={displayedLeads}
                                selectedLeadId={selectedLeadId}
                                onSelectLead={onSelectLead}
                                isLoading={isLoading}
                            />
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
        prevProps.viewMode === nextProps.viewMode &&
        prevProps.onSelectLead === nextProps.onSelectLead &&
        prevProps.onFiltersChange === nextProps.onFiltersChange &&
        prevProps.onViewModeToggle === nextProps.onViewModeToggle &&
        prevProps.onExportLeads === nextProps.onExportLeads &&
        prevProps.onImportLeads === nextProps.onImportLeads &&
        prevProps.selectedLeadId === nextProps.selectedLeadId
    );
};

export const LeadsList = React.memo(LeadsListComponent, areEqual);