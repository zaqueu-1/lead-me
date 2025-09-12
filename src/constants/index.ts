export const STATUS_LABELS = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    proposal: 'Proposal',
    won: 'Won',
    lost: 'Lost'
} as const;

export const STATUS_COLORS = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-purple-100 text-purple-800',
    proposal: 'bg-orange-100 text-orange-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800'
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
    prospecting: 'bg-blue-100 text-blue-800',
    qualification: 'bg-yellow-100 text-yellow-800',
    proposal: 'bg-purple-100 text-purple-800',
    negotiation: 'bg-orange-100 text-orange-800',
    'closed-won': 'bg-green-100 text-green-800',
    'closed-lost': 'bg-red-100 text-red-800'
} as const;
