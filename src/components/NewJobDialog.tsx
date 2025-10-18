import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job } from '@/hooks/useLocalStorage';
import { Star } from 'lucide-react';

interface NewJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: string[];
  onSubmit: (job: Omit<Job, 'id' | 'createdAt'>) => void;
}

const progressOptions = ["Prospecting", "Applied", "Interviewing", "Offer", "Rejected", "Accepted"] as const;

export function NewJobDialog({ open, onOpenChange, roles, onSubmit }: NewJobDialogProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    link: '',
    desirability: 3,
    salaryMin: '',
    salaryMax: '',
    role: roles[0] || '',
    keywords: '',
    progress: 'Prospecting' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName.trim()) {
      return;
    }

    onSubmit({
      companyName: formData.companyName,
      link: formData.link,
      desirability: formData.desirability,
      salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
      salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      role: formData.role,
      keywords: formData.keywords.split(/[,\s]+/).filter(Boolean),
      progress: formData.progress
    });

    // Reset form
    setFormData({
      companyName: '',
      link: '',
      desirability: 3,
      salaryMin: '',
      salaryMax: '',
      role: roles[0] || '',
      keywords: '',
      progress: 'Prospecting'
    });
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Reset form on cancel
    setFormData({
      companyName: '',
      link: '',
      desirability: 3,
      salaryMin: '',
      salaryMax: '',
      role: roles[0] || '',
      keywords: '',
      progress: 'Prospecting'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Job Application</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details for your job application. All fields except Company Name are optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-foreground">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Enter company name"
              className="bg-input border-border text-foreground"
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin" className="text-foreground">Salary Min</Label>
              <Input
                id="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                placeholder="0"
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryMax" className="text-foreground">Salary Max</Label>
              <Input
                id="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                placeholder="0"
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-foreground">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(val) => setFormData({ ...formData, role: val })}
              disabled={roles.length === 0}
            >
              <SelectTrigger id="role" className="bg-input border-border text-foreground">
                <SelectValue placeholder={roles.length === 0 ? "Add roles in sidebar first" : "Select role"} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {roles.map(role => (
                  <SelectItem key={role} value={role} className="text-foreground">
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-border text-foreground hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Add Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
