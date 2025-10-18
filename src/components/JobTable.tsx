import { useState, useMemo } from 'react';
import { Job } from '@/hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, ArrowUpDown, GripVertical } from 'lucide-react';
import { JobRow } from './JobRow';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { ColumnHeader } from './ColumnHeader';

interface JobTableProps {
  jobs: Job[];
  roles: string[];
  tableLayout: string[];
  onUpdateJob: (id: string, updates: Partial<Job>) => void;
  onDeleteJob: (id: string) => void;
  onDeleteJobs: (ids: string[]) => void;
  onUpdateTableLayout: (layout: string[]) => void;
}

type SortConfig = {
  key: keyof Job;
  direction: 'asc' | 'desc';
} | null;

const columnLabels: Record<string, string> = {
  companyName: 'Company Name',
  link: 'Link',
  desirability: 'Desirability',
  salaryMin: 'Salary Min',
  salaryMax: 'Salary Max',
  role: 'Role',
  keywords: 'Keywords',
  progress: 'Progress',
  createdAt: 'Created'
};

export function JobTable({
  jobs,
  roles,
  tableLayout,
  onUpdateJob,
  onDeleteJob,
  onDeleteJobs,
  onUpdateTableLayout
}: JobTableProps) {
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedJobs = useMemo(() => {
    if (!sortConfig) return jobs;

    return [...jobs].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [jobs, sortConfig]);

  const handleSort = (key: keyof Job) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tableLayout.indexOf(active.id as string);
      const newIndex = tableLayout.indexOf(over.id as string);
      
      const newLayout = [...tableLayout];
      const [removed] = newLayout.splice(oldIndex, 1);
      newLayout.splice(newIndex, 0, removed);
      
      onUpdateTableLayout(newLayout);
    }
  };

  const toggleSelectAll = () => {
    setSelectedJobs(selectedJobs.length === jobs.length ? [] : jobs.map(j => j.id));
  };

  const toggleSelectJob = (id: string) => {
    setSelectedJobs(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    onDeleteJobs(selectedJobs);
    setSelectedJobs([]);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {selectedJobs.length > 0 && (
        <div className="glass border-b border-border px-6 py-3 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {selectedJobs.length} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="ml-auto shadow-soft"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-border">
            <thead className="glass-dark sticky top-0 z-10 border-b border-border">
              <tr>
                <th className="w-12 px-4 py-3 text-left">
                  <Checkbox
                    checked={jobs.length > 0 && selectedJobs.length === jobs.length}
                    onCheckedChange={toggleSelectAll}
                    className="border border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </th>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={tableLayout}
                    strategy={horizontalListSortingStrategy}
                  >
                    {tableLayout.map(columnKey => (
                      <ColumnHeader
                        key={columnKey}
                        id={columnKey}
                        label={columnLabels[columnKey]}
                        sortConfig={sortConfig}
                        onSort={() => handleSort(columnKey as keyof Job)}
                      />
                    ))}
                  </SortableContext>
                </DndContext>

                <th className="w-20 px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card/50 divide-y divide-border">
              {sortedJobs.length === 0 ? (
                <tr>
                  <td colSpan={tableLayout.length + 2} className="px-6 py-12 text-center">
                    <p className="text-muted-foreground">
                      No jobs yet. Click "New Row" to add your first application.
                    </p>
                  </td>
                </tr>
              ) : (
                sortedJobs.map(job => (
                  <JobRow
                    key={job.id}
                    job={job}
                    roles={roles}
                    tableLayout={tableLayout}
                    isSelected={selectedJobs.includes(job.id)}
                    onToggleSelect={() => toggleSelectJob(job.id)}
                    onUpdate={onUpdateJob}
                    onDelete={onDeleteJob}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
