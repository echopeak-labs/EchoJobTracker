import { useState } from 'react';
import { Plus, X, Edit2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface SidebarProps {
  roles: string[];
  jobs: Array<{ role: string }>;
  selectedRoles: string[];
  searchQuery: string;
  minDesiredSalary: number;
  onAddRole: (role: string) => void;
  onUpdateRole: (oldRole: string, newRole: string) => void;
  onDeleteRole: (role: string) => void;
  onToggleRole: (role: string) => void;
  onSearchChange: (query: string) => void;
  onMinDesiredSalaryChange: (salary: number) => void;
  onOpenNewJobDialog: () => void;
}

export function Sidebar({
  roles,
  jobs,
  selectedRoles,
  searchQuery,
  minDesiredSalary,
  onAddRole,
  onUpdateRole,
  onDeleteRole,
  onToggleRole,
  onSearchChange,
  onMinDesiredSalaryChange,
  onOpenNewJobDialog
}: SidebarProps) {
  const [newRole, setNewRole] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddRole = () => {
    if (newRole.trim()) {
      onAddRole(newRole.trim());
      setNewRole('');
    }
  };

  const handleStartEdit = (role: string) => {
    setEditingRole(role);
    setEditValue(role);
  };

  const handleSaveEdit = (oldRole: string) => {
    if (editValue.trim() && editValue !== oldRole) {
      onUpdateRole(oldRole, editValue.trim());
    }
    setEditingRole(null);
  };

  const getRoleCount = (role: string) => {
    return jobs.filter(j => j.role === role).length;
  };

  return (
    <div className="w-80 bg-sidebar/80 backdrop-blur-md border-r-2 border-sidebar-border flex flex-col h-full neon-glow-purple">
      <div className="p-6 border-b-2 border-sidebar-border space-y-4">
        <Button
          onClick={onOpenNewJobDialog}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wide neon-glow-pink transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          NEW ROW
        </Button>

        <div>
          <h2 className="text-sm font-bold text-accent mb-3 tracking-widest uppercase neon-text-cyan">Search</h2>
          <Input
            placeholder="Filter by keyword, company, role..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-sidebar-accent border-2 border-accent text-sidebar-foreground placeholder:text-muted-foreground focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h2 className="text-sm font-bold text-primary mb-3 tracking-widest uppercase neon-text-pink">Minimum Desired Salary</h2>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-accent font-bold">$</span>
            <Input
              type="number"
              min={0}
              step={10000}
              value={minDesiredSalary}
              onChange={(e) => onMinDesiredSalaryChange(Number(e.target.value))}
              placeholder="0"
              className="bg-sidebar-accent border-2 border-secondary text-sidebar-foreground pl-7 focus:border-primary transition-colors font-bold"
            />
          </div>
          <p className="text-xs text-accent mt-1 font-medium">
            Sets the default minimum for new applications
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-bold text-secondary mb-3 tracking-widest uppercase neon-text-pink">Roles</h2>
          
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add new role..."
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddRole()}
              className="bg-sidebar-accent border-2 border-secondary text-sidebar-foreground placeholder:text-muted-foreground focus:border-primary transition-colors"
            />
            <Button 
              size="icon" 
              onClick={handleAddRole}
              className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 neon-glow-cyan transition-all hover:scale-110"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {roles.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Add roles to organize your applications
            </p>
          ) : (
            <div className="space-y-2">
              {roles.map(role => (
                <div
                  key={role}
                  className="flex items-center gap-2 p-2 rounded bg-sidebar-accent/50 hover:bg-sidebar-accent border-2 border-transparent hover:border-accent transition-all group"
                >
                  <Checkbox
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => onToggleRole(role)}
                    className="border-sidebar-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  
                  {editingRole === role ? (
                    <>
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(role);
                          if (e.key === 'Escape') setEditingRole(null);
                        }}
                        className="flex-1 h-7 bg-sidebar border-sidebar-border text-sidebar-foreground"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleSaveEdit(role)}
                        className="h-7 w-7 text-success hover:text-success hover:bg-success/10"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-sidebar-foreground truncate">
                        {role}
                      </span>
                      <Badge variant="secondary" className="bg-sidebar border-sidebar-border text-sidebar-foreground">
                        {getRoleCount(role)}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEdit(role)}
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-sidebar-foreground"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDeleteRole(role)}
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
