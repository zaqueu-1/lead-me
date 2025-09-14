import React from 'react';
import type { Lead } from '../types';
import { STATUS_LABELS, STATUS_COLORS, SOURCE_LABELS, getProgressBarGradient } from '../constants';

interface LeadCardProps {
    lead: Lead;
    isSelected: boolean;
    onSelect: (lead: Lead) => void;
}

const LeadCardComponent: React.FC<LeadCardProps> = ({ lead, isSelected, onSelect }) => {
    return (
        <div
            data-testid="lead-card"
            onClick={() => onSelect(lead)}
            className={`bg-white dark:bg-gray-800 rounded-lg border shadow-sm hover:shadow-md dark:shadow-gray-900/20 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${isSelected ? 'ring-2 ring-brand-primary dark:ring-brand-primary-light border-brand-primary dark:border-brand-primary-light shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
        >
            <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {lead.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {lead.company}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                        <div className="relative w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-4 flex items-center justify-center">
                            <div
                                className={`bg-gradient-to-r ${getProgressBarGradient(lead.score)} h-4 rounded-full transition-all duration-300 absolute left-0`}
                                style={{ width: `${lead.score}%` }}
                            ></div>
                            <span className="text-[12px] font-bold text-white drop-shadow-sm relative z-10">
                                {lead.score}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {lead.email}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                        {STATUS_LABELS[lead.status]}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md">
                        {SOURCE_LABELS[lead.source as keyof typeof SOURCE_LABELS] || lead.source}
                    </span>
                </div>
            </div>

            {isSelected && (
                <div className="h-1 bg-gradient-to-r from-brand-primary-light to-brand-primary rounded-b-lg"></div>
            )}
        </div>
    );
};

const areEqual = (prevProps: LeadCardProps, nextProps: LeadCardProps) => {
    return (
        prevProps.lead.id === nextProps.lead.id &&
        prevProps.lead.name === nextProps.lead.name &&
        prevProps.lead.company === nextProps.lead.company &&
        prevProps.lead.email === nextProps.lead.email &&
        prevProps.lead.score === nextProps.lead.score &&
        prevProps.lead.status === nextProps.lead.status &&
        prevProps.lead.source === nextProps.lead.source &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.onSelect === nextProps.onSelect
    );
};

export const LeadCard = React.memo(LeadCardComponent, areEqual);
