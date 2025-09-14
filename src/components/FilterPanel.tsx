import React, { useState, useEffect, useRef } from 'react';
import type { LeadFilters } from '../types';
import { FilterBadge } from './FilterBadge';
import { STATUS_LABELS, SOURCE_LABELS } from '../constants';
import { HiAdjustmentsHorizontal, HiCheck, HiBars3BottomLeft } from 'react-icons/hi2';

interface FilterPanelProps {
    filters: LeadFilters;
    onFiltersChange: (filters: LeadFilters) => void;
}

const FilterPanelComponent: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [showSortPopover, setShowSortPopover] = useState(false);
    const sortPopoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortPopoverRef.current && !sortPopoverRef.current.contains(event.target as Node)) {
                setShowSortPopover(false);
            }
        };

        if (showSortPopover) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showSortPopover]);

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
            ...filters,
            statuses: [],
            sources: []
        });
    };

    const hasActiveFilters = filters.statuses.length > 0 || filters.sources.length > 0;
    const activeFiltersCount = filters.statuses.length + filters.sources.length;

    const handleSortSelect = (sortBy: LeadFilters['sortBy'], sortOrder: LeadFilters['sortOrder']) => {
        onFiltersChange({ ...filters, sortBy, sortOrder });
        setShowSortPopover(false);
    };

    const getSortLabel = () => {
        const orderText = filters.sortOrder === 'desc' ? 'highest' : 'lowest';
        switch (filters.sortBy) {
            case 'score':
                return `Score (${orderText})`;
            case 'name':
                return `Name (${filters.sortOrder === 'desc' ? 'Z-A' : 'A-Z'})`;
            case 'company':
                return `Company (${filters.sortOrder === 'desc' ? 'Z-A' : 'A-Z'})`;
            default:
                return 'Sort';
        }
    };

    const sortOptions = [
        { key: 'score-desc', label: 'Score (highest)', sortBy: 'score' as const, sortOrder: 'desc' as const },
        { key: 'score-asc', label: 'Score (lowest)', sortBy: 'score' as const, sortOrder: 'asc' as const },
        { key: 'name-asc', label: 'Name (A-Z)', sortBy: 'name' as const, sortOrder: 'asc' as const },
        { key: 'name-desc', label: 'Name (Z-A)', sortBy: 'name' as const, sortOrder: 'desc' as const },
        { key: 'company-asc', label: 'Company (A-Z)', sortBy: 'company' as const, sortOrder: 'asc' as const },
        { key: 'company-desc', label: 'Company (Z-A)', sortBy: 'company' as const, sortOrder: 'desc' as const },
    ];

    return (
        <div className="py-4 px-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by name or company..."
                        value={filters.search}
                        onChange={handleSearchChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                </div>

                <div className="relative" ref={sortPopoverRef}>
                    <button
                        onClick={() => setShowSortPopover(!showSortPopover)}
                        className={`p-2 rounded-md border transition-colors duration-200 ${showSortPopover
                            ? 'border-brand-primary bg-brand-neutral-50 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-primary-light'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        title={`Sort: ${getSortLabel()}`}
                    >
                        <HiBars3BottomLeft className="w-5 h-5" />
                    </button>

                    {showSortPopover && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                            <div className="py-2">
                                <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-1">
                                    Sort Options
                                </div>
                                {sortOptions.map((option) => {
                                    const isSelected = filters.sortBy === option.sortBy && filters.sortOrder === option.sortOrder;
                                    return (
                                        <button
                                            key={option.key}
                                            onClick={() => handleSortSelect(option.sortBy, option.sortOrder)}
                                            className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isSelected ? 'bg-brand-neutral-50 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-primary-light font-medium' : 'text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            <span>{option.label}</span>
                                            {isSelected && <HiCheck className="w-4 h-4 text-brand-primary dark:text-brand-primary-light" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-md border transition-colors duration-200 ${showFilters || hasActiveFilters
                            ? 'border-brand-primary bg-brand-neutral-50 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-primary-light'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        title="Toggle Filters"
                    >
                        <HiAdjustmentsHorizontal className="w-5 h-5" />
                    </button>

                    {activeFiltersCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                            {activeFiltersCount}
                        </div>
                    )}
                </div>
            </div>

            {showFilters && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                onChange={handleStatusFilterChange}
                                defaultValue=""
                                className="w-full px-3 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
                            >
                                <option value="">Filter by: Status</option>
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
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Source
                            </label>
                            <select
                                onChange={handleSourceFilterChange}
                                defaultValue=""
                                className="w-full px-3 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
                            >
                                <option value="">Filter by: Source</option>
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
                        </div>
                    </div>
                </div>
            )}

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
    );
};

const areEqual = (prevProps: FilterPanelProps, nextProps: FilterPanelProps) => {
    return (
        prevProps.filters === nextProps.filters &&
        prevProps.onFiltersChange === nextProps.onFiltersChange
    );
};

export const FilterPanel = React.memo(FilterPanelComponent, areEqual);
