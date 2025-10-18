import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Job } from '@/hooks/useLocalStorage';
import { Star, Plus } from 'lucide-react';

interface NewJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: string[];
  minDesiredSalary: number;
  onSubmit: (job: Omit<Job, 'id' | 'createdAt'>) => void;
  onAddRole: (role: string) => void;
}

const progressOptions = ["Prospecting", "Applied", "Interviewing", "Offer", "Rejected", "Accepted"] as const;

export function NewJobDialog({ open, onOpenChange, roles, minDesiredSalary = 0, onSubmit, onAddRole }: NewJobDialogProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    link: '',
    desirability: 3,
    salaryRange: [minDesiredSalary || 0, 500000],
    role: roles[0] || '',
    keywords: '',
    progress: 'Prospecting' as const
  });
  const [newRole, setNewRole] = useState('');

  // Update salary range minimum when dialog opens or minDesiredSalary changes
  useEffect(() => {
    if (open) {
      const minSalary = minDesiredSalary || 0;
      const maxSalary = Math.min(minSalary * 2, 500000); // Double the min, capped at 500k
      setFormData(prev => ({
        ...prev,
        salaryRange: [minSalary, maxSalary]
      }));
    }
  }, [open, minDesiredSalary]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName.trim()) {
      return;
    }

    onSubmit({
      companyName: formData.companyName,
      link: formData.link,
      desirability: formData.desirability,
      salaryMin: formData.salaryRange[0] === 0 ? null : formData.salaryRange[0],
      salaryMax: formData.salaryRange[1] === 500000 ? null : formData.salaryRange[1],
      role: formData.role,
      keywords: formData.keywords.split(/[,\s]+/).filter(Boolean),
      progress: formData.progress
    });

    // Reset form
    setFormData({
      companyName: '',
      link: '',
      desirability: 3,
      salaryRange: [minDesiredSalary || 0, 500000],
      role: roles[0] || '',
      keywords: '',
      progress: 'Prospecting'
    });
    setNewRole('');
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form on cancel
    setFormData({
      companyName: '',
      link: '',
      desirability: 3,
      salaryRange: [minDesiredSalary || 0, 500000],
      role: roles[0] || '',
      keywords: '',
      progress: 'Prospecting'
    });
    setNewRole('');
    onOpenChange(false);
  };

  const handleAddRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      onAddRole(newRole.trim());
      setFormData({ ...formData, role: newRole.trim() });
      setNewRole('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col bg-card/90 backdrop-blur-md border-2 border-primary text-foreground neon-glow-pink">
        <DialogHeader>
          <DialogTitle className="text-foreground font-black text-xl tracking-wider uppercase neon-text-pink">
            Add New Job Application
          </DialogTitle>
          <DialogDescription className="text-accent font-medium">
            Fill in the details for your job application. All fields except Company Name are optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div className="space-y-4">{/* ... rest of form fields ... */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-accent font-bold tracking-wide uppercase text-xs">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Enter company name"
              className="bg-input border-2 border-secondary text-foreground font-bold focus:border-primary transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link" className="text-foreground">Link</Label>
            <Input
              id="link"
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://..."
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="desirability" className="text-foreground">
              Desirability (1-5)
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="desirability"
                type="number"
                min="1"
                max="5"
                value={formData.desirability}
                onChange={(e) => setFormData({ ...formData, desirability: Math.min(5, Math.max(1, Number(e.target.value))) })}
                className="w-20 bg-input border-border text-foreground"
              />
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`h-5 w-5 cursor-pointer transition-colors ${
                      star <= formData.desirability ? 'fill-warning text-warning' : 'text-muted'
                    }`}
                    onClick={() => setFormData({ ...formData, desirability: star })}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-accent font-bold tracking-wide uppercase text-xs">Salary Range</Label>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-primary neon-text-pink">
                ${(formData.salaryRange?.[0] ?? 0).toLocaleString()}
              </span>
              <span className="text-sm font-bold text-secondary neon-text-pink">
                ${(formData.salaryRange?.[1] ?? 500000).toLocaleString()}
              </span>
            </div>
            <Slider
              min={0}
              max={500000}
              step={10000}
              value={formData.salaryRange || [0, 500000]}
              onValueChange={(value) => setFormData({ ...formData, salaryRange: value as [number, number] })}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-foreground">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(val) => setFormData({ ...formData, role: val })}
              disabled={roles.length === 0}
            >
              <SelectTrigger id="role" className="bg-input border-border text-foreground">
                <SelectValue placeholder={roles.length === 0 ? "Add a role below" : "Select role"} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {roles.map(role => (
                  <SelectItem key={role} value={role} className="text-foreground">
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2 mt-2">
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
                placeholder="Add new role..."
                className="bg-input border-border text-foreground"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleAddRole}
                className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 neon-glow-cyan transition-all hover:scale-110"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-foreground">Keywords</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="React, TypeScript, Remote (comma or space separated)"
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress" className="text-foreground">Progress</Label>
            <Select
              value={formData.progress}
              onValueChange={(val) => setFormData({ ...formData, progress: val as typeof formData.progress })}
            >
              <SelectTrigger id="progress" className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {progressOptions.map(status => (
                  <SelectItem key={status} value={status} className="text-foreground">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-card/90 backdrop-blur-sm pb-2 border-t-2 border-border/50 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-2 border-accent text-foreground hover:bg-accent/20 font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold neon-glow-pink"
            >
              Add Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
