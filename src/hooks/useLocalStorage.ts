import { useState, useEffect } from 'react';

export interface Job {
  id: string;
  createdAt: string;
  companyName: string;
  link: string;
  desirability: number;
  salaryMin: number | null;
  salaryMax: number | null;
  role: string;
  keywords: string[];
  progress: "Prospecting" | "Applied" | "Interviewing" | "Offer" | "Rejected" | "Accepted";
}

export interface JobTrackerStore {
  roles: string[];
  jobs: Job[];
  tableLayout: string[];
  minDesiredSalary: number;
}

const STORAGE_KEY = 'job-tracker-store';

const defaultColumns = [
  'companyName',
  'link',
  'desirability',
  'salaryMin',
  'salaryMax',
  'role',
  'keywords',
  'progress',
  'createdAt'
];

const defaultStore: JobTrackerStore = {
  roles: [],
  jobs: [],
  tableLayout: defaultColumns,
  minDesiredSalary: 0
};

export function useJobTrackerStore() {
  const [store, setStore] = useState<JobTrackerStore>(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : defaultStore;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultStore;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [store]);

  const updateStore = (updates: Partial<JobTrackerStore>) => {
    setStore(prev => ({ ...prev, ...updates }));
  };

  const addRole = (role: string) => {
    if (role && !store.roles.includes(role)) {
      updateStore({ roles: [...store.roles, role] });
    }
  };

  const updateRole = (oldRole: string, newRole: string) => {
    if (newRole && !store.roles.includes(newRole)) {
      const updatedRoles = store.roles.map(r => r === oldRole ? newRole : r);
      const updatedJobs = store.jobs.map(j => j.role === oldRole ? { ...j, role: newRole } : j);
      setStore({ ...store, roles: updatedRoles, jobs: updatedJobs });
    }
  };

  const deleteRole = (role: string) => {
    updateStore({ roles: store.roles.filter(r => r !== role) });
  };

  const addJob = (job: Omit<Job, 'id' | 'createdAt'>) => {
    const newJob: Job = {
      ...job,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    updateStore({ jobs: [newJob, ...store.jobs] });
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    const updatedJobs = store.jobs.map(j => j.id === id ? { ...j, ...updates } : j);
    updateStore({ jobs: updatedJobs });
  };

  const deleteJob = (id: string) => {
    updateStore({ jobs: store.jobs.filter(j => j.id !== id) });
  };

  const deleteJobs = (ids: string[]) => {
    updateStore({ jobs: store.jobs.filter(j => !ids.includes(j.id)) });
  };

  const updateTableLayout = (layout: string[]) => {
    updateStore({ tableLayout: layout });
  };

  const updateMinDesiredSalary = (salary: number) => {
    updateStore({ minDesiredSalary: salary });
  };

  const exportData = () => {
    return JSON.stringify(store, null, 2);
  };

  const importData = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      if (imported.roles && imported.jobs && imported.tableLayout) {
        setStore(imported);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    store,
    addRole,
    updateRole,
    deleteRole,
    addJob,
    updateJob,
    deleteJob,
    deleteJobs,
    updateTableLayout,
    updateMinDesiredSalary,
    exportData,
    importData
  };
}
