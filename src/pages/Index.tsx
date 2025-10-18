import { useState, useMemo, useEffect } from 'react';
import { useJobTrackerStore } from '@/hooks/useLocalStorage';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { JobTable } from '@/components/JobTable';
import { toast } from 'sonner';

const Index = () => {
  const {
    store,
    addRole,
    updateRole,
    deleteRole,
    addJob,
    updateJob,
    deleteJob,
    deleteJobs,
    updateTableLayout,
    exportData,
    importData
  } = useJobTrackerStore();

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Filter"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNewRow = () => {
    if (store.roles.length === 0) {
      toast.error('Please add at least one role before creating a job entry');
      return;
    }

    addJob({
      companyName: '',
      link: '',
      desirability: 3,
      salaryMin: null,
      salaryMax: null,
      role: store.roles[0],
      keywords: [],
      progress: 'Prospecting'
    });
    toast.success('New row added');
  };

  const handleClearFilters = () => {
    setSelectedRoles([]);
    setSearchQuery('');
    toast.info('Filters cleared');
  };

  const handleToggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const filteredJobs = useMemo(() => {
    let filtered = store.jobs;

    if (selectedRoles.length > 0) {
      filtered = filtered.filter(job => selectedRoles.includes(job.role));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.companyName.toLowerCase().includes(query) ||
        job.role.toLowerCase().includes(query) ||
        job.keywords.some(kw => kw.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [store.jobs, selectedRoles, searchQuery]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        onNewRow={handleNewRow}
        onClearFilters={handleClearFilters}
        onExport={exportData}
        onImport={importData}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          roles={store.roles}
          jobs={store.jobs}
          selectedRoles={selectedRoles}
          searchQuery={searchQuery}
          onAddRole={addRole}
          onUpdateRole={updateRole}
          onDeleteRole={deleteRole}
          onToggleRole={handleToggleRole}
          onSearchChange={setSearchQuery}
        />

        <JobTable
          jobs={filteredJobs}
          roles={store.roles}
          tableLayout={store.tableLayout}
          onUpdateJob={updateJob}
          onDeleteJob={deleteJob}
          onDeleteJobs={deleteJobs}
          onUpdateTableLayout={updateTableLayout}
        />
      </div>
    </div>
  );
};

export default Index;
