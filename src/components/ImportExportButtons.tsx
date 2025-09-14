import React, { useRef, useState } from 'react';
import { HiArrowDownTray, HiArrowUpTray } from 'react-icons/hi2';
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';

interface ImportExportButtonsProps {
    onExport: () => void;
    onImport: (file: File) => Promise<{ success: boolean; message: string; imported: number; duplicates: number }>;
    disabled?: boolean;
}

export const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({
    onExport,
    onImport,
    disabled = false
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);

    const handleExportClick = () => {
        if (!disabled) {
            onExport();
        }
    };

    const handleImportClick = () => {
        if (!disabled && !importing) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.csv')) {
            alert('Please select a CSV file');
            return;
        }

        try {
            setImporting(true);
            const result = await onImport(file);
            alert(result.message);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error importing file';
            alert(`Import failed: ${message}`);
        } finally {
            setImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={handleExportClick}
                disabled={disabled}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-md transition-colors duration-200 text-sm font-medium"
            >
                <HiArrowDownTray className="w-4 h-4" />
                Export CSV
            </button>

            <button
                onClick={handleImportClick}
                disabled={disabled || importing}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors duration-200 text-sm font-medium"
            >
                {importing ? (
                    <>
                        <HiOutlineDotsCircleHorizontal className="w-4 h-4 animate-spin" />
                        Importing...
                    </>
                ) : (
                    <>
                        <HiArrowUpTray className="w-4 h-4" />
                        Import CSV
                    </>
                )}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};
