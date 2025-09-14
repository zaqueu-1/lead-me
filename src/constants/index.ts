export const STATUS_LABELS = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    proposal: 'Proposal',
    won: 'Won',
    lost: 'Lost'
} as const;

export const STATUS_COLORS = {
    new: 'bg-brand-neutral-50 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary-light',
    contacted: 'bg-status-yellow-bg text-status-yellow-text dark:bg-status-yellow-dark-bg dark:text-status-yellow-dark-text',
    qualified: 'bg-status-purple-bg text-status-purple-text dark:bg-status-purple-dark-bg dark:text-status-purple-dark-text',
    proposal: 'bg-status-orange-bg text-status-orange-text dark:bg-status-orange-dark-bg dark:text-status-orange-dark-text',
    won: 'bg-status-green-bg text-status-green-text dark:bg-status-green-dark-bg dark:text-status-green-dark-text',
    lost: 'bg-status-red-bg text-status-red-text dark:bg-status-red-dark-bg dark:text-status-red-dark-text'
} as const;

export const SOURCE_LABELS = {
    website: 'Website',
    referral: 'Referral',
    social_media: 'Social Media',
    email_campaign: 'Email Campaign',
    cold_call: 'Cold Call',
    trade_show: 'Trade Show',
    partnership: 'Partnership'
} as const;

export const STAGE_LABELS = {
    prospecting: 'Prospecting',
    qualification: 'Qualification',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    'closed-won': 'Closed - Won',
    'closed-lost': 'Closed - Lost'
} as const;

export const STAGE_COLORS = {
    prospecting: 'bg-brand-neutral-50 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary-light',
    qualification: 'bg-status-yellow-bg text-status-yellow-text dark:bg-status-yellow-dark-bg dark:text-status-yellow-dark-text',
    proposal: 'bg-status-purple-bg text-status-purple-text dark:bg-status-purple-dark-bg dark:text-status-purple-dark-text',
    negotiation: 'bg-status-orange-bg text-status-orange-text dark:bg-status-orange-dark-bg dark:text-status-orange-dark-text',
    'closed-won': 'bg-status-green-bg text-status-green-text dark:bg-status-green-dark-bg dark:text-status-green-dark-text',
    'closed-lost': 'bg-status-red-bg text-status-red-text dark:bg-status-red-dark-bg dark:text-status-red-dark-text'
} as const;

export const getProgressBarColor = (percentage: number): string => {
    if (percentage <= 25) {
        return 'bg-progress-red'; 
    } else if (percentage <= 50) {
        return 'bg-progress-orange'; 
    } else if (percentage <= 75) {
        return 'bg-progress-yellow'; 
    } else {
        return 'bg-progress-green'; 
    }
};

export const getProgressBarGradient = (percentage: number): string => {
    if (percentage <= 25) {
        return 'from-red-500 to-red-600'; 
    } else if (percentage <= 50) {
        return 'from-orange-500 to-orange-600'; 
    } else if (percentage <= 75) {
        return 'from-yellow-500 to-yellow-600'; 
    } else {
        return 'from-green-500 to-green-600'; 
    }
};
