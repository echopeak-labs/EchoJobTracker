import { useState, useEffect, useRef } from 'react';
import { Job } from '@/hooks/useLocalStorage';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EditableCellProps {
  job: Job;
  field: string;
  roles: string[];
  onUpdate: (field: string, value: any) => void;
}

const progressOptions = ["Prospecting", "Applied", "Interviewing", "Offer", "Rejected", "Accepted"] as const;

const progressColors: Record<typeof progressOptions[number], string> = {
  Prospecting: 'bg-muted text-muted-foreground border border-border hover:bg-primary/10 transition-colors',
  Applied: 'bg-primary/15 text-primary border border-primary/30 hover:bg-primary/20 transition-colors',
  Interviewing: 'bg-warning/15 text-warning-foreground border border-warning/30 hover:bg-primary/10 transition-colors',
  Offer: 'bg-success/15 text-success border border-success/30 hover:bg-primary/10 transition-colors',
  Rejected: 'bg-destructive/15 text-destructive border border-destructive/30 hover:bg-primary/10 transition-colors',
  Accepted: 'bg-success/20 text-success border border-success/40 hover:bg-primary/10 transition-colors'
};

export function EditableCell({ job, field, roles, onUpdate }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<any>(job[field as keyof Job]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(job[field as keyof Job]);
  }, [job, field]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== job[field as keyof Job]) {
      onUpdate(field, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setValue(job[field as keyof Job]);
      setIsEditing(false);
    }
  };

  const renderContent = () => {
    const cellValue = job[field as keyof Job];

    if (field === 'createdAt') {
      return (
        <td className="px-4 py-3 text-sm text-muted-foreground">
          {new Date(cellValue as string).toLocaleDateString()}
        </td>
      );
    }

    if (field === 'link') {
      return (
        <td className="px-4 py-3" onDoubleClick={() => setIsEditing(true)}>
          {isEditing ? (
            <Input
              ref={inputRef}
              value={value || ''}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="h-8 bg-input border-border text-foreground"
            />
          ) : cellValue ? (
            <a
              href={cellValue as string}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm"
            >
              Link <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </td>
      );
    }

    if (field === 'desirability') {
      return (
        <td className="px-4 py-3" onDoubleClick={() => setIsEditing(true)}>
          {isEditing ? (
            <Input
              ref={inputRef}
              type="number"
              min="1"
              max="5"
              value={value || ''}
              onChange={(e) => setValue(Math.min(5, Math.max(1, Number(e.target.value))))}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="h-8 w-20 bg-input border-border text-foreground"
            />
          ) : (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= (cellValue as number) ? 'fill-warning text-warning' : 'text-muted'}`}
                />
              ))}
            </div>
          )}
        </td>
      );
    }

    if (field === 'salaryMin' || field === 'salaryMax') {
      const isInvalid = field === 'salaryMax' && 
        job.salaryMin !== null && 
        job.salaryMax !== null && 
        job.salaryMax < job.salaryMin;

      return (
        <td className="px-4 py-3" onDoubleClick={() => setIsEditing(true)}>
          {isEditing ? (
            <Input
              ref={inputRef}
              type="number"
              value={value || ''}
              onChange={(e) => setValue(e.target.value ? Number(e.target.value) : null)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="h-8 w-32 bg-input border-border text-foreground"
            />
          ) : cellValue !== null ? (
            <span className={`text-sm ${isInvalid ? 'text-destructive' : 'text-foreground'}`}>
              ${Number(cellValue).toLocaleString()}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </td>
      );
    }

    if (field === 'role') {
      return (
        <td className="px-4 py-3">
          <Select
            value={cellValue as string}
            onValueChange={(val) => onUpdate(field, val)}
            disabled={roles.length === 0}
          >
            <SelectTrigger className="h-8 bg-input border-border text-foreground">
              <SelectValue placeholder={roles.length === 0 ? "Add roles first" : "Select role"} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {roles.map(role => (
                <SelectItem key={role} value={role} className="text-foreground">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
      );
    }

    if (field === 'progress') {
      return (
        <td className="px-4 py-3">
          <Select
            value={cellValue as string}
            onValueChange={(val) => onUpdate(field, val)}
          >
            <SelectTrigger className="h-8 bg-input border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {progressOptions.map(status => (
                <SelectItem key={status} value={status} className="text-foreground">
                  <Badge className={progressColors[status]}>
                    {status}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
      );
    }

    if (field === 'keywords') {
      return (
        <td className="px-4 py-3" onDoubleClick={() => setIsEditing(true)}>
          {isEditing ? (
            <Input
              ref={inputRef}
              value={Array.isArray(value) ? value.join(', ') : value}
              onChange={(e) => setValue(e.target.value.split(/[,\s]+/).filter(Boolean))}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="tag1, tag2, tag3"
              className="h-8 bg-input border-border text-foreground"
            />
          ) : (
            <div className="flex flex-wrap gap-1">
              {Array.isArray(cellValue) && cellValue.length > 0 ? (
                cellValue.map((kw, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                    {kw}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">-</span>
              )}
            </div>
          )}
        </td>
      );
    }

    return (
      <td className="px-4 py-3" onDoubleClick={() => setIsEditing(true)}>
        {isEditing ? (
          <Input
            ref={inputRef}
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="h-8 bg-input border-border text-foreground"
          />
        ) : (
          <span className="text-sm text-foreground">{cellValue || '-'}</span>
        )}
      </td>
    );
  };

  return renderContent();
}
