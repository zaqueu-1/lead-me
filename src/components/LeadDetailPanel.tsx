import React, { useState, useEffect } from 'react';
import type { Lead } from '../types';
import { validateEmail } from '../utils/validation';
import { STATUS_LABELS, STAGE_LABELS } from '../constants';

interface LeadDetailPanelProps {
    lead: Lead | null;
    isOpen: boolean;
    loading: boolean;
    onClose: () => void;
    onUpdateLead: (leadId: string, updates: Partial<Lead>) => Promise<void>;
    onConvertToOpportunity: (lead: Lead, data: { stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost', amount?: number }) => Promise<void>;
}

export const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({
    lead,
    isOpen,
    loading: _loading,
    onClose,
    onUpdateLead,
    onConvertToOpportunity
}) => {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<{ status: string; email: string }>({
        status: '',
        email: ''
    });
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [opportunityData, setOpportunityData] = useState({
        stage: 'prospecting',
        amount: ''
    });
    const [saveLoading, setSaveLoading] = useState(false);
    const [convertLoading, setConvertLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string }>({});

    useEffect(() => {
        if (lead) {
            setEditValues({
                status: lead.status,
                email: lead.email
            });
            setErrors({});
        }
    }, [lead]);

    const handleEdit = (field: string) => {
        setEditingField(field);
        setErrors({});
    };

    const handleCancel = () => {
        if (lead) {
            setEditValues({
                status: lead.status,
                email: lead.email
            });
        }
        setEditingField(null);
        setErrors({});
    };

    const handleSave = async (field: string) => {
        if (!lead) return;

        if (field === 'email' && !validateEmail(editValues.email)) {
            setErrors({ email: 'Invalid email' });
            return;
        }

        try {
            setSaveLoading(true);
            await onUpdateLead(lead.id, { [field]: editValues[field as keyof typeof editValues] });
            setEditingField(null);
            setErrors({});
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleConvert = async () => {
        if (!lead) return;

        try {
            setConvertLoading(true);
            await onConvertToOpportunity(lead, {
                stage: opportunityData.stage as never,
                amount: opportunityData.amount ? parseFloat(opportunityData.amount) : undefined
            });
            setShowConvertModal(false);
            setOpportunityData({ stage: 'prospecting', amount: '' });
        } catch (error) {
            console.error('Error converting:', error);
        } finally {
            setConvertLoading(false);
        }
    };

    if (!isOpen || !lead) {
        return null;
    }

    return (
        <>
            <div className="fixed right-0 top-0 h-full w-full sm:w-80 lg:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto border-l border-gray-200 dark:border-gray-700">
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Lead Details</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Score</label>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{lead.score}</span>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className="bg-blue-500 dark:bg-blue-400 h-3 rounded-full"
                                        style={{ width: `${lead.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <p className="text-sm text-gray-900 dark:text-white">{lead.name}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                            <p className="text-sm text-gray-900 dark:text-white">{lead.company}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            {editingField === 'email' ? (
                                <div className="space-y-2">
                                    <input
                                        type="email"
                                        value={editValues.email}
                                        onChange={(e) => setEditValues(prev => ({ ...prev, email: e.target.value }))}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            }`}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSave('email')}
                                            disabled={saveLoading}
                                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            {saveLoading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-900 dark:text-white">{lead.email}</p>
                                    <button
                                        onClick={() => handleEdit('email')}
                                        className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm"
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            {editingField === 'status' ? (
                                <div className="space-y-2">
                                    <select
                                        value={editValues.status}
                                        onChange={(e) => setEditValues(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSave('status')}
                                            disabled={saveLoading}
                                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                                        >
                                            {saveLoading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                                        {STATUS_LABELS[lead.status]}
                                    </span>
                                    <button
                                        onClick={() => handleEdit('status')}
                                        className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm"
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
                            <p className="text-sm text-gray-900 dark:text-white capitalize">{lead.source.replace('_', ' ')}</p>
                        </div>

                        {lead.status !== 'won' && lead.status !== 'lost' && (
                            <div className="pt-4">
                                <button
                                    onClick={() => setShowConvertModal(true)}
                                    className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
                                >
                                    Convert to Opportunity
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showConvertModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
                        onClick={() => setShowConvertModal(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md border dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Convert Lead to Opportunity
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Initial Stage
                                    </label>
                                    <select
                                        value={opportunityData.stage}
                                        onChange={(e) => setOpportunityData(prev => ({ ...prev, stage: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.entries(STAGE_LABELS).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Estimated Value (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        value={opportunityData.amount}
                                        onChange={(e) => setOpportunityData(prev => ({ ...prev, amount: e.target.value }))}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleConvert}
                                    disabled={convertLoading}
                                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                                >
                                    {convertLoading ? 'Converting...' : 'Convert'}
                                </button>
                                <button
                                    onClick={() => setShowConvertModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
