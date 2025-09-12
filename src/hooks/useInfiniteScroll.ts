import { useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollProps {
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    threshold?: number;
}

export const useInfiniteScroll = ({
    hasMore,
    isLoading,
    onLoadMore,
    threshold = 100
}: UseInfiniteScrollProps) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
            onLoadMore();
        }
    }, [hasMore, isLoading, onLoadMore]);

    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: `${threshold}px`,
            threshold: 0.1,
        });

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleObserver, threshold]);

    return sentinelRef;
};
