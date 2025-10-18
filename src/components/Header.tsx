import { Button } from '@/components/ui/button';

interface HeaderProps {
  // Header is now just displaying the title
}

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-foreground">Job Tracker</h1>
    </header>
  );
}
