import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ArrowUpDown } from 'lucide-react';
import { Job } from '@/hooks/useLocalStorage';

interface ColumnHeaderProps {
  id: string;
  label: string;
  sortConfig: { key: keyof Job; direction: 'asc' | 'desc' } | null;
  onSort: () => void;
}

export function ColumnHeader({ id, label, sortConfig, onSort }: ColumnHeaderProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSorted = sortConfig?.key === id;

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="px-4 py-3 text-left text-xs font-bold text-accent uppercase tracking-wider group cursor-move"
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          onClick={onSort}
          className="flex items-center gap-1 hover:text-primary transition-colors font-bold"
        >
          {label}
          <ArrowUpDown className={`h-3 w-3 ${isSorted ? 'text-primary' : ''}`} />
        </button>
      </div>
    </th>
  );
}
