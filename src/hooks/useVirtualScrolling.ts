import { useState, useEffect, useCallback } from 'react';
import type { Lead } from '../types';

interface UseVirtualScrollingProps {
    leads: Lead[];
    itemsPerPage: number;
    simulateLoading?: boolean;
}

export const useVirtualScrolling = ({
    leads,
    itemsPerPage = 20,
    simulateLoading = true
}: UseVirtualScrollingProps) => {
    const [displayedLeads, setDisplayedLeads] = useState<Lead[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Reset quando a lista de leads muda (filtros, etc)
    useEffect(() => {
        setCurrentPage(1);
        setDisplayedLeads([]);
        setHasMore(leads.length > 0);

        if (leads.length > 0) {
            loadMoreLeads(1, leads);
        }
    }, [leads]);

    const loadMoreLeads = useCallback(async (page: number, sourceLeads: Lead[]) => {
        if (isLoading) return;

        setIsLoading(true);

        // Simula latência de carregamento
        if (simulateLoading) {
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newLeads = sourceLeads.slice(startIndex, endIndex);

        if (page === 1) {
            setDisplayedLeads(newLeads);
        } else {
            setDisplayedLeads(prev => [...prev, ...newLeads]);
        }

        setHasMore(endIndex < sourceLeads.length);
        setIsLoading(false);
    }, [itemsPerPage, isLoading, simulateLoading]);

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadMoreLeads(nextPage, leads);
        }
    }, [currentPage, isLoading, hasMore, leads, loadMoreLeads]);

    return {
        displayedLeads,
        isLoading,
        hasMore,
        loadMore
    };
};
