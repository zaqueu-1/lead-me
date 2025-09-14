import React from 'react';
import type { Lead } from '../types';
import { STATUS_LABELS, SOURCE_LABELS } from '../constants';

interface LeadsTableProps {
    leads: Lead[];
    selectedLeadId: string | null;
    onSelectLead: (lead: Lead) => void;
    isLoading?: boolean;
}

const getStatusColor = (status: Lead['status']) => {
    const colors = {
        new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        qualified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        proposal: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        won: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
        lost: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[status] || colors.new;
};

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400 font-semibold';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400 font-medium';
    return 'text-red-600 dark:text-red-400';
};

export const LeadsTable: React.FC<LeadsTableProps> = ({
    leads,
    selectedLeadId,
    onSelectLead,
    isLoading = false
}) => {
    if (isLoading && leads.length === 0) {
        return (
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <tr key={index} className="animate-pulse">
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (leads.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1m0 0V4a1 1 0 00-1-1H8a1 1 0 00-1 1v1m0 0v1h8V5" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No leads found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting the filters to find leads.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Lead
                            </th>
                            <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Company
                            </th>
                            <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Source
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Score
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {leads.map((lead) => (
                            <tr
                                key={lead.id}
                                onClick={() => onSelectLead(lead)}
                                className={`cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedLeadId === lead.id
                                    ? 'bg-brand-primary/5 dark:bg-brand-primary/10 border-l-4 border-brand-primary'
                                    : ''
                                    }`}
                            >
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {lead.name}
                                    </div>
                                    <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {lead.company}
                                    </div>
                                </td>
                                <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-gray-300">
                                        {lead.company}
                                    </div>
                                </td>
                                <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {lead.email}
                                    </div>
                                </td>
                                <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-gray-300">
                                        {SOURCE_LABELS[lead.source as keyof typeof SOURCE_LABELS] || lead.source}
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                                        {lead.score}
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                                        {STATUS_LABELS[lead.status]}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {isLoading && (
                            Array.from({ length: 3 }).map((_, index) => (
                                <tr key={`loading-${index}`} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
