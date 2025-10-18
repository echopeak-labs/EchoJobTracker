import { useState } from 'react';
import { Job } from '@/hooks/useLocalStorage';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { EditableCell } from './EditableCell';

interface JobRowProps {
  job: Job;
  roles: string[];
  tableLayout: string[];
  isSelected: boolean;
  onToggleSelect: () => void;
  onUpdate: (id: string, updates: Partial<Job>) => void;
  onDelete: (id: string) => void;
}

export function JobRow({
  job,
  roles,
  tableLayout,
  isSelected,
  onToggleSelect,
  onUpdate,
  onDelete
}: JobRowProps) {
  const handleUpdate = (field: string, value: any) => {
    onUpdate(job.id, { [field]: value });
  };

  return (
    <tr className={`hover:bg-table-hover transition-colors ${isSelected ? 'bg-table-selected' : ''}`}>
      <td className="px-4 py-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          className="border border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </td>

      {tableLayout.map(columnKey => (
        <EditableCell
          key={columnKey}
          job={job}
          field={columnKey}
          roles={roles}
          onUpdate={handleUpdate}
        />
      ))}

      <td className="px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(job.id)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
