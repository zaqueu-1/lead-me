import type { Lead } from '../types';
import { generateId, validateEmail } from './validation';

export const exportLeadsToCSV = (leads: Lead[], filename: string = 'leads.csv') => {
    const headers = ['ID', 'Name', 'Company', 'Email', 'Source', 'Score', 'Status'];

    const csvContent = [
        headers.join(','),
        ...leads.map(lead => [
            lead.id,
            `"${lead.name}"`,
            `"${lead.company}"`,
            lead.email,
            lead.source,
            lead.score,
            lead.status
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const parseCSVToLeads = (csvContent: string): Lead[] => {
    const lines = csvContent.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
        throw new Error('CSV file must contain at least a header and one data row');
    }

    const dataLines = lines.slice(1);
    const leads: Lead[] = [];

    for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i].trim();
        if (!line) continue;

        const values = parseCSVLine(line);

        if (values.length < 7) {
            console.warn(`Line ${i + 2} has insufficient columns, skipping`);
            continue;
        }

        const [id, name, company, email, source, scoreStr, status] = values;


        if (!name.trim() || !company.trim() || !email.trim()) {
            console.warn(`Line ${i + 2} has empty required fields, skipping`);
            continue;
        }

        if (!validateEmail(email)) {
            console.warn(`Line ${i + 2} has invalid email: ${email}, skipping`);
            continue;
        }

        const score = parseInt(scoreStr);
        if (isNaN(score) || score < 0 || score > 100) {
            console.warn(`Line ${i + 2} has invalid score: ${scoreStr}, skipping`);
            continue;
        }

        const validStatuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
        const validSources = ['website', 'referral', 'social_media', 'email_campaign', 'cold_call', 'trade_show', 'partnership'];

        if (!validStatuses.includes(status)) {
            console.warn(`Line ${i + 2} has invalid status: ${status}, skipping`);
            continue;
        }

        if (!validSources.includes(source)) {
            console.warn(`Line ${i + 2} has invalid source: ${source}, skipping`);
            continue;
        }

        leads.push({
            id: id.trim() || generateId(),
            name: name.trim(),
            company: company.trim(),
            email: email.trim(),
            source: source as Lead['source'],
            score,
            status: status as Lead['status']
        });
    }

    return leads;
};

const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result.map(val => val.replace(/^"|"$/g, ''));
};

export const readCSVFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target?.result as string;
            resolve(content);
        };

        reader.onerror = () => {
            reject(new Error('Error reading file'));
        };

        reader.readAsText(file);
    });
};
