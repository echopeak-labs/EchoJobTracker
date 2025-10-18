import { Plus, X, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { toast } from 'sonner';

interface HeaderProps {
  onNewRow: () => void;
  onClearFilters: () => void;
  onExport: () => string;
  onImport: (data: string) => boolean;
}

export function Header({ onNewRow, onClearFilters, onExport, onImport }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = onExport();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-tracker-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = onImport(content);
        if (success) {
          toast.success('Data imported successfully');
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        toast.error('Failed to import data');
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Job Tracker</h1>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="border-border text-foreground hover:bg-secondary"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="border-border text-foreground hover:bg-secondary"
        >
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="border-border text-foreground hover:bg-secondary"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import JSON
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <Button
          onClick={onNewRow}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Row
        </Button>
      </div>
    </header>
  );
}
