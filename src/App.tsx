import { useState, useCallback } from 'react';
import { useLeads } from './hooks/useLeads';
import { useDarkMode } from './hooks/useDarkMode';
import { LeadsList } from './components/LeadsList';
import { LeadDetailPanel } from './components/LeadDetailPanel';
import { OpportunitiesTable } from './components/OpportunitiesTable';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DarkModeToggle } from './components/DarkModeToggle';

type ActiveTab = 'leads' | 'opportunities';

function App() {
  const {
    leads,
    opportunities,
    selectedLead,
    filters,
    loading,
    error,
    setSelectedLead,
    setFilters,
    updateLead,
    convertToOpportunity,
    revertToLead,
    exportLeads,
    importLeads,
    setError
  } = useLeads();

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<ActiveTab>('leads');
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleSelectLead = useCallback((lead: typeof selectedLead) => {
    setSelectedLead(lead);
    if (!isPanelOpen) {
      setIsPanelOpen(true);
    }
  }, [isPanelOpen]);

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedLead(null);
  }, []);

  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && isPanelOpen) {
      handleClosePanel();
    }
  }, [isPanelOpen, handleClosePanel]);

  const handleConvertToOpportunity = useCallback(async (lead: typeof selectedLead, data: Parameters<typeof convertToOpportunity>[1]) => {
    if (!lead) return;
    await convertToOpportunity(lead, data);
    setSelectedLead(null);
  }, [convertToOpportunity]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between py-4 space-y-2 sm:space-y-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  lead<span className="text-blue-500 dark:text-blue-400">.</span>me
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Manage leads effortlessly</p>
              </div>
              <div className="flex items-center gap-4">
                <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="mb-4">
            <div>
              <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('leads')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'leads'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  Leads ({leads.length})
                </button>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'opportunities'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  Opportunities ({opportunities.length})
                </button>
              </nav>
            </div>
          </div>

          <div onClick={handleBackgroundClick}>
            {activeTab === 'leads' ? (
              <div className="h-[calc(100vh-200px)] sm:h-[calc(100vh-280px)]">
                <LeadsList
                  leads={leads}
                  selectedLeadId={selectedLead?.id || null}
                  filters={filters}
                  loading={loading}
                  onSelectLead={handleSelectLead}
                  onFiltersChange={setFilters}
                  onExportLeads={exportLeads}
                  onImportLeads={importLeads}
                />
              </div>
            ) : (
              <div className="py-4 sm:py-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Opportunities</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Leads converted to sales opportunities
                  </p>
                </div>
                <OpportunitiesTable
                  opportunities={opportunities}
                  onRevertToLead={revertToLead}
                />
              </div>
            )}
          </div>
        </main>

        <LeadDetailPanel
          lead={selectedLead}
          isOpen={isPanelOpen}
          loading={loading}
          onClose={handleClosePanel}
          onUpdateLead={updateLead}
          onConvertToOpportunity={handleConvertToOpportunity}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;